'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/authentication/auth-client';

import { ThemeToggle } from '../theme-switch';
import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';

export function NavUser({
    user
}: {
    user: {
        name: string;
        email: string;
        image?: string;
    };
}) {
    const { isMobile } = useSidebar();
    const router = useRouter();

    if (!user) {
        return (
            <div className='flex h-full w-full flex-row items-center justify-center'>
                <Skeleton className='size-12' />
                <div className='flex flex-row items-center justify-center'>
                    <Skeleton className='h-8 w-full' />
                    <Skeleton className='h-4 w-full' />
                </div>
            </div>
        );
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size='lg'
                            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'>
                            <Avatar className='h-8 w-8 rounded-lg'>
                                {user && user.image && (
                                    <AvatarImage src={user?.image || './images/logo_main.png'} alt={user.name} />
                                )}

                                <AvatarFallback className='rounded-lg'>
                                    {user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className='grid flex-1 text-left text-sm leading-tight'>
                                <span className='truncate font-semibold'>{user.name}</span>
                                <span className='truncate text-xs'>{user.email}</span>
                            </div>
                            <ChevronsUpDown className='ml-auto size-4' />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                        side={isMobile ? 'bottom' : 'right'}
                        align='end'
                        sideOffset={4}>
                        <DropdownMenuLabel className='p-0 font-normal'>
                            <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                                <Avatar className='h-8 w-8 rounded-lg'>
                                    <AvatarImage src={user.image} alt={user.name} />
                                    <AvatarFallback className='rounded-lg'>
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className='grid flex-1 text-left text-sm leading-tight'>
                                    <span className='truncate font-semibold'>{user.name}</span>
                                    <span className='truncate text-xs'>{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href='/profile'>
                                    <BadgeCheck />
                                    Profile
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <span className='text-xs font-semibold'>Choose Theme:</span>
                            <DropdownMenuItem asChild>
                                <ThemeToggle />
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className='border border-rose-500 bg-rose-50/50 text-rose-500 focus:bg-rose-50 focus:text-rose-600 dark:bg-rose-600/20'
                            onClick={async () => {
                                await authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            router.push('/login');
                                        }
                                    }
                                });
                            }}>
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
