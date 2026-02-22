import { Building2, UserCircle, Users, Map as MapIcon } from 'lucide-react';
import type { ElementType } from 'react';

export interface ElectionConfigType {
    dashboardCountdownTitle: string;
    pollsTabNavTitle: string;
    candidatesTabNavTitle: string;
    candidatesNavIcon: ElementType;
    candidatesTab: {
        title: string;
        description: string;
        icon: ElementType;
    };
    pollsTab: {
        title: string;
        description: string;
        unit: string;
        maxDomain: number;
        formatValue: (val: any) => string;
    };
    getEnrichedPollSource: (latestPollData: any[], secondRoundData: any[]) => any[];
}

export const ELECTION_CONFIG: Record<string, ElectionConfigType> = {
    legislative: {
        dashboardCountdownTitle: 'COMPTE À REBOURS',
        pollsTabNavTitle: 'Intentions & Sièges',
        candidatesTabNavTitle: 'Partis & Groupes',
        candidatesNavIcon: Building2,
        candidatesTab: {
            title: 'Observatoire des Partis',
            description: 'Analyse des forces politiques et coalitions.',
            icon: Building2,
        },
        pollsTab: {
            title: 'Projections par Institut',
            description: 'Historique des estimations de sièges à l\'Assemblée.',
            unit: 'Sièges',
            maxDomain: 300,
            formatValue: (val: any) => String(val),
        },
        getEnrichedPollSource: (latest, secondRound) => secondRound,
    },
    presidential: {
        dashboardCountdownTitle: 'COMPTE À REBOURS',
        pollsTabNavTitle: 'Sondages',
        candidatesTabNavTitle: 'Personnalités',
        candidatesNavIcon: UserCircle,
        candidatesTab: {
            title: 'Observatoire des Candidats',
            description: 'Analyse détaillée des profils et positionnements.',
            icon: Users,
        },
        pollsTab: {
            title: 'Détail des Sondages',
            description: 'Historique et comparatif par institut de sondage.',
            unit: 'Intentions (%)',
            maxDomain: 45,
            formatValue: (val: any) => `${val}%`,
        },
        getEnrichedPollSource: (latest, secondRound) => latest,
    },
    municipal: {
        dashboardCountdownTitle: 'COMPTE À REBOURS',
        pollsTabNavTitle: 'Villes & Tendances',
        candidatesTabNavTitle: 'Carte Interactive',
        candidatesNavIcon: MapIcon,
        candidatesTab: {
            title: 'Cartographie des Enjeux',
            description: 'Visualisation géographique des points de bascule et rapports de force.',
            icon: MapIcon,
        },
        pollsTab: {
            title: 'Tendances Municipales',
            description: 'Analyse des rapports de force à l\'échelle nationale.',
            unit: 'Villes',
            maxDomain: 100,
            formatValue: (val: any) => String(val),
        },
        getEnrichedPollSource: (latest, secondRound) => latest,
    }
};

export const getElectionConfig = (type?: string): ElectionConfigType => {
    return ELECTION_CONFIG[type || 'presidential'] || ELECTION_CONFIG['presidential'];
};
