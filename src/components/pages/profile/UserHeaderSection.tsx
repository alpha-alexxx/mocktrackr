'use client';

import { useState } from 'react';

import AvatarUploader from '@/components/app-ui/avatar-uploader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ExtendedUser } from '@/lib/authentication/auth-types';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { EditProfileDialog } from './EditProfileDialog';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Edit, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const editProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters')
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

export default function UserHeaderSection({ user, onEdit }: { user?: ExtendedUser; onEdit?: () => void }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState<InfoType | null>(null);

    const roleColors: Record<string, string> = {
        USER: 'bg-sky-500 text-white',
        ADMIN: 'bg-emerald-500 text-white',
        SUPERADMIN: 'bg-rose-500 text-white'
    };

    const editForm = useForm({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: user?.name || ''
        }
    });

    const resetForm = () => {
        editForm.reset();
    };

    const onEditProfile = async (values: z.infer<typeof editProfileSchema>) => {
        setIsLoading(true);
        try {
            // TODO: Implement profile update logic here
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success('Profile Updated', {
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
                        setOpenEdit(false);
                        resetForm();
                    }
                }
            });
        } catch (error) {
            console.error('Profile update error:', error);
            setInfo({
                title: 'Update Failed',
                description: 'Failed to update profile. Please try again.',
                icon: AlertCircle,
                color: 'bg-rose-500',
                action: {
                    label: 'Try Again',
                    onClick: () => setInfo(null)
                }
            });
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

    if (!user) return null;

    return (
        <Card className='overflow-hidden'>
            <CardContent>
                <div className='flex flex-col gap-6 sm:flex-row sm:items-center'>
                    <div className='relative mx-auto size-24'>
                        <Avatar className='size-full'>
                            <AvatarImage
                                src={user.image || '/user-placeholder.svg?height=96&width=96'}
                                alt={user.name}
                            />
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className='flex-1 space-y-1.5'>
                        <div className='flex items-center gap-2'>
                            <h2 className='text-2xl font-bold'>{user.name}</h2>
                            <Badge className={cn(roleColors[user.role || 'USER'])}>{user.role || 'USER'}</Badge>
                        </div>
                        <p className='text-muted-foreground'>{user.email}</p>
                    </div>
                    <EditProfileDialog user={user}>
                        <Button variant={'outline'} className='shrink-0 gap-1 sm:self-start' size='sm'>
                            <Edit className='h-4 w-4' />
                            <span>Edit Profile</span>
                        </Button>
                    </EditProfileDialog>
                </div>
            </CardContent>
        </Card>
    );
}
