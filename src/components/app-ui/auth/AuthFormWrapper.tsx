'use client';

import type { ReactNode } from 'react';

import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';
import type { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
    const router = useRouter()

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={cn(
                'w-full space-y-6 rounded-xl bg-white/95 p-6 shadow-lg backdrop-blur-sm dark:bg-gray-950/80 dark:ring-1 dark:shadow-gray-950/20 dark:ring-gray-800/50',
                className
            )}>
            <div className='space-y-2 w-full text-center'>
                <div className='w-full flex items-center justify-start'>
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
