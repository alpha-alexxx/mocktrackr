'use client';

import { useState } from 'react';

import Link from 'next/link';

import { AuthFooterLinks } from '@/components/app-ui/auth/AuthFooterLinks';
import { AuthFormWrapper } from '@/components/app-ui/auth/AuthFormWrapper';
import { AuthIllustration } from '@/components/app-ui/auth/AuthIllustration';
import { AuthLayout } from '@/components/app-ui/auth/AuthLayout';
import { AuthSocialButtons } from '@/components/app-ui/auth/AuthSocialButtons';
import { PasswordInput } from '@/components/app-ui/auth/PasswordInput';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { loginSchema } from '@/lib/authentication/zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';

import { Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        }
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(values);
            toast.success('Successfully logged in!');
            // Redirect to dashboard or home page
        } catch (error) {
            toast.error('Failed to login. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Successfully logged in with Google!');
            // Redirect to dashboard or home page
        } catch (error) {
            toast.error('Failed to login with Google. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const footerLinks = [
        { label: "Ready to get started? Create your account", href: "/register" }
    ];

    return (
        <AuthLayout
            illustration={
                <AuthIllustration
                    src='/illustrations/login.svg'
                    alt='Login illustration - User accessing a secure system'
                    width={500}
                    height={500}
                />
            }>
            <AuthFormWrapper
                title='Welcome back'
                description='Enter your credentials to access your account'
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

                <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex items-center justify-between'>
                                <FormLabel>Password</FormLabel>
                                <Link href='/forgot-password' className='text-primary text-xs hover:underline'>
                                    Forgot password?
                                </Link>
                            </div>
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
                    name='rememberMe'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-center space-y-0 space-x-2'>
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className='text-sm font-normal'>Remember me for 30 days</FormLabel>
                        </FormItem>
                    )}
                />

                <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <AuthSocialButtons onGoogleClick={handleGoogleLogin} />
            </AuthFormWrapper>

            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}
