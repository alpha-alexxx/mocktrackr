import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { useSession } from '@/hooks/use-auth-query';
import { useInvalidateQueries } from '@/hooks/use-invalidate';
import axiosClient from '@/lib/axios-client';
import useDatePicker from '@/stores/date_picker';

import axios from 'axios';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DeleteRecordDialog({ children, recordId }: { recordId: string; children: React.ReactNode }) {
    const [loading, setIsLoading] = useState<boolean>(false);
    const { data: session } = useSession();
    const { date } = useDatePicker();
    const router = useRouter();
    const { invalidateRecords } = useInvalidateQueries();
    const handleDelete = async () => {
        setIsLoading(true);
        toast.loading('Deleting record...', {
            id: 'delete-record-toast',
            description: 'Please wait while we permanently remove the record from our system.'
        });
        try {
            await axiosClient.delete(`/api/record?recordId=${recordId}`);
            toast.success('Record deleted successfully!', {
                id: 'delete-record-toast',
                description: 'The record has been permanently removed.'
            });
            invalidateRecords(session.user.id, date);
            router.refresh();
        } catch (error) {
            console.error('Error deleting record:', error);

            if (axios.isAxiosError(error)) {
                toast.error('Failed to delete record', {
                    id: 'delete-record-toast',
                    description: error.message || 'An unexpected error occurred. Please try again.'
                });
            } else {
                toast.error('Failed to delete record', {
                    id: 'delete-record-toast',
                    description: 'An unexpected error occurred. Please try again.'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className='max-w-sm rounded-2xl border border-gray-200 bg-white shadow-xl transition-all dark:border-gray-700 dark:bg-gray-900'>
                <AlertDialogHeader className='flex flex-col items-center space-y-4 text-center'>
                    <div className='flex items-center justify-center rounded-full bg-red-100 p-4 dark:bg-red-900'>
                        <AlertTriangle className='size-8 text-red-600 dark:text-red-400' />
                    </div>
                    <AlertDialogTitle className='text-lg font-semibold'>
                        Permanently delete this record?
                    </AlertDialogTitle>
                    <AlertDialogDescription className='text-sm text-gray-500 dark:text-gray-400'>
                        This action is irreversible. Deleting this record will permanently erase all associated data
                        from our system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='mt-6 flex justify-end space-x-2'>
                    <AlertDialogCancel className='rounded-lg border bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className='rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700'>
                        {loading ? (
                            <div className='flex flex-row items-center gap-2'>
                                <Loader2 className='size-4 animate-spin' /> Deleting...
                            </div>
                        ) : (
                            <>Delete</>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
