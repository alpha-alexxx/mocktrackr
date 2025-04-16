'use client'
import React, { useState } from 'react';
import useCaptchaToken from '@/stores/captcha_token';
import { Turnstile } from '@marsidev/react-turnstile'

/**
 * CloudFlareCaptcha component renders a Cloudflare Turnstile captcha widget.
 * Provides user-friendly feedback for success and error states.
 * @component
 */
export default function CloudFlareCaptcha() {
    const { setToken } = useCaptchaToken();
    const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY as string;
    /**
     * Info state for displaying user feedback.
     * @type {[{type: 'success'|'error', title: string, message: string}|null, Function]}
     */
    const [info, setInfo] = useState<{
        type: 'success' | 'error';
        title: string;
        message: string;
    } | null>(null);

    React.useEffect(() => {
        if (!siteKey) {
            setInfo({
                type: 'error',
                title: 'Captcha Configuration Error',
                message: 'Captcha could not be loaded. Please reload the page or contact support if the issue persists.'
            });
        }
    }, [siteKey]);

    if (info && info.type === 'error') {
        return (
            <div className="w-full flex flex-col items-center justify-center bg-rose-50 dark:bg-rose-800/20 border border-rose-300 rounded-md p-4 mt-2">
                <h3 className="text-rose-700 font-semibold text-base mb-1">{info.title}</h3>
                <p className="text-rose-600 text-sm">{info.message}</p>
            </div>
        );
    } else if (info && info.type === 'success') {
        return (
            <div className="w-full flex flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-800/20 border border-emerald-300 rounded-md p-4 mt-2">
                <h3 className="text-emerald-700 font-semibold text-base mb-1">{info.title}</h3>
                <p className="text-emerald-600 text-sm">{info.message}</p>
            </div>
        );
    }

    return (
        <div className='w-full flex flex-col items-center justify-center'>
            <Turnstile
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
                        message: 'Captcha failed to load or verify. Please reload the page.'
                    });
                }}
            />

        </div>
    );
}
