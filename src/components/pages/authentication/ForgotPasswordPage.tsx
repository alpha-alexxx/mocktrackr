'use client';

import { useState } from 'react';

import { AuthFooterLinks } from '@/components/app-ui/auth/AuthFooterLinks';
import { AuthFormWrapper } from '@/components/app-ui/auth/AuthFormWrapper';
import { AuthIllustration } from '@/components/app-ui/auth/AuthIllustration';
import { AuthLayout } from '@/components/app-ui/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { forgotPasswordSchema } from '@/lib/authentication/zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';

import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);

    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(values);
            setIsEmailSent(true);
            toast.success('Password reset link sent to your email!');
        } catch (error) {
            toast.error('Failed to send reset link. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const footerLinks = [
        { label: 'Back to Login', href: '/login' },
        { label: 'Create an account', href: '/register' }
    ];

    return (
        <AuthLayout
            illustration={
                <AuthIllustration
                    src='/illustrations/forgot-password.svg'
                    alt='Forgot password illustration - Searching for email'
                    width={500}
                    height={500}
                />
            }>
            {isEmailSent ? (
                <AuthFormWrapper
                    title='Check your email'
                    description={`We've sent a password reset link to your email address. Please check your inbox.`}
                    form={form}
                    onSubmit={() => { }}>
                    <div className='space-y-4'>
                        <Button type='button' className='w-full' onClick={() => setIsEmailSent(false)}>
                            Send again
                        </Button>
                    </div>
                </AuthFormWrapper>
            ) : (
                <AuthFormWrapper
                    title='Forgot password'
                    description="Enter your email address and we'll send you a link to reset your password"
                    form={form}
                    onSubmit={onSubmit}>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <div className='relative'>
                                        <Mail className='text-muted-foreground absolute top-2.5 left-3 h-4 w-4' />
                                        <Input placeholder='name@example.com' className='pl-10' {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type='submit' className='w-full' disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send reset link'}
                    </Button>
                </AuthFormWrapper>
            )}

            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}
