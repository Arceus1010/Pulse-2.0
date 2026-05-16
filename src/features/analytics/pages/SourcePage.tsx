import { useState } from 'react'
import DonutChart from '../components/charts/DonutChart'
import { newsSources, socialSources, newsSourcePie, socialPlatformPie, newsAuthors, socialAuthors } from '../mock-data'
import type { Author, SourceBreakdown } from '../types'

type SrcTab = 'news' | 'social'

function SentimentBar({ pos, neg }: { pos: number; neg: number }) {
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden w-20">
      <div style={{ width: `${pos}%`, background: '#22c55e' }} />
      <div style={{ width: `${100 - pos - neg}%`, background: '#71717a' }} />
      <div style={{ width: `${neg}%`, background: '#ef4444' }} />
    </div>
  )
}

function SourceList({ sources }: { sources: SourceBreakdown[] }) {
  return (
    <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
      {sources.map(s => (
        <li key={s.name} className="flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-zinc-200">{s.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <SentimentBar pos={s.positive} neg={s.negative} />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">{s.positive}%</span>
              <span className="text-[10px] text-red-500 dark:text-red-400">{s.negative}%</span>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">{s.posts.toLocaleString()}</span>
        </li>
      ))}
    </ul>
  )
}

function AuthorPanel({ authors, titlePrefix }: { authors: Author[]; titlePrefix: string }) {
  const [selected, setSelected] = useState<Author>(authors[0])

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          {titlePrefix} — {selected.name}
        </h2>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-zinc-800">
        {authors.map(a => (
          <button
            key={a.id}
            onClick={() => setSelected(a)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
              selected.id === a.id
                ? 'bg-blue-50 dark:bg-blue-950/20'
                : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-[11px] font-bold text-blue-700 dark:text-blue-400 shrink-0">
              {a.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">{a.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500">{a.handle} · {a.platform}</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 shrink-0">{a.reach}</span>
          </button>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed italic border-l-2 border-blue-300 dark:border-blue-700 pl-3">
          "{selected.recentStatement}"
        </p>
      </div>
    </div>
  )
}

export default function SourcePage() {
  const [tab, setTab] = useState<SrcTab>('news')

  const sources = tab === 'news' ? newsSources : socialSources
  const pieData = tab === 'news' ? newsSourcePie : socialPlatformPie
  const authors = tab === 'news' ? newsAuthors : socialAuthors
  const authorPrefix = tab === 'news' ? 'Top Authors' : 'Top Accounts'

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-zinc-800">
        {(['news', 'social'] as SrcTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 -mb-px capitalize transition-colors ${
              tab === t
                ? 'border-blue-800 dark:border-blue-400 text-blue-800 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200'
            }`}
          >
            {t === 'news' ? 'News' : 'Social Platforms'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Source list */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              {tab === 'news' ? 'News Sources' : 'Social Platforms'}
            </h2>
          </div>
          <SourceList sources={sources} />
        </div>

        {/* Right col */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                {tab === 'news' ? 'Mentions by Source' : 'Platform Share'}
              </h2>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-3 mb-3">
                {pieData.map(d => (
                  <span key={d.name} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                    <span className="w-2 h-2 rounded-sm inline-block" style={{ background: d.color }} />
                    {d.name}
                  </span>
                ))}
              </div>
              <DonutChart data={pieData} height={200} />
            </div>
          </div>
          <AuthorPanel authors={authors} titlePrefix={authorPrefix} />
        </div>
      </div>
    </div>
  )
}
