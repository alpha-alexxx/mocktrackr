'use client';

import React, { useCallback, useEffect, useState } from 'react';

import useCaptchaToken from '@/stores/captcha_token';
import { Turnstile } from '@marsidev/react-turnstile';

/**
 * CloudFlareCaptcha component renders a Cloudflare Turnstile captcha widget.
 * Provides user-friendly feedback for success and error states with auto-reset functionality.
 * @component
 */
export default function CloudFlareCaptcha() {
    const { captchaToken, setToken } = useCaptchaToken();
    const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY as string;
    const [key, setKey] = useState(Date.now()); // Key for forcing re-render
    /**
     * Info state for displaying user feedback.
     * @type {[{type: 'success'|'error', title: string, message: string}|null, Function]}
     */
    const [info, setInfo] = useState<{
        type: 'success' | 'error';
        title: string;
        message: string;
    } | null>(null);

    // Check for missing captchaToken and reload if needed
    useEffect(() => {
        if (!captchaToken) {
            resetCaptcha();
        }
    }, [captchaToken]);

    const resetCaptcha = useCallback(() => {
        setKey(Date.now()); // Generate new key to force re-render
        setToken(''); // Clear the token
        setInfo(null); // Reset info state
    }, [setToken]);

    useEffect(() => {
        if (!siteKey) {
            setInfo({
                type: 'error',
                title: 'Captcha Configuration Error',
                message: 'Captcha could not be loaded. Please reload the page or contact support if the issue persists.'
            });
        }

        // Reset captcha after 5 minutes of inactivity
        const resetTimer = setTimeout(resetCaptcha, 300000);

        return () => clearTimeout(resetTimer);
    }, [siteKey, resetCaptcha]);

    if (info && info.type === 'error') {
        return (
            <div className='mt-2 flex w-full flex-col items-center justify-center rounded-md border border-rose-300 bg-rose-50 p-4 dark:bg-rose-800/20'>
                <h3 className='mb-1 text-base font-semibold text-rose-700'>{info.title}</h3>
                <p className='text-sm text-rose-600'>{info.message}</p>
            </div>
        );
    } else if (info && info.type === 'success') {
        return (
            <div className='mt-2 flex w-full flex-col items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 p-4 dark:bg-emerald-800/20'>
                <h3 className='mb-1 text-base font-semibold text-emerald-700'>{info.title}</h3>
                <p className='text-sm text-emerald-600'>{info.message}</p>
            </div>
        );
    }

    return (
        <div className='flex w-full flex-col items-center justify-center'>
            <Turnstile
                key={key}
                siteKey={siteKey}
                onSuccess={(ctx) => {
                    setToken(ctx);
                    setInfo({
                        type: 'success',
                        title: 'Captcha Verified',
                        message: 'You have successfully completed the captcha.'
                    });
                }}
                onError={() => {
                    setInfo({
                        type: 'error',
                        title: 'Captcha Error',
                        message: 'Captcha failed to load or verify. Please try again.'
                    });
                    resetCaptcha();
                }}
                onExpire={() => {
                    setInfo({
                        type: 'error',
                        title: 'Captcha Expired',
                        message: 'Your verification has expired. Please complete the captcha again.'
                    });
                    resetCaptcha();
                }}
            />
        </div>
    );
}
