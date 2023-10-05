import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';
const mime = require('mime-types');

// Load AWS credentials from environment variables
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const RUN_ID = process.env.RUN_ID;
const BASE_FOLDER_PATH = './playwright-report';

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !BUCKET_NAME || !BASE_FOLDER_PATH) {
    console.error('Missing required environment variables.');
    process.exit(1);
}

const s3 = new AWS.S3({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    region: AWS_REGION,
});

for (const item of fs.readdirSync(BASE_FOLDER_PATH)) {
    // Call the function to upload the base folder and its subfolders to S3
    uploadFolderToS3(BASE_FOLDER_PATH);
}

async function uploadFolderToS3(folderPath: string) {
    try {
        // Get a list of all files and subdirectories in the current folder
        const items = fs.readdirSync(folderPath);

        // Upload each item to S3
        for (const item of items) {
            const itemPath = path.join(folderPath, item);
            const itemStat = fs.statSync(itemPath);
            console.log(itemPath);

            if (itemStat.isFile()) {
                // If it's a file, upload it to S3
                const fileContent = fs.readFileSync(itemPath);
                const s3Key = path.relative(BASE_FOLDER_PATH, itemPath).replace(/\\/g, '/');
                await s3
                    .upload({
                        Bucket: BUCKET_NAME,
                        Key: RUN_ID + "/" + s3Key,
                        Body: fileContent,
                        ContentType: mime.lookup(itemPath) || undefined,
                    })
                    .promise();

                console.log(`Uploaded ${s3Key} to S3.`);
            } else if (itemStat.isDirectory()) {
                // If it's a directory, recursively upload its contents
                await uploadFolderToS3(itemPath);
            }
        }

        console.log(`Folder upload completed for ${folderPath}.`);
    } catch (error) {
        console.error(`Error uploading folder ${folderPath} to S3:`, error);
    }
}
