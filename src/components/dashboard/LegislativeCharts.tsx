import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface LegislativeChartsProps {
    loadingPolls?: boolean;
    loadingPollsR2: boolean;
    latestPollData?: any[];
    secondRoundData: any[];
    pollUpdate?: string;
    r2Update: string;
    secondRoundTitle?: string;
}

export function LegislativeCharts({
    loadingPollsR2,
    secondRoundData,
    r2Update,
}: LegislativeChartsProps) {
    return (
        <Card className="shadow-md border-zinc-200 overflow-hidden bg-white">
            <div className="h-1.5 bg-zinc-900 w-full" />
            <CardHeader className="border-b border-zinc-50 pb-4">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <CardTitle className="text-2xl font-black tracking-tighter uppercase">Projection de l'Hémicycle</CardTitle>
                        <CardDescription className="text-zinc-500 font-medium text-base">
                            Répartition des 577 sièges à l'Assemblée Nationale
                        </CardDescription>
                    </div>
                    {r2Update && (
                        <div className="text-[10px] bg-zinc-100 text-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 font-black uppercase tracking-wider">
                            Dernière Projection : {r2Update}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-6 pb-8 items-center flex flex-col">
                <div className="h-[250px] w-full max-w-2xl mx-auto relative">
                    {loadingPollsR2 ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
                        </div>
                    ) : secondRoundData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart margin={{ bottom: 0 }}>
                                <Pie
                                    data={[...secondRoundData].sort((a, b) => {
                                        const orders: Record<string, number> = {
                                            "Extrême-Gauche": 1,
                                            "Gauche": 2,
                                            "Écologie": 3,
                                            "Centre": 4,
                                            "Droite": 5,
                                            "Extrême-Droite": 6
                                        };
                                        return (orders[a.orientation] || 10) - (orders[b.orientation] || 10);
                                    })}
                                    cx="50%"
                                    cy="95%"
                                    startAngle={180}
                                    endAngle={0}
                                    innerRadius="65%"
                                    outerRadius="100%"
                                    paddingAngle={1}
                                    dataKey="score"
                                    stroke="none"
                                >
                                    {[...secondRoundData].sort((a, b) => {
                                        const orders: Record<string, number> = {
                                            "Extrême-Gauche": 1,
                                            "Gauche": 2,
                                            "Écologie": 3,
                                            "Centre": 4,
                                            "Droite": 5,
                                            "Extrême-Droite": 6
                                        };
                                        return (orders[a.orientation] || 10) - (orders[b.orientation] || 10);
                                    }).map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity outline-none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                    formatter={(value: any, name: any, props: any) => [
                                        <span key="score" className="font-black text-lg">{value} sièges</span>,
                                        <span key="name" className="text-xs uppercase font-bold text-zinc-400">{props.payload.fullName || props.payload.name}</span>
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50">
                            <p className="text-zinc-400 font-bold uppercase tracking-wider text-sm">Données indisponibles</p>
                        </div>
                    )}
                </div>

                {!loadingPollsR2 && secondRoundData.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-6">
                        {[...secondRoundData].sort((a, b) => {
                            const orders: Record<string, number> = {
                                "Extrême-Gauche": 1,
                                "Gauche": 2,
                                "Écologie": 3,
                                "Centre": 4,
                                "Droite": 5,
                                "Extrême-Droite": 6
                            };
                            const orderA = orders[a.orientation] || 10;
                            const orderB = orders[b.orientation] || 10;
                            if (orderA !== orderB) return orderA - orderB;
                            return b.score - a.score;
                        }).map((entry: any, index: number) => (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 bg-white shadow-sm">
                                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                                <div className="min-w-0">
                                    <div className="text-[10px] font-black text-zinc-400 uppercase truncate leading-none mb-1">{entry.name}</div>
                                    <div className="text-lg font-black text-zinc-900 leading-none">{entry.score} <span className="text-[10px] opacity-40 ml-0.5">SIÈGES</span></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
