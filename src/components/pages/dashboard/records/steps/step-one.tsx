'use client';

import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsClient } from '@/hooks/use-is-client';
import { exam_config } from '@/lib/exam-config';
import { cn } from '@/lib/utils';
import { useFormStore } from '@/stores/form-store';
import { zodResolver } from '@hookform/resolvers/zod';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    testName: z.string().min(2, { message: 'Test name is required' }),
    testDate: z.date({ required_error: 'Test date is required' }),
    examCode: z.string({ required_error: 'Exam name is required' }),
    examTier: z.enum(['TIER_1', 'TIER_2']).optional(),
    testPlatform: z.string({ required_error: 'Test platform is required' }),
    testLink: z.string().url().optional().or(z.literal(''))
});

export default function StepOne() {
    const { formData, updateFormData } = useFormStore();
    const [showTierOption, setShowTierOption] = useState(false);
    const isClient = useIsClient();
    // Memoize exam config to prevent unnecessary recalculations
    const examOptions = useMemo(() => exam_config, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            testName: formData.testName || '',
            testDate: formData.testDate ? new Date(formData.testDate) : new Date(),
            examCode: formData.examCode || '',
            examTier: (formData.examTier as 'TIER_1' | 'TIER_2') || undefined,
            testPlatform: formData.testPlatform || '',
            testLink: formData.testLink || ''
        }
    });

    const watchExamCode = form.watch('examCode');

    useEffect(() => {
        if (isClient) {
            form.reset({
                testName: formData.testName || '',
                testDate: formData.testDate ? new Date(formData.testDate) : new Date(),
                examCode: formData.examCode || '',
                examTier: (formData.examTier as 'TIER_1' | 'TIER_2') || undefined,
                testPlatform: formData.testPlatform || '',
                testLink: formData.testLink || ''
            });
        }
    }, [formData, isClient, form]);

    useEffect(() => {
        const exam = examOptions.find((exam) => exam.examCode === formData.examCode);
        updateFormData({ examName: exam?.examName });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [examOptions, formData.examCode]);

    useEffect(() => {
        // Use requestAnimationFrame to defer non-critical UI updates
        const frameId = requestAnimationFrame(() => {
            const selectedExam = examOptions.find((exam) => exam.examCode === watchExamCode);
            setShowTierOption(selectedExam?.hasTier || false);
            if (!selectedExam?.hasTier) {
                form.setValue('examTier', undefined);
            }
        });

        return () => cancelAnimationFrame(frameId);
    }, [watchExamCode, form, examOptions]);
    // Memoize platform options to prevent unnecessary re-renders
    const platformOptions = useMemo(
        () => [
            { value: 'Testbook', label: 'Testbook' },
            { value: 'RBE', label: 'RBE' },
            { value: 'Pundits', label: 'Pundits' },
            { value: 'Oliveboard', label: 'Oliveboard' },
            { value: 'PracticeMocks', label: 'PracticeMocks' },
            { value: 'Others', label: 'Others' }
        ],
        []
    );

    return (
        <Form {...form}>
            <form className='space-y-6' onSubmit={(e) => e.preventDefault()}>
                <h2 className='mb-6 text-2xl font-bold'>Step 1: Test Details</h2>

                <div className='grid w-full grid-cols-1 gap-6 md:grid-cols-2'>
                    <FormField
                        control={form.control}
                        name='testName'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Test Name<span className='text-rose-500'>*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='Enter test name'
                                        {...field}
                                        onBlur={() => updateFormData(form.getValues())}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='testDate'
                        render={({ field }) => (
                            <FormItem className='flex flex-col'>
                                <FormLabel>
                                    Test Date <span className='text-rose-500'>*</span>
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={'outline'}
                                                className={cn(
                                                    'w-full pl-3 text-left font-normal',
                                                    !field.value && 'text-muted-foreground'
                                                )}>
                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className='w-auto p-0' align='start'>
                                        <Calendar
                                            mode='single'
                                            selected={field.value}
                                            onSelect={(date) => {
                                                field.onChange(date);
                                                updateFormData(form.getValues());
                                            }}
                                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='examCode'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Exam Name <span className='text-rose-500'>*</span>
                                </FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        updateFormData(form.getValues());
                                    }}
                                    value={field.value}>
                                    <FormControl className='w-full truncate'>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select exam name' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {examOptions.map((exam) => (
                                            <SelectItem key={exam.examCode} value={exam.examCode}>
                                                {exam.examName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {showTierOption && (
                        <FormField
                            control={form.control}
                            name='examTier'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Exam Tier <span className='text-rose-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                updateFormData(form.getValues());
                                            }}
                                            defaultValue={field.value}
                                            className='flex flex-row items-center justify-start space-y-1'>
                                            <FormItem className='flex items-center space-y-0 space-x-2'>
                                                <FormLabel
                                                    className='hover:bg-accent/50 has-[[data-state=checked]]:border-primary flex items-start gap-3 rounded-lg border p-2.5 has-[[data-state=checked]]:bg-blue-50 dark:has-[[data-state=checked]]:border-blue-900 dark:has-[[data-state=checked]]:bg-blue-950'
                                                    htmlFor='tier1'>
                                                    <RadioGroupItem
                                                        value='TIER_1'
                                                        id='tier1'
                                                        className='shadow-none data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 *:data-[slot=radio-group-indicator]:[&>svg]:fill-white *:data-[slot=radio-group-indicator]:[&>svg]:stroke-white'
                                                    />
                                                    <div className='grid gap-1 font-normal'>
                                                        <div className='font-medium'>Tier 1</div>
                                                    </div>
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className='flex items-center space-y-0 space-x-2'>
                                                <FormLabel
                                                    className='hover:bg-accent/50 has-[[data-state=checked]]:border-primary flex items-start gap-3 rounded-lg border p-2.5 has-[[data-state=checked]]:bg-blue-50 dark:has-[[data-state=checked]]:border-blue-900 dark:has-[[data-state=checked]]:bg-blue-950'
                                                    htmlFor='tier2'>
                                                    <RadioGroupItem
                                                        value='TIER_2'
                                                        id='tier2'
                                                        className='shadow-none data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 *:data-[slot=radio-group-indicator]:[&>svg]:fill-white *:data-[slot=radio-group-indicator]:[&>svg]:stroke-white'
                                                    />
                                                    <div className='grid gap-1 font-normal'>
                                                        <div className='font-medium'>Tier 2</div>
                                                    </div>
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name='testPlatform'
                        render={({ field }) => (
                            <FormItem className='w-full'>
                                <FormLabel>Test Platform</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        updateFormData(form.getValues());
                                    }}
                                    value={field.value}>
                                    <FormControl className='w-full'>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select test platform' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <FormDescription>Test platform where you have attempted the test</FormDescription>

                                    <SelectContent>
                                        {platformOptions.map((platform) => (
                                            <SelectItem key={platform.value} value={platform.value}>
                                                {platform.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='testLink'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Test Link (Optional)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder='https://example.com/test'
                                        {...field}
                                        onBlur={() => updateFormData(form.getValues())}
                                    />
                                </FormControl>
                                <FormDescription>Provide a link to the test if available</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
}
