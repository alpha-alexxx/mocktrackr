// /app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { uploadFileToCloudinary } from '@/lib/cloudinary';

import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Ensure this runs in a Node environment so we can use fs, path, etc.
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
    try {
        // 1️⃣ Parse multipart form
        const formData = await req.formData();

        // 2️⃣ Get the uploaded file
        const fileField = formData.get('file');
        if (!fileField || !(fileField instanceof File)) {
            console.error('[UploadRoute] No valid "file" field found');

            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 3️⃣ Read it into a Buffer
        const arrayBuffer = await fileField.arrayBuffer();

        // 4️⃣ Write to a temp file
        const tempDir = path.join(process.cwd(), 'public', 'uploads', 'tmp');
        await fs.mkdir(tempDir, { recursive: true });
        const tempFilename = `${uuidv4()}_${fileField.name}`;
        const tempFilePath = path.join(tempDir, tempFilename);
        await fs.writeFile(tempFilePath, Buffer.from(arrayBuffer));

        // 5️⃣ Extract other fields (e.g. userId)
        const userId = formData.get('userId') as string | null;

        // 6️⃣ Upload to Cloudinary
        const cloudinaryResult = await uploadFileToCloudinary(tempFilePath, userId || undefined);

        // 7️⃣ Clean up temp file
        await fs.unlink(tempFilePath);

        // 8️⃣ Respond with the Cloudinary info
        return NextResponse.json({
            ...cloudinaryResult,
            url: cloudinaryResult.secure_url,
            public_id: cloudinaryResult.public_id,
            resource_type: cloudinaryResult.resource_type
        });
    } catch (err) {
        console.error('[UploadRoute] Error:', err);
        const message = err instanceof Error ? err.message : 'Unknown error';

        return NextResponse.json({ error: message }, { status: 500 });
    }
}
