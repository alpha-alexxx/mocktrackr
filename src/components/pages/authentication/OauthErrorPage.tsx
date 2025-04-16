'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { siteConfig } from '@/lib/site/site-config';

import { ArrowLeft, Terminal } from 'lucide-react';

export default function OAuthErrorPage() {
    return (
        <Suspense fallback={<OAuthErrorPageSkeleton />}>
            <OAuthErrorPageContent />
        </Suspense>
    );
}

function OAuthErrorPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');




    // Optional: custom messages for known error types
    const getFriendlyMessage = (errorCode: string | null) => {
        switch (errorCode) {
            case 'OAuthAccountNotLinked':
                return 'This email is already linked with another provider. Please try signing in using that method.';
            case 'AccessDenied':
                return 'You denied the OAuth permission request. Please try again.';
            case 'Configuration':
                return 'There’s a misconfiguration with the OAuth provider. Contact the admin.';
            case 'Verification':
                return 'The verification link is expired or invalid. Please try again.';
            default:
                return 'Something went wrong during authentication. Please try again or contact support.';
        }
    };

    return (
        <main className='bg-background text-foreground flex min-h-screen items-center justify-center px-4'>
            <div className='w-full max-w-md space-y-6 text-center'>
                {/* Branding */}
                <div className='text-primary text-2xl font-bold tracking-tight'>{siteConfig.name || 'Auth Portal'}</div>

                {/* Alert Box */}
                <Alert variant='destructive' className='border-primary/30 border shadow-md'>
                    <Terminal className='text-primary h-5 w-5' />
                    <AlertTitle className='text-lg font-semibold'>Authentication Error</AlertTitle>
                    <AlertDescription>{getFriendlyMessage(error)}</AlertDescription>
                </Alert>

                {/* Suggestions */}
                <div className='text-muted-foreground text-sm'>
                    <p>
                        If the issue persists, you can contact{' '}
                        <a href={siteConfig.supportEmail} className='text-primary underline underline-offset-4'>
                            support
                        </a>{' '}
                        for assistance.
                    </p>
                </div>

                {/* Actions */}
                <div className='flex justify-center gap-2 pt-2'>
                    <Button variant='outline' onClick={() => router.back()}>
                        <ArrowLeft className='mr-2 h-4 w-4' />
                        Go Back
                    </Button>
                    <Button onClick={() => router.push('/login')}>Return to Login</Button>
                </div>
            </div>
        </main>
    );
}

function OAuthErrorPageSkeleton() {
    return (
        <main className='bg-background text-foreground flex min-h-screen items-center justify-center px-4'>
            <div className='w-full max-w-md space-y-6 text-center'>
                {/* Branding */}
                <Skeleton className='mx-auto h-8 w-48' />

                {/* Alert Box */}
                <div className='border-primary/30 border p-4 shadow-md rounded-lg space-y-2'>
                    <Skeleton className='h-5 w-5 mx-auto' />
                    <Skeleton className='h-6 w-48 mx-auto' />
                    <Skeleton className='h-4 w-64 mx-auto' />
                </div>

                {/* Suggestions */}
                <div className='space-y-2'>
                    <Skeleton className='h-4 w-72 mx-auto' />
                </div>

                {/* Actions */}
                <div className='flex justify-center gap-2 pt-2'>
                    <Skeleton className='h-10 w-24' />
                    <Skeleton className='h-10 w-28' />
                </div>
            </div>
        </main>
    );
}
