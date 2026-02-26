const { S3Client, ListObjectsV2Command, GetObjectCommand, DeleteObjectCommand, PutObjectCommand, ListBucketsCommand } = require("@aws-sdk/client-s3");
// const fetch = require("node-fetch");
require("dotenv").config();

const s3 = new S3Client({
    endpoint: process.env.DO_SPACES_ENDPOINT,
    region: process.env.DO_SPACES_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY!,
        secretAccessKey: process.env.DO_SPACES_SECRET!,
    },
});

const BUCKET = process.env.DO_SPACES_BUCKET!;
const POLL_INTERVAL = Number(process.env.POLL_INTERVAL || 10000);

async function streamToString(stream: any): Promise<string> {
    return await new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on("data", (chunk: any) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => 
            resolve(Buffer.concat(chunks).toString("utf-8"))
        );
    });
}

async function processFile(key: string) {
    console.log(`processing: ${key}`);

    //Download File
    const getCommand = new GetObjectCommand({
        Bucket: BUCKET,
        Key: key,
    });

    const response = await s3.send(getCommand);
    const body = await streamToString(response.Body);

    const payload = JSON.parse(body);

    // Send to Agent Workspace
    const apiResponse = await fetch(process.env.AGENT_WORKSPACE_API_URL!, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.AGENT_WORKSPACE_TOKEN}`,
        },
        body: JSON.stringify(payload),
    });

    if(!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(
            `Agent Workspace error ${apiResponse.status}: ${errorText}`
        );
    }

    console.log(`Synced successfully: ${key}`);

    // 3️⃣ Delete file after successful sync (Optional)
    // await s3.send(
    //     new DeleteObjectCommand({
    //     Bucket: BUCKET,
    //     Key: key,
    //     })
    // );

    // console.log(`Deleted from Spaces: ${key}`);
}

async function poll() {
    try {
        const listCommand = new ListObjectsV2Command({
            Bucket: BUCKET,
            Prefix: "sync/"
        });

        const data = await s3.send(listCommand);

        if(!data.Contents || data.Contents.length === 0) {
            console.log("No files to process.");
            return;
        }

        for (const item of data.Contents) {
            if(item.Key) {
                try {
                    await processFile(item.Key);
                } catch (err: any) {
                    console.error(`Failed processing ${item.Key}:`, err.message);
                }
            }
        }
    } catch (err: any) {
          console.error("Polling error:", err.message);
    }
} 

console.log("Worker started...");

setInterval(poll, POLL_INTERVAL);