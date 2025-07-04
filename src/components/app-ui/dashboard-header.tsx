'use client';

import CalendarClick from '@/assets/icon/calendar-click';
import useDatePicker from '@/stores/date_picker';

import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { SidebarTrigger } from '../ui/sidebar';
import CalendarDropDown from './calendar-dropdown/calendar-dropdown';
import { AppBreadcrumb } from './sidebar/bread-crumb';
import { formatDate } from 'date-fns';

export default function DashboardHeader() {
    const { date } = useDatePicker();

    return (
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
            <div className='flex items-center gap-2 px-4'>
                <SidebarTrigger className='-ml-1' />
                <Separator orientation='vertical' className='mr-2 h-4' />
                <AppBreadcrumb />
            </div>

            <CalendarDropDown>
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
        </header>
    );
}
