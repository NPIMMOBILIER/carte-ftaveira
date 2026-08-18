# NP IMMOBILIER NFC Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire une 2ᵉ carte de visite NFC statique pour Damien Pignat (Gérant, NP IMMOBILIER), copie rebrandée de la carte Interlo, palette prestige crème/marine/or, déployée sur GitHub Pages sous `github.com/NPIMMOBILIER/carte`.

**Architecture:** Copier les fichiers du projet `nfc-card` (sans `.git`) dans `np-card`, supprimer les éléments inutiles (réseaux sociaux, photo, CNAME), appliquer le rebrand (couleurs Tailwind, 2 polices next/font, données NP, avatar texte). Aucune `<img>` dans l'app (avatar = texte). Déploiement GitHub Actions + Pages, basePath `/carte`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v3, Framer Motion, lucide-react (icônes fonctionnelles), qrcode.react, Playfair Display + Inter (next/font/google), Vitest.

**Répertoires :**
- Source (lecture seule) : `C:\Users\FilipeTAVEIRA\nfc-card`
- Cible : `C:\Users\FilipeTAVEIRA\np-card`
- Logo source : `C:\Users\FilipeTAVEIRA\Downloads\LOGO NP 3.png`

---

## File Map

| Fichier | Action |
|---------|--------|
| (tout le projet nfc-card sauf `.git`, `node_modules`, `out`, `.next`, `.superpowers`) | Copier vers np-card |
| `config/profile.ts` | Réécrire (données NP) |
| `tailwind.config.ts` | Réécrire (couleurs + fontFamily sans/serif) |
| `app/globals.css` | Modifier (fond crème) |
| `app/layout.tsx` | Réécrire (2 polices, metadata NP, og, JSON-LD) |
| `app/page.tsx` | Modifier (retirer SocialGrid, bg-cream) |
| `components/ProfileHeader.tsx` | Réécrire (bannière crème, avatar texte NP) |
| `components/ProfileInfo.tsx` | Modifier (nom font-serif) |
| `components/ActionButtons.tsx` | Réécrire (3 boutons, style or, sans LinkedIn) |
| `components/AddContactButton.tsx` | Modifier (CTA marine, vcf damien) |
| `components/CompanySection.tsx` | Modifier (titre font-serif) |
| `components/NfcDetectedOverlay.tsx` | Modifier (fond marine) |
| `components/QrCodeSection.tsx` | Modifier (fg marine, png renommé) |
| `components/SocialGrid.tsx` | Supprimer |
| `components/BrandIcons.tsx` | Supprimer |
| `__tests__/components/AddContactButton.test.tsx` | Modifier (label inchangé, ok) ou conserver |
| `next.config.ts` | Réécrire (repoName carte, sans env) |
| `public/CNAME` | Supprimer |
| `public/photo.jpg` | Supprimer |
| `public/logo.png`, `app/icon.png` | Remplacer par logo NP optimisé |
| `docs/superpowers/specs|plans` Interlo | Supprimer (garder ceux de NP) |

---

### Task 1: Copier la base et nettoyer

**Files:**
- Create: tout `np-card/` (copie de `nfc-card/`)

- [ ] **Step 1.1: Copier les fichiers source (sans .git ni artefacts)**

Le dossier `C:\Users\FilipeTAVEIRA\np-card` existe déjà (contient `docs/superpowers/specs|plans` de NP). Copier les fichiers de `nfc-card` SANS écraser les docs NP et SANS `.git`, `node_modules`, `out`, `.next`, `.superpowers` :

```bash
cd "C:/Users/FilipeTAVEIRA"
# Copier tout sauf les exclusions, en préservant les docs NP déjà présents
rsync -a --exclude='.git' --exclude='node_modules' --exclude='out' --exclude='.next' --exclude='.superpowers' --exclude='docs' nfc-card/ np-card/
# Copier package files et configs racine explicitement si rsync indispo (fallback)
```

