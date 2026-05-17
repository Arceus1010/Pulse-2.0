import { useState } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import SentimentBadge from '../components/SentimentBadge'
import Avatar from '../../../components/ui/Avatar'
import { newsSources, socialSources, newsAuthors, socialAuthors } from '../mock-data/source'
import { useChartTheme } from '../hooks/useChartTheme'
import { SENTIMENT_COLORS } from '../constants'
import type { Author, SourceBreakdown } from '../types'

type SrcTab = 'news' | 'social'

function formatReach(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k`
  return String(n)
}

function dominantSentiment(s: SourceBreakdown): 'positive' | 'negative' | 'neutral' {
  const max = Math.max(s.positive, s.negative, s.neutral)
  if (max === s.negative) return 'negative'
  if (max === s.positive) return 'positive'
  return 'neutral'
}

function SentimentStackedChart({ sources }: { sources: SourceBreakdown[] }) {
  const theme = useChartTheme()

  const data = [...sources]
    .sort((a, b) => b.reach - a.reach)
    .map(s => ({
      name:     s.name,
      Positive: Math.round(s.posts * s.positive / 100),
      Neutral:  Math.round(s.posts * s.neutral  / 100),
      Negative: Math.round(s.posts * s.negative / 100),
    }))

  const h = Math.max(180, data.length * 44)

  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: theme.text, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fill: theme.text, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: theme.cursor }}
          contentStyle={{
            backgroundColor: theme.tooltip.bg,
            border: `1px solid ${theme.tooltip.border}`,
            borderRadius: 6,
            fontSize: 12,
            color: theme.tooltip.text,
          }}
          labelStyle={{ color: theme.tooltip.label, fontSize: 11, marginBottom: 2 }}
          itemStyle={{ color: theme.tooltip.text }}
        />
        <Bar dataKey="Positive" stackId="s" fill={SENTIMENT_COLORS.positive} maxBarSize={28} />
        <Bar dataKey="Neutral"  stackId="s" fill={SENTIMENT_COLORS.neutral}  maxBarSize={28} />
        <Bar dataKey="Negative" stackId="s" fill={SENTIMENT_COLORS.negative} maxBarSize={28} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function SourceList({ sources }: { sources: SourceBreakdown[] }) {
  const sorted = [...sources].sort((a, b) => b.reach - a.reach)
  return (
    <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
      {sorted.map((s, i) => (
        <li key={s.name} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
          <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-600 w-4 text-right shrink-0">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 dark:text-zinc-200 truncate">{s.name}</p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">
              {s.posts.toLocaleString()} posts · {formatReach(s.reach)} reach
            </p>
          </div>
          <SentimentBadge sentiment={dominantSentiment(s)} />
        </li>
      ))}
    </ul>
  )
}

function AuthorPanel({ authors, titlePrefix }: { authors: Author[]; titlePrefix: string }) {
  const [selected, setSelected] = useState<Author>(authors[0])

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          {titlePrefix}
        </h2>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-zinc-800">
        {authors.map(a => (
          <button
            key={a.id}
            onClick={() => setSelected(a)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              selected.id === a.id
                ? 'bg-blue-50 dark:bg-blue-950/20'
                : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <Avatar initials={a.initials} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">{a.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500">{a.handle} · {a.platform}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">{a.reach}</span>
              <SentimentBadge sentiment={a.sentiment} />
            </div>
          </button>
        ))}
      </div>
      <div className="flex-1 flex flex-col justify-center px-4 py-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">
          {selected.name} · Recent Statement
        </p>
        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed italic border-l-2 border-blue-300 dark:border-blue-700 pl-3">
          "{selected.recentStatement}"
        </p>
      </div>
    </div>
  )
}

export default function SourcePage() {
  const [tab, setTab] = useState<SrcTab>('news')

  const sources     = tab === 'news' ? newsSources  : socialSources
  const authors     = tab === 'news' ? newsAuthors  : socialAuthors
  const chartTitle  = tab === 'news' ? 'Posts by News Source' : 'Posts by Platform'
  const listTitle   = tab === 'news' ? 'News Sources'         : 'Platforms'
  const authorTitle = tab === 'news' ? 'Top Authors'          : 'Top Accounts'

  const legendItems = [
    { label: 'Positive', color: SENTIMENT_COLORS.positive },
    { label: 'Neutral',  color: SENTIMENT_COLORS.neutral  },
    { label: 'Negative', color: SENTIMENT_COLORS.negative },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* Toggle */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          {tab === 'news'
            ? 'Coverage from news outlets, ranked by audience reach.'
            : 'Conversation volume across social platforms, ranked by audience reach.'}
        </p>
        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-zinc-800 rounded-lg p-1">
          {(['news', 'social'] as SrcTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                tab === t
                  ? 'bg-white dark:bg-zinc-700 text-slate-800 dark:text-zinc-100 shadow-sm'
                  : 'text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
              }`}
            >
              {t === 'news' ? 'News' : 'Social'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            {chartTitle} — ranked by reach
          </h2>
          <div className="flex items-center gap-3">
            {legendItems.map(item => (
              <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                <span className="w-2 h-2 rounded-sm inline-block" style={{ background: item.color }} />
                {item.label}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4">
          <SentimentStackedChart sources={sources} />
        </div>
      </div>

      {/* List + Authors */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-start">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              {listTitle} — by reach
            </h2>
          </div>
          <SourceList sources={sources} />
        </div>
        <div className="lg:col-span-3">
          <AuthorPanel authors={authors} titlePrefix={authorTitle} />
        </div>
      </div>
    </div>
  )
}
