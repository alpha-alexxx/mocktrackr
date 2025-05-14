import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/authentication/auth';

export default async function EditPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect('/login');
    }

    redirect('/dashboard');
}
