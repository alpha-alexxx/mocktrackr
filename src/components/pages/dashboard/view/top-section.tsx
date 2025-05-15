'use client';

import { useEffect, useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ExamConfig, TierConfig, exam_config } from '@/lib/exam-config';
import { formatTime } from '@/lib/utils';

interface ExamPatternSectionProps {
    examName: string;
    examTier: string;
    totalQuestions: number;
    totalMarks: number;
}

export function ExamPatternSection({ examName, examTier, totalQuestions, totalMarks }: ExamPatternSectionProps) {
    const [pattern, setPattern] = useState<TierConfig | ExamConfig | null>(null);

    useEffect(() => {
        const exam = exam_config.find((exam) => exam.examName === examName);
        if (exam) {
            if (exam.hasTier) {
                const tierKey = examTier.split('_').join('').toLowerCase() as keyof ExamConfig;
                const tierPattern = exam[tierKey];
                if (tierPattern && typeof tierPattern === 'object') {
                    setPattern(tierPattern as TierConfig);
                }
            } else {
                setPattern(exam);
            }
        }
    }, [examName, examTier]);

    return (
        <div className='space-y-4'>
            <div className='mb-4 grid grid-cols-3 gap-2'>
                <div className='size-[72px] rounded-md bg-cyan-100 p-1 text-center dark:bg-cyan-600/50'>
                    <p className='text-muted-foreground text-sm'>Questions</p>
                    <p className='font-medium'>{totalQuestions}</p>
                </div>
                <div className='size-[72px] rounded-md bg-violet-100 p-1 text-center dark:bg-violet-600/50'>
                    <p className='text-muted-foreground text-sm'>Marks</p>
                    <p className='font-medium'>{totalMarks}</p>
                </div>
                <div className='size-[72px] rounded-md bg-yellow-100 p-1 text-center dark:bg-yellow-600/50'>
                    <p className='text-muted-foreground text-sm'>Time</p>
                    <p className='font-medium'>{formatTime(pattern?.durationMinutes as number)}</p>
                </div>
            </div>

            <h3 className='mb-2 text-sm font-medium'>Exam Structure</h3>
            <Accordion type='multiple' className='rounded-md border'>
                <AccordionItem value='tier' className='border-b-0'>
                    <AccordionTrigger className='px-4 py-2 hover:no-underline'>
                        <div className='flex items-center'>
                            <span className='font-medium'>Examination Pattern</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className='px-4 pb-2'>
                        <div className='space-y-2'>
                            {pattern ? (
                                'sections' in pattern && pattern.sections ? (
                                    pattern.sections.map((section, index) => (
                                        <div key={index} className='bg-muted/50 mb-2 flex flex-col rounded-md p-2'>
                                            <span className='font-semibold'>{section.name}</span>
                                            {'subjects' in section && section.subjects ? (
                                                section.subjects.map((subject, subIndex) => (
                                                    <div key={subIndex} className='flex justify-between px-2 py-1'>
                                                        <span>{subject.name}</span>
                                                        <div className='flex gap-2'>
                                                            <Badge variant='outline' className='text-xs'>
                                                                {subject.totalQuestions} Q
                                                            </Badge>
                                                            <Badge variant='outline' className='text-xs'>
                                                                {subject.totalMarks} Marks
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className='flex justify-between px-2 py-1'>
                                                    <span>{section.name}</span>
                                                    <div className='flex gap-2'>
                                                        <Badge variant='outline' className='text-xs'>
                                                            {section.totalQuestions} Q
                                                        </Badge>
                                                        <Badge variant='outline' className='text-xs'>
                                                            {section.totalMarks} Marks
                                                        </Badge>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : 'subjects' in pattern && pattern.subjects ? (
                                    pattern.subjects.map((subject, index) => (
                                        <div key={index} className='bg-muted/50 flex justify-between rounded-md p-2'>
                                            <span>{subject.name}</span>
                                            <div className='flex gap-2'>
                                                <Badge variant='outline' className='text-xs'>
                                                    {subject.totalQuestions} Q
                                                </Badge>
                                                <Badge variant='outline' className='text-xs'>
                                                    {subject.totalMarks} Marks
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className='text-muted-foreground text-sm'>No pattern available</p>
                                )
                            ) : (
                                <p className='text-muted-foreground text-sm'>Loading...</p>
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
