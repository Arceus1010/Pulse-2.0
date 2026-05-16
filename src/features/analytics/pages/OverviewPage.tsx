import { useState } from 'react'
import KPICard from '../components/KPICard'
import PostCard from '../components/PostCard'
import TrendLineChart from '../components/charts/TrendLineChart'
import DonutChart from '../components/charts/DonutChart'
import PostingHeatmap from '../components/charts/PostingHeatmap'
import {
  kpiMetrics, topPosts, trendData, trendByPlatform, likesData, sharesData,
  sourceBreakdown,
} from '../mock-data'
import { CHART_COLORS } from '../constants'

const KPI_ITEMS = [
  { label: 'Total Mentions', value: kpiMetrics.totalMentions.toLocaleString(), delta: kpiMetrics.totalMentionsDelta },
  { label: 'Total Posts', value: kpiMetrics.totalPosts.toLocaleString(), delta: kpiMetrics.totalPostsDelta },
  { label: 'Total Reach', value: kpiMetrics.totalReach.toLocaleString(), delta: kpiMetrics.totalReachDelta },
  { label: 'Engagements', value: kpiMetrics.engagements.toLocaleString(), delta: kpiMetrics.engagementsDelta },
  { label: 'Sentiment Score', value: kpiMetrics.sentimentScore, delta: kpiMetrics.sentimentScoreDelta, unit: '/ 100' },
  { label: 'Unique Authors', value: kpiMetrics.uniqueAuthors.toLocaleString(), delta: kpiMetrics.uniqueAuthorsDelta },
]

const TREND_OPTIONS = [
  { value: 'overtime', label: 'Over Time' },
  { value: 'platform', label: 'By Platform' },
  { value: 'likes', label: 'Likes' },
  { value: 'shares', label: 'Shares' },
]

const POST_SORT_OPTIONS = [
  { value: 'engagement', label: 'Engagement' },
  { value: 'reach', label: 'Reach' },
  { value: 'sentiment', label: 'Sentiment' },
]

function TabBar({ options, value, onChange }: { options: { value: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-0.5 bg-slate-100 dark:bg-zinc-800 rounded-md p-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
            value === o.value
              ? 'bg-white dark:bg-zinc-700 text-slate-800 dark:text-zinc-100 shadow-sm'
              : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

function LegendDot({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
      <span
        className="w-5 h-0.5 rounded-full inline-block"
        style={{ background: color, borderTop: dashed ? `2px dashed ${color}` : undefined, height: dashed ? 0 : undefined }}
      />
      {label}
    </span>
  )
}

function TrendLegend({ type }: { type: string }) {
  if (type === 'overtime') return (
    <div className="flex gap-4 mb-3">
      <LegendDot color={CHART_COLORS.blue} label="Engagements" />
      <LegendDot color={CHART_COLORS.green} label="Reach" dashed />
    </div>
  )
  if (type === 'platform') return (
    <div className="flex gap-4 mb-3">
      <LegendDot color={CHART_COLORS.blue} label="Posts by platform" />
    </div>
  )
  if (type === 'likes') return (
    <div className="flex gap-4 mb-3">
      <LegendDot color={CHART_COLORS.pink} label="Likes over time" />
    </div>
  )
  return (
    <div className="flex gap-4 mb-3">
      <LegendDot color={CHART_COLORS.amber} label="Shares over time" />
    </div>
  )
}

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

export default function OverviewPage() {
  const [trendType, setTrendType] = useState('overtime')
  const [postSort, setPostSort] = useState('engagement')

  const sortedPosts = [...topPosts].sort((a, b) => {
    if (postSort === 'reach') return b.reach - a.reach
    if (postSort === 'sentiment') return a.sentiment.localeCompare(b.sentiment)
    return (b.likes + b.shares) - (a.likes + a.shares)
  })

  const trendChartData =
    trendType === 'platform' ? trendByPlatform
    : trendType === 'likes' ? likesData
    : trendType === 'shares' ? sharesData
    : trendData

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {KPI_ITEMS.map(k => (
          <KPICard key={k.label} label={k.label} value={k.value} delta={k.delta} unit={k.unit} />
        ))}
      </div>

      {/* Trend chart + Source Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SectionCard
            title="Engagement Trend"
            action={<TabBar options={TREND_OPTIONS} value={trendType} onChange={setTrendType} />}
          >
            <TrendLegend type={trendType} />
            {trendType === 'overtime' && (
              <TrendLineChart
                data={trendChartData}
                lines={[
                  { key: 'engagements', color: CHART_COLORS.blue, label: 'Engagements' },
                  { key: 'reach', color: CHART_COLORS.green, dashed: true, label: 'Reach' },
                ]}
                height={260}
              />
            )}
            {trendType === 'platform' && (
              <TrendLineChart data={trendChartData} bars={{ key: 'posts' }} height={260} />
            )}
            {trendType === 'likes' && (
              <TrendLineChart
                data={trendChartData}
                lines={[{ key: 'likes', color: CHART_COLORS.pink, label: 'Likes' }]}
                height={260}
              />
            )}
            {trendType === 'shares' && (
              <TrendLineChart
                data={trendChartData}
                lines={[{ key: 'shares', color: CHART_COLORS.amber, label: 'Shares' }]}
                height={260}
              />
            )}
          </SectionCard>
        </div>

        <SectionCard title="Source Breakdown">
          <DonutChart data={sourceBreakdown} height={160} innerRadius={42} />
          <div className="mt-3 space-y-2">
            {sourceBreakdown.map(s => (
              <div key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">{s.value}%</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Top Posts */}
      <SectionCard
        title="Top Posts This Period"
        action={<TabBar options={POST_SORT_OPTIONS} value={postSort} onChange={setPostSort} />}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedPosts.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      </SectionCard>

      {/* Peak Posting Times — full width for heatmap legibility */}
      <SectionCard title="Peak Posting Times">
        <PostingHeatmap />
      </SectionCard>
    </div>
  )
}
