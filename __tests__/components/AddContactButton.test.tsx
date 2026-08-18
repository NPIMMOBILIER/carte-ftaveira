import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AddContactButton } from '@/components/AddContactButton'

describe('AddContactButton', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL / revokeObjectURL (absents de jsdom)
    global.URL.createObjectURL = vi.fn(() => 'blob:mock')
    global.URL.revokeObjectURL = vi.fn()

    // On intercepte le click de l'ancre via le prototype — évite de remplacer
    // document.createElement (qui provoque une récursion infinie une fois spié).
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('rend le bouton avec le bon label', () => {
    render(<AddContactButton />)
    expect(screen.getByText('Ajouter à mes contacts')).toBeInTheDocument()
  })

  it('déclenche un téléchargement au clic', () => {
    render(<AddContactButton />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(URL.createObjectURL).toHaveBeenCalledOnce()
  })
})
