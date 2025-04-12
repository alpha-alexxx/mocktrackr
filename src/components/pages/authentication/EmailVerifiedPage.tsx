'use client';

import Link from 'next/link';

import { AuthFooterLinks } from '@/components/app-ui/auth/AuthFooterLinks';
import { AuthIllustration } from '@/components/app-ui/auth/AuthIllustration';
import { AuthLayout } from '@/components/app-ui/auth/AuthLayout';
import { Button } from '@/components/ui/button';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function EmailVerifiedPage() {
    // Animation for success checkmark
    const checkmarkVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: 0.4
            }
        }
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                delay: 0.6
            }
        }
    };

    const footerLinks = [
        { label: 'Back to Login', href: '/login' },
        { label: 'Contact Support', href: '/support' }
    ];

    return (
        <AuthLayout
            illustration={
                <AuthIllustration
                    src='/illustrations/verified.svg'
                    alt='Email verified illustration - Success confirmation'
                    width={500}
                    height={500}
                />
            }>
            <div className='mx-auto w-full max-w-md space-y-8 rounded-xl bg-white p-6 shadow-lg backdrop-blur-sm dark:bg-gray-950/60'>
                <div className='flex flex-col items-center justify-center space-y-3 text-center'>
                    <motion.div
                        variants={checkmarkVariants}
                        initial='hidden'
                        animate='visible'
                        className='flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30'>
                        <CheckCircle className='h-10 w-10 text-emerald-600 dark:text-emerald-400' />
                    </motion.div>

                    <motion.div variants={textVariants} initial='hidden' animate='visible' className='space-y-2'>
                        <h1 className='text-2xl font-bold tracking-tight'>Email Verified!</h1>
                        <p className='text-muted-foreground'>
                            Your email has been successfully verified. You can now access all features of your account.
                        </p>
                    </motion.div>

                    <motion.div variants={buttonVariants} initial='hidden' animate='visible' className='w-full pt-4'>
                        <Link href='/login'>
                            <Button className='w-full'>Continue to Login</Button>
                        </Link>
                    </motion.div>
                </div>
            </div>

            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}
