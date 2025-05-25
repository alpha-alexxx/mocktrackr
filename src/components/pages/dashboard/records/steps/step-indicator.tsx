import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
    currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
    const steps = [
        { id: 1, name: 'Test Details' },
        { id: 2, name: 'Performance Metrics' },
        { id: 3, name: 'Section-Wise Details' },
        { id: 4, name: 'Overall Insights' }
    ];

    const progressValue = ((currentStep - 1) / (steps.length - 1)) * 100;

    return (
        <div>
            <div className='relative w-full py-8'>
                {/* Progress bar (behind the circles) */}
                <div className='absolute top-1/2 left-0 z-[3] w-full -translate-y-1/2'>
                    <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${progressValue}%` }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className='h-1 rounded-full bg-blue-600 md:h-2'
                    />
                </div>
                <div className='absolute top-1/2 left-0 z-[2] h-1 w-full -translate-y-1/2 rounded-full bg-slate-200 md:h-2 dark:bg-slate-700' />

                {/* Step circles */}
                <div className='relative z-[4] flex justify-between'>
                    {steps.map((step) => (
                        <div key={step.id} className='flex flex-col items-center'>
                            <div
                                className={cn(
                                    'flex size-8 items-center justify-center rounded-full border-2 text-sm font-medium backdrop-blur-lg transition-colors duration-300 md:size-10',
                                    currentStep === step.id
                                        ? 'border-blue-600 bg-blue-600 font-bold text-white'
                                        : currentStep > step.id
                                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                                          : 'border-gray-300 text-gray-500'
                                )}>
                                {currentStep > step.id ? <Check className='h-5 w-5' /> : step.id}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='hidden w-full flex-row items-center justify-between text-nowrap md:flex'>
                {steps.map((step) => (
                    <span
                        key={step.id}
                        className={cn(
                            'w-20 text-center text-xs font-medium',
                            currentStep === step.id
                                ? 'font-bold text-blue-600 dark:text-blue-400'
                                : currentStep > step.id
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-slate-600 dark:text-slate-200'
                        )}>
                        {step.name}
                    </span>
                ))}
            </div>
        </div>
    );
}
