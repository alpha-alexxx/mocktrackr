'use client';

import type { ReactNode } from 'react';

import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';
import type { UseFormReturn } from 'react-hook-form';

interface AuthFormWrapperProps {
    children: ReactNode;
    title: string;
    description: string;
    footer?: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (values: any) => void;
    className?: string;
}

export function AuthFormWrapper({
    children,
    title,
    description,
    footer,
    form,
    onSubmit,
    className
}: AuthFormWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                'w-full space-y-6 rounded-xl bg-white p-6 shadow-lg backdrop-blur-sm dark:bg-gray-950/60',
                className
            )}>
            <div className='space-y-2 text-center'>
                <h1 className='text-2xl font-bold tracking-tight'>{title}</h1>
                <p className='text-muted-foreground text-sm'>{description}</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    {children}
                </form>
            </Form>

            {footer && <div className='mt-4'>{footer}</div>}
        </motion.div>
    );
}
