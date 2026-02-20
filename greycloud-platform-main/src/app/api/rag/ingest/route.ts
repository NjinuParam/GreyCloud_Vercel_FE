
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        // const body = await req.json(); // FormData is special

        // We must forward this to the external API as FormData
        // fetch handles boundary automatically if we pass FormData body
        const response = await fetch('http://52.151.192.107:8000/ingest', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer your_api_token_here'
                // Do NOT set Content-Type; automatic boundary
            },
            body: formData,
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
