import { useState, useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { X, Zap, Search } from 'lucide-react'
import { useAnalyticsFilters } from './hooks/useAnalyticsFilters'
import { ALL_PLATFORMS, PLATFORM_LABELS } from './constants'
import type { Platform } from './types'
import DateRangePicker from '../../components/ui/DateRangePicker'
import MultiSelect from '../../components/ui/MultiSelect'

const NAV_ITEMS = [
  { to: '/analytics/overview', label: 'Overview' },
  { to: '/analytics/trend', label: 'Trend' },
  { to: '/analytics/sentiment', label: 'Sentiment' },
  { to: '/analytics/source', label: 'Source' },
  { to: '/analytics/geo', label: 'Geographic' },
  { to: '/analytics/pestle', label: 'PESTLE' },
]

const PLATFORM_OPTIONS = ALL_PLATFORMS.map(p => ({ value: p, label: PLATFORM_LABELS[p] }))

export default function Analytics() {
  const { filter, setFilter } = useAnalyticsFilters()
  const [kwInput, setKwInput] = useState('')
  const [local, setLocal] = useState({ ...filter })
  const [analysing, setAnalysing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const runAnalysis = () => {
    setFilter(local)
    setAnalysing(true)
    setTimeout(() => setAnalysing(false), 1800)
  }

  const addKw = () => {
    const val = kwInput.trim()
    if (!val || local.keywords.includes(val)) return
    setLocal(f => ({ ...f, keywords: [...f.keywords, val] }))
    setKwInput('')
    inputRef.current?.focus()
  }

  const removeKw = (kw: string) =>
    setLocal(f => ({ ...f, keywords: f.keywords.filter(k => k !== kw) }))

  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky top-0 z-20 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800">

        {/* ── Filter Bar ───────────────────────────────── */}
        <div className="h-14 flex items-stretch border-b border-slate-200 dark:border-zinc-800">

          {/* Keywords */}
          <div
            className="flex items-center gap-2 px-4 py-3 flex-1 min-w-65 cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />

            <div className="flex items-center flex-wrap gap-1.5 flex-1">
              {local.keywords.map(kw => (
                <span
                  key={kw}
                  onClick={e => e.stopPropagation()}
                  className="inline-flex items-center gap-1 h-6 pl-2.5 pr-1.5 rounded-sm bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-400 text-xs font-medium select-none"
                >
                  {kw}
                  <button
                    onClick={() => removeKw(kw)}
                    className="flex items-center justify-center rounded-sm text-blue-400 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                ref={inputRef}
                value={kwInput}
                onChange={e => setKwInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') addKw()
                  if (e.key === 'Backspace' && !kwInput && local.keywords.length > 0)
                    removeKw(local.keywords[local.keywords.length - 1])
                }}
                placeholder={local.keywords.length === 0 ? 'Search keywords…' : 'Add more…'}
                className="h-6 bg-transparent text-xs text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none min-w-25"
              />
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 shrink-0 select-none">
              Keywords
            </span>
          </div>

          <div className="w-px bg-slate-200 dark:bg-zinc-800 self-stretch shrink-0" />

          {/* Date Range */}
          <div className="flex items-center px-4 py-3 shrink-0">
            <DateRangePicker
              from={local.dateFrom}
              to={local.dateTo}
              onChange={(from, to) => setLocal(f => ({ ...f, dateFrom: from, dateTo: to }))}
            />
          </div>

          <div className="w-px bg-slate-200 dark:bg-zinc-800 self-stretch shrink-0" />

          {/* Platforms */}
          <div className="flex items-center px-4 py-3 shrink-0">
            <MultiSelect
              options={PLATFORM_OPTIONS}
              selected={local.platforms}
              onChange={platforms => setLocal(f => ({ ...f, platforms: platforms as Platform[] }))}
              label="Platforms"
            />
          </div>

          <div className="w-px bg-slate-200 dark:bg-zinc-800 self-stretch shrink-0" />

          {/* Run */}
          <div className="flex items-center px-4 py-3 shrink-0">
            <button
              onClick={runAnalysis}
              disabled={analysing}
              className="h-8 px-5 rounded-sm bg-blue-800 hover:bg-blue-900 disabled:opacity-60 text-white text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <Zap className={`w-3.5 h-3.5 fill-white stroke-none ${analysing ? 'animate-pulse' : ''}`} />
              {analysing ? 'Analysing…' : 'Analyse'}
            </button>
          </div>

        </div>

        {/* ── Sub-nav ───────────────────────────────────── */}
        <nav className="px-6 flex items-center gap-0.5">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `px-3 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-800 dark:border-blue-400 text-blue-800 dark:text-blue-400'
                    : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

      </div>

      <div className="flex-1 p-6 relative">
        <Outlet />
        {analysing && (
          <div className="absolute inset-0 z-30 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-blue-600 animate-bounce"
                  style={{ height: 20, animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tracking-widest uppercase select-none">
              Running analysis…
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