Si `rsync` n'est pas disponible sous Git Bash Windows, fallback :
```bash
cd "C:/Users/FilipeTAVEIRA/nfc-card"
cp -r app components config lib public next.config.ts package.json package-lock.json tsconfig.json tailwind.config.ts postcss.config.mjs vitest.config.ts vitest.setup.ts __tests__ .github .gitignore "C:/Users/FilipeTAVEIRA/np-card/"
```

- [ ] **Step 1.2: Supprimer les fichiers obsolètes pour NP**

```bash
cd "C:/Users/FilipeTAVEIRA/np-card"
rm -f components/SocialGrid.tsx components/BrandIcons.tsx
rm -f public/CNAME public/photo.jpg
```

(Les docs/specs Interlo ne sont jamais copiés car `docs` est exclu de la copie — rien à supprimer côté docs.)

- [ ] **Step 1.3: Optimiser le logo NP en avatar/favicon**

`sharp` est disponible. Le logo `LOGO NP 3.png` sert au favicon + og:image (pas l'avatar). Le redimensionner proprement :

```bash
cd "C:/Users/FilipeTAVEIRA/np-card"
node -e "const sharp=require('sharp'); sharp('C:/Users/FilipeTAVEIRA/Downloads/LOGO NP 3.png').resize(512,512,{fit:'contain',background:{r:244,g:241,b:234,alpha:1}}).png().toFile('public/logo.png').then(i=>console.log('logo.png',i.width+'x'+i.height)).catch(e=>console.error(e.message))"
cp public/logo.png app/icon.png
```

- [ ] **Step 1.4: Initialiser git frais et commit initial**

```bash
cd "C:/Users/FilipeTAVEIRA/np-card"
git init
git add -A
git commit -m "chore: scaffold NP card from nfc-card base (cleaned)"
```

- [ ] **Step 1.5: Installer les dépendances et vérifier le point de départ**

```bash
cd "C:/Users/FilipeTAVEIRA/np-card"
npm install
npm test
```

Résultat attendu : `npm install` OK. `npm test` peut ÉCHOUER si un test référence un composant supprimé — on le corrige en Task 12. Note l'état pour référence.

---

### Task 2: config/profile.ts (données NP)

**Files:**
- Modify: `config/profile.ts`

- [ ] **Step 2.1: Réécrire le fichier**

```typescript
export const profile = {
  // Identité
  name: 'Damien Pignat',
  title: 'Gérant',
  company: 'NP IMMOBILIER',
  description:
    'Syndic de copropriété — gestion administrative, financière et technique de votre immeuble, au quotidien.',

  // Contact
  phone: '+33978250645',
  email: 'd.pignat@np.immo',
  website: 'https://www.np-immobilier.fr',

  // URL du profil (injectée depuis la variable d'environnement)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  // Contenu entreprise
  aboutCompany:
    'NP IMMOBILIER est un syndic de copropriété à taille humaine. Nous assurons la gestion administrative, financière et technique de votre immeuble avec réactivité et transparence, pour préserver la valeur de votre patrimoine.',
} as const

export type Profile = typeof profile
```

- [ ] **Step 2.2: Committer**

```bash
git add config/profile.ts
git commit -m "feat: NP IMMOBILIER profile data (Damien Pignat)"
```

---

### Task 3: tailwind.config.ts + globals.css

**Files:**
- Modify: `tailwind.config.ts`, `app/globals.css`

- [ ] **Step 3.1: Réécrire tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#16243F',   // marine
        accent: '#B89B6E',    // or / champagne
        cream: '#F4F1EA',     // fond page
        banner1: '#EDEAE3',   // bannière début
        banner2: '#DAD3C2',   // bannière fin
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 3.2: Réécrire app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Polices appliquées via next/font (variables sur <html>). */

* {
  -webkit-tap-highlight-color: transparent;
}

body {
  background-color: #F4F1EA;
}
```

- [ ] **Step 3.3: Vérifier le build**

```bash
npm run build
```
Résultat attendu : SUCCESS (les composants ne sont pas encore tous adaptés mais doivent compiler).

- [ ] **Step 3.4: Committer**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "style: NP prestige palette (navy/gold/cream) and font families"
```

---

### Task 4: app/layout.tsx (2 polices, SEO NP)

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 4.1: Réécrire le fichier**

```typescript
import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { profile } from '@/config/profile'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title} | ${profile.company}`,
  description: profile.description,
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: profile.description,
    url: profile.siteUrl,
    siteName: profile.company,
    images: [
      {
        // siteUrl contient déjà le basePath /carte → logo servi sous /carte/logo.png
        url: `${profile.siteUrl}/logo.png`,
        width: 512,
        height: 512,
        alt: profile.company,
      },
    ],
    type: 'profile',
  },
  twitter: {
    card: 'summary',
    title: `${profile.name} — ${profile.title}`,
    description: profile.description,
    images: [`${profile.siteUrl}/logo.png`],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.title,
  worksFor: {
    '@type': 'Organization',
    name: profile.company,
    url: profile.website,
  },
  email: profile.email,
  telephone: profile.phone,
  url: profile.siteUrl,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 4.2: Committer**

```bash
git add app/layout.tsx
git commit -m "feat: NP SEO metadata, dual fonts (Playfair + Inter), square OG image"
```

---

### Task 5: components/ProfileHeader.tsx (bannière crème + avatar texte NP)

**Files:**
- Modify: `components/ProfileHeader.tsx`

- [ ] **Step 5.1: Réécrire le fichier (aucune `<img>`, avatar texte serif)**

```typescript
export function ProfileHeader() {
  return (
    <div className="relative">
      {/* Bannière dégradée crème + liseré or */}
      <div className="h-40 border-b-2 border-accent bg-gradient-to-br from-banner1 to-banner2" />

      {/* Avatar monogramme NP, aligné à gauche, débordant */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 px-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-cream bg-primary shadow-lg">
          <span className="font-serif text-3xl font-bold tracking-tight text-accent">NP</span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5.2: Committer**

```bash
git add components/ProfileHeader.tsx
git commit -m "feat: cream banner with serif NP monogram avatar (no image)"
```

---

### Task 6: components/ProfileInfo.tsx (nom en serif)

**Files:**
- Modify: `components/ProfileInfo.tsx`

- [ ] **Step 6.1: Réécrire le fichier**

```typescript
'use client'

import { motion } from 'framer-motion'
import { profile } from '@/config/profile'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export function ProfileInfo() {
  return (
    <motion.div
      className="mt-16 px-6 pb-2"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.h1
        className="font-serif text-2xl font-bold text-primary"
        variants={item}
      >
        {profile.name}
      </motion.h1>
      <motion.p
        className="mt-0.5 text-base font-semibold text-accent"
        variants={item}
      >
        {profile.title}
      </motion.p>
      <motion.p
        className="text-sm font-medium text-gray-500"
        variants={item}
      >
        {profile.company}
      </motion.p>
      <motion.p
        className="mt-3 text-sm leading-relaxed text-gray-600"
        variants={item}
      >
        {profile.description}
      </motion.p>
    </motion.div>
  )
}
```

- [ ] **Step 6.2: Committer**

```bash
git add components/ProfileInfo.tsx
git commit -m "feat: serif name heading in ProfileInfo"
```

---

### Task 7: components/ActionButtons.tsx (3 boutons, style or, sans LinkedIn/BrandIcons)

**Files:**
- Modify: `components/ActionButtons.tsx`

- [ ] **Step 7.1: Réécrire le fichier (retire l'import LinkedInIcon — sinon build cassé après suppression de BrandIcons)**

```typescript
'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Globe } from 'lucide-react'
import { profile } from '@/config/profile'

const buttons = [
  { label: 'Appeler', href: `tel:${profile.phone}`, icon: Phone },
  { label: 'Email', href: `mailto:${profile.email}`, icon: Mail },
  { label: 'Site web', href: profile.website, icon: Globe },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export function ActionButtons() {
  return (
    <motion.div
      className="mt-6 flex flex-col gap-3 px-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {buttons.map(({ label, href, icon: Icon }) => (
        <motion.a
          key={label}
          href={href}
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          variants={item}
          className="flex items-center gap-4 rounded-2xl border border-accent bg-white px-5 py-4 text-primary shadow-sm transition-colors hover:bg-cream active:scale-95"
        >
          <Icon size={20} className="shrink-0 text-accent" />
          <span className="text-sm font-semibold">{label}</span>
        </motion.a>
      ))}
    </motion.div>
  )
}
```

- [ ] **Step 7.2: Committer**

```bash
git add components/ActionButtons.tsx
git commit -m "feat: 3 action buttons (white/gold outline), drop LinkedIn"
```

---

### Task 8: components/AddContactButton.tsx (CTA marine, vcf damien)

**Files:**
- Modify: `components/AddContactButton.tsx`

- [ ] **Step 8.1: Réécrire le fichier**

```typescript
'use client'

