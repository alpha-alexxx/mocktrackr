'use client';

import { useRouter } from 'next/navigation';

import FormContainer from '@/components/pages/dashboard/records/form-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useExamConfig } from '@/hooks/use-exam-config';
import { useIsClient } from '@/hooks/use-is-client';
import { formatTime } from '@/lib/utils';
import { useFormStore } from '@/stores/form-store';

import { ArrowLeft, Award, Clock, ListChecks } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Suspense } from 'react';
import Loader from '@/components/app-ui/loader';

export default function CreatePage() {
    const selectedExam = useExamConfig();
    const isClient = useIsClient();
    const { resetForm } = useFormStore();
    const router = useRouter();

    return (
        <div className='mx-auto w-full rounded-xl border-2 p-6 shadow-xs'>
            <header className='mb-2 flex flex-col items-center justify-between gap-4 md:flex-row'>
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

                    <div>
                        <h1 className='mb-2 text-3xl font-semibold'>Create New Record</h1>
                        <p className='mb-4 font-medium text-slate-400'>Use the form below to create a new record.</p>
                    </div>
                </div>
                {!isClient ? (
                    <div className='flex flex-col'>
                        <div className='flex flex-row justify-between items-center'>
                            <Skeleton className='h-2 w-full' />
                            <Skeleton className='w-6 h-2' />
                        </div>
                        <Skeleton className='h-1 w-full' />
                    </div>
                ) : (
                    selectedExam && (
                        <div className='flex w-full h-fit md:w-fit flex-1 flex-col items-center justify-center gap-2 rounded-lg border p-1 shadow-sm'>
                            <div>
                                <div className='flex items-center justify-center gap-2 text-sm font-medium'>
                                    <span>{selectedExam.examName}</span>
                                    {selectedExam.examTier && (
                                        <Badge variant={'secondary'}>Tier {selectedExam.examTier.split('_')[1]}</Badge>
                                    )}
                                </div>
                            </div>
                            <div className='flex flex-row items-center justify-between gap-2 font-medium'>
                                <span className='flex flex-row items-center justify-center gap-2 text-xs md:text-base'>
                                    <Award className='size-5' /> {selectedExam.totalMarks} Marks
                                </span>
                                <span className='flex flex-row items-center justify-center gap-2 text-xs md:text-base'>
                                    <Clock className='size-4' /> {formatTime(selectedExam.durationMinutes)}
                                </span>
                                <span className='flex flex-row items-center justify-center gap-2 text-xs md:text-base'>
                                    <ListChecks className='size-4' /> {selectedExam.totalQuestions} Questions
                                </span>
                            </div>
                        </div>
                    )
                )}
            </header>
            <Suspense fallback={<Loader />}>
                <FormContainer callType='create' />
            </Suspense>
        </div>
    );
}
