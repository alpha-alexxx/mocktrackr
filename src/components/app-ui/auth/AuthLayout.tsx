'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';

interface AuthLayoutProps {
    children: ReactNode;
    illustration: ReactNode;
    className?: string;
}

export function AuthLayout({ children, illustration, className }: AuthLayoutProps) {
    return (
        <div className='flex min-h-screen w-full flex-col md:flex-row'>
            {/* Form side */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    'flex min-h-screen flex-1 items-center justify-center overflow-y-auto bg-white p-6 md:p-10 dark:bg-gray-950',
                    className
                )}>
                <div className='w-full max-w-md'>{children}</div>
            </motion.div>

            {/* Illustration side */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className='sticky top-0 hidden h-screen flex-1 items-center justify-center bg-gradient-to-br from-emerald-50 to-blue-50 p-8 md:flex dark:bg-gray-900 dark:from-emerald-950/50 dark:to-blue-950/50'>
                <div className='flex w-full max-w-lg items-center justify-center'>{illustration}</div>
            </motion.div>
        </div>
    );
}
