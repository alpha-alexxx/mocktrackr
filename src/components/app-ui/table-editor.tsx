 

// components/TableEditor.tsx
'use client';

import { type KeyboardEvent, type MouseEvent, useEffect, useMemo, useReducer, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { Textarea } from '../ui/textarea';
import { Plus, Redo2, Trash2, Undo2 } from 'lucide-react';

/* eslint-disable @typescript-eslint/no-explicit-any */

// components/TableEditor.tsx

/* eslint-disable no-unused-vars */

export type CellType = 'input' | 'textarea' | 'select';

export type TableData = {
    headers: string[];
    rows: {
        id: string;
        cells: { type: CellType; value: string }[];
    }[];
};

const selectOptions = [
    { label: 'Correct', value: 'correct' },
    { label: 'Wrong', value: 'wrong' },
    { label: 'Not Attempted', value: 'not attempted' }
];

type Action =
    | { type: 'ADD_ROW' }
    | { type: 'ADD_COLUMN' }
    | { type: 'DELETE_ROW'; payload: number }
    | { type: 'DELETE_COLUMN'; payload: number }
    | { type: 'UPDATE_HEADER'; payload: { index: number; value: string } }
    | {
          type: 'UPDATE_CELL';
          payload: { rowIndex: number; cellIndex: number; value: string };
      }
    | { type: 'UNDO' }
    | { type: 'REDO' };

type State = {
    current: TableData;
    history: TableData[];
    future: TableData[];
};

// --- Helpers ---
function generateId() {
    return Math.random().toString(36).slice(2, 9);
}

function tableReducer(state: State, action: Action): State {
    const { current, history, future } = state;
    switch (action.type) {
        case 'ADD_ROW': {
            const firstRow = current.rows[0];
            const newRow = {
                id: generateId(),
                cells: firstRow
                    ? firstRow.cells.map((cell) => ({ type: cell.type, value: '' }))
                    : current.headers.map(() => ({ type: 'input', value: '' }))
            };

            return {
                current: {
                    ...current,
                    rows: [
                        ...current.rows,
                        { ...newRow, cells: newRow.cells.map((cell) => ({ ...cell, type: cell.type as CellType })) }
                    ]
                },
                history: [...history, current],
                future: []
            };
        }

        case 'ADD_COLUMN': {
            const idx = current.headers.length + 1;

            return {
                current: {
                    headers: [...current.headers, `Column ${idx}`],
                    rows: current.rows.map((r) => ({
                        ...r,
                        cells: [...r.cells, { type: 'input' as CellType, value: '' }]
                    }))
                },
                history: [...history, current],
                future: []
            };
        }
        case 'DELETE_ROW':
            return {
                current: { ...current, rows: current.rows.filter((_, i) => i !== action.payload) },
                history: [...history, current],
                future: []
            };
        case 'DELETE_COLUMN':
            return {
                current: {
                    headers: current.headers.filter((_, i) => i !== action.payload),
                    rows: current.rows.map((r) => ({
                        ...r,
                        cells: r.cells.filter((_, i) => i !== action.payload)
                    }))
                },
                history: [...history, current],
                future: []
            };
        case 'UPDATE_HEADER':
            return {
                current: {
                    ...current,
                    headers: current.headers.map((h, i) => (i === action.payload.index ? action.payload.value : h))
                },
                history: [...history, current],
                future: []
            };
        case 'UPDATE_CELL':
            return {
                current: {
                    ...current,
                    rows: current.rows.map((r, ri) =>
                        ri !== action.payload.rowIndex
                            ? r
                            : {
                                  ...r,
                                  cells: r.cells.map((c, ci) =>
                                      ci !== action.payload.cellIndex ? c : { ...c, value: action.payload.value }
                                  )
                              }
                    )
                },
                history: [...history, current],
                future: []
            };
        case 'UNDO':
            if (!history.length) return state;

            return {
                current: history[history.length - 1],
                history: history.slice(0, -1),
                future: [current, ...future]
            };
        case 'REDO':
            if (!future.length) return state;

            return {
                current: future[0],
                history: [...history, current],
                future: future.slice(1)
            };
        default:
            return state;
    }
}

// --- Props ---
export interface TableEditorProps {
    value: TableData;
    onChange: (updated: TableData) => void;
    title?: string;
}

// --- Component ---
export function TableEditor({ value, onChange, title = 'Table Editor' }: TableEditorProps) {
    const memoizedValue = useRef(value);

    const defaultTableData = useMemo<TableData>(
        () => ({
            headers: ['Topic', 'Attempt Type', 'Reason'],
            rows: [
                {
                    id: generateId(),
                    cells: [
                        { type: 'input', value: '' },
                        { type: 'select', value: '' },
                        { type: 'textarea', value: '' }
                    ]
                }
            ]
        }),
        []
    );

    // Initialize state with the provided value or a default table structure
    const [state, dispatch] = useReducer(tableReducer, memoizedValue.current, (initialValue) => ({
        current: value || defaultTableData,
        history: [],
        future: []
    }));

    // Update the parent component when the table data changes
    useEffect(() => {
        onChange?.(state.current);
    }, [state.current, onChange]);

    // Only update the memoized value if the content has actually changed
    useEffect(() => {
        const currentHeaders = JSON.stringify(memoizedValue.current.headers);
        const newHeaders = JSON.stringify(value.headers);
        const currentRows = JSON.stringify(memoizedValue.current.rows);
        const newRows = JSON.stringify(value.rows);

        if (currentHeaders !== newHeaders || currentRows !== newRows) {
            memoizedValue.current = value;
        }
    }, [value]);

    // Whenever state.current changes, emit to parent
    // Use a ref to track if the change was from internal state updates
    const isInternalUpdate = useRef(false);

    useEffect(() => {
        if (!isInternalUpdate.current) {
            onChange(state.current);
        }
        isInternalUpdate.current = false;
    }, [state.current]);

    // Refs for navigation
    const headerRefs = useRef<(HTMLInputElement | null)[]>([]);
    const cellRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[][]>([]);

    useEffect(() => {
        headerRefs.current = Array(state.current.headers.length).fill(null);
        cellRefs.current = state.current.rows.map(() => Array(state.current.headers.length).fill(null));
    }, [state.current.headers, state.current.rows]);

    // Keyboard nav stub
    // Handle keyboard navigation within the table
    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        rowIndex?: number,
        cellIndex?: number,
        isHeader = false
    ) => {
        // Prevent form submission on Enter key press
        if (e.key === 'Enter') {
            e.preventDefault();

            return;
        }

        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
            e.preventDefault();

            // Only handle navigation if rowIndex and cellIndex are provided
            if (rowIndex === undefined || cellIndex === undefined) return;

            switch (e.key) {
                case 'ArrowUp':
                    if (isHeader) return;
                    if (rowIndex > 0) {
                        cellRefs.current[rowIndex - 1][cellIndex]?.focus();
                    } else {
                        headerRefs.current[cellIndex]?.focus();
                    }
                    break;

                case 'ArrowDown':
                    if (isHeader) {
                        if (state.current.rows.length > 0) {
                            cellRefs.current[0][cellIndex]?.focus();
                        }
                    } else if (rowIndex < state.current.rows.length - 1) {
                        cellRefs.current[rowIndex + 1][cellIndex]?.focus();
                    }
                    break;

                case 'ArrowLeft':
                    if (cellIndex > 0) {
                        if (isHeader) {
                            headerRefs.current[cellIndex - 1]?.focus();
                        } else {
                            cellRefs.current[rowIndex][cellIndex - 1]?.focus();
                        }
                    }
                    break;

                case 'ArrowRight':
                    if (cellIndex < state.current.headers.length - 1) {
                        if (isHeader) {
                            headerRefs.current[cellIndex + 1]?.focus();
                        } else {
                            cellRefs.current[rowIndex][cellIndex + 1]?.focus();
                        }
                    }
                    break;

                case 'Tab':
                    if (!e.shiftKey) {
                        if (isHeader) {
                            if (cellIndex < state.current.headers.length - 1) {
                                headerRefs.current[cellIndex + 1]?.focus();
                            } else if (state.current.rows.length > 0) {
                                cellRefs.current[0][0]?.focus();
                            }
                        } else {
                            if (cellIndex < state.current.headers.length - 1) {
                                cellRefs.current[rowIndex][cellIndex + 1]?.focus();
                            } else if (rowIndex < state.current.rows.length - 1) {
                                cellRefs.current[rowIndex + 1][0]?.focus();
                            }
                        }
                    }
                    break;
            }
        }

        // Keyboard shortcuts
        if (e.ctrlKey) {
            switch (e.key) {
                case 'n':
                    e.preventDefault();
                    dispatch({ type: 'ADD_ROW' });
                    break;

                case 'm':
                    e.preventDefault();
                    dispatch({ type: 'ADD_COLUMN' });
                    break;

                case 'z':
                    e.preventDefault();
                    dispatch({ type: 'UNDO' });
                    break;

                case 'y':
                    e.preventDefault();
                    dispatch({ type: 'REDO' });
                    break;
            }
        }
    };

    const handleContext = (e: MouseEvent) => e.preventDefault();

    return (
        <Card className='p-4 md:p-6'>
            <CardHeader className='flex w-full flex-col-reverse items-center justify-between p-0 md:flex-row'>
                <CardTitle className='sr-only hidden'>{title}</CardTitle>
                <div className='flex flex-1 gap-2'>
                    <Button
                        variant='outline'
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            isInternalUpdate.current = true;
                            dispatch({ type: 'ADD_ROW' });
                        }}
                        aria-label='Add Row'>
                        <Plus className='mr-2 h-4 w-4' /> Row
                    </Button>
                    <Button
                        variant='outline'
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            isInternalUpdate.current = true;
                            dispatch({ type: 'ADD_COLUMN' });
                        }}
                        aria-label='Add Column'>
                        <Plus className='mr-2 h-4 w-4' />
                        Column
                    </Button>
                </div>
                <div className='hidden w-fit gap-2 md:flex'>
                    <Button
                        size='icon'
                        variant='outline'
                        type='button'
                        onClick={() => {
                            isInternalUpdate.current = true;
                            dispatch({ type: 'UNDO' });
                        }}
                        disabled={!state.history.length}
                        aria-label='Undo'>
                        <Undo2 className='h-4 w-4' />
                    </Button>
                    <Button
                        size='icon'
                        variant='outline'
                        type='button'
                        onClick={() => {
                            isInternalUpdate.current = true;
                            dispatch({ type: 'REDO' });
                        }}
                        disabled={!state.future.length}
                        aria-label='Redo'>
                        <Redo2 className='h-4 w-4' />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className='overflow-x-auto px-0'>
                <table className='w-full border-collapse'>
                    <thead>
                        <tr>
                            {state.current.headers.map((h, i) => (
                                <th key={i} className='border bg-slate-100 p-2 dark:bg-slate-800'>
                                    <div className='flex items-center gap-1'>
                                        <Input
                                            ref={(el) => {
                                                headerRefs.current[i] = el;
                                            }}
                                            value={h}
                                            onChange={(e) => {
                                                isInternalUpdate.current = true;
                                                dispatch({
                                                    type: 'UPDATE_HEADER',
                                                    payload: { index: i, value: e.target.value }
                                                });
                                            }}
                                            onKeyDown={(e) => handleKeyDown(e, -1, i, true)}
                                            className={cn('min-w-[100px] text-sm font-semibold')}
                                            aria-label={`Header ${i + 1}`}
                                        />
                                        <Button
                                            className='text-destructive'
                                            variant={'outline'}
                                            size={'sm'}
                                            type='button'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                isInternalUpdate.current = true;
                                                dispatch({ type: 'DELETE_COLUMN', payload: i });
                                            }}>
                                            <Trash2 className='size-4' />
                                        </Button>
                                    </div>
                                </th>
                            ))}
                            <th className='w-8 border bg-slate-100 p-2 dark:bg-slate-800' />
                        </tr>
                    </thead>

                    <tbody>
                        {state.current.rows.map((row, ri) => (
                            <tr key={row.id}>
                                {row.cells.map((cell, ci) => (
                                    <td key={ci} className='border p-1' onContextMenu={handleContext}>
                                        {(() => {
                                            const commonProps = {
                                                ref: (el: any) => {
                                                    if (!cellRefs.current[ri]) cellRefs.current[ri] = [];
                                                    cellRefs.current[ri][ci] = el;
                                                },
                                                value: cell.value,
                                                onChange: (
                                                    e: React.ChangeEvent<
                                                        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                                                    >
                                                ) => {
                                                    isInternalUpdate.current = true;
                                                    dispatch({
                                                        type: 'UPDATE_CELL',
                                                        payload: { rowIndex: ri, cellIndex: ci, value: e.target.value }
                                                    });
                                                },
                                                onKeyDown: (
                                                    e: KeyboardEvent<
                                                        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                                                    >
                                                ) => handleKeyDown(e, ri, ci),
                                                className: 'min-w-[100px] text-sm',
                                                'aria-label': `Row ${ri + 1}, Col ${ci + 1}`
                                            };

                                            switch (cell.type) {
                                                case 'textarea':
                                                    return (
                                                        <Textarea
                                                            {...commonProps}
                                                            className={cn(commonProps.className, 'resize-none')}
                                                            maxLength={100}
                                                        />
                                                    );
                                                case 'select':
                                                    return (
                                                        <Select
                                                            value={cell.value}
                                                            onValueChange={(val) => {
                                                                isInternalUpdate.current = true;
                                                                dispatch({
                                                                    type: 'UPDATE_CELL',
                                                                    payload: { rowIndex: ri, cellIndex: ci, value: val }
                                                                });
                                                            }}>
                                                            <SelectTrigger className='w-full'>
                                                                <SelectValue placeholder='Choose' />
                                                            </SelectTrigger>
                                                            <SelectContent className='w-full'>
                                                                {selectOptions.map((opt) => (
                                                                    <SelectItem
                                                                        key={opt.value}
                                                                        value={opt.value}
                                                                        className={cn(
                                                                            opt.value === cell.value
                                                                                ? 'bg-primary text-primary-foreground'
                                                                                : ''
                                                                        )}>
                                                                        {opt.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    );

                                                case 'input':
                                                default:
                                                    return <Input {...commonProps} />;
                                            }
                                        })()}
                                    </td>
                                ))}

                                <td className='border p-1'>
                                    <Button
                                        className='text-destructive'
                                        variant={'outline'}
                                        size={'icon'}
                                        type='button'
                                        onClick={() => {
                                            isInternalUpdate.current = true;
                                            dispatch({ type: 'DELETE_ROW', payload: ri });
                                        }}>
                                        <Trash2 className='size-4' />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
}
