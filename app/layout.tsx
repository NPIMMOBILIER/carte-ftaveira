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
        url: `${profile.siteUrl}/logo.png`,
        width: 560,
        height: 357,
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
