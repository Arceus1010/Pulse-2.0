import { useState, useEffect } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

import type { Task, TraceStep, TraceStepType } from '../types'
import { TRACE_STEP_TYPE_LABELS } from '../types'

// ─── Types ────────────────────────────────────────────────────────────────────

type DisplayItem =
  | { kind: 'actual';  step: TraceStep }
  | { kind: 'pending'; type: TraceStepType }

// ─── Component ────────────────────────────────────────────────────────────────

export default function LiveTrace({ task }: { task: Task }) {
  const elapsedSeconds = useElapsedSeconds(task.createdAt)
  const items          = buildDisplayList(task)

  return (
    <div className="flex-1 flex flex-col px-5 py-6 gap-4">

      {/* Working banner */}
      <div className="flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
        </span>
        <span className="text-base font-medium text-slate-700 dark:text-zinc-200">Agent is working…</span>
        <span className="ml-auto text-sm tabular-nums text-slate-500 dark:text-zinc-400">
          {formatElapsed(elapsedSeconds)}
        </span>
      </div>

      {/* Step cards */}
      <div className="flex flex-col rounded-xl border border-slate-100 dark:border-zinc-800 overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
        {items.map((item, i) => (
          <StepCard
            key={item.kind === 'actual' ? item.step.id : item.type}
            item={item}
            index={i}
          />
        ))}
      </div>

    </div>
  )
}

// ─── Step card ────────────────────────────────────────────────────────────────

