import { useState, useRef } from 'react'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import type { StateData } from '../types'
import { SENTIMENT_COLORS } from '../constants'
import geographyData from '../data/malaysia-states.json'

interface Props {
  data: StateData[]
  viewMode: 'volume' | 'sentiment'
  selected: string | null
  onSelect: (state: string) => void
}

const GEO_TO_STATE: Record<string, string> = {
  'Pulau Pinang': 'Penang',
}

function volumeColor(pct: number, maxPct: number, hovered: boolean, selected: boolean): string {
  if (pct === 0) return hovered ? 'rgba(148,163,184,0.25)' : 'rgba(148,163,184,0.10)'
  const a = pct / maxPct
  if (selected) return `rgba(59, 130, 246, ${0.72 + a * 0.22})`
  if (hovered)  return `rgba(59, 130, 246, ${0.52 + a * 0.38})`
  return `rgba(59, 130, 246, ${0.12 + a * 0.62})`
}

function sentimentColor(sd: StateData | null, hovered: boolean, selected: boolean): string {
  if (!sd) return hovered ? 'rgba(148,163,184,0.25)' : 'rgba(148,163,184,0.10)'
  const net = sd.sentiment.positive - sd.sentiment.negative
  const alpha = selected ? 0.88 : hovered ? 0.74 : 0.58
  if (net >= 30) return `rgba(34, 197, 94, ${alpha})`
  if (net >= 15) return `rgba(74, 222, 128, ${alpha})`
  if (net >= 0)  return `rgba(134, 239, 172, ${alpha})`
  if (net >= -15) return `rgba(252, 165, 165, ${alpha})`
  return `rgba(239, 68, 68, ${alpha})`
}

export default function MalaysiaMap({ data, viewMode, selected, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; sd: StateData } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const dataMap = Object.fromEntries(data.map(d => [d.state, d]))
  const maxPct = Math.max(...data.filter(d => d.state !== 'Others').map(d => d.percentage))

  return (
    <div ref={containerRef} className="relative w-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 2300, center: [109.5, 4.0] }}
        width={800}
        height={350}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={geographyData}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const geoName = geo.properties.name as string
              const stateName = GEO_TO_STATE[geoName] ?? geoName
              const sd = dataMap[stateName] ?? null
              const pct = sd?.percentage ?? 0
              const isHovered = hovered === geoName
              const isSelected = !!sd && sd.state === selected

              const fill = viewMode === 'sentiment'
                ? sentimentColor(sd, isHovered, isSelected)
                : volumeColor(pct, maxPct, isHovered, isSelected)

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke={isSelected ? '#3b82f6' : isHovered ? '#94a3b8' : '#71717a'}
                  strokeWidth={isSelected ? 1.5 : isHovered ? 1 : 0.5}
                  strokeOpacity={isSelected ? 1 : isHovered ? 0.8 : 0.35}
                  style={{
                    default: { outline: 'none', cursor: sd ? 'pointer' : 'default', transition: 'fill 0.25s ease' },
                    hover:   { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                  onClick={() => { if (sd) onSelect(sd.state) }}
                  onMouseEnter={(e) => {
                    if (!sd) return
                    setHovered(geoName)
                    const rect = containerRef.current?.getBoundingClientRect()
                    if (rect) setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, sd })
                  }}
                  onMouseMove={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect()
                    if (rect) setTooltip(t => t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : null)
                  }}
                  onMouseLeave={() => { setHovered(null); setTooltip(null) }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-1 px-1">
        {viewMode === 'volume' ? (
          ['Low', 'Mid', 'High'].map((lbl, i) => {
            const a = (i + 1) / 3
            return (
              <div key={lbl} className="flex items-center gap-1.5">
                <div className="w-6 h-2 rounded-sm" style={{ background: `rgba(59, 130, 246, ${0.12 + a * 0.68})` }} />
                <span className="text-[10px] text-slate-500 dark:text-zinc-400">{lbl}</span>
              </div>
            )
          })
        ) : (
          [
            { label: 'Positive', color: 'rgba(34, 197, 94, 0.65)' },
            { label: 'Neutral',  color: 'rgba(134, 239, 172, 0.6)' },
            { label: 'Negative', color: 'rgba(239, 68, 68, 0.65)' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className="w-6 h-2 rounded-sm" style={{ background: item.color }} />
              <span className="text-[10px] text-slate-500 dark:text-zinc-400">{item.label}</span>
            </div>
          ))
        )}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-10 pointer-events-none bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg px-3 py-2.5 shadow-xl"
          style={{ left: tooltip.x + 14, top: tooltip.y - 12, minWidth: 168 }}
        >
          <div className="flex items-center justify-between gap-3 mb-1">
            <p className="text-xs font-semibold text-slate-900 dark:text-zinc-100">{tooltip.sd.state}</p>
            <span className={`text-[10px] font-semibold ${tooltip.sd.delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
              {tooltip.sd.delta >= 0 ? '+' : ''}{tooltip.sd.delta}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-2">
            {tooltip.sd.mentions.toLocaleString()} mentions · {tooltip.sd.percentage}%
          </p>
          <div className="flex h-1.5 rounded-full overflow-hidden">
            <div style={{ width: `${tooltip.sd.sentiment.positive}%`, background: SENTIMENT_COLORS.positive }} />
            <div style={{ width: `${tooltip.sd.sentiment.neutral}%`,  background: SENTIMENT_COLORS.neutral }} />
            <div style={{ width: `${tooltip.sd.sentiment.negative}%`, background: SENTIMENT_COLORS.negative }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">{tooltip.sd.sentiment.positive}% pos</span>
            <span className="text-[10px] text-red-500 dark:text-red-400">{tooltip.sd.sentiment.negative}% neg</span>
          </div>
        </div>
      )}
    </div>
  )
}
