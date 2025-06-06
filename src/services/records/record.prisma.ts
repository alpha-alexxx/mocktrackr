import { prismaEdge } from '@/lib/databases/edge';
import { prisma } from '@/lib/databases/prisma';
import { Prisma } from '@/prisma';

import { endOfDay, startOfDay } from 'date-fns';

const db = process.env.NODE_ENV === 'development' ? prisma : prismaEdge;

/**
 * Fetch records based on recordId or date. If neither provided, fetch all.
 */
export async function fetchRecordsFromDB(userId: string, date: string) {
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

/**
 * Fetch a specific record by record ID and user ID.
 * @param recordId - The ID of the record to fetch.
 * @param userId - The ID of the user who owns the record.
 */

export async function fetchRecordFromDB(recordId: string, userId: string) {
    return db.record.findUnique({
        where: { id: recordId, userId },
        include: {
            user: { select: { name: true } }
        }
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
