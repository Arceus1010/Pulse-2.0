import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="h-14 flex items-center px-6 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-20">
        <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-100">
          <Settings className="w-4 h-4 text-blue-800 dark:text-blue-400" />
          <span className="text-sm font-semibold">Settings</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="flex flex-col items-center gap-3 text-center max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-800 dark:text-blue-400">
            <Settings className="w-6 h-6" />
          </div>
          <h1 className="text-base font-semibold text-slate-800 dark:text-zinc-100">Settings</h1>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400">
            Workspace preferences, integrations, and account configuration will appear here.
          </p>
          <span className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400 text-[10px] font-semibold uppercase tracking-widest">
            Coming soon
          </span>
        </div>
      </div>
    </div>
  )
}
