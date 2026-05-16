import { useState } from 'react'
import { X } from 'lucide-react'
import PestleCard from '../components/PestleCard'
import AnalyticsRadar from '../components/charts/AnalyticsRadar'
import TrendLineChart from '../components/charts/TrendLineChart'
import { pestleData, radarData, pestleTrend } from '../mock-data'
import { PESTLE_COLORS } from '../constants'
import type { PestleEntry } from '../types'

const SENTINEL_COLORS = {
  positive: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  negative: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
  neutral: 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400',
}

function PestleDetail({ entry, onClose }: { entry: PestleEntry; onClose: () => void }) {
  const color = PESTLE_COLORS[entry.dimension]
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold" style={{ color }}>{entry.dimension === 'Env' ? 'E' : entry.dimension}</span>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{entry.name} — deep dive</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/50" style={{ borderLeftWidth: 3, borderLeftColor: color }}>
        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{entry.insight}</p>
      </div>

      <div>
        <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
          Representative Posts
        </p>
        {entry.posts.map((post, i) => (
          <div key={i} className="px-4 py-3 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{post.author}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">{post.platform}</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{post.text}</p>
            <span className={`self-start px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${SENTINEL_COLORS[post.sentiment]}`}>
              {post.sentiment}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

const PESTLE_TREND_LINES = [
  { key: 'P', color: PESTLE_COLORS.P, label: 'Political' },
  { key: 'E', color: PESTLE_COLORS.E, label: 'Economic' },
  { key: 'S', color: PESTLE_COLORS.S, label: 'Social' },
  { key: 'T', color: PESTLE_COLORS.T, label: 'Technological' },
  { key: 'L', color: PESTLE_COLORS.L, label: 'Legal' },
  { key: 'Env', color: PESTLE_COLORS.Env, label: 'Environmental' },
]

const RADAR_LEGEND = [
  { label: 'Negative signal', color: '#ef4444', desc: 'Driven by opposition commentary on SSM enforcement. Key: Anwar Ibrahim (ministerial mandate), Fahmi Fadzil (digitisation push).' },
  { label: 'Legal — Highest risk', color: '#a855f7', desc: 'Shell company crackdown and director liability posts trending. 3,200 companies flagged this month.' },
  { label: 'Economic — Mixed', color: '#f59e0b', desc: 'Portal launch positive (new registrations up), but audit findings and late penalties drive negative volume.' },
  { label: 'Technological — Positive', color: '#3b82f6', desc: 'MySSM portal digitisation receives broad praise from SME community and tech journalists.' },
]

export default function PestlePage() {
  const [active, setActive] = useState<PestleEntry | null>(null)

  return (
    <div className="flex flex-col gap-6">
      {/* Overview cards */}
      <div>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-3">PESTLE Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {pestleData.map(entry => (
            <PestleCard
              key={entry.dimension}
              entry={entry}
              active={active?.dimension === entry.dimension}
              onClick={() => setActive(prev => prev?.dimension === entry.dimension ? null : entry)}
            />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {active && <PestleDetail entry={active} onClose={() => setActive(null)} />}

      {/* Radar */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            PESTLE Radar — Sentiment per Dimension
          </h2>
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsRadar data={radarData} height={280} />
          <div className="flex flex-col gap-4 justify-center">
            {RADAR_LEGEND.map(item => (
              <div key={item.label}>
                <p className="text-xs font-semibold mb-1" style={{ color: item.color }}>{item.label}</p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            PESTLE Trend (Monthly)
          </h2>
        </div>
        <div className="p-4">
          <div className="flex flex-wrap gap-4 mb-3">
            {PESTLE_TREND_LINES.map(l => (
              <span key={l.key} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                <span className="w-5 h-0.5 inline-block rounded" style={{ background: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
          <TrendLineChart
            data={pestleTrend}
            xKey="month"
            lines={PESTLE_TREND_LINES}
            height={260}
          />
        </div>
      </div>
    </div>
  )
}
