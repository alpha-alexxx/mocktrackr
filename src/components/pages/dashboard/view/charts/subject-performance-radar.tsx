'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Separator } from '@/components/ui/separator';

import { PerformanceOverviewProps } from '../performance-overview';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

const chartConfig = {
    accuracy: { label: 'Accuracy', color: 'hsl(140, 70%, 45%)' },
    attemptRate: { label: 'Attempt Rate', color: 'hsl(45, 90%, 50%)' },
    scorePercentage: { label: 'Score Rate', color: 'hsl(210, 80%, 55%)' }
} satisfies ChartConfig;

export function RadarPerformanceChart({ record }: { record: PerformanceOverviewProps }) {
    const radarData = record.sectionWise.map((section) => {
        const totalAttempted = section.correctAnswers + section.wrongAnswers;
        const sectionAccuracy = totalAttempted > 0 ? (section.correctAnswers / totalAttempted) * 100 : 0;

        return {
            subject: section.name,
            accuracy: Number.parseFloat(sectionAccuracy.toFixed(1)),
            attemptRate: Number.parseFloat(((section.attemptedQuestions / section.totalQuestions) * 100).toFixed(1)),
            scorePercentage: Number.parseFloat(((section.obtainedMarks / section.correctMarks) * 100).toFixed(1))
        };
    });

    return (
        <Card>
            <CardHeader className='items-center pb-4'>
                <CardTitle>Performance Radar</CardTitle>
                <CardDescription>Accuracy, Attempt Rate, and Score across subjects</CardDescription>
            </CardHeader>
            <CardContent className='pb-0'>
                <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[300px] w-full'>
                    <RadarChart data={radarData} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                        <ChartTooltip
                            cursor={false}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const nameToKey: Record<string, keyof typeof chartConfig> = {
                                        Accuracy: 'accuracy',
                                        'Attempt Rate': 'attemptRate',
                                        'Score Rate': 'scorePercentage'
                                    };

                                    return (
                                        <div
                                            className='bg-background rounded-lg p-4 shadow-lg'
                                            style={{ fontSize: '0.9rem' }}>
                                            <div className='mb-1 text-sm font-semibold'>
                                                {payload[0].payload.subject}
                                            </div>
                                            <Separator className='my-1' />
                                            {payload.map((item) => {
                                                const name = item.name as keyof typeof nameToKey;
                                                const key = nameToKey[name];
                                                const color = chartConfig[key]?.color ?? 'gray';
                                                const label = chartConfig[key]?.label ?? item.name;
                                                const value = item.value ?? 0;

                                                return (
                                                    <div key={key} className='flex items-center gap-2 font-medium'>
                                                        <span
                                                            className='inline-block size-4 rounded-xs'
                                                            style={{ backgroundColor: color }}
                                                        />
                                                        {label}:{' '}
                                                        <span className='font-mono font-semibold'>{value}%</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                }

                                return null;
                            }}
                        />

                        <PolarAngleAxis dataKey='subject' fontSize={12} />
                        <PolarGrid />
                        <Radar
                            name='Accuracy'
                            dataKey='accuracy'
                            fill={chartConfig.accuracy.color}
                            fillOpacity={0.5}
                            stroke={chartConfig.accuracy.color}
                        />
                        <Radar
                            name='Attempt Rate'
                            dataKey='attemptRate'
                            fill={chartConfig.attemptRate.color}
                            fillOpacity={0.4}
                            stroke={chartConfig.attemptRate.color}
                        />
                        <Radar
                            name='Score Rate'
                            dataKey='scorePercentage'
                            fill={chartConfig.scorePercentage.color}
                            fillOpacity={0.3}
                            stroke={chartConfig.scorePercentage.color}
                        />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className='flex flex-col gap-2 text-sm'>
                <div className='flex flex-row gap-4'>
                    {Object.entries(chartConfig).map(([key, { label, color }]) => {
                        return (
                            <div key={key} className='flex items-center gap-1 leading-none'>
                                <span className='inline-block size-5 rounded-sm' style={{ backgroundColor: color }} />
                                <span className='font-semibold'>{label}</span>
                            </div>
                        );
                    })}
                </div>
            </CardFooter>
        </Card>
    );
}
