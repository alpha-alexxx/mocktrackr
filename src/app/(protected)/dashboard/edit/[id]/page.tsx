import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import EditPageUI from '@/components/pages/dashboard/edit/edit-page-ui';
import { auth } from '@/lib/authentication/auth';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
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

    return <EditPageUI recordId={id} userId={session.user.id} />;
}
