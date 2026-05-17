import type { Sentiment } from '../types'

const CLASSES: Record<Sentiment, string> = {
  positive: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  negative: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
  neutral:  'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400',
}

interface Props {
  sentiment: Sentiment
  className?: string
}

export default function SentimentBadge({ sentiment, className }: Props) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${CLASSES[sentiment]} ${className ?? ''}`}>
      {sentiment}
    </span>
  )
}
