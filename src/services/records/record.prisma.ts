import { prismaEdge } from '@/lib/databases/edge';
import { prisma } from '@/lib/databases/prisma';
import { Prisma } from '@prisma/client';

import { endOfDay, startOfDay } from 'date-fns';

const db = process.env.NODE_ENV === 'development' ? prisma : prismaEdge;

/**
 * Fetch records based on recordId or date. If neither provided, fetch all.
 */
export async function fetchRecordsFromDB(userId: string, recordId: string | null, date: string | null) {
    if (recordId) {
        return db.record.findFirst({
            where: { id: recordId, userId },
            include: {
                user: { select: { name: true } }
            }
        });
    }
    if (date) {
        const start = startOfDay(new Date(date));
        const end = endOfDay(new Date(date));

        return db.record.findMany({
            where: {
                userId,
                testDate: { gte: start, lte: end }
            },
            include: {
                user: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    return db.record.findMany({
        where: { userId },
        include: {
            user: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
}

/**
 * Create a new test record.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createRecordToDB(data: any) {
    return db.record.create({ data });
}

/**
 * Update a specific test record by record ID and user ID.
 */
export async function updateRecordToDB(recordId: string, userId: string, data: Partial<Prisma.RecordCreateInput>) {
    return db.record.update({
        where: { id: recordId, userId },
        data
    });
}

/**
 * Delete a test record by ID and user ID.
 */
export async function deleteRecordFromDB(recordId: string, userId: string) {
    return db.record.delete({
        where: { id: recordId, userId }
    });
}
