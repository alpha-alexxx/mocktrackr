'use client';

import { forwardRef, useRef, useState } from 'react';

import DownloadPdfIcon from '@/assets/icon/download-pdf';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { formatTime } from '@/lib/utils';
import { purifySections } from '@/services/records/purify-sections';
import { RecordItem } from '@/services/records/record.fetch';

import InsightDisplay from '../view/insight-display';
import { format } from 'date-fns';
import { BookOpen, Loader2 } from 'lucide-react';
import TableViewer from '../table-viewer';

export default function PDFDialog({ record, children }: { children: React.ReactNode; record: RecordItem }) {
    const [loading, setLoading] = useState(false);
    const reportRef = useRef<HTMLDivElement>(null);

    /**
     * Opens a new window with the report content, invokes the browser's print dialog,
     * and only closes that window once printing is confirmed or canceled.
     *
     * @async
     * @function handleDownloadPDF
     * @returns {Promise<void>} Resolves once the print window has closed.
     */
    const handleDownloadPDF = async (): Promise<void> => {
        if (!reportRef.current) {
            console.warn('No report content found to print.');

            return;
        }

        setLoading(true);

        try {
            // Clone the original content to manipulate without affecting the original DOM
            const originalContent = reportRef.current.cloneNode(true) as HTMLDivElement;

            // Open a new print window
            const printWindow = window.open('', '_blank', 'width=900,height=700');
            if (!printWindow) throw new Error('Unable to open print window.');

            // Prepare print content
            printWindow.document.open();
            printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                ${document.head.innerHTML}
                 <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0.75rem;
            }

            /* Prevent page breaks inside critical sections */
            #pdf-content,
            #pdf-page-1,
            #pdf-page-two,
            .section-container {
                page-break-inside: avoid;
                break-inside: avoid;
            }

            /* Ensure full-width content */
            #pdf-content {
                width: 100%;
                max-width: 210mm;
                margin: 0 auto;
            }

            /* Responsive image handling */
            img {
                max-width: 100%;
                height: auto;
            }

            /* Ensure clean section breaks */
            section {
                break-after: avoid;
            }

            /* Print-specific adjustments */
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    color-adjust: exact;
                }

                /* Hide unnecessary elements */
                .print-hide {
                    display: none !important;
                }
            }
        </style>
                </head>
                    <body>
                        ${originalContent.outerHTML}
                    </body>
                </html>
            `);
            printWindow.document.close();

            // Wait for content to load
            await new Promise<void>((resolve) => {
                printWindow.onload = () => resolve();
            });

            // Add print and cleanup handlers
            const cleanup = () => {
                printWindow.removeEventListener('afterprint', cleanup);
                printWindow.close();
            };
            printWindow.addEventListener('afterprint', cleanup);

            // Trigger print dialog
            printWindow.print();
        } catch (err) {
            console.error('Enhanced PDF Print Error:', err);
            // Optionally show user-friendly error notification
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className='h-full min-w-screen overflow-y-auto'>
                    <DialogHeader className='flex w-full flex-row items-center justify-between px-6'>
                        <DialogTitle className='text-center'>{record.testName}</DialogTitle>

                        <Button size={'sm'} variant={'destructive'} disabled={loading} onClick={handleDownloadPDF}>
                            {!loading ? <DownloadPdfIcon /> : <Loader2 className='size-4 animate-spin' />}
                            Download PDF
                        </Button>
                    </DialogHeader>
                    <div id='pdf-container'>
                        <div className='rounded-xl border-2 border-black/30'>
                            <PDFContent ref={reportRef} record={record} />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

const PDFContent = forwardRef<HTMLDivElement, { record: RecordItem }>(({ record }, ref) => {
    const {
        user: { name },
        testName,
        examName,
        percentile,
        rank,
        totalMarks,
        obtainedMarks,
        sectionWise
    } = record;
    const sections = purifySections(sectionWise);

    return (
        <div ref={ref} id='pdf-content' className='h-full w-full space-y-4 px-4 py-2 print:m-0 print:p-0'>
            {/* PAGE 1 */}
            <section id='pdf-page-1' className='relative w-full items-center justify-center p-2 print:mb-0'>
                <img
                    src='/images/logo_main.png'
                    alt='Logo'
                    className='pointer-events-none absolute top-1/2 left-1/2 z-0 max-w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-5'
                />
                <header>
                    <h1 className='flex flex-row items-center justify-center gap-2 text-center text-5xl font-bold uppercase'>
                        <div className='flex flex-row items-center justify-center gap-2'>
                            <BookOpen className='size-9' strokeWidth={4} />
                            MockTrackr Test Report
                            <BookOpen className='size-9' strokeWidth={4} />
                        </div>
                    </h1>
                    <div className='flex flex-row items-center justify-between'>
                        <p>Test Platform: {record.testPlatform}</p>
                        <p>Test Date: {format(record.testDate, 'MMMM do, yyyy')}</p>
                    </div>
                </header>
                <Separator className='h-2' />
                <main className='mt-4 flex flex-col items-center justify-center gap-4'>
                    <div id='top-header-info' className='grid w-full grid-cols-3 gap-2 rounded-lg border-2 p-4'>
                        <InfoRow label="Student's Name" value={name} />
                        <InfoRow label='Mock Name' value={testName} />
                        <InfoRow label='Exam Name' value={examName} />
                        <InfoRow label='Obtained Marks' value={obtainedMarks + '/' + totalMarks} />
                        <InfoRow label='Rank' value={rank || '          '} />
                        <InfoRow label='Percentile' value={percentile + '%' || '          '} />
                    </div>
                    {sections.map((section, index) => (
                        <section
                            key={section.name + index}
                            id={section.name + '-1'}
                            className='relative my-3 flex w-full flex-col items-center justify-center rounded-lg border-2 p-4 pt-0'>
                            <header className='absolute -top-5 rounded bg-black p-1 text-white'>
                                <h4 className='flex h-8 flex-row items-center justify-center gap-2 text-center text-2xl font-bold uppercase'>
                                    {section.name}
                                </h4>
                            </header>
                            <div className='mt-6 grid w-full grid-cols-7 space-x-2 divide-x-2'>
                                <Stat label='Total Questions' value={section.totalQuestions} />
                                <Stat label='Attempted' value={section.attemptedQuestions} />
                                <Stat label='Skipped' value={section.skippedQuestions} />
                                <Stat label='Correct' value={section.correctAnswers} />
                                <Stat label='Wrong' value={section.wrongAnswers} />
                                <Stat label='Attempt Duration' value={formatTime(section.timeTaken)} />
                                <Stat label='Obtained Marks' value={`${section.obtainedMarks}/${section.totalMarks}`} />
                            </div>
                            {section.keyPoints && (
                                <div className='mt-2 flex w-full flex-col items-start justify-center gap-2'>
                                    <h4 className='text-lg font-semibold'>What Went Wrong: </h4>
                                    <TableViewer
                                        data={JSON.parse(section.keyPoints)}
                                    />
                                </div>
                            )}
                        </section>
                    ))}
                </main>
            </section>

            {sections.some((section) => section.sectionLearnings) && (
                <section
                    id='pdf-page-two'
                    className='relative my-4 flex w-full flex-col items-center justify-center gap-4 space-y-4 font-[Poppins] print:mt-0'>
                    <img
                        src='/images/logo_main.png'
                        alt='Logo'
                        className='pointer-events-none absolute top-1/2 left-1/2 z-0 max-w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10'
                    />

                    <div className='w-full'>
                        <h2 className='text-center text-4xl font-bold'>Rules To Remember</h2>
                        <Separator />
                    </div>

                    {sections.map(
                        (section, index) =>
                            section.sectionLearnings && (
                                <section
                                    key={section.name + index}
                                    id={section.name}
                                    className='relative my-3 flex w-full flex-col items-center justify-center'>
                                    <header className='absolute -top-5 rounded bg-black p-1 text-white'>
                                        <h4 className='flex h-8 flex-row items-center justify-center gap-2 text-center font-[poppins] text-2xl font-bold uppercase'>
                                            {section.name}
                                        </h4>
                                    </header>
                                    <main className='w-full'>
                                        {section.sectionLearnings && (
                                            <div className='mt-2 flex w-full flex-col items-start justify-center gap-2'>
                                                <InsightDisplay
                                                    className='overflow-y-none max-h-full min-h-[200px]'
                                                    content={section.sectionLearnings}
                                                />
                                            </div>
                                        )}
                                    </main>
                                </section>
                            )
                    )}
                </section>
            )}
        </div>
    );
});

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
    <div className='flex flex-row items-center justify-start gap-2 text-center'>
        <span>{label}:</span>
        <span className='font-semibold underline'>{value}</span>
    </div>
);

const Stat = ({ label, value }: { label: string; value: string | number }) => (
    <div className='flex flex-col items-center justify-center'>
        <span className='font-medium'>{label}</span>
        <span className='font-semibold'>{value}</span>
    </div>
);
