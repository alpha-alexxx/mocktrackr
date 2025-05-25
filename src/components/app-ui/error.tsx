import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { Button } from '../ui/button';
import Logo from './logo';
import { AlertTriangle } from 'lucide-react';

interface ErrorTypes {
    cause?: unknown;
    name: string;
    message: string;
    stack?: string;
}
export default function ErrorComponent({ error }: { error: ErrorTypes | null }) {
    const router = useRouter();
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className='bg-background flex min-h-screen flex-col items-center justify-center p-4'>
            <div className='flex max-w-md flex-col items-center space-y-6 text-center'>
                <div className='flex items-center space-x-2'>
                    <Logo className='size-10' />
                    <h1 className='text-2xl font-bold tracking-tight'>MockTrackr</h1>
                </div>

                <div className='rounded-full bg-red-100 p-3 dark:bg-red-900/20'>
                    <AlertTriangle className='h-6 w-6 text-red-600 dark:text-red-400' />
                </div>

                <div className='space-y-2'>
                    <h2 className='text-xl font-semibold'>Something went wrong!</h2>
                    <p className='text-muted-foreground'>
                        We apologize for the inconvenience. An unexpected error has occurred.
                    </p>
                    {error && error.message && (
                        <p className='text-muted-foreground mt-2 text-xs'>Error ID: {error.name}</p>
                    )}
                </div>

                <div className='flex flex-col gap-2 sm:flex-row'>
                    <Button variant='outline' onClick={() => router.refresh()}>
                        Refresh page
                    </Button>
                    <Button onClick={() => router.push('/dashboard')}>Go to dashboard</Button>
                </div>
            </div>
        </div>
    );
}
