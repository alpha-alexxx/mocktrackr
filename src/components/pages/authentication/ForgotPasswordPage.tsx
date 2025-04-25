'use client';

import { useState } from 'react';

import { AuthFooterLinks } from '@/components/app-ui/auth/AuthFooterLinks';
import { AuthFormWrapper } from '@/components/app-ui/auth/AuthFormWrapper';
import { AuthIllustration } from '@/components/app-ui/auth/AuthIllustration';
import { AuthLayout } from '@/components/app-ui/auth/AuthLayout';
import CloudFlareCaptcha from '@/components/app-ui/captcha';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/authentication/auth-client';
import { forgotPasswordSchema } from '@/lib/authentication/zod-schema';
import useCaptchaToken from '@/stores/captcha_token';
import { zodResolver } from '@hookform/resolvers/zod';

import { ErrorContext } from 'better-auth/react';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const { captchaToken, setToken } = useCaptchaToken();
    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
        const { email } = values;

        if (!email) {
            toast.error('Incomplete Form Submission', {
                id: 'forgot-toast',
                description: 'Please enter your email address to receive a password reset link.'
            });

            return;
        }

        try {
            setIsLoading(true);

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
                        setIsEmailSent(true);
                    },
                    onError: (ctx: ErrorContext) => {
                        toast.error(ctx.error.statusText || 'Something Went Wrong', {
                            id: 'forgot-toast',
                            description: ctx.error.message || 'Unable to send reset link. Please try again later.'
                        });
                        // Reset captcha token on password reset request failure
                        setToken('');
                    }
                }
            });
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
                    description={`We've sent a secure password reset link to your registered email address. Please check your inbox, and be sure to look in your spam or junk folder if you don't see it shortly.`}
                    form={form}
                    onSubmit={() => {}}>
                    <div className='space-y-4'>
                        <Button type='button' className='w-full text-white' onClick={() => setIsEmailSent(false)}>
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
                                        <Mail className='text-foreground absolute top-2.5 left-3 h-4 w-4' />
                                        <Input placeholder='name@example.com' className='pl-10' {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <CloudFlareCaptcha />
                    <Button type='submit' className='w-full text-white' disabled={isLoading || !captchaToken}>
                        {isLoading ? 'Sending...' : 'Send reset link'}
                    </Button>
                </AuthFormWrapper>
            )}

            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}
