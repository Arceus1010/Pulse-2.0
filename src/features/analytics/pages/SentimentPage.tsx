import { useState } from 'react'
import SentimentStackedBar from '../components/charts/SentimentStackedBar'
import DonutChart from '../components/charts/DonutChart'
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
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">{title}</h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function Legend({ items }: { items: { label: string; color: string; value?: string }[] }) {
  return (
    <div className="flex flex-wrap gap-4 mb-3">
      {items.map(i => (
        <span key={i.label} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
          <span className="w-2 h-2 rounded-sm inline-block" style={{ background: i.color }} />
          {i.label}{i.value ? ` ${i.value}` : ''}
        </span>
      ))}
    </div>
  )
}

type InfTab = 'negative' | 'positive' | 'neutral'

export default function SentimentPage() {
  const [infTab, setInfTab] = useState<InfTab>('negative')

  return (
    <div className="flex flex-col gap-6">
      {/* Sentiment over time + overall */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SectionCard title="Sentiment Over Time">
            <Legend items={SENT_LEGEND} />
            <SentimentStackedBar data={sentimentByPeriod} height={240} />
          </SectionCard>
        </div>
        <SectionCard title="Overall Sentiment">
          <Legend items={overallSentiment.map(s => ({ label: s.name, color: s.color, value: `${s.value}%` }))} />
          <DonutChart data={overallSentiment} height={200} />
        </SectionCard>
      </div>

      {/* By platform */}
      <SectionCard title="Sentiment by Platform">
        <Legend items={SENT_LEGEND} />
        <SentimentStackedBar data={sentimentByPlatform} xKey="platform" height={220} />
      </SectionCard>

      {/* Influencers */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">Top Influencers</h2>
          <div className="flex gap-1">
            {(['negative', 'positive', 'neutral'] as InfTab[]).map(t => (
              <button
                key={t}
                onClick={() => setInfTab(t)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                  infTab === t
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400'
                    : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {influencers[infTab].map((inf, i) => <InfluencerCard key={i} inf={inf} />)}
        </div>
      </div>

      {/* Neg drivers + Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2">
          <SectionCard title="Top Negative Drivers">
            <Legend items={negativeDrivers.map(d => ({ label: `${d.name} ${d.value}%`, color: d.color }))} />
            <DonutChart data={negativeDrivers} height={220} innerRadius={50} />
          </SectionCard>
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden h-full">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                Top {issues.slice(0, 50).length} of {issues.length} results for "SSM"
              </h2>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500">Ranked by relevance</span>
            </div>
            <ol className="divide-y divide-slate-100 dark:divide-zinc-800 max-h-72 overflow-y-auto">
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
          </div>
        </div>
      </div>
    </div>
  )
}
