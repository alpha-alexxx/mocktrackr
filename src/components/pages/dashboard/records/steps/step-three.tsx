'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { type TableData, TableEditor } from '@/components/app-ui/table-editor';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Editor from '@/components/ui/editor';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useExamConfig } from '@/hooks/use-exam-config';
import { getSectionSubjects } from '@/lib/utils';
import { Section, useFormStore } from '@/stores/form-store';
import { zodResolver } from '@hookform/resolvers/zod';

import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash';
import { Info, Lightbulb } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

/* eslint-disable @typescript-eslint/no-explicit-any */

const subjectSchema = z
    .object({
        name: z.string(),
        totalQuestions: z.number().int().positive(),
        attemptedQuestions: z.number().int().min(0),
        correctAnswers: z.number().int().min(0),
        wrongAnswers: z.number().int().min(0),
        skippedQuestions: z.number().int().min(0),
        timeTaken: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, { message: 'Time must be in hh:mm:ss format' }),
        totalMarks: z.number().int().positive(),
        obtainedMarks: z.number(),
        correctMarks: z.number(),
        wrongMarks: z.number(),
        keyPoints: z.string().optional(),
        sectionLearnings: z.string().optional()
    })
    .superRefine((data, ctx) => {
        const { totalQuestions, correctAnswers, wrongAnswers, skippedQuestions, attemptedQuestions } = data;

        // Check attemptedQuestions = correct + wrong
        if (attemptedQuestions !== correctAnswers + wrongAnswers) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Attempted questions must equal correctAnswers + wrongAnswers',
                path: ['attemptedQuestions']
            });
        }

        // Check totalQuestions = correct + wrong + skipped
        if (totalQuestions !== correctAnswers + wrongAnswers + skippedQuestions) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Total questions must equal correctAnswers + wrongAnswers + skippedQuestions',
                path: ['totalQuestions']
            });
        }

        // Check attemptedQuestions ≤ totalQuestions
        if (attemptedQuestions > totalQuestions) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Attempted questions cannot exceed total questions',
                path: ['attemptedQuestions']
            });
        }
    });

const formSchema = z.object({
    sections: z.array(subjectSchema)
});

