'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import { CheckCircle2 } from 'lucide-react';

export interface StepCircleProps {
    completed: boolean;
    current: boolean;
    label: string;
}

export const StepCircle: React.FC<StepCircleProps> = ({ completed, current, label }) => (
    <div
        className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200',
            completed
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : current
                  ? 'border-primary bg-background border-2'
                  : 'border-foreground/40 bg-background hover:border-muted-foreground border-2'
        )}
        aria-current={current ? 'step' : undefined}>
        {completed ? (
            <CheckCircle2 className='h-5 w-5' aria-hidden='true' />
        ) : current ? (
            <span className='bg-primary h-2.5 w-2.5 rounded-full' aria-hidden='true' />
        ) : (
            <span className='group-hover:bg-foreground/70 h-2.5 w-2.5 rounded-full bg-transparent' aria-hidden='true' />
        )}
        <span className='sr-only'>{label}</span>
    </div>
);

StepCircle.displayName = 'StepCircle';
