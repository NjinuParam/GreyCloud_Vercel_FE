
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const response = await fetch('https://light-rag-sandbox.lemongrass-84d35018.westus2.azurecontainerapps.io/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': req.headers.get('Authorization') || '', // Forward auth if needed
                'Authorization': 'Bearer your_api_token_here' // Hardcoded for demo/sandbox
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
