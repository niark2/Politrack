"use client";

import React, { useEffect, useState } from "react";
import { Trophy, Navigation2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface CityData {
    cityName: string;
    region: string;
    favorite: string;
    lat?: number;
    lng?: number;
    scores: { label: string; value: number; color: string }[];
}

interface FranceMapInnerProps {
    cities: CityData[];
}

const CITY_COORDS: Record<string, [number, number]> = {
    "Paris": [48.8566, 2.3522],
    "Lyon": [45.7640, 4.8357],
    "Marseille": [43.2965, 5.3698],
    "Bordeaux": [44.8378, -0.5792],
    "Lille": [50.6292, 3.0573],
    "Nantes": [47.2184, -1.5536],
    "Strasbourg": [48.5734, 7.7521],
    "Montpellier": [43.6108, 3.8767],
    "Rennes": [48.1173, -1.6778],
    "Toulouse": [43.6047, 1.4442],
    "Nice": [43.7102, 7.2620]
};

function MapUpdater({ cities }: { cities: CityData[] }) {
    const map = useMap();
    useEffect(() => {
        const validCities = cities.filter(c => (c.lat && c.lng) || CITY_COORDS[c.cityName]);
        if (validCities.length > 0) {
            const bounds = L.latLngBounds(
                validCities.map(c =>
                    (c.lat && c.lng) ? [c.lat, c.lng] : CITY_COORDS[c.cityName]
                ) as L.LatLngExpression[]
            );
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [cities, map]);
    return null;
}

export default function FranceMapInner({ cities }: FranceMapInnerProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // Fix Leaflet's default icon path issues in Next.js
        const proto = L.Icon.Default.prototype as L.Icon.Default & { _getIconUrl?: unknown };
        delete proto._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, []);

    if (!isMounted) return null;

    const createCustomIcon = (color: string) => {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `
                <div style="
                    background-color: ${color};
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <div style="width: 4px; height: 4px; background-color: white; border-radius: 50%;"></div>
                </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
    };

    return (
        <div className="relative w-full h-[600px] max-w-5xl mx-auto rounded-[2rem] border border-zinc-200 shadow-xl overflow-hidden group/map select-none bg-zinc-50">
            {/* Title / Info Overlay */}
            <div className="absolute top-6 left-6 z-[1000] pointer-events-none">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 border border-zinc-200 shadow-sm backdrop-blur-md mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Carte Active</span>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 leading-none drop-shadow-md bg-white/80 p-2 rounded-xl backdrop-blur-sm">
                    Cartographie <br />
                    <span className="text-zinc-500">des communes</span>
                </h3>
            </div>

            <MapContainer
                center={[46.2276, 2.2137]}
                zoom={6}
                className="w-full h-full z-0"
                zoomControl={false}
                scrollWheelZoom={true}
            >
                <ZoomControl position="bottomright" />
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <MapUpdater cities={cities} />

                {cities.map((city, idx) => {
                    const coords = (city.lat && city.lng) ? [city.lat, city.lng] as [number, number] : CITY_COORDS[city.cityName];
                    if (!coords) return null;

                    const topScoreColor = city.scores?.[0]?.color || "#94a3b8";

                    return (
                        <Marker
                            key={idx}
                            position={coords}
                            icon={createCustomIcon(topScoreColor)}
                        >
                            <Popup className="custom-popup">
                                <Card className="w-64 border-0 shadow-none overflow-hidden rounded-xl">
                                    <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: topScoreColor }} />
                                    <CardContent className="p-4 space-y-4 bg-white">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-0.5">
                                                <h4 className="text-xl font-black text-zinc-900 uppercase tracking-tighter leading-none">{city.cityName}</h4>
                                                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{city.region}</p>
                                            </div>
                                            <div className="bg-zinc-100 p-2 rounded-lg">
                                                <Navigation2 className="w-3 h-3 text-zinc-900 fill-zinc-900" />
                                            </div>
                                        </div>

                                        <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Trophy className="h-3 w-3 text-yellow-500" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">LeaderBoard</span>
                                            </div>
                                            <p className="text-xs font-black text-zinc-900 uppercase truncate">
                                                {city.favorite}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            {city.scores?.map((s, i) => (
                                                <div key={i} className="space-y-1">
                                                    <div className="flex justify-between items-end px-0.5">
                                                        <span className="text-[9px] font-black uppercase text-zinc-600 truncate max-w-[70%]">{s.label}</span>
                                                        <span className="text-[10px] font-black text-zinc-900">{s.value}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${s.value}%`, backgroundColor: s.color }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Global CSS for Leaflet customization */}
            <style jsx global>{`
                .leaflet-popup-content-wrapper {
                    padding: 0;
                    border-radius: 0.75rem;
                    overflow: hidden;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                }
                .leaflet-popup-content {
                    margin: 0;
                    width: auto !important;
                }
                .leaflet-popup-tip-container {
                    display: none;
                }
                .leaflet-zoom-box {
                    background: rgba(255, 255, 255, 0.5);
                    border: 2px solid #3f3f46;
                }
                .leaflet-control-zoom {
                    border: none !important;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
                    margin-bottom: 24px !important;
                    margin-right: 24px !important;
                }
                .leaflet-control-zoom-in, .leaflet-control-zoom-out {
                    background-color: #18181b !important;
                    color: white !important;
                    border: 1px solid #27272a !important;
                    width: 36px !important;
                    height: 36px !important;
                    line-height: 36px !important;
                    font-size: 18px !important;
                    font-weight: bold !important;
                    transition: all 0.2s ease !important;
                }
                .leaflet-control-zoom-in {
                    border-radius: 12px 12px 0 0 !important;
                }
                .leaflet-control-zoom-out {
                    border-radius: 0 0 12px 12px !important;
                }
                .leaflet-control-zoom-in:hover, .leaflet-control-zoom-out:hover {
                    background-color: #27272a !important;
                    scale: 1.05;
                }
            `}</style>
        </div>
    );
}
