'use client';

import * as React from 'react';

import { useRouter } from 'next/navigation';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail
} from '@/components/ui/sidebar';
import { useSession } from '@/hooks/use-auth-query';
import { siteConfig } from '@/lib/site/site-config';

import { NavPrimary } from './nav-primary';
import { NavUser } from './nav-user';
import { BarChartBig, BookOpen, ClipboardList, LayoutDashboard, Loader2 } from 'lucide-react';
import Logo from '../logo';

// This is sample data.
const data = {
    primary: [
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: LayoutDashboard
        },
        {
            name: 'Tests',
            url: '/tests',
            icon: ClipboardList
        },
        {
            name: 'Performance',
            url: '/performance',
            icon: BarChartBig
        }
    ]
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { data: session, isLoading, error } = useSession();
    const router = useRouter();

    React.useEffect(() => {
        if (!session && !isLoading) {
            router.push('/login');
        }
        if (error) {
            router.push(`/login?error=${error.message}`);
        }
    }, [session, isLoading, error, router]);

    return (
        <Sidebar collapsible='icon' {...props}>
            {isLoading ? (
                <div className='flex h-full w-full items-center justify-center'>
                    <Loader2 className='size-10 animate-spin' />
                </div>
            ) : (
                <>
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size='lg' asChild>
                                    <a href='#'>
                                        <div className='bg-sidebar-foreground flex aspect-square size-8 items-center justify-center rounded-lg text-white dark:text-black'>
                                            <Logo className='size-4' />
                                        </div>
                                        <div className='grid flex-1 text-left text-sm leading-tight'>
                                            <span className='truncate font-semibold'>{siteConfig.name}</span>
                                            <span className='truncate text-xs'>The Solution you need</span>
                                        </div>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>
                    <SidebarContent>
                        <NavPrimary projects={data.primary} />
                    </SidebarContent>
                    <SidebarFooter>
                        <NavUser user={session?.user} />
                    </SidebarFooter>
                    <SidebarRail />
                </>
            )}
        </Sidebar>
    );
}
