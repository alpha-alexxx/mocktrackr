'use client';

import { useCallback } from 'react';

import DownloadPdfIcon from '@/assets/icon/download-pdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatTime } from '@/lib/utils';
import { purifySections } from '@/services/records/purify-sections';
import { RecordItem } from '@/services/records/record.fetch';
import { Section } from '@/stores/form-store';
import { Document, PDFViewer, Page, StyleSheet, Text, View, pdf } from '@react-pdf/renderer';

import { formatDate } from 'date-fns';
import { useMobile } from '@/hooks/use-mobile';

// Types
type TableCellData = {
    type: 'input' | 'select' | 'textarea';
    value: string;
};

type Row = {
    id: string;
    cells: TableCellData[];
};

type PDFTableProps = {
    headers: string[];
    rows: Row[];
};

export default function PDFDialog({ record, children }: { children: React.ReactNode; record: RecordItem }) {
    const isMobile = useMobile()
    const handleDownload = useCallback(async () => {
        const blob = await pdf(<PDFContent record={record} />).toBlob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${record.testName || 'MockTest'}_Report(${formatDate(record.testDate, 'dd-MM-yyyy')}).pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }, [record]);

    return (
        <Dialog>
            {
                isMobile ? <div onClick={handleDownload} className='size-auto'>${children}</div> :
                    <DialogTrigger asChild>{children}</DialogTrigger>
            }
            <DialogContent className='h-full w-auto'>
                <DialogTitle className='sr-only'>Test Report</DialogTitle>
                <Card className='border-none p-2 shadow-none md:p-4'>
                    <CardHeader className='flex h-fit w-full flex-row items-center justify-between'>
                        <span className='text-xl font-bold md:text-2xl'>{record.testName}</span>
                        <Button onClick={handleDownload} variant={'destructive'}>
                            <DownloadPdfIcon className='mr-2 size-5' />
                            Download PDF
                        </Button>
                    </CardHeader>
                    <CardContent className='h-[90%] w-[90%]'>
                        <PDFViewer className='h-full w-full'>
                            <PDFContent record={record} />
                        </PDFViewer>
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    );
}

function PDFContent({ record }: { record: RecordItem }) {
    const styles = StyleSheet.create({
        page: {
            padding: 10,
            fontSize: 12,
            fontFamily: 'Helvetica'
        },
        headerTxt: {
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 10
        },
        headerSection: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10
        },
        tableRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 5,
            alignItems: 'center'
        },
        tableCell: {
            flexDirection: 'row',
            gap: 4
        },
        tableCellLabel: {
            paddingRight: 5,
            fontWeight: '600'
        },
        tableCellValue: {
            textDecoration: 'underline'
        },
        label: {
            fontWeight: '600',
            color: '#444'
        },
        value: {
            color: '#000'
        },
        sectionContainer: {
            borderWidth: 1,
            borderColor: '#ccc',
            borderStyle: 'solid',
            borderRadius: 5,
            padding: 10,
            marginVertical: 10
        },
        sectionTitle: {
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 8,
            color: '#222'
        },
        sectionTable: {
            flexDirection: 'column'
        },
        sectionTableRow: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#ccc',
            paddingVertical: 5,
            alignItems: 'center'
        },
        sectionTableCell: {
            flex: 1,
            alignItems: 'center'
        },
        sectionTableCellValue: {
            fontWeight: '600',
            fontSize: 14
        }
    });

    const {
        user: { name },
        testName,
        examCode,
        percentile,
        rank,
        totalMarks,
        obtainedMarks,
        sectionWise
    } = record;
    const getExamName = (examCode: string) => {
        switch (examCode) {
            case 'ssc_cgl':
                return 'SSC CGL';
            case 'ssc_chsl':
                return 'SSC CHSL';
            case 'ssc_cpo':
                return 'SSC CPO';
            case 'ssc_mts':
                return 'SSC MTS';
            default:
                break;
        }
    };
    const sections = purifySections(sectionWise);

    return (
        <Document>
            <Page size='A4' style={styles.page}>
                <Text style={styles.headerTxt}>MockTrackr Report</Text>

                <View style={styles.headerSection}>
                    {/* Row 1 */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}>
                            <Text style={styles.label}>Name:</Text>
                            <Text style={styles.value}>{name}</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text style={styles.label}>Exam:</Text>
                            <Text style={styles.value}>{getExamName(examCode)}</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text style={styles.label}>Test:</Text>
                            <Text style={styles.value}>{testName}</Text>
                        </View>
                    </View>

                    {/* Row 2 */}
                    <View style={styles.tableRow}>
                        <View style={styles.tableCell}>
                            <Text style={styles.label}>Percentile:</Text>
                            <Text style={styles.value}>{percentile}</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text style={styles.label}>Rank:</Text>
                            <Text style={styles.value}>{rank}</Text>
                        </View>
                        <View style={styles.tableCell}>
                            <Text style={styles.label}>Total Marks:</Text>
                            <Text style={styles.value}>
                                {obtainedMarks} / {totalMarks}
                            </Text>
                        </View>
                    </View>
                </View>

                {sections.map((section: Section) => {
                    let keyPoints: PDFTableProps | undefined;

                    try {
                        const parsed = JSON.parse(section.keyPoints || '{}');
                        if (parsed.headers && parsed.rows) {
                            keyPoints = parsed;
                        }
                    } catch (error) {
                        console.error(`Invalid JSON in section.keyPoints (${section.name}):`, error);
                    }

                    return (
                        <View key={section.name} style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>
                                {section.name} — Total Questions: {section.totalQuestions}
                            </Text>

                            <View style={styles.sectionTable}>
                                <View style={styles.sectionTableRow}>
                                    <View style={styles.sectionTableCell}>
                                        <Text>Attempted</Text>
                                        <Text style={styles.sectionTableCellValue}>{section.attemptedQuestions}</Text>
                                    </View>
                                    <View style={styles.sectionTableCell}>
                                        <Text>Correct</Text>
                                        <Text style={styles.sectionTableCellValue}>{section.correctAnswers}</Text>
                                    </View>
                                    <View style={styles.sectionTableCell}>
                                        <Text>Wrong</Text>
                                        <Text style={styles.sectionTableCellValue}>{section.wrongAnswers}</Text>
                                    </View>
                                </View>

                                <View style={styles.sectionTableRow}>
                                    <View style={styles.sectionTableCell}>
                                        <Text>Skipped</Text>
                                        <Text style={styles.sectionTableCellValue}>{section.skippedQuestions}</Text>
                                    </View>
                                    <View style={styles.sectionTableCell}>
                                        <Text>Time Taken</Text>
                                        <Text style={styles.sectionTableCellValue}>
                                            {formatTime(section.timeTaken)}
                                        </Text>
                                    </View>
                                    <View style={styles.sectionTableCell}>
                                        <Text>My Marks</Text>
                                        <Text style={styles.sectionTableCellValue}>
                                            {section.obtainedMarks} / {section.totalMarks}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {keyPoints && (
                                <View>
                                    <Text>What Went Wrong:</Text>
                                    <PDFTable data={keyPoints} />
                                </View>
                            )}
                        </View>
                    );
                })}
            </Page>
        </Document>
    );
}

