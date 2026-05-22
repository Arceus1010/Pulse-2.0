import { useContext } from 'react'

import { ResearchContext } from '../context/ResearchContext'
import type { ResearchState, ResearchAction, ResearchContextValue } from '../context/ResearchContext'

export type { ResearchState, ResearchAction, ResearchContextValue }

export function useResearch() {
  const ctx = useContext(ResearchContext)
  if (!ctx) throw new Error('useResearch must be used within <ResearchProvider>')
  return ctx
}
