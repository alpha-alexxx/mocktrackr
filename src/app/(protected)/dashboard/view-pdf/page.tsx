import { Separator } from '@/components/ui/separator';

import { BookOpen } from 'lucide-react';

const record = {
    name: 'Ankit Kumar',
    mockName: 'Test 1',
    examName: 'SSC CGL',
    rank: '1200/14023',
    percentile: 90,
    totalMarks: '190/200'
};
export default function ViewPdfPage() {
    const { examName, mockName, name, percentile, rank, totalMarks } = record;

    return (
        <section id='pdf' className='h-full w-full items-center justify-center border border-black p-2 font-[Poppins]'>
            <header>
                <h1 className='flex flex-row items-center justify-center gap-2 text-center font-[poppins] text-5xl font-bold uppercase'>
                    <BookOpen className='size-9' strokeWidth={4} />
                    MockTrackr Test Report
                    <BookOpen className='size-9' strokeWidth={4} />
                </h1>
                <Separator className='h-2' />
            </header>
            <main className='mt-4 flex flex-col items-center justify-center gap-4'>
                <div id='top-header-info' className='grid w-full grid-cols-3 gap-2 rounded-lg border-2 p-4'>
                    <div className='flex flex-row items-center justify-start gap-2'>
                        <span>Student's Name:</span>
                        <span className='font-semibold underline'>{name}</span>
                    </div>
                    <div className='flex flex-row items-center justify-start gap-2'>
                        <span>Mock Name:</span>
                        <span className='font-semibold underline'>{mockName}</span>
                    </div>
                    <div className='flex flex-row items-center justify-start gap-2'>
                        <span>Exam Name:</span>
                        <span className='font-semibold underline'>{examName}</span>
                    </div>
                    <div className='flex flex-row items-center justify-start gap-2'>
                        <span>Total Marks:</span>
                        <span className='font-semibold underline'>{totalMarks}</span>
                    </div>
                    <div className='flex flex-row items-center justify-start gap-2'>
                        <span>Rank:</span>
                        <span className='font-semibold underline'>{rank}</span>
                    </div>
                    <div className='flex flex-row items-center justify-start gap-2'>
                        <span>Percentile:</span>
                        <span className='font-semibold underline'>{percentile} %</span>
                    </div>
                </div>
            </main>
        </section>
    );
}
