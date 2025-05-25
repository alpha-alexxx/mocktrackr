'use client';

import Link from 'next/link';

import Logo from '@/components/app-ui/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { siteConfig } from '@/lib/site/site-config';
import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

export default function Navbar() {
    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                'fixed top-0 right-0 left-0 z-50 transition-all duration-300',
                'bg-black/30 backdrop-blur-lg'
            )}>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex h-16 items-center justify-between'>
                    <Link href='/' className='flex items-center space-x-2 text-xl font-bold'>
                        <Logo className='size-6' />
                        <span className='bg-gradient-to-r from-emerald-400 to-blue-600 bg-clip-text text-transparent'>
                            {siteConfig.name}
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden items-center space-x-8 md:flex'>
                        {siteConfig.navItems.map((item, index) => (
                            <Link
                                key={index}
                                href={item.href}
                                className='text-sm font-medium text-gray-300 transition-colors hover:text-white'>
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className='hidden md:block'>
                        <Button
                            variant={'ghost'}
                            size={'sm'}
                            className='rounded-full bg-transparent text-white'
                            asChild>
                            <Link href={'/login'}>Login</Link>
                        </Button>
                        <Button
                            className='rounded-full bg-gradient-to-r from-blue-600 to-emerald-400 text-white hover:from-blue-700 hover:to-emerald-600 dark:from-blue-400 dark:to-emerald-400 dark:hover:from-blue-400 dark:hover:to-emerald-400'
                            size={'sm'}
                            asChild>
                            <Link href={'/register'}>Get Started</Link>
                        </Button>
                    </div>

                    {/* Mobile menu button */}
                    <div className='md:hidden'>
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className='text-gray-300 hover:text-white'>
                                    <Menu className='h-6 w-6' />
                                </button>
                            </SheetTrigger>
                            <SheetContent
                                side='right'
                                aria-describedby='nav items'
                                className='border-l border-white/10 bg-gray-900/95 p-0 backdrop-blur-lg'>
                                <SheetHeader className='border-b border-white/10 p-4'>
                                    <SheetTitle className='flex items-center space-x-2 text-white'>
                                        <Logo className='size-6' />
                                        <span className='bg-gradient-to-r from-emerald-400 to-blue-600 bg-clip-text text-transparent'>
                                            {siteConfig.name}
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className='px-4 py-6'>
                                    <nav className='flex flex-col space-y-4'>
                                        {siteConfig.navItems.map((item, index) => (
                                            <Link
                                                key={index}
                                                href={item.href}
                                                className='py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white'>
                                                {item.label}
                                            </Link>
                                        ))}
                                        <Button variant={'outline'} className='mt-4' asChild>
                                            <Link href={'/login'}>Login</Link>
                                        </Button>
                                        <Button
                                            className='mt-2 w-full bg-gradient-to-r from-blue-600 to-emerald-400 text-white hover:from-blue-700 hover:to-emerald-600 dark:from-blue-400 dark:to-emerald-400 dark:hover:from-blue-400 dark:hover:to-emerald-400'
                                            asChild>
                                            <Link href={'/register'}>Get Started</Link>
                                        </Button>
                                    </nav>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation is now handled by the Sheet component */}
        </motion.header>
    );
}
