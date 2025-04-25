'use client';

import { useState } from 'react';

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
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/authentication/auth-client';
import { ExtendedUser } from '@/lib/authentication/auth-types';
import { otpSchema, passwordSchema } from '@/lib/authentication/zod-schema';
import { siteConfig } from '@/lib/site/site-config';
import { zodResolver } from '@hookform/resolvers/zod';

import { AlertCircle, CheckCircle, Loader, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { toast } from 'sonner';
import { z } from 'zod';

export default function TwoFactorAuthSection({ user }: { user: ExtendedUser }) {
    const [isLoading, setIsLoading] = useState(false);
    const [is2FAEnabled, _] = useState(!!user.twoFactorEnabled);
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
                        toast.loading('Enabling 2FA...', {
                            id: 'enable-2fa-toast',
                            description: 'We are requesting our server to enable 2FA for you.'
                        });
                    },
                    onSuccess: () => {
                        toast.success('2FA Enabled Successfully', {
                            id: 'enable-2fa-toast',
                            description: 'You have successfully enabled 2FA for your account.'
                        });
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.name || ctx.error.statusText || 'Failed to enable 2FA', {
                            id: 'enable-2fa-toast',
                            description:
                                ctx.error.message || 'An error occurred while enabling 2FA. Please try again later.'
                        });
                    }
                }
            });
            if (data) {
                setIs2FAURI(data.totpURI);
                setIsQRDialogActive(true);
            }
        } else {
            const { data } = await authClient.twoFactor.disable({
                password,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading('Disabling 2FA...', {
                            id: 'disable-2fa-toast',
                            description: 'We are requesting our server to disable 2FA for you.'
                        });
                    },
                    onSuccess: () => {
                        toast.success('2FA Disabled Successfully', {
                            id: 'disable-2fa-toast',
                            description: 'You have successfully disabled 2FA for your account.'
                        });
                        window.location.reload();
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.name || ctx.error.statusText || 'Failed to disable 2FA', {
                            id: 'disable-2fa-toast',
                            description:
                                ctx.error.message || 'An error occurred while disabling 2FA. Please try again later.'
                        });
                    }
                }
            });
        }
        setIsLoading(false);
    }

    async function handleOTPverification(values: z.infer<typeof otpSchema>) {
        const { otp } = values;
        if (!otp) {
            return toast.error('OTP is required');
        }
        setIsLoading(true);
        const { data } = await authClient.twoFactor.verifyTotp({
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
                    window.location.reload();
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
            <CardFooter>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant='outline' className='w-full' disabled={isLoading}>
                            {is2FAEnabled ? 'Disable' : 'Set Up'} Two-Factor Authentication
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Your Identity</DialogTitle>
                            <DialogDescription>
                                To proceed with this action, please enter your account password. This step ensures that
                                only you can manage your Two-Factor Authentication settings.
                                <span className='text-foreground block border-l-4 border-gray-500 bg-gray-50 p-3 text-sm italic dark:bg-gray-900'>
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
                                                <Input placeholder='Enter Your Password' {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                {' '}
                                                This is your account password used for signing in. We require it to
                                                verify your identity before continuing.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <DialogFooter>
                                    <Button type='submit' className='text-white' disabled={isLoading}>
                                        {isLoading && <Loader className='size-5' />}
                                        Submit
                                    </Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </CardFooter>

            {is2FAURI && (
                <Dialog open={isQRDialogActive} onOpenChange={setIsQRDialogActive}>
                    <DialogTrigger asChild>
                        <Button variant='outline' className='w-full' disabled={isLoading}>
                            View QR Code
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Two-Factor Authentication QR Code</DialogTitle>
                            <DialogDescription>
                                Scan this QR code with your authenticator app to set up Two-Factor Authentication.
                            </DialogDescription>
                        </DialogHeader>
                        <QRCode className='mx-auto' value={is2FAURI} />
                        <Form {...formOTP}>
                            <form onSubmit={formOTP.handleSubmit(handleOTPverification)} className='space-y-8'>
                                <FormField
                                    control={formOTP.control}
                                    name='otp'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>OTP</FormLabel>
                                            <FormControl>
                                                <div className='flex items-center justify-between gap-2'>
                                                    <Input
                                                        placeholder='Enter Your TOTP from authenticator app'
                                                        {...field}
                                                    />
                                                    <Button
                                                        type='submit'
                                                        size={'sm'}
                                                        className='text-white'
                                                        disabled={isLoading}>
                                                        {isLoading && <Loader className='size-5' />}
                                                        Submit
                                                    </Button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </DialogContent>
                    <DialogFooter></DialogFooter>
                </Dialog>
            )}
        </Card>
    );
}
