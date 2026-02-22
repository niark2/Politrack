import { useState, useEffect } from "react";
import { getElectionConfig } from "@/config/election";
import { Election, Candidate, Poll, NewsItem, MapCity, DetailedPoll, Program } from "@/types";

export function useDashboardData() {
    const [elections, setElections] = useState<Election[]>([]);
    const [selectedElection, setSelectedElection] = useState<Election | null>(null);

    // States
    const [loadingPolls, setLoadingPolls] = useState(true);
    const [loadingNews, setLoadingNews] = useState(true);
    const [latestPollData, setLatestPollData] = useState<Poll[]>([]);
    const [secondRoundData, setSecondRoundData] = useState<Poll[]>([]);
    const [newsData, setNewsData] = useState<NewsItem[]>([]);
    const [lastRefresh, setLastRefresh] = useState<string>("Jamais");
    const [loadingPollsR2, setLoadingPollsR2] = useState(true);
    const [loadingCandidates, setLoadingCandidates] = useState(true);
    const [secondRoundTitle, setSecondRoundTitle] = useState<string>("Second Tour – Intentions de vote");
    const [loadingDetailedPolls, setLoadingDetailedPolls] = useState(true);
    const [pollUpdate, setPollUpdate] = useState<string>("");
    const [r2Update, setR2Update] = useState<string>("");
    const [declaredCandidates, setDeclaredCandidates] = useState<Candidate[]>([]);
    const [candidatesUpdate, setCandidatesUpdate] = useState<string>("");
    const [detailedPolls, setDetailedPolls] = useState<DetailedPoll[]>([]);
    const [detailedPollsUpdate, setDetailedPollsUpdate] = useState<string>("");
    const [mapData, setMapData] = useState<MapCity[]>([]);
    const [loadingPrograms, setLoadingPrograms] = useState(true);
    const [programsData, setProgramsData] = useState<Program[]>([]);
    const [programsUpdate, setProgramsUpdate] = useState<string>("");

    useEffect(() => {
        async function fetchElections() {
            try {
                const res = await fetch('/api/elections');
                if (res.ok) {
                    const data = await res.json();
                    setElections(data);
                    const defaultElection = data.find((e: Election) => e.isDefault) || data[0];
                    setSelectedElection(defaultElection);
                }
            } catch (err) { console.error("Failed fetching elections", err); }
        }
        fetchElections();
    }, []);

    useEffect(() => {
        if (!selectedElection) return;

        setLoadingPolls(true);
        setLoadingNews(true);
        setLoadingPollsR2(true);
        setLoadingCandidates(true);
        setLoadingDetailedPolls(true);
        setLoadingPrograms(true);

        const electionId = selectedElection.id;

        async function fetchPolls() {
            try {
                const res = await fetch(`/api/polls?election=${electionId}&t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    setLatestPollData(data.candidates || []);
                    setPollUpdate(data.lastUpdate || "");
                    setLastRefresh(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
                }
            } catch (err) { console.error("Failed fetching polls", err); }
            finally { setLoadingPolls(false); }
        }

        async function fetchNews() {
            try {
                const res = await fetch(`/api/news?election=${electionId}&t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    setNewsData(data);
                }
            } catch (err) { console.error("Failed fetching news", err); }
            finally { setLoadingNews(false); }
        }

        async function fetchPollsR2() {
            try {
                const res = await fetch(`/api/polls-r2?election=${electionId}&t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.candidates) {
                        setSecondRoundData(data.candidates);
                        setSecondRoundTitle(`Second Tour – ${data.duel || "Simulation Duel"}`);
                        setR2Update(data.lastUpdate || "");
                    } else {
                        setSecondRoundData([]);
                    }
                }
            } catch (err) { console.error("Failed fetching r2 polls", err); }
            finally { setLoadingPollsR2(false); }
        }

        async function fetchCandidates() {
            try {
                const res = await fetch(`/api/candidates?election=${electionId}&t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    setDeclaredCandidates(data.candidates || []);
                    setCandidatesUpdate(data.lastUpdate || "");
                }
            } catch (err) { console.error("Failed fetching candidates", err); }
            finally { setLoadingCandidates(false); }
        }

        async function fetchDetailedPolls() {
            try {
                const res = await fetch(`/api/detailed-polls?election=${electionId}&t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    setDetailedPolls(data.polls || []);
                    setDetailedPollsUpdate(data.lastUpdate || "");
                }
            } catch (err) { console.error("Failed fetching detailed polls", err); }
            finally { setLoadingDetailedPolls(false); }
        }

        async function fetchMapData() {
            if (selectedElection?.type !== 'municipal') return;
            try {
                const res = await fetch(`/api/map?election=${electionId}&t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    setMapData(data.cities || []);
                }
            } catch (err) { console.error("Failed fetching map data", err); }
        }

        async function fetchPrograms() {
            try {
                const country = selectedElection?.country || 'FR';
                const res = await fetch(`/api/programs?country=${country}&t=${Date.now()}`);
                if (res.ok) {
                    const data = await res.json();
                    setProgramsData(data.programs || []);
                    setProgramsUpdate(data.lastUpdate || "");
                }
            } catch (err) { console.error("Failed fetching programs", err); }
            finally { setLoadingPrograms(false); }
        }

        fetchPolls();
        fetchNews();
        fetchPollsR2();
        fetchCandidates();
        fetchDetailedPolls();
        fetchMapData();
        fetchPrograms();
    }, [selectedElection]);

    const config = getElectionConfig(selectedElection?.type);

    const getEnrichedCandidates = () => {
        return declaredCandidates.map(c => {
            // Municipal data support: map city object to candidate format if needed
            if (c.cityName) {
                return {
                    ...c,
                    fullName: c.cityName,
                    party: c.region || "France",
                    status: c.favorite ? `Favori: ${c.favorite.split('(')[0].trim()}` : "En attente",
                    score: c.scores?.[0]?.value || 0,
                    color: c.scores?.[0]?.color || "#94a3b8",
                    orientation: "Ville",
                    themes: ["Logement", "Transports", "Sécurité"]
                };
            }

            const pollSource = config.getEnrichedPollSource(latestPollData, secondRoundData);
            const poll = pollSource.find((p: Poll) => {
                const pFull = (p.fullName || p.name || "").toLowerCase();
                const cFull = (c.fullName || "").toLowerCase();
                const cParty = (c.party || "").toLowerCase();
                const pShort = (p.name || "").toLowerCase();

                return (pFull && cFull && (pFull.includes(cFull) || cFull.includes(pFull))) ||
                    (pShort && cParty && cParty.includes(pShort));
            });

            const color = c.color || poll?.color || "#94a3b8";
            let orientation = c.orientation || "Centre";
            let themes = c.themes || ["Économie", "Éducation", "Santé"];

            if (!c.orientation) {
                const party = (c.party || "").toLowerCase();
                if (party.includes("républicains")) {
                    orientation = "Droite";
                    themes = ["Sécurité", "Économie", "Justice"];
                } else if (party.includes("national")) {
                    orientation = "Extrême-Droite";
                    themes = ["Sécurité", "Immigration", "Pouvoir d'achat"];
                } else if (party.includes("écologiste") || party.includes("écologie")) {
                    orientation = "Écologie";
                    themes = ["Écologie", "Social", "Climat"];
                } else if (party.includes("socialiste") || party.includes("l'après") || party.includes("debout !")) {
                    orientation = "Gauche";
                    themes = ["Social", "Pouvoir d'achat", "Services publics"];
                } else if (party.includes("ouvrière") || party.includes("unitaire")) {
                    orientation = "Extrême-Gauche";
                    themes = ["Salaire", "Services publics", "Social"];
                }
            }

            return {
                ...c,
                score: poll?.score,
                color,
                orientation,
                themes
            };
        }).sort((a, b) => (b.score || 0) - (a.score || 0));
    };

    const enrichedCandidates = getEnrichedCandidates();

    return {
        elections,
        selectedElection,
        setSelectedElection,
        loadingPolls,
        loadingNews,
        latestPollData,
        secondRoundData,
        newsData,
        lastRefresh,
        loadingPollsR2,
        loadingCandidates,
        secondRoundTitle,
        loadingDetailedPolls,
        pollUpdate,
        r2Update,
        candidatesUpdate,
        detailedPolls,
        detailedPollsUpdate,
        mapData,
        loadingPrograms,
        programsData,
        programsUpdate,
        config,
        enrichedCandidates
    };
}
