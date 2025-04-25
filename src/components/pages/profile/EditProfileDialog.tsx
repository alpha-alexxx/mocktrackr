'use client';

import { useCallback, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/authentication/auth-client';
import { ExtendedUser } from '@/lib/authentication/auth-types';
import getCroppedImg from '@/lib/get-cropped-img';
import { zodResolver } from '@hookform/resolvers/zod';

import axios, { type AxiosProgressEvent } from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Loader, Upload, X } from 'lucide-react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const editProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    avatar: z.string().optional().nullable()
});

interface InfoType {
    title: string;
    description: string;
    icon: typeof CheckCircle | typeof AlertCircle;
    color: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const animationVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    iconContainer: {
        initial: { scale: 0 },
        animate: { scale: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } }
    },
    content: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { delay: 0.2 } }
    }
};

interface EditProfileDialogProps {
    children: React.ReactNode;
    user: ExtendedUser;
}

export function EditProfileDialog({ children, user }: EditProfileDialogProps) {
    // Main dialog state
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState<InfoType | null>(null);

    // Avatar state
    const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.image || null);

    // Cropper dialog state
    const [cropperDialogOpen, setCropperDialogOpen] = useState(false);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploading, setUploading] = useState<boolean>(false);
    const [avatarError, setAvatarError] = useState<string>('');

    const form = useForm({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: user?.name || '',
            avatar: user?.image || null
        }
    });

    const resetForm = () => {
        form.reset({
            name: user?.name || '',
            avatar: user?.image || null
        });
        setAvatarUrl(user?.image || null);
        resetCropperState();
    };

    const resetCropperState = () => {
        setImageSrc(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setCroppedAreaPixels(null);
        setUploadProgress(0);
        setUploading(false);
        setAvatarError('');
        setCropperDialogOpen(false);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            toast.error('File too large', {
                description: 'Please select an image under 5MB'
            });

            return;
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toast.error('Invalid file type', {
                description: 'Please select a valid image file (jpg, jpeg, png, webp)'
            });

            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageSrc(reader.result as string);
            setCropperDialogOpen(true);
        };
        reader.readAsDataURL(file);

        // Reset the input value so the same file can be selected again
        e.target.value = '';
    };

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        try {
            if (!user?.id) throw new Error('User ID is missing');

            setUploading(true);
            setAvatarError('');
            setUploadProgress(0);

            // Crop the image
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            if (!croppedImageBlob) throw new Error('Failed to crop image');

            // Convert to File with proper type
            const avatarFile = new File([croppedImageBlob], 'avatar.jpg', {
                type: croppedImageBlob.type || 'image/jpeg'
            });

            // Prepare FormData
            const formData = new FormData();
            formData.append('file', avatarFile);
            formData.append('userId', user.id);

            // Upload to server
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

            // Handle server response
            const imageUrl = response.data?.url;
            if (imageUrl) {
                setAvatarUrl(imageUrl);
                form.setValue('avatar', imageUrl);
                toast.success('Avatar uploaded successfully!');
                setCropperDialogOpen(false); // Close cropper dialog after successful upload
            } else {
                throw new Error('No URL returned from server');
            }
        } catch (err: unknown) {
            const errorMessage =
                axios.isAxiosError(err) && err.response?.data?.message
                    ? err.response.data.message
                    : err instanceof Error
                      ? err.message
                      : 'Upload failed';

            setAvatarError(errorMessage);
            toast.error('Upload failed', { description: errorMessage });
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof editProfileSchema>) => {
        setIsLoading(true);
        try {
            // TODO: Implement profile update logic here
            // 1. Avatar already uploaded and URL set in form
            // 2. Update the user's name and avatar URL
            await authClient.updateUser({
                name: values.name,
                image: values.avatar,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading('Updating Profile...', {
                            id: 'edit-profile-toast',
                            description: 'Please wait! We are updating your profile'
                        });
                    },
                    onSuccess: () => {
                        toast.success('Profile Updated', {
                            id: 'edit-profile-toast',

                            description: 'Your profile has been updated successfully.'
                        });
                        setInfo({
                            title: 'Profile Updated Successfully',
                            description: 'Your profile information has been updated.',
                            icon: CheckCircle,
                            color: 'bg-emerald-400',
                            action: {
                                label: 'Close',
                                onClick: () => {
                                    setInfo(null);
                                    setOpen(false);
                                    resetForm();
                                }
                            }
                        });
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.name || ctx.error.statusText || 'Update Failed', {
                            id: 'edit-profile-toast',
                            description: ctx.error.message || 'Failed to update profile. Please try again.'
                        });
                        setInfo({
                            title: ctx.error.name || ctx.error.statusText || 'Update Failed',
                            description: ctx.error.message || 'Failed to update profile. Please try again.',
                            icon: AlertCircle,
                            color: 'bg-rose-500',
                            action: {
                                label: 'Try Again',
                                onClick: () => setInfo(null)
                            }
                        });
                    }
                }
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Profile update error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const StatusScreen = ({ info }: { info: InfoType }) => (
        <motion.div
            initial='initial'
            animate='animate'
            exit='exit'
            variants={animationVariants}
            className='w-full space-y-6 text-center'>
            <motion.div
                variants={animationVariants.iconContainer}
                className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${info.color}`}>
                <info.icon className='h-10 w-10 text-white' />
            </motion.div>
            <motion.div variants={animationVariants.content} className='space-y-4'>
                <h2 className='text-2xl font-semibold tracking-tight'>{info.title}</h2>
                <p className='text-muted-foreground'>{info.description}</p>
                {info.action && (
                    <Button
                        onClick={info.action.onClick}
                        className='w-full gap-2'
                        variant={info.color.includes('rose') ? 'destructive' : 'default'}>
                        {info.action.label}
                    </Button>
                )}
            </motion.div>
        </motion.div>
    );

    return (
        <>
            {/* Main Profile Edit Dialog */}
            <Dialog
                open={open}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        resetForm();
                        setInfo(null);
                    }
                    setOpen(isOpen);
                }}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className='sm:max-w-[425px]'>
                    <AnimatePresence mode='wait'>
                        {info ? (
                            <StatusScreen key='status' info={info} />
                        ) : (
                            <motion.div
                                key='form'
                                initial='initial'
                                animate='animate'
                                exit='exit'
                                variants={animationVariants}>
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>Update your profile information below.</DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4 py-4'>
                                        <div className='flex flex-col items-center gap-4'>
                                            <div className='group relative'>
                                                <Avatar className='group-hover:border-primary/50 h-24 w-24 border-2 border-transparent transition-all duration-300'>
                                                    <AvatarImage
                                                        src={avatarUrl || '/user-placeholder.svg?height=96&width=96'}
                                                        alt={user.name}
                                                        className='object-cover'
                                                    />
                                                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <label
                                                    htmlFor='avatar-upload'
                                                    className='bg-primary hover:bg-primary/90 absolute right-0 bottom-0 cursor-pointer rounded-full p-2 text-white shadow-md transition-colors'>
                                                    <Upload className='h-4 w-4' />
                                                </label>
                                                <input
                                                    id='avatar-upload'
                                                    type='file'
                                                    accept='image/*'
                                                    className='hidden'
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                            <p className='text-muted-foreground text-sm'>
                                                Click the upload icon to change your profile picture
                                            </p>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name='name'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder='Enter your name' {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type='submit' className='w-full gap-2' disabled={isLoading}>
                                            {isLoading && <Loader className='h-4 w-4 animate-spin' />}
                                            Save changes
                                        </Button>
                                    </form>
                                </Form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </DialogContent>
            </Dialog>

            {/* Avatar Cropper Dialog */}
            <Dialog
                open={cropperDialogOpen}
                onOpenChange={(isOpen) => {
                    if (!isOpen) {
                        resetCropperState();
                    }
                    setCropperDialogOpen(isOpen);
                }}>
                <DialogContent className='sm:max-w-[425px]'>
                    <DialogHeader className='flex flex-row items-center justify-between'>
                        <div>
                            <DialogTitle>Crop Profile Picture</DialogTitle>
                            <DialogDescription>Adjust and crop your profile picture</DialogDescription>
                        </div>
                    </DialogHeader>

                    {imageSrc && (
                        <div className='flex w-full flex-col items-center'>
                            <div className='border-border relative mb-4 h-56 w-56 overflow-hidden rounded-lg border shadow-sm'>
                                <Cropper
                                    image={imageSrc}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                    objectFit='contain'
                                />
                            </div>

                            <div className='mb-4 w-full space-y-2'>
                                <div className='flex items-center justify-between'>
                                    <label htmlFor='zoomRange' className='text-sm font-medium'>
                                        Zoom:
                                    </label>
                                    <span className='text-muted-foreground text-xs'>{zoom.toFixed(1)}x</span>
                                </div>
                                <input
                                    id='zoomRange'
                                    type='range'
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className='accent-primary w-full'
                                />
                            </div>

                            <div className='flex w-full gap-2'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() => setCropperDialogOpen(false)}
                                    className='flex-1'>
                                    Cancel
                                </Button>
                                <Button
                                    type='button'
                                    onClick={handleUpload}
                                    disabled={uploading}
                                    className='flex-1 gap-2'>
                                    {uploading && <Loader className='h-4 w-4 animate-spin' />}
                                    {uploading ? `Uploading ${uploadProgress}%` : 'Upload'}
                                </Button>
                            </div>

                            {avatarError && (
                                <div className='bg-destructive/10 text-destructive mt-3 w-full rounded-md p-3 text-center text-sm'>
                                    {avatarError}
                                </div>
                            )}

                            {uploading && (
                                <div className='mt-3 w-full space-y-2'>
                                    <div className='bg-muted h-2 w-full overflow-hidden rounded-full'>
                                        <div
                                            className='bg-primary h-full transition-all duration-300'
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