import { UserPlus } from 'lucide-react'
import { profile } from '@/config/profile'
import { generateVCard, downloadVCard } from '@/lib/vcard'

export function AddContactButton() {
  function handleClick() {
    const vcf = generateVCard({
      name: profile.name,
      company: profile.company,
      title: profile.title,
      phone: profile.phone,
      email: profile.email,
      website: profile.website,
    })
    downloadVCard(vcf, 'damien-pignat.vcf')
  }

  return (
    <div className="mt-4 px-6">
      <button
        onClick={handleClick}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-white shadow-md transition-transform active:scale-95 hover:opacity-90"
      >
        <UserPlus size={20} />
        <span className="text-sm font-bold tracking-wide">Ajouter à mes contacts</span>
      </button>
    </div>
  )
}
```

- [ ] **Step 8.2: Committer**

```bash
git add components/AddContactButton.tsx
git commit -m "feat: navy vCard CTA, damien-pignat.vcf filename"
```

---

### Task 9: components/CompanySection.tsx (titre serif)

**Files:**
- Modify: `components/CompanySection.tsx`

- [ ] **Step 9.1: Réécrire le fichier**

```typescript
import { ExternalLink } from 'lucide-react'
import { profile } from '@/config/profile'

export function CompanySection() {
  return (
    <div className="mt-6 px-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-serif text-base font-bold text-primary">À propos de l&apos;entreprise</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {profile.aboutCompany}
        </p>
        <a
          href={profile.website}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center gap-2 text-sm font-semibold text-accent hover:underline"
        >
          Découvrir notre site
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 9.2: Committer**

```bash
git add components/CompanySection.tsx
git commit -m "feat: serif heading in CompanySection"
```

---

### Task 10: components/NfcDetectedOverlay.tsx (fond marine)

**Files:**
- Modify: `components/NfcDetectedOverlay.tsx`

- [ ] **Step 10.1: Réécrire le fichier (fond marine au lieu de noir, coche/texte crème-or)**

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function NfcDetectedOverlay() {
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('src') === 'nfc') {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex flex-col items-center gap-3 text-cream"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent text-3xl text-accent"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              ✓
            </motion.div>
            <p className="text-xl font-semibold tracking-wide">Carte détectée</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 10.2: Vérifier que les tests de l'overlay passent toujours**

```bash
npm test -- NfcDetectedOverlay
```
Résultat attendu : 2 tests PASS (le texte « Carte détectée » est inchangé).

- [ ] **Step 10.3: Committer**

```bash
git add components/NfcDetectedOverlay.tsx
git commit -m "style: navy NFC overlay with gold accent"
```

---

### Task 11: components/QrCodeSection.tsx (fg marine, png renommé)

**Files:**
- Modify: `components/QrCodeSection.tsx`

- [ ] **Step 11.1: Réécrire le fichier**

```typescript
'use client'

import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Download } from 'lucide-react'
import { profile } from '@/config/profile'

export function QrCodeSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  function handleDownload() {
    const canvas = containerRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'qr-code-np-immobilier.png'
    link.href = url
    link.click()
  }

  return (
    <div className="mt-6 px-6 pb-12">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-center font-serif text-base font-bold text-primary">
          Partager ma carte
        </h2>
        <div ref={containerRef} className="flex justify-center">
          <QRCodeCanvas
            value={profile.siteUrl}
            size={160}
            bgColor="#ffffff"
            fgColor="#16243F"
            level="M"
          />
        </div>
        <button
          onClick={handleDownload}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-primary transition-colors hover:bg-cream active:scale-95"
        >
          <Download size={16} />
          Télécharger le QR code
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 11.2: Committer**

```bash
git add components/QrCodeSection.tsx
git commit -m "style: navy QR code, NP filename, serif heading"
```

---

### Task 12: app/page.tsx (retirer SocialGrid) + corriger les tests

**Files:**
- Modify: `app/page.tsx`
- Modify/Verify: `__tests__/components/`

- [ ] **Step 12.1: Réécrire app/page.tsx (sans SocialGrid, fond crème)**

```typescript
import { Suspense } from 'react'
import { NfcDetectedOverlay } from '@/components/NfcDetectedOverlay'
import { ProfileHeader } from '@/components/ProfileHeader'
import { ProfileInfo } from '@/components/ProfileInfo'
import { AddContactButton } from '@/components/AddContactButton'
import { ActionButtons } from '@/components/ActionButtons'
import { CompanySection } from '@/components/CompanySection'
import { QrCodeSection } from '@/components/QrCodeSection'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-cream">
      <Suspense>
        <NfcDetectedOverlay />
      </Suspense>

      <div className="mx-auto max-w-md">
        <ProfileHeader />
        <ProfileInfo />
        <AddContactButton />
        <ActionButtons />
        <CompanySection />
        <QrCodeSection />
      </div>
    </main>
  )
}
```

- [ ] **Step 12.2: Vérifier les tests existants**

```bash
npm test
```

Le test `AddContactButton.test.tsx` vérifie le label « Ajouter à mes contacts » (inchangé) et le déclenchement du download — il doit PASSER tel quel. Le test `NfcDetectedOverlay.test.tsx` doit PASSER. Le test `vcard.test.ts` doit PASSER. Aucun test ne référence SocialGrid/BrandIcons (vérifié : seuls vcard, overlay, AddContactButton ont des tests). Si un test échoue à cause d'une référence à un fichier supprimé, le corriger ; sinon ne rien changer.

Résultat attendu : tous les tests PASS.

- [ ] **Step 12.3: Committer**

```bash
git add app/page.tsx __tests__/
git commit -m "feat: assemble NP page without social grid"
```

---

### Task 13: next.config.ts (repoName carte)

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 13.1: Réécrire le fichier**

```typescript
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

- [ ] **Step 13.2: Committer**

```bash
git add next.config.ts
git commit -m "chore: static export config for /carte basePath"
```

---

### Task 14: Vérification finale (build + tests + contenu)

**Files:** aucun

- [ ] **Step 14.1: Tests**

```bash
npm test
```
Attendu : tous PASS.

- [ ] **Step 14.2: Build de production + vérif rebrand**

```bash
npm run build
node -e "const h=require('fs').readFileSync('out/index.html','utf8'); ['Damien Pignat','Gérant','NP IMMOBILIER','copropriété','application/ld+json'].forEach(s=>console.log((h.includes(s)?'OK  ':'MISS')+' '+s)); console.log('aucune <img>?', /<img/.test(h)?'NON (revoir)':'OUI'); console.log('basePath /carte/ assets?', h.includes('/carte/_next')?'OK':'à vérifier')"
```
Attendu : tous OK, aucune `<img>`, assets sous `/carte/_next`.

- [ ] **Step 14.3: Vérif visuelle locale (dev, sans basePath)**

```bash
npm run dev
```
Ouvrir `http://localhost:3000` : bannière crème, avatar marine « NP » doré, nom en serif, 3 boutons blancs liserés or, CTA marine, section À propos, QR marine. Ajouter `?src=nfc` → overlay marine « ✓ Carte détectée ». Arrêter le serveur (Ctrl+C) après vérification.

---

### Task 15: Déploiement GitHub Pages (org NPIMMOBILIER)

**Files:** aucun (opérations distantes)

- [ ] **Step 15.1: ÉTAPE BLOQUANTE — vérifier l'accès à l'org NPIMMOBILIER**

```bash
gh auth status
gh api user/orgs --jq '.[].login' 2>&1 | head
gh api orgs/NPIMMOBILIER 2>&1 | head -3 || echo "org non accessible avec ce compte"
```
Si `NPIMMOBILIER` n'est pas accessible/membre : **s'arrêter et demander à l'utilisateur** d'ajouter `LeComiko` comme owner/admin de l'org, ou de faire `gh auth login` avec le compte NP. Ne pas continuer sans accès.

- [ ] **Step 15.2: Créer le repo et pousser**

```bash
cd "C:/Users/FilipeTAVEIRA/np-card"
gh repo create NPIMMOBILIER/carte --public --source=. --remote=origin --push
```

- [ ] **Step 15.3: Définir la variable et activer Pages**

```bash
gh variable set NEXT_PUBLIC_SITE_URL --repo NPIMMOBILIER/carte --body "https://npimmobilier.github.io/carte"
gh api --method POST repos/NPIMMOBILIER/carte/pages -f build_type=workflow
```

- [ ] **Step 15.4: Surveiller le déploiement**

```bash
gh run list --repo NPIMMOBILIER/carte --limit 1 --json databaseId --jq '.[0].databaseId'
# puis : gh run watch <id> --repo NPIMMOBILIER/carte --exit-status
```
Attendu : run SUCCESS.

- [ ] **Step 15.5: Vérifier le site live**

```bash
curl -s -o /dev/null -w "page: %{http_code}\n" "https://npimmobilier.github.io/carte/"
curl -s -o /dev/null -w "logo: %{http_code}\n" "https://npimmobilier.github.io/carte/logo.png"
curl -s "https://npimmobilier.github.io/carte/" | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>['Damien Pignat','NP IMMOBILIER','Gérant'].forEach(s=>console.log((d.includes(s)?'OK':'MISS')+' '+s)))"
```
Attendu : 200 + contenu présent.

- [ ] **Step 15.6: Programmer la puce NFC**

Avec NFC Tools, écrire sur une **nouvelle** puce NTAG215 (différente de la puce Interlo) l'URL :
```
https://npimmobilier.github.io/carte?src=nfc
```

---

## Checklist de couverture spec

| Exigence spec | Tâche |
|---|---|
| Copie rebrandée de nfc-card | Task 1 |
| Données Damien / NP | Task 2 |
| Palette marine/or/crème (Tailwind) | Task 3 |
| 2 polices next/font (Playfair + Inter, variable) | Task 4 |
| Avatar texte « NP » serif (pas d'img) | Task 5 |
| Nom en serif | Task 6 |
| 3 boutons, suppression LinkedIn/BrandIcons | Task 7 |
| vCard CTA marine, damien-pignat.vcf | Task 8 |
| Section À propos (serif) | Task 9 |
| Overlay NFC marine | Task 10 |
| QR marine, png renommé | Task 11 |
| page sans SocialGrid, fond crème + tests | Task 12 |
| next.config basePath /carte, sans env | Task 13 |
| Suppression CNAME/photo.jpg | Task 1 |
| og:image 512² + twitter summary | Task 4 |
| Déploiement org NPIMMOBILIER (auth bloquante) | Task 15 |
| Puce NFC ?src=nfc | Task 15 |
