'use client';

import type React from 'react';
import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

import { motion } from 'framer-motion';
import { ArrowLeft, Send } from 'lucide-react';

export default function FeedbackPage() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would send the feedback to your server
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4 dark:from-gray-950 dark:to-gray-900'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className='w-full max-w-md text-center'>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                        className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900'>
                        <Send className='h-8 w-8 text-green-600 dark:text-green-300' />
                    </motion.div>

                    <h1 className='mb-4 text-2xl font-bold'>Thank You for Your Feedback</h1>
                    <p className='mb-8 text-gray-600 dark:text-gray-300'>
                        We appreciate you taking the time to share your thoughts with us.
                    </p>

                    <Link href='/' passHref>
                        <Button>
                            <ArrowLeft className='mr-2 h-4 w-4' />
                            Return to Home
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50 p-4 dark:from-gray-950 dark:to-gray-900'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full max-w-md'>
                <Card className='border-0 shadow-lg'>
                    <CardHeader>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}>
                            <CardTitle className='text-2xl'>
                                <h1>We Value Your Feedback</h1>
                            </CardTitle>
                            <CardDescription>Help us improve by sharing why you decided to leave.</CardDescription>
                        </motion.div>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <ScrollArea className='h-80 p-px py-2'>
                            <CardContent className='space-y-6'>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}>
                                    <Label htmlFor='reason' className='text-base font-medium'>
                                        What was the primary reason for deleting your account?
                                    </Label>
                                    <RadioGroup id='reason' className='mt-3 space-y-3'>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='no-longer-needed' id='no-longer-needed' />
                                            <Label htmlFor='no-longer-needed'>No longer needed the service</Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='found-alternative' id='found-alternative' />
                                            <Label htmlFor='found-alternative'>Found a better alternative</Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='too-complicated' id='too-complicated' />
                                            <Label htmlFor='too-complicated'>Too complicated to use</Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='privacy-concerns' id='privacy-concerns' />
                                            <Label htmlFor='privacy-concerns'>Privacy concerns</Label>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <RadioGroupItem value='other' id='other' />
                                            <Label htmlFor='other'>Other reason</Label>
                                        </div>
                                    </RadioGroup>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.5 }}
                                    className='mb-4'>
                                    <Label htmlFor='comments' className='text-base font-medium'>
                                        Additional comments (optional)
                                    </Label>
                                    <Textarea
                                        id='comments'
                                        placeholder='Tell us more about your experience...'
                                        className='mt-2 resize-none'
                                        rows={4}
                                    />
                                </motion.div>
                            </CardContent>
                        </ScrollArea>
                        <CardFooter className='flex flex-col justify-between gap-3 sm:flex-row'>
                            <Link href='/goodbye' passHref>
                                <Button variant='outline' className='w-full sm:w-auto'>
                                    <ArrowLeft className='mr-2 h-4 w-4' />
                                    Back
                                </Button>
                            </Link>
                            <Button type='submit' className='w-full sm:w-auto'>
                                Submit Feedback
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Number.POSITIVE_INFINITY, repeatDelay: 3, duration: 0.5 }}
                                    className='ml-2'>
                                    <Send className='h-4 w-4' />
                                </motion.span>
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        </div>
    );
}
