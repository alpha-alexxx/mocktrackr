import React, { useCallback, useState } from 'react';

import getCroppedImg from '@/lib/get-cropped-img';

import { Input } from '../ui/input';
import { Label } from '../ui/label';
import axios, { type AxiosProgressEvent } from 'axios';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';

// Ensure you implement this utility
const AvatarUploader = ({ children }: { children: React.ReactNode }) => {
    // Local state declarations
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [error, setError] = useState<string>('');

    // Handle file input change event
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result as string);
            });
            reader.readAsDataURL(file);
        }
    };

    // Called when cropping is complete: retrieves pixel area of cropped image
    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    // Handles the upload process
    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            setLoading(true);
            setError('');
            setUploadProgress(0);

            // Get the cropped image blob using the cropping utility
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (!croppedImageBlob) {
                throw new Error('Failed to crop image');
            }

            // Prepare FormData to send the file. Adjust file name as needed.
            const formData = new FormData();
            formData.append('file', croppedImageBlob, 'avatar.jpg');
            // Uncomment if you want to send additional information:
            // formData.append('userId', 'YOUR_USER_ID');
            // formData.append('customFileName', 'user_avatar');

            // Post the FormData to your /api/upload endpoint using axios
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    if (progressEvent.total) {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(progress);
                    }
                }
            });

            console.log('Upload response:', response.data);
            // Optionally, update your avatar image or UI state with response.data.url
        } catch (err: unknown) {
            // Use type-guard to extract error message
            if (err instanceof Error) {
                console.error(err);
                setError(err.message || 'Upload failed');
            } else {
                setError('Upload failed');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='avatar-uploader rounded border p-4'>
            {error && <p className='mb-2 text-red-500'>{error}</p>}
            {children ? (
                <>
                    {children}
                    <Label
                        className='mb-2 block text-sm font-medium text-gray-900 dark:text-white'
                        htmlFor='file_input'>
                        Upload Avatar
                    </Label>
                    <Input
                        className='block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400'
                        aria-describedby='file_input_help'
                        id='file_input'
                        type='file'
                        accept='image/*'
                        onChange={onFileChange}
                    />
                    <p className='mt-1 text-sm text-gray-500 dark:text-gray-300' id='file_input_help'>
                        SVG, PNG, JPG or GIF (MAX. 800x400px).
                    </p>
                </>
            ) : (
                <input type='file' accept='image/*' onChange={onFileChange} className='mb-4 block' />
            )}
            {imageSrc && (
                <>
                    <div className='relative mb-4 h-72 w-72'>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1} // Square aspect ratio for avatar cropping
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>

                    <div className='mb-4'>
                        <label htmlFor='zoomRange' className='mb-1 block'>
                            Zoom:
                        </label>
                        <input
                            id='zoomRange'
                            type='range'
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className='w-full'
                        />
                    </div>
                </>
            )}

            {imageSrc && (
                <button
                    onClick={handleUpload}
                    disabled={loading}
                    className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'>
                    {loading ? `Uploading... ${uploadProgress}%` : 'Upload Avatar'}
                </button>
            )}
        </div>
    );
};

export default AvatarUploader;
