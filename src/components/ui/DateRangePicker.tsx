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

function toStr(d: Date): string {
  return d.toISOString().slice(0, 10)
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
  const [prevFrom, setPrevFrom] = useState(from)
  const [prevTo, setPrevTo] = useState(to)
  const [picking, setPicking] = useState<'start' | 'end'>('start')
  const [hover, setHover] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const committedRef = useRef({ from, to })

  if (prevFrom !== from || prevTo !== to) {
    setPrevFrom(from)
    setPrevTo(to)
    setDraft({ from, to })
  }

  useEffect(() => {
    committedRef.current = { from, to }
  }, [from, to])

  const rightMonth = viewMonth === 11 ? 0 : viewMonth + 1
  const rightYear = viewMonth === 11 ? viewYear + 1 : viewYear

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setPicking('start')
        setHover(null)
        setDraft(committedRef.current)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

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
    for (let d = 1; d <= numDays; d++) {
      cells.push(toStr(new Date(year, month, d)))
    }
    while (cells.length % 7 !== 0) cells.push(null)

    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          {isLeft ? (
            <button
              onClick={prevMonth}
              className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-5 h-5" />
          )}

          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 select-none">
            {MONTHS[month]} {year}
          </span>

          {!isLeft ? (
            <button
              onClick={nextMonth}
              className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-500 transition-colors"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-5 h-5" />
          )}
        </div>

        <div className="grid grid-cols-7 mb-0.5">
          {DAYS.map(d => (
            <div
              key={d}
              className="text-center text-[10px] font-semibold text-slate-400 dark:text-zinc-600 py-0.5 select-none"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((dateStr, i) => {
            if (!dateStr) return <div key={`e-${i}`} className="h-7" />

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
              <div key={dateStr} className="relative h-7 flex items-center justify-center">
                {hasRange && isStart && (
                  <div className="absolute top-0.5 bottom-0.5 left-1/2 right-0 bg-blue-50 dark:bg-blue-950/40" />
                )}
                {hasRange && isEnd && (
                  <div className="absolute top-0.5 bottom-0.5 right-1/2 left-0 bg-blue-50 dark:bg-blue-950/40" />
                )}
                {isBetween && (
                  <div className="absolute inset-x-0 top-0.5 bottom-0.5 bg-blue-50 dark:bg-blue-950/40" />
                )}
                <button
                  onClick={() => handleDayClick(dateStr)}
                  onMouseEnter={() => setHover(dateStr)}
                  onMouseLeave={() => setHover(null)}
                  className={`relative z-10 w-7 h-7 flex items-center justify-center text-xs rounded-full transition-colors select-none ${btnClass}`}
                >
                  {day}
                </button>
              </div>
            )
          })}
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
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
      >
        <Calendar className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
        <span>{label}</span>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl p-3 w-115">
          <div className="flex items-center gap-1.5 mb-3 pb-2.5 border-b border-slate-100 dark:border-zinc-800">
            <Calendar className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
            <span className="text-xs font-medium text-slate-600 dark:text-zinc-300">
              {label}
            </span>
          </div>

          <div className="flex gap-3">
            {renderMonth(viewYear, viewMonth, true)}
            <div className="w-px bg-slate-100 dark:bg-zinc-800 shrink-0 self-stretch" />
            {renderMonth(rightYear, rightMonth, false)}
          </div>
        </div>
      )}
    </div>
  )
}
