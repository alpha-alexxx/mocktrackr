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
import { registerSchema } from '@/lib/authentication/zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';

import { Lock, Mail, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false
        }
    });

    const onSubmit = async (values: z.infer<typeof registerSchema>) => {
        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(values);
            toast.success('Account created successfully!');
            // Redirect to email verification page or login
        } catch (error) {
            toast.error('Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = async () => {
        try {
            setIsLoading(true);
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Account created with Google!');
            // Redirect to dashboard or home page
        } catch (error) {
            toast.error('Failed to register with Google. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const footerLinks = [{ label: 'Already have an account? Login', href: '/login' }];

    return (
        <AuthLayout
            illustration={
                <AuthIllustration
                    src='/illustrations/register.svg'
                    alt='Register illustration - Joining a community'
                    width={500}
                    height={500}
                />
            }>
            <AuthFormWrapper
                title='Create an account'
                description='Enter your details to create your account'
                form={form}
                onSubmit={onSubmit}>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <div className='relative'>
                                    <UserRound className='text-muted-foreground absolute top-2.5 left-3 h-4 w-4' />
                                    <Input placeholder='John Doe' className='pl-10' {...field} />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                            <FormLabel>Password</FormLabel>
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
                            <FormLabel>Confirm Password</FormLabel>
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

                <FormField
                    control={form.control}
                    name='acceptTerms'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-start space-y-0 space-x-2'>
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                                <FormLabel className='text-sm font-normal'>
                                    I agree to the{' '}
                                    <Link href='/terms' className='text-primary hover:underline'>
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href='/privacy' className='text-primary hover:underline'>
                                        Privacy Policy
                                    </Link>
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />

                <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create account'}
                </Button>

                <AuthSocialButtons onGoogleClick={handleGoogleRegister} />
            </AuthFormWrapper>

            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}
