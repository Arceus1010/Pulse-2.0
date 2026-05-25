import { useState, useMemo } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

import type { Source, SourceKind } from '../types'

// ─── Constants ────────────────────────────────────────────────────────────────

type StatusFilter = 'all' | 'kept' | 'discarded'
type SortField    = 'relevance' | 'kind' | 'status'
type SortDir      = 'asc' | 'desc'

const KIND_LABELS: Record<SourceKind, string> = {
  kb:         'KB',
  web:        'Web',
  user_added: 'User-added',
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SourcesTabProps {
  sources: Source[]
}

export default function SourcesTab({ sources }: SourcesTabProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [kindFilters,  setKindFilters]  = useState<Set<SourceKind>>(new Set())
  const [sortField,    setSortField]    = useState<SortField>('relevance')
  const [sortDir,      setSortDir]      = useState<SortDir>('desc')
  const [expandedId,   setExpandedId]   = useState<string | null>(null)

  const keptCount      = useMemo(() => sources.filter(s => s.kept).length,  [sources])
  const discardedCount = sources.length - keptCount

  const availableKinds = useMemo(
    () => ([...new Set(sources.map(s => s.kind))] as SourceKind[]).sort(),
    [sources],
  )

  const filtered = useMemo(() => {
    let r = sources
    if (statusFilter === 'kept')      r = r.filter(s => s.kept)
    if (statusFilter === 'discarded') r = r.filter(s => !s.kept)
    if (kindFilters.size > 0)         r = r.filter(s => kindFilters.has(s.kind))
    return r
  }, [sources, statusFilter, kindFilters])

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0
      if (sortField === 'relevance') cmp = (a.relevanceScore ?? -1) - (b.relevanceScore ?? -1)
      if (sortField === 'kind')      cmp = a.kind.localeCompare(b.kind)
      if (sortField === 'status')    cmp = (a.kept ? 1 : 0) - (b.kept ? 1 : 0)
      return sortDir === 'desc' ? -cmp : cmp
    })
  }, [filtered, sortField, sortDir])

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortField(field)
      setSortDir(field === 'relevance' ? 'desc' : 'asc')
    }
  }

  function toggleKind(kind: SourceKind) {
    setKindFilters(prev => {
      const next = new Set(prev)
      if (next.has(kind)) next.delete(kind); else next.add(kind)
      return next
    })
  }

  function toggleRow(id: string) {
    setExpandedId(prev => prev === id ? null : id)
  }

  // ── Empty state ─────────────────────────────────────────────────────────────

  if (sources.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8 py-16 text-center">
        <p className="text-base font-medium text-slate-500 dark:text-zinc-400">No sources</p>
        <p className="text-sm text-slate-500 dark:text-zinc-400">No sources were collected for this task.</p>
      </div>
    )
  }

  // ── Layout ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col">

      {/* Summary + controls */}
      <div className="px-5 py-3 flex items-center gap-3 flex-wrap border-b border-slate-100 dark:border-zinc-800">
        <span className="text-sm text-slate-500 dark:text-zinc-400 mr-1">
          <span className="font-semibold text-slate-700 dark:text-zinc-200">{sources.length}</span> sources
          {'  ·  '}
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">{keptCount} kept</span>
          {'  ·  '}
          <span className="text-slate-500 dark:text-zinc-400">{discardedCount} discarded</span>
        </span>

        {/* Status chips */}
        <div className="flex items-center gap-1 ml-auto">
          {(['all', 'kept', 'discarded'] as StatusFilter[]).map(f => {
            const label = f === 'all' ? `All` : f === 'kept' ? `Kept ${keptCount}` : `Discarded ${discardedCount}`
            return (
              <button
                key={f}
                type="button"
                onClick={() => setStatusFilter(f)}
                className={`h-6 px-2.5 rounded-full text-sm font-medium border transition-all ${
                  statusFilter === f
                    ? 'bg-white dark:bg-zinc-700 border-slate-200 dark:border-zinc-600 text-slate-800 dark:text-zinc-100 shadow-sm'
                    : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Kind chips — only when multiple kinds exist */}
        {availableKinds.length > 1 && (
          <div className="flex items-center gap-1">
            <span className="text-slate-200 dark:text-zinc-700 select-none">|</span>
            {availableKinds.map(k => (
              <button
                key={k}
                type="button"
                onClick={() => toggleKind(k)}
                className={`h-6 px-2.5 rounded-full text-sm font-medium border transition-all ${
                  kindFilters.has(k)
                    ? 'bg-white dark:bg-zinc-700 border-slate-200 dark:border-zinc-600 text-slate-800 dark:text-zinc-100 shadow-sm'
                    : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300'
                }`}
              >
                {KIND_LABELS[k]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div className="flex items-center justify-center px-8 py-12">
          <p className="text-sm text-slate-500 dark:text-zinc-400">No sources match the selected filters.</p>
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-zinc-800/50">
              <th className="w-9 px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                #
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                Title
              </th>
              <SortableHeader
                label="Kind"
                field="kind"
                current={sortField}
                dir={sortDir}
                onSort={() => handleSort('kind')}
              />
              <SortableHeader
                label="Status"
                field="status"
                current={sortField}
                dir={sortDir}
                onSort={() => handleSort('status')}
              />
              <SortableHeader
                label="Rel."
                field="relevance"
                current={sortField}
                dir={sortDir}
                onSort={() => handleSort('relevance')}
              />
              <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
                Reason
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((source, i) => (
              <SourceRow
                key={source.id}
                source={source}
                rowNumber={i + 1}
                expanded={expandedId === source.id}
                onToggle={() => toggleRow(source.id)}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ─── Sortable header cell ─────────────────────────────────────────────────────

function SortableHeader({ label, field, current, dir, onSort }: {
  label:  string
  field:  SortField
  current: SortField
  dir:    SortDir
  onSort: () => void
}) {
  const isActive = field === current
  return (
    <th
      onClick={onSort}
      className={`px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800 cursor-pointer select-none transition-colors whitespace-nowrap ${
        isActive
          ? 'text-slate-700 dark:text-zinc-200'
          : 'text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300'
      }`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          dir === 'desc'
            ? <ArrowDown className="w-2.5 h-2.5" />
            : <ArrowUp   className="w-2.5 h-2.5" />
        ) : (
          <ArrowUpDown className="w-2.5 h-2.5 opacity-30" />
        )}
      </span>
    </th>
  )
}

// ─── Source row ───────────────────────────────────────────────────────────────

function SourceRow({ source, rowNumber, expanded, onToggle }: {
  source:    Source
  rowNumber: number
  expanded:  boolean
  onToggle:  () => void
}) {
  return (
    <>
      <tr
        onClick={onToggle}
        className={`cursor-pointer border-b border-slate-100 dark:border-zinc-800 transition-colors ${
          expanded
            ? 'bg-blue-50/40 dark:bg-blue-950/10'
            : 'hover:bg-slate-50 dark:hover:bg-zinc-800/40'
        }`}
      >
        {/* # */}
        <td className="px-3 py-2.5 text-right text-xs tabular-nums text-slate-500 dark:text-zinc-400 align-top">
          {rowNumber}
        </td>

        {/* Title */}
        <td className="px-3 py-2.5 align-top max-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <p className="text-sm font-medium text-slate-700 dark:text-zinc-200 leading-relaxed truncate">
              {source.title}
            </p>
            <span className="shrink-0 mt-0.5 text-slate-400 dark:text-zinc-500">
              {expanded
                ? <ChevronUp className="w-3 h-3" />
                : <ChevronDown className="w-3 h-3" />}
            </span>
          </div>
          {source.uri && (
            <p className="text-sm text-slate-500 dark:text-zinc-400 truncate font-mono mt-0.5">
              {new URL(source.uri).hostname}
            </p>
          )}
        </td>

        {/* Kind */}
        <td className="px-3 py-2.5 align-top whitespace-nowrap">
          <KindBadge kind={source.kind} />
        </td>

        {/* Status */}
        <td className="px-3 py-2.5 align-top whitespace-nowrap">
          <StatusBadge kept={source.kept} />
        </td>

        {/* Relevance */}
        <td className="px-3 py-2.5 align-top">
          <RelevanceCell score={source.relevanceScore} />
        </td>

        {/* Reason */}
        <td className="px-3 py-2.5 align-top max-w-0">
          {source.discardReason ? (
            <p
              className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2"
              title={source.discardReason}
            >
              {source.discardReason}
            </p>
          ) : null}
        </td>
      </tr>

      {/* Expanded detail */}
      {expanded && (
        <tr className="border-b border-slate-100 dark:border-zinc-800">
          <td colSpan={6} className="p-0">
            <SourceDetail source={source} />
          </td>
        </tr>
      )}
    </>
  )
}

// ─── Source detail (expanded row) ────────────────────────────────────────────

function SourceDetail({ source }: { source: Source }) {
  return (
    <div className="px-12 py-4 bg-blue-50/20 dark:bg-blue-950/5 border-t border-blue-100/60 dark:border-blue-900/20 flex flex-col gap-3.5">

      {/* Source URL or KB path */}
      <div className="flex flex-col gap-1">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          Source
        </span>
        {source.uri ? (
          <a
            href={source.uri}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-sm text-blue-700 dark:text-blue-400 hover:underline break-all"
          >
            {source.uri}
            <ExternalLink className="w-3 h-3 shrink-0" />
          </a>
        ) : (
          <span className="text-sm text-slate-600 dark:text-zinc-400">
            Knowledge base document
          </span>
        )}
      </div>

      {/* Excerpt */}
      {source.excerpt && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            Excerpt
          </span>
          <blockquote className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed border-l-2 border-slate-200 dark:border-zinc-700 pl-3 italic">
            "{source.excerpt}"
          </blockquote>
        </div>
      )}

      {/* Discard reason — full text */}
      {source.discardReason && (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            Discard reason
          </span>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            {source.discardReason}
          </p>
        </div>
      )}

    </div>
  )
}

// ─── Inline badges ────────────────────────────────────────────────────────────

function KindBadge({ kind }: { kind: SourceKind }) {
  const styles: Record<SourceKind, string> = {
    kb:         'bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800/40',
    web:        'bg-sky-50 dark:bg-sky-950/30 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800/40',
    user_added: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
  }
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded border ${styles[kind]}`}>
      {KIND_LABELS[kind]}
    </span>
  )
}

function StatusBadge({ kept }: { kept: boolean }) {
  return kept ? (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-500" />
      Kept
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-zinc-400">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600" />
      Discarded
    </span>
  )
}

function RelevanceCell({ score }: { score: number | null }) {
  if (score === null) {
    return <span className="text-xs text-slate-400 dark:text-zinc-500">—</span>
  }
  return (
    <div className="flex flex-col gap-1.5 w-12">
      <span className="text-sm tabular-nums text-slate-700 dark:text-zinc-300 leading-none">{score}</span>
      <div className="h-1 rounded-full bg-slate-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            score >= 70
              ? 'bg-emerald-400 dark:bg-emerald-500'
              : score >= 40
              ? 'bg-amber-400 dark:bg-amber-500'
              : 'bg-slate-300 dark:bg-zinc-600'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}
