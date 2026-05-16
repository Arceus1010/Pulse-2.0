import { useState } from 'react'
import SentimentStackedBar from '../components/charts/SentimentStackedBar'
import TrendLineChart from '../components/charts/TrendLineChart'
import HorizontalBar from '../components/charts/HorizontalBar'
import InfluencerCard from '../components/InfluencerCard'
import {
  sentimentByPeriod, overallSentiment, sentimentByPlatform,
  negativeDrivers, influencers, issues,
} from '../mock-data'
import { SENTIMENT_COLORS } from '../constants'

const SENT_LEGEND = [
  { label: 'Positive', color: SENTIMENT_COLORS.positive },
  { label: 'Neutral', color: SENTIMENT_COLORS.neutral },
  { label: 'Negative', color: SENTIMENT_COLORS.negative },
]

function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400 shrink-0">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-4 mb-3">
      {items.map(i => (
        <span key={i.label} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  )
}

type InfTab = 'negative' | 'positive' | 'neutral'

export default function SentimentPage() {
  const [infTab, setInfTab] = useState<InfTab>('negative')

  return (
    <div className="flex flex-col gap-5">

      {/* Row 1: Overall sentiment KPI chips */}
      <div className="grid grid-cols-3 gap-3">
        {overallSentiment.map(s => (
          <div
            key={s.name}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-3">
              {s.name} Sentiment
            </p>
            <p className="text-2xl font-bold leading-none mb-2" style={{ color: s.color }}>
              {s.value}%
            </p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500">of total mentions</p>
          </div>
        ))}
      </div>

      {/* Row 2: Sentiment over time (line) + by platform (horizontal stacked bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <SectionCard title="Sentiment Over Time">
            <Legend items={SENT_LEGEND} />
            <TrendLineChart
              data={sentimentByPeriod}
              xKey="period"
              lines={[
                { key: 'positive', color: SENTIMENT_COLORS.positive, label: 'Positive' },
                { key: 'neutral', color: SENTIMENT_COLORS.neutral, label: 'Neutral', dashed: true },
                { key: 'negative', color: SENTIMENT_COLORS.negative, label: 'Negative' },
              ]}
              height={240}
              valueFormatter={v => `${v}%`}
            />
          </SectionCard>
        </div>
        <div className="lg:col-span-2">
          <SectionCard title="Sentiment by Platform">
            <Legend items={SENT_LEGEND} />
            <SentimentStackedBar data={sentimentByPlatform} xKey="platform" height={240} horizontal />
          </SectionCard>
        </div>
      </div>

      {/* Row 3: Top negative drivers (bar) + Top influencers (tabbed cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 flex flex-col">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg flex flex-col h-full">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400 shrink-0">Top Negative Drivers</h2>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex-1 min-h-0">
                <HorizontalBar data={negativeDrivers} valueFormatter={v => `${v}%`} height="100%" />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden h-full">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400 shrink-0">Top Influencers</h2>
              <div className="flex gap-0.5 bg-slate-100 dark:bg-zinc-800 rounded-md p-0.5">
                {(['negative', 'positive', 'neutral'] as InfTab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setInfTab(t)}
                    className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors whitespace-nowrap ${
                      infTab === t
                        ? 'bg-white dark:bg-zinc-700 text-slate-800 dark:text-zinc-100 shadow-sm'
                        : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {influencers[infTab].map((inf, i) => <InfluencerCard key={i} inf={inf} />)}
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: Issues list — full width */}
      <SectionCard
        title={`Top ${Math.min(issues.length, 50)} of ${issues.length} results for "SSM"`}
        action={<span className="text-[10px] text-slate-400 dark:text-zinc-500">Ranked by relevance</span>}
      >
        <ol className="divide-y divide-slate-100 dark:divide-zinc-800 max-h-96 overflow-y-auto -mx-4 -mb-4">
          {issues.slice(0, 50).map(issue => (
            <li key={issue.id} className="flex items-start gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 pt-0.5 min-w-6">{issue.id}</span>
              <div>
                <p className="text-xs font-medium text-blue-700 dark:text-blue-400 leading-snug cursor-pointer hover:underline">{issue.title}</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">{issue.snippet}</p>
              </div>
            </li>
          ))}
        </ol>
      </SectionCard>

    </div>
  )
}
