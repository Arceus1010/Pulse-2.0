import { useMemo, useState } from 'react'
import MalaysiaMap from '../components/MalaysiaMap'
import SentimentBar from '../components/SentimentBar'
import SectionCard from '../../../components/ui/SectionCard'
import TabBar from '../../../components/ui/TabBar'
import DeltaBadge from '../../../components/ui/DeltaBadge'
import { geoData } from '../mock-data/geo'
import { SENTIMENT_COLORS } from '../constants'
import type { StateData } from '../types'

function StateDetailPanel({ data, rank }: { data: StateData | null; rank: number }) {
  if (!data) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg flex items-center justify-center p-8 min-h-48">
        <p className="text-xs text-slate-400 dark:text-zinc-500 text-center leading-relaxed">
          Click a state on the map<br />to explore its details
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          State Detail
        </h2>
        {rank > 0 && (
          <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">
            #{rank} by volume
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-5">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-zinc-100 leading-none">{data.state}</h3>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-base font-mono text-slate-600 dark:text-zinc-300">{data.mentions.toLocaleString()}</span>
            <span className="text-sm text-slate-400 dark:text-zinc-500">mentions</span>
            <DeltaBadge delta={data.delta} />
          </div>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{data.percentage}% of total mentions</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">
            Sentiment Breakdown
          </p>
          <SentimentBar
            positive={data.sentiment.positive}
            neutral={data.sentiment.neutral}
            negative={data.sentiment.negative}
            height={8}
            animated
            className="mb-3"
          />
          <div className="grid grid-cols-3 gap-1 text-center">
            {[
              { label: 'Positive', value: data.sentiment.positive, color: SENTIMENT_COLORS.positive },
              { label: 'Neutral',  value: data.sentiment.neutral,  color: SENTIMENT_COLORS.neutral  },
              { label: 'Negative', value: data.sentiment.negative, color: SENTIMENT_COLORS.negative },
            ].map(s => (
              <div key={s.label}>
                <p className="text-lg font-bold leading-none" style={{ color: s.color }}>{s.value}%</p>
                <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-2">
            Top Topics
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.topTopics.map(t => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40 font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">
            Lead Platform
          </p>
          <p className="text-base font-semibold text-slate-700 dark:text-zinc-200">{data.dominantPlatform}</p>
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
  const sorted = useMemo(() => [...data].sort((a, b) => b.mentions - a.mentions), [data])

  return (
    <div className="-mx-4 -mb-4">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 dark:border-zinc-800">
            <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 w-8">#</th>
            <th className="px-4 py-2 text-left  text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">State</th>
            <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Mentions</th>
            <th className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Change</th>
            <th className="px-4 py-2 text-left  text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Sentiment</th>
            <th className="px-4 py-2 text-right text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">Share</th>
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
                <td className="px-4 py-2.5 text-right text-xs font-mono text-slate-400 dark:text-zinc-600">{i + 1}</td>
                <td className="px-4 py-2.5 text-base font-medium text-slate-800 dark:text-zinc-200">{d.state}</td>
                <td className="px-4 py-2.5 text-right text-sm font-mono text-slate-600 dark:text-zinc-300">{d.mentions.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-center"><DeltaBadge delta={d.delta} /></td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-20 max-w-35">
                      <SentimentBar
                        positive={d.sentiment.positive}
                        neutral={d.sentiment.neutral}
                        negative={d.sentiment.negative}
                      />
                    </div>
                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 w-6 text-right shrink-0">
                      {d.sentiment.positive}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right text-sm font-mono font-semibold text-slate-700 dark:text-zinc-200">{d.percentage}%</td>
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

  const namedStates  = useMemo(() => geoData.filter(d => d.state !== 'Others'), [])
  const topState     = useMemo(() => [...namedStates].sort((a, b) => b.mentions - a.mentions)[0], [namedStates])
  const fastestGrowing = useMemo(() => [...namedStates].sort((a, b) => b.delta - a.delta)[0], [namedStates])
  const mostPositive = useMemo(() => [...namedStates].sort((a, b) => b.sentiment.positive - a.sentiment.positive)[0], [namedStates])
  const rank         = useMemo(
    () => [...namedStates].sort((a, b) => b.mentions - a.mentions).findIndex(d => d.state === selected) + 1,
    [namedStates, selected]
  )

  const selectedData = geoData.find(d => d.state === selected) ?? null

  const kpis = useMemo(() => [
    { label: 'Top State by Volume', value: topState.state,      sub: `${topState.percentage}% · ${(topState.mentions / 1000).toFixed(1)}k mentions`, accent: 'text-blue-600 dark:text-blue-400' },
    { label: 'Fastest Growing',     value: fastestGrowing.state, sub: `+${fastestGrowing.delta}% vs prior period`,                                   accent: 'text-emerald-600 dark:text-emerald-400' },
    { label: 'Most Positive',       value: mostPositive.state,  sub: `${mostPositive.sentiment.positive}% positive sentiment`,                        accent: 'text-emerald-600 dark:text-emerald-400' },
  ], [topState, fastestGrowing, mostPositive])

  return (
    <div className="flex flex-col gap-5">

      {/* KPI chips */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {kpis.map(k => (
          <div
            key={k.label}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-4 py-3.5 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1.5">{k.label}</p>
            <p className={`text-xl font-bold leading-none ${k.accent}`}>{k.value}</p>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Map + detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2">
          <SectionCard
            title="Malaysia — State Distribution"
            action={
              <TabBar
                options={[
                  { value: 'volume',    label: 'Volume'    },
                  { value: 'sentiment', label: 'Sentiment' },
                ]}
                value={viewMode}
                onChange={v => setViewMode(v as 'volume' | 'sentiment')}
              />
            }
          >
            <MalaysiaMap data={geoData} viewMode={viewMode} selected={selected} onSelect={setSelected} />
          </SectionCard>
        </div>
        <StateDetailPanel data={selectedData} rank={rank} />
      </div>

      {/* State breakdown table */}
      <SectionCard title="State Breakdown — All Regions">
        <StateTable data={geoData} selected={selected} onSelect={setSelected} />
      </SectionCard>

    </div>
  )
}
