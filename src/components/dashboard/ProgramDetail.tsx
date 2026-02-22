"use client";

import React from "react";
import {
    ChevronLeft,
    BookOpen,
    ChevronRight,
    Leaf,
    HeartPulse,
    Wallet,
    Scale,
    Globe2,
    Fingerprint,
    Landmark
} from "lucide-react";
import { Program, ProgramCategory } from "@/types";

interface ProgramDetailProps {
    program: Program;
    onBack: () => void;
}

// Normalize string: remove accents and lowercase for robust matching
const normalize = (str: string) =>
    str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

const getCategoryIcon = (categoryName: string) => {
    const n = normalize(categoryName);

    if (n.includes("economie") || n.includes("achat")) return Wallet;
    if (n.includes("ecologie") || n.includes("climat") || n.includes("energie")) return Leaf;
    if (n.includes("immigration")) return Fingerprint;
    if (n.includes("securite") || n.includes("justice")) return Scale;
    if (n.includes("social") || n.includes("sante") || n.includes("education")) return HeartPulse;
    if (n.includes("europe") || n.includes("international")) return Globe2;
    if (n.includes("institution")) return Landmark;

    return BookOpen;
};

export const ProgramDetail: React.FC<ProgramDetailProps> = ({ program, onBack }) => {
    const [activeCategory, setActiveCategory] = React.useState<string>(program.categories[0]?.name || "");

    const currentCategory = program.categories.find(c => c.name === activeCategory) || program.categories[0];

    return (
        <div className="animate-in fade-in duration-500 bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col min-h-[60vh]">
            {/* Simple Compact Header */}
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-zinc-200 rounded-lg transition-colors text-zinc-500"
                        title="Retour"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="h-4 w-px bg-zinc-200 mx-1" />
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm overflow-hidden bg-white border border-zinc-100"
                    >
                        {program.logoUrl ? (
                            <img src={program.logoUrl} alt={program.partyName} className="w-full h-full object-contain p-1" />
                        ) : (
                            <div
                                className="w-full h-full flex items-center justify-center text-white text-[10px] font-black"
                                style={{ backgroundColor: program.color }}
                            >
                                {program.partyId}
                            </div>
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-zinc-900 leading-none">
                            {program.partyName}
                        </h3>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">
                            Base programmatique {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
                <button className="px-3 py-1.5 bg-zinc-900 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider hover:bg-zinc-800 transition-colors">
                    PDF Complet
                </button>
            </div>

            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                {/* Compact Navigation */}
                <div className="w-full md:w-64 border-r border-zinc-100 p-3 bg-zinc-50/30 shrink-0">
                    <div className="space-y-1">
                        {program.categories.map((category, idx) => {
                            const Icon = getCategoryIcon(category.name);
                            const isActive = activeCategory === category.name;

                            return (
                                <button
                                    key={idx}
                                    onClick={() => setActiveCategory(category.name)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive ? 'bg-white text-zinc-900 shadow-sm border border-zinc-200' : 'text-zinc-500 hover:bg-zinc-100'}`}
                                >
                                    <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-zinc-900' : 'text-zinc-400'}`} />
                                    {category.name}
                                    {isActive && (
                                        <div className="ml-auto w-1 h-1 rounded-full" style={{ backgroundColor: program.color }} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Compact Content */}
                <div className="flex-1 overflow-y-auto bg-white p-6 md:p-8">
                    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {/* Vision - Sober block */}
                        <section className="bg-zinc-50 p-6 rounded-xl border border-zinc-200/50">
                            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Vision Globale</h4>
                            <p className="text-base font-semibold text-zinc-700 leading-snug italic">
                                "{program.description}"
                            </p>
                        </section>

                        {/* List of Measures */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 border-b border-zinc-100 pb-2">
                                <h5 className="text-xs font-black text-zinc-900 uppercase tracking-widest">
                                    Mesures : {activeCategory}
                                </h5>
                                <span className="text-[9px] bg-zinc-100 text-zinc-500 px-2 py-0.5 rounded-md font-bold">
                                    {currentCategory.measures.length} items
                                </span>
                            </div>

                            <div className="grid gap-3">
                                {currentCategory.measures.map((measure, mIdx) => (
                                    <div
                                        key={mIdx}
                                        className="p-5 rounded-xl border border-zinc-100 hover:border-zinc-300 transition-all bg-white group"
                                    >
                                        <div className="flex items-start justify-between gap-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <h6 className="text-[13px] font-black text-zinc-900 leading-tight">
                                                        {measure.title}
                                                    </h6>
                                                    {measure.impact === 'high' && (
                                                        <span
                                                            className="text-[8px] text-white px-2 py-0.5 rounded-full font-black tracking-tighter uppercase"
                                                            style={{ backgroundColor: program.color }}
                                                        >
                                                            Priorité
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                                                    {measure.description}
                                                </p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-zinc-200 group-hover:text-zinc-400 transition-colors mt-1" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};
