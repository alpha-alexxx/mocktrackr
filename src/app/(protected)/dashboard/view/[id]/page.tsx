import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { ViewDashboard } from '@/components/pages/dashboard/view/view-dashboard';
import { auth } from '@/lib/authentication/auth';

export default async function ViewRecordPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!id) {
        redirect('/dashboard?error=RecordIdNotFound');
    }

    if (!session) {
        redirect('/login');
    }

    return <ViewDashboard recordId={id} user={session.user} />;
}
