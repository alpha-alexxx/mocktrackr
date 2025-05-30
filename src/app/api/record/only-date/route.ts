import { NextResponse } from 'next/server';

import { prismaEdge as db } from '@/lib/databases/edge';

import { formatInTimeZone } from 'date-fns-tz';

// adjust path to your prisma client

export async function GET() {
    try {
        const records = await db.record.findMany({
            select: {
                testDate: true // assuming 'date' is a Date field in your DB
            }
        });

        const utcDateStrings = records.map((r) => formatInTimeZone(r.testDate, 'UTC', 'yyyy-MM-dd'));

        const uniqueDates = Array.from(new Set(utcDateStrings));

        return NextResponse.json({ dates: uniqueDates });
    } catch (error) {
        console.error('Failed to fetch available records:', error);

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
