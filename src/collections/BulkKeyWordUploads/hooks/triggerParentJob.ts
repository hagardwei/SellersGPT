import { CollectionAfterChangeHook } from "payload";
import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx'
import { aiJobQueue } from "@/lib/redis";

export const triggerParentJob: CollectionAfterChangeHook = async ({
    doc,
    req,
    operation
}) => {
    if (operation === 'create' && doc.file) {
        const payload = req.payload;
        try {
            // Fetch the uploaded file info
            const uploadedFile = await payload.findByID({
                collection: 'media',
                id: String(doc.file),
            });

            if (!uploadedFile?.filename) {
                throw new Error('Uploaded file not found');
            }

            // 2️⃣ Build correct absolute file path
            const filePath = path.resolve(
                process.cwd(),
                'public/media',
                uploadedFile.filename
            );

            // 3️⃣ Ensure file exists
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found at ${filePath}`);
            }

            // 4️⃣ Read file buffer
            const fileBuffer = fs.readFileSync(filePath);

            const extension = uploadedFile.filename
                .split(".")
                .pop()
                ?.toLowerCase();

            // Parse XLSX/CSV
            const workbook = extension === "csv" ? XLSX.read(fileBuffer.toString(), { type: "string" }) : XLSX.read(fileBuffer, { type: "buffer" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            const keywords = [
                ...new Set(
                    rows
                        .flat()
                        .map((k: any) => String(k).trim())
                        .filter(Boolean)
                ),
            ];

            if (!keywords.length) {
                throw new Error("No keywords found in file");
            }

            //Create parent AI job in payload
            const parentJob = await payload.create({
                collection: 'ai-jobs',
                data: {
                    type: 'BULK_KEYWORD_GENERATION',
                    status: 'pending',
                    total_keywords: keywords.length,
                    processed_keywords: 0,
                    completion_percentage: 0,
                    input_payload: { keywords, language: 'en', publishImmediately: true, autoTranslate: true, triggerSocial: false },
                    step: 'PENDING',
                    createdAt: new Date().toISOString()
                },
            });


            console.log("Document to create: ", doc)

            //Update the upload doc with tracking info
            await payload.update({
                collection: 'bulk-keyword-uploads',
                where: {
                    id: {
                        equals: doc.id,
                    },
                },
                data: {
                    fileName: uploadedFile?.filename,
                    totalKeywords: keywords.length,
                    parentJobId: String(parentJob.id),
                    status: 'processing',
                },
            });
            // After creating the parent job
            await aiJobQueue.add('ai-jobs', { aiJobId: parentJob.id });

        } catch (error) {
            console.log(error)
            await payload.update({
                collection: "bulk-keyword-uploads",
                where: {
                    id: {
                        equals: doc.id,
                    },
                },
                data: { status: "failed" },
            });

            throw error;
        }
    }
}