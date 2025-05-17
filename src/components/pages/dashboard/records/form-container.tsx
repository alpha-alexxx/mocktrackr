
'use client';

import { useCallback, useMemo } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { useInvalidateQueries } from '@/hooks/use-invalidate';
import { createRecord, updateRecord } from '@/services/records/record.fetch';
import useDatePicker from '@/stores/date_picker';
import { useFormStore } from '@/stores/form-store';
import { useMutation } from '@tanstack/react-query';

import StepFour from './steps/step-four';
import StepIndicator from './steps/step-indicator';
import StepOne from './steps/step-one';
import StepThree from './steps/step-three';
import StepTwo from './steps/step-two';
import { AxiosError } from 'axios';
import { ArrowLeft, ArrowRight, Loader2, UndoIcon } from 'lucide-react';
import { toast } from 'sonner';

/* eslint-disable react-hooks/exhaustive-deps */

export default function FormContainer({
    callType,
    recordId,
    userId
}: {
    userId?: string;
    recordId?: string;
    callType: 'create' | 'update';
}) {
    const router = useRouter();
    const params = useSearchParams();
    const callbackURL = params.get('from') || '/dashboard';
    const { date, setDate } = useDatePicker();
    const { currentStep, formData, setCurrentStep, resetForm, saveDraft, isDraftSaved, validateCurrentStep } =
        useFormStore();
    const { invalidateRecords } = useInvalidateQueries();

    const createMutation = useMutation({
        mutationFn: createRecord,
        onSuccess: () => {
            toast.success('Form Submitted!', {
                id: 'record-form-toast',
                description: 'Your test record has been saved successfully.'
            });
            invalidateRecords(userId!, date);
            router.push(callbackURL);
            resetForm();
            setDate(formData.testDate as Date);
        },
        onError: (error: AxiosError) => {
            toast.error('Failed to save record', {
                id: 'record-form-toast',
                description: error?.message || 'Something went wrong.'
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: updateRecord,
        onSuccess: () => {
            toast.success('Record Updated!', {
                id: 'record-form-toast',
                description: 'Your test record has been updated successfully.'
            });
            router.replace(callbackURL);
            invalidateRecords(userId!, date);
            resetForm();
            setDate(formData.testDate as Date);
        },
        onError: (error) => {
            toast.error('Failed to update record', {
                id: 'record-form-toast',
                description: error?.message || 'Something went wrong.'
            });
        }
    });
    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    const handleReset = useCallback(() => {
        if (confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
            router.refresh();
            resetForm();
        }
    }, [resetForm, router]);

    const handleSaveDraft = useCallback(async () => {
        const { message, type } = await saveDraft(date);
        toast[type](message);
    }, [date, saveDraft]);

    const handleNext = useCallback(() => {
        if (validateCurrentStep()) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        } else {
            toast.error('Validation Error', {
                description: 'Please fill in all required fields correctly.'
            });
        }
    }, [currentStep, setCurrentStep, validateCurrentStep]);

    const handlePrevious = useCallback(() => {
        setCurrentStep(currentStep - 1);
        window.scrollTo(0, 0);
    }, [currentStep, setCurrentStep]);

    const handleSubmit = useCallback(async () => {
        if (!validateCurrentStep()) {
            toast.error('Validation Error', {
                description: 'Please fill in all required fields correctly.'
            });

            return;
        }

        toast.loading('Please wait...', {
            id: 'record-form-toast',
            description: 'Saving your record on the server...'
        });

        if (callType === 'update' && recordId) {
            updateMutation.mutate({ recordId, formData });
        } else {
            createMutation.mutate(formData);
        }
    }, [callType, recordId, formData, validateCurrentStep]);

    const StepComponent = useMemo(() => {
        switch (currentStep) {
            case 1:
                return <StepOne />;
            case 2:
                return <StepTwo />;
            case 3:
                return <StepThree />;
            case 4:
                return <StepFour />;
            default:
                return <StepOne />;
        }
    }, [currentStep]);

    return (
        <div className='mx-auto w-full shadow-xs dark:border-white/20'>
            <StepIndicator currentStep={currentStep} />
            <div className='mt-8 mb-8'>{StepComponent}</div>

            <div className='mt-8 flex flex-col-reverse gap-4 md:flex-row items-center justify-center md:justify-between border-t pt-6'>
                <div className='flex flex-row gap2'>
                    {callType === 'create' && (
                        <Button variant='destructive' onClick={handleReset} disabled={isSubmitting} className='mr-2'>
                            <UndoIcon />
                            Reset
                        </Button>
                    )}

                    <Button variant='secondary' onClick={handleSaveDraft} disabled={isSubmitting}>
                        {isDraftSaved ? 'Draft Saved' : 'Save Draft'}
                    </Button>
                </div>

                <div className='flex flex-row gap2'>
                    {currentStep > 1 && (
                        <Button variant='outline' onClick={handlePrevious} disabled={isSubmitting} className='mr-2'>
                            <ArrowLeft />
                            <span className='hidden md:inline-block'>
                                Previous
                            </span>
                        </Button>
                    )}

                    {currentStep < 4 ? (
                        <Button className='text-white' type='submit' onClick={handleNext} disabled={isSubmitting}>
                            <span className='hidden md:inline-block'>
                                Next
                            </span>
                            <ArrowRight />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className='bg-green-600 text-white hover:bg-green-700'>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    {callType === 'create' ? 'Saving...' : 'Updating...'}
                                    Saving...
                                </>
                            ) : callType === 'create' ? (
                                'Save Record'
                            ) : (
                                'Update Record'
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
