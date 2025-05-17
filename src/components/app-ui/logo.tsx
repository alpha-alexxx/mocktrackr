'use client'
import { siteConfig } from '@/lib/site/site-config'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export default function Logo({ className }: { className?: string }) {
    return (
        <Image src={siteConfig.logo || './images/logo-main.png'} alt={siteConfig.name} width={50} height={50} className={cn('rounded-md size-8', className)} />
    )
}
