import { NextResponse } from 'next/server';

import { prismaEdge as db } from '@/lib/databases/edge';

import { formatISO } from 'date-fns';

// adjust path to your prisma client

export async function GET() {
    try {
        const records = await db.record.findMany({
            select: {
                testDate: true // assuming 'date' is a Date field in your DB
            }
        });

        const uniqueDates = Array.from(
            new Set(records.map((record) => formatISO(record.testDate, { representation: 'complete' })))
        );

        return NextResponse.json({ dates: uniqueDates });
    } catch (error) {
        console.error('Failed to fetch available records:', error);

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
