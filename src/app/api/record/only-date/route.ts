import { NextResponse } from 'next/server';

import { prismaEdge as db } from '@/lib/databases/edge';

// adjust path to your prisma client

export async function GET() {
    try {
        const records = await db.record.findMany({
            select: {
                testDate: true // assuming 'date' is a Date field in your DB
            }
        });

        return NextResponse.json({ dates: records.map((r) => r.testDate) });
    } catch (error) {
        console.error('Failed to fetch available records:', error);

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
