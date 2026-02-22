import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Election } from "@/types";

interface GlobalStatsProps {
    daysRemaining: number;
    selectedElection: Election | null;
    countdownTitle: string;
}

export function GlobalStats({
    daysRemaining,
    selectedElection,
    countdownTitle,
}: GlobalStatsProps) {
    return (
        <div className="grid grid-cols-1 gap-6">
            <Card className="border-none shadow-sm bg-zinc-900 text-white overflow-hidden relative min-h-[100px] flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <TrendingUp className="h-20 w-20" />
                </div>
                <CardContent className="py-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.3em] bg-white/10 px-2 py-1 rounded">
                                {countdownTitle}
                            </span>
                            <div className="text-4xl md:text-5xl font-black tracking-tighter tabular-nums flex items-baseline gap-2">
                                {daysRemaining} <span className="text-xl opacity-30 font-bold uppercase tracking-tight">Jours</span>
                            </div>
                        </div>

                        <p className="text-xs md:text-sm opacity-50 font-medium tracking-tight bg-white/5 px-4 py-2 rounded-full border border-white/10">
                            {selectedElection ? (daysRemaining > 0 ? `Scrutin le ${new Date(selectedElection.targetDate || '').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}` : "Scrutin passé") : "Chargement..."}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
