import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const election = searchParams.get('election') || 'france-pres-2027';

    if (!/^[a-zA-Z0-9_-]+$/.test(election)) {
        return NextResponse.json({ error: 'Invalid election identifier' }, { status: 400 });
    }

    try {
        const electionDir = path.join(process.cwd(), 'data', election);
        const descriptivePath = path.join(electionDir, 'sondages_cache.json');
        const technicalPath = path.join(electionDir, 'detailed_polls_cache.json');
        const filePath = fs.existsSync(descriptivePath) ? descriptivePath : technicalPath;

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ polls: [], lastUpdate: null });
        }
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContent);
        return NextResponse.json(data);
    } catch (error) {
        console.error(`Error reading detailed polls cache for ${election}:`, error);
        return NextResponse.json({ error: 'Failed to fetch detailed polls' }, { status: 500 });
    }
}
