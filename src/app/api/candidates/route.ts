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
    const descriptivePath = path.join(electionDir, 'partis_cache.json');
    const technicalPath = path.join(electionDir, 'candidates_cache.json');
    const citiesPath = path.join(electionDir, 'cities_cache.json');

    let CACHE_PATH = null;
    if (fs.existsSync(descriptivePath)) CACHE_PATH = descriptivePath;
    else if (fs.existsSync(technicalPath)) CACHE_PATH = technicalPath;
    else if (fs.existsSync(citiesPath)) CACHE_PATH = citiesPath;

    if (CACHE_PATH && fs.existsSync(CACHE_PATH)) {
        try {
            const cacheRaw = fs.readFileSync(CACHE_PATH, 'utf-8');
            let cache = JSON.parse(cacheRaw);

            // Handle raw array (mapping cities to "pseudo-candidates" for general view if needed)
            if (Array.isArray(cache)) {
                return NextResponse.json({
                    lastUpdate: "Mise à jour manuelle",
                    candidates: cache
                });
            }

            return NextResponse.json(cache);
        } catch (e) {
            console.error(`Error reading candidates data for ${election}`, e);
        }
    }

    // Default candidates (Fallback ONLY for presidential)
    if (election.includes('pres')) {
        return NextResponse.json({
            lastUpdate: "Données par défaut",
            candidates: [
                { fullName: "Édouard Philippe", party: "Horizons", dateOfAnnouncement: "03/09/2024", status: "Officiel", color: "#1e40af" },
                { fullName: "Jordan Bardella", party: "RN", dateOfAnnouncement: "Année 2026", status: "Pressenti", color: "#800080" }
            ]
        });
    }

    return NextResponse.json({
        lastUpdate: "En attente de données",
        candidates: []
    });
}
