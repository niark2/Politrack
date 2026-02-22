export interface Election {
    id: string;
    name: string;
    type: 'presidential' | 'legislative' | 'municipal';
    country: string;
    targetDate?: string;
    isDefault?: boolean;
    flag?: string;
}

export interface Candidate {
    fullName?: string;
    name?: string;
    party?: string;
    status?: string;
    score?: number;
    color?: string;
    orientation?: string;
    themes?: string[];
    cityName?: string;
    region?: string;
    favorite?: string;
    scores?: { value: number; color: string }[];
    poidsElectoral?: string;
    poidsLabel?: string;
    dateOfAnnouncement?: string;
}

export interface Poll {
    name?: string;
    fullName?: string;
    score?: number;
    color?: string;
    results?: any[];
}

export interface NewsItem {
    id: string;
    title: string;
    date: string;
    source: string;
    url: string;
}

export interface MapCity {
    id: string;
    name: string;
    cityName: string;
    region: string;
    favorite: string;
    scores: { label: string; value: number; color: string }[];
}

export interface DetailedPoll {
    institute?: string;
    date?: string;
    results?: { name: string; score: number }[];
}

export interface ProgramMeasure {
    title: string;
    description: string;
    impact?: "high" | "medium" | "low";
}

export interface ProgramCategory {
    name: string;
    icon?: string;
    measures: ProgramMeasure[];
}

export interface Program {
    partyId: string;
    partyName: string;
    color: string;
    logoUrl?: string;
    description: string;
    categories: ProgramCategory[];
}
