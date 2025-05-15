'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { type LucideIcon } from 'lucide-react';

export function NavPrimary({
    projects
}: {
    projects: {
        name: string;
        url: string;
        icon: LucideIcon;
    }[];
}) {
    const pathname = usePathname();

    return (
        <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
            <SidebarGroupLabel>Primary</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                            asChild
                            className={cn(
                                'h-8 hover:bg-blue-100 hover:dark:bg-blue-700/30',
                                pathname === item.url && 'bg-sidebar-primary pointer-events-none text-white'
                            )}>
                            <Link href={item.url}>
                                <item.icon className='size-5' />
                                <span>{item.name}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
