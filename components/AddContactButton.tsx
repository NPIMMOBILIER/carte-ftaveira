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
    downloadVCard(vcf, 'filipe-taveira-np.vcf')
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
