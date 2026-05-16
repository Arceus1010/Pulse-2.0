import { useState } from 'react'
import MalaysiaMap from '../components/MalaysiaMap'
import { geoData } from '../mock-data'
import { SENTIMENT_COLORS } from '../constants'
import type { StateData } from '../types'

function TabBar({ options, value, onChange }: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
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

function SectionCard({ title, children, action }: {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400 shrink-0">
          {title}
        </h2>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function DeltaBadge({ delta }: { delta: number }) {
  const up = delta >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
      up
        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
        : 'bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400'
    }`}>
      {up ? '↑' : '↓'}{Math.abs(delta)}%
    </span>
  )
}

function SentimentBar({ s }: { s: StateData['sentiment'] }) {
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden w-full">
      <div style={{ width: `${s.positive}%`, background: SENTIMENT_COLORS.positive }} />
      <div style={{ width: `${s.neutral}%`,  background: SENTIMENT_COLORS.neutral }} />
      <div style={{ width: `${s.negative}%`, background: SENTIMENT_COLORS.negative }} />
    </div>
  )
}

function StateDetailPanel({ data, rank }: { data: StateData | null; rank: number }) {
  if (!data) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center p-8 min-h-48">
        <p className="text-[11px] text-slate-400 dark:text-zinc-500 text-center leading-relaxed">
          Click a state on the map<br />to explore its details
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          State Detail
        </h2>
        {rank > 0 && (
          <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
            #{rank} by volume
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-5">
        {/* Name + mentions */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 leading-none">
            {data.state}
          </h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-sm font-mono text-slate-600 dark:text-zinc-300">
              {data.mentions.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 dark:text-zinc-500">mentions</span>
            <DeltaBadge delta={data.delta} />
          </div>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5">
            {data.percentage}% of total mentions
          </p>
        </div>

        {/* Sentiment breakdown */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">
            Sentiment Breakdown
          </p>
          <div className="flex h-2 rounded-full overflow-hidden mb-3" style={{ transition: 'all 0.4s ease' }}>
            <div style={{ width: `${data.sentiment.positive}%`, background: SENTIMENT_COLORS.positive, transition: 'width 0.4s ease' }} />
            <div style={{ width: `${data.sentiment.neutral}%`,  background: SENTIMENT_COLORS.neutral,  transition: 'width 0.4s ease' }} />
            <div style={{ width: `${data.sentiment.negative}%`, background: SENTIMENT_COLORS.negative, transition: 'width 0.4s ease' }} />
          </div>
          <div className="grid grid-cols-3 gap-1 text-center">
            {[
              { label: 'Positive', value: data.sentiment.positive, color: SENTIMENT_COLORS.positive },
              { label: 'Neutral',  value: data.sentiment.neutral,  color: SENTIMENT_COLORS.neutral },
              { label: 'Negative', value: data.sentiment.negative, color: SENTIMENT_COLORS.negative },
            ].map(s => (
              <div key={s.label}>
                <p className="text-base font-bold leading-none" style={{ color: s.color }}>{s.value}%</p>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top topics */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">
            Top Topics
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.topTopics.map(t => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Lead platform */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">
            Lead Platform
          </p>
          <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200">{data.dominantPlatform}</p>
        </div>
      </div>
    </div>
  )
}

function StateTable({ data, selected, onSelect }: {
  data: StateData[]
  selected: string | null
  onSelect: (s: string) => void
}) {
  const sorted = [...data].sort((a, b) => b.mentions - a.mentions)

  return (
    <div className="-mx-4 -mb-4">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 dark:border-zinc-800">
            <th className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 w-8">#</th>
            <th className="px-4 py-2 text-left  text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">State</th>
            <th className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Mentions</th>
            <th className="px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Change</th>
            <th className="px-4 py-2 text-left  text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Sentiment</th>
            <th className="px-4 py-2 text-right text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Share</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((d, i) => {
            const isSelected = d.state === selected
            return (
              <tr
                key={d.state}
                onClick={() => onSelect(d.state)}
                className={`cursor-pointer border-b border-slate-100 dark:border-zinc-800 last:border-0 transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/20'
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <td className="px-4 py-2.5 text-right text-[11px] font-mono text-slate-400 dark:text-zinc-600">{i + 1}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-zinc-200">{d.state}</td>
                <td className="px-4 py-2.5 text-right text-xs font-mono text-slate-600 dark:text-zinc-300">{d.mentions.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center"><DeltaBadge delta={d.delta} /></td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-20 max-w-35">
                      <SentimentBar s={d.sentiment} />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 w-6 text-right shrink-0">
                      {d.sentiment.positive}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right text-xs font-mono font-semibold text-slate-700 dark:text-zinc-200">{d.percentage}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function GeoPage() {
  const [viewMode, setViewMode] = useState<'volume' | 'sentiment'>('volume')
  const [selected, setSelected] = useState<string>(geoData[0].state)

  const namedStates = geoData.filter(d => d.state !== 'Others')
  const selectedData = geoData.find(d => d.state === selected) ?? null
  const rank = [...namedStates]
    .sort((a, b) => b.mentions - a.mentions)
    .findIndex(d => d.state === selected) + 1

  const topState      = [...namedStates].sort((a, b) => b.mentions - a.mentions)[0]
  const fastestGrowing = [...namedStates].sort((a, b) => b.delta - a.delta)[0]
  const mostPositive  = [...namedStates].sort((a, b) => b.sentiment.positive - a.sentiment.positive)[0]

  const kpis = [
    {
      label: 'Top State by Volume',
      value: topState.state,
      sub: `${topState.percentage}% · ${(topState.mentions / 1000).toFixed(1)}k mentions`,
      accent: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Fastest Growing',
      value: fastestGrowing.state,
      sub: `+${fastestGrowing.delta}% vs prior period`,
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      label: 'Most Positive',
      value: mostPositive.state,
      sub: `${mostPositive.sentiment.positive}% positive sentiment`,
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
  ]

  return (
    <div className="flex flex-col gap-5">

      {/* KPI chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {kpis.map(k => (
          <div
            key={k.label}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-4 py-3.5 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">
              {k.label}
            </p>
            <p className={`text-lg font-bold leading-none ${k.accent}`}>{k.value}</p>
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Map + detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Map card */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400 shrink-0">
              Malaysia — State Distribution
            </h2>
            <TabBar
              options={[
                { value: 'volume',    label: 'Volume' },
                { value: 'sentiment', label: 'Sentiment' },
              ]}
              value={viewMode}
              onChange={v => setViewMode(v as 'volume' | 'sentiment')}
            />
          </div>
          <div className="p-4">
            <MalaysiaMap
              data={geoData}
              viewMode={viewMode}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        </div>

        {/* State detail panel */}
        <StateDetailPanel data={selectedData} rank={rank} />
      </div>

      {/* State breakdown table */}
      <SectionCard title="State Breakdown — All Regions">
        <StateTable data={geoData} selected={selected} onSelect={setSelected} />
      </SectionCard>

    </div>
  )
}
