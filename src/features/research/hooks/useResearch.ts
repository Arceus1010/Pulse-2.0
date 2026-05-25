import { useContext } from 'react'

import { ResearchContext } from '../context/research.context'
import type { ResearchContextValue, ResearchState, ResearchAction } from '../context/research.context'

export type { ResearchState, ResearchAction, ResearchContextValue }

export function useResearch() {
  const ctx = useContext(ResearchContext)
  if (!ctx) throw new Error('useResearch must be used within <ResearchProvider>')
  return ctx
}
