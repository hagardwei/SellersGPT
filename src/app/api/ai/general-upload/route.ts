import { NextResponse, NextRequest } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import Papa from 'papaparse';
import * as XLSX from 'xlsx'
import { Success } from 'node_modules/@payloadcms/ui/dist/providers/ToastContainer/icons/Success';

export async function POST(req: NextRequest) {
    const payload = await getPayload({ config: configPromise });

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if(!file) {
        return NextResponse.json({ error: 'File required' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let keywords: any[] = [];


    if(file.name.endsWith('.csv')) {
        const parsed = Papa.parse(buffer.toString(), {
            skipEmptyLines: true,
        });
        keywords = parsed.data.flat();
    } else if(file.name.endsWith('xlsx') || file.name.endsWith('.xls')) {
        const workbook = XLSX.read(buffer);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, {header: 1 });
        keywords = rows.flat();
    } else {
        return NextResponse.json({ error: 'Invalid file type' },  { status: 400})
    }

    // Clean + deduplicate
    keywords = [...new Set(
        keywords
           .map(k => String(k).trim())
           .filter(Boolean)
    )];

    if(keywords.length === 0){
        return NextResponse.json({ error: 'No keywords found in file' }, { status: 400 });
    }

    const parentJob = await payload.create({
        collection: 'ai-jobs',
        data: {
            type: 'BULK_KEYWORD_GENERATION',
            status: 'pending',
            total_keywords: keywords.length,
            processed_keywords: 0,
            input_payload: {
                keywords,
                language: 'en',
                publishImmediately: true,
                triggerSocial: false,
                autoTranslate: true
            }

        }
    });
    return NextResponse.json({ success: true, jobId: parentJob.id });
}