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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { authClient } from '@/lib/authentication/auth-client';
import { loginSchema } from '@/lib/authentication/zod-schema';
import useCaptchaToken from '@/stores/captcha_token';
import { zodResolver } from '@hookform/resolvers/zod';

import { Info, Loader2, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { captchaToken, setToken } = useCaptchaToken();
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false
        }
    });

    const onSubmit = async (values: z.infer<typeof loginSchema>) => {
        const { email, password, rememberMe } = values;
        setIsLoading(true);
        await authClient.signIn.email(
            {
                email,
                password,
                rememberMe,
                callbackURL: '/dashboard'
            },

            {
                headers: {
                    'x-captcha-response': captchaToken
                },
                onRequest: () => {
                    toast.loading('Please wait...', {
                        id: 'login-toast',
                        description: 'We are trying to logging into your account.'
                    });
                },
                onSuccess: () => {
                    toast.success('Logged in!', {
                        id: 'login-toast',
                        description: 'You are successfully logged in.'
                    });

                    return;
                },
                onError: (ctx) => {
                    toast.error(ctx.error.name || ctx.error.status + ' | ' + ctx.error.statusText, {
                        id: 'login-toast',
                        description: ctx.error.message || 'Something went wrong!'
                    });
                    // Reset captcha token on login failure
                    setToken('');
                }
            }
        );
        setIsLoading(false);
    };

    const footerLinks = [{ label: 'Ready to get started? Create your account', href: '/register' }];

    return (
        <AuthLayout
            illustration={
                <AuthIllustration
                    src='/illustrations/login-account.png'
                    alt='Login illustration - User accessing a secure system'
                    width={600}
                    height={800}
                />
            }
            className='relative'>
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
                            <div className='flex items-center justify-between'>
                                <FormLabel>Password</FormLabel>
                                <Link
                                    href='/forgot-password'
                                    className='text-foreground hover:text-primary text-xs font-semibold hover:underline'>
                                    Forgot password?
                                </Link>
                            </div>
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
                    name='rememberMe'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-center space-y-0 space-x-2'>
                            <FormControl>
                                <Checkbox
                                    className='dark:border-slate-400 data-[state=checked]:dark:bg-blue-600'
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    checkColor='dark:text-white'
                                />
                            </FormControl>
                            <FormLabel className='flex items-center gap-x-2 text-sm font-normal'>
                                Remember me
                                <Popover>
                                    <PopoverTrigger>
                                        <Info className='size-4' />
                                    </PopoverTrigger>
                                    <PopoverContent className='border-foreground/20 border-2'>
                                        If unchecked, you will be signed out when the browser is closed.
                                    </PopoverContent>
                                </Popover>
                            </FormLabel>
                        </FormItem>
                    )}
                />
                <CloudFlareCaptcha />
                <Button type='submit' className='w-full text-white' disabled={isLoading || !captchaToken}>
                    {isLoading ? (
                        <span className='flex flex-row'>
                            <Loader2 className='mr-2 size-5 animate-spin' />
                            Logging in...
                        </span>
                    ) : (
                        'Login'
                    )}
                </Button>

                <AuthSocialButtons onGoogleClick={handleGoogleAuth} />
            </AuthFormWrapper>
            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}
