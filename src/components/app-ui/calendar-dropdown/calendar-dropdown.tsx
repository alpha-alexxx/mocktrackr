import React from 'react';

import { Calendar } from '@/components/ui/calendar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import useDatePicker from '@/stores/date_picker';

import { toast } from 'sonner';

type DayWithDot = {
    date: Date;
    hasData: boolean;
};

export default function CalendarDropDown({
    children,
    daysWithData = []
}: {
    children: React.ReactNode;
    daysWithData?: DayWithDot[];
}) {
    const { date, setDate } = useDatePicker();

    const handleSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return;
        const minDate = new Date('2020-01-01');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < minDate) {
            toast.error('You cannot select a date before 1-1-2020');

            return;
        }
        if (selectedDate > today) {
            toast.error('You cannot select a date in the future');

            return;
        }
        setDate(selectedDate);
    };

    const modifiers = {
        withData: daysWithData.map((day) => day.date)
    };

    const modifiersStyles = {
        withData: {
            color: 'inherit',
            '&::after': {
                content: '"•"',
                display: 'block',
                position: 'absolute',
                bottom: '2px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '12px',
                color: 'var(--primary)'
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent side='right'>
                <DropdownMenuLabel>Choose Date to Jump on</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Calendar
                    selected={date}
                    showOutsideDays
                    onSelect={handleSelect}
                    mode='single'
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
