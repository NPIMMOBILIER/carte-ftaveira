# Carte de visite NFC — NP IMMOBILIER (Damien Pignat) — Design Spec

**Date :** 2026-06-03
**Projet :** np-card
**Statut :** Approuvé
**Base :** copie rebrandée du projet `nfc-card` (carte Interlo de Filipe Taveira)

---

## Contexte

Deuxième carte de visite numérique NFC, pour **Damien Pignat (Gérant, NP IMMOBILIER)**, syndic de copropriété. Architecture identique à la carte Interlo (Next.js 15, export statique, GitHub Pages), mais nouveau repo séparé, palette prestige, données et branding NP. Profil unique, données dans `config/profile.ts`.

---

## Stack technique

Identique à la carte Interlo :

| Élément | Choix |
|---|---|
| Framework | Next.js 15 App Router |
| Langage | TypeScript |
| Style | Tailwind CSS v3 |
| Animations | Framer Motion |
| Icônes | lucide-react (icônes fonctionnelles uniquement) |
| QR Code | qrcode.react (`<QRCodeCanvas>`) |
| Output | `output: 'export'` (statique pur) |
| Deploy | GitHub Actions → GitHub Pages |
| Backend / BDD | Aucun |

---

## Design visuel — palette prestige (option B « crème claire »)

| Rôle | Couleur |
|---|---|
| Fond page (`background`) | Crème `#F4F1EA` |
| Bannière | Dégradé crème `#EDEAE3 → #DAD3C2`, liseré or `#B89B6E` en bas |
| Texte principal (`primary`) | Marine `#16243F` |
| Accent (`accent`) | Or / champagne `#B89B6E` |
| Secondaire | Blanc `#FFFFFF` |

- **Style :** prestige immobilier, épuré, aéré, « boutique »
- **Avatar :** cercle marine `#16243F` avec bordure crème, contenant le **monogramme « NP » rendu en texte serif doré** (Playfair, `#B89B6E`) — pas de portrait, pas d'image (crisp à toute taille, fidèle à la maquette validée). Le logo NP complet (image) est réservé au favicon et à l'og:image.
- **CTA principal :** fond marine, texte blanc
- **Boutons action :** fond blanc, liseré or, texte marine
- **Cartes (À propos, QR) :** fond blanc, ombre douce, coins arrondis
- **Mobile First**, responsive iPhone / Android / tablette / desktop

### Typographie

- **Titres** (nom, titres de section) : **Playfair Display** (serif, poids **700 uniquement** pour rester léger)
- **Texte courant** : **Inter** (poids **400/600/700** uniquement — réduit vs Interlo)
- Chargées via `next/font/google` en **mode `variable`** (pas `.className`), car il y a deux polices :

```ts
// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], weight: ['400','600','700'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'], variable: '--font-playfair', display: 'swap' })
// <html className={`${inter.variable} ${playfair.variable}`}>
```

```ts
// tailwind.config.ts → theme.extend.fontFamily
fontFamily: {
  sans: ['var(--font-inter)', 'sans-serif'],
  serif: ['var(--font-playfair)', 'serif'],
}
```

- Titres → classe explicite **`font-serif`** (nom dans ProfileInfo, `<h2>` des sections). Le reste hérite de `sans` (Inter).
- `globals.css` : `body` applique `font-sans` (ou rien, Inter par défaut via le layout). Retirer l'ancien `@import` Google Fonts s'il existe dans la copie.
- **Lighthouse** : poids restreints + `display:swap` + auto-hébergement next/font → compatible >95. Le monogramme « NP » de l'avatar dépend de Playfair (preload assuré par next/font).

---

## Configuration centrale (`config/profile.ts`)

