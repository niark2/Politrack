"use client";


import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

interface CityData {
    cityName: string;
    region: string;
    favorite: string;
    lat?: number;
    lng?: number;
    scores: { label: string; value: number; color: string }[];
}

interface FranceMapProps {
    cities: CityData[];
}

// Lazy-load the Leaflet-dependent component with SSR disabled
const FranceMapInner = dynamic<FranceMapProps>(() => import("./FranceMapInner"), {
    ssr: false,
    loading: () => (
        <div className="relative w-full h-[600px] max-w-5xl mx-auto rounded-[2rem] border border-zinc-200 shadow-xl overflow-hidden bg-zinc-50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-300" />
        </div>
    ),
});

export function FranceMap({ cities }: FranceMapProps) {
    return <FranceMapInner cities={cities} />;
}

