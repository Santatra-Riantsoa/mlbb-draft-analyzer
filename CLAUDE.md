# MLBB Draft Analyzer — CLAUDE.md

Outil d'analyse de draft pour Mobile Legends: Bang Bang, inspiré des broadcasts officiels MPL/M-Series.
Composant React standalone, une seule fichier, aucune dépendance externe.

---

## Stack & Fichiers

```
mlbb-draft-analyzer.jsx   ← composant principal, tout est dedans
CLAUDE.md                 ← ce fichier
```

- **Framework** : React (hooks uniquement — useState, useMemo)
- **Styling** : CSS-in-JS inline (pas de Tailwind, pas de styled-components)
- **Fonts** : Google Fonts — Orbitron (titres), Rajdhani (corps)
- **Dépendances** : aucune (pas de bibliothèque externe)
- **Export** : default export `App`

---

## Architecture du composant

### Données — `HEROES[]`
Tableau de ~100 objets hero, chacun avec cette forme exacte :
```js
{
  name: "NomHero",           // string — identifiant unique
  roles: ["Role1", "Role2"], // string[] — rôles MLBB officiels
  early: 3.5,   // Early game power       (1.0 – 5.0)
  mid: 4.0,     // Mid game power         (1.0 – 5.0)
  late: 4.5,    // Late game power        (1.0 – 5.0)
  damage: 4.5,  // Damage output          (1.0 – 5.0)
  survive: 3.5, // Survivability          (1.0 – 5.0)
  control: 2.5, // Crowd control          (1.0 – 5.0)
  push: 3.0,    // Push/wave clear        (1.0 – 5.0)
  coord: 3.5,   // Team coordination need (1.0 – 5.0)
}
```

**Règles d'attribution des scores :**
- `1.0–2.0` = très faible dans cette catégorie
- `2.5–3.5` = moyen / situationnel
- `4.0–4.5` = fort
- `5.0` = parmi les meilleurs du jeu dans cette catégorie
- Un hero peut avoir 5.0 dans 2 métriques max (éviter le power creep dans les données)

### Rôles valides (ROLE_COLORS)
```
Fighter | Tank | Mage | Assassin | Marksman | Support
```
Couleurs assignées — ne pas changer sans mettre à jour ROLE_COLORS :
- Fighter   → #e8a000 (orange)
- Tank      → #4da6ff (bleu)
- Mage      → #c084fc (violet)
- Assassin  → #f87171 (rouge)
- Marksman  → #34d399 (vert)
- Support   → #fb923c (orange clair)

### Métriques affichées — `METRICS[]`
```js
[
  { key: "early",   label: "EARLY GAME" },
  { key: "mid",     label: "MID GAME" },
  { key: "late",    label: "LATE GAME" },
  { key: "damage",  label: "DAMAGE" },
  { key: "survive", label: "SURVIVABILITY" },
  { key: "control", label: "CONTROL ABILITY" },
  { key: "push",    label: "PUSH ABILITY" },
  { key: "coord",   label: "TEAM COORDINATION" },
]
```

### Calculs — `calcTeam(heroes[])`
- Moyenne arithmétique simple de chaque métrique sur les heroes sélectionnés
- `lineup` = moyenne de toutes les métriques, arrondi à 2 décimales
- `counterIndex` = `statsA.lineup - statsB.lineup` (positif = avantage Team A)
- Verdict "EVEN" si `|counterIndex| < 0.3`

### Composants internes
| Composant | Rôle |
|-----------|------|
| `MetricBar` | Barre comparative gauche↔droite, Team A en doré, Team B en bleu |
| `HeroChip` | Badge hero sélectionné avec bouton ×, coloré par side |
| `HeroSelector` | Liste filtrée par rôle + recherche texte, max 5 heroes |
| `App` | Composant racine — état global teamA[], teamB[] |

---

## Palette de couleurs (thème dark esport)

