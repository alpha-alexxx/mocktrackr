import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingList() {
    return (
        <div className='container mx-auto py-6'>
            <Skeleton className='mb-6 h-10 w-64' />
            <div className='bg-card mx-auto w-full max-w-4xl rounded-lg border p-6 sm:p-8'>
                <div className='space-y-6'>
                    <div>
                        <Skeleton className='mb-4 h-8 w-48' />
                        <div className='space-y-4'>
                            <Skeleton className='h-10 w-full' />
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <Skeleton className='h-10 w-full' />
                                <Skeleton className='h-10 w-full' />
                            </div>
                            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                <Skeleton className='h-10 w-full' />
                                <Skeleton className='h-10 w-full' />
                            </div>
                        </div>
                    </div>

                    <Skeleton className='h-px w-full' />

                    <div>
                        <Skeleton className='mb-4 h-8 w-56' />
                        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton key={i} className='h-10 w-full' />
                            ))}
                        </div>
                    </div>

                    <Skeleton className='h-px w-full' />

                    <div>
                        <Skeleton className='mb-4 h-8 w-32' />
                        <Skeleton className='mb-4 h-32 w-full' />
                        <Skeleton className='h-32 w-full' />
                    </div>

                    <Skeleton className='h-px w-full' />

                    <div className='flex justify-end gap-3'>
                        <Skeleton className='h-10 w-24' />
                        <Skeleton className='h-10 w-32' />
                        <Skeleton className='h-10 w-32' />
                    </div>
                </div>
            </div>
        </div>
    );
}
