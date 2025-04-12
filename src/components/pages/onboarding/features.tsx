'use client';

import { useRef } from 'react';

import { BorderBeam } from '@/components/magicui/border-beam';
import { siteConfig } from '@/lib/site/site-config';

import { motion, useInView } from 'framer-motion';
import { BarChart3, CalendarDays, FileDown, ListPlus, type LucideIcon, NotebookPen, Target } from 'lucide-react';

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
    CalendarDays,
    Target,
    FileDown,
    BarChart3,
    NotebookPen,
    ListPlus
};

export default function Features() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <section id='features' className='relative overflow-hidden py-24'>
            {/* Background elements */}
            <div className='absolute inset-0 z-0'>
                <div className='absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl filter'></div>
                <div className='absolute bottom-1/3 left-1/4 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl filter'></div>
            </div>

            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className='mb-16 text-center'>
                    <h2 className='mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
                        Powerful Features for Serious Aspirants
                    </h2>
                    <p className='mx-auto max-w-2xl text-lg text-gray-400'>
                        Everything you need to track, analyze, and improve your SSC mock test performance in one place.
                    </p>
                </motion.div>

                <motion.div
                    ref={ref}
                    variants={container}
                    initial='hidden'
                    animate={isInView ? 'show' : 'hidden'}
                    className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
                    {siteConfig.features.map((feature, index) => {
                        const Icon = iconMap[feature.icon] || CalendarDays;

                        return (
                            <motion.div
                                key={index}
                                variants={item}
                                transition={{ duration: 0.5 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                className='group rounded-xl border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-6 backdrop-blur-sm'>
                                <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600/20 to-emerald-400/20 transition-all duration-300 group-hover:from-blue-600/30 group-hover:to-emerald-400/30'>
                                    <Icon className='h-6 w-6 text-blue-600 transition-colors duration-300 group-hover:text-blue-400' />
                                </div>
                                <h3 className='mb-2 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-emerald-300'>
                                    {feature.title}
                                </h3>
                                <p className='text-gray-400 transition-colors duration-300 group-hover:text-gray-300'>
                                    {feature.description}
                                </p>
                                <BorderBeam
                                    duration={6}
                                    size={400}
                                    className='from-transparent via-blue-500 to-transparent'
                                />
                                <BorderBeam
                                    duration={6}
                                    delay={index * 2}
                                    size={400}
                                    className='from-transparent via-emerald-500 to-transparent'
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
