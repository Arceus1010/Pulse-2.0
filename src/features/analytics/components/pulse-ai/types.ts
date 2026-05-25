export type TabKey = 'overview' | 'trend' | 'sentiment' | 'source' | 'geo' | 'pestle'

export interface TabHint {
  label: string
  tab: TabKey
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  /** context-event: renders as a full-width divider, not a bubble */
  variant?: 'context-event'
  /** carried on context-event messages — snapshot of the new keyword set */
  keywords?: string[]
  /** AI only: highlighted insight shown in a callout box below the body */
  callout?: string
  /** AI only: navigate-to-tab affordance chip */
  tabHint?: TabHint
  /** AI only: simulated response latency in ms */
  responseTimeMs?: number
  timestamp: number
}

export interface AIResponse {
  content: string
  callout?: string
  tabHint?: TabHint
}

export interface PulseAIWidgetProps {
  hasAnalysed: boolean
  keywords: string[]
}