```
Background        #060e18   (fond principal)
Surface           #0d1a2a   (cards, inputs)
Border            #1e3050   (séparateurs)
Text primary      #eee
Text secondary    #8899aa
Text muted        #446677

Team A (gold)     #f0c040
Team B (blue)     #4da6ff
Danger/loss       #f87171
```

---

## Conventions de code

- Tout le styling en objets JS inline `style={{ }}` — ne pas migrer vers classes CSS
- Pas de `className`, pas de Tailwind
- State uniquement dans `App` — les sous-composants reçoivent props
- `useMemo` pour `statsA` et `statsB` (recalcul uniquement si teamA/teamB change)
- Nommage : camelCase pour variables, PascalCase pour composants

---

## Ajouter des heroes

Pour ajouter un hero manquant, insérer dans `HEROES[]` en respectant l'ordre alphabétique :

```js
{ name: "Chip", roles: ["Tank", "Support"], early: 4.0, mid: 4.0, late: 3.5, damage: 2.0, survive: 4.5, control: 4.5, push: 2.5, coord: 5.0 },
{ name: "Nolan", roles: ["Assassin"], early: 4.5, mid: 5.0, late: 4.0, damage: 5.0, survive: 3.5, control: 2.5, push: 3.0, coord: 3.0 },
```

Heroes actuellement absents à ajouter en priorité :
- Chip, Nolan, Zhuxin, Suyou, Lukas, Cici, Arlott (heroes récents 2024–2025)

---

## Fonctionnalités à implémenter (backlog)

### Priorité haute
- [ ] **Système de ban** — phase de ban avant la sélection (jusqu'à 5 bans par équipe), heroes bannis grisés et non sélectionnables
- [ ] **Noms d'équipes éditables** — remplacer "TEAM A / TEAM B" par un input texte cliquable
- [ ] **Reset draft** — bouton pour vider les deux équipes en un clic

### Priorité moyenne
- [ ] **Suggestions de synergie** — après 3 heroes, suggérer les 2 meilleurs complements basés sur les métriques manquantes
- [ ] **Export image** — screenshot de l'analyse (html2canvas ou solution CSS print)
- [ ] **Historique de drafts** — sauvegarder/charger des drafts nommées (localStorage)
- [ ] **Mode tournoi** — simuler le format pick/ban officiel MPL (alternance des picks)

### Priorité basse
- [ ] **Stats détaillées au hover** — tooltip sur chaque hero avec ses 8 métriques individuelles
- [ ] **Tier list intégrée** — filtrer heroes par tier meta actuel
- [ ] **Comparaison hero vs hero** — radar chart pour 1v1

---

## Ce qu'il ne faut PAS faire

- Ne pas introduire de dépendances npm (recharts, chart.js, etc.) — l'app doit rester standalone
- Ne pas splitter en plusieurs fichiers sauf si explicitement demandé
- Ne pas changer le thème de couleurs sans accord — le dark esport est intentionnel
- Ne pas modifier `calcTeam()` sans comprendre l'impact sur counterIndex et lineup
- Ne pas utiliser `useEffect` pour recalculer les stats — `useMemo` suffit et est plus propre

---

## Exemples de prompts utiles

```
# Ajouter des heroes
Ajoute Chip (Tank/Support), Nolan (Assassin) et Cici (Fighter) avec des stats réalistes basées sur leur kit MLBB.

# Ajouter les bans
Implémente une phase de ban avant la sélection : chaque équipe peut bannir jusqu'à 5 heroes. Les heroes bannis apparaissent en rouge barré dans la liste et ne peuvent pas être sélectionnés.

# Renommer les équipes
Rends les labels "TEAM A" et "TEAM B" éditables : double-clic pour passer en mode édition, Entrée ou blur pour valider.

# Export
Ajoute un bouton "Export PNG" qui prend un screenshot de la zone d'analyse centrale (barres + scores) via html2canvas.

# Corriger un score
Mets à jour les stats de Fanny : early 4.0, mid 5.0, late 3.5 — elle est trop forte en mid game dans les données actuelles.
```
