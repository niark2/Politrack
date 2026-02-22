import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeCheck, User, Shield, Leaf, Banknote, Landmark, Timer } from "lucide-react";

interface CandidateCardProps {
    fullName: string;
    party: string;
    status: string;
    score?: number;
    poidsElectoral?: number | string;
    poidsLabel?: string;
    color?: string;
    dateOfAnnouncement?: string;
    themes?: string[];
    orientation?: string;
}

export const CandidateCard = ({
    fullName,
    party,
    status,
    score,
    poidsElectoral,
    poidsLabel,
    color = "#94a3b8",
    dateOfAnnouncement,
    themes = ["Économie", "Éducation", "Santé"],
    orientation = "Non défini"
}: CandidateCardProps) => {
    // Determine which weight to use: Perplexity's or the automated score-based one
    const getNumericDisplayWeight = () => {
        if (typeof poidsElectoral === "number") return poidsElectoral;
        if (typeof poidsElectoral === "string") {
            const match = poidsElectoral.match(/(\d+)\s*%/);
            if (match) return parseInt(match[1], 10);
        }
        if (score !== undefined) return score;

        const label = poidsLabel || (score && score > 20 ? 'Fort' : score && score > 10 ? 'Moyen' : 'Émergent');
        switch (label.toLowerCase()) {
            case "majeur": case "fort": return 80;
            case "significatif": case "moyen": return 50;
            case "minoritaire": case "émergent": return 20;
            case "marginal": return 5;
            default: return 0;
        }
    };

    const displayWeight = getNumericDisplayWeight();
    const displayLabel = poidsLabel || (score ? (score > 20 ? 'Fort' : score > 10 ? 'Moyen' : 'Émergent') : 'Émergent');

    return (
        <Card className="overflow-hidden border-zinc-200 transition-all hover:shadow-lg group" style={{ borderColor: color + '20' }}>
            <div
                className="h-2 w-full"
                style={{ backgroundColor: color }}
            />
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <CardTitle
                            className="text-xl font-bold text-zinc-900 transition-colors"
                            style={{ color: 'var(--candidate-color)' }}
                        >
                            <span className="group-hover:opacity-80 transition-opacity" style={{ color: color }}>
                                {fullName}
                            </span>
                        </CardTitle>
                        <CardDescription className="font-semibold text-zinc-600 flex items-center gap-1">
                            <Landmark className="h-3 w-3" />
                            {party}
                        </CardDescription>
                    </div>
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-tight`}
                        style={{
                            backgroundColor: color + '15',
                            color: color,
                            border: `1px solid ${color}30`
                        }}
                    >
                        {status}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Stats Row */}
                <div className="space-y-4 bg-zinc-50/50 p-4 rounded-xl border border-zinc-100">
                    {/* Influence Row */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-widest">Influence</span>
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-tight bg-zinc-100 px-1.5 py-0.5 rounded">
                                {displayLabel}
                            </span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-200 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{
                                    width: `${displayWeight}%`,
                                    backgroundColor: color
                                }}
                            />
                        </div>
                    </div>

                    {/* Position Row */}
                    <div className="flex justify-between items-center pt-3 border-t border-zinc-200/50">
                        <span className="text-[10px] text-zinc-400 uppercase font-extrabold tracking-widest italic">Position</span>
                        <span className="text-[11px] font-bold text-zinc-700 px-2.5 py-1 bg-white border border-zinc-200 rounded-lg shadow-sm">
                            {orientation}
                        </span>
                    </div>
                </div>

                {/* Themes */}
                <div className="space-y-2">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider">Thèmes de campagne</p>
                    <div className="flex flex-wrap gap-1.5">
                        {themes.map((theme, i) => (
                            <span key={i} className="text-[10px] bg-white border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded shadow-sm font-bold uppercase tracking-tight">
                                {theme}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Date / Info */}
                <div className="flex items-center gap-2 pt-2 text-zinc-400">
                    <Timer className="h-3 w-3" />
                    <span className="text-[10px]">Annonce : {dateOfAnnouncement || "Inconnue"}</span>
                </div>
            </CardContent>
        </Card>
    );
};
