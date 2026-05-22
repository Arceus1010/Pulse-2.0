interface Option {
  value: string
  label: string
}

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export default function TabBar({ options, value, onChange }: Props) {
  return (
    <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 rounded-md p-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
            value === o.value
              ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-50 shadow-sm'
              : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-700 dark:hover:text-zinc-200'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
