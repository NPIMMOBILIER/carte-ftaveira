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
