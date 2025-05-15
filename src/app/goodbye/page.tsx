'use client';

import { useEffect } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site/site-config';

import { motion } from 'framer-motion';
import { ArrowLeft, Mail } from 'lucide-react';

export default function GoodbyePage() {
    // Scroll to top on page load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4 md:p-8 dark:from-gray-950 dark:to-gray-900'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='mx-auto w-full max-w-3xl text-center'>
                <div className='relative mb-8 h-64 w-full md:h-80'>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 100,
                            delay: 0.2,
                            duration: 0.8
                        }}
                        className='absolute inset-0 flex items-center justify-center'>
                        <Image
                            src='/illustrations/goodbye.png'
                            alt='Farewell illustration'
                            width={500}
                            height={500}
                            className='rounded-xl object-contain'
                            priority
                        />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className='pointer-events-none absolute inset-0'>
                        <WaveAnimation />
                    </motion.div>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className='mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl dark:from-gray-100 dark:to-gray-400'>
                    Farewell, for now
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className='mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl dark:text-gray-300'>
                    Your account has been successfully deleted. We appreciate the time you've spent with us and hope our
                    paths cross again.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className='mb-12 space-y-4'>
                    <p className='text-gray-500 dark:text-gray-400'>
                        All your data has been removed from our systems in accordance with our privacy policy.
                    </p>
                    <p className='text-gray-500 dark:text-gray-400'>
                        If you have any questions or need assistance, our support team is still here for you.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className='flex flex-col justify-center gap-4 md:flex-row'>
                    <Link href='/' passHref>
                        <Button variant='default' size='lg' className='group relative overflow-hidden text-white'>
                            <motion.span
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.3 }}
                                className='mr-2'>
                                <ArrowLeft className='h-4 w-4 transition-transform group-hover:-translate-x-1' />
                            </motion.span>
                            Return to Home
                        </Button>
                    </Link>

                    <Link href='/contact' passHref>
                        <Button variant='outline' size='lg' className='group'>
                            <motion.span
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1.4, duration: 0.3 }}
                                className='mr-2'>
                                <Mail className='h-4 w-4 transition-transform group-hover:scale-110' />
                            </motion.span>
                            Contact Support
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
                className='mt-16 text-center text-sm text-gray-400 dark:text-gray-500'>
                <p>
                    © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}

// Animated wave component
function WaveAnimation() {
    return (
        <svg
            className='absolute bottom-0 left-0 h-24 w-full md:h-32'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 320'>
            <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.2 }}
                transition={{ duration: 2, ease: 'easeInOut' }}
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128'
            />
            <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.1 }}
                transition={{ duration: 2.5, delay: 0.3, ease: 'easeInOut' }}
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                d='M0,96L48,128C96,160,192,224,288,213.3C384,203,480,117,576,117.3C672,117,768,203,864,202.7C960,203,1056,117,1152,96C1248,75,1344,117,1392,138.7L1440,160'
            />
        </svg>
    );
}
