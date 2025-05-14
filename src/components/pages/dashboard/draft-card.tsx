import React from 'react';

import { useRouter } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormStore } from '@/stores/form-store';

import { format } from 'date-fns';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface DraftCardProps {
    draft: {
        id: string;
        testName?: string;
        savedAt: Date;
        examCode?: string;
        examTier?: string;
        isSavedOnline: boolean;
    };
}

export const DraftCard: React.FC<DraftCardProps> = ({ draft }) => {
    const { id, isSavedOnline, savedAt, examCode, examTier } = draft;
    const router = useRouter();
    const savedDate = format(savedAt, 'MMMM do, hh:mm a');

    const { deleteDraft, getDraftById } = useFormStore();

    const onLoad = async (id: string) => {
        await getDraftById(id);
        router.push('/dashboard/create');
    };
    const onDelete = async (id: string) => {
        const { message, type } = await deleteDraft(id);

        if (type === 'success') {
            toast.success(message);
            // 🛠 trigger update in Dashboard
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('drafts-updated'));
            }
        } else {
            toast.error(message);
        }
    };
    const examName = () => {
        switch (examCode) {
            case 'ssc_cgl':
                return 'SSC CGL';
            case 'ssc_chsl':
                return 'SSC CHSL';
            case 'ssc_cpo':
                return 'SSC CPO';
            case 'ssc_mts':
                return 'SSC MTS';
            case 'ssc_steno':
                return 'SSC Stenographer';
            default:
                break;
        }
    };

    return (
        <Card className='m-0 w-full max-w-md gap-0 rounded-2xl border-2 p-2 shadow-xs select-none hover:shadow-sm'>
            <CardHeader className='gap-0 p-0'>
                <CardTitle className='flex items-start justify-between gap-0 p-0'>
                    <div className='flex flex-col'>
                        <span>{examName()}</span>
                        <span className='text-xs font-normal'>
                            {examTier && (
                                <p>
                                    <span className='font-normal'>Tier</span> {examTier.split('_')[1]}
                                </p>
                            )}
                        </span>
                    </div>
                    <div className='text-sm text-gray-600'>
                        {isSavedOnline ? (
                            <Badge variant='default' className='bg-emerald-500'>
                                Synced
                            </Badge>
                        ) : (
                            <Badge variant='secondary'>Draft</Badge>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardFooter className='flex flex-row items-center justify-between p-0'>
                <p className='text-xs font-medium'>{savedDate}</p>
                <div className='flex justify-end gap-2'>
                    <Button className='size-8' size='icon' onClick={() => onLoad(id)}>
                        <Edit />
                    </Button>
                    <Button className='size-8' size='icon' variant='destructive' onClick={() => onDelete(id)}>
                        <Trash2 />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
