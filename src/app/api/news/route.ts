import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

// List of free major French political RSS feeds
const RSS_FEEDS = [
    { source: "Le Monde", url: "https://www.lemonde.fr/politique/rss_full.xml", color: "blue-600" },
    { source: "Le Figaro", url: "https://www.lefigaro.fr/rss/figaro_politique.xml", color: "blue-800" },
    { source: "France Info", url: "https://www.francetvinfo.fr/politique.rss", color: "yellow-500" },
    { source: "Mediapart", url: "https://www.mediapart.fr/articles/feed", color: "red-600" }
];

// Keywords that trigger election relevance
const ELECTION_KEYWORDS = [
    'élection', 'présidentielle', 'scrutin', 'sondage', 'candidat', 'campagne',
    'vote', 'ballotage', 'enquêtes', 'intentions de vote', '2027', '2026',
    'municipales', 'premier tour', 'second tour', 'parrainages'
];

export interface NewsItem {
    id: string;
    source: string;
    sourceColor: string;
    title: string;
    link: string;
    time: string;
    pubDateUnix: number;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const election = searchParams.get('election') || 'france-pres-2027';

    if (!/^[a-zA-Z0-9_-]+$/.test(election)) {
        return NextResponse.json({ error: 'Invalid election identifier' }, { status: 400 });
    }

    const cacheDir = path.join(process.cwd(), 'data', '.cache');
    const cacheFile = path.join(cacheDir, `news_${election}.json`);
    const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

    try {
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        if (fs.existsSync(cacheFile)) {
            const stats = fs.statSync(cacheFile);
            if (Date.now() - stats.mtimeMs < CACHE_DURATION) {
                const cachedData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
                return NextResponse.json(cachedData);
            }
        }
    } catch (e) {
        // ignore cache read error
    }

    try {
        const parser = new Parser();
        let allNews: NewsItem[] = [];

        // Load candidates to use their names as filters
        let candidateNames: string[] = [];
        try {
            const electionDir = path.join(process.cwd(), 'data', election);
            const descriptivePath = path.join(electionDir, 'partis_cache.json');
            const technicalPath = path.join(electionDir, 'candidates_cache.json');
            const cachePath = fs.existsSync(descriptivePath) ? descriptivePath : technicalPath;

            if (fs.existsSync(cachePath)) {
                const data = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
                if (data.candidates) {
                    candidateNames = data.candidates.map((c: any) => c.fullName.toLowerCase());
                }
            }
        } catch (e) {
            console.error(`Could not load candidates for filtering for ${election}`, e);
        }

        // Fetch all RSS feeds in parallel
        const feedPromises = RSS_FEEDS.map(async (feed) => {
            try {
                const result = await parser.parseURL(feed.url);
                if (result.items) {
                    result.items.forEach((item, index) => {
                        // We take more items initially to have enough after filtering
                        if (index < 15 && item.title && item.link) {
                            const titleLower = item.title.toLowerCase();
                            const contentSnippetLower = (item.contentSnippet || "").toLowerCase();

                            // Check for election keywords or candidate names
                            const isElectionRelated = ELECTION_KEYWORDS.some(kw => titleLower.includes(kw) || contentSnippetLower.includes(kw)) ||
                                candidateNames.some(name => titleLower.includes(name) || contentSnippetLower.includes(name));

                            if (isElectionRelated) {
                                const pubDate = new Date(item.isoDate || item.pubDate || Date.now());

                                allNews.push({
                                    id: `${feed.source}-${index}-${pubDate.getTime()}`,
                                    source: feed.source,
                                    sourceColor: feed.color,
                                    title: item.title,
                                    link: item.link,
                                    time: `${pubDate.getHours()}h${pubDate.getMinutes().toString().padStart(2, '0')}`,
                                    pubDateUnix: pubDate.getTime()
                                });
                            }
                        }
                    });
                }
            } catch (feedError) {
                console.warn(`Could not fetch RSS for ${feed.source}`, feedError);
            }
        });

        await Promise.all(feedPromises);

        // Sort all news by most recent (highest pubDateUnix)
        allNews.sort((a, b) => b.pubDateUnix - a.pubDateUnix);

        // Deduplicate by title to avoid the same news from multiple feeds
        const seenTitles = new Set();
        const uniqueNews = allNews.filter(item => {
            if (seenTitles.has(item.title)) return false;
            seenTitles.add(item.title);
            return true;
        });

        // Return the top 10 combined most recent articles
        const result = uniqueNews.slice(0, 10);

        try {
            fs.writeFileSync(cacheFile, JSON.stringify(result));
        } catch (e) { }

        return NextResponse.json(result);

    } catch (error: any) {
        console.error("News API error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

