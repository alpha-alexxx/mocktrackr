import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const report = await request.json();
        console.log('🛡️ CSP Violation Report:', JSON.stringify(report, null, 2));

        // Optionally, forward the report to an external logging service here

        // Return a 204 No Content response without a body
        return new Response(null, { status: 204 });
    } catch (error) {
        console.error('Error parsing CSP report:', error);

        return new Response(JSON.stringify({ error: 'Invalid report format' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
