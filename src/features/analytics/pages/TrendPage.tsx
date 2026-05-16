import DonutChart from '../components/charts/DonutChart'
import HorizontalBar from '../components/charts/HorizontalBar'
import {
  entityNodes, entityEdges, topicClusters,
  shareOfVoice, languageBreakdown, strongestRelations, NODE_TYPE_COLORS,
} from '../mock-data'
import { CHART_COLORS } from '../constants'

const CLUSTER_CLASSES: Record<string, string> = {
  blue: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400',
  green: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400',
  amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400',
  red: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400',
  purple: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/40 text-purple-700 dark:text-purple-400',
  teal: 'bg-teal-50 dark:bg-teal-950/30 border-teal-200 dark:border-teal-800/40 text-teal-700 dark:text-teal-400',
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

function ERDDiagram() {
  const nodeMap = Object.fromEntries(entityNodes.map(n => [n.id, n]))

  return (
    <svg viewBox="100 40 660 460" className="w-full" style={{ minHeight: 340 }}>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#52525b" />
        </marker>
      </defs>

      {entityEdges.map((edge, i) => {
        const a = nodeMap[edge.from]
        const b = nodeMap[edge.to]
        if (!a || !b) return null
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        return (
          <g key={i}>
            <line
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke="#3f3f46" strokeWidth={1.2}
              markerEnd="url(#arrow)"
            />
            {edge.label && (
              <text x={mx} y={my - 4} textAnchor="middle" fontSize={8} fill="#71717a" style={{ fontFamily: 'inherit' }}>
                {edge.label}
              </text>
            )}
          </g>
        )
      })}

      {entityNodes.map(node => {
        const color = NODE_TYPE_COLORS[node.type]
        return (
          <g key={node.id} style={{ cursor: 'pointer' }}>
            <circle
              cx={node.x} cy={node.y} r={node.r}
              fill={`${color}18`} stroke={color} strokeWidth={1.5}
            />
            {node.lines.map((line, i) => (
              <text
                key={i}
                x={node.x}
                y={node.y + (i - (node.lines.length - 1) / 2) * 11 + 4}
                textAnchor="middle"
                fontSize={8.5}
                fontWeight={500}
                fill={color}
                style={{ fontFamily: 'inherit', pointerEvents: 'none' }}
              >
                {line}
              </text>
            ))}
          </g>
        )
      })}
    </svg>
  )
}

export default function TrendPage() {
  const sovData = shareOfVoice.map(d => ({ name: d.name, value: d.value, color: CHART_COLORS.blue }))

  return (
    <div className="flex flex-col gap-6">
      {/* ERD */}
      <SectionCard title="Entity Relationship Diagram">
        <div className="flex flex-wrap gap-4 mb-3 text-[11px] text-slate-500 dark:text-zinc-400">
          {Object.entries(NODE_TYPE_COLORS).map(([type, color]) => (
            <span key={type} className="flex items-center gap-1.5 capitalize">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
              {type}
            </span>
          ))}
        </div>
        <div className="bg-slate-50 dark:bg-zinc-950 rounded-lg">
          <ERDDiagram />
        </div>
      </SectionCard>

      {/* Relationships + Clusters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Strongest Relationships">
          <div className="flex flex-col gap-2">
            {strongestRelations.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-lg">
                <span className="text-xs text-slate-700 dark:text-zinc-300">{r.label}</span>
                <span className="text-sm font-mono font-semibold" style={{ color: r.scoreColor }}>{r.score}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Topic Clusters">
          <div className="flex flex-wrap gap-2">
            {topicClusters.map(t => (
              <span
                key={t.label}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${CLUSTER_CLASSES[t.color]}`}
              >
                {t.label}
                <span className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[10px] font-mono">{t.count}</span>
              </span>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Share of Voice + Language */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SectionCard title="Share of Voice">
          <HorizontalBar
            data={sovData}
            valueFormatter={v => `${v}%`}
          />
        </SectionCard>

        <SectionCard title="Language Breakdown">
          <div className="flex flex-wrap gap-3 mb-3">
            {languageBreakdown.map(l => (
              <span key={l.name} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                <span className="w-2 h-2 rounded-sm inline-block" style={{ background: l.color }} />
                {l.name} {l.value}%
              </span>
            ))}
          </div>
          <DonutChart data={languageBreakdown} height={200} />
        </SectionCard>
      </div>
    </div>
  )
}
