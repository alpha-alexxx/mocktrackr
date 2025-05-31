'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Section } from '@/stores/form-store';

import TableViewer from '../table-viewer';
import { SectionPieChart } from './charts/section-pie-chart';
import InsightDisplay from './insight-display';
import { AlertCircle, AlignJustify, Check, Clock, LayoutGrid, Lightbulb, X } from 'lucide-react';

export function SectionPerformance({ sections }: { sections: Section[] }) {
    return (
        <Card className='p-2 md:p-4'>
            <Tabs defaultValue='accordion' className='w-full'>
                <CardHeader className='p-0'>
                    <div className='flex items-center justify-between'>
                        <h2 className='mb-4 text-xl font-semibold'>Section-wise Performance</h2>

                        <TabsList className='mb-4'>
                            <TabsTrigger value='accordion'>
                                <AlignJustify />
                            </TabsTrigger>
                            <TabsTrigger value='cards'>
                                <LayoutGrid />
                            </TabsTrigger>
                        </TabsList>
                    </div>
                </CardHeader>
                <CardContent className='p-0'>
                    <TabsContent value='accordion'>
                        <Accordion type='multiple' className='space-y-4'>
                            {sections.map((section, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`section-${index}`}
                                    className='rounded-lg border last:border-b'>
                                    <AccordionTrigger className='px-4 py-3 hover:no-underline'>
                                        <div className='flex w-full items-center justify-between'>
                                            <div className='flex items-center'>
                                                <span className='font-medium'>{section.name}</span>
                                            </div>
                                            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                                                <Badge
                                                    variant='default'
                                                    className='hidden md:flex bg-primary/20 border-primary text-foreground ml-2 border'>
                                                    {section.obtainedMarks}/{section.totalMarks}
                                                </Badge>
                                                <span className='flex items-center'>
                                                    <Check className='mr-1 h-4 w-4 text-green-500' />
                                                    {section.correctAnswers}
                                                </span>
                                                <span className='flex items-center'>
                                                    <X className='mr-1 h-4 w-4 text-red-500' />
                                                    {section.wrongAnswers}
                                                </span>
                                                <span className='flex items-center'>
                                                    <AlertCircle className='mr-1 h-4 w-4 text-amber-500' />
                                                    {section.skippedQuestions}
                                                </span>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className='px-4 pb-4'>
                                        <div className='flex max-h-fit w-full flex-col items-center justify-between md:flex-row'>
                                            <div className='w-full md:w-1/2'>
                                                <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
                                                    <div className='space-y-1'>
                                                        <p className='text-muted-foreground text-sm'>Total Questions</p>
                                                        <p className='text-lg font-medium'>{section.totalQuestions}</p>
                                                    </div>
                                                    <div className='space-y-1'>
                                                        <p className='text-muted-foreground text-sm'>Attempted</p>
                                                        <p className='text-lg font-medium'>
                                                            {section.attemptedQuestions}
                                                        </p>
                                                    </div>
                                                    <div className='space-y-1'>
                                                        <p className='text-muted-foreground text-sm'>Time Taken</p>
                                                        <p className='flex items-center text-lg font-medium'>
                                                            <Clock className='mr-1 h-4 w-4' />
                                                            {section.timeTaken}
                                                        </p>
                                                    </div>
                                                    <div className='space-y-1'>
                                                        <p className='text-muted-foreground text-sm'>Correct</p>
                                                        <p className='text-lg font-medium text-green-500'>
                                                            {section.correctAnswers}
                                                        </p>
                                                    </div>
                                                    <div className='space-y-1'>
                                                        <p className='text-muted-foreground text-sm'>Wrong</p>
                                                        <p className='text-lg font-medium text-red-500'>
                                                            {section.wrongAnswers}
                                                        </p>
                                                    </div>
                                                    <div className='space-y-1'>
                                                        <p className='text-muted-foreground text-sm'>Skipped</p>
                                                        <p className='text-lg font-medium text-amber-500'>
                                                            {section.skippedQuestions}
                                                        </p>
                                                    </div>
                                                </div>

                                                <Separator className='my-4' />

                                                <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
                                                    <div className='space-y-1'>
                                                        <p className='text-muted-foreground text-sm'>Obtained Marks</p>
                                                        <p className='text-lg font-medium'>{section.obtainedMarks}</p>
                                                    </div>
                                                    <div className='space-y-1'>
                                                        <p className='text-muted-foreground text-sm'>Correct Marks</p>
                                                        <p className='text-lg font-medium text-green-500'>
                                                            {section.correctMarks}
                                                        </p>
                                                    </div>
                                                    <div className='space-y-1'>
                                                        <p className='text-muted-foreground text-sm'>Wrong Marks</p>
                                                        <p className='text-lg font-medium text-red-500'>
                                                            {section.wrongMarks}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='flex w-full items-center justify-center md:w-1/2'>
                                                <SectionPieChart
                                                    correct={section.correctAnswers}
                                                    wrong={section.wrongAnswers}
                                                    skipped={section.skippedQuestions}
                                                    obtainedMarks={section.obtainedMarks}
                                                    totalMarks={section.totalMarks}
                                                />
                                            </div>
                                        </div>

                                        {(section.keyPoints || section.sectionLearnings) && (
                                            <>
                                                <Separator className='my-4' />

                                                {section.keyPoints && (
                                                    <div className='mb-4'>
                                                        <h4 className='mb-2 flex items-center text-sm font-medium'>
                                                            <AlertCircle className='mr-1 h-4 w-4 text-amber-500' />
                                                            What Went Wrong:
                                                        </h4>
                                                        <TableViewer data={JSON.parse(section.keyPoints)} />
                                                    </div>
                                                )}

                                                {section.sectionLearnings && (
                                                    <div>
                                                        <h4 className='mb-2 flex items-center text-sm font-medium'>
                                                            <Lightbulb className='mr-1 h-4 w-4 text-green-500' />
                                                            Rules to Remember:
                                                        </h4>
                                                        <InsightDisplay content={section.sectionLearnings} />
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </TabsContent>

                    <TabsContent value='cards'>
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            {sections.map((section, index) => {
                                const totalAnswered = section.correctAnswers + section.wrongAnswers;
                                const accuracy = totalAnswered > 0 ? (section.correctAnswers / totalAnswered) * 100 : 0;

                                return (
                                    <Card key={index} className='overflow-hidden p-0'>
                                        <CardContent className='p-0'>
                                            <div className='bg-muted p-4'>
                                                <div className='flex items-center justify-between'>
                                                    <h3 className='font-medium'>{section.name}</h3>
                                                    <Badge variant='secondary'>
                                                        {section.obtainedMarks}/
                                                        {section.correctMarks + section.wrongMarks}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className='space-y-4 p-4'>
                                                <div className='grid grid-cols-3 gap-2 text-center'>
                                                    <div className='rounded-md bg-green-50 p-2 dark:bg-green-950/20'>
                                                        <p className='text-muted-foreground text-xs'>Correct</p>
                                                        <p className='text-lg font-medium text-green-600 dark:text-green-400'>
                                                            {section.correctAnswers}
                                                        </p>
                                                    </div>
                                                    <div className='rounded-md bg-red-50 p-2 dark:bg-red-950/20'>
                                                        <p className='text-muted-foreground text-xs'>Wrong</p>
                                                        <p className='text-lg font-medium text-red-600 dark:text-red-400'>
                                                            {section.wrongAnswers}
                                                        </p>
                                                    </div>
                                                    <div className='rounded-md bg-amber-50 p-2 dark:bg-amber-950/20'>
                                                        <p className='text-muted-foreground text-xs'>Skipped</p>
                                                        <p className='text-lg font-medium text-amber-600 dark:text-amber-400'>
                                                            {section.skippedQuestions}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className='space-y-2'>
                                                    <div className='flex justify-between text-sm'>
                                                        <span className='text-muted-foreground'>Accuracy</span>
                                                        <span className='font-medium'>{accuracy.toFixed(1)}%</span>
                                                    </div>
                                                    <Progress value={accuracy} className='h-2' />
                                                </div>

                                                <div className='flex justify-between text-sm'>
                                                    <div className='flex items-center'>
                                                        <Clock className='text-muted-foreground mr-1 h-4 w-4' />
                                                        <span>{section.timeTaken}</span>
                                                    </div>
                                                    <span>
                                                        {section.attemptedQuestions}/{section.totalQuestions} attempted
                                                    </span>
                                                </div>

                                                {(section.keyPoints || section.sectionLearnings) && (
                                                    <div className='border-t pt-2 text-sm'>
                                                        {section.keyPoints && (
                                                            <div className='mb-1 flex flex-col items-start gap-1'>
                                                                <div className='flex flex-row gap-2 items-center justify-center'>
                                                                    <AlertCircle className='h-4 w-4 shrink-0 text-amber-500' />
                                                                    What Went Wrong:
                                                                </div>
                                                                <TableViewer data={JSON.parse(section.keyPoints)} />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>
                </CardContent>
            </Tabs>
        </Card>
    );
}
