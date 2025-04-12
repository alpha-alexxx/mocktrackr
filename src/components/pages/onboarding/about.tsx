'use client';

import { useRef } from 'react';

import { siteConfig } from '@/lib/site/site-config';

import { motion, useInView } from 'framer-motion';

export default function About() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section id='about' className='relative overflow-hidden py-24'>
            {/* Background elements */}
            <div className='absolute inset-0 z-0'>
                <div className='absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl filter'></div>
                <div className='absolute right-1/3 bottom-1/3 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl filter'></div>
            </div>

            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className='mx-auto max-w-3xl text-center'>
                    <h2 className='mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
                        {siteConfig.about.title}
                    </h2>
                    <p className='mb-8 text-lg text-gray-400'>{siteConfig.about.description}</p>

                    <div className='inline-block rounded-lg bg-gradient-to-r from-emerald-600/20 to-blue-600/20 px-4 py-2 text-sm text-emerald-400'>
                        <span className='font-medium'>Made by SSC Aspirants, for Aspirants</span>
                    </div>

                    <div className='mt-12 flex justify-center'>
                        <div className='grid grid-cols-3 gap-6'>
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                    transition={{ duration: 0.3, delay: 0.1 * i }}
                                    className='flex flex-col items-center'>
                                    <div className='mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30'>
                                        <div className='flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-xl font-bold text-white'>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    </div>
                                    <div className='text-sm font-medium text-white'>Team Member {i + 1}</div>
                                    <div className='text-xs text-gray-400'>SSC Aspirant</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
