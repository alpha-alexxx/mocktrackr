'use client';

import { useEffect, useMemo } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useExamConfig } from '@/hooks/use-exam-config';
import { cn, parseTimeFromMinutes } from '@/lib/utils';
import { useFormStore } from '@/stores/form-store';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputMask } from '@react-input/mask';

import { debounce } from 'lodash';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

/* eslint-disable no-unused-vars */

const formSchema = z
    .object({
        totalQuestions: z.number().int().positive(),
        totalCorrectQuestions: z.number().int().min(0),
        totalWrongQuestions: z.number().int().min(0),
        totalMarks: z.number().positive(),
        obtainedMarks: z.number(),
        totalCorrectMarks: z.number(),
        totalWrongMarks: z.number(),
        totalTime: z
            .string()
            .regex(/^\d{2}:\d{2}:\d{2}$/, {
                message: 'Time must be in HH:MM:SS format'
            })
            .refine(
                (val) => {
                    const [hh, mm, ss] = val.split(':').map(Number);

                    return mm < 60 && ss < 60;
                },
                {
                    message: 'Minutes and seconds must be less than 60'
                }
            ),
        totalTimeTaken: z
            .string()
            .regex(/^\d{2}:\d{2}:\d{2}$/, {
                message: 'Time must be in HH:MM:SS format'
            })
            .refine(
                (val) => {
                    const [hh, mm, ss] = val.split(':').map(Number);

                    return mm < 60 && ss < 60;
                },
                {
                    message: 'Minutes and seconds must be less than 60'
                }
            ),
        percentile: z.number().min(0).max(100).optional(),
        rank: z.string().optional()
    })
    .refine(
        (data) => {
            const totalTimeSeconds = timeStringToSeconds(data.totalTime);
            const timeTakenSeconds = timeStringToSeconds(data.totalTimeTaken);

            return timeTakenSeconds <= totalTimeSeconds;
        },
        {
            message: 'Time Spent cannot exceed Total Attempt Duration',
            path: ['totalTimeTaken']
        }
    );

