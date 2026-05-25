import { createContext } from 'react'

import type { ResearchState, ResearchAction } from './types'

export type { ResearchState, ResearchAction }

export interface ResearchContextValue {
  state: ResearchState
  dispatch: React.Dispatch<ResearchAction>
}

export const ResearchContext = createContext<ResearchContextValue | null>(null)
