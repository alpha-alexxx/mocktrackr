import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import Dashboard from '@/components/pages/dashboard/dashboard-ui';
import { auth } from '@/lib/authentication/auth';

export default async function Page() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect('/login');
    }

    return <Dashboard user={session.user} />;
}
