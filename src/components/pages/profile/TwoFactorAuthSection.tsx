'use client';

import { useEffect, useState } from 'react';

import { PasswordInput } from '@/components/app-ui/auth/PasswordInput';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { authClient } from '@/lib/authentication/auth-client';
import { otpSchema, passwordSchema } from '@/lib/authentication/zod-schema';
import { siteConfig } from '@/lib/site/site-config';
import { ExtendedUser } from '@/lib/types/auth-types';
import { zodResolver } from '@hookform/resolvers/zod';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { AlertCircle, CheckCircle, Loader2, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { z } from 'zod';

export default function TwoFactorAuthSection({ user }: { user: ExtendedUser }) {
    const [isLoading, setIsLoading] = useState(false);
    const [ispwdDialog, setpwdDialog] = useState<boolean>(false);
    const [is2FAEnabled, setIs2FAEnabled] = useState(!!user.twoFactorEnabled);
    const [is2FAURI, setIs2FAURI] = useState<string | null>(null);
    const [isQRDialogActive, setIsQRDialogActive] = useState<boolean>(false);
    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: ''
        }
    });
    const formOTP = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: ''
        }
    });

    async function onSubmit(values: z.infer<typeof passwordSchema>) {
        setIsLoading(true);
        const { password } = values;

        if (!is2FAEnabled) {
            const { data } = await authClient.twoFactor.enable({
                password,
                issuer: siteConfig.name,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading('Enabling Two Factor Authentication...', {
                            id: 'enable-2fa-toast',
                            description: 'We are requesting our server to enable Two Factor Authentication for you.'
                        });
                    },
                    onSuccess: () => {
                        toast.success('Two Factor Authentication Enabled Successfully', {
                            id: 'enable-2fa-toast',
                            description: 'You have successfully enabled Two Factor Authentication for your account.'
                        });
                    },
                    onError: (ctx) => {
                        toast.error(
                            ctx.error.name || ctx.error.statusText || 'Failed to enable Two Factor Authentication',
                            {
                                id: 'enable-2fa-toast',
                                description:
                                    ctx.error.message ||
                                    'An error occurred while enabling Two Factor Authentication. Please try again later.'
                            }
                        );
                    }
                }
            });
            if (data) {
                setIs2FAURI(data.totpURI);
                setIsQRDialogActive(true);
                setpwdDialog(false);
            }
        } else {
            await authClient.twoFactor.disable({
                password,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading('Disabling Two Factor Authentication...', {
                            id: 'disable-2fa-toast',
                            description: 'We are requesting our server to disable  Two Factor Authentication for you.'
                        });
                    },
                    onSuccess: () => {
                        toast.success('Two Factor Authentication Disabled Successfully', {
                            id: 'disable-2fa-toast',
                            description: 'You have successfully disabled Two Factor Authentication for your account.'
                        });
                        setIs2FAEnabled(false);
                        setIs2FAURI(null);
                        setpwdDialog(false);
                    },
                    onError: (ctx) => {
                        toast.error(
                            ctx.error.name || ctx.error.statusText || 'Failed to disable  Two Factor Authentication',
                            {
                                id: 'disable-2fa-toast',
                                description:
                                    ctx.error.message ||
                                    'An error occurred while disabling Two Factor Authentication. Please try again later.'
                            }
                        );
                    }
                }
            });
        }
        setIsLoading(false);
    }

    async function handleOTPVerification(values: z.infer<typeof otpSchema>) {
        const { otp } = values;
        if (!otp) {
            return toast.error('OTP is required');
        }
        setIsLoading(true);
        await authClient.twoFactor.verifyTotp({
            code: otp,
            fetchOptions: {
                onRequest: () => {
                    toast.loading('Verifying OTP...', {
                        id: 'verify-otp-toast',
                        description: 'We are requesting our server to verify your OTP.'
                    });
                },
                onSuccess: () => {
                    toast.success('OTP Verified Successfully', {
                        id: 'verify-otp-toast',
                        description: 'You have successfully verified your OTP.'
                    });
                    setIs2FAEnabled(true);
                    setIs2FAURI(null);
                    setpwdDialog(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.name || ctx.error.statusText || 'Failed to verify OTP', {
                        id: 'verify-otp-toast',
                        description:
                            ctx.error.message || 'An error occurred while verifying OTP. Please try again later.'
                    });
                }
            }
        });
        setIsLoading(false);
    }

    useEffect(() => {
        const otp = formOTP.getValues('otp');
        if (otp.length === 6) {
            formOTP.handleSubmit(handleOTPVerification)();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formOTP.watch('otp')]);

    if (!user) {
        return null;
    }

    return (
        <Card>
            <CardHeader className='pb-3'>
                <div className='flex items-center gap-2'>
                    <Shield className='text-muted-foreground h-5 w-5' />
                    <CardTitle>Two-Factor Authentication</CardTitle>
                </div>
                <CardDescription>Add an extra layer of security to your account by enabling 2FA.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className='flex items-center justify-between'>
                    <div className='flex w-full items-center'>
                        {!is2FAEnabled ? (
                            <Alert className='border border-sky-600 bg-sky-100 dark:border-sky-500 dark:bg-sky-600/20'>
                                <AlertTitle className='flex items-center justify-start gap-2 text-lg'>
                                    <AlertCircle className='size-7 text-sky-400' />
                                    Two-Factor Authentication Not Enabled
                                </AlertTitle>
                                <AlertDescription>
                                    Your account is currently vulnerable. Enable Two-Factor Authentication (2FA) to add
                                    an extra layer of security and protect your data from unauthorized access.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert className='border border-emerald-500 bg-emerald-50 dark:bg-emerald-600/20'>
                                <AlertTitle className='flex items-center justify-start gap-2'>
                                    <CheckCircle className='size-7 text-emerald-400' />
                                    Two-Factor Authentication Enabled
                                </AlertTitle>
                                <AlertDescription>
                                    Your account is secured with Two-Factor Authentication (2FA). A verification code is
                                    required in addition to your password when logging in—enhancing your account’s
                                    protection against unauthorized access.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className='flex flex-col gap-2'>
                <Dialog open={ispwdDialog} onOpenChange={setpwdDialog}>
                    <DialogTrigger asChild>
                        <Button
                            variant={is2FAEnabled ? 'destructive' : 'default'}
                            className='w-full text-white'
                            disabled={isLoading || !!is2FAURI}
                            onClick={() => setpwdDialog(true)}>
                            {is2FAEnabled ? 'Disable' : 'Set Up'} Two-Factor Authentication
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Your Identity</DialogTitle>
                            <DialogDescription>
                                To proceed with this action, please enter your account password. This step ensures that
                                only you can manage your Two-Factor Authentication settings.
                                <span className='text-foreground border-primary bg-primary/10 dark:bg-primary/30 block border-l-4 p-3 text-sm italic'>
                                    For your security, we need to verify it&#39;s really you.
                                </span>
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                                <FormField
                                    control={form.control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    id='password'
                                                    placeholder='Enter Your Password'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                This is your account password used for signing in. We require it to
                                                verify your identity before continuing.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type='submit' className='text-white' disabled={isLoading}>
                                        {isLoading && <Loader2 className='size-5 animate-spin' />}
                                        Submit
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                {is2FAURI && (
                    <Dialog open={isQRDialogActive} onOpenChange={setIsQRDialogActive}>
                        <DialogTrigger asChild>
                            {!is2FAEnabled && (
                                <Button variant='outline' className='w-full' disabled={isLoading}>
                                    View QR Code
                                </Button>
                            )}
                        </DialogTrigger>
                        <DialogContent className='max-w-sm rounded-2xl p-6 shadow-lg md:max-w-xl'>
                            <DialogHeader>
                                <DialogTitle className='mb-2 text-center text-xl font-bold'>
                                    Two-Factor Authentication Setup
                                </DialogTitle>
                                <DialogDescription className='mb-2 text-center text-slate-500 dark:text-slate-200'>
                                    Scan this QR code with your authenticator app to enable Two-Factor Authentication
                                </DialogDescription>
                            </DialogHeader>
                            <div className='flex flex-col gap-4 md:flex-row'>
                                <div className='mb-2 flex flex-1 justify-center'>
                                    <QRCode
                                        className='rounded-lg border-2 p-2.5 shadow-sm dark:invert-100'
                                        value={is2FAURI}
                                    />
                                </div>
                                <Form {...formOTP}>
                                    <form
                                        onSubmit={formOTP.handleSubmit(handleOTPVerification)}
                                        className='flex flex-col items-center justify-center space-y-4'>
                                        <FormField
                                            control={formOTP.control}
                                            name='otp'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className='mb-1 text-sm font-medium text-slate-500 dark:text-slate-200'>
                                                        Enter the 6-digit OTP
                                                    </FormLabel>
                                                    <FormControl>
                                                        <div className='mx-auto flex items-center gap-2'>
                                                            <InputOTP
                                                                maxLength={6}
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                disabled={isLoading}
                                                                pattern={REGEXP_ONLY_DIGITS}
                                                                className='mx-auto'>
                                                                <InputOTPGroup className='gap-1 rounded-none'>
                                                                    {Array.from({ length: 6 }).map((_, index) => (
                                                                        <InputOTPSlot
                                                                            className='border-foreground/20 rounded-lg border-2 shadow-none'
                                                                            index={index}
                                                                            key={'slot' + index + index}
                                                                        />
                                                                    ))}
                                                                </InputOTPGroup>
                                                            </InputOTP>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className='mt-1 text-sm text-red-500' />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type='submit'
                                            size='sm'
                                            className='w-full bg-blue-600 text-white transition-colors hover:bg-blue-700'
                                            disabled={isLoading}>
                                            {isLoading ? <Loader2 className='size-5 animate-spin' /> : 'Submit'}
                                        </Button>
                                    </form>
                                </Form>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
            </CardFooter>
        </Card>
    );
}
