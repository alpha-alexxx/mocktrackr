'use client';

import { useRef } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site/site-config';

import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Cta() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section className='relative overflow-hidden py-24'>
            {/* Background elements */}
            <div className='absolute inset-0 z-0'>
                <div className='absolute inset-0 bg-gradient-to-br from-blue-900/20 to-emerald-900/20 dark:from-blue-800/20 dark:to-emerald-800/20'></div>
                <div className='absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl filter'></div>
                <div className='absolute bottom-1/4 left-1/4 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl filter'></div>
            </div>

            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className='mx-auto max-w-4xl'>
                    <div className='rounded-2xl border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-1 shadow-2xl backdrop-blur-xl'>
                        <div className='absolute -top-4 right-4 -left-4 h-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-400 blur-sm dark:from-blue-400 dark:to-emerald-400'></div>
                        <div className='absolute -right-4 -bottom-4 left-4 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-600 blur-sm dark:from-emerald-400 dark:to-blue-400'></div>

                        <div className='rounded-xl bg-gray-900/80 p-8 text-center backdrop-blur-sm md:p-12'>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: 0.2 }}>
                                <h2 className='mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
                                    {siteConfig.cta.title}
                                </h2>
                                <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-400'>
                                    {siteConfig.cta.subtitle}
                                </p>

                                <Link href={siteConfig.cta.button.href}>
                                    <Button
                                        size='lg'
                                        className='group rounded-full bg-gradient-to-r from-blue-600 to-emerald-400 px-8 text-white hover:from-blue-700 hover:to-emerald-600 dark:from-blue-400 dark:to-emerald-400 dark:hover:from-blue-400 dark:hover:to-emerald-400'>
                                        {siteConfig.cta.button.label}
                                        <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                                    </Button>
                                </Link>

                                <div className='mt-8 flex items-center justify-center space-x-4 text-sm text-gray-400'>
                                    <div className='flex -space-x-2'>
                                        {[...Array(4)].map((_, i) => (
                                            <div
                                                key={i}
                                                className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-900 bg-gradient-to-r from-blue-600 to-emerald-400 text-xs font-bold dark:from-blue-400 dark:to-emerald-400'>
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                        ))}
                                    </div>
                                    <span>Join 1000+ SSC aspirants today</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
