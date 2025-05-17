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

import Loader from '@/components/app-ui/loader';

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
        return <Loader />;
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
        <div className='flex flex-col items-center justify-center'>
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
