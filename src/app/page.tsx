"use client";

import React, { useState } from "react";
import { LayoutDashboard, TrendingUp, Loader2, BookOpen, Archive, ChevronDown } from "lucide-react";
import { CandidateCard } from "@/components/CandidateCard";

// Components
import { GlobalStats } from "@/components/dashboard/GlobalStats";
import { NewsFeed } from "@/components/dashboard/NewsFeed";
import { PresidentialCharts } from "@/components/dashboard/PresidentialCharts";
import { LegislativeCharts } from "@/components/dashboard/LegislativeCharts";
import { DetailedPolls } from "@/components/dashboard/DetailedPolls";
import { MunicipalCharts } from "@/components/dashboard/MunicipalCharts";
import { FranceMap } from "@/components/dashboard/FranceMap";
import { PartyPrograms } from "@/components/dashboard/PartyPrograms";

// Hooks & Utils
import { useDashboardData } from "@/hooks/useDashboardData";
import { calculateDaysRemaining } from "@/utils/date";
import { countryFlagUrl } from "@/utils/flag";
import { Candidate, Election } from "@/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "candidates" | "polls" | "programs">("dashboard");
  const [filterStatus, setFilterStatus] = useState<string>("Tous");
  const [filterOrientation, setFilterOrientation] = useState<string>("Tous");

  const {
    elections,
    selectedElection,
    setSelectedElection,
    loadingPolls,
    loadingNews,
    latestPollData,
    secondRoundData,
    newsData,
    loadingPollsR2,
    loadingCandidates,
    secondRoundTitle,
    loadingDetailedPolls,
    pollUpdate,
    r2Update,
    detailedPolls,
    detailedPollsUpdate,
    mapData,
    loadingPrograms,
    programsData,
    programsUpdate,
    config,
    enrichedCandidates
  } = useDashboardData();

  const daysRemaining = calculateDaysRemaining(selectedElection?.targetDate);

  const filteredCandidates = enrichedCandidates.filter((c: Candidate) => {
    const matchesOrientation = filterOrientation === "Tous" || c.orientation === filterOrientation;
    const matchesStatus = filterStatus === "Tous" || c.status === filterStatus;
    return matchesOrientation && matchesStatus;
  });

  const orientations = ["Tous", "Extrême-Gauche", "Gauche", "Écologie", "Centre", "Droite", "Extrême-Droite", "Ville"];
  const statuses = ["Tous", "Officiel", "Pressenti", "Non déclaré"];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let ChartComponent: React.ComponentType<any> = PresidentialCharts;
  if (selectedElection?.type === 'legislative') ChartComponent = LegislativeCharts;
  if (selectedElection?.type === 'municipal') ChartComponent = MunicipalCharts;

  if (!config) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </main>
    );
  }

  const TabNavIcon = config.candidatesNavIcon;
  const CandidatesTitleIcon = config.candidatesTab.icon;

  return (
    <main className="min-h-screen bg-zinc-50 font-sans">
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-8">
        {/* Header */}
        <header className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-zinc-900 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-tighter uppercase">Exclusif</span>
                <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">Election {selectedElection?.name.split(' ').pop() || "2026"}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 leading-none">
                POLITRACK <span className="text-zinc-900">{selectedElection?.country === 'US' ? 'USA' : 'FRANCE'}</span>
              </h1>
              <p className="text-zinc-500 mt-3 text-lg font-medium">
                {selectedElection?.name || "Intelligence politique & prospective électorale"}
              </p>
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-zinc-200 shadow-sm h-fit">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "dashboard" ? "bg-zinc-900 text-white shadow-md" : "text-zinc-500 hover:bg-zinc-100"}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab("candidates")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "candidates" ? "bg-zinc-900 text-white shadow-md" : "text-zinc-500 hover:bg-zinc-100"}`}
              >
                <TabNavIcon className="h-4 w-4" />
                {config.candidatesTabNavTitle}
              </button>
              <button
                onClick={() => setActiveTab("polls")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "polls" ? "bg-zinc-900 text-white shadow-md" : "text-zinc-500 hover:bg-zinc-100"}`}
              >
                <TrendingUp className="h-4 w-4" />
                {config.pollsTabNavTitle}
              </button>
              <button
                onClick={() => setActiveTab("programs")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "programs" ? "bg-zinc-900 text-white shadow-md" : "text-zinc-500 hover:bg-zinc-100"}`}
              >
                <BookOpen className="h-4 w-4" />
                Programmes
              </button>
            </div>
          </div>

          {/* Election Selectors */}
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-1">
            {elections.filter(e => !e.archived).map((election: Election) => (
              <button
                key={election.id}
                onClick={() => setSelectedElection(election)}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-all whitespace-nowrap ${selectedElection?.id === election.id
                  ? "border-zinc-900 text-zinc-900 font-black"
                  : "border-transparent text-zinc-400 font-bold hover:text-zinc-600"
                  }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={countryFlagUrl(election.country)} alt={election.country} className="w-6 h-[18px] rounded-sm object-cover" />
                <span className="text-sm uppercase tracking-tight">{election.name}</span>
              </button>
            ))}

            {/* Archives Dropdown */}
            {elections.some(e => e.archived) && (
              <div className="relative group">
                <button
                  className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-all whitespace-nowrap ${selectedElection?.archived
                    ? "border-zinc-900 text-zinc-900 font-black"
                    : "border-transparent text-zinc-400 font-bold hover:text-zinc-600"
                    }`}
                >
                  <Archive className="h-4 w-4" />
                  <span className="text-sm uppercase tracking-tight">Archives</span>
                  <ChevronDown className="h-3 w-3 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                <div className="absolute left-0 mt-0 pt-1 w-56 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-[100]">
                  <div className="bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
                    <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-100">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Élections passées</span>
                    </div>
                    {elections.filter(e => e.archived).map((election: Election) => (
                      <button
                        key={election.id}
                        onClick={() => setSelectedElection(election)}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-all text-left ${selectedElection?.id === election.id ? "bg-zinc-100" : ""}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={countryFlagUrl(election.country)} alt={election.country} className="w-5 h-[15px] rounded-sm object-cover" />
                        <span className={`text-xs uppercase tracking-tight font-bold ${selectedElection?.id === election.id ? "text-zinc-900" : "text-zinc-500"}`}>
                          {election.name}
                        </span>
                        {selectedElection?.id === election.id && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-zinc-900" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {selectedElection?.archived && (
          <div className="bg-zinc-100 border border-zinc-200 rounded-xl px-6 py-3 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <Archive className="h-5 w-5 text-zinc-500" />
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <span className="w-fit px-2 py-0.5 rounded bg-zinc-900 text-[10px] font-black text-white uppercase tracking-wider">Archivé</span>
              <p className="text-sm font-bold text-zinc-600">
                Cette élection est terminée. Consultation des données historiques uniquement.
              </p>
            </div>
          </div>
        )}

        {activeTab === "dashboard" ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            {!selectedElection?.archived && (
              <GlobalStats
                daysRemaining={daysRemaining}
                selectedElection={selectedElection}
                countdownTitle={config.dashboardCountdownTitle}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-8">
                <ChartComponent
                  loadingPolls={loadingPolls}
                  loadingPollsR2={loadingPollsR2}
                  latestPollData={latestPollData}
                  secondRoundData={secondRoundData}
                  pollUpdate={pollUpdate}
                  r2Update={r2Update}
                  secondRoundTitle={secondRoundTitle}
                />
              </div>

              <div className="space-y-8">
                <NewsFeed loadingNews={loadingNews} newsData={newsData} />
              </div>
            </div>
          </div>
        ) : activeTab === "candidates" ? (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2 uppercase">
                  <CandidatesTitleIcon className="h-6 w-6 text-zinc-900" />
                  {config.candidatesTab.title}
                </h2>
                <p className="text-zinc-500 font-medium">
                  {config.candidatesTab.description}
                </p>
              </div>

              {selectedElection?.type !== 'municipal' && (
                <div className="flex flex-wrap gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Orientation</label>
                    <select
                      value={filterOrientation}
                      onChange={(e) => setFilterOrientation(e.target.value)}
                      className="block w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-bold py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    >
                      {orientations.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">Statut</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="block w-full bg-zinc-50 border border-zinc-200 text-zinc-700 text-xs font-bold py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all"
                    >
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {selectedElection?.type === 'municipal' ? (
              <FranceMap cities={mapData} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loadingCandidates || loadingPolls ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-[300px] bg-white rounded-xl border border-zinc-200 flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
                    </div>
                  ))
                ) : filteredCandidates.length > 0 ? (
                  filteredCandidates.map((c: Candidate, i: number) => (
                    <CandidateCard
                      key={i}
                      fullName={c.fullName || ""}
                      party={c.party || ""}
                      status={c.status || "En attente"}
                      score={c.score || 0}
                      poidsElectoral={c.poidsElectoral}
                      poidsLabel={c.poidsLabel}
                      color={c.color || "#94a3b8"}
                      dateOfAnnouncement={c.dateOfAnnouncement}
                      orientation={c.orientation || "Centre"}
                      themes={c.themes || []}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-zinc-200">
                    <p className="text-zinc-400 font-bold uppercase tracking-widest text-sm">Aucun profil ne correspond aux filtres</p>
                    <button
                      onClick={() => { setFilterOrientation("Tous"); setFilterStatus("Tous"); }}
                      className="mt-4 text-xs font-black text-zinc-900 uppercase tracking-widest hover:underline"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : activeTab === "polls" ? (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2 uppercase">
                  <TrendingUp className="h-6 w-6 text-zinc-900" />
                  {config.pollsTab.title}
                </h2>
                <p className="text-zinc-500 font-medium">
                  {config.pollsTab.description}
                </p>
              </div>
              {detailedPollsUpdate && (
                <div className="text-[10px] bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-full border border-zinc-200 font-black">
                  ARCHIVES MAJ : {detailedPollsUpdate}
                </div>
              )}
            </div>

            <DetailedPolls
              loadingDetailedPolls={loadingDetailedPolls}
              detailedPolls={detailedPolls}
              detailedPollsUpdate={detailedPollsUpdate}
              electionType={selectedElection?.type || ""}
              latestPollData={latestPollData}
            />
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2 uppercase">
                  <BookOpen className="h-6 w-6 text-zinc-900" />
                  Programmes Politiques
                </h2>
                <p className="text-zinc-500 font-medium">
                  Explorez les mesures phares et les visions de chaque formation.
                </p>
              </div>
            </div>

            <PartyPrograms
              programs={programsData}
              loading={loadingPrograms}
              updateDate={programsUpdate}
            />
          </div>
        )}
      </div>
    </main>
  );
}
