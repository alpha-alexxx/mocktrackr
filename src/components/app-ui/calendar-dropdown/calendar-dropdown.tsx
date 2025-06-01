import React, { useMemo } from 'react';
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
import { format } from 'date-fns';
import { enIN } from 'date-fns/locale';

export default function CalendarDropDown({
    children,
    markedDates = []
}: {
    children: React.ReactNode;
    markedDates?: string[];
}) {
    const { date, setDate } = useDatePicker();

    // ✅ Normalize and deduplicate marked dates (strip time, keep only date string)

    const normalizedMarkedDates = useMemo(() => {
        return Array.from(
            new Set(
                markedDates
                    .map(dateStr => new Date(dateStr))
                    .filter(d => !isNaN(d.getTime()))
                    .map(validDate => format(validDate, 'yyyy-MM-dd', { locale: enIN })) // ✅ LOCAL format
            )
        );
    }, [markedDates]);



    // ✅ Handler for selecting a date from the calendar
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
                    mode='single'
                    modifiers={{
                        marked: (day) => {
                            const dayKey = format(day, 'yyyy-MM-dd', { locale: enIN });

                            return normalizedMarkedDates.includes(dayKey);
                        }
                    }}
                    modifiersClassNames={{
                        marked:
                            'relative after:content-[""] after:absolute after:top-0.5 after:right-0.5 after:size-2 after:rounded-full after:bg-primary'
                    }}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
