'use client';

import type { ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';
import { ArrowLeftCircle } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';

interface AuthFormWrapperProps {
    children: ReactNode;
    title: string;
    description: string;
    footer?: ReactNode;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
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
    const router = useRouter();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                'w-full flex-shrink-0 space-y-6 rounded-xl border bg-white/95 p-6 shadow-xs backdrop-blur-sm dark:bg-gray-950/80 dark:ring-1 dark:shadow-gray-950/20 dark:ring-gray-800/50',
                className
            )}>
            <div className='w-full space-y-2 text-center'>
                <div className='flex w-full items-center justify-start'>
                    <Button variant='outline' size='icon' onClick={() => router.back()}>
                        <ArrowLeftCircle className='size-5' />
                    </Button>
                </div>
                <h1 className='text-2xl font-bold tracking-tight dark:text-gray-100'>{title}</h1>
                <p className='text-muted-foreground text-sm dark:text-gray-300'>{description}</p>
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
