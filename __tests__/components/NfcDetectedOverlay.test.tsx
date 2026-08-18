import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NfcDetectedOverlay } from '@/components/NfcDetectedOverlay'

// Mock useSearchParams
vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}))

import { useSearchParams } from 'next/navigation'

describe('NfcDetectedOverlay', () => {
  it('ne s\'affiche pas sans le paramètre src=nfc', () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => null,
    } as ReturnType<typeof useSearchParams>)

    render(<NfcDetectedOverlay />)
    expect(screen.queryByText('Carte détectée')).not.toBeInTheDocument()
  })

  it('s\'affiche avec le paramètre src=nfc', () => {
    vi.mocked(useSearchParams).mockReturnValue({
      get: (key: string) => (key === 'src' ? 'nfc' : null),
    } as ReturnType<typeof useSearchParams>)

    render(<NfcDetectedOverlay />)
    expect(screen.getByText('Carte détectée')).toBeInTheDocument()
  })
})
