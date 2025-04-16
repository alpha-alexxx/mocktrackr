'use client';

import Link from 'next/link';

import { motion } from 'framer-motion';

interface AuthFooterLinksProps {
    links: {
        label: string;
        href: string;
    }[];
    className?: string;
}

export function AuthFooterLinks({ links, className }: AuthFooterLinksProps) {
    return (
        <div className={`text-center text-sm ${className}`}>
            <div className='flex flex-wrap justify-center gap-x-2 gap-y-1'>
                {links.map((link, index) => (
                    <motion.div key={link.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        {index > 0 && <span className='text-foreground/40'>•</span>}
                        <Link href={link.href} className='text-foreground ml-1 underline-offset-4 hover:underline'>
                            {link.label}
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
