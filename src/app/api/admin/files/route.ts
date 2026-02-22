import { NextResponse } from 'next/server';
import { verifyToken, listAllFiles, readFile, writeFile } from '@/lib/admin-utils';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const token = request.headers.get('x-admin-token');
    const path = searchParams.get('path');

    if (!(await verifyToken(token))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        if (path) {
            const content = await readFile(path);
            return NextResponse.json({ content });
        } else {
            const files = await listAllFiles();
            return NextResponse.json({ files });
        }
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const token = request.headers.get('x-admin-token');
    const { path, content } = await request.json();

    if (!(await verifyToken(token))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!path || content === undefined) {
        return NextResponse.json({ error: 'Missing path or content' }, { status: 400 });
    }

    try {
        await writeFile(path, content);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
