import { useState, useRef, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import Tooltip from '../../../components/ui/Tooltip'

import type { Project, Artifact } from '../types'
import TaskCard from './TaskCard'
import PanelHeader from '../../../components/ui/PanelHeader'
import TabBar from '../../../components/ui/TabBar'
import Select from '../../../components/ui/Select'

export interface FollowUpSources {
  sourcesKb:          boolean
  sourcesWeb:         boolean
  sourcesProjectOnly: boolean
}

interface ActivityPanelProps {
  project:            Project
  onFollowUp:         (prompt: string, parentArtifactId: string | null, sources: FollowUpSources) => void
  onViewTrace?:       (taskId: string) => void
  onRetryTask?:       (taskId: string) => void
  onModifyRetryTask?: (taskId: string) => void
  prefillFollowUp?:   string | null
  onPrefillConsumed?: () => void
}

const MAX_FOLLOW_UP_LENGTH = 2_000

const INTENT_OPTIONS = [
  { value: 'new',    label: 'New'    },
  { value: 'update', label: 'Update' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActivityPanel({ project, onFollowUp, onViewTrace, onRetryTask, onModifyRetryTask, prefillFollowUp, onPrefillConsumed }: ActivityPanelProps) {
  const [followUp,          setFollowUp]          = useState('')
  const [intent,            setIntent]            = useState<'new' | 'update'>('new')
  const [explicitTargetId,  setExplicitTargetId]  = useState<string | null>(null)
  const [sourcesKb,         setSourcesKb]         = useState(project.sourcesKb)
  const [sourcesWeb,        setSourcesWeb]        = useState(project.sourcesWeb)
  const [sourcesProjectOnly,setSourcesProjectOnly]= useState(project.sourcesProjectOnly)
  const bottomRef  = useRef<HTMLDivElement>(null)
  const prevArtifactCountRef = useRef(project.artifacts.length)

  // Sync prefill prompt into the textarea
  useEffect(() => {
    if (!prefillFollowUp) return
    setFollowUp(prefillFollowUp)
    onPrefillConsumed?.()
  }, [prefillFollowUp]) // eslint-disable-line react-hooks/exhaustive-deps

  const hasNoTasks   = project.tasks.length === 0
  const hasArtifacts = project.artifacts.length > 0

  // Sorted oldest → newest
  const sortedTasks = [...project.tasks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
  const latestTaskId = sortedTasks.at(-1)?.id ?? null

  // Most-recent artifact (default update target)
  const latestArtifact: Artifact | null = project.artifacts.length > 0
    ? [...project.artifacts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0]
    : null

  const targetArtifactId = explicitTargetId ?? latestArtifact?.id ?? null
  const targetArtifact   = project.artifacts.find(a => a.id === targetArtifactId) ?? null

  // Auto-switch to 'update' when first artifact arrives
  useEffect(() => {
    const prev = prevArtifactCountRef.current
    prevArtifactCountRef.current = project.artifacts.length
    if (prev === 0 && project.artifacts.length > 0) {
      setIntent('update')
    }
  })

  // Scroll to bottom when a new task is added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [project.tasks.length])

  function handleSubmit() {
    const trimmed = followUp.trim()
    if (!trimmed) return
    onFollowUp(trimmed, intent === 'update' ? targetArtifactId : null, { sourcesKb, sourcesWeb, sourcesProjectOnly })
    setFollowUp('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const artifactOptions = project.artifacts.map(a => ({ value: a.id, label: a.title }))

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Panel header ─────────────────────────────────────────────── */}
      <PanelHeader label="Activity" />

      {/* ── Task list ────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 py-4">
        {hasNoTasks ? (
          <p className="text-xs text-slate-500 dark:text-zinc-400 text-center py-8">
            No tasks yet. Dispatch your first prompt below.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedTasks.map(task => {
              const artifact =
                project.artifacts.find(a =>
                  a.versions.some(v => v.taskId === task.id),
                ) ?? null
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  artifact={artifact}
                  isLatest={task.id === latestTaskId}
                  onViewTrace={onViewTrace     ? () => onViewTrace(task.id)      : undefined}
                  onRetry={onRetryTask         ? () => onRetryTask(task.id)      : undefined}
                  onModifyRetry={onModifyRetryTask ? () => onModifyRetryTask(task.id) : undefined}
                />
              )
            })}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Follow-up input ──────────────────────────────────────────── */}
      <div className="px-4 pb-4 pt-2 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 sticky bottom-0">
        <div className="flex flex-col gap-0 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg overflow-hidden focus-within:border-blue-300 dark:focus-within:border-blue-700/60 transition-colors">

          <textarea
            value={followUp}
            onChange={e => setFollowUp(e.target.value.slice(0, MAX_FOLLOW_UP_LENGTH))}
            onKeyDown={handleKeyDown}
            placeholder="Add a follow-up…"
            rows={2}
            className="w-full resize-none bg-transparent px-3 pt-3 pb-1 text-sm text-slate-800 dark:text-zinc-100 placeholder:text-slate-500 dark:placeholder:text-zinc-400 outline-none"
          />

          <div className="flex items-center gap-2 px-3 pb-2.5 pt-1.5">

            {/* Intent toggle — only when at least one artifact exists */}
            {hasArtifacts && (
              <>
                <TabBar
                  options={INTENT_OPTIONS}
                  value={intent}
                  onChange={v => setIntent(v as 'new' | 'update')}
                />

                {intent === 'update' && (
                  project.artifacts.length === 1 ? (
                    <span className="text-xs text-slate-500 dark:text-zinc-400 truncate max-w-30">
                      {targetArtifact?.title}
                    </span>
                  ) : (
                    <Select
                      options={artifactOptions}
                      value={targetArtifactId ?? ''}
                      onChange={v => setExplicitTargetId(v)}
                      className="max-w-35"
                    />
                  )
                )}

                <div className="w-px h-4 bg-slate-200 dark:bg-zinc-700 shrink-0" />
              </>
            )}

            {/* Source toggles */}
            <Tooltip content="Search across your knowledge base">
              <SourceChip label="KB" active={sourcesKb} onClick={() => {
                setSourcesKb(v => { if (v) setSourcesProjectOnly(false); return !v })
              }} />
            </Tooltip>
            {sourcesKb && (
              <Tooltip content="Limit KB search to this project only">
                <SourceChip label="Project only" active={sourcesProjectOnly} onClick={() => setSourcesProjectOnly(v => !v)} />
              </Tooltip>
            )}
            <Tooltip content="Search the open web for sources">
              <SourceChip label="Web" active={sourcesWeb} onClick={() => setSourcesWeb(v => !v)} />
            </Tooltip>

            <div className="w-px h-4 bg-slate-200 dark:bg-zinc-700 shrink-0" />

            {/* Char count / hint */}
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 tabular-nums">
              {followUp.length > 0
                ? `${followUp.length} / ${MAX_FOLLOW_UP_LENGTH.toLocaleString()}`
                : '⌘ Enter to send'}
            </span>

            <div className="flex-1" />

            <button
              onClick={handleSubmit}
              disabled={!followUp.trim()}
              className="flex items-center gap-1 h-6 px-2.5 rounded-sm bg-blue-800 hover:bg-blue-900 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-semibold transition-colors shrink-0"
            >
              Send
              <ArrowUp className="w-3 h-3" />
            </button>

          </div>
        </div>
      </div>

    </div>
  )
}

// ─── Internal: source toggle chip ────────────────────────────────────────────

function SourceChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`h-5 px-2 rounded text-[11px] font-medium transition-colors ${
        active
          ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-400'
          : 'bg-transparent border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-600 hover:text-slate-700 dark:hover:text-zinc-200'
      }`}
    >
      {label}
    </button>
  )
}
