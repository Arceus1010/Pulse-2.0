import { useMemo, useState } from 'react'
import KPICard from '../components/KPICard'
import PostCard from '../components/PostCard'
import TrendLineChart from '../components/charts/TrendLineChart'
import DonutChart from '../components/charts/DonutChart'
import PostingHeatmap from '../components/charts/PostingHeatmap'
import TabBar from '../../../components/ui/TabBar'
import SectionCard from '../../../components/ui/SectionCard'
import Legend from '../../../components/ui/Legend'
import { kpiMetrics, topPosts, trendData, trendByPlatform, likesData, sharesData, sourceBreakdown } from '../mock-data/overview'
import { CHART_COLORS } from '../constants'

const KPI_ITEMS = [
  { label: 'Total Mentions',  value: kpiMetrics.totalMentions.toLocaleString(),  delta: kpiMetrics.totalMentionsDelta  },
  { label: 'Total Posts',     value: kpiMetrics.totalPosts.toLocaleString(),     delta: kpiMetrics.totalPostsDelta     },
  { label: 'Total Reach',     value: kpiMetrics.totalReach.toLocaleString(),     delta: kpiMetrics.totalReachDelta     },
  { label: 'Engagements',     value: kpiMetrics.engagements.toLocaleString(),    delta: kpiMetrics.engagementsDelta    },
  { label: 'Sentiment Score', value: kpiMetrics.sentimentScore,                  delta: kpiMetrics.sentimentScoreDelta, unit: '/ 100' },
  { label: 'Unique Authors',  value: kpiMetrics.uniqueAuthors.toLocaleString(),  delta: kpiMetrics.uniqueAuthorsDelta  },
]

const TREND_OPTIONS = [
  { value: 'overtime', label: 'Over Time'   },
  { value: 'platform', label: 'By Platform' },
  { value: 'likes',    label: 'Likes'       },
  { value: 'shares',   label: 'Shares'      },
]

const POST_SORT_OPTIONS = [
  { value: 'engagement', label: 'Engagement' },
  { value: 'reach',      label: 'Reach'      },
  { value: 'sentiment',  label: 'Sentiment'  },
]

const TREND_LEGENDS: Record<string, { label: string; color: string; dashed?: boolean }[]> = {
  overtime: [
    { label: 'Engagements', color: CHART_COLORS.blue },
    { label: 'Reach',       color: CHART_COLORS.green, dashed: true },
  ],
  platform: [{ label: 'Posts by platform', color: CHART_COLORS.blue  }],
  likes:    [{ label: 'Likes over time',   color: CHART_COLORS.pink  }],
  shares:   [{ label: 'Shares over time',  color: CHART_COLORS.amber }],
}

export default function OverviewPage() {
  const [trendType, setTrendType] = useState('overtime')
  const [postSort, setPostSort] = useState('engagement')

  const trendChartData = useMemo(() => {
    if (trendType === 'platform') return trendByPlatform
    if (trendType === 'likes')    return likesData
    if (trendType === 'shares')   return sharesData
    return trendData
  }, [trendType])

  const sortedPosts = useMemo(() => [...topPosts].sort((a, b) => {
    if (postSort === 'reach')     return b.reach - a.reach
    if (postSort === 'sentiment') return a.sentiment.localeCompare(b.sentiment)
    return (b.likes + b.shares) - (a.likes + a.shares)
  }), [postSort])

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
            <Legend items={TREND_LEGENDS[trendType].map(l => ({ ...l, shape: 'line' as const }))} className="mb-3" />
            {trendType === 'overtime' && (
              <TrendLineChart
                data={trendChartData}
                lines={[
                  { key: 'engagements', color: CHART_COLORS.blue,  label: 'Engagements' },
                  { key: 'reach',       color: CHART_COLORS.green, dashed: true, label: 'Reach' },
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
                <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-zinc-300">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
                  {s.name}
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">{s.value}%</span>
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

      {/* Peak Posting Times */}
      <SectionCard title="Peak Posting Times">
        <PostingHeatmap />
      </SectionCard>
    </div>
  )
}
