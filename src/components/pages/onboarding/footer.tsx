'use client';

import Link from 'next/link';

import { siteConfig } from '@/lib/site/site-config';

import { motion } from 'framer-motion';
import { BookOpen, Github, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className='relative overflow-hidden border-t border-gray-200 bg-white'>
            {/* Background elements */}
            <div className='absolute inset-0 z-0'>
                <div className='absolute top-1/3 right-1/3 h-72 w-72 rounded-full bg-emerald-600/5 blur-3xl filter'></div>
                <div className='absolute bottom-1/3 left-1/3 h-72 w-72 rounded-full bg-blue-600/5 blur-3xl filter'></div>
            </div>

            <div className='relative z-10 container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='py-12'>
                    <div className='grid gap-8 md:grid-cols-4'>
                        <div className='space-y-4'>
                            <Link href='/' className='flex items-center space-x-2 text-xl font-bold'>
                                <BookOpen className='h-6 w-6 text-emerald-600' />
                                <span className='bg-gradient-to-r from-emerald-400 to-blue-600 bg-clip-text text-transparent'>
                                    {siteConfig.name}
                                </span>
                            </Link>
                            <p className='max-w-xs text-sm text-gray-600'>
                                Your daily companion for SSC CHSL/CGL mock test tracking and performance analysis.
                            </p>
                        </div>

                        <div>
                            <h3 className='mb-4 text-sm font-semibold text-gray-800'>Quick Links</h3>
                            <ul className='space-y-2'>
                                {siteConfig.footer.links.quick.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className='text-sm text-gray-600 transition-colors hover:text-gray-800'>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className='mb-4 text-sm font-semibold text-gray-800'>Legal</h3>
                            <ul className='space-y-2'>
                                {siteConfig.footer.links.legal.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            href={link.href}
                                            className='text-sm text-gray-600 transition-colors hover:text-gray-800'>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className='mb-4 text-sm font-semibold text-gray-800'>Connect</h3>
                            <ul className='space-y-2'>
                                <li>
                                    <Link
                                        href={siteConfig.footer.links.socials[0].href}
                                        className='flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-800'>
                                        <Github className='h-4 w-4' />
                                        GitHub
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={siteConfig.footer.links.socials[1].href}
                                        className='flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-800'>
                                        <Linkedin className='h-4 w-4' />
                                        LinkedIn
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col items-center justify-between border-t border-gray-200 py-6 md:flex-row'>
                    <p className='text-xs text-gray-600'>{siteConfig.footer.copyright}</p>
                    <div className='mt-4 flex items-center space-x-4 md:mt-0'>
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/10'>
                            <Github className='h-4 w-4 text-blue-600' />
                        </motion.div>
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/10'>
                            <Linkedin className='h-4 w-4 text-blue-600' />
                        </motion.div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
