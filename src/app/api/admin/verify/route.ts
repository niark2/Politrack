import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/admin-utils';

export async function POST(request: Request) {
    const { token } = await request.json();

    if (await verifyToken(token)) {
        return NextResponse.json({ success: true });
    } else {
        return NextResponse.json({ success: false }, { status: 401 });
    }
}
