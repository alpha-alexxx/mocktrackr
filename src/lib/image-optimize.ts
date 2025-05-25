import sharp from 'sharp';

type OptimizeOptions = {
    requiredSizeKB?: number; // Target size in KB
    mimeType?: 'image/jpeg' | 'image/webp';
    quality?: number;
    minHeight?: number;
};

/**
 * Compresses and resizes an image buffer based on constraints.
 */
export async function optimizeImage(buffer: Buffer, options: OptimizeOptions = {}): Promise<Buffer> {
    const { requiredSizeKB = 100, mimeType = 'image/jpeg', quality = 80, minHeight = 300 } = options;

    let optimizedBuffer = buffer;

    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Resize if needed
    if (metadata.height && metadata.height < minHeight) {
        const scale = minHeight / metadata.height;
        await image.resize({
            height: minHeight,
            width: Math.round((metadata.width || 0) * scale),
            fit: 'inside'
        });
    }

    const format = mimeType === 'image/webp' ? 'webp' : 'jpeg';

    // Try reducing quality until size fits
    for (let q = quality; q >= 40; q -= 5) {
        const output = await image.clone()[format]({ quality: q }).toBuffer();

        if (output.length / 1024 <= requiredSizeKB) {
            optimizedBuffer = output;
            break;
        }

        // Store the last attempt in case we don't hit the target
        optimizedBuffer = output;
    }

    return optimizedBuffer;
}
