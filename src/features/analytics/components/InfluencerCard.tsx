import type { Influencer } from '../types'
import Avatar from '../../../components/ui/Avatar'

export default function InfluencerCard({ inf }: { inf: Influencer }) {
  return (
    <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
      <div className="flex items-center gap-2.5 mb-3">
        <Avatar initials={inf.initials} />
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{inf.name}</p>
          <p className="text-[11px] text-slate-400 dark:text-zinc-500">{inf.handle} · {inf.platform}</p>
        </div>
      </div>
      <blockquote className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed italic border-l-2 border-slate-200 dark:border-zinc-700 pl-3 mb-2">
        "{inf.quote}"
      </blockquote>
      <p className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">Reach: {inf.reach}</p>
    </div>
  )
}
