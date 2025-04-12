'use client';

import Link from 'next/link';

import { ShineBorder } from '@/components/magicui/shine-border';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site/site-config';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
    };

    return (
        <section id='home' className='relative flex min-h-screen items-center overflow-hidden pt-16'>
            {/* Background elements */}
            <div className='absolute inset-0 z-0'>
                <div className='absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl filter'></div>
                <div className='absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl filter'></div>
            </div>

            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid items-center gap-12 lg:grid-cols-2'>
                    <motion.div
                        variants={container}
                        initial='hidden'
                        animate='show'
                        className='flex flex-col space-y-8'>
                        <motion.div variants={item} className='space-y-2'>
                            <div className='mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-white/80 backdrop-blur-md'>
                                SSC CHSL & CGL Preparation Tool
                            </div>
                            <h1 className='bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl lg:text-6xl'>
                                {siteConfig.hero.title}
                            </h1>
                            <p className='mt-4 max-w-lg text-xl text-gray-300'>{siteConfig.hero.subtitle}</p>
                        </motion.div>

                        <motion.div variants={item} className='flex flex-wrap gap-4'>
                            <Link href={siteConfig.hero.cta.href}>
                                <Button
                                    size='lg'
                                    className='group rounded-full bg-gradient-to-r from-blue-600 to-emerald-400 px-8 text-white hover:from-blue-700 hover:to-emerald-600'>
                                    {siteConfig.hero.cta.label}
                                    <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
                                </Button>
                            </Link>
                            <Button
                                variant='outline'
                                size='lg'
                                className='rounded-full border-white/20 bg-white/5 px-8 text-white backdrop-blur-sm hover:bg-white/10'
                                asChild>
                                <Link href={'#features'}>Learn More</Link>
                            </Button>
                        </motion.div>

                        <motion.div variants={item} className='flex items-center space-x-4 text-sm text-gray-400'>
                            <div className='flex -space-x-2'>
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-900 bg-gradient-to-r from-blue-600 to-emerald-400 text-xs font-bold'>
                                        {String.fromCharCode(65 + i)}
                                    </div>
                                ))}
                            </div>
                            <span>Trusted by 1000+ SSC aspirants</span>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className='relative'>
                        <div className='relative rounded-2xl border border-white/10 bg-gradient-to-br from-blue-900/40 to-emerald-900/40 p-1 shadow-2xl backdrop-blur-xl'>
                            <ShineBorder shineColor={['#60A5FA ', '#2563EB', '#10B981', '#34D399']} />
                            <div className='absolute -right-4 -bottom-4 left-4 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-blue-600 blur-sm'></div>

                            <div className='overflow-hidden rounded-xl bg-gray-900/80 backdrop-blur-sm'>
                                <div className='flex h-8 items-center space-x-2 bg-gray-800/50 px-4'>
                                    <div className='h-3 w-3 rounded-full bg-red-500'></div>
                                    <div className='h-3 w-3 rounded-full bg-yellow-500'></div>
                                    <div className='h-3 w-3 rounded-full bg-green-500'></div>
                                    <div className='ml-4 text-xs text-gray-400'>MockTrackr Dashboard</div>
                                </div>
                                <div className='p-4'>
                                    <div className='grid grid-cols-2 gap-4'>
                                        <div className='rounded-lg border border-white/5 bg-gray-800/50 p-4'>
                                            <div className='mb-2 text-xs text-gray-400'>Today's Progress</div>
                                            <div className='text-2xl font-bold text-white'>85%</div>
                                            <div className='mt-2 h-2 w-full rounded-full bg-gray-700'>
                                                <div className='h-full w-[85%] rounded-full bg-gradient-to-r from-blue-600 to-emerald-400 dark:from-blue-400 dark:to-emerald-400'></div>
                                            </div>
                                        </div>
                                        <div className='rounded-lg border border-white/5 bg-gray-800/50 p-4'>
                                            <div className='mb-2 text-xs text-gray-400'>Mock Tests</div>
                                            <div className='text-2xl font-bold text-white'>12/15</div>
                                            <div className='mt-2 flex space-x-1'>
                                                {[...Array(15)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1 flex-1 rounded-full ${i < 12 ? 'bg-gradient-to-r from-blue-600 to-emerald-400 dark:from-blue-400 dark:to-emerald-400' : 'bg-gray-700'}`}></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mt-4 rounded-lg border border-white/5 bg-gray-800/50 p-4'>
                                        <div className='mb-4 flex items-center justify-between'>
                                            <div className='text-sm font-medium text-white'>Subject Performance</div>
                                            <div className='text-xs text-gray-400'>Last 7 days</div>
                                        </div>
                                        <div className='space-y-3'>
                                            {['Reasoning', 'English', 'Quantitative', 'General Awareness'].map(
                                                (subject, i) => (
                                                    <div key={i} className='space-y-1'>
                                                        <div className='flex justify-between text-xs'>
                                                            <span className='text-gray-300'>{subject}</span>
                                                            <span className='text-gray-400'>{70 + i * 5}%</span>
                                                        </div>
                                                        <div className='h-1.5 w-full rounded-full bg-gray-700'>
                                                            <div
                                                                className='h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-400 dark:from-blue-400 dark:to-emerald-400'
                                                                style={{ width: `${70 + i * 5}%` }}></div>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className='mt-4 grid grid-cols-3 gap-2'>
                                        {[...Array(6)].map((_, i) => (
                                            <div
                                                key={i}
                                                className='flex flex-col items-center justify-center rounded-lg border border-white/5 bg-gray-800/50 p-2'>
                                                <div className='mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-blue-600/20 to-emerald-400/20 dark:from-blue-400/20 dark:to-emerald-400/20'>
                                                    <div className='h-2 w-2 rounded-full bg-gradient-to-r from-blue-600 to-emerald-400 dark:from-blue-400 dark:to-emerald-400'></div>
                                                </div>
                                                <div className='text-xs text-gray-400'>Mock {i + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
