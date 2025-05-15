'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import Loading from '@/app/(protected)/dashboard/edit/[id]/loading';
import FormContainer from '@/components/pages/dashboard/records/form-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useExamConfig } from '@/hooks/use-exam-config';
import { useIsClient } from '@/hooks/use-is-client';
import { useRecord } from '@/hooks/use-record';
import { formatTime } from '@/lib/utils';
import { purifySections } from '@/services/records/purify-sections';
import useDatePicker from '@/stores/date_picker';
import { useFormStore } from '@/stores/form-store';

import { ArrowLeft, Award, Clock, ListChecks } from 'lucide-react';

export default function EditPageUI({ recordId, userId }: { recordId: string; userId: string }) {
    const { formData, updateFormData, resetForm } = useFormStore();
    const router = useRouter();
    const isClient = useIsClient();
    const { date } = useDatePicker();
    const { record, isError, isLoading } = useRecord(userId, date, recordId);

    const selectedExam = useExamConfig(record?.examCode, record?.examTier || undefined);

    useEffect(() => {
        if (isLoading) {
            return;
        }
        if (isError) {
            return;
        }
        if (!record) {
            return;
        }

        updateFormData({
            ...record,
            sectionWise: purifySections(record.sectionWise) || undefined,
            examTier: record.examTier || undefined,
            examName: record.examName || undefined,
            examCode: record.examCode || undefined,
            testLink: record.testLink || undefined,
            totalTimeTaken: record.totalTimeTaken || undefined,
            percentile: record.percentile || undefined,
            rank: record.rank || undefined,
            keyPoints: record.keyPoints || undefined,
            learnings: record.learnings || undefined
        });

        // Only run once on mount
    }, [record, updateFormData, isLoading, isError]);

    if (!isClient) {
        return <Loading />;
    }
    if (isLoading) {
        return <Loading />;
    }
    if (isError) {
        return <div>Got Error</div>;
    }
    if (!record) {
        return <div>Record not found</div>;
    }

    return (
        <div className='mx-auto w-full rounded-xl border-2 p-6 shadow-xs'>
            <header className='mb-2 flex flex-col items-center justify-between md:flex-row'>
                <div className='flex w-full flex-row md:w-2/5'>
                    <Button
                        variant='ghost'
                        size='icon'
                        className='mr-2'
                        onClick={() => {
                            router.back();
                            resetForm();
                        }}>
                        <ArrowLeft className='h-5 w-5' />
                        <span className='sr-only'>Back</span>
                    </Button>
                    <div className='w-full'>
                        <h1 className='mb-2 text-3xl font-semibold'>Edit Old Record</h1>
                        <p className='mb-4 font-medium text-slate-400'>
                            Use the form below to edit a the existing record.
                        </p>
                    </div>
                </div>
                {selectedExam && (
                    <div className='flex h-fit w-full flex-1 flex-col items-center justify-center gap-2 rounded-lg border p-1 shadow-sm'>
                        <div>
                            <span className='text-sm font-medium'>
                                {formData.examName}{' '}
                                {formData.examTier && (
                                    <Badge variant={'secondary'}>{'Tier ' + formData.examTier.split('_')[1]}</Badge>
                                )}
                            </span>
                        </div>
                        <div className='flex flex-row items-center justify-between gap-2 font-medium'>
                            <span className='flex flex-row items-center justify-center gap-2 text-base'>
                                <Award className='size-5' /> {selectedExam.totalMarks} Marks
                            </span>
                            <span className='flex flex-row items-center justify-center gap-2 text-base'>
                                <Clock className='size-4' /> {formatTime(selectedExam.durationMinutes)}
                            </span>
                            <span className='flex flex-row items-center justify-center gap-2 text-base'>
                                <ListChecks className='size-4' /> {selectedExam.totalQuestions} Questions
                            </span>
                        </div>
                    </div>
                )}
            </header>
            <FormContainer callType='update' recordId={record.id} userId={userId} />
        </div>
    );
}
