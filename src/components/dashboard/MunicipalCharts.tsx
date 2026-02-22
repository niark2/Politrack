"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, MapPin, Trophy } from "lucide-react";

import { MapCity } from "@/types";

interface MunicipalChartsProps {
    loadingPolls: boolean;
    latestPollData: MapCity[];
    pollUpdate: string;
}

export function MunicipalCharts({
    loadingPolls,
    latestPollData,
    pollUpdate,
}: MunicipalChartsProps) {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 4;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = latestPollData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(latestPollData.length / itemsPerPage);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <Card className="shadow-md border-zinc-200 overflow-hidden">
                <div className="h-1 bg-zinc-900 w-full" />
                <CardHeader className="border-b border-zinc-50">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight uppercase flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-zinc-900" />
                                Tendances par Grande Ville
                            </CardTitle>
                            <CardDescription className="text-zinc-500 font-medium">
                                Focus sur les points de bascule électoraux
                            </CardDescription>
                        </div>
                        {pollUpdate && (
                            <div className="hidden sm:block text-[10px] bg-zinc-100 text-zinc-800 px-2 py-1 rounded-md border border-zinc-200 font-black uppercase tracking-wider">
                                MAJ : {pollUpdate}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    {loadingPolls ? (
                        <div className="h-[400px] flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentData.length > 0 ? (
                                    currentData.map((city, idx) => (
                                        <div key={idx} className="p-4 rounded-xl border-2 border-zinc-300 bg-white hover:border-zinc-900 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="space-y-0.5">
                                                    <h4 className="font-black text-zinc-900 uppercase tracking-tighter text-xl leading-none">{city.name || city.cityName}</h4>
                                                    <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.15em]">{city.region || "France"}</p>
                                                </div>
                                            </div>

                                            {/* Highlighted Favorite */}
                                            <div className="mb-4 p-2.5 bg-zinc-900 text-white rounded-lg shadow-md shadow-zinc-200/30">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <Trophy className="h-2.5 w-2.5 text-yellow-400" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Tête de course</span>
                                                </div>
                                                <div className="text-xs font-black uppercase tracking-tight leading-tight">
                                                    {city.favorite || "N/A"}
                                                </div>
                                            </div>

                                            {/* Simplified Trend Bar */}
                                            <div className="space-y-3 mt-auto">
                                                <div className="flex justify-between items-end px-1">
                                                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Rapport de force</span>
                                                    <span className="text-[8px] font-black text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded uppercase">Estimation</span>
                                                </div>
                                                <div className="space-y-2">
                                                    {city.scores?.map((s, i: number) => (
                                                        <div key={i} className="space-y-1">
                                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tight px-0.5">
                                                                <span className="text-zinc-600 truncate max-w-[75%]">{s.label}</span>
                                                                <span className="text-zinc-900">{s.value}%</span>
                                                            </div>
                                                            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
                                                                <div
                                                                    className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                                                                    style={{
                                                                        width: `${s.value}%`,
                                                                        backgroundColor: s.color || '#cbd5e1'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                                        <MapPin className="h-12 w-12 text-zinc-200 mx-auto mb-4" />
                                        <p className="text-zinc-400 font-black uppercase tracking-widest text-sm">Données géographiques en attente</p>
                                        <p className="text-zinc-400 text-xs mt-1">Éditez cities_cache.json pour ajouter des données</p>
                                    </div>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-4 border-t border-zinc-100">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg border border-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 transition-all"
                                    >
                                        Précédent
                                    </button>
                                    <div className="flex gap-1">
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCurrentPage(i + 1)}
                                                className={`w-8 h-8 rounded-lg text-xs font-black flex items-center justify-center transition-all ${currentPage === i + 1 ? "bg-zinc-900 text-white shadow-md" : "text-zinc-500 hover:bg-zinc-100"}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 text-xs font-black uppercase tracking-widest rounded-lg border border-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-zinc-50 transition-all"
                                    >
                                        Suivant
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
