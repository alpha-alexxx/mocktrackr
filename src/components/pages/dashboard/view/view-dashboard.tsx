'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRecord } from '@/hooks/use-record';
import { ExtendedUser } from '@/lib/types/auth-types';
import { purifySections } from '@/services/records/purify-sections';
import useDatePicker from '@/stores/date_picker';
import { Section } from '@/stores/form-store';

import { OverallInsights } from './overall-insights';
import { PerformanceOverview } from './performance-overview';
import { SectionPerformance } from './section-performance';
import { TestSummary } from './test-summary';
import { ArrowLeft, Loader2, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function ViewDashboard({ user, recordId }: { user: ExtendedUser; recordId: string }) {
    const router = useRouter();
    const { date } = useDatePicker();
    const [info, setInfo] = useState<{
        icon: LucideIcon;
        title: string;
        description: string;
        type: 'success' | 'error';
    } | null>(null);
    const { record, isError, isLoading } = useRecord(user.id, date, recordId);
    const [sections, setSections] = useState<Section[]>((record && purifySections(record.sectionWise)) || []);
    // Handle state updates in useEffect to prevent infinite re-renders
    useEffect(() => {
        if (!record) {
            setInfo({
                icon: XCircle,
                title: 'No Record Found',
                description: 'No record found for the given date.',
                type: 'error'
            });
        }
        if (isError) {
            setInfo({
                icon: XCircle,
                title: 'Error',
                description: 'An error occurred while fetching the record.',
                type: 'error'
            });
        }
        setSections((record && purifySections(record.sectionWise)) || []);
    }, [record, isError]);
    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Loader2 className='size-12 animate-spin' />
            </div>
        );
    }
    if (!record) {
        return (
            <div className='container mx-auto max-w-7xl px-4 py-6'>
                {info && (
                    <Card className='mb-6'>
                        <CardContent className='pt-6'>
                            <div className='flex items-center gap-3'>
                                <div className='text-red-500'>
                                    <info.icon className='h-6 w-6' />
                                </div>
                                <div>
                                    <h3 className='text-lg font-medium'>{info.title}</h3>
                                    <p className='text-muted-foreground'>{info.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    }
    if (isLoading) {
        return (
            <div className='flex h-full w-full items-center justify-center'>
                <Loader2 className='size-1/2 animate-spin' />
            </div>
        );
    }

    return (
        <div className='container mx-auto max-w-7xl transition-all duration-500 select-none'>
            {/* Header */}
            <header className='mb-6 flex items-center'>
                <Button variant='ghost' size='icon' className='mr-2' onClick={() => router.back()}>
                    <ArrowLeft className='h-5 w-5' />
                    <span className='sr-only'>Back</span>
                </Button>
                <h1 className='text-xl font-bold md:text-2xl'>MockTrackr Test Report</h1>
            </header>
            <div className='gap-6'>
                {/* Left Column */}
                <div className='space-y-6'>
                    {/* Test Summary */}
                    <TestSummary
                        record={record}
                    />

                    {/* Performance Overview */}
                    <Card className='p-2 md:p-4'>
                        <CardContent className='p-0'>
                            <h2 className='mb-4 text-xl font-semibold'>Performance Overview</h2>
                            <PerformanceOverview
                                obtainedMarks={record.obtainedMarks}
                                percentile={record.percentile as number}
                                sectionWise={sections}
                                totalCorrectMarks={record.totalCorrectMarks}
                                totalCorrectQuestions={record.totalCorrectQuestions}
                                totalMarks={record.totalMarks}
                                totalQuestions={record.totalQuestions}
                                totalSkippedQuestions={record.totalSkippedQuestions}
                                totalWrongMarks={record.totalWrongMarks}
                                totalWrongQuestions={record.totalWrongQuestions}
                            />
                        </CardContent>
                    </Card>

                    {/* Section-wise Performance */}
                    <SectionPerformance sections={sections} />
                    {/* Overall Insights */}
                    <Card>
                        <CardContent className='p-6'>
                            <h2 className='mb-4 text-xl font-semibold'>Overall Insights</h2>
                            <OverallInsights keyPoints={record.keyPoints || ''} learnings={record.learnings || ''} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column */}
            </div>
        </div>
    );
}
