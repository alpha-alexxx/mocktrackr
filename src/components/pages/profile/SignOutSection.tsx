import React from 'react';

import { Button, Card } from '@/src/components/ui';

export default function SignOutSection({ onSignOut }: { onSignOut?: () => void }) {
    return (
        <section className='mb-8'>
            <Card className='flex items-center justify-between rounded-xl border border-gray-800 bg-white/5 p-5 shadow'>
                <div className='flex items-center gap-2'>
                    <svg
                        width='20'
                        height='20'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                        className='inline-block text-rose-500'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1'
                        />
                    </svg>
                    <span className='text-lg font-bold text-white'>Sign Out</span>
                </div>
                <Button
                    className='rounded-lg bg-rose-500 px-5 py-2 font-semibold text-white shadow transition hover:bg-rose-600'
                    onClick={onSignOut}>
                    Sign Out
                </Button>
            </Card>
        </section>
    );
}
