import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Configure Cloudinary with environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!
});

/**
 * Determines the folder based on file extension.
 *
 * @param filePath - The local path of the file.
 * @returns The folder name based on detected file type.
 */

const detectFolder = (filePath: string): string => {
    const ext = path.extname(filePath).toLowerCase();

    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const videoExtensions = ['.mp4', '.mov', '.mkv', '.avi', '.wmv'];
    const musicExtensions = ['.mp3', '.wav', '.aac'];
    const documentExtensions = ['.pdf', '.doc', '.docx', '.txt', '.ppt', '.pptx'];

    if (imageExtensions.includes(ext)) {
        return 'images';
    } else if (videoExtensions.includes(ext)) {
        return 'videos';
    } else if (musicExtensions.includes(ext)) {
        return 'music';
    } else if (documentExtensions.includes(ext)) {
        return 'documents';
    } else {
        return 'others';
    }
};

/**
 * Generates a custom file name using crypto.
 *
 * @param filePath - The local file path (to extract the file extension).
 * @param userId - Optional user identifier to prepend.
 * @param customFileName - Optional custom file name override.
 * @returns A unique file name string.
 */
const generateCustomFileName = (filePath: string, userId?: string): string => {
    const uniqueString = uuidv4();
    // If an explicit custom file name is provided, use it.

    // Build the file name combining an optional userId, unique string, and original extension.
    return userId ? userId : uniqueString;
};

/**
 * Uploads a file to Cloudinary with dynamic folder routing and optional custom file naming.
 *
 * @param filePath - The path of the file to upload.
 * @param userId - (Optional) ID of the user to associate with the file.
 * @param customFileName - (Optional) Custom file name, if provided it will override the auto-generated name.
 * @param options - Additional options for Cloudinary uploader.
 * @returns A promise resolving to Cloudinary's upload response.
 */

export const uploadFileToCloudinary = async (
    filePath: string,
    userId?: string,
    options: Partial<UploadApiOptions> = {}
) => {
    try {
        // Determine folder based on file extension.
        const folder = detectFolder(filePath);

        // Generate a default public ID if a custom file name is not provided.
        // The public ID includes the folder, user id, and current timestamp.
        const fileName = generateCustomFileName(filePath, userId);

        // Upload to Cloudinary; 'resource_type' is set to 'auto' to handle any file type.
        const result = await cloudinary.uploader.upload(filePath, {
            folder, // dynamically derived folder (images, videos, etc.)
            public_id: fileName,
            resource_type: 'auto',
            ...options
        });

        return result;
    } catch (error) {
        console.log({ error });
        // Consider enhancing this error block with logging mechanisms for production-grade apps.
        throw new Error(`Cloudinary Upload Error: ${(error as Error).message}`);
    }
};
