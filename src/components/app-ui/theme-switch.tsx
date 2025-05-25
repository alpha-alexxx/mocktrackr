'use client';

import * as React from 'react';

import { useTheme } from 'next-themes';

import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

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
        <div className='relative flex h-9 items-center rounded-full border border-slate-400 bg-slate-100/30 p-1 backdrop-blur-xs dark:border-slate-600 dark:bg-slate-800/20'>
            {themes.map((t) => (
                <button
                    key={t}
                    className={`relative z-10 flex h-7 w-20 items-center justify-center gap-2 rounded-full transition-colors ${activeTheme === t ? 'text-white' : 'dark:text-foreground text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'}`}
                    onClick={() => setTheme(t)}
                    aria-label={`Switch to ${t} theme`}>
                    <motion.div
                        className='flex items-center justify-center gap-2 text-xs'
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
                        {t === 'light' && (
                            <>
                                <Sun className='h-4 w-4' /> Light
                            </>
                        )}
                        {t === 'dark' && (
                            <>
                                <Moon className='h-4 w-4' /> Dark
                            </>
                        )}
                        {t === 'system' && (
                            <>
                                <Monitor className='h-4 w-4' /> System
                            </>
                        )}
                    </motion.div>
                </button>
            ))}
            <motion.div
                className='bg-primary absolute h-7 w-20 rounded-full shadow-sm'
                initial={false}
                animate={{
                    x: getThemeIndex(activeTheme) * 80
                }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25
                }}
            />
        </div>
    );
}
