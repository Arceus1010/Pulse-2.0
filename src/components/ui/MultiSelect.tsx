import { useState, useRef, useEffect } from 'react'
import { Layers, ChevronDown } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface Props {
  options: Option[]
  selected: string[]
  onChange: (selected: string[]) => void
  label: string
  className?: string
}

export default function MultiSelect({ options, selected, onChange, label, className }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const allSelected = selected.length === options.length

  function toggleAll() {
    onChange(allSelected ? [options[0].value] : options.map(o => o.value))
  }

  function toggle(value: string) {
    if (selected.includes(value)) {
      if (selected.length === 1) return
      onChange(selected.filter(v => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  function triggerLabel() {
    if (allSelected) return `All ${label}`
    if (selected.length === 1) return options.find(o => o.value === selected[0])?.label ?? ''
    if (selected.length === 2) return selected.map(v => options.find(o => o.value === v)?.label).join(', ')
    return `${selected.length} ${label}`
  }

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
      >
        <Layers className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
        <span>{triggerLabel()}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 dark:text-zinc-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 z-50 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-xl p-3 min-w-44">
          <div className="flex items-center gap-1.5 mb-3 pb-2.5 border-b border-slate-100 dark:border-zinc-800">
            <Layers className="w-3 h-3 text-slate-400 dark:text-zinc-500 shrink-0" />
            <span className="text-xs font-medium text-slate-600 dark:text-zinc-300">{label}</span>
          </div>

          <div className="flex flex-col gap-0.5">
            <button
              onClick={toggleAll}
              className={`w-full text-left px-2 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                allSelected
                  ? 'bg-slate-800 dark:bg-zinc-200 text-white dark:text-zinc-900'
                  : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200'
              }`}
            >
              All
            </button>

            <div className="w-full h-px bg-slate-100 dark:bg-zinc-800 my-1" />

            {options.map(opt => {
              const active = !allSelected && selected.includes(opt.value)
              return (
                <button
                  key={opt.value}
                  onClick={() => toggle(opt.value)}
                  className={`w-full text-left px-2 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-400'
                      : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200'
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
