import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LoaExplorer } from '@/features/loa/LoaExplorer'

describe('LoaExplorer', () => {
  it('renders categories tabs', () => {
    render(<LoaExplorer />)
    expect(screen.getByText(/Strings/i)).toBeInTheDocument()
    expect(screen.getByText(/Dates/i)).toBeInTheDocument()
  })

  it('shows result panel placeholder initially', () => {
    render(<LoaExplorer />)
    expect(
      screen.getAllByText(/Result will appear here after running the tool./i)[0],
    ).toBeInTheDocument()
  })
})