```typescript
export const profile = {
  name: 'Damien Pignat',
  title: 'Gérant',
  company: 'NP IMMOBILIER',
  description:
    'Syndic de copropriété — gestion administrative, financière et technique de votre immeuble, au quotidien.',

  phone: '+33978250645',
  email: 'd.pignat@np.immo',
  website: 'https://www.np-immobilier.fr',

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  aboutCompany:
    'NP IMMOBILIER est un syndic de copropriété à taille humaine. Nous assurons la gestion administrative, financière et technique de votre immeuble avec réactivité et transparence, pour préserver la valeur de votre patrimoine.',
} as const

export type Profile = typeof profile
```

Pas de champs `linkedin`, `instagram`, `facebook`, `whatsapp` (non fournis).

`description` (sous le nom, orientée personne/métier) et `aboutCompany` (présentation de l'entreprise) sont volontairement **distinctes** pour éviter la redondance.

### tailwind.config.ts — couleurs (à redéfinir, sinon la carte reste noir/bleu d'Interlo)

```ts
theme.extend.colors = {
  primary: '#16243F',   // marine (était #111111)
  accent:  '#B89B6E',   // or/champagne (était #0066FF)
  cream:   '#F4F1EA',   // fond page
  banner1: '#EDEAE3',   // dégradé bannière (début)
  banner2: '#DAD3C2',   // dégradé bannière (fin)
}
```

Tous les composants Interlo utilisent déjà `text-primary` / `bg-primary` / `text-accent` / `bg-accent` → ils se rebranderont automatiquement une fois ces valeurs changées. Le fond de page passe de `#F7F7F7` à `cream` **à deux endroits** : `app/globals.css` (`body`) **et** `app/page.tsx` (`bg-[#F7F7F7]` → `bg-cream`).

---

## Structure du projet

Identique à `nfc-card`, avec les composants suivants. **Composants retirés vs Interlo : `SocialGrid` et `BrandIcons`** (aucun réseau social).

```
np-card/
├── .github/workflows/deploy.yml   ← CI GitHub Pages (npm install, garde NEXT_PUBLIC_SITE_URL)
├── config/profile.ts              ← données Damien / NP
├── app/
│   ├── layout.tsx                 ← SEO, OG, JSON-LD, fonts (Playfair + Inter), favicon
│   ├── page.tsx                   ← composition (sans SocialGrid)
│   ├── globals.css
│   └── icon.png                   ← favicon = logo NP
├── components/
│   ├── NfcDetectedOverlay.tsx     ← overlay ?src=nfc (texte/couleur adaptés marine/or)
│   ├── ProfileHeader.tsx          ← bannière crème + avatar texte « NP » doré
│   ├── ProfileInfo.tsx            ← nom (serif) / Gérant (or) / NP IMMOBILIER / description
│   ├── ActionButtons.tsx          ← Appeler / Email / Site web (3 boutons, style blanc liseré or)
│   ├── AddContactButton.tsx       ← vCard (CTA marine)
│   ├── CompanySection.tsx         ← « À propos » + « Découvrir notre site »
│   └── QrCodeSection.tsx          ← QR + téléchargement PNG
├── lib/vcard.ts                   ← génération vCard v3.0 (avec N:)
├── public/
│   ├── logo.png                   ← logo NP (LOGO NP 3.png) — favicon + og:image (pas l'avatar)
│   └── CNAME                      ← ABSENT (pas de domaine perso ; URL github.io)
└── next.config.ts                 ← output export, basePath '/carte', images.unoptimized
```

---

## Composants — comportements (deltas vs Interlo)

### ProfileHeader
- Bannière dégradée crème `#EDEAE3 → #DAD3C2` avec liseré or en bas
- Avatar : cercle `#16243F` bordure crème, aligné à gauche, débordant ; contient le **texte « NP »** en Playfair serif doré `#B89B6E` (aucune image)
- Pas de second logo en haut à droite (l'avatar porte déjà la marque)
- Conséquence : **aucune balise `<img>` dans l'app** → pas de problème de basePath sur les images (contrairement à Interlo). Le favicon (`app/icon.png`) et l'og:image (URL absolue) gèrent le logo séparément.

### ProfileInfo
- Nom en **serif Playfair** (marine, bold), fonction en or, entreprise en gris/marine, description
- Animations Framer Motion fade-in + slide-up (identiques Interlo)

### ActionButtons
- 3 boutons (issus de `config/profile.ts`) : Appeler `tel:`, Email `mailto:`, Site web (externe)
- Style : fond blanc, bordure or `#B89B6E`, texte marine ; hover léger fond crème
- Icônes lucide : Phone, Mail, Globe
- Apparition en cascade (stagger)

### AddContactButton
- CTA fond marine `#16243F`, texte blanc
- vCard v3.0 : FN Damien Pignat, N, ORG NP IMMOBILIER, TITLE Gérant, TEL, EMAIL, URL
- Téléchargement `damien-pignat.vcf`

### CompanySection
- Carte blanche, titre « À propos de l'entreprise » (serif), texte, bouton « Découvrir notre site » → np-immobilier.fr

### QrCodeSection
- `<QRCodeCanvas>` avec `profile.siteUrl`, couleurs `fgColor="#16243F"` (marine), `bgColor="#ffffff"`
- Bouton « Télécharger le QR code » → PNG via `canvas.toDataURL`

### NfcDetectedOverlay
- Conditionnel `?src=nfc`, 1 s, auto-dismiss
- Fond marine semi-opaque, coche/texte or-crème (au lieu du blanc sur noir d'Interlo)

---

## SEO (`app/layout.tsx`)

- `<title>` : `Damien Pignat — Gérant | NP IMMOBILIER`
- `description` : la description courte
- Open Graph : title, description, url, `og:image` = `${siteUrl}/logo.png` (logo NP carré), type profile, `width/height = 512×512` (et non 400×400 hérité de la photo Interlo)
- Twitter Card : **`summary`** (carré) — adapté à un logo, contrairement à `summary_large_image` (paysage 1200×630) qui rognerait/encadrerait mal un logo carré
- ⚠️ Couplage basePath : comme `NEXT_PUBLIC_SITE_URL` contient déjà le segment `/carte`, `${siteUrl}/logo.png` → `https://npimmobilier.github.io/carte/logo.png` (correct car `logo.png` de `public/` est servi sous le basePath). À commenter dans `layout.tsx`.
- JSON-LD `Person` : Damien Pignat, jobTitle Gérant, worksFor NP IMMOBILIER (url np-immobilier.fr), email, telephone, url
- Favicon : `app/icon.png` (logo NP)
- Fonts : `next/font/google` Playfair Display + Inter
- Cible Lighthouse > 95

---

## GitHub Pages Deploy

### next.config.ts
```ts
const isProd = process.env.NODE_ENV === 'production'
const repoName = 'carte' // nom du repo sous l'org NPIMMOBILIER
const basePath = isProd ? `/${repoName}` : ''

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: { unoptimized: true },
}
export default nextConfig
```

> Différence vs Interlo : on **retire** `env: { NEXT_PUBLIC_BASE_PATH }` (Interlo l'utilisait pour préfixer ses `<img>`). Ici l'avatar est du texte et il n'y a aucune `<img>` dans l'app → cette variable serait du code mort.

### Workflow
- Identique à nfc-card : `npm install` (pas `npm ci`, deps optionnelles Linux), garde `NEXT_PUBLIC_SITE_URL`, deploy `out/` via `actions/deploy-pages@v4`.

### Dépôt & URL
- Repo : `github.com/NPIMMOBILIER/carte` (public)
- URL : `https://npimmobilier.github.io/carte`
- Variable de dépôt `NEXT_PUBLIC_SITE_URL = https://npimmobilier.github.io/carte`
- **Authentification** : `gh` connecté en `LeComiko` ; vérifier l'accès à l'org `NPIMMOBILIER` avant `gh repo create` (sinon `gh auth login` sur le compte NP, ou ajout en collaborateur).

### Puce NFC
- Nouvelle puce NTAG215, programmée avec `https://npimmobilier.github.io/carte?src=nfc`.

---

## Assets à fournir / utiliser

- **Logo NP** : `C:\Users\FilipeTAVEIRA\Downloads\LOGO NP 3.png` → optimisé en `public/logo.png` et `app/icon.png`. Sert de **favicon** et d'**og:image** (aperçu de partage). **Pas** utilisé comme avatar.
- Avatar = texte « NP » (pas d'image). Pas de photo de Damien.

---

## Checklist d'adaptation depuis la copie de `nfc-card`

Fichiers à **modifier** après copie :
- `config/profile.ts` → données Damien / NP (sans réseaux sociaux)
- `tailwind.config.ts` → couleurs (primary/accent/cream/banner) + `fontFamily` sans+serif
- `app/layout.tsx` → 2 polices `next/font` (variable), metadata NP, og:image 512², twitter `summary`, JSON-LD NP
- `app/globals.css` → `body` fond crème (retirer `#F7F7F7`), font-sans
- `app/page.tsx` → `bg-cream` (au lieu de `bg-[#F7F7F7]`), **retirer l'import + le `<SocialGrid />`**
- `components/ProfileHeader.tsx` → bannière crème + avatar texte « NP » serif doré ; **retirer les 2 `<img>` et la logique `NEXT_PUBLIC_BASE_PATH`**
- `components/ProfileInfo.tsx` → nom en `font-serif`
- `components/ActionButtons.tsx` → **retirer l'import `LinkedInIcon` + le bouton LinkedIn** (sinon build cassé) ; style boutons blanc/liseré or ; ne garder que Phone/Mail/Globe
- `components/AddContactButton.tsx` → CTA marine ; nom de fichier vCard `damien-pignat.vcf`
- `components/CompanySection.tsx` → titre `font-serif`
- `components/NfcDetectedOverlay.tsx` → remplacer `bg-black/80` (en dur) par `bg-primary/80`, texte adapté
- `components/QrCodeSection.tsx` → `fgColor="#16243F"` ; nom de fichier PNG `qr-code-np-immobilier.png`
- `next.config.ts` → `repoName = 'carte'`, retirer `env.NEXT_PUBLIC_BASE_PATH`

Fichiers/éléments à **supprimer** :
- `components/SocialGrid.tsx` et `components/BrandIcons.tsx`
- `__tests__/components/` → adapter/retirer les tests référant aux composants supprimés ou au nom « Filipe » ; **garder** les tests vcard et NfcDetectedOverlay (adaptés)
- `public/CNAME` (sinon force un domaine perso cassé)
- `public/photo.jpg` (plus d'avatar image)
- `docs/superpowers/specs/2026-06-02-nfc-card-design.md` et le plan Interlo (remplacer par ceux de NP)
- L'historique git Interlo : **init git frais** (ne pas copier `.git/`)

Fichiers à **conserver tels quels** : `lib/vcard.ts` (avec `N:`), `public/.nojekyll`, `vitest.config.ts`, `vitest.setup.ts`, workflow `deploy.yml` (avec `npm install` + guard `NEXT_PUBLIC_SITE_URL`).

Fichiers à **ajouter** :
- `public/logo.png` + `app/icon.png` (logo NP optimisé)

## Étape bloquante : accès GitHub `NPIMMOBILIER`

**Avant tout déploiement**, vérifier que le compte `gh` actif (`LeComiko`) peut créer un repo sous l'org/compte `NPIMMOBILIER` :
```
gh repo create NPIMMOBILIER/carte --public ...
```
Si échec (droits manquants) → fallback : ajouter `LeComiko` comme owner/admin de l'org, ou `gh auth login` avec le compte NP. Étapes manuelles post-création : activer **GitHub Pages (source = GitHub Actions)** et définir la variable `NEXT_PUBLIC_SITE_URL = https://npimmobilier.github.io/carte`.

## Hors scope

- Multi-profil / authentification / dashboard
- Réseaux sociaux (LinkedIn, Instagram, Facebook, WhatsApp)
- Analytics
- Domaine personnalisé (URL github.io par défaut)
