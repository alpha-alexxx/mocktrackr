import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import DashboardHeader from '@/components/app-ui/dashboard-header';
import { AppSidebar } from '@/components/app-ui/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '@/lib/authentication/auth';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
        redirect('/login');
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <DashboardHeader />
                <main className='flex flex-1 flex-grow p-4 pt-0'>{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
