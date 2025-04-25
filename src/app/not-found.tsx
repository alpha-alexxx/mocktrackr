import Link from 'next/link';

import { Button } from '@/components/ui/button';

import { Book, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className='bg-background flex min-h-screen flex-col items-center justify-center p-4'>
            <div className='flex max-w-md flex-col items-center space-y-6 text-center'>
                <div className='flex items-center space-x-2'>
                    <Book className='text-primary h-10 w-10' />
                    <h1 className='text-2xl font-bold tracking-tight'>MockTrackr</h1>
                </div>

                <div className='flex flex-col items-center space-y-2'>
                    <div className='text-primary text-7xl font-bold'>404</div>
                    <Search className='text-muted-foreground h-12 w-12' />
                </div>

                <div className='space-y-2'>
                    <h2 className='text-xl font-semibold'>Page not found</h2>
                    <p className='text-muted-foreground'>
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className='flex flex-col gap-2 sm:flex-row'>
                    <Button asChild>
                        <Link href='/dashboard'>Return to Dashboard</Link>
                    </Button>
                    <Button variant='outline' asChild>
                        <Link href='/search'>Search content</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