export default function StepTwo() {
    const { formData, updateFormData } = useFormStore();
    const examDetails = useExamConfig();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            totalQuestions: formData.totalQuestions || examDetails?.totalQuestions || 0,
            totalCorrectQuestions: formData.totalCorrectQuestions || 0,
            totalWrongQuestions: formData.totalWrongQuestions || 0,
            totalMarks: formData.totalMarks || examDetails?.totalMarks || 0,
            obtainedMarks: formData.obtainedMarks || 0,
            totalCorrectMarks: formData.totalCorrectMarks || 0,
            totalWrongMarks: formData.totalWrongMarks || 0,
            totalTime:
                formData.totalTime ||
                parseTimeFromMinutes(examDetails?.durationMinutes as number) ||
                parseTimeFromMinutes(0),
            totalTimeTaken: formData.totalTimeTaken || '00:00:00',
            percentile: formData.percentile || undefined,
            rank: formData.rank || ''
        }
    });

    // Update form values when exam details change
    useEffect(() => {
        if (examDetails) {
            form.setValue('totalQuestions', examDetails.totalQuestions);
            form.setValue('totalMarks', examDetails.totalMarks);
            form.setValue('totalTime', parseTimeFromMinutes(examDetails.durationMinutes));
        }
    }, [examDetails, form]);

    /**
     * Calculate derived marks based on correct/wrong questions and exam config.
     * This function is debounced to prevent excessive recalculation.
     */
    const debouncedCalculate = useMemo(
        () =>
            debounce((values) => {
                if (examDetails) {
                    const correctMark = examDetails.correctMark || 0;
                    const negativeMark = examDetails.negativeMark || 0;

                    const correctMarks = values.totalCorrectQuestions * correctMark;
                    const wrongMarks = values.totalWrongQuestions * negativeMark;
                    const obtainedMarks = correctMarks - wrongMarks;

                    form.setValue('totalCorrectMarks', correctMarks, { shouldValidate: false, shouldDirty: false });
                    form.setValue('totalWrongMarks', wrongMarks, { shouldValidate: false, shouldDirty: false });
                    form.setValue('obtainedMarks', obtainedMarks, { shouldValidate: false, shouldDirty: false });
                    form.setValue('totalTime', parseTimeFromMinutes(examDetails.durationMinutes), {
                        shouldValidate: false,
                        shouldDirty: false
                    });
                }
            }, 300), // 300ms debounce
        [examDetails, form]
    );

    // Watch correct/wrong question changes and trigger calculation
    useEffect(() => {
        const subscription = form.watch((values, { name }) => {
            if (name === 'totalCorrectQuestions' || name === 'totalWrongQuestions') {
                debouncedCalculate(values);
            }
        });

        return () => {
            subscription.unsubscribe();
            debouncedCalculate.cancel();
        };
    }, [form, debouncedCalculate]);

    return (
        <Form {...form}>
            <form className='space-y-6'>
                <h2 className='mb-6 text-2xl font-bold'>Step 2: Performance Metrics</h2>

                {/* Total Questions, Correct, Wrong */}
                <Card className='mb-6 gap-0'>
                    <CardHeader>
                        <CardTitle>Question Breakdown:</CardTitle>
                    </CardHeader>
                    <CardContent className='pt-6'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                            <FormField
                                control={form.control}
                                name='totalQuestions'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Questions</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                                value={field.value}
                                                onBlur={() => updateFormData(form.getValues())}
                                                disabled={!!examDetails}
                                            />
                                        </FormControl>
                                        <FormDescription>Auto-filled from exam config</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='totalCorrectQuestions'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Correct Questions</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                                onBlur={() => updateFormData(form.getValues())}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='totalWrongQuestions'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Wrong Questions</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                                                value={field.value}
                                                onBlur={() => updateFormData(form.getValues())}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Marks Section */}
                <Card className='mb-6 gap-0'>
                    <CardHeader>
                        <CardTitle>
                            Marks Breakdown <span className='text-xs'>(Pre-filled from exam details)</span>:
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='pt-6'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                            <FormField
                                control={form.control}
                                name='totalMarks'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Marks</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                                onBlur={() => updateFormData(form.getValues())}
                                                value={field.value}
                                                disabled={!!examDetails}
                                            />
                                        </FormControl>
                                        <FormDescription>Auto-filled from exam config</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='totalCorrectMarks'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Correct Marks</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                                value={field.value}
                                                onBlur={() => updateFormData(form.getValues())}
                                                disabled
                                            />
                                        </FormControl>
                                        <FormDescription>Auto-calculated</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='totalWrongMarks'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Wrong Marks</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                                value={field.value}
                                                onBlur={() => updateFormData(form.getValues())}
                                                disabled
                                            />
                                        </FormControl>
                                        <FormDescription>Auto-calculated</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='obtainedMarks'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Obtained Marks</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                {...field}
                                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                                value={field.value}
                                                onBlur={() => updateFormData(form.getValues())}
                                                disabled
                                            />
                                        </FormControl>
                                        <FormDescription>Auto-calculated (Correct - Wrong)</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Time Section */}
                <Card className='mb-6 gap-0'>
                    <CardHeader>
                        <CardTitle>Time Breakdown:</CardTitle>
                    </CardHeader>
                    <CardContent className='pt-6'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                            <FormField
                                control={form.control}
                                name='totalTime'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total Attempt Duration (minutes)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='text'
                                                {...field}
                                                onBlur={() => {
                                                    updateFormData(form.getValues());
                                                }}
                                                disabled={!!examDetails}
                                            />
                                        </FormControl>
                                        <FormDescription>Auto-filled from exam Configuration</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='totalTimeTaken'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Time Spent (hh:mm:ss)</FormLabel>
                                        <FormControl>
                                            <InputMask
                                                placeholder='Hours:Minutes:Seconds'
                                                {...field}
                                                replacement={{ 6: /\d/ }}
                                                mask={'66:66:66'}
                                                onBlur={() => updateFormData(form.getValues())}
                                                className={cn(
                                                    'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                                                    'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                                                    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Percentile & Rank */}
                <Card className='mb-6'>
                    <CardContent className='pt-6'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                            <FormField
                                control={form.control}
                                name='percentile'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Percentile (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                placeholder='Enter percentile'
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(Number.parseFloat(e.target.value) || undefined)
                                                }
                                                value={field.value === undefined ? '' : field.value}
                                                onBlur={() => updateFormData(form.getValues())}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='rank'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rank (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder='Enter rank'
                                                {...field}
                                                onBlur={() => updateFormData(form.getValues())}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Your rank relative to the total (e.g., 12 / 12,000)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}

const timeStringToSeconds = (time: string): number => {
    const [hh, mm, ss] = time.split(':').map(Number);

    return hh * 3600 + mm * 60 + ss;
};
