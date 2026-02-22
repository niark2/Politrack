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

    // 0. Ensure Election directory exists
    const electionDir = path.join(process.cwd(), 'data', election);
    if (!fs.existsSync(electionDir)) {
        fs.mkdirSync(electionDir, { recursive: true });
    }

    const descriptivePath = path.join(electionDir, 'intentions_cache.json');
    const technicalPath = path.join(electionDir, 'poll_cache.json');
    const citiesPath = path.join(electionDir, 'cities_cache.json');

    let CACHE_PATH = null;
    if (fs.existsSync(citiesPath)) CACHE_PATH = citiesPath;
    else if (fs.existsSync(descriptivePath)) CACHE_PATH = descriptivePath;
    else if (fs.existsSync(technicalPath)) CACHE_PATH = technicalPath;

    // Read directly from file (Static mode)
    if (CACHE_PATH && fs.existsSync(CACHE_PATH)) {
        try {
            const cacheRaw = fs.readFileSync(CACHE_PATH, 'utf-8');
            let cache = JSON.parse(cacheRaw);

            // If it's a raw array (common in municipal cache), wrap it for the frontend
            if (Array.isArray(cache)) {
                return NextResponse.json({
                    lastUpdate: "Mise à jour manuelle",
                    candidates: cache
                });
            }

            return NextResponse.json(cache);
        } catch (e) {
            console.error(`Error reading poll data for ${election}`, e);
        }
    }

    // Initial default data if file is missing (only for France 2027 as fallback)
    const defaultData = {
        lastUpdate: "Données par défaut",
        candidates: [
            { name: "J. Bardella", fullName: "Jordan Bardella", score: 35, color: "#800080" },
            { name: "G. Attal", fullName: "Gabriel Attal", score: 20, color: "#ffcc00" },
            { name: "E. Philippe", fullName: "Édouard Philippe", score: 18, color: "#1e40af" },
            { name: "J.L. Mélenchon", fullName: "Jean-Luc Mélenchon", score: 15, color: "#cc2443" },
            { name: "X. Bertrand", fullName: "Xavier Bertrand", score: 6, color: "#0066cc" },
            { name: "M. Tondelier", fullName: "Marine Tondelier", score: 6, color: "#00b25d" }
        ]
    };

    return NextResponse.json(defaultData);
}
