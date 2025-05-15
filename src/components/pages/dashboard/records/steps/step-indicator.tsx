import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

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
        <div className='relative z-10 w-full'>
            <Progress value={progressValue} className='absolute top-[18px] -z-2 mb-4 h-2 transition-all duration-500' />
            <div className='z-1 flex items-center justify-between'>
                {steps.map((step, index) => (
                    <div key={step.id} className='flex flex-col items-center justify-center'>
                        <div
                            className={cn(
                                'flex size-10 items-center justify-center rounded-full border-2 text-sm font-medium backdrop-blur-lg transition-colors duration-300',
                                currentStep === step.id
                                    ? 'border-blue-600 bg-blue-600 font-bold text-white'
                                    : currentStep > step.id
                                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                                      : 'border-gray-300 text-gray-500',
                                index === 0 && 'mr-10',
                                index === 1 && 'mr-5',
                                index === steps.length - 1 && 'ml-10',
                                index === steps.length - 2 && 'ml-5'
                            )}>
                            {currentStep > step.id ? <Check className='h-5 w-5' /> : step.id}
                        </div>
                        <span
                            className={cn(
                                'mt-2 w-20 text-xs font-medium text-nowrap',
                                currentStep === step.id
                                    ? 'font-bold text-blue-600'
                                    : currentStep > step.id
                                      ? 'text-blue-600'
                                      : 'text-gray-500'
                            )}>
                            {step.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
