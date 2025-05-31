'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';

type TableCellData = {
    type: 'input' | 'select' | 'textarea';
    value: string;
};

type Row = {
    id: string;
    cells: TableCellData[];
};

type TableViewerProps = {
    data: {
        headers: string[];
        rows: Row[];
    };
};

const getAttemptTypeIcon = (value: string) => {
    const baseClass = 'inline-flex items-center space-x-1 text-sm font-medium';
    switch (value) {
        case 'correct':
            return (
                <span className={cn(baseClass, 'text-green-600 dark:text-green-400')}>
                    <CheckCircle className='h-4 w-4' />
                    <span>Correct</span>
                </span>
            );
        case 'wrong':
            return (
                <span className={cn(baseClass, 'text-red-600 dark:text-red-400')}>
                    <XCircle className='h-4 w-4' />
                    <span>Wrong</span>
                </span>
            );
        default:
            return <span className='text-gray-600 dark:text-gray-300'>{value}</span>;
    }
};

export default function TableViewer({ data }: TableViewerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className='w-full overflow-x-auto'>
            <Table className='rounded-md border-2 border-gray-200 shadow-xs dark:border-gray-700'>
                <TableHeader className='rounded-t-md border-2'>
                    <TableRow>
                        {data.headers.map((header, idx) => (
                            <TableHead
                                key={idx}
                                className={cn(
                                    'border-r-2 border-l-2 text-center text-sm text-gray-700 capitalize dark:text-gray-300',
                                    (idx === 0 || idx === 1) && 'w-fit',
                                    idx === 2 && 'w-full',
                                    idx === 1 && 'bg-slate-50 dark:bg-slate-700'
                                )}>
                                {header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.rows.map((row) => (
                        <TableRow key={row.id}>
                            {row.cells.map((cell, idx) => (
                                <TableCell
                                    key={idx}
                                    className={cn(
                                        'border-r-2 border-l-2 text-center text-sm text-gray-700 capitalize dark:text-gray-300',
                                        (idx === 0 || idx === 1) && 'w-fit',
                                        idx === 2 && 'w-full',
                                        idx === 1 && 'bg-slate-50 dark:bg-slate-700'
                                    )}>
                                    {cell.type === 'select' ? (
                                        getAttemptTypeIcon(cell.value)
                                    ) : cell.type === 'textarea' ? (
                                        <Textarea
                                            value={cell.value}
                                            readOnly
                                            maxLength={100}
                                            className='bg-background h-min w-full resize-none rounded border-0 p-2 text-sm text-gray-800 shadow-none select-none selection:bg-transparent selection:text-inherit focus-visible:border-0 focus-visible:ring-0 dark:text-gray-200'
                                        />
                                    ) : (
                                        <span className='text-center text-sm text-gray-800 dark:text-gray-200'>
                                            {cell.value}
                                        </span>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </motion.div>
    );
}
