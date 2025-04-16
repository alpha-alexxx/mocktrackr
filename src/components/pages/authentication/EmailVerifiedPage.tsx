'use client';

import { Suspense, useEffect, useState } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { AuthFooterLinks } from '@/components/app-ui/auth/AuthFooterLinks';
import { AuthIllustration } from '@/components/app-ui/auth/AuthIllustration';
import { AuthLayout } from '@/components/app-ui/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/authentication/auth-client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

interface InfoProps {
    title: string;
    message: string;
    color: string;
    icon: LucideIcon;
    btnText: string;
    btnHref: string;
}

const footerLinks = [
    { label: 'Back to Login', href: '/login' },
    { label: 'Contact Support', href: '/support' }
];

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

/**
 * Renders the Email Verified page.
 * Handles verification token, shows success/failure status, and displays appropriate actions.
 */
export default function EmailVerifiedPage() {
    return (
        <Suspense fallback={<EmailVerificationSkeleton />}>
            <EmailVerificationContent />
        </Suspense>
    );
}

function EmailVerificationSkeleton() {
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
            <div className='mx-auto w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-lg backdrop-blur-sm dark:bg-gray-950/60'>
                <div className='flex flex-col items-center justify-center space-y-3 text-center'>
                    <Skeleton className='h-20 w-20 rounded-full' />
                    <div className='space-y-2 w-full'>
                        <Skeleton className='h-8 w-48 mx-auto' />
                        <Skeleton className='h-4 w-64 mx-auto' />
                    </div>
                    <Skeleton className='h-10 w-full' />
                </div>
            </div>
            <div className='mt-6 flex justify-center space-x-4'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-24' />
            </div>
        </AuthLayout>
    );
}

function EmailVerificationContent() {
    const params = useSearchParams();
    const token = params.get('token');
    const [info, setInfo] = useState<InfoProps | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        async function handleEmailVerification() {
            if (!token) {
                setInfo({
                    title: 'Token Not Found!',
                    message: 'You are trying to access an unauthorized page. Go to the login page.',
                    icon: AlertTriangle,
                    color: 'bg-rose-500',
                    btnText: 'Continue to Login',
                    btnHref: '/login'
                });
                setIsLoading(false);

                return;
            }

            const { data, error } = await authClient.verifyEmail({
                query: { token },
                fetchOptions: {
                    onRequest: (ctx) => {
                        toast.loading('Verifying email...', {
                            id: 'verify-email',
                            description: 'Please wait while we verify your email.'
                        });
                    },
                    onSuccess: (ctx) => {
                        toast.success('Email Verified!', {
                            id: 'verify-email',
                            description: 'Your email was successfully verified.'
                        });
                        setInfo({
                            title: 'Email Verified!',
                            message: 'You can now access all features of your account.',
                            icon: CheckCircle,
                            color: 'bg-emerald-400',
                            btnText: 'Continue to Dashboard',
                            btnHref: '/dashboard'
                        });
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.name, {
                            id: 'verify-email',
                            description: ctx.error.message
                        });
                        setInfo({
                            title: 'Verification Failed!',
                            message: 'The token might be expired or already used.',
                            icon: AlertTriangle,
                            color: 'bg-rose-500',
                            btnText: 'Try Again',
                            btnHref: '/login'
                        });
                    }
                }
            });
            setIsLoading(false);
        }
        handleEmailVerification();
    }, [token]);

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
                <div className='text-muted-foreground text-center'>Verifying your email...</div>
            </AuthLayout>
        );
    }

    if (!info) return null;

    return (
        <AuthLayout
            illustration={
                <AuthIllustration
                    src='/illustrations/verified.svg'
                    alt='Verification illustration'
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
                        className='w-full pt-4 text-white'>
                        <Link href={info.btnHref}>
                            <Button className='w-full'>{info.btnText}</Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}
