import { describe, it, expect } from 'vitest'
import { generateVCard } from '@/lib/vcard'

describe('generateVCard', () => {
  it('returns a valid VCF string', () => {
    const result = generateVCard({
      name: 'Filipe Taveira',
      company: 'FT Solutions',
      title: 'Directeur Opérations',
      phone: '+33600000000',
      email: 'contact@ftsolutions.fr',
      website: 'https://ftsolutions.fr',
    })
    expect(result).toContain('BEGIN:VCARD')
    expect(result).toContain('VERSION:3.0')
    expect(result).toContain('FN:Filipe Taveira')
    expect(result).toContain('ORG:FT Solutions')
    expect(result).toContain('TEL:+33600000000')
    expect(result).toContain('END:VCARD')
  })
})
