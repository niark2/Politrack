"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, MapPin, Trophy } from "lucide-react";

interface MunicipalChartsProps {
    loadingPolls: boolean;
    latestPollData: any[];
    pollUpdate: string;
}

export function MunicipalCharts({
    loadingPolls,
    latestPollData,
    pollUpdate,
}: MunicipalChartsProps) {
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {latestPollData.length > 0 ? (
                                latestPollData.map((city, idx) => (
                                    <div key={idx} className="p-6 rounded-2xl border border-zinc-100 bg-white hover:border-zinc-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <h4 className="font-black text-zinc-900 uppercase tracking-tighter text-2xl leading-none">{city.name || city.cityName}</h4>
                                                <p className="text-[10px] text-zinc-400 font-black uppercase tracking-[0.2em]">{city.region || "France"}</p>
                                            </div>
                                        </div>

                                        {/* Highlighted Favorite */}
                                        <div className="mb-6 p-3 bg-zinc-900 text-white rounded-xl shadow-lg shadow-zinc-200/50">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Trophy className="h-3 w-3 text-yellow-400" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Tête de course</span>
                                            </div>
                                            <div className="text-sm font-black uppercase tracking-tight leading-tight">
                                                {city.favorite || "N/A"}
                                            </div>
                                        </div>

                                        {/* Simplified Trend Bar */}
                                        <div className="space-y-4 mt-auto">
                                            <div className="flex justify-between items-end px-1">
                                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Rapport de force</span>
                                                <span className="text-[10px] font-black text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded uppercase">Estimation</span>
                                            </div>
                                            <div className="space-y-3">
                                                {city.scores?.map((s: any, i: number) => (
                                                    <div key={i} className="space-y-1">
                                                        <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-tight px-1">
                                                            <span className="text-zinc-600 truncate max-w-[80%]">{s.label}</span>
                                                            <span className="text-zinc-900">{s.value}%</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden shadow-inner">
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
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
