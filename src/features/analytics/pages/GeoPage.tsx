import MalaysiaMap from '../components/MalaysiaMap'
import { geoData } from '../mock-data'

export default function GeoPage() {
  const max = Math.max(...geoData.map(d => d.percentage))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              Malaysia — State Distribution
            </h2>
          </div>
          <div className="p-4">
            <MalaysiaMap data={geoData} />
          </div>
        </div>

        {/* State bars */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              Distribution by State
            </h2>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {geoData.map(d => (
              <div key={d.state} className="flex items-center gap-3">
                <span className="text-xs text-slate-700 dark:text-zinc-300 w-28 shrink-0 truncate">{d.state}</span>
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${(d.percentage / max) * 100}%` }}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 w-8 text-right">{d.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mentions summary */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            Mention Volume by State
          </h2>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {geoData.map(d => (
            <div key={d.state} className="text-center">
              <p className="text-lg font-bold text-slate-900 dark:text-zinc-100">{(d.mentions / 1000).toFixed(0)}k</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">{d.state}</p>
              <p className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">{d.percentage}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
