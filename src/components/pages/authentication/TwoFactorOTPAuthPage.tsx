'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { AuthFooterLinks } from '@/components/app-ui/auth/AuthFooterLinks';
import { AuthFormWrapper } from '@/components/app-ui/auth/AuthFormWrapper';
import { AuthIllustration } from '@/components/app-ui/auth/AuthIllustration';
import { AuthLayout } from '@/components/app-ui/auth/AuthLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { authClient } from '@/lib/authentication/auth-client';
import { siteConfig } from '@/lib/site/site-config';
import { zodResolver } from '@hookform/resolvers/zod';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Loader2, Smartphone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

/**
 * TwoFactorOTPAuthPage Component
 *
 * A professional two-factor authentication page that allows users to enter their OTP code.
 * Features:
 * - 6-digit OTP input with auto-focus and validation
 * - Automatic submission on complete entry
 * - Manual submit button as fallback
 * - Loading states and error handling
 * - Clear user instructions
 *
 * @returns {JSX.Element} The rendered two-factor authentication page
 */
const otpSchema = z.object({
    otp: z.string().min(6, {
        message: 'Your one-time password must be 6 characters.'
    })
});

export default function TwoFactorOTPAuthPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [verificationMethod, setVerificationMethod] = useState<'totp' | 'email'>('totp');

    const form = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: ''
        }
    });

    /**
     * Handles the verification of the OTP code
     * @param {string} code - The OTP code to verify
     */
    const handleVerification = async (values: z.infer<typeof otpSchema>) => {
        const { otp } = values;
        setIsLoading(true);
        setError('');

        try {
            const verifyFunction =
                verificationMethod === 'totp' ? authClient.twoFactor.verifyTotp : authClient.twoFactor.verifyOtp;

            await verifyFunction({
                code: otp,
                fetchOptions: {
                    onRequest: () => {
                        toast.loading('Verifying OTP...', {
                            id: 'two-factor-toast'
                        });
                    },
                    onSuccess: () => {
                        toast.success('Verification successful', {
                            description: 'Redirecting to dashboard...',
                            id: 'two-factor-toast'
                        });
                        router.push('/dashboard');
                    },
                    onError: (ctx) => {
                        toast.error('Verification failed', {
                            description: ctx.error.message,
                            id: 'two-factor-toast'
                        });
                        setError(ctx.error.message || 'Failed to verify OTP');
                        throw new Error(ctx.error.message);
                    }
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const requestOTPOnMail = async () => {
        const { data, error } = await authClient.twoFactor.sendOtp({
            fetchOptions: {
                onRequest: () => {
                    toast.loading('Sending OTP...', {
                        id: 'two-factor-toast'
                    });
                },
                onSuccess: () => {
                    toast.success('OTP sent', {
                        description: 'Check your email for the OTP code',
                        id: 'two-factor-toast'
                    });
                },
                onError: (ctx) => {
                    toast.error('Failed to send OTP', {
                        description: ctx.error.message,
                        id: 'two-factor-toast'
                    });
                    setError(ctx.error.message || 'Failed to send OTP');
                    throw new Error(ctx.error.message);
                }
            }
        });
    };
    // Auto-submit when OTP is complete
    useEffect(() => {
        const otp = form.getValues('otp');
        if (otp.length === 6) {
            form.handleSubmit(handleVerification)();
        }
    }, [form.watch('otp')]);

    const footerLinks = [{ label: 'Back to Login', href: '/login' }];

    return (
        <AuthLayout
            illustration={
                <AuthIllustration
                    src='/illustrations/2fa.svg'
                    alt='Two-factor authentication illustration'
                    width={500}
                    height={500}
                />
            }>
            <AuthFormWrapper
                title='Two-Factor Authentication'
                description={
                    verificationMethod === 'totp'
                        ? 'Please check your authenticator app and enter the 6-digit code below'
                        : 'Please enter the 6-digit code sent to your email'
                }
                form={form}
                onSubmit={handleVerification}>
                <div className='mb-6 flex gap-4'>
                    <Button
                        type='button'
                        variant={verificationMethod === 'totp' ? 'default' : 'outline'}
                        onClick={() => setVerificationMethod('totp')}
                        className='flex-1'>
                        Authenticator App
                    </Button>
                    <Button
                        type='button'
                        variant={verificationMethod === 'email' ? 'default' : 'outline'}
                        onClick={() => {
                            setVerificationMethod('email');
                            requestOTPOnMail();
                        }}
                        className='flex-1'>
                        Email Code
                    </Button>
                </div>
                <FormField
                    control={form.control}
                    name='otp'
                    render={({ field }) => (
                        <FormItem className='flex flex-col items-center justify-center'>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                                <InputOTP
                                    maxLength={6}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isLoading}
                                    pattern={REGEXP_ONLY_DIGITS}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSeparator />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {error && (
                    <Alert variant='destructive'>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button type='submit' className='w-full text-white' disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Verifying...
                        </>
                    ) : (
                        <>
                            <Smartphone className='mr-2 h-4 w-4' />
                            Verify Code
                        </>
                    )}
                </Button>

                {verificationMethod === 'email' && (
                    <p className='text-muted-foreground text-center text-sm'>
                        Didn't receive the code?{' '}
                        <button
                            type='button'
                            onClick={requestOTPOnMail}
                            className='text-primary underline-offset-4 hover:underline'
                            disabled={isLoading}>
                            Resend code
                        </button>
                    </p>
                )}
            </AuthFormWrapper>

            <AuthFooterLinks links={footerLinks} className='mt-6' />
        </AuthLayout>
    );
}