function PDFTable({ data }: { data?: PDFTableProps }) {
    const styles = StyleSheet.create({
        tableContainer: {
            marginVertical: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderStyle: 'solid'
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#ccc'
        },
        headerCell: {
            flex: 1,
            padding: 6,
            backgroundColor: '#eee',
            fontSize: 10,
            fontWeight: 'bold',
            textAlign: 'center',
            borderRightWidth: 1,
            borderRightColor: '#ccc'
        },
        cell: {
            flex: 1,
            padding: 6,
            fontSize: 10,
            textAlign: 'center',
            borderRightWidth: 1,
            borderRightColor: '#ccc'
        },
        lastCell: {
            borderRightWidth: 0
        },
        correct: {
            color: 'green',
            fontWeight: 'bold'
        },
        wrong: {
            color: 'red',
            fontWeight: 'bold'
        },
        defaultText: {
            color: '#333'
        },
        italic: {
            fontStyle: 'italic'
        }
    });

    const renderCell = (cell: TableCellData) => {
        switch (cell.type) {
            case 'select':
                if (cell.value === 'correct') return <Text style={styles.correct}>✔ Correct</Text>;
                if (cell.value === 'wrong') return <Text style={styles.wrong}>✘ Wrong</Text>;

                return <Text style={styles.defaultText}>{cell.value}</Text>;
            case 'textarea':
                return <Text style={styles.italic}>{cell.value}</Text>;
            default:
                return <Text style={styles.defaultText}>{cell.value}</Text>;
        }
    };

    if (!data || !data.headers || !data.rows) return null;

    return (
        <View style={styles.tableContainer}>
            <View style={styles.row}>
                {data.headers.map((header, idx) => (
                    <Text
                        key={idx}
                        style={[styles.headerCell, ...(idx === data.headers.length - 1 ? [styles.lastCell] : [])]}>
                        {header}
                    </Text>
                ))}
            </View>

            {data.rows.map((row) => (
                <View key={row.id} style={styles.row}>
                    {row.cells.map((cell, idx) => (
                        <View
                            key={idx}
                            style={[styles.cell, ...(idx === row.cells.length - 1 ? [styles.lastCell] : [])]}
                        >
                            {renderCell(cell)}
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
}
