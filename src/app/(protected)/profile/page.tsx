'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import ChangePasswordSection from '@/components/pages/profile/ChangePasswordSection';
import { DangerZone } from '@/components/pages/profile/DangerZoneSection';
import SessionListSection from '@/components/pages/profile/SessionListSection';
import TwoFactorAuthSection from '@/components/pages/profile/TwoFactorAuthSection';
import UserHeaderSection from '@/components/pages/profile/UserHeaderSection';
import { Button } from '@/components/ui/button';
import { useSession, useSessions } from '@/hooks/use-auth-query';

import { AlertTriangle, Book } from 'lucide-react';

export default function ProfilePage() {
    const router = useRouter();
    const { data: session, isLoading: sessionLoading, error: sessionError } = useSession();
    const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useSessions();
    useEffect(() => {
        if (!session && !sessionLoading) {
            router.replace('/login');
        }
    }, [session, sessionLoading, router]);

    if (sessionLoading || sessionsLoading) {
        return <Loading />;
    }
    if (sessionError || sessionsError) {
        return <div>Error loading profile data.</div>;
    }
    if (!session) {
        return null;
    }

    const allSessions = {
        currentSession: session.session,
        allSessions: sessions
    };

    return (
        <div className='flex flex-col items-center justify-center p-4'>
            <div className='max-w-4xl space-y-4'>
                <UserHeaderSection user={session.user} />
                <SessionListSection allSessions={allSessions} />
                <div className='grid gap-8 md:grid-cols-2'>
                    <TwoFactorAuthSection user={session.user} />
                    <ChangePasswordSection />
                </div>
                <DangerZone />
            </div>
        </div>
    );
}

function Loading() {
    return (
        <div className='bg-background flex min-h-screen flex-col items-center justify-center'>
            <div className='flex flex-col items-center space-y-4'>
                <div className='relative'>
                    <Book className='text-primary h-16 w-16 animate-pulse' />
                    <span className='sr-only'>MockTrackr</span>
                </div>
                <h1 className='text-2xl font-bold tracking-tight'>MockTrackr</h1>
                <div className='flex items-center space-x-2'>
                    <div
                        className='bg-primary h-2 w-2 animate-bounce rounded-full'
                        style={{ animationDelay: '0ms' }}></div>
                    <div
                        className='bg-primary h-2 w-2 animate-bounce rounded-full'
                        style={{ animationDelay: '150ms' }}></div>
                    <div
                        className='bg-primary h-2 w-2 animate-bounce rounded-full'
                        style={{ animationDelay: '300ms' }}></div>
                </div>
                <p className='text-muted-foreground'>Loading resources...</p>
            </div>
        </div>
    );
}

function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const router = useRouter();
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className='bg-background flex min-h-screen flex-col items-center justify-center p-4'>
            <div className='flex max-w-md flex-col items-center space-y-6 text-center'>
                <div className='flex items-center space-x-2'>
                    <Book className='text-primary h-10 w-10' />
                    <h1 className='text-2xl font-bold tracking-tight'>MockTrackr</h1>
                </div>

                <div className='rounded-full bg-red-100 p-3 dark:bg-red-900/20'>
                    <AlertTriangle className='h-6 w-6 text-red-600 dark:text-red-400' />
                </div>

                <div className='space-y-2'>
                    <h2 className='text-xl font-semibold'>Something went wrong!</h2>
                    <p className='text-muted-foreground'>
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                    {error.digest && <p className='text-muted-foreground mt-2 text-xs'>Error ID: {error.digest}</p>}
                </div>

                <div className='flex flex-col gap-2 sm:flex-row'>
                    <Button variant='outline' onClick={() => router.refresh()}>
                        Refresh page
                    </Button>
                    <Button onClick={() => router.push('/dashboard')}>Go to dashboard</Button>
                </div>
            </div>
        </div>
    );
}
