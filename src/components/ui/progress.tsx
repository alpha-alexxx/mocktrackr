'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import * as ProgressPrimitive from '@radix-ui/react-progress';

interface ProgressProps extends React.ComponentProps<typeof ProgressPrimitive.Root> {
    indicatorColor?: string;
    barColor?: string;
}

function Progress({ className, value, indicatorColor, barColor, ...props }: ProgressProps) {
    return (
        <ProgressPrimitive.Root
            data-slot='progress'
            className={cn('relative h-2 w-full overflow-hidden rounded-full', barColor || 'bg-primary/20', className)}
            {...props}>
            <ProgressPrimitive.Indicator
                data-slot='progress-indicator'
                className={cn('h-full w-full flex-1 transition-all', indicatorColor || 'bg-primary')}
                style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };
