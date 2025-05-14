import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/authentication/auth';
import { prisma as db } from '@/lib/databases/prisma';
import { createRecordToDB, fetchRecordsFromDB, updateRecordToDB } from '@/services/records/record.prisma';
import { Prisma } from '@prisma/client';

/**
 * Handles GET requests to fetch test records based on userId, date, or recordId.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} The response containing the fetched records or an error.
 */

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const params = new URL(request.url).searchParams;

        const userId = params.get('userId');
        const date = params.get('date');
        const recordId = params.get('recordId');
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized request. Please log in to continue.' },
                { status: 401 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required to perform this action.' },
                { status: 400 }
            );
        }

        if (session.user.id !== userId) {
            return NextResponse.json(
                { success: false, message: 'Forbidden request. You are not authorized to perform this action.' },
                { status: 403 }
            );
        }

        const records = await fetchRecordsFromDB(userId, recordId, date);
        if (!records) {
            return NextResponse.json({ success: true, records: null, message: 'No records found' }, { status: 200 });
        }

        return NextResponse.json({ success: true, records, message: 'Records fetched successfully!' }, { status: 200 });
    } catch (error) {
        console.log('ERROR: ', error);

        return NextResponse.json({ success: false, message: 'Failed to fetch records' }, { status: 500 });
    }
}

/**
 * Handles POST requests to create a new test record for the authenticated user.
 *
 * @param {Request} request - The incoming request containing record data in JSON.
 * @returns {Promise<NextResponse>} The response indicating success or failure.
 */

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized Request' }, { status: 401 });
        }

        const data = await request.json();
        // Validate required fields
        if (!data.testName || !data.examName || !data.examCode || !data.testPlatform) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const safeData = parseDataToTypeSafe(session.user.id, data);
        // Create a new record
        const record = await createRecordToDB(safeData);

        return NextResponse.json(
            { success: true, message: 'Record created successfully.', data: record },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating record:', error);

        return NextResponse.json({ success: false, message: 'Failed to create the record.' }, { status: 500 });
    }
}

/**
 * Handles PUT requests to update an existing record for the authenticated user.
 *
 * @param {Request} request - The incoming request containing updated data.
 * @returns {Promise<NextResponse>} The response with updated record or an error.
 */
export async function PUT(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const recordId = searchParams.get('recordId');
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session || !recordId) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized request. Please log in and provide a valid record ID.' },
                { status: 401 }
            );
        }
        const data = await request.json();
        // Validate required fields
        if (!data.testName || !data.examName || !data.examCode || !data.testPlatform) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Missing required fields: test name, exam name, and test platform are mandatory.'
                },
                { status: 400 }
            );
        }
        const safeData = parseDataToTypeSafe(session.user.id, data);

        const record = await updateRecordToDB(recordId, session.user.id, safeData);

        return NextResponse.json(
            { success: true, message: 'Record updated successfully.', data: record },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error while updating record:', error);

        return NextResponse.json(
            { success: false, message: 'An error occurred while updating the record. Please try again later.' },
            { status: 500 }
        );
    }
}

/**
 * Handles DELETE requests to remove a record by ID for the authenticated user.
 *
 * @param {Request} request - The incoming request containing `recordId` in the query.
 * @returns {Promise<NextResponse>} The response indicating deletion success or error.
 */
export async function DELETE(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        const recordId = searchParams.get('recordId');
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: No active session found. Please log in.' },
                { status: 401 }
            );
        }

        if (!recordId) {
            return NextResponse.json(
                { success: false, message: 'Bad Request: The record ID is required and cannot be missing.' },
                { status: 400 }
            );
        }

        await db.record.delete({
            where: {
                id: recordId,
                userId: session.user.id
            }
        });

        return NextResponse.json({ success: true, message: 'Record deleted successfully.' }, { status: 200 });
    } catch (error) {
        console.error('DELETE /api/record error:', error);

        return NextResponse.json(
            { success: false, message: 'Internal Server Error: Failed to delete the record.' },
            { status: 500 }
        );
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDataToTypeSafe = (userId: string, data: any) => {
    const attempted = (data.totalCorrectQuestions || 0) + (data.totalWrongQuestions || 0);
    const skipped = (data.totalQuestions || 0) - attempted;

    const recordData: Prisma.RecordUncheckedCreateInput = {
        userId,
        testName: data.testName,
        testDate: new Date(data.testDate),
        examName: data.examName,
        examCode: data.examCode,
        examTier: data.examTier === 'tier1' ? 'TIER_1' : data.examTier === 'tier2' ? 'TIER_2' : undefined,
        testPlatform: data.testPlatform,
        testLink: data.testLink || null,
        totalQuestions: data.totalQuestions || 0,
        attemptedQuestions: attempted,
        totalSkippedQuestions: skipped,
        totalCorrectQuestions: data.totalCorrectQuestions || 0,
        totalWrongQuestions: data.totalWrongQuestions || 0,
        totalMarks: data.totalMarks || 0,
        obtainedMarks: data.obtainedMarks || 0,
        totalCorrectMarks: data.totalCorrectMarks || 0,
        totalWrongMarks: data.totalWrongMarks || 0,
        totalTime: data.totalTime || '00:00:00',
        totalTimeTaken: data.totalTimeTaken || '00:00:00',
        percentile: data.percentile || null,
        rank: data.rank || null,
        keyPoints: data.keyPoints || null,
        learnings: data.learnings || null,
        sectionWise: data.sectionWise || []
    };

    return recordData;
};
