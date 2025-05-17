'use client';

import { useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import Editor from '@/components/ui/editor';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFormStore } from '@/stores/form-store';
import { zodResolver } from '@hookform/resolvers/zod';

import { Info, Lightbulb } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    keyPoints: z.string().optional(),
    learnings: z.string().optional()
});

export default function StepFour() {
    const { formData, updateFormData } = useFormStore();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            keyPoints: formData.keyPoints || '',
            learnings: formData.learnings || ''
        }
    });

    // Debounced form update
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const subscription = form.watch((value) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                updateFormData(value as any);
            }, 500); // 500ms debounce delay
        });

        return () => {
            clearTimeout(timeoutId);
            subscription.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.watch, updateFormData]);

    return (
        <Form {...form}>
            <form className='space-y-6'>
                <h2 className='mb-6 text-2xl font-bold'>Step 4: Overall Insights</h2>

                <Card className='p-2 md:p-4 border-none md:border shadow-none md:shadow-xs w-full mb-6'>
                    <CardContent className='p-0'>
                        <FormField
                            control={form.control}
                            name='keyPoints'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='mb-2 flex flex-row items-center justify-start gap-2'>
                                        <Info className='size-5 text-amber-600 dark:text-amber-400' />
                                        What Went Wrong:
                                    </FormLabel>
                                    <FormControl>
                                        <Editor value={field.value || ''} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Card className='p-2 md:p-4 border-none md:border shadow-none md:shadow-xs w-full mb-6'>
                    <CardContent className='p-0'>
                        <FormField
                            control={form.control}
                            name='learnings'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='mb-2 flex flex-row items-center justify-start gap-2'>
                                        <Lightbulb className='size-5 text-emerald-600 dark:text-emerald-400' />
                                        Rules To Remember
                                    </FormLabel>
                                    <FormControl>
                                        <Editor value={field.value || ''} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
