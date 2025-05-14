'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { AuthFooterLinks } from '@/components/app-ui/auth/AuthFooterLinks';
import { AuthFormWrapper } from '@/components/app-ui/auth/AuthFormWrapper';
import { AuthIllustration } from '@/components/app-ui/auth/AuthIllustration';
import { AuthLayout } from '@/components/app-ui/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { authClient } from '@/lib/authentication/auth-client';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { Info, Loader2, Smartphone } from 'lucide-react';
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
    otp: z
        .string()
        .length(6, { message: 'OTP must be exactly 6 digits.' })
        .regex(/^\d+$/, { message: 'OTP must contain only numbers.' }),
    trustDevice: z.boolean().optional()
});

export default function TwoFactorOTPAuthPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState<'totp' | 'email'>('totp');

    const form = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
            trustDevice: false
        }
    });

    /**
     * Handles the verification of the OTP code
     * @param {string} code - The OTP code to verify
     */
    const handleVerification = async (values: z.infer<typeof otpSchema>) => {
        const { otp: code, trustDevice } = values;
        setIsLoading(true);
        try {
            const verifyFunction =
                verificationMethod === 'totp' ? authClient.twoFactor.verifyTotp : authClient.twoFactor.verifyOtp;

            await verifyFunction({
                code,
                trustDevice,
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
                    }
                }
            });
        } finally {
            setIsLoading(false);
        }
    };

    const requestOTPOnMail = async () => {
        await authClient.twoFactor.sendOtp({
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch('otp')]);

    const footerLinks = [{ label: 'Back to Login', href: '/login' }];

    return (
        <AuthLayout
            illustration={
                <AuthIllustration
                    src='/illustrations/two-factor.png'
                    alt='Two-factor authentication illustration'
                    width={600}
                    height={800}
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
                        className={cn('flex-1', verificationMethod === 'totp' ? 'text-white' : 'text-foreground')}>
                        Authenticator App
                    </Button>
                    <Button
                        type='button'
                        variant={verificationMethod === 'email' ? 'default' : 'outline'}
                        onClick={() => {
                            setVerificationMethod('email');
                            requestOTPOnMail();
                        }}
                        className={cn('flex-1', verificationMethod === 'email' ? 'text-white' : 'text-foreground')}>
                        Email Code
                    </Button>
                </div>

                <FormField
                    control={form.control}
                    name='otp'
                    render={({ field }) => (
                        <FormItem className='flex flex-col items-center'>
                            <FormLabel>Verification Code</FormLabel>
                            <FormControl>
                                <InputOTP
                                    maxLength={6}
                                    value={field.value}
                                    onChange={field.onChange}
                                    disabled={isLoading}
                                    pattern={REGEXP_ONLY_DIGITS}>
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
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='trustDevice'
                    render={({ field }) => (
                        <FormItem className='flex flex-row items-center space-y-0 space-x-2'>
                            <FormControl>
                                <Switch
                                    className='data-[state=checked]:dark:bg-blue-600'
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormLabel className='flex items-center gap-x-2 text-sm font-normal'>
                                Mark this device as trusted
                                <Popover>
                                    <PopoverTrigger>
                                        <Info className='size-4' />
                                    </PopoverTrigger>
                                    <PopoverContent className='border-foreground/20 border-2 text-sm'>
                                        You won’t be asked for a verification code again on this device for the next{' '}
                                        <strong>60 days</strong>.
                                        <br />
                                        <span className='text-xs italic'>
                                            Note: Recommended only on <strong>personal devices</strong>.
                                        </span>
                                    </PopoverContent>
                                </Popover>
                            </FormLabel>
                        </FormItem>
                    )}
                />
                <Button type='submit' className='mt-4 w-full text-white' disabled={isLoading}>
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
                    <p className='text-muted-foreground mt-2 text-center text-sm'>
                        Didn&apos;t receive the code?{' '}
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
