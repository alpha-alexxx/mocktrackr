'use client';

import Google from '@/assets/icon/google';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { motion } from 'framer-motion';

interface AuthSocialButtonsProps {
    onGoogleClick: () => void;
}

export function AuthSocialButtons({ onGoogleClick }: AuthSocialButtonsProps) {
    return (
        <div className='space-y-4'>
            <div className='flex items-center'>
                <Separator className='bg-foreground/20 flex-1' />
                <span className='text-muted-foreground border-foreground/20 mx-2 rounded-full border-[1.5] p-1 text-xs'>
                    OR
                </span>
                <Separator className='bg-foreground/20 flex-1' />
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                    type='button'
                    variant='outline'
                    className='dark:border-foreground/20 flex w-full items-center justify-center gap-2 dark:border-2'
                    onClick={onGoogleClick}>
                    <Google />
                    Continue with Google
                </Button>
            </motion.div>
        </div>
    );
}
