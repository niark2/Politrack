import { NextResponse } from 'next/server';
import { verifyToken, readFile, writeFile } from '@/lib/admin-utils';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request) {
    const token = request.headers.get('x-admin-token');
    const election = await request.json();

    if (!(await verifyToken(token))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!election.id || !election.name || !election.type) {
        return NextResponse.json({ error: 'Missing election data' }, { status: 400 });
    }

    try {
        // 1. Update elections.json
        const electionsContent = await readFile('elections.json');
        const elections = JSON.parse(electionsContent);

        // Check if ID already exists
        if (elections.some((e: { id: string }) => e.id === election.id)) {
            return NextResponse.json({ error: 'Election ID already exists' }, { status: 400 });
        }

        elections.push(election);
        await writeFile('elections.json', JSON.stringify(elections, null, 4));

        // 2. Create the folder
        const DATA_DIR = path.join(process.cwd(), 'data');
        const folderPath = path.join(DATA_DIR, election.id);
        await fs.mkdir(folderPath, { recursive: true });

        // 3. Create default files based on type
        const defaultFiles: Record<string, Record<string, string>> = {
            'presidential': {
                'candidates_cache.json': '[]',
                'poll_cache.json': '[]',
                'poll_cache_r2.json': '[]',
                'detailed_polls_cache.json': '[]',
                'prompt_perplexity_candidates.txt': 'Default prompt for candidates',
                'prompt_perplexity_r1.txt': 'Default prompt for R1',
                'prompt_perplexity_r2.txt': 'Default prompt for R2',
                'prompt_perplexity_detailed_polls.txt': 'Default prompt for detailed polls'
            },
            'legislative': {
                'partis_cache.json': '[]',
                'sondages_cache.json': '[]',
                'detailed_polls_cache.json': '[]',
                'prompt_perplexity_partis.txt': 'Default prompt for partis',
                'prompt_perplexity_sieges.txt': 'Default prompt for sieges',
                'prompt_perplexity_detailed_polls.txt': 'Default prompt for detailed polls'
            },
            'municipal': {
                'cities_cache.json': '[]',
                'maires_cache.json': '[]',
                'map_cache.json': '[]',
                'detailed_polls_cache.json': '[]',
                'prompt_perplexity_cities.txt': 'Prompt pour les tendances par ville (top villes)',
                'prompt_perplexity_maires.txt': 'Prompt pour les profils des candidats maires',
                'prompt_perplexity_map.txt': 'Prompt pour peupler la carte interactive avec les latitudes et longitudes',
                'prompt_perplexity_detailed_polls.txt': 'Prompt pour les sondages historiques'
            }
        };

        const filesToCreate = defaultFiles[election.type as string] || {};
        for (const [filename, content] of Object.entries(filesToCreate)) {
            await writeFile(path.join(String(election.id), filename), String(content));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
