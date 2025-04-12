'use client';

import { useRef } from 'react';

import Image from 'next/image';

import { siteConfig } from '@/lib/site/site-config';

import { motion, useInView } from 'framer-motion';
import { Edit, FileDown, Share2 } from 'lucide-react';

export default function Showcase() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    // Placeholder images for the mockups
    const mockImages = [
        '/placeholder.svg?height=400&width=600',
        '/placeholder.svg?height=400&width=600',
        '/placeholder.svg?height=400&width=600'
    ];

    return (
        <section id='showcase' className='relative overflow-hidden py-24'>
            {/* Background elements */}
            <div className='absolute inset-0 z-0'>
                <div className='absolute top-1/4 right-1/3 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl filter'></div>
                <div className='absolute bottom-1/4 left-1/3 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl filter'></div>
            </div>

            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className='mb-16 text-center'>
                    <h2 className='mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
                        {siteConfig.showcase.title}
                    </h2>
                    <p className='mx-auto max-w-2xl text-lg text-gray-400'>{siteConfig.showcase.description}</p>
                </motion.div>

                <div ref={ref} className='relative'>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className='absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-600 to-transparent dark:via-emerald-400'></motion.div>

                    <div className='scrollbar-hide flex snap-x space-x-6 overflow-x-auto pb-8'>
                        {mockImages.map((image, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                className='group w-full flex-shrink-0 snap-center sm:w-[500px]'>
                                <div className='relative rounded-xl border border-white/10 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-1 shadow-xl backdrop-blur-sm'>
                                    <div className='absolute -top-3 right-3 -left-3 h-1.5 rounded-full bg-gradient-to-r from-emerald-600 to-blue-600 blur-sm dark:from-emerald-400 dark:to-blue-400'></div>
                                    <div className='absolute -right-3 -bottom-3 left-3 h-1.5 rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 blur-sm dark:from-blue-400 dark:to-emerald-400'></div>

                                    <div className='overflow-hidden rounded-lg bg-gray-900/80 backdrop-blur-sm'>
                                        <div className='flex h-8 items-center justify-between bg-gray-800/50 px-4'>
                                            <div className='flex space-x-2'>
                                                <div className='h-3 w-3 rounded-full bg-red-500'></div>
                                                <div className='h-3 w-3 rounded-full bg-yellow-500'></div>
                                                <div className='h-3 w-3 rounded-full bg-green-500'></div>
                                            </div>
                                            <div className='text-xs text-gray-400'>Mock Test Report #{index + 1}</div>
                                        </div>

                                        <div className='relative'>
                                            <Image
                                                src={image || '/placeholder.svg'}
                                                alt={`MockTrackr Report Card ${index + 1}`}
                                                width={600}
                                                height={400}
                                                className='h-auto w-full'
                                            />

                                            {/* Overlay with actions on hover */}
                                            <div className='absolute inset-0 flex items-center justify-center gap-4 bg-gray-900/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100'>
                                                <button className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20'>
                                                    <FileDown className='h-5 w-5 text-white' />
                                                </button>
                                                <button className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20'>
                                                    <Share2 className='h-5 w-5 text-white' />
                                                </button>
                                                <button className='flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20'>
                                                    <Edit className='h-5 w-5 text-white' />
                                                </button>
                                            </div>
                                        </div>

                                        <div className='p-4'>
                                            <div className='mb-2 flex items-center justify-between'>
                                                <div className='text-sm font-medium text-white'>
                                                    SSC CGL Tier 1 Mock #12
                                                </div>
                                                <div className='text-xs text-gray-400'>April 10, 2025</div>
                                            </div>

                                            <div className='mb-3 grid grid-cols-4 gap-2'>
                                                {['Reasoning', 'English', 'Quant', 'GK'].map((subject, i) => (
                                                    <div key={i} className='rounded-md bg-gray-800/50 p-2 text-center'>
                                                        <div className='text-xs text-gray-400'>{subject}</div>
                                                        <div className='text-sm font-medium text-white'>
                                                            {20 + i}/<span className='text-xs'>25</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className='flex items-center justify-between'>
                                                <div className='text-sm text-gray-300'>
                                                    Total Score: <span className='font-medium text-white'>87/100</span>
                                                </div>
                                                <div className='rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20 px-2 py-1 text-xs text-emerald-300'>
                                                    Top 5%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
