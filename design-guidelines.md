# Design System & Guidelines - PoliTrack

Ce document décrit l'esthétique, les composants et les choix de design du projet PoliTrack. Il vous servira de référence pour créer de nouvelles pages ou de nouveaux composants tout en respectant la charte graphique existante.

## 1. Philosophie visuelle

-   **Esthétique globale** : Moderne, minimaliste, "éditoriale" et sérieuse, façon tableau de bord (Dashboard) d'analyse de données.
-   **Contraste et lisibilité** : Design très sobre reposant presque exclusivement sur du monochrome (Noir, Blanc, niveaux de gris - Zinc). L'accent est mis sur la typographie pour hiérarchiser l'information.
-   **Couleurs d'accentuation** : Utilisées avec parcimonie, uniquement pour refléter les couleurs des partis politiques ou des résultats de manière factuelle.

## 2. Typographie

Le projet utilise **Geist** (Sans et Mono) via `next/font/google`.

-   **Poids extrêmes** : Utilisation forte des graisses pour créer du contraste. 
    -   Très gras : `font-black` (pour les titres principaux, les chiffres clés, les badges).
    -   Gras moyen : `font-bold` ou `font-medium` (pour le texte secondaire ou les boutons).
-   **Transformations** : Forte utilisation des majuscules (`uppercase`) couplées à un large espacement des lettres (`tracking-widest` ou `tracking-[0.2em]`) pour les surtitres, les labels, et les badges. À l'inverse, les gros titres utilisent `tracking-tighter`.
-   **Tailles spécifiques micro-UI** : Fréquente utilisation de très petites polices pour les métadonnées (`text-[10px]`, `text-[9px]`) pour garder le côté "Tableau de bord d'expert".
-   **Interlignage** : Serré (`leading-none`, `leading-snug`, `leading-tight`) pour les titres et blocs de mesure.

## 3. Palette de Couleurs (Tailwind : Zinc)

Le thème par défaut est construit autour de la palette **Zinc** de Tailwind CSS.

-   **Fonds globaux** : `bg-zinc-50` (Fond principal de l'application).
-   **Fonds de surface / Cartes** : `bg-white` pour les éléments qui ressortent (cartes, panneaux de détails).
-   **Fonds subtils** : `bg-zinc-50/50` ou `bg-zinc-50/30` pour les entêtes d'onglets, sidebars internes, footers.
-   **Textes principaux** : `text-zinc-900` pour les titres, h1 à h6, et les textes mis en évidence.
-   **Textes secondaires** : `text-zinc-500` pour les paragraphes, textes descriptifs, icônes secondaires. `text-zinc-400` pour les labels discrets ou les valeurs par défaut.
-   **Bordures** : `border-zinc-200` pour délimiter les grandes cartes, `border-zinc-100` pour les séparations internes plus délicates.
-   **Inversions / Éléments actifs** : Fond noir et texte blanc imposant : `bg-zinc-900 text-white`. Utilisé pour les boutons principaux, l'onglet actif ou des badges importants ("Exclusif").

## 4. Composants et Structure (Micro-UI)

### Badges / Labels
Il existe deux types de badges redondants :
-   **Badge plein fond noir** : `bg-zinc-900 text-white text-[10px] font-black px-2 py-0.5 rounded tracking-tighter uppercase`.
-   **Badge texte grisé** : `text-zinc-400 text-[10px] font-bold uppercase tracking-widest` (aussi utilisé pour les surtitres au-dessus d'un grand titre).

### Cartes (Cards)
-   **Conteneur** : `bg-white rounded-2xl md:rounded-xl border border-zinc-200 shadow-sm`.
-   Toujours rembourré (padding) de manière aérée : `p-6` ou `p-8`.

### Éléments Interactifs (Boutons, Onglets)
-   **Onglets actifs** : `bg-zinc-900 text-white shadow-md rounded-lg font-bold text-sm px-4 py-2 transition-all`.
-   **Onglets inactifs** : `text-zinc-500 hover:bg-zinc-100 rounded-lg text-sm font-bold`.
-   Survol des éléments de liste cliquables : Hover subtil via `hover:bg-zinc-50` ou changement des bordures internes (`border-zinc-100 hover:border-zinc-300`).

### Conteneur Principal de Page
-   `<main className="min-h-screen bg-zinc-50">`
-   `<div className="max-w-7xl mx-auto p-6 md:p-12 space-y-8">`

## 5. Iconographie et Visuels

-   **Icônes** : Utilisation exclusive de la librairie **lucide-react**.
-   **Taillage des icônes** : Les icônes s'insèrent bien dans les boutons (`h-4 w-4` ou `h-5 w-5`). Elles adoptent automatiquement la couleur ambiante (`text-zinc-900` actif, `text-zinc-400` inactif).
-   **Avatars / Images** : Les conteneurs d'image emploient couramment un léger `border-zinc-100 rounded-lg` pour encapsuler par exemple les drapeaux pays (`object-cover` ou `object-contain`).

## 6. Animations
Le design comprend des animations subtiles, probablement via `tailwindcss-animate`.
-   **Fade in & Slide in** : Pour l'arrivée des blocs et onglets on utilise `animate-in fade-in slide-in-from-bottom-2 duration-500`.
-   **Transitions classiques** : Sur tous les boutons avec `transition-all` ou `transition-colors`.

## 7. Exemple de "Boîte à Outils" Code

**Exemple d'un titre de section standar :**
```tsx
<h2 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2 uppercase">
  <IconName className="h-6 w-6 text-zinc-900" />
  Titre de la section
</h2>
<p className="text-zinc-500 font-medium">Description secondaire de la zone.</p>
```

**Exemple d'un bloc interne "soft" ou conteneur de données :**
```tsx
<div className="bg-zinc-50 p-6 rounded-xl border border-zinc-200/50">
    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">Sous-titre Info</h4>
    <p className="text-base font-semibold text-zinc-700 leading-snug">
        Donnée à mettre en valeur.
    </p>
</div>
```
