'use client';

import { useEffect, useMemo, useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { useInvalidateQueries } from '@/hooks/use-invalidate';
import { useIsClient } from '@/hooks/use-is-client';
import { useRecords } from '@/hooks/use-record';
import { cn } from '@/lib/utils';
import useDatePicker from '@/stores/date_picker';
import { DraftRecord, useFormStore } from '@/stores/form-store';

import { DraftCard } from './draft-card';
import { ListCard } from './list-card';
import type { User } from 'better-auth';
import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';
import { Plus, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

/* eslint-disable react-hooks/exhaustive-deps */

export default function Dashboard({ user }: { user: User }) {
    const { date } = useDatePicker();
    const [stateMessage, setStateMessage] = useState<string>('');
    const isClient = useIsClient();
    const { data: records, error: recordError, isLoading } = useRecords(user.id, date);
    const [drafts, setDrafts] = useState<DraftRecord[] | undefined>();
    const { listDraftRecords, showDrafts, setShowDrafts } = useFormStore();
    const { invalidateRecords } = useInvalidateQueries();

    useEffect(() => {
        const today = new Date().toLocaleDateString('en-IN');
        const selectedDate = new Date(date).toLocaleDateString('en-IN');
        const isToday = today === selectedDate;
        setStateMessage(isToday ? 'No records found for today.' : 'No records found on this day.');

        const fetchDrafts = async () => {
            const draftRecords = await listDraftRecords(date);
            setDrafts(draftRecords); // ← update your local state
        };

        fetchDrafts();

        const handleUpdate = () => fetchDrafts();
        window.addEventListener('drafts-updated', handleUpdate);

        return () => {
            window.removeEventListener('drafts-updated', handleUpdate);
        };
    }, [date]);

    useEffect(() => {
        if (isLoading) {
            toast.loading('Fetching your test records...', { id: 'fetch-toast' });
        } else if (records) {
            if (records.length === 0) {
                toast.info('No records found', { id: 'fetch-toast' });
            } else {
                toast.success('Records loaded successfully', { id: 'fetch-toast' });
            }
        } else if (recordError) {
            toast.error(recordError.message || 'Unable to fetch records', { id: 'fetch-toast' });
        }
    }, [isLoading, records, recordError]);

    // Calculate stats for the current day's records
    const dailyStats = useMemo(() => {
        if (!records || records.length === 0) return null;

        const totalTests = records.length;
        const avgScore =
            records.reduce((acc, record) => acc + (record.obtainedMarks / record.totalMarks) * 100, 0) / totalTests;

        return {
            totalTests,
            avgScore: Math.round(avgScore)
        };
    }, [records]);

    const refreshRecords = async () => {
        await invalidateRecords(user.id, date);
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className='container mx-auto max-w-7xl px-4 py-6'>
            {/* Header Section */}
            <div className='mb-6 flex flex-col flex-1 justify-between gap-4 md:flex-row md:items-center'>
                <div>
                    <h1 className='text-3xl font-bold'>👋 Welcome, {user.name}!</h1>
                    <p className='mt-1 text-gray-500'>{format(date, 'PPP', { locale: enIN })}</p>
                </div>
                <div className='flex items-center justify-center gap-2'>
                    <Button
                        className='group/record relative flex-1 md:flex-none cursor-pointer gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700'
                        size='lg'
                        asChild>
                        <Link href='/dashboard/create'>
                            <Plus className='size-5' strokeWidth={3} />
                            New Record
                        </Link>
                    </Button>
                    <Button
                        className='relative cursor-pointer gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700'
                        size='icon'
                        title='Refresh the records'
                        variant={'outline'}
                        onClick={refreshRecords}>
                        <RefreshCcw className='size-5' />
                    </Button>
                </div>
            </div>

            {/* Daily Stats & View Controls */}
            <div className='mb-6 flex w-full items-center justify-center gap-4'>
                {dailyStats ? (
                    <div className='flex w-full space-x-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40'>
                        <div>
                            <p className='mb-1 text-sm text-gray-500'>Tests Today</p>
                            <div className='flex items-center'>
                                <span className='text-2xl font-semibold'>{dailyStats.totalTests}</span>
                            </div>
                        </div>
                        <div>
                            <p className='mb-1 text-sm text-gray-500'>Average Score</p>
                            <div className='flex items-center'>
                                <span className='text-2xl font-semibold'>{dailyStats.avgScore}%</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='md:col-span-9'>{/* Empty space when no stats */}</div>
                )}
                <Label htmlFor='show-drafts' className='ml-auto'>
                    <Switch id='show-drafts' checked={showDrafts} onCheckedChange={setShowDrafts} />
                    {showDrafts ? 'Hide' : 'Show'} Drafts
                </Label>
            </div>
            <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-10'>
                {/* Records Section */}
                {isLoading ? (
                    <div className='col-span-10 flex flex-col gap-4'>
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} className='h-52 p-6'>
                                <div className='flex justify-between'>
                                    <Skeleton className='h-6 w-1/2' />
                                    <Skeleton className='h-6 w-1/6' />
                                </div>
                                <div className='space-y-3'>
                                    <Skeleton className='h-4 w-full' />
                                    <Skeleton className='h-4 w-4/5' />
                                    <Skeleton className='h-4 w-3/4' />
                                </div>
                                <Skeleton className='h-8 w-full' />
                            </Card>
                        ))}
                    </div>
                ) : !records || records.length === 0 ? (
                    <div
                        className={cn(
                            'flex flex-col items-center justify-center rounded-xl border border-dashed bg-gray-50 px-4 py-16 dark:bg-gray-800/50',
                            showDrafts
                                ? 'col-span-1 sm:col-span-1 md:col-span-4 lg:col-span-7'
                                : 'col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-10'
                        )}>
                        <div className='text-center'>
                            <h3 className='mb-2 text-lg font-medium text-gray-700 dark:text-gray-300'>
                                {stateMessage}
                            </h3>
                            <p className='mb-6 max-w-md text-gray-500 dark:text-gray-400'>
                                Create a new record to track your mock test performance.
                            </p>
                            <Button asChild variant='outline' className='gap-2'>
                                <Link href='/dashboard/create'>
                                    <Plus className='h-4 w-4' />
                                    Add Your First Test Record
                                </Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div
                        className={cn(
                            'flex flex-col gap-4',
                            showDrafts
                                ? 'col-span-1 sm:col-span-1 md:col-span-4 lg:col-span-7'
                                : 'col-span-1 sm:col-span-2 md:col-span-6 lg:col-span-10'
                        )}>
                        {records.map((record) => (
                            <ListCard key={record.id} record={record} />
                        ))}
                    </div>
                )}
                {showDrafts ? (
                    !drafts || drafts.length === 0 ? (
                        <div
                            className={cn(
                                'flex flex-col items-center justify-center rounded-xl border border-dashed bg-gray-50 px-4 py-16 dark:bg-gray-800/50',
                                showDrafts ? 'col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3' : 'col-span-0'
                            )}>
                            <div className='text-center'>
                                <h3 className='mb-2 text-lg font-medium text-gray-700 dark:text-gray-300'>
                                    No drafts available
                                </h3>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={cn(
                                'flex flex-col space-y-2',
                                showDrafts ? 'col-span-1 sm:col-span-1 md:col-span-2 lg:col-span-3' : 'col-span-0'
                            )}>
                            <span className='sticky font-semibold'>Total Drafts: {drafts.length}</span>
                            <ScrollArea className='max-h-[300px] overflow-y-auto'>
                                <div className='flex flex-col items-center justify-center gap-2 px-4'>
                                    {(drafts ?? []).map((draft) => (
                                        <DraftCard key={draft.id} draft={draft} />
                                    ))}
                                </div>
                            </ScrollArea>
                        </div>
                    )
                ) : (
                    <></>
                )}
            </div>
        </div>
    );
}
