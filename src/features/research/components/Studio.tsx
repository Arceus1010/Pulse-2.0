import { Layers, AlertCircle, XCircle, Clock } from 'lucide-react'

import type { Project, Task } from '../types'
import type { SimulatorControls } from '../simulator/useTaskSimulator'
import type { Tab } from './StudioArtifactView'
import { PhaseBadge } from './PhaseBadge'
import LiveTrace from './LiveTrace'
import PreLaunchPanel from './PreLaunchPanel'
import StudioArtifactView from './StudioArtifactView'
import PanelHeader from '../../../components/ui/PanelHeader'

interface StudioProps {
  project:            Project
  task:               Task | null
  simulatorControls:  SimulatorControls
  requestedTab?:      Tab | null
  onTabConsumed?:     () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Studio({ project, task, simulatorControls, requestedTab, onTabConsumed }: StudioProps) {
  if (task?.phase === 'done' && project.artifacts.length > 0) {
    return (
      <div className="flex flex-col min-h-full">
        <StudioArtifactView
          project={project}
          task={task}
          requestedTab={requestedTab}
          onTabConsumed={onTabConsumed}
        />
      </div>
    )
  }

  const isPreLaunch = task?.phase === 'pre_launch'

  const headerAction = isPreLaunch && simulatorControls.countdownSeconds !== null
    ? (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-700 dark:text-amber-400">
        <Clock className="w-3 h-3" />
        Launching in {simulatorControls.countdownSeconds}s
      </span>
    )
    : (task && !isPreLaunch)
    ? <PhaseBadge phase={task.phase} />
    : null

  return (
    <div className="flex flex-col min-h-full">
      <PanelHeader
        label={isPreLaunch ? 'Pre-Launch Review' : 'Studio'}
        action={headerAction}
      />
      <StudioBody task={task} simulatorControls={simulatorControls} />
    </div>
  )
}

// ─── Body ─────────────────────────────────────────────────────────────────────

function StudioBody({ task, simulatorControls }: {
  task:               Task | null
  simulatorControls:  SimulatorControls
}) {
  if (!task) return <EmptyState />

  switch (task.phase) {
    case 'queued':
      return <QueuedState />

    case 'planning':
    case 'executing':
      return <LiveTrace task={task} />

    case 'pre_launch':
      return <PreLaunchPanel task={task} simulatorControls={simulatorControls} />

    case 'done':
      // No artifacts yet (should be rare; normally StudioArtifactView handles done).
      return <DoneFallback />

    case 'failed':
      return <FailedState task={task} />

    case 'canceled':
      return <CanceledState />

    default:
      return null
  }
}

// ─── State: no tasks ──────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-400">
        <Layers className="w-5 h-5" />
      </div>
      <p className="text-base font-medium text-slate-500 dark:text-zinc-400">Your artifact will appear here</p>
      <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-88 leading-relaxed">
        Dispatch a prompt from the activity panel to start a research task.
      </p>
    </div>
  )
}

// ─── State: queued ────────────────────────────────────────────────────────────

function QueuedState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-zinc-600 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <p className="text-sm text-slate-500 dark:text-zinc-400">Waiting to start…</p>
    </div>
  )
}

// ─── State: done fallback (no artifact written yet) ───────────────────────────

function DoneFallback() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center">
        <span className="text-emerald-600 dark:text-emerald-400 text-xl">✓</span>
      </div>
      <p className="text-base font-medium text-slate-700 dark:text-zinc-200">Artifact ready</p>
    </div>
  )
}

// ─── State: failed ────────────────────────────────────────────────────────────

function FailedState({ task }: { task: Task }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 flex items-center justify-center text-red-500 dark:text-red-400">
        <AlertCircle className="w-5 h-5" />
      </div>
      <p className="text-base font-medium text-red-700 dark:text-red-400">Task failed</p>
      {task.failureReason && (
        <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-88 leading-relaxed">
          {task.failureReason}
        </p>
      )}
    </div>
  )
}

// ─── State: canceled ──────────────────────────────────────────────────────────

function CanceledState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 py-16 text-center">
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-500 dark:text-zinc-400">
        <XCircle className="w-5 h-5" />
      </div>
      <p className="text-base font-medium text-slate-500 dark:text-zinc-400">Task canceled</p>
      <p className="text-sm text-slate-500 dark:text-zinc-400">No artifact was produced.</p>
    </div>
  )
}
