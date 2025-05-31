import Link from 'next/link';

import DownloadPdfIcon from '@/assets/icon/download-pdf';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn, formatTime } from '@/lib/utils';
import { RecordItem } from '@/services/records/record.fetch';

import DeleteRecordDialog from './delete-record.dialog';
import PDFDialog from './pdf/pdf-dialog';
import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';
import {
    Award,
    Calendar,
    CheckCircle,
    Clock,
    ExternalLink,
    Eye,
    FileText,
    Laptop,
    MoreVertical,
    Pencil,
    Trash2,
    TrendingUpDown,
    Trophy,
    XCircle
} from 'lucide-react';

export const ListCard = ({ record }: { record: RecordItem }) => {
    const accuracyPercentage = (record.totalCorrectQuestions / record.totalQuestions) * 100;

    return (
        <Card className='gap-4 border-2 p-3 shadow-xs transition-shadow select-none hover:shadow-sm dark:border-gray-700'>
            {/* Header Section */}
            <CardHeader className='flex w-full flex-col items-center p-0 sm:flex-row sm:justify-between'>
                <div className='flex flex-row items-center justify-center gap-2'>
                    <h3 className='flex items-center text-lg font-bold text-gray-900 dark:text-gray-100'>
                        {record.testName}
                    </h3>
                    {record.examTier && (
                        <Badge variant={'secondary'} className='text-xs'>
                            Tier {record.examTier.split('_')[1]}
                        </Badge>
                    )}
                </div>
                <div className='mt-2 flex gap-2 sm:mt-0'>
                    {record.testLink && (
                        <Button
                            title='Go to mock test through link'
                            variant='outline'
                            size='sm'
                            className='h-9 w-9 p-0'
                            asChild>
                            <Link href={record.testLink} target='_blank' rel='noopener' referrerPolicy='no-referrer'>
                                <ExternalLink className='h-4 w-4 text-slate-500' />
                            </Link>
                        </Button>
                    )}
                    <Button title='View Report' variant='outline' size='sm' className='p-0' asChild>
                        <Link href={`/dashboard/view/${record.id}`}>
                            <Eye className='size-4 text-emerald-500' /> View Report
                        </Link>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'ghost'} size={'sm'}>
                                <MoreVertical className='size-4 text-gray-500' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='mr-4 flex flex-col'>
                            <DropdownMenuItem asChild>
                                <PDFDialog record={record}>
                                    <span
                                        title='Download PDF Report'
                                        className={cn(
                                            'flex flex-row items-center gap-2 text-sm',
                                            buttonVariants({ variant: 'ghost', size: 'sm' })
                                        )}>
                                        <DownloadPdfIcon className='h-4 w-4 text-red-500' /> Export as PDF
                                    </span>
                                </PDFDialog>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link
                                    href={`/dashboard/edit/${record.id}?from=/dashboard`}
                                    title='Edit the record'
                                    className={cn(
                                        'flex flex-row items-center gap-2 text-sm',
                                        buttonVariants({ variant: 'ghost', size: 'sm' })
                                    )}>
                                    <Pencil className='size-4' /> Edit Record
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <DeleteRecordDialog recordId={record.id}>
                                    <span
                                        title='Delete Record'
                                        className={cn(
                                            'flex flex-row items-center gap-2 border border-rose-500 bg-rose-500/20 text-sm',
                                            buttonVariants({ variant: 'ghost', size: 'sm' })
                                        )}>
                                        <Trash2 className='size-4' /> Delete Record
                                    </span>
                                </DeleteRecordDialog>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>

            {/* Info Grid */}
            <CardContent className='p-0'>
                <div className='grid w-full grid-cols-2 gap-4 md:grid-cols-5'>
                    <InfoItem
                        icon={<FileText className='size-4 text-blue-600' />}
                        label='Exam'
                        value={
                            record.examCode === 'ssc_cgl'
                                ? 'SSC CGL'
                                : record.examCode === 'ssc_chsl'
                                    ? 'SSC CHSL'
                                    : record.examCode === 'ssc_cpo'
                                        ? 'SSC CPO'
                                        : 'SSC MTS'
                        }
                    />
                    <InfoItem
                        icon={<Calendar className='size-4 text-cyan-500' />}
                        label='Attempt Date'
                        value={format(record.testDate, 'PPP', { locale: enIN })}
                    />
                    <InfoItem
                        icon={<Laptop className='size-4 text-violet-500' />}
                        label='Platform'
                        value={record.testPlatform}
                    />
                    {record.rank && (
                        <InfoItem
                            icon={<Trophy className='size-4 text-amber-500' />}
                            label='Rank'
                            value={record.rank.toString()}
                        />
                    )}
                    {record.percentile && (
                        <InfoItem
                            icon={<Award className='size-4 text-green-600' />}
                            label='Percentile'
                            value={record.percentile.toString()}
                        />
                    )}
                    {record.totalCorrectQuestions && (
                        <InfoItem
                            icon={<CheckCircle className='size-4 text-green-500' />}
                            label='Correct Questions'
                            value={record.totalCorrectQuestions.toString()}
                        />
                    )}
                    {record.totalWrongQuestions && (
                        <InfoItem
                            icon={<XCircle className='size-4 text-red-500' />}
                            label='Wrong Questions'
                            value={record.totalWrongQuestions.toString()}
                        />
                    )}
                    {record.totalTimeTaken && (
                        <InfoItem
                            icon={<Clock className='size-4 text-gray-500' />}
                            label='Total Time'
                            value={formatTime(record.totalTimeTaken)}
                        />
                    )}
                    {record.obtainedMarks && (
                        <InfoItem
                            icon={<Trophy className='size-4 text-green-600' />}
                            label='Total Marks'
                            value={record.obtainedMarks.toString()}
                        />
                    )}
                    {accuracyPercentage && (
                        <InfoItem
                            icon={<TrendingUpDown className='size-4 text-green-600' />}
                            label='Accuracy'
                            value={`${accuracyPercentage.toFixed(2)}%`}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className='flex flex-col items-start justify-center'>
        <div className='mb-1 flex items-center justify-start gap-2 text-xs text-slate-600 dark:text-slate-400'>
            <div className='mb-auto'>{icon}</div>
            <div className='flex flex-col'>
                {label}
                <p className='text-foreground text-sm font-medium'>{value}</p>
            </div>
        </div>
    </div>
);

export default ListCard;
