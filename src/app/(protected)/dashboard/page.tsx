'use client';

import { useRouter } from 'next/navigation';

import { authClient } from '@/lib/authentication/auth-client';

export default function DashboardPage() {
    const { data: session, error, isPending } = authClient.useSession();
    const router = useRouter();
    if (isPending) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    const handleClick = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: (ctx) => {
                    router.push('/login');
                }
            }
        });
    };

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Session: {JSON.stringify(session)}</p>
            <button onClick={handleClick}>Sign out</button>
        </div>
    );
}
