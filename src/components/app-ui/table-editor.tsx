/* eslint-disable no-unused-vars */
// components/TableEditor.tsx
'use client';

import { type KeyboardEvent, type MouseEvent, useEffect, useReducer, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { Textarea } from '../ui/textarea';
import { Plus, Redo2, Trash2, Undo2 } from 'lucide-react';

/* eslint-disable no-unused-vars */
// components/TableEditor.tsx

// --- Types ---
export type TableData = {
    headers: string[];
    rows: { id: string; cells: { value: string }[] }[];
};

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
            const newRow = { id: generateId(), cells: current.headers.map(() => ({ value: '' })) };

            return {
                current: { ...current, rows: [...current.rows, newRow] },
                history: [...history, current],
                future: []
            };
        }
        case 'ADD_COLUMN': {
            const idx = current.headers.length + 1;

            return {
                current: {
                    headers: [...current.headers, `Column ${idx}`],
                    rows: current.rows.map((r) => ({ ...r, cells: [...r.cells, { value: '' }] }))
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
    // Memoize the value prop to prevent unnecessary re-renders
    const memoizedValue = useRef(value);

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

    // Initialize reducer from prop value ONCE
    const [state, dispatch] = useReducer(tableReducer, memoizedValue.current, (initialValue) => ({
        current: initialValue,
        history: [],
        future: []
    }));

    // Whenever state.current changes, emit to parent
    // Use a ref to track if the change was from internal state updates
    const isInternalUpdate = useRef(false);

    useEffect(() => {
        // Only call onChange if this wasn't triggered by an internal update
        if (!isInternalUpdate.current) {
            onChange(state.current);
        }
        isInternalUpdate.current = false;
    }, [state.current, onChange]);

    // Refs for navigation
    const headerRefs = useRef<(HTMLInputElement | null)[]>([]);
    const cellRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[][]>([]);

    useEffect(() => {
        headerRefs.current = Array(state.current.headers.length).fill(null);
        cellRefs.current = state.current.rows.map(() => Array(state.current.headers.length).fill(null));
    }, [state.current.headers, state.current.rows]);

    // Keyboard nav stub
    const handleKeyDown = (
        e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        ri: number,
        ci: number,
        isHeader = false
    ) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
            e.preventDefault();
        }
        // …optionally focus other inputs…
    };

    const handleContext = (e: MouseEvent) => e.preventDefault();

    return (
        <Card>
            <CardHeader className='flex items-center justify-between'>
                <CardTitle>{title}</CardTitle>
                <div className='flex gap-2'>
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

            <CardContent className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                    <thead>
                        <tr>
                            {state.current.headers.map((h, i) => (
                                <th key={i} className='border bg-gray-100 p-2'>
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
                                            onClick={() => {
                                                isInternalUpdate.current = true;
                                                dispatch({ type: 'DELETE_COLUMN', payload: i });
                                            }}>
                                            <Trash2 className='size-4' />
                                        </Button>
                                    </div>
                                </th>
                            ))}
                            <th className='w-8 border bg-gray-100 p-2' />
                        </tr>
                    </thead>

                    <tbody>
                        {state.current.rows.map((row, ri) => (
                            <tr key={row.id}>
                                {row.cells.map((cell, ci) => (
                                    <td key={ci} className='border p-1' onContextMenu={handleContext}>
                                        {ci === row.cells.length ? (
                                            <Textarea
                                                ref={(el) => {
                                                    if (!cellRefs.current[ri]) cellRefs.current[ri] = [];
                                                    cellRefs.current[ri][ci] = el;
                                                }}
                                                value={cell.value}
                                                onChange={(e) => {
                                                    isInternalUpdate.current = true;
                                                    dispatch({
                                                        type: 'UPDATE_CELL',
                                                        payload: { rowIndex: ri, cellIndex: ci, value: e.target.value }
                                                    });
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, ri, ci)}
                                                className='text-sm'
                                                aria-label={`Row ${ri + 1}, Col ${ci + 1}`}
                                            />
                                        ) : (
                                            <Input
                                                ref={(el) => {
                                                    if (!cellRefs.current[ri]) cellRefs.current[ri] = [];
                                                    cellRefs.current[ri][ci] = el;
                                                }}
                                                value={cell.value}
                                                onChange={(e) => {
                                                    isInternalUpdate.current = true;
                                                    dispatch({
                                                        type: 'UPDATE_CELL',
                                                        payload: { rowIndex: ri, cellIndex: ci, value: e.target.value }
                                                    });
                                                }}
                                                onKeyDown={(e) => handleKeyDown(e, ri, ci)}
                                                className='min-w-[100px] text-sm'
                                                aria-label={`Row ${ri + 1}, Col ${ci + 1}`}
                                            />
                                        )}
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

            <CardFooter className='flex justify-end gap-2'>
                <Button
                    size='sm'
                    variant='outline'
                    onClick={() => {
                        isInternalUpdate.current = true;
                        dispatch({ type: 'ADD_ROW' });
                    }}
                    title='Add Row (Ctrl+N)'>
                    <Plus className='mr-1 h-4 w-4' /> Add Row
                </Button>
                <Button
                    size='sm'
                    variant='outline'
                    onClick={() => {
                        isInternalUpdate.current = true;
                        dispatch({ type: 'ADD_COLUMN' });
                    }}
                    title='Add Column (Ctrl+M)'>
                    <Plus className='mr-1 h-4 w-4' /> Add Column
                </Button>
            </CardFooter>
        </Card>
    );
}
