'use client';

import { useRef } from 'react';

import { siteConfig } from '@/lib/site/site-config';

import { motion, useInView } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function Benefits() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section id='benefits' className='relative overflow-hidden py-24'>
            {/* Background elements */}
            <div className='absolute inset-0 z-0'>
                <div className='absolute top-1/3 left-1/4 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl filter'></div>
                <div className='absolute right-1/4 bottom-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl filter'></div>
            </div>

            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
                <div ref={ref} className='grid items-center gap-12 lg:grid-cols-2'>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                        transition={{ duration: 0.6 }}
                        className='relative'>
                        <div className='absolute -top-4 right-4 -left-4 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 blur-sm'></div>
                        <div className='absolute -right-4 -bottom-4 left-4 h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 blur-sm'></div>

                        <div className='rounded-xl border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-1 shadow-xl backdrop-blur-sm'>
                            <div className='overflow-hidden rounded-lg bg-gray-900/80 p-6 backdrop-blur-sm'>
                                <div className='mb-6 grid grid-cols-7 gap-2'>
                                    {[...Array(31)].map((_, i) => {
                                        const hasActivity = Math.random() > 0.6;

                                        return (
                                            <div
                                                key={i}
                                                className={`aspect-square rounded-md ${
                                                    hasActivity
                                                        ? 'bg-gradient-to-br from-emerald-500/30 to-blue-500/30'
                                                        : 'bg-gray-800/50'
                                                } flex items-center justify-center`}>
                                                <span className='text-xs text-gray-400'>{i + 1}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className='space-y-4'>
                                    <div className='rounded-lg border border-white/5 bg-gray-800/50 p-4'>
                                        <div className='mb-3 flex items-center justify-between'>
                                            <div className='text-sm font-medium text-white'>Monthly Progress</div>
                                            <div className='text-xs text-gray-400'>April 2025</div>
                                        </div>
                                        <div className='flex h-32 items-end gap-1'>
                                            {[...Array(7)].map((_, i) => {
                                                const height = 30 + Math.random() * 70;

                                                return (
                                                    <div key={i} className='flex flex-1 flex-col items-center gap-1'>
                                                        <div
                                                            className='w-full rounded-t-sm bg-gradient-to-t from-emerald-500 to-blue-500'
                                                            style={{ height: `${height}%` }}></div>
                                                        <div className='text-xs text-gray-400'>W{i + 1}</div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='rounded-lg border border-white/5 bg-gray-800/50 p-4'>
                                            <div className='mb-1 text-xs text-gray-400'>Accuracy Rate</div>
                                            <div className='text-2xl font-bold text-white'>78.5%</div>
                                            <div className='flex items-center text-xs text-green-400'>
                                                <svg
                                                    className='mr-1 h-3 w-3'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    viewBox='0 0 24 24'
                                                    xmlns='http://www.w3.org/2000/svg'>
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M5 10l7-7m0 0l7 7m-7-7v18'
                                                    />
                                                </svg>
                                                +2.4% from last week
                                            </div>
                                        </div>
                                        <div className='rounded-lg border border-white/5 bg-gray-800/50 p-4'>
                                            <div className='mb-1 text-xs text-gray-400'>Mock Tests</div>
                                            <div className='text-2xl font-bold text-white'>24</div>
                                            <div className='flex items-center text-xs text-green-400'>
                                                <svg
                                                    className='mr-1 h-3 w-3'
                                                    fill='none'
                                                    stroke='currentColor'
                                                    viewBox='0 0 24 24'
                                                    xmlns='http://www.w3.org/2000/svg'>
                                                    <path
                                                        strokeLinecap='round'
                                                        strokeLinejoin='round'
                                                        strokeWidth={2}
                                                        d='M5 10l7-7m0 0l7 7m-7-7v18'
                                                    />
                                                </svg>
                                                +3 from last week
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
                        transition={{ duration: 0.6 }}
                        className='space-y-6'>
                        <div>
                            <h2 className='mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
                                {siteConfig.benefits.title}
                            </h2>
                            <p className='mb-8 text-lg text-gray-400'>
                                Track your progress like never before and see real improvements in your SSC exam
                                preparation.
                            </p>
                        </div>

                        <ul className='space-y-4'>
                            {siteConfig.benefits.items.map((benefit, index) => (
                                <motion.li
                                    key={index}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3, delay: 0.1 * index }}
                                    className='flex items-start gap-3'>
                                    <CheckCircle2 className='mt-0.5 h-6 w-6 flex-shrink-0 text-emerald-500' />
                                    <span className='text-gray-300'>{benefit}</span>
                                </motion.li>
                            ))}
                        </ul>

                        <div className='pt-6'>
                            <div className='inline-block rounded-lg bg-gradient-to-r from-emerald-500/20 to-blue-500/20 px-4 py-2 text-sm text-emerald-300'>
                                <span className='font-medium'>Pro Tip:</span> Consistent tracking leads to 30% better
                                results in final exams.
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
