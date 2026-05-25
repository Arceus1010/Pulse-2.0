import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  from: string
  to: string
  onChange: (from: string, to: string) => void
  className?: string
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Safe: avoids toISOString() UTC shift on negative-offset timezones
function toStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function fmt(s: string): string {
  if (!s) return ''
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function firstWeekday(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export default function DateRangePicker({ from, to, onChange, className }: Props) {
  const today = new Date()

  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(
    from ? parseInt(from.slice(0, 4)) : today.getFullYear()
  )
  const [viewMonth, setViewMonth] = useState(
    from ? parseInt(from.slice(5, 7)) - 1 : today.getMonth()
  )
  const [draft, setDraft] = useState({ from, to })
  const [picking, setPicking] = useState<'start' | 'end'>('start')
  const [hover, setHover] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const committedRef = useRef({ from, to })

  // Derived state: sync draft + view when props change without setState-in-effect
  const [prevFrom, setPrevFrom] = useState(from)
  const [prevTo, setPrevTo] = useState(to)
  if (prevFrom !== from || prevTo !== to) {
    setPrevFrom(from)
    setPrevTo(to)
    setDraft({ from, to })
    if (from) {
      setViewYear(parseInt(from.slice(0, 4)))
      setViewMonth(parseInt(from.slice(5, 7)) - 1)
    }
  }

  // Ref-only sync: safe in useEffect because it doesn't call setState
  useEffect(() => {
    committedRef.current = { from, to }
  }, [from, to])

  // Outside click + Escape — only wired when open; reset logic inlined to avoid useCallback
  useEffect(() => {
    if (!open) return
    function reset() {
      setOpen(false)
      setPicking('start')
      setHover(null)
      setDraft(committedRef.current)
    }
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) reset()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') reset()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const rightMonth = viewMonth === 11 ? 0 : viewMonth + 1
  const rightYear = viewMonth === 11 ? viewYear + 1 : viewYear

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function handleDayClick(dateStr: string) {
    if (picking === 'start') {
      setDraft({ from: dateStr, to: '' })
      setPicking('end')
    } else {
      const [f, t] = dateStr < draft.from
        ? [dateStr, draft.from]
        : [draft.from, dateStr]
      setDraft({ from: f, to: t })
      setPicking('start')
      setHover(null)
      onChange(f, t)
      setOpen(false)
    }
  }

  function renderMonth(year: number, month: number, isLeft: boolean) {
    const numDays = daysInMonth(year, month)
    const startDay = firstWeekday(year, month)

    const cells: (string | null)[] = Array(startDay).fill(null)
    for (let d = 1; d <= numDays; d++) cells.push(toStr(year, month, d))
    while (cells.length % 7 !== 0) cells.push(null)

    const weeks: (string | null)[][] = []
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          {isLeft ? (
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous month"
              className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-5 h-5" aria-hidden="true" />
          )}

          <span
            className="text-sm font-semibold text-slate-700 dark:text-zinc-200 select-none"
            aria-live="polite"
            aria-atomic="true"
          >
            {MONTHS[month]} {year}
          </span>

          {!isLeft ? (
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-5 h-5" aria-hidden="true" />
          )}
        </div>

        <div role="grid" aria-label={`${MONTHS[month]} ${year}`}>
          <div role="row" className="grid grid-cols-7 mb-0.5">
            {DAYS.map((d, i) => (
              <div
                key={d}
                role="columnheader"
                aria-label={DAY_LABELS[i]}
                className="text-center text-xs font-semibold text-slate-400 dark:text-zinc-600 py-0.5 select-none"
              >
                {d}
              </div>
            ))}
          </div>

          {weeks.map((week, wi) => (
            <div key={wi} role="row" className="grid grid-cols-7">
              {week.map((dateStr, di) => {
                if (!dateStr) return (
                  <div key={`e-${wi}-${di}`} role="gridcell" className="h-7" aria-hidden="true" />
                )

                const df = draft.from
                const effTo = picking === 'end' && hover ? hover : draft.to

                const lo = df && effTo ? (df <= effTo ? df : effTo) : df || null
                const hi = df && effTo ? (df <= effTo ? effTo : df) : null

                const isStart = !!lo && dateStr === lo
                const hasRange = !!lo && !!hi && lo !== hi
                const isEnd = hasRange && dateStr === hi
                const isBetween = hasRange && dateStr > lo! && dateStr < hi!

                const day = parseInt(dateStr.slice(8))

                const btnClass = isStart || isEnd
                  ? 'bg-blue-600 hover:bg-blue-700 text-white font-semibold'
                  : isBetween
                  ? 'text-slate-700 dark:text-zinc-200'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'

                return (
                  <div
                    key={dateStr}
                    role="gridcell"
                    aria-selected={isStart || isEnd || isBetween}
                    className="relative h-7 flex items-center justify-center"
                  >
                    {hasRange && isStart && (
                      <div className="absolute top-0.5 bottom-0.5 left-1/2 right-0 bg-blue-50 dark:bg-blue-950/40" aria-hidden="true" />
                    )}
                    {hasRange && isEnd && (
                      <div className="absolute top-0.5 bottom-0.5 right-1/2 left-0 bg-blue-50 dark:bg-blue-950/40" aria-hidden="true" />
                    )}
                    {isBetween && (
                      <div className="absolute inset-x-0 top-0.5 bottom-0.5 bg-blue-50 dark:bg-blue-950/40" aria-hidden="true" />
                    )}
                    <button
                      type="button"
                      onClick={() => handleDayClick(dateStr)}
                      onMouseEnter={() => setHover(dateStr)}
                      onMouseLeave={() => setHover(null)}
                      aria-label={fmt(dateStr)}
                      className={`relative z-10 w-7 h-7 flex items-center justify-center text-sm rounded-full transition-colors select-none ${btnClass}`}
                    >
                      {day}
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const label = draft.from && draft.to
    ? `${fmt(draft.from)} – ${fmt(draft.to)}`
    : draft.from
    ? `${fmt(draft.from)} – …`
    : 'Select date range'

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Date range: ${label}`}
        className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
      >
        <Calendar className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" aria-hidden="true" />
        <span aria-hidden="true">{label}</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Select date range"
          aria-modal="true"
          className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl p-3 w-115"
        >
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" aria-hidden="true" />
              <span className="text-sm font-medium text-slate-600 dark:text-zinc-300" aria-live="polite">
                {label}
              </span>
            </div>
            <span className="text-xs text-slate-400 dark:text-zinc-500">
              {picking === 'start' ? 'Select start date' : 'Select end date'}
            </span>
          </div>

          <div className="flex gap-3">
            {renderMonth(viewYear, viewMonth, true)}
            <div className="w-px bg-slate-100 dark:bg-zinc-800 shrink-0 self-stretch" aria-hidden="true" />
            {renderMonth(rightYear, rightMonth, false)}
          </div>
        </div>
      )}
    </div>
  )
}
