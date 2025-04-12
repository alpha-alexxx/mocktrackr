'use client';

import { useEffect, useRef } from 'react';

import { motion } from 'framer-motion';

interface AnimatedBlobProps {
    className?: string;
}

export default function AnimatedBlob({ className = '' }: AnimatedBlobProps) {
    const blobRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!blobRef.current) return;

        const interval = setInterval(() => {
            const path = blobRef.current?.querySelector('path');
            if (path) {
                // Generate random values for the blob
                const radius = 40 + Math.random() * 10;
                const randomness = 5 + Math.random() * 5;
                const points = 6;

                let d = 'M';

                for (let i = 0; i < points; i++) {
                    const angle = (i / points) * Math.PI * 2;
                    const x = 50 + Math.cos(angle) * (radius + (Math.random() - 0.5) * randomness);
                    const y = 50 + Math.sin(angle) * (radius + (Math.random() - 0.5) * randomness);

                    if (i === 0) {
                        d += `${x},${y}`;
                    } else {
                        d += ` L${x},${y}`;
                    }
                }

                d += ' Z';
                path.setAttribute('d', d);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.svg
            ref={blobRef}
            viewBox='0 0 100 100'
            className={className}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}>
            <defs>
                <linearGradient id='gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' stopColor='rgb(147, 51, 234)' stopOpacity='0.3' />
                    <stop offset='100%' stopColor='rgb(219, 39, 119)' stopOpacity='0.3' />
                </linearGradient>
            </defs>
            <path
                d='M50,90 C70,90 80,70 80,50 C80,30 70,10 50,10 C30,10 20,30 20,50 C20,70 30,90 50,90 Z'
                fill='url(#gradient)'
            />
        </motion.svg>
    );
}
