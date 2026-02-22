import React from 'react';
import Link from 'next/link';
import { Shield, ArrowLeft } from 'lucide-react';

export default function MentionsLegales() {
    return (
        <main className="min-h-screen bg-zinc-50 font-sans pb-20">
            <div className="max-w-3xl mx-auto p-6 md:p-12 space-y-12">

                {/* Navigation */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-900 font-bold text-sm tracking-tight transition-colors mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour au tableau de bord
                </Link>

                {/* Header */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8 border-b border-zinc-200">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-zinc-900 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-tighter uppercase flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            Légal
                        </span>
                        <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
                            Dernière mise à jour : Février 2026
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 uppercase">
                        Mentions Légales
                    </h1>
                    <p className="text-zinc-500 font-medium mt-4 text-lg">
                        Transparence, hébergement et conditions d'utilisation de la plateforme PoliTrack.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 text-zinc-700 leading-relaxed">

                    {/* Editeur */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Éditeur du site</h2>
                        <p className="font-medium">
                            Le site <strong className="text-zinc-900">PoliTrack</strong> est édité par un particulier à des fins strictement non commerciales et informatives.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-600 font-medium pl-2">
                            <li><span className="font-bold text-zinc-900">Statut :</span> Particulier</li>
                            <li><span className="font-bold text-zinc-900">Contact :</span> <a href="mailto:contact@votredomaine.fr" className="underline hover:text-zinc-900">contact@votredomaine.fr</a></li>
                        </ul>
                        <p className="text-sm font-medium">
                            Le directeur de la publication est l'éditeur du site mentionné ci-dessus.
                        </p>
                    </section>

                    {/* Hébergement */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Hébergement</h2>
                        <p className="font-medium">
                            Le site PoliTrack est hébergé et déployé sur l'infrastructure de la société <strong className="text-zinc-900">Vercel Inc.</strong>
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-600 font-medium pl-2">
                            <li><span className="font-bold text-zinc-900">Adresse :</span> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                            <li><span className="font-bold text-zinc-900">Site :</span> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-900">vercel.com</a></li>
                        </ul>
                    </section>

                    {/* Propriété Intellectuelle */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Propriété intellectuelle & Sources</h2>
                        <p className="font-medium">
                            L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur. Le design, la structure, et les codes sources (hors bibliothèques open-source) appartiennent à l'éditeur.
                        </p>
                        <div className="border-l-4 border-zinc-200 pl-4 py-1 italic font-medium text-zinc-600">
                            Les données utilisées (résultats d'élections, programmes politiques, sondages) sont issues de sources publiques (instituts de sondage, données en open data, documents de campagne). L'agrégation et le formatage visuel de ces données sur PoliTrack restent la propriété de l'éditeur.
                        </div>
                    </section>

                    {/* RGPD */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Données personnelles et Confidentialité</h2>
                        <p className="font-medium">
                            PoliTrack respecte rigoureusement votre vie privée.
                        </p>
                        <p className="font-bold text-zinc-900">
                            Aucun outil de suivi (analytics) ni tracker publicitaire n'est utilisé sur PoliTrack. Le site ne dépose aucun cookie non essentiel sur votre appareil et ne collecte aucune donnée personnelle à votre insu.
                        </p>
                    </section>

                    {/* Responsabilité */}
                    <section className="space-y-4">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight uppercase">Limitation de Responsabilité</h2>
                        <p className="font-medium">
                            PoliTrack est un outil indicatif d'agrégation d'informations politiques et d'analyses, créé à titre informatif. Bien que l'éditeur s'efforce de fournir des données exactes et à jour, il ne saurait être tenu responsable d'éventuelles inexactitudes, omissions ou carences dans la mise à jour des données (qu'elles soient de son fait ou du fait de tiers).
                        </p>
                        <p className="font-black text-sm uppercase tracking-widest text-zinc-400 mt-6 pt-6 border-t border-zinc-200">
                            PoliTrack n'a aucune affiliation gouvernementale ni partisane.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
}
