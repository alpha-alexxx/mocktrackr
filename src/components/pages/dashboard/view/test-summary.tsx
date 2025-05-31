'use client';

import Link from 'next/link';

import DownloadPdfIcon from '@/assets/icon/download-pdf';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { format } from 'date-fns';
import {
    Award,
    Calendar,
    ChartNoAxesCombined,
    CheckCircle,
    Clock,
    Crosshair,
    Edit,
    ExternalLink,
    HelpCircle,
    Info,
    School,
    Star,
    Timer,
    XCircle
} from 'lucide-react';

interface TestSummaryProps {
    recordId: string;
    testName: string;
    testDate: Date;
    examTier?: string;
    examName: string;
    testPlatform: string;
    percentile: number;
    obtainedMarks: number;
    totalMarks: number;
    totalQuestions: number;
    rank: string;
    testLink: string;
    totalTimeTaken: string;
    totalTime: string;
    attemptedQuestions: number;
    totalSkippedQuestions: number;
    totalCorrectQuestions: number;
    totalWrongQuestions: number;
    totalCorrectMarks: number;
    totalWrongMarks: number;
}

export function TestSummary(record: TestSummaryProps) {
    const {
        recordId,
        examTier,
        attemptedQuestions,
        examName,
        obtainedMarks,
        percentile,
        rank,
        testDate,
        testLink,
        testName,
        testPlatform,
        totalCorrectMarks,
        totalCorrectQuestions,
        totalMarks,
        totalQuestions,
        totalSkippedQuestions,
        totalTime,
        totalTimeTaken,
        totalWrongMarks,
        totalWrongQuestions
    } = record;
    const formattedDate = format(new Date(testDate), 'PPP');

    const marksPercentage = (obtainedMarks / totalMarks) * 100;
    const questionsAttemptedPercentage = (attemptedQuestions / totalQuestions) * 100;
    const correctPercentage = (totalCorrectQuestions / totalQuestions) * 100;
    const wrongPercentage = (totalWrongQuestions / totalQuestions) * 100;
    const skippedPercentage = (totalSkippedQuestions / totalQuestions) * 100;
    const accuracy =
        totalCorrectQuestions > 0
            ? ((totalCorrectQuestions / (totalCorrectQuestions + totalWrongQuestions)) * 100).toFixed(2)
            : 0;
    // Extract rank numbers
    const [rankPosition, totalParticipants] = rank.split('/').map((num) => Number.parseInt(num.replace(/,/g, '')));

    // Format time efficiency
    const timeEfficiency =
        totalTime && totalTimeTaken
            ? Math.round((parseTimeToMinutes(totalTimeTaken) / parseTimeToMinutes(totalTime)) * 100)
            : null;

    return (
        <div className='relative'>
            <Card className='relative gap-2 overflow-hidden p-0'>
                <CardHeader className='p-0'>
                    <div className='bg-primary/10 dark:bg-primary/20 flex items-center justify-between border-b p-2 md:p-4'>
                        <div className='flex flex-col space-y-1'>
                            <div className='flex flex-row items-center justify-start gap-2'>

                                <h2 className='text-xl font-semibold'>{testName}</h2>
                                {examTier && (
                                    <Badge variant='default' className='text-white'>
                                        Tier {examTier.split('_')[1]}
                                    </Badge>
                                )}
                            </div>
                            <div className='text-muted-foreground flex items-start md:items-center text-xs gap-2 flex-col sm:flex-row'>
                                <div className="flex flex-row items-center justify-center gap-2">
                                    <Calendar className='size-4' />
                                    <span>{formattedDate}</span>
                                </div>
                                <div className='flex items-center flex-row justify-center gap-2'>
                                    <School className='size-4' />
                                    <span className='font-medium'>{examName}</span>
                                </div>


                            </div>
                        </div>
                        <Button variant='outline' className='border-2 dark:border-white/50' asChild>
                            <Link
                                href={`/dashboard/edit/${recordId}?from=/dashboard/view/${recordId}`}
                                rel='noopener noreferrer'>
                                <Edit className='size-5 text-emerald-500' />
                                <span className='font-medium'>Edit</span>
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className='p-2'>
                    {/* Main Content */}
                    <div className='p-2 md:p-4'>
                        <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                            {/* Left Column - Performance Metrics */}
                            <div className='space-y-4'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-muted-foreground text-sm font-medium'>PERFORMANCE METRICS</h3>
                                    <Badge className='bg-primary/10 border-primary text-primary dark:bg-primary/20 dark:text-white/70'>
                                        {testPlatform}
                                    </Badge>
                                </div>
                                {/* Rank */}
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center'>
                                        <Award className='mr-2 h-5 w-5 text-amber-500' />
                                        <span className='font-medium'>Rank</span>
                                    </div>
                                    <div className='flex items-center'>
                                        <span className='text-lg font-bold'>{rank}</span>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className='text-muted-foreground ml-1 h-4 w-4 cursor-help' />
                                                </TooltipTrigger>
                                                <TooltipContent className='text-white'>
                                                    <p>
                                                        Your position: {rankPosition} out of {totalParticipants}{' '}
                                                        participants
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                                {/* Percentile */}
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center'>
                                        <ChartNoAxesCombined className='text-primary mr-2 h-5 w-5' />
                                        <span className='font-medium'>Percentile</span>
                                    </div>
                                    <div className='flex items-center'>
                                        <span className='text-lg font-bold'>{percentile.toFixed(2)}%</span>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className='text-muted-foreground ml-1 h-4 w-4 cursor-help' />
                                                </TooltipTrigger>
                                                <TooltipContent className='text-white'>
                                                    <p>
                                                        You performed better than {percentile.toFixed(2)}% of test
                                                        takers
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>
                                {/* Rank */}
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center'>
                                        <Crosshair className='mr-2 h-5 w-5 text-rose-500' />
                                        <span className='font-medium'>Accuracy</span>
                                    </div>
                                    <div className='flex items-center'>
                                        <span className='text-lg font-bold'>{accuracy} %</span>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className='text-muted-foreground ml-1 h-4 w-4 cursor-help' />
                                                </TooltipTrigger>
                                                <TooltipContent className='text-white'>
                                                    <p>
                                                        Great job! This is the percentage of your correct attempts.{' '}
                                                        <br />
                                                        Accuracy = (Correct Answers ÷ Total Attempted) × 100
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </div>

                                {/* Marks */}
                                <div className='space-y-2'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center'>
                                            <Star className='mr-2 h-5 w-5 text-blue-500' />
                                            <span className='font-medium'>Marks</span>
                                        </div>
                                        <span className='text-lg font-bold'>
                                            {obtainedMarks}/{totalMarks}
                                        </span>
                                    </div>
                                    <div className='space-y-1'>
                                        <Progress value={marksPercentage} className='h-2' />
                                        <div className='text-muted-foreground flex justify-between text-xs'>
                                            <span>Obtained: {obtainedMarks}</span>
                                            <span>Total: {totalMarks}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Exam Details */}
                                <div className='mt-auto border-t pt-2'>
                                    <div className='flex w-full flex-col items-center justify-between gap-2'>
                                        {testLink && (
                                            <Button variant='secondary' className='w-full' size='default' asChild>
                                                <Link href={testLink} target='_blank' rel='noopener noreferrer'>
                                                    <ExternalLink className='h-3.5 w-3.5' />
                                                    <span>View Test</span>
                                                </Link>
                                            </Button>
                                        )}
                                        <Button variant='outline' className='w-full' asChild>
                                            <a href={testLink} target='_blank' rel='noopener noreferrer'>
                                                <DownloadPdfIcon className='size-5 text-rose-500' />
                                                <span>Download Report</span>
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Middle Column - Time Analysis */}
                            <div className='space-y-4'>
                                <h3 className='text-muted-foreground text-sm font-medium'>TIME ANALYSIS</h3>

                                {/* Time Taken vs Total Time */}
                                <div className='space-y-2'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center'>
                                            <Timer className='mr-2 h-5 w-5 text-violet-500' />
                                            <span className='font-medium'>
                                                Time Utilization{' '}
                                                <span className='text-muted-foreground text-xs'>(hh:mm:ss)</span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='bg-muted/50 rounded-md p-3 text-center'>
                                            <div className='text-muted-foreground mb-1 text-xs'>Time alloted</div>
                                            <div className='text-lg font-bold'>{totalTime}</div>
                                        </div>
                                        <div className='bg-muted/50 rounded-md p-3 text-center'>
                                            <div className='text-muted-foreground mb-1 text-xs'>Time Taken</div>
                                            <div className='text-lg font-bold'>{totalTimeTaken}</div>
                                        </div>
                                    </div>

                                    {timeEfficiency !== null && (
                                        <div className='mt-2'>
                                            <div className='mb-1 flex justify-between text-sm'>
                                                <span>Time Efficiency</span>
                                                <span className='font-medium'>{timeEfficiency}%</span>
                                            </div>
                                            <Progress value={timeEfficiency} className='h-2' />
                                            <div className='text-muted-foreground mt-1 flex justify-between text-xs'>
                                                <span>Used: {totalTimeTaken}</span>
                                                <span>Allotted: {totalTime}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Time per Question */}
                                <div className='mt-2 space-y-2 border-t pt-2'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center'>
                                            <Clock className='mr-2 h-5 w-5 text-emerald-500' />
                                            <span className='font-medium'>Time per Question</span>
                                        </div>
                                    </div>

                                    <div className='rounded-md border border-violet-500 bg-violet-100 p-3 text-center dark:bg-violet-500/30'>
                                        <div className='text-lg font-bold'>
                                            {calculateTimePerQuestion(totalTimeTaken, attemptedQuestions)}
                                        </div>
                                        <div className='text-muted-foreground text-xs'>
                                            Average time per attempted question
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Question Analysis */}
                            <div className='space-y-4'>
                                <h3 className='text-muted-foreground text-sm font-medium'>QUESTION ANALYSIS</h3>

                                {/* Questions Attempted */}
                                <div className='space-y-2'>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center'>
                                            <HelpCircle className='mr-2 h-5 w-5 text-blue-500' />
                                            <span className='font-medium'>Questions Attempted</span>
                                        </div>
                                        <span className='text-lg font-bold'>
                                            {attemptedQuestions}/{totalQuestions}
                                        </span>
                                    </div>
                                    <Progress value={questionsAttemptedPercentage} className='h-2' />
                                    <div className='text-muted-foreground flex justify-between text-xs'>
                                        <span>Attempted: {attemptedQuestions}</span>
                                        <span>Total: {totalQuestions}</span>
                                    </div>
                                </div>

                                {/* Question Breakdown */}
                                <div className='mt-2 space-y-3 border-t pt-2'>
                                    {/* Correct Questions */}
                                    <div className='space-y-1'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <CheckCircle className='mr-2 h-4 w-4 text-emerald-500' />
                                                <span className='text-sm'>Correct Questions</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium'>{totalCorrectQuestions}</span>
                                                <Badge
                                                    variant='outline'
                                                    className='border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-600/30 dark:text-emerald-400'>
                                                    {Math.round(correctPercentage)}%
                                                </Badge>
                                            </div>
                                        </div>
                                        <Progress
                                            value={correctPercentage}
                                            className='h-1.5'
                                            indicatorColor='bg-emerald-500'
                                            barColor='bg-emerald-500/20 dark:bg-emerald-500/30'
                                        />
                                    </div>

                                    {/* Wrong Questions */}
                                    <div className='space-y-1'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <XCircle className='mr-2 h-4 w-4 text-rose-500' />
                                                <span className='text-sm'>Wrong Questions</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium'>{totalWrongQuestions}</span>
                                                <Badge
                                                    variant='outline'
                                                    className='border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400'>
                                                    {Math.round(wrongPercentage)}%
                                                </Badge>
                                            </div>
                                        </div>
                                        <Progress
                                            value={wrongPercentage}
                                            className='h-1.5'
                                            indicatorColor='bg-rose-500'
                                            barColor='bg-rose-500/20 dark:bg-rose-500/30'
                                        />
                                    </div>

                                    {/* Skipped Questions */}
                                    <div className='space-y-1'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <Info className='mr-2 h-4 w-4 text-amber-500' />
                                                <span className='text-sm'>Unanswered Questions</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <span className='font-medium'>{totalSkippedQuestions}</span>
                                                <Badge
                                                    variant='outline'
                                                    className='border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'>
                                                    {Math.round(skippedPercentage)}%
                                                </Badge>
                                            </div>
                                        </div>
                                        <Progress
                                            value={skippedPercentage}
                                            className='h-1.5'
                                            indicatorColor='bg-amber-500'
                                            barColor='bg-amber-100 dark:bg-amber-700/50'
                                        />
                                    </div>
                                </div>

                                {/* Marks Breakdown */}
                                <div className='mt-2 space-y-2 border-t pt-2'>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-sm font-medium'>Marks Breakdown</span>
                                    </div>
                                    <div className='grid grid-cols-2 gap-2 text-sm'>
                                        <div className='flex justify-between'>
                                            <span className='text-muted-foreground flex items-center gap-2'>
                                                <CheckCircle className='size-4 text-emerald-500' />
                                                Correct:
                                            </span>
                                            <span className='font-medium text-emerald-600 dark:text-emerald-400'>
                                                +{totalCorrectMarks}
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='text-muted-foreground flex items-center gap-2'>
                                                <XCircle className='size-4 text-rose-500' />
                                                Wrong:
                                            </span>
                                            <span className='font-medium text-rose-600 dark:text-rose-400'>
                                                -{totalWrongMarks}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// Helper function to parse time string(HH: MM: SS) to minutes
function parseTimeToMinutes(timeString: string): number {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    return hours * 60 + minutes + seconds / 60;
}

// Helper function to calculate average time per question
function calculateTimePerQuestion(totalTime: string, attemptedQuestions: number): string {
    if (attemptedQuestions === 0) return 'N/A';

    const [hours, minutes, seconds] = totalTime.split(':').map(Number);
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const secondsPerQuestion = Math.round(totalSeconds / attemptedQuestions);

    if (secondsPerQuestion < 60) {
        return `${secondsPerQuestion} sec`;
    } else {
        const mins = Math.floor(secondsPerQuestion / 60);
        const secs = secondsPerQuestion % 60;

        return `${mins}:${secs.toString().padStart(2, '0')} min`;
    }
}
