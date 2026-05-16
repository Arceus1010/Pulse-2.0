import { useState } from 'react'
import type { StateData } from '../types'

interface Props {
  data: StateData[]
}

interface StateShape {
  id: string
  label: string
  d: string
  labelX: number
  labelY: number
}

const SHAPES: StateShape[] = [
  { id: 'perlis', label: 'Perlis', labelX: 147, labelY: 57, d: 'M 135 48 L 150 45 L 155 58 L 140 62 Z' },
  { id: 'kedah', label: 'Kedah', labelX: 152, labelY: 78, d: 'M 130 58 L 160 48 L 175 80 L 155 100 L 130 90 Z' },
  { id: 'penang', label: 'Penang', labelX: 130, labelY: 86, d: 'M 120 80 L 138 75 L 142 90 L 124 95 Z' },
  { id: 'perak', label: 'Perak', labelX: 163, labelY: 120, d: 'M 140 90 L 175 78 L 190 130 L 160 150 L 138 140 Z' },
  { id: 'kelantan', label: 'Kelantan', labelX: 213, labelY: 68, d: 'M 195 48 L 240 45 L 245 90 L 200 92 L 185 70 Z' },
  { id: 'terengganu', label: 'Terengganu', labelX: 252, labelY: 87, d: 'M 240 60 L 270 65 L 265 115 L 240 110 L 238 90 Z' },
  { id: 'pahang', label: 'Pahang', labelX: 225, labelY: 132, d: 'M 190 92 L 265 112 L 260 170 L 218 180 L 190 165 Z' },
  { id: 'selangor', label: 'Selangor', labelX: 163, labelY: 172, d: 'M 145 148 L 178 138 L 192 165 L 185 192 L 158 198 L 142 175 Z' },
  { id: 'kl', label: 'KL', labelX: 171, labelY: 169, d: 'M 162 160 L 178 158 L 180 175 L 164 177 Z' },
  { id: 'ns', label: 'N.Sembilan', labelX: 174, labelY: 210, d: 'M 155 195 L 190 192 L 196 218 L 170 228 L 153 218 Z' },
  { id: 'melaka', label: 'Melaka', labelX: 178, labelY: 232, d: 'M 163 226 L 190 220 L 194 238 L 167 242 Z' },
  { id: 'johor', label: 'Johor', labelX: 207, labelY: 246, d: 'M 155 238 L 200 225 L 260 178 L 268 220 L 235 260 L 195 270 L 160 260 Z' },
  { id: 'sabah', label: 'Sabah', labelX: 558, labelY: 125, d: 'M 510 80 L 590 70 L 620 110 L 600 155 L 560 170 L 510 155 L 500 120 Z' },
  { id: 'sarawak', label: 'Sarawak', labelX: 443, labelY: 162, d: 'M 390 120 L 500 80 L 510 160 L 490 200 L 440 220 L 380 200 L 360 165 Z' },
]

function stateColor(pct: number, maxPct: number, hovered: boolean) {
  const a = pct / maxPct
  if (hovered) return `rgba(59, 130, 246, ${0.4 + a * 0.55})`
  return `rgba(59, 130, 246, ${0.08 + a * 0.72})`
}

export default function MalaysiaMap({ data }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string; pct: number; mentions: number } | null>(null)

  const dataMap = Object.fromEntries(data.map(d => [d.state.toLowerCase().replace(/[.\s]/g, ''), d]))
  const maxPct = Math.max(...data.map(d => d.percentage))

  const getStateData = (id: string) => {
    const key = id.replace(/[.\s]/g, '')
    return dataMap[key] ?? dataMap['kl'] ?? null
  }

  return (
    <div className="relative w-full">
      <svg viewBox="100 40 560 240" className="w-full" style={{ maxHeight: 360 }}>
        {SHAPES.map(shape => {
          const sd = getStateData(shape.id)
          const pct = sd?.percentage ?? 0
          const isHovered = hovered === shape.id

          return (
            <g key={shape.id}>
              <path
                d={shape.d}
                fill={stateColor(pct, maxPct, isHovered)}
                stroke={isHovered ? '#3b82f6' : '#71717a'}
                strokeWidth={isHovered ? 1.5 : 0.8}
                strokeOpacity={isHovered ? 0.8 : 0.4}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={e => {
                  setHovered(shape.id)
                  const rect = (e.currentTarget as SVGElement).closest('svg')!.getBoundingClientRect()
                  setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, label: shape.label, pct, mentions: sd?.mentions ?? 0 })
                }}
                onMouseMove={e => {
                  const rect = (e.currentTarget as SVGElement).closest('svg')!.getBoundingClientRect()
                  setTooltip(t => t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : null)
                }}
                onMouseLeave={() => { setHovered(null); setTooltip(null) }}
              />
              {pct >= 4 && (
                <text
                  x={shape.labelX}
                  y={shape.labelY}
                  textAnchor="middle"
                  fontSize={6.5}
                  fill={isHovered ? '#fff' : 'rgba(255,255,255,0.7)'}
                  style={{ pointerEvents: 'none', fontFamily: 'inherit' }}
                >
                  {shape.label}
                </text>
              )}
            </g>
          )
        })}

        {/* Legend */}
        {['Low', 'Mid', 'High'].map((lbl, i) => {
          const a = (i + 1) / 3
          return (
            <g key={lbl}>
              <rect x={100 + i * 44} y={266} width={38} height={9} rx={2} fill={`rgba(59, 130, 246, ${0.1 + a * 0.7})`} />
              <text x={119 + i * 44} y={282} textAnchor="middle" fontSize={6.5} fill="#71717a" style={{ fontFamily: 'inherit' }}>{lbl}</text>
            </g>
          )
        })}
      </svg>

      {tooltip && (
        <div
          className="absolute z-10 pointer-events-none bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-md px-3 py-2 text-xs shadow-lg"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <p className="font-semibold text-slate-900 dark:text-zinc-100">{tooltip.label}</p>
          <p className="text-slate-500 dark:text-zinc-400">{tooltip.pct}% · {tooltip.mentions.toLocaleString()} mentions</p>
        </div>
      )}
    </div>
  )
}
