'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useMobile } from '@/hooks/use-mobile';

import { Label, Pie, PieChart } from 'recharts';

type SectionPieChartProps = {
    correct: number;
    wrong: number;
    obtainedMarks: number;
    totalMarks: number;
    skipped: number;
};

const chartConfig = {
    correct: {
        label: 'Correct',
        color: '#22c55e' // green
    },
    wrong: {
        label: 'Wrong',
        color: '#ef4444' // red
    },
    skipped: {
        label: 'Skipped',
        color: '#f59e0b' // amber
    }
} satisfies ChartConfig;

export function SectionPieChart({ correct, wrong, skipped, obtainedMarks, totalMarks }: SectionPieChartProps) {
    const isMobile = useMobile();
    const chartData = [
        { status: 'correct', count: correct, fill: chartConfig.correct.color },
        { status: 'wrong', count: wrong, fill: chartConfig.wrong.color },
        { status: 'skipped', count: skipped, fill: chartConfig.skipped.color }
    ].filter((item) => item.count > 0);

    return (
        <Card className='flex w-full flex-col p-4'>
            <CardHeader className='items-center p-0 text-center'>
                <CardTitle className='text-lg'>Question Attempt Distribution</CardTitle>
                <CardDescription>Correct, Wrong, Skipped Overview</CardDescription>
            </CardHeader>
            <CardContent className='w-full flex-1 p-0'>
                <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[250px] w-full'>
                    <PieChart className='h-full w-full'>
                        <ChartTooltip cursor={true} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={chartData}
                            dataKey='count'
                            nameKey='status'
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            labelLine={!isMobile ? true : false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor='middle'
                                                dominantBaseline='middle'>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className='fill-foreground text-lg font-bold'>
                                                    {obtainedMarks}/{totalMarks}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className='fill-muted-foreground'>
                                                    Marks
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className='p-0'>
                <div className='flex w-full flex-row items-center justify-center gap-2 text-wrap'>
                    <div className='flex items-center gap-2'>
                        <div className='size-4 rounded bg-[#22c55e]' />
                        <span className='text-xs font-medium'>Correct Qs.</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='size-4 rounded bg-rose-500' />
                        <span className='text-xs font-medium'>Wrong Qs.</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='size-4 rounded bg-[#f59e0b]' />
                        <span className='text-xs font-medium'>Skipped Qs.</span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
