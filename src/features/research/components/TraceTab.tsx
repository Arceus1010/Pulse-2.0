import { useState } from 'react'
import { ChevronDown, ChevronRight, ArrowUpRight, Download } from 'lucide-react'

import type { Task, TraceStep } from '../types'
import { TRACE_STEP_TYPE_LABELS } from '../types'

// ─── Component ────────────────────────────────────────────────────────────────

interface TraceTabProps {
  task:              Task
  onJumpToSection?:  (slug: string) => void
}

export default function TraceTab({ task, onJumpToSection }: TraceTabProps) {
  const trace = task.trace
  if (!trace || trace.steps.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-2 px-8 py-16 text-center">
        <p className="text-sm text-slate-500 dark:text-zinc-400">No trace available.</p>
      </div>
    )
  }

  const webStep = trace.steps.find(s => s.type === 'search_web')
  const kbStep  = trace.steps.find(s => s.type === 'search_kb')
  const sourcesEvaluated =
    ((webStep?.outputs?.sourcesRetrieved as number | undefined) ?? 0) +
    ((kbStep?.outputs?.documentsRetrieved as number | undefined) ?? 0)

  function handleDownloadTrace() {
    const blob = new Blob([JSON.stringify(trace, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = 'trace.json'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col px-5 py-6 gap-4">

      {/* Goal blockquote */}
      <blockquote className="border-l-2 border-slate-200 dark:border-zinc-700 pl-3">
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed italic line-clamp-3">
          {task.prompt}
        </p>
      </blockquote>

      {/* Summary row */}
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500 shrink-0" />
        <span className="text-sm font-medium text-slate-700 dark:text-zinc-200">Task complete</span>
        <span className="text-xs text-slate-500 dark:text-zinc-400">
          · {trace.steps.length} step{trace.steps.length !== 1 ? 's' : ''}
          {sourcesEvaluated > 0 && ` · ${sourcesEvaluated} sources evaluated`}
        </span>
        {trace.durationMs != null && (
          <span className="ml-auto text-xs tabular-nums text-slate-500 dark:text-zinc-400">
            {formatDuration(trace.durationMs)}
          </span>
        )}
      </div>

      {/* Step cards */}
      <div className="flex flex-col rounded-xl border border-slate-100 dark:border-zinc-800 overflow-hidden divide-y divide-slate-100 dark:divide-zinc-800">
        {trace.steps.map((step, i) => (
          <TraceStepCard
            key={step.id}
            step={step}
            index={i}
            onJumpToSection={onJumpToSection}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center pt-1 border-t border-slate-100 dark:border-zinc-800">
        {trace.durationMs != null && (
          <span className="text-xs tabular-nums text-slate-500 dark:text-zinc-400">
            Total: {formatDuration(trace.durationMs)}
          </span>
        )}
        <div className="flex-1" />
        <button
          type="button"
          onClick={handleDownloadTrace}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
        >
          <Download className="w-3 h-3" />
          Download trace JSON
        </button>
      </div>

    </div>
  )
}

// ─── Step card ────────────────────────────────────────────────────────────────

function TraceStepCard({ step, index, onJumpToSection }: {
  step:              TraceStep
  index:             number
  onJumpToSection?:  (slug: string) => void
}) {
  const [expanded, setExpanded] = useState(step.type === 'conflict')

  const isConflict = step.type === 'conflict'
  const isEmit     = step.type === 'emit'

  // Separate section chips from the generic outputs block
  const sections: string[] = isEmit
    ? ((step.outputs.sections as string[] | undefined) ?? [])
    : []
  const outputsForBlock = isEmit
    ? Object.fromEntries(Object.entries(step.outputs).filter(([k]) => k !== 'sections'))
    : step.outputs

  const hasInputs  = Object.keys(step.inputs).length > 0
  const hasOutputs = Object.keys(outputsForBlock).length > 0

  return (
    <div className={isConflict ? 'bg-amber-50/50 dark:bg-amber-950/10' : undefined}>

      {/* Header — toggle button */}
      <button
        type="button"
        onClick={() => setExpanded(v => !v)}
        className="grid grid-cols-[0.5rem_1fr] items-center gap-3 px-4 py-3 w-full text-left transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/40"
      >
        <TraceStatusDot step={step} />

        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[11px] font-medium tabular-nums w-4 text-right shrink-0 text-slate-500 dark:text-zinc-400">
            {index + 1}
          </span>

          <span className={`text-xs truncate ${
            isConflict
              ? 'font-medium text-amber-700 dark:text-amber-400'
              : step.status === 'failed'
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-700 dark:text-zinc-200'
          }`}>
            {TRACE_STEP_TYPE_LABELS[step.type]}
          </span>

          {step.durationMs != null && (
            <span className="ml-auto text-[11px] tabular-nums text-slate-500 dark:text-zinc-400 shrink-0">
              {formatDuration(step.durationMs)}
            </span>
          )}

          <span className="text-slate-400 dark:text-zinc-500 shrink-0">
            {expanded
              ? <ChevronDown className="w-3.5 h-3.5" />
              : <ChevronRight className="w-3.5 h-3.5" />}
          </span>
        </div>
      </button>

      {/* Collapsed summary */}
      {!expanded && (
        <div className="grid grid-cols-[0.5rem_1fr] gap-3 px-4 pb-3 pointer-events-none">
          <div />
          <p className="pl-6 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
            {deriveStepSummary(step)}
          </p>
        </div>
      )}

      {/* Expanded body */}
      {expanded && (
        <div className="grid grid-cols-[0.5rem_1fr] gap-3 px-4 pb-4">
          <div />
          <div className="pl-6 flex flex-col gap-3">

            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              {deriveStepSummary(step)}
            </p>

            {hasInputs  && <DataBlock label="Inputs"  data={step.inputs} />}
            {hasOutputs && <DataBlock label="Outputs" data={outputsForBlock} />}

            {step.reasoning && (
              <div className="rounded-md border-l-2 border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/10 px-3 py-2">
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed italic">
                  {step.reasoning}
                </p>
              </div>
            )}

            {isEmit && sections.length > 0 && (
              <SectionChips sections={sections} onJump={onJumpToSection} />
            )}

          </div>
        </div>
      )}

    </div>
  )
}

// ─── Status dot ───────────────────────────────────────────────────────────────

function TraceStatusDot({ step }: { step: TraceStep }) {
  if (step.status === 'failed') {
    return <span className="w-2 h-2 rounded-full bg-red-400 dark:bg-red-500 justify-self-center" />
  }
  if (step.status === 'skipped') {
    return <span className="w-2 h-2 rounded-full border border-slate-300 dark:border-zinc-600 justify-self-center opacity-50" />
  }
  if (step.type === 'conflict') {
    return <span className="w-2 h-2 rounded-full bg-amber-400 dark:bg-amber-500 justify-self-center" />
  }
  return <span className="w-2 h-2 rounded-full bg-emerald-400 dark:bg-emerald-500 justify-self-center" />
}

// ─── Emit section chips ───────────────────────────────────────────────────────

function SectionChips({ sections, onJump }: {
  sections:  string[]
  onJump?:   (slug: string) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
        Sections
      </span>
      <div className="flex flex-wrap gap-1.5">
        {sections.map(section => (
          <button
            key={section}
            type="button"
            disabled={!onJump}
            onClick={() => onJump?.(slugify(section))}
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-400 transition-colors disabled:pointer-events-none"
          >
            <ArrowUpRight className="w-2.5 h-2.5 shrink-0" />
            {section}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Data blocks ──────────────────────────────────────────────────────────────

function DataBlock({ label, data }: { label: string; data: Record<string, unknown> }) {
  return (
    <div className="rounded-md border border-slate-100 dark:border-zinc-700/60 overflow-hidden">
      <div className="px-2.5 py-1 bg-slate-50 dark:bg-zinc-800 border-b border-slate-100 dark:border-zinc-700/60">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
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
      <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400">
        {name}
      </span>
      <DataValue value={value} depth={depth} />
    </div>
  )
}

function DataValue({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value === null || value === undefined) {
    return <span className="text-xs text-slate-400 dark:text-zinc-500 italic">—</span>
  }
  if (typeof value === 'string') {
    return <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed break-words">{value}</p>
  }
  if (typeof value === 'number') {
    return <p className="text-xs text-slate-700 dark:text-zinc-300 tabular-nums">{value.toLocaleString()}</p>
  }
  if (typeof value === 'boolean') {
    return <p className="text-xs text-slate-700 dark:text-zinc-300">{value ? 'Yes' : 'No'}</p>
  }
  if (Array.isArray(value)) {
    const visible  = value.slice(0, 6)
    const overflow = value.length - 6
    return (
      <ul className="flex flex-col gap-0.5 pl-3">
        {visible.map((item, i) => (
          <li key={i} className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed list-disc list-outside">
            {typeof item === 'string' ? item : JSON.stringify(item)}
          </li>
        ))}
        {overflow > 0 && (
          <li className="text-xs text-slate-500 dark:text-zinc-400 italic list-none">
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
  return <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">{JSON.stringify(value)}</p>
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
    case 'conflict': {
      const resolved = (out.conflictsResolved as number | undefined) ?? 0
      return `Resolved ${resolved} conflict${resolved !== 1 ? 's' : ''} between sources`
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(ms: number): string {
  if (ms < 1_000) return `${ms}ms`
  return `${(ms / 1_000).toFixed(1)}s`
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
