'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface StepLabelProps {
    label: string;
    completed: boolean;
}

export const StepLabel: React.FC<StepLabelProps> = ({ label, completed }) => (
    <span className={cn('text-foreground mt-2 text-xs text-nowrap', { 'font-semibold': completed })}>{label}</span>
);

StepLabel.displayName = 'StepLabel';
