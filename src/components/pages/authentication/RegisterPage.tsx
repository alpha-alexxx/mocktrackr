'use client';

import { useState } from 'react';

import Link from 'next/link';

import handleGoogleAuth from '@/actions/google-login';
import { AuthFooterLinks } from '@/components/app-ui/auth/AuthFooterLinks';
import { AuthFormWrapper } from '@/components/app-ui/auth/AuthFormWrapper';
import { AuthIllustration } from '@/components/app-ui/auth/AuthIllustration';
import { AuthLayout } from '@/components/app-ui/auth/AuthLayout';
import { AuthSocialButtons } from '@/components/app-ui/auth/AuthSocialButtons';
import { PasswordInput } from '@/components/app-ui/auth/PasswordInput';
import CloudFlareCaptcha from '@/components/app-ui/captcha';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/authentication/auth-client';
import { registerSchema } from '@/lib/authentication/zod-schema';
import useCaptchaToken from '@/stores/captcha_token';
import { zodResolver } from '@hookform/resolvers/zod';

import { Lock, Mail, UserRound } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { captchaToken, setToken } = useCaptchaToken();
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
        const { name, email, password } = values;
        setIsLoading(true);
        const { data, error } = await authClient.signUp.email(
            {
                email, // user email address
                password, // user password -> min 8 characters by default
                name, // user display name
                callbackURL: '/dashboard' // a url to redirect to after the user verifies their email (optional)
            },
            {
                headers: {
                    'x-captcha-response': captchaToken
                },
                onRequest: () => {
                    // TODO: Verify that user exist or not.
                    toast.loading('Creating account...', {
                        id: 'register-toast',
                        description: 'We are creating your account. Please wait...'
                    });
                },
                onSuccess: () => {
                    //redirect to the dashboard or sign in page
                    toast.success('Account Created!', {
                        id: 'register-toast',
                        description: 'Account created! Please check your email to verify.'
                    });
                },
                onError: (ctx) => {
                    // display the error message
                    toast.error(ctx.error.name || ctx.error.status + ' | ' + ctx.error.statusText, {
                        id: 'register-toast',
                        description: ctx.error.message || 'Something Went Wrong!'
                    });
                    // Reset captcha token on registration failure
                    setToken('');
                }
            }
        );
        setIsLoading(false);
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
                                    <UserRound className='text-foreground absolute top-2.5 left-3 h-4 w-4' />
                                    <Input
                                        placeholder='John Doe'
                                        className='border-foreground/30 border-2 pl-10'
                                        {...field}
                                    />
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
                                    <Mail className='text-foreground absolute top-2.5 left-3 h-4 w-4' />
                                    <Input
                                        placeholder='name@example.com'
                                        className='border-foreground/30 border-2 pl-10'
                                        {...field}
                                    />
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
                                    <Lock className='text-foreground absolute top-2.5 left-3 h-4 w-4' />
                                    <PasswordInput
                                        id='password'
                                        className='border-foreground/30 border-2 pl-10'
                                        {...field}
                                    />
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
                                    <Lock className='text-foreground absolute top-2.5 left-3 h-4 w-4' />
                                    <PasswordInput
                                        id='confirmPassword'
                                        className='border-foreground/30 border-2 pl-10'
                                        {...field}
                                    />
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
                                <Checkbox
                                    checkColor='text-white'
                                    className='border-foreground/40 border-2 data-[state=checked]:dark:bg-blue-600'
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className='space-y-1 leading-none'>
                                <FormLabel className='text-sm font-normal'>
                                    I agree to the{' '}
                                    <Link href='/terms' className='underline dark:text-slate-300'>
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href='/privacy' className='underline dark:text-slate-300'>
                                        Privacy Policy
                                    </Link>
                                </FormLabel>
                                <FormMessage />
                            </div>
                        </FormItem>
                    )}
                />
                <CloudFlareCaptcha />
                <Button type='submit' className='w-full text-white' disabled={isLoading || !captchaToken}>
                    {isLoading ? 'Creating account...' : 'Create account'}
                </Button>

                <AuthSocialButtons onGoogleClick={handleGoogleAuth} />
            </AuthFormWrapper>

            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}
