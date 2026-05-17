import { useState } from 'react'
import SentimentStackedBar from '../components/charts/SentimentStackedBar'
import TrendLineChart from '../components/charts/TrendLineChart'
import HorizontalBar from '../components/charts/HorizontalBar'
import InfluencerCard from '../components/InfluencerCard'
import SectionCard from '../../../components/ui/SectionCard'
import TabBar from '../../../components/ui/TabBar'
import Legend from '../../../components/ui/Legend'
import { sentimentByPeriod, overallSentiment, sentimentByPlatform, negativeDrivers, influencers, issues } from '../mock-data/sentiment'
import { SENTIMENT_COLORS } from '../constants'
import type { InfCategory } from '../types'

const SENT_LEGEND = [
  { label: 'Positive', color: SENTIMENT_COLORS.positive },
  { label: 'Neutral',  color: SENTIMENT_COLORS.neutral  },
  { label: 'Negative', color: SENTIMENT_COLORS.negative },
]

const INF_TABS = [
  { value: 'negative', label: 'Negative' },
  { value: 'positive', label: 'Positive' },
  { value: 'neutral',  label: 'Neutral'  },
]

export default function SentimentPage() {
  const [infTab, setInfTab] = useState<InfCategory>('negative')

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

      {/* Row 2: Sentiment over time + by platform */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <SectionCard title="Sentiment Over Time">
            <Legend items={SENT_LEGEND} className="mb-3" />
            <TrendLineChart
              data={sentimentByPeriod}
              xKey="period"
              lines={[
                { key: 'positive', color: SENTIMENT_COLORS.positive, label: 'Positive' },
                { key: 'neutral',  color: SENTIMENT_COLORS.neutral,  label: 'Neutral', dashed: true },
                { key: 'negative', color: SENTIMENT_COLORS.negative, label: 'Negative' },
              ]}
              height={240}
              valueFormatter={v => `${v}%`}
            />
          </SectionCard>
        </div>
        <div className="lg:col-span-2">
          <SectionCard title="Sentiment by Platform">
            <Legend items={SENT_LEGEND} className="mb-3" />
            <SentimentStackedBar data={sentimentByPlatform} xKey="platform" height={240} horizontal />
          </SectionCard>
        </div>
      </div>

      {/* Row 3: Top negative drivers + Top influencers */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 flex flex-col">
          <SectionCard
            title="Top Negative Drivers"
            className="flex flex-col h-full"
            contentClassName="p-4 flex-1 flex flex-col"
          >
            <div className="flex-1 min-h-0">
              <HorizontalBar data={negativeDrivers} valueFormatter={v => `${v}%`} height="100%" />
            </div>
          </SectionCard>
        </div>
        <div className="lg:col-span-3">
          <SectionCard
            title="Top Influencers"
            className="h-full"
            contentClassName="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
            action={
              <TabBar
                options={INF_TABS}
                value={infTab}
                onChange={v => setInfTab(v as InfCategory)}
              />
            }
          >
            {influencers[infTab].map((inf, i) => <InfluencerCard key={i} inf={inf} />)}
          </SectionCard>
        </div>
      </div>

      {/* Row 4: Issues list */}
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
