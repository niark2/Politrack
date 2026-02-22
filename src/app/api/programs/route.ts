import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const countryParam = searchParams.get('country');
    const electionParam = searchParams.get('election');

    if (countryParam && !/^[a-zA-Z0-9_-]+$/.test(countryParam)) {
        return NextResponse.json({ error: 'Invalid country identifier' }, { status: 400 });
    }
    if (electionParam && !/^[a-zA-Z0-9_-]+$/.test(electionParam)) {
        return NextResponse.json({ error: 'Invalid election identifier' }, { status: 400 });
    }

    let country = countryParam;

    // If no country but election is provided, look it up
    if (!country && electionParam) {
        try {
            const electionsPath = path.join(process.cwd(), 'data', 'elections.json');
            if (fs.existsSync(electionsPath)) {
                const elections = JSON.parse(fs.readFileSync(electionsPath, 'utf-8'));
                const election = elections.find((e: any) => e.id === electionParam);
                if (election) country = election.country;
            }
        } catch (e) {
            console.error("Error looking up election country", e);
        }
    }

    // Default to FR if nothing found (or handle as error)
    if (!country) country = 'FR';

    const programsDir = path.join(process.cwd(), 'data', 'programs', country);
    const legacyPath = path.join(process.cwd(), 'data', 'programs', `${country}.json`);

    // 1. Try multi-file directory approach
    if (fs.existsSync(programsDir) && fs.lstatSync(programsDir).isDirectory()) {
        try {
            const files = fs.readdirSync(programsDir);
            const combinedPrograms: any[] = [];
            let latestUpdate = "N/A";

            for (const file of files) {
                if (file.endsWith('.json')) {
                    const filePath = path.join(programsDir, file);
                    const fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                    // Add to programs array
                    combinedPrograms.push(fileContent);

                    // Track latest update date
                    if (fileContent.lastUpdate && (latestUpdate === "N/A" || fileContent.lastUpdate > latestUpdate)) {
                        latestUpdate = fileContent.lastUpdate;
                    }
                }
            }

            if (combinedPrograms.length > 0) {
                return NextResponse.json({
                    lastUpdate: latestUpdate,
                    programs: combinedPrograms
                });
            }
        } catch (e) {
            console.error(`Error reading program directory for country ${country}`, e);
        }
    }

    // 2. Fallback to legacy single file
    if (fs.existsSync(legacyPath)) {
        try {
            const cacheRaw = fs.readFileSync(legacyPath, 'utf-8');
            const cache = JSON.parse(cacheRaw);
            return NextResponse.json(cache);
        } catch (e) {
            console.error(`Error reading program data for country ${country}`, e);
        }
    }

    return NextResponse.json({
        lastUpdate: "N/A",
        programs: []
    });
}
