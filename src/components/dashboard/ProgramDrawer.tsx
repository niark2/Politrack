"use client";

import React from "react";
import {
    X,
    ChevronRight,
    BookOpen,
    ShieldAlert,
    Leaf,
    HeartPulse,
    Wallet,
    Scale,
    Globe2,
    Fingerprint,
    Landmark
} from "lucide-react";
import { Program, ProgramCategory } from "@/types";

interface ProgramDrawerProps {
    program: Program | null;
    isOpen: boolean;
    onClose: () => void;
}

// Helper to normalize strings for comparison (remove accents and lowercase)
const normalize = (str: string) =>
    str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

const getCategoryIcon = (categoryName: string) => {
    const normalized = normalize(categoryName);

    if (normalized.includes("economie") || normalized.includes("achat")) return Wallet;
    if (normalized.includes("ecologie") || normalized.includes("climat") || normalized.includes("energie")) return Leaf;
    if (normalized.includes("immigration")) return Fingerprint;
    if (normalized.includes("securite") || normalized.includes("justice")) return Scale;
    if (normalized.includes("social") || normalized.includes("sante") || normalized.includes("education")) return HeartPulse;
    if (normalized.includes("europe") || normalized.includes("international") || normalized.includes("monde")) return Globe2;
    if (normalized.includes("institution")) return Landmark;

    return BookOpen;
};

export const ProgramDrawer: React.FC<ProgramDrawerProps> = ({ program, isOpen, onClose }) => {
    const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (program && program.categories.length > 0) {
            setActiveCategory(program.categories[0].name);
        }
    }, [program]);

    if (!program) return null;

    const currentCategory = program.categories.find(c => c.name === activeCategory) || program.categories[0];

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] max-w-6xl h-[85vh] bg-zinc-50 z-[70] shadow-2xl rounded-[2.5rem] overflow-hidden transition-all duration-500 transform ${isOpen ? 'opacity-100 scale-100 translate-y-[-50%]' : 'opacity-0 scale-95 translate-y-[-45%] pointer-events-none'}`}
            >
                <div className="h-full flex flex-col md:flex-row">
                    {/* Sidebar Area (Left) */}
                    <div className="w-full md:w-80 bg-white border-r border-zinc-200 flex flex-col shrink-0">
                        {/* Header */}
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between md:block">
                                <div
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl mb-4 overflow-hidden relative"
                                    style={{ backgroundColor: program.color }}
                                >
                                    {program.logoUrl ? (
                                        <img
                                            src={program.logoUrl}
                                            alt={program.partyName}
                                            className="w-full h-full object-cover p-2 bg-white"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                (e.target as HTMLImageElement).parentElement!.innerText = program.partyId;
                                            }}
                                        />
                                    ) : (
                                        program.partyId
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="md:hidden p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-400"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-zinc-900 tracking-tighter leading-tight">
                                    {program.partyName}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: program.color }} />
                                    <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        Programme {new Date().getFullYear()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <nav className="flex-1 overflow-y-auto px-4 space-y-1">
                            {program.categories.map((category, idx) => {
                                const Icon = getCategoryIcon(category.name);
                                const isActive = normalize(activeCategory || "") === normalize(category.name);

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveCategory(category.name)}
                                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group ${isActive ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:bg-zinc-100'}`}
                                    >
                                        <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-900'}`} />
                                        {category.name}
                                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Download Footer */}
                        <div className="p-6 mt-auto">
                            <button className="w-full py-3 bg-zinc-50 border border-zinc-200 hover:border-zinc-900 text-zinc-900 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 group">
                                <BookOpen className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                                Livret Complet PDF
                            </button>
                        </div>
                    </div>

                    {/* Content Area (Right) */}
                    <div className="flex-1 flex flex-col bg-zinc-50 relative min-w-0">
                        {/* Close button (Desktop) */}
                        <button
                            onClick={onClose}
                            className="hidden md:flex absolute top-6 right-6 p-3 bg-white/50 backdrop-blur-md rounded-2xl border border-zinc-200 hover:bg-zinc-900 hover:text-white transition-all z-20 group"
                        >
                            <X className="h-5 w-5 group-hover:scale-110 transition-transform" />
                        </button>

                        {/* Scroll Content */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-10 no-scrollbar">
                            {/* Vision Section */}
                            <section className="relative">
                                <div className="absolute -left-10 top-0 w-1 h-full opacity-20" style={{ backgroundColor: program.color }} />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4 ml-2">La Vision</h4>
                                <div className="bg-white p-8 rounded-[2rem] border border-zinc-200 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-[-10%] right-[-5%] w-40 h-40 rounded-full opacity-[0.03] group-hover:scale-125 transition-transform duration-700" style={{ backgroundColor: program.color }} />
                                    <p className="text-xl md:text-2xl font-bold text-zinc-800 leading-tight tracking-tight italic relative z-10">
                                        "{program.description}"
                                    </p>
                                </div>
                            </section>

                            {/* Detailed Categorical Content */}
                            <section className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Mesures : {activeCategory}</h4>
                                    <span className="text-[10px] font-black bg-zinc-900 text-white px-3 py-1 rounded-full uppercase tracking-widest">
                                        {currentCategory.measures.length} Mesures
                                    </span>
                                </div>

                                <div className="grid gap-4">
                                    {currentCategory.measures.map((measure, mIdx) => (
                                        <div
                                            key={mIdx}
                                            className="bg-white p-8 rounded-[1.5rem] border border-zinc-200 shadow-sm hover:border-zinc-900/50 hover:shadow-xl hover:translate-x-2 transition-all group relative overflow-hidden"
                                        >
                                            <div className="absolute left-0 top-0 h-full w-2" style={{ backgroundColor: program.color }} />
                                            <div className="flex items-start justify-between gap-8">
                                                <div className="space-y-3">
                                                    <div className="flex items-center gap-3">
                                                        <h5 className="text-lg font-black text-zinc-900 leading-none tracking-tight">
                                                            {measure.title}
                                                        </h5>
                                                        {measure.impact === 'high' && (
                                                            <span className="text-[9px] bg-red-50 text-red-600 px-2.5 py-1 rounded-md font-black tracking-widest uppercase border border-red-100/50 shadow-sm">
                                                                Priorité Absolue
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-zinc-500 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
                                                        {measure.description}
                                                    </p>
                                                </div>
                                                <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-all border border-zinc-100">
                                                    <ChevronRight className="h-5 w-5 opacity-30 group-hover:opacity-100" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
