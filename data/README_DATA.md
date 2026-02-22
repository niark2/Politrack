# Documentation des Données Politico

Ce document explique comment modifier manuellement les données affichées sur le dashboard.
Comme le système automatique a été désactivé, le dashboard lit désormais directement ces fichiers JSON.

## 1. Sondage Premier Tour
**Fichier** : `data/poll_cache.json`

```json
{
  "cachedAt": 1740166200000,
  "candidates": [
    {
      "name": "J. Bardella",
      "fullName": "Jordan Bardella",
      "score": 35,
      "color": "#800080"
    },
    {
      "name": "E. Philippe",
      "fullName": "Édouard Philippe",
      "score": 22,
      "color": "#1e40af"
    }
  ]
}
```
- `cachedAt` : Timestamp (ms). Mettez une valeur élevée ou laissez tel quel.
- `score` : Nombre (pourcentage). Assurez-vous que le total fait 100.
- `color` : Code HEX de la couleur du parti.

## 2. Sondage Second Tour (Duel)
**Fichier** : `data/poll_cache_r2.json`

```json
{
  "cachedAt": 1740166200000,
  "date": "21/02/2026",
  "institute": "Synthèse Manuelle",
  "duel": "Bardella / Philippe",
  "candidates": [
    {
      "name": "J. Bardella",
      "fullName": "Jordan Bardella",
      "score": 53,
      "color": "#800080"
    },
    {
      "name": "E. Philippe",
      "fullName": "Édouard Philippe",
      "score": 47,
      "color": "#1e40af"
    }
  ]
}
```

## 3. Liste des Candidats Déclarés
**Fichier** : `data/candidates_cache.json`

```json
{
  "cachedAt": 1740166200000,
  "candidates": [
    {
      "fullName": "Édouard Philippe",
      "party": "Horizons",
      "dateOfAnnouncement": "03/09/2024",
      "status": "Officiel"
    },
    {
      "fullName": "Jordan Bardella",
      "party": "RN",
      "dateOfAnnouncement": "Pressenti",
      "status": "Pressenti"
    }
  ]
}
```
- `status` : Doit être soit `"Officiel"` (badge vert) soit `"Pressenti"` (badge ambre).

## 4. Programmes Politiques (Commun par pays)
**Fichier** : `data/programs/[COUNTRY_CODE].json` (ex: `data/programs/FR.json`)

Les programmes sont partagés par toutes les élections d'un même pays.

```json
{
    "lastUpdate": "22/02/2026",
    "programs": [
        {
            "partyId": "NFP",
            "partyName": "Nouveau Front populaire",
            "color": "#E41B23",
            "description": "Description courte de la vision globale.",
            "categories": [
                {
                    "name": "Économie",
                    "measures": [
                        { 
                            "title": "Titre mesure", 
                            "description": "Description longue", 
                            "impact": "high" 
                        }
                    ]
                }
            ]
        }
    ]
}
```
- `partyId` : Identifiant court du parti (affiché dans le carré).
- `impact` : Peut être `"high"`, `"medium"`, ou `"low"` pour afficher des badges d'importance.
- `categories` : Liste thématique (Économie, Écologie, Social, etc.).
