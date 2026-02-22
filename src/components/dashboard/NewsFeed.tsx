import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Newspaper } from "lucide-react";

interface NewsFeedProps {
    loadingNews: boolean;
    newsData: any[];
}

export function NewsFeed({ loadingNews, newsData }: NewsFeedProps) {
    return (
        <Card className="shadow-md border-zinc-200 h-[600px] bg-white flex flex-col">
            <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                    Direct PoliTrack
                </span>
                <Newspaper className="h-4 w-4 opacity-50" />
            </div>
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-black uppercase tracking-tight">Dernières Dépêches</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-2 space-y-2">
                    {loadingNews ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-6 w-6 animate-spin text-zinc-900" />
                        </div>
                    ) : newsData.length > 0 ? (
                        newsData.map((news) => (
                            <a href={news.link} target="_blank" rel="noopener noreferrer" key={news.id} className="group cursor-pointer block hover:bg-zinc-50 p-3 rounded-lg transition-all border border-transparent hover:border-zinc-100">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border"
                                        style={{
                                            color: news.sourceColor === 'red-600' ? '#dc2626' : news.sourceColor === 'blue-800' ? '#18181b' : news.sourceColor === 'yellow-500' ? '#eab308' : '#18181b',
                                            borderColor: 'currentColor'
                                        }}>
                                        {news.source}
                                    </span>
                                    <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{news.time}</span>
                                </div>
                                <p className="text-[13px] font-bold text-zinc-800 leading-snug group-hover:text-black transition-colors line-clamp-2">
                                    {news.title}
                                </p>
                            </a>
                        ))
                    ) : (
                        <p className="text-zinc-400 text-xs font-medium italic text-center py-4">Aucune actualité récente.</p>
                    )}
                </div>
            </CardContent>
            <div className="p-4 border-t border-zinc-50 bg-zinc-50/50 text-center shrink-0">
                <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-black transition-colors">Voir toutes les actualités</button>
            </div>
        </Card>
    );
}
