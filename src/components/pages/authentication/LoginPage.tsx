'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import handleGoogleAuth from '@/actions/google-login';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { authClient } from '@/lib/authentication/auth-client';
import { loginSchema } from '@/lib/authentication/zod-schema';
import { zodResolver } from '@hookform/resolvers/zod';

import { Info, Lock, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import CloudFlareCaptcha from '@/components/app-ui/captacha';
import useCaptchaToken from '@/stores/captcha_token';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { captchaToken } = useCaptchaToken()
    const router = useRouter();
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
        const { data, error } = await authClient.signIn.email(
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
                onRequest: (ctx) => {
                    toast.loading('Please wait...', {
                        id: 'login-toast',
                        description: 'We are trying to logging into your account.'
                    });
                },
                onSuccess: (ctx) => {
                    toast.success('Logged in!', {
                        id: 'login-toast',
                        description: 'You are successfully logged in.'
                    });
                },
                onError: (ctx) => {
                    console.log(ctx);
                    toast.error(ctx.error.name || ctx.error.status + ' | ' + ctx.error.statusText, {
                        id: 'login-toast',
                        description: ctx.error.message || 'Something went wrong!'
                    });
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
                                    className='data-[state=checked]:dark:bg-blue-600'
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
                    {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <AuthSocialButtons onGoogleClick={handleGoogleAuth} />
            </AuthFormWrapper>

            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}
