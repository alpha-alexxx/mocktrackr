'use client';

import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInvalidateQueries } from '@/hooks/use-invalidate';
import { authClient } from '@/lib/authentication/auth-client';
import { cn } from '@/lib/utils';

import type { Session } from 'better-auth';
import { format as formatDate } from 'date-fns';
import { LogOutIcon, Monitor, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { UAParser } from 'ua-parser-js';

interface SessionListSectionProps {
    /** All sessions data and the current session marker */
    allSessions: {
        currentSession: Session;
        allSessions: Session[];
    };
}

/**
 * Renders a list of active sessions and allows terminating them.
 * - Terminate a single session
 * - Terminate all sessions
 * - Terminate all other sessions
 *
 * Immediately refreshes the page data on success to reflect changes.
 */
export default function SessionListSection({ allSessions }: SessionListSectionProps) {
    const { allSessions: sessions, currentSession } = allSessions;
    const router = useRouter();
    const { invalidateSessions } = useInvalidateQueries();

    /**
     * Parses user agent and returns a UAParser instance.
     */
    const getDevice = (userAgent: string) => new UAParser(userAgent);

    /**
     * Terminates a specific session by its token.
     * @param token Session token to revoke
     */
    const handleTerminateOne = async (token: string) => {
        if (!token) {
            toast.error('Session token missing', {
                id: 'session-terminate-toast',
                description: 'Cannot sign out without a valid session token.'
            });

            return;
        }

        await authClient.revokeSession({
            token,
            fetchOptions: {
                onRequest: () => {
                    toast.loading('Signing out…', {
                        id: 'session-terminate-toast',
                        description: 'Signing you out from this device…'
                    });
                },
                onSuccess: () => {
                    toast.success('Signed out', {
                        id: 'session-terminate-toast',
                        description: 'You have been signed out from this session.'
                    });
                    invalidateSessions();
                    router.refresh();
                },
                onError: (ctx) => {
                    toast.error('Sign-out failed', {
                        id: 'session-terminate-toast',
                        description: ctx.error.message || 'Please try again.'
                    });
                }
            }
        });
    };

    /**
     * Terminates either all sessions or all other sessions.
     * @param scope 'all' | 'other'
     */
    const handleTerminateMultiple = async (scope: 'all' | 'other') => {
        if (scope === 'all') {
            await authClient.revokeSessions({
                fetchOptions: {
                    onRequest: () => {
                        toast.loading('Revoking all sessions…', { id: 'sessions-terminate-toast' });
                    },
                    onSuccess: () => {
                        toast.success('All sessions revoked', { id: 'sessions-terminate-toast' });
                        invalidateSessions();
                        router.push('/login');
                    },
                    onError: (ctx) => {
                        toast.error('Failed to revoke sessions', {
                            id: 'sessions-terminate-toast',
                            description: ctx.error.message ?? 'Please try again.'
                        });
                    }
                }
            });
        } else {
            await authClient.revokeOtherSessions({
                fetchOptions: {
                    onRequest: () => {
                        toast.loading('Signing out from other devices…', { id: 'sessions-terminate-toast' });
                    },
                    onSuccess: () => {
                        toast.success('Signed out on other devices', { id: 'sessions-terminate-toast' });
                        invalidateSessions();
                        router.refresh();
                    },
                    onError: (ctx) => {
                        toast.error('Failed to sign out other sessions', {
                            id: 'sessions-terminate-toast',
                            description: ctx.error.message ?? 'Please try again.'
                        });
                    }
                }
            });
        }
    };

    return (
        <Card>
            <CardHeader className='flex flex-col items-center justify-between lg:flex-row'>
                <div>
                    <CardTitle>Active Sessions</CardTitle>
                    <CardDescription>Devices currently logged into your account.</CardDescription>
                </div>

                <div className='flex gap-2'>
                    <Button size='sm' variant='secondary' onClick={() => handleTerminateMultiple('other')}>
                        Terminate other sessions
                    </Button>
                    <Button size='sm' variant='destructive' onClick={() => handleTerminateMultiple('all')}>
                        Terminate all sessions
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <div className='space-y-2'>
                    {sessions.map((session) => {
                        const ua = getDevice(session.userAgent || '');
                        const isCurrent = session.id === currentSession.id;
                        const deviceType =
                            ua.getDevice().type === 'mobile' ? (
                                <Smartphone className='size-5' />
                            ) : (
                                <Monitor className='size-5' />
                            );

                        return (
                            <div
                                key={session.id}
                                className={cn('flex items-center justify-between rounded-lg border-2 p-3', {
                                    'border-green-300 bg-green-50 dark:border-green-400/50 dark:bg-green-600/20':
                                        isCurrent
                                })}>
                                <div className='flex items-center gap-4'>
                                    <div className='bg-muted flex h-10 w-10 items-center justify-center rounded-full'>
                                        {deviceType}
                                    </div>
                                    <div>
                                        <div className='flex items-center gap-2'>
                                            <p className='font-medium'>
                                                {ua.getOS().name}, {ua.getBrowser().name}
                                            </p>
                                            {isCurrent && <Badge className='bg-emerald-500'>Current</Badge>}
                                        </div>
                                        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                                            <span>{session.ipAddress ?? 'No IP'}</span>
                                            <span>•</span>
                                            <span>{formatDate(session.updatedAt, 'dd/MM/yy hh:mm a')}</span>
                                        </div>
                                    </div>
                                </div>

                                {!isCurrent && (
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        className='gap-1'
                                        onClick={() => handleTerminateOne(session.token)}>
                                        <LogOutIcon className='size-4' />
                                        Terminate
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
