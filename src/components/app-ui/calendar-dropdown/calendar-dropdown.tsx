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
import { formatDate } from 'date-fns';

export default function CalendarDropDown({
    children,
    markedDates = []
}: {
    children: React.ReactNode;
    markedDates?: string[];
}) {
    const { date, setDate } = useDatePicker();

    const handleSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return;
        const minDate = new Date('2020-01-01');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < minDate) {
            toast.error('You cannot select a date before January 1, 2020');

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
            <DropdownMenuContent side='bottom'>
                <DropdownMenuLabel>Choose Date to Jump on</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Calendar
                    selected={date}
                    showOutsideDays
                    onSelect={handleSelect}
                    modifiers={{
                        marked: (day) => markedDates.includes(formatDate(day, 'MMMM do, yyyy'))
                    }}
                    modifiersClassNames={{
                        marked:
                            'relative after:content-[""] after:absolute after:top-0.5 after:right-0.5 after:size-2 after:rounded-full after:bg-primary'

                    }}
                    mode='single'
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
