'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { RadarPerformanceChart } from './charts/subject-performance-radar';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PerformanceOverviewProps {
    totalQuestions: number;
    totalCorrectQuestions: number;
    totalWrongQuestions: number;
    totalSkippedQuestions: number;
    totalMarks: number;
    obtainedMarks: number;
    totalCorrectMarks: number;
    totalWrongMarks: number;
    percentile: number;
    sectionWise: {
        name: string;
        totalQuestions: number;
        attemptedQuestions: number;
        correctAnswers: number;
        wrongAnswers: number;
        skippedQuestions: number;
        timeTaken: string;
        obtainedMarks: number;
        correctMarks: number;
        wrongMarks: number;
    }[];
}

export function PerformanceOverview(record: PerformanceOverviewProps) {
    // Prepare data for stacked bar chart
    const stackedBarData = record.sectionWise.map((section) => {
        return {
            name: section.name,
            Correct: section.correctAnswers,
            Wrong: section.wrongAnswers,
            Skipped: section.skippedQuestions
        };
    });

    // Prepare data for pie chart
    const pieData = [
        { name: 'Correct', value: record.totalCorrectQuestions, color: 'hsl(142, 76%, 36%)' },
        { name: 'Wrong', value: record.totalWrongQuestions, color: 'hsl(346, 84%, 61%)' },
        { name: 'Skipped', value: record.totalSkippedQuestions, color: 'hsl(45, 93%, 47%)' }
    ].filter((item) => item.value > 0);

    // Prepare data for marks distribution
    const marksData = [
        {
            name: 'Marks',
            Obtained: record.obtainedMarks,
            Maximum: record.totalMarks,
            Correct: record.totalCorrectMarks,
            Negative: record.totalWrongMarks
        }
    ];

    // Custom tooltip component for stacked bar chart
    const CustomBarTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);

            return (
                <div className='bg-background rounded-lg border p-3 text-sm shadow-lg'>
                    <p className='mb-1 font-medium'>{label}</p>
                    <div className='space-y-1'>
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className='flex items-center justify-between gap-4'>
                                <div className='flex items-center'>
                                    <div
                                        className='mr-2 size-4 rounded-xs'
                                        style={{ backgroundColor: entry.color }}></div>
                                    <span className='text-muted-foreground'>{entry.name}:</span>
                                </div>
                                <span className='font-semibold'>
                                    {entry.value} ({((entry.value / total) * 100).toFixed(1)}%)
                                </span>
                            </div>
                        ))}
                        <div className='mt-1 flex items-center justify-between gap-4 border-t pt-1'>
                            <span className='text-muted-foreground'>Total:</span>
                            <span className='font-medium'>{total}</span>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    // Custom tooltip component for pie chart
    const CustomPieTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const percentage = ((data.value / record.totalQuestions) * 100).toFixed(1);

            return (
                <div className='bg-background rounded-lg border p-3 text-sm shadow-lg'>
                    <div className='mb-1 flex items-center'>
                        <div
                            className='mr-2 h-3 w-3 rounded-full'
                            style={{ backgroundColor: data.payload.color }}></div>
                        <p className='font-medium'>{data.name}</p>
                    </div>
                    <div className='space-y-1'>
                        <div className='flex items-center justify-between gap-4'>
                            <span className='text-muted-foreground'>Count:</span>
                            <span className='font-medium'>{data.value}</span>
                        </div>
                        <div className='flex items-center justify-between gap-4'>
                            <span className='text-muted-foreground'>Percentage:</span>
                            <span className='font-medium'>{percentage}%</span>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div className='space-y-6'>
            {/* Chart Visualizations */}
            <Tabs defaultValue='radar' className='w-full'>
                <TabsList className='mb-4 grid grid-cols-4 md:w-auto'>
                    <TabsTrigger value='radar'>Performance Radar</TabsTrigger>
                    <TabsTrigger value='distribution'>Question Distribution</TabsTrigger>
                    <TabsTrigger value='subjects'>Subject Breakdown</TabsTrigger>
                    <TabsTrigger value='marks'>Marks Analysis</TabsTrigger>
                </TabsList>

                {/* Radar Chart */}
                <TabsContent value='radar'>
                    <RadarPerformanceChart record={record} />
                </TabsContent>

                {/* Pie Chart */}
                <TabsContent value='distribution'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Question Distribution</CardTitle>
                            <CardDescription>Breakdown of correct, wrong, and skipped questions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                                <div className='flex h-[300px] items-center justify-center'>
                                    <ResponsiveContainer width='100%' height='100%'>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx='50%'
                                                cy='50%'
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={2}
                                                dataKey='value'
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name}: ${(percent * 100).toFixed(0)}%`
                                                }>
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomPieTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className='flex flex-col justify-center space-y-6'>
                                    <div className='space-y-4'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <div className='mr-2 h-4 w-4 rounded-full bg-emerald-500'></div>
                                                <span>Correct</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Badge
                                                    variant='default'
                                                    className='text-foreground border-emerald-500 bg-emerald-500/20'>
                                                    {record.totalCorrectQuestions} Questions
                                                </Badge>
                                            </div>
                                        </div>
                                        <Progress
                                            value={(record.totalCorrectQuestions / record.totalQuestions) * 100}
                                            className='h-2'
                                            indicatorColor='bg-emerald-500'
                                            barColor='bg-emerald-500/20'
                                        />
                                    </div>

                                    <div className='space-y-4'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <div className='mr-2 h-4 w-4 rounded-full bg-rose-500'></div>
                                                <span>Wrong</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Badge
                                                    variant='default'
                                                    className='text-foreground border-rose-500 bg-rose-500/20'>
                                                    {record.totalWrongQuestions} Questions
                                                </Badge>
                                            </div>
                                        </div>
                                        <Progress
                                            value={(record.totalWrongQuestions / record.totalQuestions) * 100}
                                            className='h-2'
                                            indicatorColor='bg-rose-500'
                                            barColor='bg-rose-500/20'
                                        />
                                    </div>

                                    <div className='space-y-4'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <div className='mr-2 h-4 w-4 rounded-full bg-amber-500'></div>
                                                <span>Skipped</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <Badge
                                                    variant='default'
                                                    className='text-foreground border-amber-500 bg-amber-500/20'>
                                                    {record.totalSkippedQuestions} Questions
                                                </Badge>
                                            </div>
                                        </div>
                                        <Progress
                                            value={(record.totalSkippedQuestions / record.totalQuestions) * 100}
                                            className='h-2'
                                            indicatorColor='bg-amber-500'
                                            barColor='bg-amber-500/20'
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Stacked Bar Chart */}
                <TabsContent value='subjects'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Subject-wise Question Breakdown</CardTitle>
                            <CardDescription>
                                Distribution of correct, wrong, and skipped questions by subject
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='h-[400px] w-full'>
                                <ResponsiveContainer width='100%' height='100%'>
                                    <BarChart
                                        data={stackedBarData}
                                        layout='vertical'
                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
                                        <XAxis type='number' stroke='var(--muted-foreground)' />
                                        <YAxis
                                            dataKey='name'
                                            type='category'
                                            width={100}
                                            stroke='var(--muted-foreground)'
                                            tick={{ fill: 'var(--foreground)' }}
                                        />
                                        <Tooltip content={<CustomBarTooltip />} />
                                        <Legend />
                                        <Bar
                                            dataKey='Correct'
                                            stackId='a'
                                            fill='hsl(142, 76%, 36%)'
                                            className='cursor-pointer'
                                        />
                                        <Bar
                                            dataKey='Wrong'
                                            stackId='a'
                                            fill='hsl(346, 84%, 61%)'
                                            className='cursor-pointer'
                                        />
                                        <Bar
                                            dataKey='Skipped'
                                            stackId='a'
                                            fill='hsl(45, 93%, 47%)'
                                            className='cursor-pointer'
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Marks Analysis */}
                <TabsContent value='marks'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Marks Analysis</CardTitle>
                            <CardDescription>
                                Breakdown of marks obtained, maximum marks, and negative marking
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='h-[400px] w-full'>
                                <ResponsiveContainer width='100%' height='100%'>
                                    <BarChart data={marksData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray='3 3' stroke='var(--border)' />
                                        <XAxis dataKey='name' stroke='var(--muted-foreground)' />
                                        <YAxis stroke='var(--muted-foreground)' />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey='Maximum' fill='hsl(217, 91%, 60%)' />
                                        <Bar dataKey='Obtained' fill='hsl(142, 76%, 36%)' />
                                        <Bar dataKey='Correct' fill='hsl(262, 83%, 58%)' />
                                        <Bar dataKey='Negative' fill='hsl(346, 84%, 61%)' />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
                                <div className='space-y-1'>
                                    <div className='flex items-center'>
                                        <div className='mr-2 h-3 w-3 rounded-full bg-[hsl(217,91%,60%)]'></div>
                                        <p className='text-muted-foreground text-sm'>Maximum Marks</p>
                                    </div>
                                    <p className='text-lg font-medium'>{record.totalMarks}</p>
                                </div>
                                <div className='space-y-1'>
                                    <div className='flex items-center'>
                                        <div className='mr-2 h-3 w-3 rounded-full bg-[hsl(142,76%,36%)]'></div>
                                        <p className='text-muted-foreground text-sm'>Obtained Marks</p>
                                    </div>
                                    <p className='text-lg font-medium'>{record.obtainedMarks}</p>
                                </div>
                                <div className='space-y-1'>
                                    <div className='flex items-center'>
                                        <div className='mr-2 h-3 w-3 rounded-full bg-[hsl(262,83%,58%)]'></div>
                                        <p className='text-muted-foreground text-sm'>Correct Marks</p>
                                    </div>
                                    <p className='text-lg font-medium'>{record.totalCorrectMarks}</p>
                                </div>
                                <div className='space-y-1'>
                                    <div className='flex items-center'>
                                        <div className='mr-2 h-3 w-3 rounded-full bg-[hsl(346,84%,61%)]'></div>
                                        <p className='text-muted-foreground text-sm'>Negative Marks</p>
                                    </div>
                                    <p className='text-lg font-medium'>{record.totalWrongMarks}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
