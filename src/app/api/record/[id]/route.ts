import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

import { auth } from '@/lib/authentication/auth';
import { fetchRecordFromDB } from '@/services/records/record.prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const params = new URL(request.url).searchParams;
        const userId = params.get('userId');
        const session = await auth.api.getSession({ headers: await headers() });

        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized request. Please log in to continue.' },
                { status: 401 }
            );
        }
        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Record ID is required to perform this action.' },
                { status: 400 }
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

        const record = await fetchRecordFromDB(id, userId);

        if (!record) {
            return NextResponse.json(
                { success: true, records: null, message: 'No records found on this date' },
                { status: 200 }
            );
        }

        return NextResponse.json({ success: true, record, message: 'Records fetched successfully!' }, { status: 200 });
    } catch (error) {
        console.log('ERROR: ', error);

        return NextResponse.json({ success: false, message: 'Failed to fetch records' }, { status: 500 });
    }
}
