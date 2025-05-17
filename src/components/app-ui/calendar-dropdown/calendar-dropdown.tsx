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

export default function CalendarDropDown({ children }: { children: React.ReactNode }) {
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

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Choose Date to Jump on</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Calendar selected={date} showWeekNumber showOutsideDays onSelect={handleSelect} mode='single' />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
