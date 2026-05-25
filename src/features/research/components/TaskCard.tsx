import { useState, useEffect } from 'react'
import { FileText, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import Button from '../../../components/ui/Button'

import type { Task, Artifact } from '../types'
import { PhaseBadge } from './PhaseBadge'

interface TaskCardProps {
  task:            Task
  artifact:        Artifact | null
  /** Whether this is the most recent task (highlighted). */
  isLatest:        boolean
  onViewTrace?:    () => void
  onRetry?:        () => void
  onModifyRetry?:  () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TaskCard({ task, artifact, isLatest, onViewTrace, onRetry, onModifyRetry }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false)

  const isRunning = ['queued', 'planning', 'pre_launch', 'executing'].includes(task.phase)
  const elapsedSeconds = useElapsedSeconds(isRunning ? task.createdAt : null)

  const phaseDetail = derivePhaseDetail(task, elapsedSeconds)
  const promptLines = task.prompt.split('\n').filter(Boolean)

  return (
    <div
      className={`rounded-lg border p-3.5 flex flex-col gap-2.5 transition-colors ${
        isLatest
          ? 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-700'
          : 'bg-slate-50/50 dark:bg-zinc-900/50 border-slate-200 dark:border-zinc-800'
      }`}
    >
      {/* Phase badge + detail */}
      <div className="flex items-center gap-2 flex-wrap">
        <PhaseBadge phase={task.phase} />
        {phaseDetail && (
          <span className="text-xs text-slate-500 dark:text-zinc-400">{phaseDetail}</span>
        )}
      </div>

      {/* Prompt text */}
      <div className="relative">
        <p
          className={`text-sm text-slate-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap wrap-break-word ${
            !expanded && promptLines.length > 3 ? 'line-clamp-3' : ''
          }`}
        >
          {task.prompt}
        </p>

        {/* Expand / collapse toggle */}
        {task.prompt.length > 200 || promptLines.length > 3 ? (
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-1 flex items-center gap-0.5 text-sm text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
          >
            {expanded ? (
              <><ChevronUp className="w-3 h-3" /> Show less</>
            ) : (
              <><ChevronDown className="w-3 h-3" /> Show more</>
            )}
          </button>
        ) : null}
      </div>

      {/* Artifact pill + View trace link — visible once task is done */}
      {task.phase === 'done' && artifact && (
        <div className="flex items-center gap-2 pt-0.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-sm font-medium text-emerald-700 dark:text-emerald-400">
            <FileText className="w-3 h-3" />
            {artifact.title}
          </span>
          {onViewTrace && (
            <button
              type="button"
              onClick={onViewTrace}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View trace →
            </button>
          )}
        </div>
      )}

      {/* Retry actions — visible when task failed */}
      {task.phase === 'failed' && (onRetry || onModifyRetry) && (
        <div className="flex items-center gap-2 pt-0.5">
          {onRetry && (
            <Button
              type="button"
              onClick={onRetry}
              variant="outline"
              size="xs"
              icon={<RotateCcw />}
            >
              Retry
            </Button>
          )}
          {onModifyRetry && (
            <button
              type="button"
              onClick={onModifyRetry}
              className="text-sm text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:underline transition-colors"
            >
              Modify and retry
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Elapsed time ─────────────────────────────────────────────────────────────

function useElapsedSeconds(since: string | null): number {
  const [elapsed, setElapsed] = useState(() =>
    since ? Math.floor((Date.now() - new Date(since).getTime()) / 1000) : 0
  )

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

// ─── Phase detail string ──────────────────────────────────────────────────────

function derivePhaseDetail(task: Task, elapsedSeconds: number): string | null {
  const elapsed = formatElapsed(elapsedSeconds)

  switch (task.phase) {
    case 'queued':
      return 'Waiting to start…'

    case 'planning':
      return `Planning · ${elapsed} elapsed`

    case 'pre_launch': {
      const mode = task.preLaunchMode === 'confirm' ? 'Awaiting approval' : 'Review in progress'
      return mode
    }

    case 'executing': {
      const steps = task.trace?.steps ?? []
      // Exclude the plan step from the executing count
      const executingSteps    = steps.filter(s => s.type !== 'plan')
      const runningStep       = executingSteps.find(s => s.status === 'running')
      const completedCount    = executingSteps.filter(s => s.status === 'complete').length
      const currentStepNumber = runningStep ? completedCount + 1 : completedCount
      const totalSteps        = 4 // search + read + synthesize + emit

      return currentStepNumber > 0
        ? `Step ${currentStepNumber} of ${totalSteps} · ${elapsed} elapsed`
        : `${elapsed} elapsed`
    }

    case 'failed':
      return task.failureReason ?? 'An error occurred'

    case 'canceled':
    case 'done':
      return null

    default:
      return null
  }
}
