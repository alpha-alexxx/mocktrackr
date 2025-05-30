'use client';

import CalendarClick from '@/assets/icon/calendar-click';
import useDatePicker from '@/stores/date_picker';

import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import CalendarDropDown from './calendar-dropdown/calendar-dropdown';
import { AppBreadcrumb } from './sidebar/bread-crumb';
import { formatDate } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { fetchMarkedDates } from '@/services/records/record.fetch';
import { Skeleton } from '../ui/skeleton';

export default function DashboardHeader() {
    const { date } = useDatePicker();

    const { data: markedDates = [], isLoading } = useQuery({
        queryKey: ['available-records'],
        queryFn: fetchMarkedDates,
        staleTime: 1000 * 60 * 5, // cache for 5 mins
    });

    return (
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
            <div className='flex items-center gap-2 px-4'>
                <SidebarTrigger className='-ml-1' />
                <Separator orientation='vertical' className='mr-2 h-4' />
                <AppBreadcrumb />
            </div>

            {
                isLoading ? <div className="p-1 mr-4">
                    <Skeleton className="h-10 w-40" />
                </div> :
                    <CalendarDropDown markedDates={markedDates}>
                        <Button
                            variant={'outline'}
                            className='mr-8 flex cursor-pointer flex-row items-center justify-between gap-2 rounded-sm border p-1.5 font-semibold shadow-xs select-none'
                            asChild>
                            <div>
                                <CalendarClick className='size-5' />
                                {date === undefined ? 'Loading...' : formatDate(date, 'MMMM do, yyyy')}
                            </div>
                        </Button>
                    </CalendarDropDown>
            }

        </header>
    );
}
