'use client';

import { useState } from 'react';

import { PasswordInput } from '@/components/app-ui/auth/PasswordInput';
import CloudFlareCaptcha from '@/components/app-ui/captcha';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { authClient } from '@/lib/authentication/auth-client';
import { changePasswordSchema, forgotPasswordSchema } from '@/lib/authentication/zod-schema';
import useCaptchaToken from '@/stores/captcha_token';
import { zodResolver } from '@hookform/resolvers/zod';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, InfoIcon, KeyRound, Loader, Mail } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface InfoType {
    title: string;
    description: string;
    icon: LucideIcon;
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

export default function ChangePassword() {
    const [openChange, setOpenChange] = useState(false);
    const [openReset, setOpenReset] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState<InfoType | null>(null);
    const { captchaToken } = useCaptchaToken();
    // Change Password Form
    const changeForm = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            revokeSession: false
        }
    });

    // Reset Password Form
    const resetForm = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    const resetForms = () => {
        changeForm.reset();
        resetForm.reset();
    };

    // Handle Change Password Submit
    const onChangePassword = async (values: z.infer<typeof changePasswordSchema>) => {
        const { currentPassword, newPassword, confirmPassword, revokeSession } = values;
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Incomplete Form Submission', {
                description: 'Please fill in all required fields.'
            });

            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords Do Not Match', {
                description: 'Please ensure your new password and confirmation password are matching.'
            });

            return;
        }

        setIsLoading(true);
        try {
            await authClient.changePassword({
                currentPassword,
                newPassword,
                revokeOtherSessions: revokeSession,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading('Changing Password...', {
                            id: 'change-toast',
                            description: 'Please wait while we change your password.'
                        });
                    },
                    onSuccess: () => {
                        toast.success('Password Changed', {
                            id: 'change-toast',
                            description: 'Your password has been changed successfully.'
                        });
                        setInfo({
                            title: 'Password Changed Successfully',
                            description: 'Your password has been updated. You can now use your new password to log in.',
                            icon: CheckCircle,
                            color: 'bg-emerald-400',
                            action: {
                                label: 'Close',
                                onClick: () => {
                                    setInfo(null);
                                    setOpenChange(false);
                                    resetForms();
                                }
                            }
                        });
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.statusText || 'Something Went Wrong', {
                            id: 'change-toast',
                            description: ctx.error.message || 'Unable to change password. Please try again later.'
                        });
                        setInfo({
                            title: 'Password Change Failed',
                            description: ctx.error.message || 'Unable to change password. Please try again later.',
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
        } catch (error) {
            console.error('Password change error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle Reset Password Submit
    const onResetPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
        const { email } = values;
        if (!email) {
            toast.error('Incomplete Form Submission', {
                description: 'Please enter your email address.'
            });

            return;
        }

        setIsLoading(true);
        try {
            await authClient.forgetPassword({
                email,

                fetchOptions: {
                    headers: {
                        'x-captcha-response': captchaToken
                    },
                    onRequest: () => {
                        toast.loading('Sending Reset Link...', {
                            id: 'forgot-toast',
                            description: 'Please wait while we send the reset link to your email.'
                        });
                    },
                    onSuccess: () => {
                        toast.success('Password Reset Request Received', {
                            id: 'forgot-toast',
                            description:
                                'If an account exists with this email address, you will receive password reset instructions shortly.'
                        });
                        setInfo({
                            title: 'Check Your Email',
                            description:
                                'If an account exists with this email address, you will receive password reset instructions shortly.',
                            icon: CheckCircle,
                            color: 'bg-emerald-400',
                            action: {
                                label: 'Close',
                                onClick: () => {
                                    setInfo(null);
                                    setOpenReset(false);
                                    resetForms();
                                }
                            }
                        });
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.statusText || 'Something Went Wrong', {
                            id: 'forgot-toast',
                            description: ctx.error.message || 'Unable to send reset link. Please try again later.'
                        });
                        setInfo({
                            title: 'Reset Request Failed',
                            description: 'Unable to send reset link. Please try again later.',
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
        } catch (error) {
            console.error('Password reset error:', error);
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
        <Card className='flex flex-col items-start justify-between gap-4'>
            <CardHeader className='w-full pb-3'>
                <div className='flex items-center gap-2'>
                    <KeyRound className='text-muted-foreground h-5 w-5' />
                    <CardTitle>Password</CardTitle>
                </div>
                <CardDescription>Change your password or reset it if you've forgotten it.</CardDescription>
            </CardHeader>
            <CardContent className=''>
                <Alert className='border border-sky-600 bg-sky-50 dark:border-sky-500 dark:bg-sky-600/20'>
                    <AlertDescription className='text-foreground'>
                        {/* Change Password */}
                        <div>
                            <h3 className='mb-1 flex items-center gap-2 text-sm font-semibold'>
                                <InfoIcon className='size-4 text-sky-600' />
                                Change Password
                            </h3>
                            <p className='text-xs'>
                                Click “Change Password” → enter current password → type &amp; confirm new password →
                                save changes.
                            </p>
                        </div>

                        {/* Password Reset */}
                        <div>
                            <h3 className='mb-1 flex items-center gap-2 text-sm font-semibold'>
                                <InfoIcon className='size-4 text-sky-600' />
                                Reset Password
                            </h3>
                            <p className='text-xs'>
                                Click “Reset Password” → submit email → check inbox (or spam) → click link → enter &amp;
                                confirm new password → submit.
                            </p>
                        </div>
                    </AlertDescription>
                </Alert>
            </CardContent>

            <CardFooter className='flex w-full flex-col items-center justify-end gap-2'>
                {/* Change Password Dialog */}
                <Dialog
                    open={openChange}
                    onOpenChange={(open) => {
                        if (!open) {
                            resetForms();
                            setInfo(null);
                        }
                        setOpenChange(open);
                    }}>
                    <DialogTrigger asChild>
                        <Button variant='default' className='w-full text-white'>
                            Change Password
                        </Button>
                    </DialogTrigger>
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
                                        <DialogTitle>Change password</DialogTitle>
                                        <DialogDescription>
                                            Enter your current password and a new password to change it.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...changeForm}>
                                        <form
                                            onSubmit={changeForm.handleSubmit(onChangePassword)}
                                            className='grid gap-4 py-4'>
                                            <FormField
                                                control={changeForm.control}
                                                name='currentPassword'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Current password</FormLabel>
                                                        <FormControl>
                                                            <PasswordInput
                                                                id='current-password'
                                                                placeholder='Enter Your Current Password'
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={changeForm.control}
                                                name='newPassword'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>New password</FormLabel>
                                                        <FormControl>
                                                            <PasswordInput
                                                                id='new-password'
                                                                placeholder='Enter New Password'
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={changeForm.control}
                                                name='confirmPassword'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Confirm password</FormLabel>
                                                        <FormControl>
                                                            <PasswordInput
                                                                id='confirm-password'
                                                                placeholder='Confirm New Password'
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={changeForm.control}
                                                name='revokeSession'
                                                render={({ field }) => (
                                                    <FormItem className='flex flex-row items-center space-y-0 space-x-2'>
                                                        <FormControl>
                                                            <Checkbox
                                                                className='data-[state=checked]:dark:bg-blue-600'
                                                                checked={field.value}
                                                                onCheckedChange={field.onChange}
                                                                checkColor='dark:text-white'
                                                            />
                                                        </FormControl>
                                                        <FormLabel className='flex items-center gap-x-2 text-sm font-normal'>
                                                            Logout from all other devices
                                                        </FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                            <DialogFooter>
                                                <Button type='submit' className='w-full gap-2' disabled={isLoading}>
                                                    {isLoading && <Loader className='h-4 w-4 animate-spin' />}
                                                    Save changes
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </DialogContent>
                </Dialog>

                {/* Reset Password Dialog */}
                <Dialog
                    open={openReset}
                    onOpenChange={(open) => {
                        if (!open) {
                            resetForms();
                            setInfo(null);
                        }
                        setOpenReset(open);
                    }}>
                    <DialogTrigger asChild>
                        <Button variant='outline' className='w-full'>
                            Reset Password
                        </Button>
                    </DialogTrigger>
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
                                        <DialogTitle>Reset Password</DialogTitle>
                                        <DialogDescription>
                                            Enter your email and get a link for resetting the password.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Form {...resetForm}>
                                        <form
                                            onSubmit={resetForm.handleSubmit(onResetPassword)}
                                            className='grid gap-4 py-4'>
                                            <FormField
                                                control={resetForm.control}
                                                name='email'
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Email</FormLabel>
                                                        <FormControl>
                                                            <div className='relative'>
                                                                <Mail className='text-foreground absolute top-2.5 left-3 h-4 w-4' />
                                                                <Input
                                                                    type='email'
                                                                    placeholder='name@example.com'
                                                                    className='pl-10'
                                                                    {...field}
                                                                />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <CloudFlareCaptcha />
                                            <DialogFooter>
                                                <Button type='submit' className='w-full gap-2' disabled={isLoading}>
                                                    {isLoading && <Loader className='h-4 w-4 animate-spin' />}
                                                    Send reset link
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}
