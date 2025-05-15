'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
    Bar,
    BarChart,
    Cell,
    Pie,
    PieChart,
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

interface PerformanceChartsProps {
    record: {
        totalQuestions: number;
        totalCorrectQuestions: number;
        totalWrongQuestions: number;
        totalSkippedQuestions: number;
        totalMarks: number;
        obtainedMarks: number;
        totalCorrectMarks: number;
        totalWrongMarks: number;
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
    };
}

export function PerformanceCharts({ record }: PerformanceChartsProps) {
    // Data for pie chart
    const pieData = [
        { name: 'Correct', value: record.totalCorrectQuestions, color: 'hsl(var(--chart-1))' },
        { name: 'Wrong', value: record.totalWrongQuestions, color: 'hsl(var(--chart-2))' },
        { name: 'Skipped', value: record.totalSkippedQuestions, color: 'hsl(var(--chart-3))' }
    ];

    // Data for bar chart
    const barData = [
        {
            name: 'Marks',
            Obtained: record.obtainedMarks,
            Correct: record.totalCorrectMarks,
            Wrong: record.totalWrongMarks
        }
    ];

    // Data for radar chart (subject performance)
    const radarData = record.sectionWise.map((section) => {
        const percentageScore = section.correctMarks > 0 ? (section.obtainedMarks / section.correctMarks) * 100 : 0;

        return {
            subject: section.name,
            score: Number.parseFloat(percentageScore.toFixed(1)),
            fullMark: 100
        };
    });

    // Data for subject comparison bar chart
    const subjectComparisonData = record.sectionWise.map((section) => {
        return {
            name: section.name,
            Correct: section.correctAnswers,
            Wrong: section.wrongAnswers,
            Skipped: section.skippedQuestions
        };
    });

    return (
        <Tabs defaultValue='overview' className='w-full'>
            <TabsList className='mb-4'>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='subjects'>Subject Comparison</TabsTrigger>
                <TabsTrigger value='marks'>Marks Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value='overview' className='space-y-4'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                    {/* Pie Chart */}
                    <Card>
                        <CardContent className='pt-6'>
                            <h3 className='mb-4 text-center text-lg font-medium'>Questions Breakdown</h3>
                            <div className='h-[250px] w-full'>
                                <ChartContainer
                                    config={{
                                        correct: {
                                            label: 'Correct',
                                            color: 'hsl(var(--chart-1))'
                                        },
                                        wrong: {
                                            label: 'Wrong',
                                            color: 'hsl(var(--chart-2))'
                                        },
                                        skipped: {
                                            label: 'Skipped',
                                            color: 'hsl(var(--chart-3))'
                                        }
                                    }}
                                    className='h-full'>
                                    <ResponsiveContainer width='100%' height='100%'>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx='50%'
                                                cy='50%'
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey='value'
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                labelLine={false}>
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Radar Chart */}
                    <Card>
                        <CardContent className='pt-6'>
                            <h3 className='mb-4 text-center text-lg font-medium'>Subject Performance</h3>
                            <div className='h-[250px] w-full'>
                                <ResponsiveContainer width='100%' height='100%'>
                                    <RadarChart cx='50%' cy='50%' outerRadius='80%' data={radarData}>
                                        <PolarGrid />
                                        <PolarAngleAxis
                                            dataKey='subject'
                                            tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                                        />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                        <Radar
                                            name='Score'
                                            dataKey='score'
                                            stroke='hsl(var(--primary))'
                                            fill='hsl(var(--primary))'
                                            fillOpacity={0.5}
                                        />
                                        <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            <TabsContent value='subjects'>
                <Card>
                    <CardContent className='pt-6'>
                        <h3 className='mb-4 text-center text-lg font-medium'>Subject-wise Question Analysis</h3>
                        <div className='h-[300px] w-full'>
                            <ChartContainer
                                config={{
                                    Correct: {
                                        label: 'Correct',
                                        color: 'hsl(var(--chart-1))'
                                    },
                                    Wrong: {
                                        label: 'Wrong',
                                        color: 'hsl(var(--chart-2))'
                                    },
                                    Skipped: {
                                        label: 'Skipped',
                                        color: 'hsl(var(--chart-3))'
                                    }
                                }}
                                className='h-full'>
                                <ResponsiveContainer width='100%' height='100%'>
                                    <BarChart data={subjectComparisonData} layout='vertical'>
                                        <XAxis type='number' />
                                        <YAxis dataKey='name' type='category' width={100} />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey='Correct' stackId='a' fill='var(--color-Correct)' />
                                        <Bar dataKey='Wrong' stackId='a' fill='var(--color-Wrong)' />
                                        <Bar dataKey='Skipped' stackId='a' fill='var(--color-Skipped)' />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value='marks'>
                <Card>
                    <CardContent className='pt-6'>
                        <h3 className='mb-4 text-center text-lg font-medium'>Marks Distribution</h3>
                        <div className='h-[300px] w-full'>
                            <ChartContainer
                                config={{
                                    Obtained: {
                                        label: 'Obtained Marks',
                                        color: 'hsl(var(--chart-1))'
                                    },
                                    Correct: {
                                        label: 'Correct Marks',
                                        color: 'hsl(var(--chart-2))'
                                    },
                                    Wrong: {
                                        label: 'Wrong Marks',
                                        color: 'hsl(var(--chart-3))'
                                    }
                                }}
                                className='h-full'>
                                <ResponsiveContainer width='100%' height='100%'>
                                    <BarChart data={barData}>
                                        <XAxis dataKey='name' />
                                        <YAxis />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey='Obtained' fill='var(--color-Obtained)' />
                                        <Bar dataKey='Correct' fill='var(--color-Correct)' />
                                        <Bar dataKey='Wrong' fill='var(--color-Wrong)' />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
