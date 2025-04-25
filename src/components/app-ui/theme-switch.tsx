'use client';

import * as React from 'react';

import { useTheme } from 'next-themes';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Ensure component is mounted to avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const themes: Theme[] = ['light', 'dark', 'system'];
    const activeTheme = (theme as Theme) || 'system';

    const getThemeIndex = (theme: Theme) => themes.indexOf(theme);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className='relative flex h-9 items-center rounded-full border border-slate-400 bg-slate-100/30 p-1 backdrop-blur-xs dark:border-slate-600 dark:bg-slate-800/20'>
                        {themes.map((t) => (
                            <button
                                key={t}
                                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                                    activeTheme === t
                                        ? 'text-white'
                                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                                onClick={() => setTheme(t)}
                                aria-label={`Switch to ${t} theme`}>
                                <motion.div
                                    className='flex items-center justify-center'
                                    whileHover={{ scale: 1.15 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                                    {t === 'light' && <Sun className='h-4 w-4' />}
                                    {t === 'dark' && <Moon className='h-4 w-4' />}
                                    {t === 'system' && <Monitor className='h-4 w-4' />}
                                </motion.div>
                            </button>
                        ))}
                        <motion.div
                            className='bg-primary absolute h-7 w-7 rounded-full shadow-sm'
                            initial={false}
                            animate={{
                                x: getThemeIndex(activeTheme) * 28 // 28px per button + 4px offset
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 300,
                                damping: 25
                            }}
                        />
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Switch Theme</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