export default function StepThree() {
    const { formData, updateFormData } = useFormStore();
    const examDetails = useExamConfig();
    const [openValues, setOpenValues] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Load exam configuration - memoize the dependencies
    useEffect(() => {
        if (formData.examCode) {
            const subjectsList = getSectionSubjects(formData.examCode, formData.examTier);
            setSubjects(subjectsList);

            // Only initialize sections if they don't exist
            if (!formData.sectionWise || formData.sectionWise.length === 0) {
                const initialSections = subjectsList.map((subject) => ({
                    name: subject.name,
                    totalQuestions: subject.totalQuestions,
                    attemptedQuestions: 0,
                    correctAnswers: 0,
                    wrongAnswers: 0,
                    skippedQuestions: subject.totalQuestions, // Initialize with all skipped
                    timeTaken: '00:00:00',
                    totalMarks: subject.totalMarks,
                    obtainedMarks: 0,
                    correctMarks: 0,
                    wrongMarks: 0,
                    keyPoints: '',
                    sectionLearnings: ''
                }));
                updateFormData({ sectionWise: initialSections });
            }
        }
    }, [formData, updateFormData]);

    // Create form with memoized default values
    const defaultValues = useMemo(
        () => ({
            sections: formData.sectionWise || []
        }),
        [formData.sectionWise]
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    // Update form values when subjects change
    useEffect(() => {
        if (subjects.length > 0) {
            // Use batch updates to minimize renders
            const currentSections = form.getValues('sections');
            const updatedSections = subjects.map((subject, index) => {
                const existing = currentSections.find((s) => s.name === subject.name) || currentSections[index] || {};

                return {
                    name: subject.name,
                    totalQuestions: subject.totalQuestions,
                    attemptedQuestions: existing.attemptedQuestions || 0,
                    correctAnswers: existing.correctAnswers || 0,
                    wrongAnswers: existing.wrongAnswers || 0,
                    skippedQuestions: existing.skippedQuestions || subject.totalQuestions,
                    timeTaken: existing.timeTaken || '00:00:00',
                    totalMarks: existing.totalMarks || subject.totalMarks,
                    obtainedMarks: existing.obtainedMarks || 0,
                    correctMarks: existing.correctMarks || 0,
                    wrongMarks: existing.wrongMarks || 0,
                    keyPoints: existing.keyPoints || '',
                    sectionLearnings: existing.sectionLearnings || ''
                };
            });

            form.setValue('sections', updatedSections);
        }
    }, [subjects, form]);

    // Memoize the recalculate function to prevent recreation on each render
    const recalculateSection = useCallback((section: any, examConfig: any) => {
        const correctMark = examConfig?.correctMark || 0;
        const negativeMark = examConfig?.negativeMark || 0;
        const correctMarks = section.correctAnswers * correctMark;
        const wrongMarks = section.wrongAnswers * negativeMark;
        const obtainedMarks = correctMarks - wrongMarks;
        const skippedQuestions = section.totalQuestions - section.attemptedQuestions;

        return {
            ...section,
            correctMarks,
            wrongMarks,
            obtainedMarks,
            skippedQuestions,
            totalMarks: section.totalMarks
        };
    }, []);

    // Create a stable reference to the recalculate function
    const recalculateRef = useRef(recalculateSection);
    recalculateRef.current = recalculateSection;

    // Create a one-time debounced function
    const debouncedRecalculate = useMemo(
        () =>
            debounce(() => {
                if (!examDetails) return;

                const currentSections = form.getValues('sections');
                const updatedSections = currentSections.map((section) => recalculateRef.current(section, examDetails));

                // Check if values actually changed before updating
                const hasChanged = updatedSections.some((newSec, idx) => {
                    const oldSec = currentSections[idx];

                    return (
                        oldSec.correctMarks !== newSec.correctMarks ||
                        oldSec.wrongMarks !== newSec.wrongMarks ||
                        oldSec.obtainedMarks !== newSec.obtainedMarks ||
                        oldSec.skippedQuestions !== newSec.skippedQuestions
                    );
                });

                if (hasChanged) {
                    form.setValue('sections', updatedSections, { shouldDirty: true });
                }
            }, 300),
        [examDetails, form]
    );

    // Watch form changes and trigger recalculation
    useEffect(() => {
        if (!examDetails) return;

        const subscription = form.watch((_, { name }) => {
            // Only run calculations when relevant fields change
            if (
                name?.startsWith('sections') &&
                (name?.includes('attemptedQuestions') ||
                    name?.includes('correctAnswers') ||
                    name?.includes('wrongAnswers') ||
                    name?.includes('totalQuestions'))
            ) {
                debouncedRecalculate();
            }
        });

        return () => {
            subscription.unsubscribe();
            debouncedRecalculate.cancel();
        };
    }, [examDetails, form, debouncedRecalculate]);

    // Efficiently update form data with proper cleanup
    useEffect(() => {
        const subscription = form.watch((value) => {
            // Clear any existing timeout
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }

            // Create a new timeout
            updateTimeoutRef.current = setTimeout(() => {
                if (value.sections) {
                    updateFormData({ sectionWise: value.sections as Section[] });
                }
                updateTimeoutRef.current = null;
            }, 500);
        });

        return () => {
            subscription.unsubscribe();
            if (updateTimeoutRef.current) {
                clearTimeout(updateTimeoutRef.current);
            }
        };
    }, [form, updateFormData]);

    // Generate ID for table rows
    const generateId = () => {
        return Math.random().toString(36).slice(2, 9);
    };

    // Utility function to convert between string and TableData format
    const defaultTableData = useMemo<TableData>(
        () => ({
            headers: ['Topic', 'Attempt Type', 'Reason'],
            rows: [
                {
                    id: generateId(),
                    cells: [
                        { type: 'input', value: '' },
                        { type: 'select', value: '' },
                        { type: 'textarea', value: '' }
                    ]
                }
            ]
        }),
        []
    );


    // Cache the last parsed string and result to prevent unnecessary re-parsing
    const tableDataCache = useRef<{ str: string; data: TableData }>({ str: '', data: defaultTableData });

    const stringToTableData = useCallback(
        (str: string): TableData => {
            // Return cached result if the string hasn't changed
            if (str === tableDataCache.current.str) {
                return tableDataCache.current.data;
            }

            if (!str || str === '') {
                tableDataCache.current = { str: '', data: defaultTableData };

                return defaultTableData;
            }

            try {
                const parsed = JSON.parse(str) as TableData;
                tableDataCache.current = { str, data: parsed };

                return parsed;
            } catch (e) {
                // If parsing fails, create a new table with the string as content
                const newData: TableData = {
                    headers: ['Topic', 'Attempt Type', 'Reason'],
                    rows: [
                        {
                            id: generateId(),
                            cells: [
                                { type: 'input', value: '' },
                                { type: 'select', value: '' },
                                { type: 'textarea', value: '' }
                            ]
                        },
                        {
                            id: generateId(),
                            cells: [
                                { type: 'input', value: '' },
                                { type: 'select', value: '' },
                                { type: 'textarea', value: '' }
                            ]
                        }
                    ]
                };
                tableDataCache.current = { str, data: newData };

                return newData;
            }
        },
        [defaultTableData]
    );

    // Using the generateId function defined above

    // Memoize the change handlers
    const handleQuillChange = useCallback(
        (index: number, field: 'sectionLearnings', value: string) => {
            form.setValue(`sections.${index}.${field}`, value);
        },
        [form]
    );

    const handleTableChange = useCallback(
        (index: number, value: TableData) => {
            // Prevent unnecessary re-renders by comparing the current value with the new value
            const currentValue = form.getValues(`sections.${index}.keyPoints`);
            const newValue = JSON.stringify(value);

            debounce(() => {

                // Only update if the value has actually changed
                if (currentValue !== newValue) {
                    form.setValue(`sections.${index}.keyPoints`, newValue, { shouldDirty: true });
                }
            }, 1000)
        },
        [form]
    );

    if (!subjects.length) {
        return (
            <div className='flex h-64 items-center justify-center'>
                <p className='text-lg text-gray-500'>Please complete Step 1 to load section details.</p>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form className='space-y-6'>
                <h2 className='mb-6 text-2xl font-bold'>Step 3: Section-Wise Details</h2>

                <Accordion type='multiple' className='space-y-4' value={openValues} onValueChange={setOpenValues}>
                    {subjects.map((subject, index) => {
                        const value = index.toString();
                        const isOpen = openValues.includes(value);

                        return (
                            <AccordionItem key={value} value={value}>
                                <AccordionTrigger className='cursor-pointer'>
                                    <div className='flex w-full flex-row items-center justify-between font-semibold'>
                                        {subject.name}

                                        {subject.isQualifying && (
                                            <Badge variant='outline' className='border-cyan-500 bg-cyan-600/20'>
                                                Qualifying
                                            </Badge>
                                        )}
                                        <div className='space-x-2'>
                                            <Badge variant='outline' className='border-cyan-500 bg-cyan-600/20'>
                                                {subject.totalQuestions} Questions
                                            </Badge>
                                            <Badge variant='secondary' className='border-rose-500 bg-rose-600/20'>
                                                {subject.totalMarks} Marks
                                            </Badge>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}>
                                            <AccordionContent>
                                                <Card>
                                                    <CardHeader>
                                                        <CardTitle>{subject.name}</CardTitle>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-3'>
                                                            <FormField
                                                                control={form.control}
                                                                name={`sections.${index}.totalQuestions`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Total Questions</FormLabel>
                                                                        <FormControl>
                                                                            <Input type='number' {...field} disabled />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                name={`sections.${index}.attemptedQuestions`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Attempted Questions</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type='number'
                                                                                {...field}
                                                                                onChange={(e) =>
                                                                                    field.onChange(
                                                                                        Number(e.target.value) || 0
                                                                                    )
                                                                                }
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                name={`sections.${index}.timeTaken`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Time Taken (hh:mm:ss)</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-3'>
                                                            <FormField
                                                                control={form.control}
                                                                name={`sections.${index}.correctAnswers`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Correct Questions</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type='number'
                                                                                {...field}
                                                                                onChange={(e) =>
                                                                                    field.onChange(
                                                                                        Number(e.target.value) || 0
                                                                                    )
                                                                                }
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                name={`sections.${index}.wrongAnswers`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Wrong Questions</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type='number'
                                                                                {...field}
                                                                                onChange={(e) =>
                                                                                    field.onChange(
                                                                                        Number(e.target.value) || 0
                                                                                    )
                                                                                }
                                                                            />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                name={`sections.${index}.skippedQuestions`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Skipped Questions</FormLabel>
                                                                        <FormControl>
                                                                            <Input type='number' {...field} disabled />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                name={`sections.${index}.totalMarks`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Total Marks</FormLabel>
                                                                        <FormControl>
                                                                            <Input type='number' {...field} disabled />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                name={`sections.${index}.obtainedMarks`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Obtained Marks</FormLabel>
                                                                        <FormControl>
                                                                            <Input type='number' {...field} disabled />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                name={`sections.${index}.correctMarks`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Correct Marks</FormLabel>
                                                                        <FormControl>
                                                                            <Input type='number' {...field} disabled />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />

                                                            <FormField
                                                                control={form.control}
                                                                name={`sections.${index}.wrongMarks`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Wrong Marks</FormLabel>
                                                                        <FormControl>
                                                                            <Input type='number' {...field} disabled />
                                                                        </FormControl>
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>

                                                        <div className='mb-6'>
                                                            <FormLabel className='mb-2 flex flex-row items-center justify-start gap-2'>
                                                                <Info className='size-5 text-amber-600 dark:text-amber-400' />
                                                                What Went Wrong:
                                                            </FormLabel>
                                                            <TableEditor
                                                                title='Topic Analysis'
                                                                value={stringToTableData(
                                                                    form.watch(`sections.${index}.keyPoints`) || ''
                                                                )}

                                                                onChange={(value) => handleTableChange(index, value)}
                                                            />
                                                        </div>

                                                        <div>
                                                            <FormLabel className='mb-2 flex flex-row items-center justify-start gap-2'>
                                                                <Lightbulb className='size-5 text-emerald-600 dark:text-emerald-400' />
                                                                Rules To Remember
                                                            </FormLabel>
                                                            <Editor
                                                                key={`sections.${index}.sectionLearnings`}
                                                                placeholder='Note down your learnings here...'
                                                                value={
                                                                    form.watch(`sections.${index}.sectionLearnings`) ||
                                                                    ''
                                                                }
                                                                onChange={(value) =>
                                                                    handleQuillChange(index, 'sectionLearnings', value)
                                                                }
                                                            />
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </AccordionContent>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </form>
        </Form>
    );
}
