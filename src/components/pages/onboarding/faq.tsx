'use client';

import { useRef } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { siteConfig } from '@/lib/site/site-config';

import { motion, useInView } from 'framer-motion';

export default function Faq() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section className='relative overflow-hidden py-24'>
            {/* Background elements */}
            <div className='absolute inset-0 z-0'>
                <div className='absolute top-1/3 right-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl filter'></div>
                <div className='absolute bottom-1/3 left-1/3 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl filter'></div>
            </div>

            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className='mb-16 text-center'>
                    <h2 className='mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-3xl font-bold text-transparent md:text-4xl'>
                        Frequently Asked Questions
                    </h2>
                    <p className='mx-auto max-w-2xl text-lg text-gray-400'>
                        Everything you need to know about MockTrackr.
                    </p>
                </motion.div>

                <div ref={ref} className='mx-auto max-w-3xl'>
                    <Accordion type='single' collapsible className='space-y-4'>
                        {siteConfig.faq.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}>
                                <AccordionItem
                                    value={`item-${index}`}
                                    className='rounded-lg border border-white/10 bg-gray-900/50 px-6 backdrop-blur-sm'>
                                    <AccordionTrigger className='py-4 text-left text-white transition-colors hover:text-emerald-300'>
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className='pb-4 text-gray-400'>{item.answer}</AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
