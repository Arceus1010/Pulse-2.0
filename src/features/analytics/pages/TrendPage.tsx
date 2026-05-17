import { useState, useMemo } from 'react'
import DonutChart from '../components/charts/DonutChart'
import HorizontalBar from '../components/charts/HorizontalBar'
import EntityRelationGraph from '../components/charts/EntityRelationGraph'
import SectionCard from '../../../components/ui/SectionCard'
import FilterChips from '../../../components/ui/FilterChips'
import { topicClusters, shareOfVoice, languageBreakdown, strongestRelations, entityNodes } from '../mock-data/trend'
import { CHART_COLORS, NODE_TYPE_COLORS } from '../constants'

const CLUSTER_CLASSES: Record<string, string> = {
  blue:   'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400',
  green:  'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400',
  amber:  'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400',
  red:    'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400',
  purple: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-400',
  teal:   'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/40 text-teal-700 dark:text-teal-400',
}

const SOV_COLORS = [
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.purple,
  CHART_COLORS.amber,
  CHART_COLORS.teal,
]

export default function TrendPage() {
  const allTypes = Object.keys(NODE_TYPE_COLORS)
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(allTypes))

  const toggleType = (type: string) => {
    setActiveTypes(prev => {
      const next = new Set(prev)
      if (next.has(type)) {
        if (next.size === 1) return prev
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }

  const sovData = shareOfVoice.map((d, i) => ({ name: d.name, value: d.value, color: SOV_COLORS[i] }))
  const sortedClusters = [...topicClusters].sort((a, b) => b.count - a.count)

  const nodeCountByType = useMemo(
    () => entityNodes.reduce<Record<string, number>>((acc, n) => {
      acc[n.type] = (acc[n.type] ?? 0) + 1
      return acc
    }, {}),
    []
  )

  const filterItems = allTypes.map(type => ({
    value: type,
    label: type,
    color: NODE_TYPE_COLORS[type],
    count: nodeCountByType[type] ?? 0,
  }))

  return (
    <div className="flex flex-col gap-5">

      {/* Row 1: Share of Voice (2/3) + Language Breakdown (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SectionCard title="Share of Voice">
            <HorizontalBar data={sovData} valueFormatter={v => `${v}%`} height={232} />
          </SectionCard>
        </div>
        <SectionCard title="Language Breakdown">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
            {languageBreakdown.map(l => (
              <span key={l.name} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                <span className="w-2 h-2 rounded-sm shrink-0" style={{ background: l.color }} />
                {l.name}
                <span className="font-semibold text-slate-700 dark:text-zinc-300">{l.value}%</span>
              </span>
            ))}
          </div>
          <DonutChart data={languageBreakdown} height={200} />
        </SectionCard>
      </div>

      {/* Row 2: ERD (2/3) + Strongest Relationships + Topic Clusters (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SectionCard title="Entity Relationship Diagram" contentClassName="p-0">
            <div className="px-4 py-2.5 border-b border-slate-100 dark:border-zinc-800">
              <FilterChips
                label="Filter"
                items={filterItems}
                active={Array.from(activeTypes)}
                onToggle={toggleType}
              />
            </div>
            <div className="p-4">
              <div className="bg-slate-50 dark:bg-zinc-950 rounded-lg overflow-hidden">
                <EntityRelationGraph activeTypes={activeTypes} />
              </div>
            </div>
          </SectionCard>
        </div>
        <div className="flex flex-col gap-4">
          <SectionCard title="Strongest Relationships" contentClassName="">
            {strongestRelations.map((r, i) => {
              const color =
                r.score >= 0.9  ? CHART_COLORS.blue
                : r.score >= 0.75 ? CHART_COLORS.amber
                : CHART_COLORS.teal
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-zinc-800 last:border-0 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 w-3.5 shrink-0 text-right">
                    {i + 1}
                  </span>
                  <span className="text-xs text-slate-700 dark:text-zinc-300 flex-1 min-w-0 leading-snug">
                    {r.label}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-10 h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${r.score * 100}%`, background: color }} />
                    </div>
                    <span className="text-sm font-mono font-bold tabular-nums w-8 text-right" style={{ color }}>
                      {r.score.toFixed(2)}
                    </span>
                  </div>
                </div>
              )
            })}
          </SectionCard>

          <SectionCard title="Topic Clusters">
            <div className="flex flex-wrap gap-2">
              {sortedClusters.map(t => (
                <span
                  key={t.label}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border ${CLUSTER_CLASSES[t.color]}`}
                >
                  {t.label}
                  <span className="opacity-40 select-none">·</span>
                  <span className="font-mono font-semibold">{t.count}</span>
                </span>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

    </div>
  )
}
