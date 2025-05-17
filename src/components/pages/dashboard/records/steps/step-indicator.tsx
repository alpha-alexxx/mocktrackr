import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

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
                <div className='absolute left-0 top-1/2 w-full z-[3] -translate-y-1/2'>
                    <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${progressValue}%` }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                        className="h-1 md:h-2 bg-blue-600 rounded-full"
                    />
                </div>
                <div className="h-1 absolute left-0 top-1/2 -translate-y-1/2 md:h-2 bg-slate-200 dark:bg-slate-700 rounded-full w-full z-[2]" />

                {/* Step circles */}
                <div className='relative z-[4] flex justify-between'>
                    {steps.map((step) => (
                        <div key={step.id} className='flex flex-col items-center'>
                            <div
                                className={cn(
                                    'flex size-8 md:size-10 items-center justify-center rounded-full border-2 text-sm font-medium backdrop-blur-lg transition-colors duration-300',
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
            <div className="w-full hidden md:flex text-nowrap flex-row items-center justify-between">
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
