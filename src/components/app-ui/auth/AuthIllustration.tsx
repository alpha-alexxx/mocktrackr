'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { motion } from 'framer-motion';

interface AuthIllustrationProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    animate?: boolean;
}

export function AuthIllustration({ src, alt, width = 400, height = 400, animate = true }: AuthIllustrationProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Reset loaded state when src changes
        setIsLoaded(false);
    }, [src]);

    // Animation variants for SVG illustrations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: 'beforeChildren',
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 10
            }
        }
    };

    // Hover animation
    const hoverAnimation = animate
        ? {
              scale: 1.03,
              transition: { duration: 0.3 }
          }
        : {};

    return (
        <motion.div
            initial='hidden'
            animate={isLoaded ? 'visible' : 'hidden'}
            variants={containerVariants}
            whileHover={hoverAnimation}
            className='relative mx-auto w-full max-w-md'>
            <motion.div variants={itemVariants}>
                <Image
                    src={src || '/placeholder.svg'}
                    alt={alt}
                    width={width}
                    height={height}
                    className='mx-auto h-[450px] w-fit rounded-xl object-cover'
                    priority
                    onLoad={() => setIsLoaded(true)}
                />
            </motion.div>
        </motion.div>
    );
}
