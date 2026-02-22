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

    const electionDir = path.join(process.cwd(), 'data', election);
    const descriptivePath = path.join(electionDir, 'sieges_cache.json');
    const technicalPath = path.join(electionDir, 'poll_cache_r2.json');
    const CACHE_PATH = fs.existsSync(descriptivePath) ? descriptivePath : technicalPath;

    if (fs.existsSync(CACHE_PATH)) {
        try {
            const cacheRaw = fs.readFileSync(CACHE_PATH, 'utf-8');
            const cache = JSON.parse(cacheRaw);
            return NextResponse.json(cache);
        } catch (e) {
            console.error(`Error reading R2 data for ${election}`, e);
        }
    }

    // Default R2 data (Fallback)
    return NextResponse.json({
        lastUpdate: "Données par défaut",
        duel: "Bardella / Philippe",
        candidates: [
            { name: "J. Bardella", fullName: "Jordan Bardella", score: 53, color: "#800080" },
            { name: "E. Philippe", fullName: "Édouard Philippe", score: 47, color: "#1e40af" }
        ]
    });
}
