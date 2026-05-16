import { useState } from 'react'
import { X, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react'
import PestleCard from '../components/PestleCard'
import AnalyticsRadar from '../components/charts/AnalyticsRadar'
import TrendLineChart from '../components/charts/TrendLineChart'
import { pestleData, radarData, pestleTrend } from '../mock-data'
import { PESTLE_COLORS } from '../constants'
import type { PestleEntry } from '../types'

// ── Constants ────────────────────────────────────────────────────────────────

const SENTINEL_COLORS = {
  positive: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  negative: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
  neutral: 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400',
}

const DIM_NAME_TO_KEY: Record<string, string> = {
  Political: 'P', Economic: 'E', Social: 'S',
  Technological: 'T', Legal: 'L', Environmental: 'Env',
}

const PESTLE_TREND_LINES = [
  { key: 'P',   color: PESTLE_COLORS.P,   label: 'Political' },
  { key: 'E',   color: PESTLE_COLORS.E,   label: 'Economic' },
  { key: 'S',   color: PESTLE_COLORS.S,   label: 'Social' },
  { key: 'T',   color: PESTLE_COLORS.T,   label: 'Technological' },
  { key: 'L',   color: PESTLE_COLORS.L,   label: 'Legal' },
  { key: 'Env', color: PESTLE_COLORS.Env, label: 'Environmental' },
]

// ── Derived values (static, computed once) ───────────────────────────────────

const TOTAL_POSTS = pestleData.reduce((sum, e) => sum + e.count, 0)
const MAX_PERCENTAGE = Math.max(...pestleData.map(e => e.percentage))
const DOMINANT_DIM = pestleData.reduce((a, b) => a.count > b.count ? a : b)

const radarInsights = radarData
  .map(d => ({
    dim: d.dim,
    key: DIM_NAME_TO_KEY[d.dim] ?? 'P',
    positive: d.positive,
    negative: d.negative,
    net: d.positive - d.negative,
  }))
  .sort((a, b) => a.net - b.net) // ascending: highest risk first

// ── Helpers ──────────────────────────────────────────────────────────────────

type RiskInfo = {
  label: string
  className: string
  Icon: typeof TrendingUp
}

function getRiskInfo(net: number): RiskInfo {
  if (net <= -30) return { label: 'High risk',      className: 'text-red-500',              Icon: AlertTriangle }
  if (net <= 0)   return { label: 'Elevated risk',  className: 'text-amber-500',            Icon: TrendingDown }
  if (net <= 20)  return { label: 'Mixed',          className: 'text-slate-400 dark:text-zinc-400', Icon: Minus }
  return            { label: 'Opportunity',   className: 'text-emerald-500',          Icon: TrendingUp }
}

// ── Detail panel ─────────────────────────────────────────────────────────────

function PestleDetail({ entry, onClose }: { entry: PestleEntry; onClose: () => void }) {
  const color = PESTLE_COLORS[entry.dimension]
  const letter = entry.dimension === 'Env' ? 'En' : entry.dimension
  const radar = radarData.find(r => r.dim === entry.name)
  const sentTotal = radar ? radar.positive + radar.negative : 100
  const posWidth  = radar ? Math.round((radar.positive / sentTotal) * 100) : 50
  const negWidth  = 100 - posWidth
  const net = radar ? radar.positive - radar.negative : 0
  const { label: riskLabel, className: riskClass, Icon: RiskIcon } = getRiskInfo(net)

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">

      {/* Header */}
      <div
        className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between"
        style={{ borderLeftWidth: 3, borderLeftColor: color }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ background: color }}
          >
            {letter}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{entry.name}</h2>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500">
              {entry.count.toLocaleString()} posts · {entry.percentage}% of total
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`hidden sm:flex items-center gap-1 text-[11px] font-semibold ${riskClass}`}>
            <RiskIcon className="w-3.5 h-3.5" />
            {riskLabel}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sentiment balance bar */}
      {radar && (
        <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/40">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              Sentiment Signal
            </span>
            <div className="flex items-center gap-3 text-[10px] font-semibold">
              <span className="text-emerald-600 dark:text-emerald-400">+{radar.positive} positive</span>
              <span className="text-red-500 dark:text-red-400">−{radar.negative} negative</span>
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex bg-slate-200 dark:bg-zinc-700">
            <div
              className="h-full bg-emerald-400 dark:bg-emerald-500 transition-all duration-500"
              style={{ width: `${posWidth}%` }}
            />
            <div
              className="h-full bg-red-400 dark:bg-red-500 transition-all duration-500"
              style={{ width: `${negWidth}%` }}
            />
          </div>
        </div>
      )}

      {/* Insight */}
      <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/20">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">
          Key Insight
        </p>
        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{entry.insight}</p>
      </div>

      {/* Posts */}
      <div>
        <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
          Representative Posts
        </p>
        {entry.posts.map((post, i) => (
          <div key={i} className="px-4 py-3 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{post.author}</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 text-[10px] font-semibold uppercase">
                {post.platform}
              </span>
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PestlePage() {
  const [active, setActive] = useState<PestleEntry | null>(null)

  return (
    <div className="flex flex-col gap-6">

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Classified Posts',  value: TOTAL_POSTS.toLocaleString() },
          { label: 'Dominant Dimension', value: `${DOMINANT_DIM.name} · ${DOMINANT_DIM.percentage}%` },
          { label: 'Highest Risk',       value: radarInsights[0].dim },
          { label: 'Top Opportunity',    value: radarInsights[radarInsights.length - 1].dim },
        ].map(item => (
          <div
            key={item.label}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-4 py-3"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">
              {item.label}
            </p>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Overview cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            PESTLE Breakdown
          </h2>
          <span className="text-[10px] text-slate-400 dark:text-zinc-500">
            Select a dimension to explore ↓
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {pestleData.map(entry => (
            <PestleCard
              key={entry.dimension}
              entry={entry}
              active={active?.dimension === entry.dimension}
              onClick={() => setActive(prev => prev?.dimension === entry.dimension ? null : entry)}
              maxPercentage={MAX_PERCENTAGE}
            />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      {active && <PestleDetail entry={active} onClose={() => setActive(null)} />}

      {/* Radar */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            Risk vs Opportunity — Sentiment per Dimension
          </h2>
          <div className="hidden sm:flex items-center gap-4 text-[10px] text-slate-400 dark:text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 inline-block rounded bg-red-400" />
              Negative
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-0.5 inline-block rounded border-t-2 border-dashed border-blue-400" />
              Positive
            </span>
          </div>
        </div>
        <div className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnalyticsRadar data={radarData} height={280} />

          {/* Data-driven legend — sorted by risk (worst first) */}
          <div className="flex flex-col gap-2 justify-center">
            {radarInsights.map(item => {
              const dimColor  = PESTLE_COLORS[item.key]
              const dimLetter = item.key === 'Env' ? 'En' : item.key
              const posW = Math.round((item.positive / (item.positive + item.negative)) * 100)
              const negW = 100 - posW
              const { label: riskLabel, className: riskClass } = getRiskInfo(item.net)

              return (
                <div key={item.dim} className="flex items-center gap-2.5">
                  <span
                    className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                    style={{ background: dimColor }}
                  >
                    {dimLetter}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{item.dim}</span>
                      <span className={`text-[10px] font-semibold ${riskClass}`}>{riskLabel}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden flex">
                      <div
                        className="h-full bg-emerald-400 dark:bg-emerald-500 transition-all duration-500"
                        style={{ width: `${posW}%` }}
                      />
                      <div
                        className="h-full bg-red-400 dark:bg-red-500 transition-all duration-500"
                        style={{ width: `${negW}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            PESTLE Trend — Monthly Volume
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
