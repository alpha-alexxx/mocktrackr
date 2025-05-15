'use client';

import InsightDisplay from './insight-display';
import { AlertCircle, Lightbulb } from 'lucide-react';

interface OverallInsightsProps {
    keyPoints: string;
    learnings: string;
}

export function OverallInsights({ keyPoints, learnings }: OverallInsightsProps) {
    return (
        <div className='space-y-4'>
            {keyPoints && (
                <div>
                    <h3 className='mb-2 flex items-center text-sm font-medium text-amber-700 dark:text-amber-400'>
                        <AlertCircle className='mr-2 h-4 w-4' />
                        What went Wrong:
                    </h3>
                    <InsightDisplay content={keyPoints} />
                </div>
            )}

            {learnings && (
                <div>
                    <h3 className='mb-2 flex items-center text-sm font-medium text-emerald-700 dark:text-emerald-400'>
                        <Lightbulb className='mr-2 h-4 w-4' />
                        Rules to Remember:
                    </h3>
                    <InsightDisplay content={learnings} />
                </div>
            )}
        </div>
    );
}
