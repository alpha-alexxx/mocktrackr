'use client';

import { Suspense, useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { AuthFooterLinks } from '@/components/app-ui/auth/AuthFooterLinks';
import { AuthFormWrapper } from '@/components/app-ui/auth/AuthFormWrapper';
import { AuthIllustration } from '@/components/app-ui/auth/AuthIllustration';
import { AuthLayout } from '@/components/app-ui/auth/AuthLayout';
import { PasswordInput } from '@/components/app-ui/auth/PasswordInput';
import CloudFlareCaptcha from '@/components/app-ui/captcha';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/hooks/use-auth-query';
import { authClient } from '@/lib/authentication/auth-client';
import { resetPasswordSchema } from '@/lib/authentication/zod-schema';
import useCaptchaToken from '@/stores/captcha_token';
import { zodResolver } from '@hookform/resolvers/zod';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface InfoProps {
    title: string;
    message: string;
    color: string;
    icon: LucideIcon;
    btnText: string;
    btnHref: string;
}

const animationVariants = {
    icon: {
        hidden: { scale: 0, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 } }
    },
    text: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.4 } }
    },
    button: {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.6 } }
    }
};
function ResetPasswordForm() {
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [info, setInfo] = useState<InfoProps | null>(null);
    const { captchaToken } = useCaptchaToken();
    const router = useRouter();
    const params = useSearchParams();
    const token = params.get('token');
    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    useEffect(() => {
        if (!token) {
            setInfo({
                title: 'Invalid Token',
                message: 'The reset link is no longer valid. Please request a new password reset.',
                icon: AlertTriangle,
                color: 'bg-rose-500',
                btnText: 'Request Reset',
                btnHref: '/forgot-password'
            });
            setIsLoading(false);

            return;
        }
    }, [token]);
    const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
        const { password, confirmPassword } = values;
        if (!password || !confirmPassword) {
            toast.error('Incomplete Form Submission', {
                id: 'reset-toast',
                description: 'Please fill in all required fields to proceed with password reset.'
            });

            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords Do Not Match', {
                id: 'reset-toast',
                description: 'Please ensure your new password and confirmation password are matching.'
            });

            return;
        }
        if (!token) {
            toast.error('Invalid or Expired Token', {
                id: 'reset-token',
                description: 'The reset link is no longer valid. Please request a new password reset.',
                action: {
                    label: 'Forget Password',
                    onClick: () => {
                        router.push('/forgot-password');
                    }
                }
            });

            return;
        }
        try {
            setIsLoading(true);

            await authClient.resetPassword({
                newPassword: password,
                token,

                fetchOptions: {
                    headers: {
                        'x-captcha-response': captchaToken
                    },

                    onRequest: () => {
                        toast.loading('Resetting password...', {
                            id: 'reset-toast',
                            description: 'Please wait while we update your password.'
                        });
                    },
                    onSuccess: () => {
                        toast.success('Password Reset Successfully!', {
                            id: 'reset-toast',
                            description: 'You can now sign in using your new password.'
                        });
                        setInfo({
                            title: 'Password Reset Successfully!',
                            message: 'Your password has been updated. You can now login with your new password.',
                            icon: CheckCircle,
                            color: 'bg-emerald-400',
                            btnText: session && session.user ? 'Continue to dashboard' : 'Continue to login',
                            btnHref: session && session.user ? '/dashboard' : '/login'
                        });
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.statusText || 'Reset Failed', {
                            id: 'reset-toast',
                            description: ctx.error.message || 'An unexpected error occurred. Please try again.'
                        });
                        setInfo({
                            title: 'Reset Failed',
                            message: ctx.error.message || 'An unexpected error occurred. Please try again.',
                            icon: AlertTriangle,
                            color: 'bg-rose-500',
                            btnText: 'Try Again',
                            btnHref: '/forgot-password'
                        });
                    }
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const footerLinks = [
        {
            label: session && session.user ? 'Back to Dashboard' : 'Back to login',
            href: session && session.user ? '/dashboard' : '/login'
        }
    ];

    if (isLoading && !info) {
        return (
            <AuthLayout
                illustration={
                    <AuthIllustration
                        src='/illustrations/loading.svg'
                        alt='Loading illustration'
                        width={500}
                        height={500}
                    />
                }>
                <div className='text-muted-foreground text-center'>Processing your request...</div>
            </AuthLayout>
        );
    }

    if (info) {
        return (
            <AuthLayout
                illustration={
                    <AuthIllustration
                        src='/illustrations/reset-password.png'
                        alt='Reset password illustration'
                        width={500}
                        height={500}
                    />
                }>
                <div className='mx-auto w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-lg backdrop-blur-sm dark:bg-gray-950/60'>
                    <div className='flex flex-col items-center justify-center space-y-3 text-center'>
                        <motion.div
                            variants={animationVariants.icon}
                            initial='hidden'
                            animate='visible'
                            className={`flex h-20 w-20 items-center justify-center rounded-full ${info.color}`}>
                            <info.icon className='h-10 w-10 text-white' />
                        </motion.div>

                        <motion.div
                            variants={animationVariants.text}
                            initial='hidden'
                            animate='visible'
                            className='space-y-2'>
                            <h1 className='text-2xl font-bold tracking-tight'>{info.title}</h1>
                            <p className='text-muted-foreground'>{info.message}</p>
                        </motion.div>

                        <motion.div
                            variants={animationVariants.button}
                            initial='hidden'
                            animate='visible'
                            className='w-full pt-4'>
                            <Link href={info.btnHref}>
                                <Button className='w-full text-white'>{info.btnText}</Button>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                <AuthFooterLinks links={footerLinks} className='mt-6' />
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            illustration={
                <AuthIllustration
                    src='/illustrations/reset-password.png'
                    alt='Reset password illustration - Updating security'
                    width={600}
                    height={800}
                />
            }>
            <AuthFormWrapper
                title='Reset password'
                description='Create a new password for your account'
                form={form}
                onSubmit={onSubmit}>
                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Lock className='text-foreground absolute top-2.5 left-3 h-4 w-4' />
                                    <PasswordInput
                                        placeholder='Enter your new password'
                                        id='password'
                                        className='border-foreground/30 border-2 pl-10'
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Lock className='text-foreground absolute top-2.5 left-3 h-4 w-4' />
                                    <PasswordInput
                                        id='confirmPassword'
                                        placeholder='Confirm your password'
                                        className='border-foreground/30 border-2 pl-10'
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <CloudFlareCaptcha />
                <Button type='submit' className='w-full text-white' disabled={isLoading || !captchaToken}>
                    {isLoading ? 'Resetting...' : 'Reset password'}
                </Button>
            </AuthFormWrapper>

            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}

function ResetPasswordSkeleton() {
    return (
        <AuthLayout
            illustration={
                <AuthIllustration
                    src='/illustrations/reset-password.svg'
                    alt='Reset password illustration - Updating security'
                    width={500}
                    height={500}
                />
            }>
            <div className='space-y-6'>
                <div className='space-y-2'>
                    <Skeleton className='h-8 w-48' />
                    <Skeleton className='h-4 w-64' />
                </div>

                <div className='space-y-4'>
                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-24' />
                        <Skeleton className='h-10 w-full' />
                    </div>

                    <div className='space-y-2'>
                        <Skeleton className='h-4 w-36' />
                        <Skeleton className='h-10 w-full' />
                    </div>

                    <Skeleton className='h-10 w-full' />
                </div>
            </div>

            <div className='mt-6'>
                <Skeleton className='mx-auto h-4 w-24' />
            </div>
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<ResetPasswordSkeleton />}>
            <ResetPasswordForm />
        </Suspense>
    );
}
