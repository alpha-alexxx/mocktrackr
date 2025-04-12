'use client';

import { motion } from 'framer-motion';
import { BookOpenCheck, Calculator, LineChart, PencilRuler } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Step {
    title: string;
    description: string;
    icon: keyof typeof iconMap;
}

const iconMap: Record<string, LucideIcon> = {
    BookOpenCheck,
    PencilRuler,
    Calculator,
    LineChart
};

const howItWorks: Step[] = [
    {
        title: '1. Choose Exam & Tier',
        description: "Start by selecting CGL or CHSL, and whether you're preparing for Tier 1 or Tier 2.",
        icon: 'BookOpenCheck'
    },
    {
        title: '2. Add Mock Details',
        description: 'Log subject-wise attempts, corrects, wrongs, time taken, and notes in one intuitive form.',
        icon: 'PencilRuler'
    },
    {
        title: '3. Auto-Calculate Score',
        description: 'Let us do the math — your score is auto-calculated as per SSC rules including negative marking.',
        icon: 'Calculator'
    },
    {
        title: '4. Analyze & Export',
        description: 'View daily cards, download PDF reports, and refine your strategy based on real insights.',
        icon: 'LineChart'
    }
];

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.6,
            ease: 'easeOut'
        }
    })
};

const StepCard = ({ title, description, icon, index }: Step & { index: number }) => {
    const Icon = iconMap[icon];

    return (
        <motion.div
            className='flex flex-col items-start rounded-2xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-lg transition-transform duration-300 hover:scale-[1.03]'
            custom={index}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
            variants={cardVariants}>
            <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-white shadow-md'>
                <Icon className='h-5 w-5' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-white'>{title}</h3>
            <p className='text-sm leading-relaxed text-gray-300'>{description}</p>
        </motion.div>
    );
};

const HowItWorks = () => {
    return (
        <section className='relative z-10 w-full bg-gradient-to-b from-[#0f172a] to-[#020617] px-6 py-24 md:px-10 lg:px-20'>
            <div className='pointer-events-none absolute inset-0'>
                <div className='absolute top-0 left-1/2 h-[40%] w-[140%] -translate-x-1/2 rounded-full bg-blue-500/10 opacity-40 blur-3xl'></div>
            </div>
            <div className='relative mx-auto max-w-7xl text-center'>
                <h2 className='mb-4 text-4xl font-bold text-white'>How It Works</h2>
                <p className='mx-auto mb-16 max-w-2xl text-lg text-gray-300'>
                    From selection to scoring, track your SSC preparation in 4 powerful steps.
                </p>
                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
                    {howItWorks.map((step, i) => (
                        <StepCard
                            key={i}
                            index={i}
                            title={step.title}
                            description={step.description}
                            icon={step.icon}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};
export default HowItWorks;
