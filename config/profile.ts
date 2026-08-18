export const profile = {
  // Identité
  name: 'Filipe Taveira',
  title: 'Gestionnaire & Associé',
  company: 'NP IMMOBILIER',
  description:
    'J\'assure le pilotage complet d\'un portefeuille de copropriétés : supervision des travaux de rénovation énergétique, gestion des prestataires intervenants, et veille sur la conformité réglementaire.',

  // Contact
  phone: '+33978250643',
  email: 'f.taveira@np.immo',
  website: 'https://www.np-immobilier.fr',

  // URL du profil (injectée depuis la variable d'environnement)
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',

  // Contenu entreprise
  aboutCompany:
    'NP IMMOBILIER est un syndic de copropriété à taille humaine. Nous assurons la gestion administrative, financière et technique de votre immeuble avec réactivité et transparence, pour préserver la valeur de votre patrimoine.',
} as const

export type Profile = typeof profile
