"use client";

import React, { useState } from "react";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { Program } from "@/types";
import { ProgramDetail } from "./ProgramDetail";
import { motion, AnimatePresence } from "framer-motion";

interface PartyProgramsProps {
    programs: Program[];
    loading: boolean;
    updateDate: string;
}

export const PartyPrograms: React.FC<PartyProgramsProps> = ({ programs, loading, updateDate }) => {
    const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPrograms = programs.filter(p =>
        p.partyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-zinc-200">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-300 mb-4" />
                <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Chargement des programmes...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-[60vh]">
            <AnimatePresence mode="wait">
                {selectedProgram ? (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, y: 10, scale: 0.99 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.99 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                        <ProgramDetail
                            program={selectedProgram}
                            onBack={() => setSelectedProgram(null)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0, scale: 1.01 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.99 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                    >
                        {/* Action Bar */}
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                            <div className="relative w-full md:w-96">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un parti ou une mesure..."
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="text-[10px] bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-full border border-zinc-200 font-black uppercase tracking-widest">
                                Mise à jour : {updateDate}
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredPrograms.length > 0 ? (
                                filteredPrograms.map((program) => (
                                    <div
                                        key={program.partyId}
                                        onClick={() => setSelectedProgram(program)}
                                        className="group bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-2xl hover:translate-y-[-8px] transition-all cursor-pointer relative"
                                    >
                                        <div
                                            className="absolute top-0 left-0 w-full h-2"
                                            style={{ backgroundColor: program.color }}
                                        />

                                        <div className="p-8 space-y-6">
                                            <div className="flex items-start justify-between">
                                                <div
                                                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform overflow-hidden bg-white border border-zinc-100"
                                                >
                                                    {program.logoUrl ? (
                                                        <img src={program.logoUrl} alt={program.partyName} className="w-full h-full object-contain p-2" />
                                                    ) : (
                                                        <div
                                                            className="w-full h-full flex items-center justify-center text-white text-2xl font-black"
                                                            style={{ backgroundColor: program.color }}
                                                        >
                                                            {program.partyId}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                                                    {program.categories.length} Axes
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-2xl font-black text-zinc-900 tracking-tighter leading-none mb-3">
                                                    {program.partyName}
                                                </h3>
                                                <p className="text-zinc-500 font-medium line-clamp-2 leading-relaxed text-sm">
                                                    {program.description}
                                                </p>
                                            </div>

                                            <div className="pt-6 border-t border-zinc-100 flex items-center justify-between">
                                                <div className="flex flex-wrap gap-2">
                                                    {program.categories.slice(0, 2).map((cat, i) => (
                                                        <span key={i} className="text-[9px] font-black uppercase tracking-[0.1em] bg-zinc-100 text-zinc-500 px-2.5 py-1 rounded-lg">
                                                            {cat.name}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all shadow-lg">
                                                    <ArrowRight className="h-5 w-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-zinc-200">
                                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Aucun programme trouvé</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
