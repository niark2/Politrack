import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface DetailedPollsProps {
    loadingDetailedPolls: boolean;
    detailedPolls: any[];
    detailedPollsUpdate: string;
    electionType: string;
    latestPollData: any[];
}

export function DetailedPolls({
    loadingDetailedPolls,
    detailedPolls,
    detailedPollsUpdate,
    electionType,
    latestPollData,
}: DetailedPollsProps) {
    const isLegislative = electionType === 'legislative';

    return (
        <div className="grid grid-cols-1 gap-8">
            {loadingDetailedPolls ? (
                <div className="col-span-full flex justify-center p-20">
                    <Loader2 className="h-10 w-10 animate-spin text-zinc-900" />
                </div>
            ) : detailedPolls.length > 0 ? (
                detailedPolls.map((poll, idx) => (
                    <Card key={idx} className="shadow-md border-zinc-200 overflow-hidden">
                        <div className="h-1 bg-zinc-900 w-full" />
                        <CardHeader className="py-4 px-6 border-b border-zinc-50 bg-white">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                <div>
                                    <CardTitle className="text-lg font-black uppercase tracking-tight leading-tight">
                                        {poll.institute} <span className="text-zinc-400 font-normal">/ {poll.commissioner || poll.city || ""}</span>
                                    </CardTitle>
                                    <CardDescription className="text-xs font-bold mt-1 text-zinc-500">
                                        {poll.date} • {poll.sampleSize || poll.sample || ""}
                                    </CardDescription>
                                </div>
                                {poll.note && (
                                    <div className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded font-bold italic max-w-xs">
                                        Note : {poll.note}
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 bg-white">
                            <div className="h-[400px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        layout="vertical"
                                        data={[...(poll.results || [])].map(r => {
                                            let numericScore = 0;
                                            if (typeof r.score === 'string') {
                                                const parts = r.score.split(/[–-]/).map((p: string) => parseInt(p.trim()));
                                                numericScore = parts.length === 2 ? (parts[0] + parts[1]) / 2 : (parseInt(r.score) || 0);
                                            } else {
                                                numericScore = r.score;
                                            }
                                            return { ...r, numericScore };
                                        }).sort((a, b) => b.numericScore - a.numericScore)}
                                        margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                                        <XAxis type="number" hide domain={[0, isLegislative ? 300 : 50]} />
                                        <YAxis
                                            dataKey={(r) => r.fullName || r.name}
                                            type="category"
                                            axisLine={false}
                                            tickLine={false}
                                            fontSize={11}
                                            fontWeight="900"
                                            width={150}
                                            tick={{ fill: '#0f172a' }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                            formatter={(value: any, name: any, props: any) => [
                                                <span key="score" className="font-black text-lg">{props.payload.score}{isLegislative ? "" : "%"}</span>,
                                                <span key="name" className="text-xs uppercase font-bold text-zinc-400">{props.payload.fullName || props.payload.name}</span>
                                            ]}
                                            labelStyle={{ display: 'none' }}
                                        />
                                        <Bar dataKey="numericScore" radius={[0, 4, 4, 0]} maxBarSize={30}>
                                            {(poll.results || []).map((entry: any, i: number) => {
                                                const rawName = entry.fullName || entry.name || "";
                                                const entryName = rawName.toLowerCase();
                                                const candidate = latestPollData.find(p => {
                                                    const pName = (p.fullName || p.name || "").toLowerCase();
                                                    return pName.includes(entryName) || entryName.includes(pName);
                                                });

                                                let color = entry.color || candidate?.color;

                                                if (!color && entryName) {
                                                    if (entryName.includes('le pen') || entryName.includes('bardella')) color = '#800080';
                                                    else if (entryName.includes('philippe') || entryName.includes('attal') || entryName.includes('darmanin')) color = '#1e40af';
                                                    else if (entryName.includes('mélenchon') || entryName.includes('bompard') || entryName.includes('panot')) color = '#cc2443';
                                                    else if (entryName.includes('faure') || entryName.includes('hollande')) color = '#e61973';
                                                    else if (entryName.includes('tondelier') || entryName.includes('rousseaux')) color = '#00b25d';
                                                    else if (entryName.includes('retailleau') || entryName.includes('bertrand') || entryName.includes('wauquiez')) color = '#3b82f6';
                                                    else if (entryName.includes('zemmour') || entryName.includes('maréchal')) color = '#004792';
                                                    else if (entryName.includes('glucksmann')) color = '#fcd34d';
                                                    else color = '#cbd5e1';
                                                }

                                                return <Cell key={`cell-detailed-${idx}-${i}`} fill={color} />;
                                            })}
                                            <LabelList dataKey="score" position="right" formatter={(val: any) => isLegislative ? val : `${val}%`} style={{ fill: '#0f172a', fontWeight: '900', fontSize: '12px' }} />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Aucun sondage détaillé disponible pour le moment</p>
                </div>
            )}
        </div>
    );
}
