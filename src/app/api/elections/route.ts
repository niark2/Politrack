import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
    const filePath = path.join(process.cwd(), 'data', 'elections.json');

    if (fs.existsSync(filePath)) {
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            return NextResponse.json(JSON.parse(data));
        } catch (e) {
            console.error("Error reading elections list", e);
            return NextResponse.json({ error: "Failed to load elections" }, { status: 500 });
        }
    }

    // Default if file doesn't exist
    return NextResponse.json([
        {
            "id": "france-pres-2027",
            "name": "Présidentielle 2027",
            "country": "FR",
            "flag": "🇫🇷",
            "targetDate": "2027-04-11",
            "isDefault": true
        }
    ]);
}
