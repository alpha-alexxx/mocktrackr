'use client';

import { useCallback, useEffect, useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import useCaptchaToken from '@/stores/captcha_token';

/**
 * CloudFlareCaptcha renders the Cloudflare Turnstile captcha widget
 * with automatic token resets and user-friendly feedback handling.
 *
 * @component
 */
export default function CloudFlareCaptcha() {
    const { captchaToken, setToken } = useCaptchaToken();
    const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY as string;
    console.log('siteKey:', siteKey);
    const [key, setKey] = useState(Date.now()); // Forces widget re-render
    const [info, setInfo] = useState<{
        type: 'success' | 'error';
        title: string;
        message: string;
    } | null>(null);

    /**
     * Resets the CAPTCHA widget by:
     * - Regenerating its key
     * - Clearing the captcha token
     * - Resetting feedback messages
     */
    const resetCaptcha = useCallback(() => {
        setKey(Date.now());
        setToken('');
        setInfo(null);
    }, [setToken]);

    // Initial validation for missing siteKey
    useEffect(() => {
        if (!siteKey) {
            console.error('Missing NEXT_PUBLIC_CLOUDFLARE_SITE_KEY in environment variables');
            setInfo({
                type: 'error',
                title: 'Captcha Configuration Error',
                message: 'Captcha could not be loaded. Please reload or contact support.',
            });
        }

        // Automatically reset CAPTCHA after 5 minutes of inactivity
        const resetTimer = setTimeout(resetCaptcha, 300_000);

        return () => clearTimeout(resetTimer);
    }, [siteKey, resetCaptcha]);

    // Reactively reset captcha if token is removed externally
    useEffect(() => {
        if (!captchaToken) {
            resetCaptcha();
        }
    }, [captchaToken, resetCaptcha]);

    // Render feedback messages (success or error)
    if (info) {
        const baseClasses =
            'mt-2 flex w-full flex-col items-center justify-center rounded-md border p-4 text-center';
        const styles =
            info.type === 'success'
                ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-800/20 text-emerald-700 dark:text-emerald-300'
                : 'border-rose-300 bg-rose-50 dark:bg-rose-800/20 text-rose-700 dark:text-rose-300';

        return (
            <div
                role="alert"
                aria-live="assertive"
                className={`${baseClasses} ${styles}`}
            >
                <h3 className="mb-1 text-base font-semibold">{info.title}</h3>
                <p className="text-sm">
                    {info.message}
                </p>

                {/* Optional Reset Button */}
                {info.type === 'error' && (
                    <button
                        onClick={resetCaptcha}
                        className="mt-3 text-sm text-blue-600 hover:underline dark:text-blue-400"
                    >
                        Try Again
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col items-center justify-center">
            <Turnstile
                key={key}
                siteKey={siteKey}
                onSuccess={(token: string) => {
                    if (!captchaToken) {
                        setToken(token);
                        setInfo({
                            type: 'success',
                            title: 'Captcha Verified',
                            message: 'You have successfully completed the captcha.',
                        });
                    }
                }}
                onError={() => {
                    setInfo({
                        type: 'error',
                        title: 'Captcha Error',
                        message: 'Captcha failed to load or verify. Please try again.',
                    });
                    resetCaptcha();
                }}
                onExpire={() => {
                    setInfo({
                        type: 'error',
                        title: 'Captcha Expired',
                        message: 'Your verification expired. Please complete it again.',
                    });
                    resetCaptcha();
                }}
            />
        </div>
    );
}
