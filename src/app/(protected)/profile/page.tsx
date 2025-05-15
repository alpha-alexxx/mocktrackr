'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import ErrorComponent from '@/components/app-ui/error';
import ChangePasswordSection from '@/components/pages/profile/ChangePasswordSection';
import { DangerZone } from '@/components/pages/profile/DangerZoneSection';
import SessionListSection from '@/components/pages/profile/SessionListSection';
import TwoFactorAuthSection from '@/components/pages/profile/TwoFactorAuthSection';
import UserHeaderSection from '@/components/pages/profile/UserHeaderSection';
import { useSession, useSessions } from '@/hooks/use-auth-query';

import { Book } from 'lucide-react';

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
    if (sessionError) {
        return <ErrorComponent error={sessionError} />;
    }
    if (sessionsError) {
        return <ErrorComponent error={sessionsError} />;
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
            <div className='space-y-4'>
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
        <div className='bg-background flex size-full flex-col items-center justify-center'>
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
