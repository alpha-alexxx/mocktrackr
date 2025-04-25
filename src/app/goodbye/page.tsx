'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import { Hand } from 'lucide-react';

/**
 * GoodbyePage Component
 *
 * A farewell page displayed after a user deletes their account.
 * Features a clean, minimalist design with a warm message and a link to the homepage.
 *
 * @component
 * @returns {JSX.Element} The rendered goodbye page
 */
export default function GoodbyePage() {
    return (
        <div className='from-background to-muted flex min-h-screen items-center justify-center bg-gradient-to-b p-4'>
            <Card className='w-full max-w-md border-none shadow-lg'>
                <CardHeader className='space-y-2 text-center'>
                    <div className='bg-primary/10 mx-auto w-fit rounded-full p-3'>
                        <Hand className='text-primary h-8 w-8' />
                    </div>
                    <CardTitle className='text-2xl font-bold'>Farewell, Friend!</CardTitle>
                    <CardDescription className='text-base'>Thank you for being part of our journey</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4 text-center'>
                    <p className='text-muted-foreground'>
                        We're sad to see you go, but we respect your decision. We hope our paths cross again in the
                        future.
                    </p>
                    <p className='text-muted-foreground text-sm'>
                        Your account and all associated data have been successfully deleted.
                    </p>
                </CardContent>
                <CardFooter className='flex justify-center'>
                    <Link href='/'>
                        <Button variant='outline' size='lg'>
                            Return to Homepage
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