function StepCard({ item, index }: { item: DisplayItem; index: number }) {
  const [expanded, setExpanded] = useState(false)

  const step   = item.kind === 'actual' ? item.step : null
  const status = step?.status ?? null

  // Auto-expand while running; auto-collapse when the step completes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (status === 'running')  setExpanded(true)
    if (status === 'complete') setExpanded(false)
  }, [status])

  // ── Pending placeholder ──────────────────────────────────────────────────────
  if (item.kind === 'pending') {
    return (
      <div className="grid grid-cols-[0.5rem_1fr] items-center gap-3 px-4 py-3 opacity-35">
        <span className="w-2 h-2 rounded-full border border-slate-300 dark:border-zinc-600 justify-self-center" />
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 tabular-nums w-4 text-right shrink-0">
            {index + 1}
          </span>
          <span className="text-sm text-slate-500 dark:text-zinc-400 truncate">
            {TRACE_STEP_TYPE_LABELS[item.type]}
          </span>
        </div>
      </div>
    )
  }

  // ── Actual step ──────────────────────────────────────────────────────────────
  const { step: actualStep } = item
  const isRunning  = actualStep.status === 'running'
  const isComplete = actualStep.status === 'complete'

  const hasInputs  = Object.keys(actualStep.inputs).length > 0
  const hasOutputs = isComplete && Object.keys(actualStep.outputs).length > 0

  const showCollapsedSummary = isComplete && !expanded
  const showExpandedBody     = expanded

  return (
    <div className={isRunning ? 'bg-blue-50/40 dark:bg-blue-950/10' : undefined}>

      {/* Header row — acts as the toggle button */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className={`grid grid-cols-[0.5rem_1fr] items-center gap-3 px-4 py-3 w-full text-left transition-colors ${
          isComplete
            ? 'hover:bg-slate-50 dark:hover:bg-zinc-800/40 cursor-pointer'
            : 'cursor-default'
        }`}
      >
        {/* Status dot */}
        <StatusDot status={actualStep.status} />

        {/* Label row */}
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-xs font-medium tabular-nums w-4 text-right shrink-0 ${
            isRunning
              ? 'text-blue-500 dark:text-blue-400'
              : 'text-slate-500 dark:text-zinc-400'
          }`}>
            {index + 1}
          </span>

          <span className={`text-sm truncate ${
            isRunning
              ? 'font-medium text-slate-800 dark:text-zinc-100'
              : 'text-slate-700 dark:text-zinc-200'
          }`}>
            {TRACE_STEP_TYPE_LABELS[actualStep.type]}
          </span>

          {isComplete && actualStep.durationMs != null && (
            <span className="ml-auto text-xs tabular-nums text-slate-500 dark:text-zinc-400 shrink-0">
              {formatDuration(actualStep.durationMs)}
            </span>
          )}

          {isComplete && (
            <span className="text-slate-400 dark:text-zinc-500 shrink-0">
              {expanded
                ? <ChevronDown className="w-3.5 h-3.5" />
                : <ChevronRight className="w-3.5 h-3.5" />}
            </span>
          )}
        </div>
      </button>

      {/* Collapsed summary — one-line result below the header */}
      {showCollapsedSummary && (
        <div className="grid grid-cols-[0.5rem_1fr] gap-3 px-4 pb-3 pointer-events-none">
          <div />
          <div className="pl-6">
            <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
              {deriveStepSummary(actualStep)}
            </p>
          </div>
        </div>
      )}

      {/* Expanded body — inputs, outputs, reasoning */}
      {showExpandedBody && (
        <div className="grid grid-cols-[0.5rem_1fr] gap-3 px-4 pb-4">
          <div />
          <div className="pl-6 flex flex-col gap-3">

            {isComplete && (
              <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">
                {deriveStepSummary(actualStep)}
              </p>
            )}

            {hasInputs && <DataBlock label="Inputs" data={actualStep.inputs} />}
            {hasOutputs && <DataBlock label="Outputs" data={actualStep.outputs} />}

            {actualStep.reasoning && (
              <div className="rounded-md border-l-2 border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/10 px-3 py-2">
                <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed italic">
                  {actualStep.reasoning}
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}

// ─── Status dot ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  if (status === 'running') {
    return (
      <span className="relative flex h-2 w-2 justify-self-center">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
      </span>
    )
  }
  if (status === 'complete') {
    return <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500 justify-self-center" />
  }
  return <span className="w-2 h-2 rounded-full border border-slate-300 dark:border-zinc-600 justify-self-center" />
}

// ─── Data blocks ──────────────────────────────────────────────────────────────

function DataBlock({ label, data }: { label: string; data: Record<string, unknown> }) {
  return (
    <div className="rounded-md border border-slate-100 dark:border-zinc-700/60 overflow-hidden">
      <div className="px-2.5 py-1 bg-slate-50 dark:bg-zinc-800 border-b border-slate-100 dark:border-zinc-700/60">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
          {label}
        </span>
      </div>
      <div className="px-2.5 py-2 flex flex-col gap-2">
        {Object.entries(data).map(([key, value]) => (
          <DataEntry key={key} name={key} value={value} />
        ))}
      </div>
    </div>
  )
}

function DataEntry({ name, value, depth = 0 }: { name: string; value: unknown; depth?: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400">
        {name}
      </span>
      <DataValue value={value} depth={depth} />
    </div>
  )
}

function DataValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) {
    return <span className="text-sm text-slate-400 dark:text-zinc-500 italic">—</span>
  }
  if (typeof value === 'string') {
    return <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed wrap-break-words">{value}</p>
  }
  if (typeof value === 'number') {
    return <p className="text-sm text-slate-700 dark:text-zinc-300 tabular-nums">{value.toLocaleString()}</p>
  }
  if (typeof value === 'boolean') {
    return <p className="text-sm text-slate-700 dark:text-zinc-300">{value ? 'Yes' : 'No'}</p>
  }
  if (Array.isArray(value)) {
    const visible  = value.slice(0, 6)
    const overflow = value.length - 6
    return (
      <ul className="flex flex-col gap-0.5 pl-3">
        {visible.map((item, i) => (
          <li key={i} className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed list-disc list-outside">
            {typeof item === 'string' ? item : JSON.stringify(item)}
          </li>
        ))}
        {overflow > 0 && (
          <li className="text-sm text-slate-500 dark:text-zinc-400 italic list-none">
            +{overflow} more
          </li>
        )}
      </ul>
    )
  }
  if (typeof value === 'object' && depth < 2) {
    const entries = Object.entries(value as Record<string, unknown>)
    return (
      <div className="pl-2 border-l border-slate-200 dark:border-zinc-700 flex flex-col gap-1.5 mt-0.5">
        {entries.map(([k, v]) => (
          <DataEntry key={k} name={k} value={v} depth={depth + 1} />
        ))}
      </div>
    )
  }
  return <p className="text-sm text-slate-500 dark:text-zinc-400 font-mono">{JSON.stringify(value)}</p>
}

// ─── Step summary ─────────────────────────────────────────────────────────────

function deriveStepSummary(step: TraceStep): string {
  const out = step.outputs as Record<string, unknown>

  switch (step.type) {
    case 'plan': {
      const q = (out.subQuestions as unknown[] | undefined)?.length ?? 0
      return `Decomposed into ${q} sub-question${q !== 1 ? 's' : ''}`
    }
    case 'search_web': {
      const retrieved = (out.sourcesRetrieved as number | undefined) ?? 0
      const kept      = (out.sourcesKept      as number | undefined) ?? 0
      return `Retrieved ${retrieved} web sources, kept ${kept}`
    }
    case 'search_kb': {
      const retrieved = (out.documentsRetrieved as number | undefined) ?? 0
      const kept      = (out.documentsKept      as number | undefined) ?? 0
      return `Retrieved ${retrieved} KB documents, kept ${kept}`
    }
    case 'read': {
      const docs   = (out.documentsRead   as number | undefined) ?? 0
      const tokens = (out.tokensExtracted as number | undefined) ?? 0
      return `Read ${docs} document${docs !== 1 ? 's' : ''} · ${tokens.toLocaleString()} tokens extracted`
    }
    case 'synthesize': {
      const sections = (out.sectionsProduced as number | undefined) ?? 0
      const words    = (out.wordCount        as number | undefined) ?? 0
      return `Synthesised ${sections} section${sections !== 1 ? 's' : ''} · ${words.toLocaleString()} words`
    }
    case 'emit': {
      const words = (out.wordCount    as number | undefined) ?? 0
      const kind  = (out.artifactKind as string | undefined) ?? ''
      return kind
        ? `Emitted ${kind} · ${words.toLocaleString()} words`
        : `Artifact emitted · ${words.toLocaleString()} words`
    }
    default:
      return TRACE_STEP_TYPE_LABELS[step.type] ?? step.type
  }
}

// ─── Build display list ───────────────────────────────────────────────────────

function buildDisplayList(task: Task): DisplayItem[] {
  const searchType: TraceStepType = task.sourcesWeb ? 'search_web' : 'search_kb'
  const SEQUENCE: TraceStepType[] = ['plan', searchType, 'read', 'synthesize', 'emit']
  const actual = task.trace?.steps ?? []

  return SEQUENCE.map(type => {
    const step = actual.find(s => s.type === type)
    return step ? { kind: 'actual', step } : { kind: 'pending', type }
  })
}

// ─── Elapsed timer ────────────────────────────────────────────────────────────

function useElapsedSeconds(since: string | null): number {
  const [elapsed, setElapsed] = useState(() => since ? 0 : 0)

  useEffect(() => {
    if (!since) return
    const update = () =>
      setElapsed(Math.floor((Date.now() - new Date(since).getTime()) / 1000))
    update()
    const id = setInterval(update, 1_000)
    return () => clearInterval(id)
  }, [since])

  return elapsed
}

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s > 0 ? `${m}m ${s}s` : `${m}m`
}

function formatDuration(ms: number): string {
  if (ms < 1_000) return `${ms}ms`
  return `${(ms / 1_000).toFixed(1)}s`
}
