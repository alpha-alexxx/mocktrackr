'use client';

import { useState } from 'react';

import { AuthFooterLinks } from '@/components/app-ui/auth/AuthFooterLinks';
import { AuthFormWrapper } from '@/components/app-ui/auth/AuthFormWrapper';
import { AuthIllustration } from '@/components/app-ui/auth/AuthIllustration';
import { AuthLayout } from '@/components/app-ui/auth/AuthLayout';
import { PasswordInput } from '@/components/app-ui/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { resetPasswordSchema } from '@/lib/authentication/zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';

import { Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(values);
            toast.success('Password reset successfully!');
            // Redirect to login page
        } catch (error) {
            toast.error('Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const footerLinks = [{ label: 'Back to Login', href: '/login' }];

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
                                    <Lock className='text-muted-foreground absolute top-2.5 left-3 h-4 w-4' />
                                    <PasswordInput id='password' className='pl-10' {...field} />
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
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <Lock className='text-muted-foreground absolute top-2.5 left-3 h-4 w-4' />
                                    <PasswordInput id='confirmPassword' className='pl-10' {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? 'Resetting...' : 'Reset password'}
                </Button>
            </AuthFormWrapper>

            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}
