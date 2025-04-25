'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient } from '@/lib/authentication/auth-client';
import { cn } from '@/lib/utils';

import type { Session } from 'better-auth';
import { formatDate } from 'date-fns';
import { BadgeIcon, LogOutIcon, Monitor, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { UAParser } from 'ua-parser-js';

/**
 *
 * @param userAgent
 * @returns item
 */
const getDevice = (userAgent: string) => {
    const item = new UAParser(userAgent);

    return item;
};

export default function SessionListSection({
    allSessions
}: {
    allSessions: { currentSession: Session; allSessions: Session[] };
}) {
    const { allSessions: sessions, currentSession } = allSessions;
    const router = useRouter();

    const revokeSession = async (token: string) => {
        if (!token) {
            toast.error('Failed to sign out from this session', {
                id: 'session-toast',
                description: 'A valid session token is required to sign out.'
            });

            return;
        }
        await authClient.revokeSession({
            token,
            fetchOptions: {
                onRequest: () => {
                    toast.loading('Signing out from this session...', {
                        id: 'session-toast',
                        description: 'Please wait while we sign you out.'
                    });
                },
                onSuccess: () => {
                    toast.success('Session signed out successfully', {
                        id: 'session-toast',
                        description: 'You have been signed out from this session.'
                    });
                },
                onError: (ctx) => {
                    toast.error('Failed to sign out from this session', {
                        id: 'session-toast',
                        description: ctx.error.message || 'An error occurred while signing out. Please try again.'
                    });
                }
            }
        });
    };
    const revokeSessions = async (which: 'all' | 'other') => {
        if (which === 'all') {
            await authClient.revokeSessions({
                fetchOptions: {
                    onRequest: () => {
                        toast.loading('Revoking all session...', {
                            id: 'all-session-toast'
                        });
                    },
                    onSuccess: () => {
                        toast.success('all session revoked successfully', {
                            id: 'all-session-toast'
                        });
                        router.push('/login');
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || 'Failed to revoke sessions', {
                            id: 'all-session-toast'
                        });
                    }
                }
            });
        } else {
            await authClient.revokeOtherSessions({
                fetchOptions: {
                    onRequest: () => {
                        toast.loading('Signing out from other devices...', {
                            id: 'other-session-toast'
                        });
                    },
                    onSuccess: () => {
                        toast.success('Session signed out successfully from other devices', {
                            id: 'other-session-toast'
                        });
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || 'Failed to sign out from this session', {
                            id: 'other-session-toast'
                        });
                    }
                }
            });
        }
    };

    return (
        <Card>
            <CardHeader className='flex flex-col items-center justify-between lg:flex-row'>
                <div className='flex flex-col'>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>
                        These are the devices that are currently logged into your account.
                    </CardDescription>
                </div>
                <div className='flex flex-row gap-2'>
                    <Button variant={'secondary'} size={'sm'} onClick={() => revokeSessions('other')}>
                        Revoke other sessions
                    </Button>

                    <Button variant={'destructive'} size={'sm'} onClick={() => revokeSessions('all')}>
                        Revoke all sessions
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-2'>
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={cn('flex items-center justify-between rounded-lg border-2 p-3', {
                                'border-green-300 bg-green-50 dark:border-green-400/50 dark:bg-green-600/20':
                                    session.id === currentSession.id
                            })}>
                            <div className='flex items-center gap-4'>
                                <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
                                    {getDevice(session.userAgent || '').getDevice().type === 'mobile' ? (
                                        <Smartphone className='size-5' />
                                    ) : (
                                        <Monitor className='size-5' />
                                    )}
                                </div>
                                <div>
                                    <div className='flex items-center gap-2'>
                                        <p className='font-medium'>
                                            {getDevice(session.userAgent || '').getOS().name},{' '}
                                            {getDevice(session.userAgent || '').getBrowser().name}
                                        </p>
                                        {session.id === currentSession.id && (
                                            <Badge className='bg-green-500 text-white'>Current</Badge>
                                        )}
                                    </div>
                                    <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                                        <span>{session.ipAddress || 'No IP'}</span>
                                        <span>•</span>
                                        <span>{formatDate(session.updatedAt, 'dd/MM/yy hh:mm a')}</span>
                                    </div>
                                </div>
                            </div>
                            {session.id !== currentSession.id && (
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='gap-1'
                                    onClick={() => revokeSession(session.token)}>
                                    <LogOutIcon className='size-4' />
                                    <span>Sign Out</span>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
