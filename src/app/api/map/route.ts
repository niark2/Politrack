import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const electionId = searchParams.get('election');

    if (!electionId || !/^[a-zA-Z0-9_-]+$/.test(electionId)) {
        return NextResponse.json({ error: 'Missing or invalid election ID' }, { status: 400 });
    }

    const DATA_DIR = path.join(process.cwd(), 'data', electionId);
    let mapData = [];
    let lastUpdateDate = "Jamais";

    try {
        const filePath = path.join(DATA_DIR, 'map_cache.json');

        try {
            const stats = await fs.stat(filePath);
            const mtime = new Date(stats.mtime);
            lastUpdateDate = mtime.toLocaleDateString('fr-FR') + ' à ' + mtime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

            const data = await fs.readFile(filePath, 'utf8');
            const parsed = JSON.parse(data);
            mapData = Array.isArray(parsed) ? parsed : (parsed.cities || []);
        } catch (e) {
            // Fichier non trouvé ou invalide, on renvoie un tableau vide
            mapData = [];
        }

        return NextResponse.json({
            cities: mapData,
            lastUpdate: lastUpdateDate
        });
    } catch (error) {
        return NextResponse.json({ error: 'Data error', cities: [] });
    }
}
