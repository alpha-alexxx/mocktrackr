'use client';

import Image from 'next/image';

import { siteConfig } from '@/lib/site/site-config';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
    return (
        <Image
            src={siteConfig.logo || './images/logo-main.png'}
            alt={siteConfig.name}
            width={50}
            height={50}
            className={cn('size-8 rounded-md', className)}
        />
    );
}
