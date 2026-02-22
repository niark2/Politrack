import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface PresidentialChartsProps {
    loadingPolls: boolean;
    loadingPollsR2: boolean;
    latestPollData: any[];
    secondRoundData: any[];
    pollUpdate: string;
    r2Update: string;
    secondRoundTitle: string;
}

export function PresidentialCharts({
    loadingPolls,
    loadingPollsR2,
    latestPollData,
    secondRoundData,
    pollUpdate,
    r2Update,
    secondRoundTitle,
}: PresidentialChartsProps) {
    return (
        <>
            {/* Main Chart Part - 1st Round */}
            <Card className="shadow-md border-zinc-200">
                <CardHeader className="border-b border-zinc-50">
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight uppercase">Intentions de vote - 1er Tour</CardTitle>
                            <CardDescription className="text-zinc-500 font-medium">
                                Synthèse agrégée des derniers sondages publiés (Ifop, Ipsos, etc.)
                            </CardDescription>
                        </div>
                        {pollUpdate && (
                            <div className="text-[10px] bg-zinc-100 text-zinc-800 px-2 py-1 rounded-md border border-zinc-200 font-black">
                                MAJ : {pollUpdate}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="h-[380px] w-full">
                        {loadingPolls ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
                            </div>
                        ) : latestPollData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={latestPollData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 50 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={({ x, y, payload }) => (
                                            <g transform={`translate(${x},${y})`}>
                                                <text x={0} y={0} dy={16} textAnchor="end" fill="#64748b" fontSize={11} fontWeight="700" transform="rotate(-45)">
                                                    {payload.value}
                                                </text>
                                            </g>
                                        )}
                                        interval={0}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 'bold' }}
                                        unit="%"
                                        domain={[0, 40]}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                        formatter={(value: any, name: any, props: any) => [
                                            <span key="score" className="font-black text-lg">{value}%</span>,
                                            <span key="name" className="text-xs uppercase font-bold text-zinc-400">{props.payload.fullName || props.payload.name}</span>
                                        ]}
                                        labelStyle={{ display: 'none' }}
                                    />
                                    <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={50}>
                                        {latestPollData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color || '#e2e8f0'} className="hover:opacity-80 transition-opacity" />
                                        ))}
                                        <LabelList dataKey="score" position="top" formatter={(val: any) => `${val}%`} style={{ fill: '#0f172a', fontWeight: '900', fontSize: '13px' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                                <p className="text-zinc-400 font-bold uppercase tracking-wider text-sm">Données indisponibles</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Second Round Part */}
            <Card className="shadow-md border-zinc-200 overflow-hidden mt-8">
                <div className="h-1 bg-zinc-900 w-full" />
                <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                        <div>
                            <CardTitle className="text-xl font-black tracking-tight uppercase">{secondRoundTitle}</CardTitle>
                            <CardDescription className="text-zinc-500 font-medium">
                                Projection statistique du duel final
                            </CardDescription>
                        </div>
                        {r2Update && (
                            <div className="text-[10px] bg-zinc-100 text-zinc-800 px-2 py-1 rounded border border-zinc-200 font-black">
                                MAJ : {r2Update}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full mt-4">
                        {loadingPollsR2 ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-zinc-900" />
                            </div>
                        ) : secondRoundData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={[...secondRoundData].sort((a, b) => b.score - a.score)}
                                    margin={{ top: 5, right: 60, left: 100, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide domain={[0, 100]} />
                                    <YAxis
                                        dataKey={(r: any) => r.fullName || r.name}
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        fontSize={12}
                                        fontWeight="bold"
                                        width={90}
                                        tick={{ fill: '#475569' }}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#f8fafc' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        formatter={(val: any) => [`${val}%`, "Intentions"]}
                                    />
                                    <Bar dataKey="score" radius={[0, 6, 6, 0]} maxBarSize={40}>
                                        {secondRoundData.map((entry, index) => (
                                            <Cell key={`cell-r2-${index}`} fill={entry.color || '#94a3b8'} />
                                        ))}
                                        <LabelList dataKey="score" position="right" formatter={(val: any) => `${val}%`} style={{ fill: '#0f172a', fontWeight: '900' }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                                <p className="text-zinc-400 font-bold uppercase tracking-wider text-sm">Analyse en cours</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}
