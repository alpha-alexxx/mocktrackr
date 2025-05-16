'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';

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
                    <CheckCircle className="w-4 h-4" />
                    <span>Correct</span>
                </span>
            );
        case 'wrong':
            return (
                <span className={cn(baseClass, 'text-red-600 dark:text-red-400')}>
                    <XCircle className="w-4 h-4" />
                    <span>Wrong</span>
                </span>
            );
        default:
            return (
                <span className="text-gray-600 dark:text-gray-300">{value}</span>
            );
    }
};

export default function TableViewer({ data }: TableViewerProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full overflow-x-auto"
        >
            <Table className="border-2 border-gray-200 dark:border-gray-700 rounded-md shadow-xs">
                <TableHeader className='border-2 rounded-t-md'>
                    <TableRow>
                        {data.headers.map((header, idx) => (
                            <TableHead
                                key={idx}
                                className={cn(
                                    'capitalize border-r-2 border-l-2  text-sm text-gray-700 dark:text-gray-300 text-center',
                                    (idx === 0 || idx === 1) && 'w-fit',
                                    idx === 2 && 'w-full',
                                    idx === 1 && "bg-slate-50 dark:bg-slate-700"
                                )}
                            >
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
                                        'capitalize text-center border-r-2 border-l-2 text-sm text-gray-700 dark:text-gray-300',
                                        (idx === 0 || idx === 1) && 'w-fit',
                                        idx === 2 && 'w-full',
                                        idx === 1 && "bg-slate-50 dark:bg-slate-700"

                                    )}
                                >
                                    {cell.type === 'select' ? (
                                        getAttemptTypeIcon(cell.value)
                                    ) : cell.type === 'textarea' ? (
                                        <Textarea
                                            value={cell.value}
                                            readOnly
                                            maxLength={100}
                                            className="w-full h-min resize-none rounded  border-0 text-sm text-gray-800 dark:text-gray-200 bg-background shadow-none p-2 focus-visible:ring-0 focus-visible:border-0 select-none selection:bg-transparent  selection:text-inherit"
                                        />
                                    ) : (
                                        <span className="text-sm text-gray-800 dark:text-gray-200 text-center">
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
