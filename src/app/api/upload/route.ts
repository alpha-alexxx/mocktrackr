import { NextResponse } from 'next/server';

import { uploadFileToCloudinary } from '@/lib/cloudinary';

import { type Fields, type Files, type File as FormidableFile, IncomingForm } from 'formidable';
import fs from 'fs/promises';
import { IncomingMessage } from 'http';
import path from 'path';

/**
 * Parses a multipart form using formidable.
 *
 * @param req - Request object from Next.js App Router.
 * @returns A promise that resolves to an object containing fields and files.
 */

const parseForm = async (req: Request): Promise<{ fields: Fields; files: Files }> => {
    return new Promise((resolve, reject) => {
        const form = new IncomingForm({
            uploadDir: path.join(process.cwd(), 'public/uploads/tmp'),
            keepExtensions: true,
            maxFileSize: 5 * 1024 * 1024 // 5 MB
        });

        // Cast the Web API Request to Node's IncomingMessage for Formidable.
        form.parse(req as unknown as IncomingMessage, (err, fields, files) => {
            if (err) return reject(err);
            resolve({ fields, files });
        });
    });
};

export async function POST(req: Request) {
    try {
        // Parse the incoming form data.
        const { fields, files } = await parseForm(req);

        // Ensure a file is provided; expecting the form field "file".
        if (!files.file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Handle the possibility that files.file is an array.
        const fileData = Array.isArray(files.file) ? files.file[0] : (files.file as FormidableFile);

        const filePath = fileData.filepath;
        if (!filePath) {
            return NextResponse.json({ error: 'File path not found' }, { status: 400 });
        }

        // Optionally extract additional fields (userId, customFileName) from the form.
        const { userId } = fields;

        // Upload the file to Cloudinary using our utility.
        const cloudinaryResult = await uploadFileToCloudinary(filePath, userId as string | undefined);

        // Delete the temporary file.
        await fs.unlink(filePath);

        // Respond with the Cloudinary upload result.
        return NextResponse.json({
            ...cloudinaryResult,
            url: cloudinaryResult.secure_url,
            public_id: cloudinaryResult.public_id,
            resource_type: cloudinaryResult.resource_type
        });
    } catch (error) {
        console.error('Upload error:', error);

        return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}
