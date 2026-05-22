import { useMemo, useState, useRef, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ChevronLeft, BookOpen } from 'lucide-react'

import type { Project, Task } from '../types'
import type { Tab } from '../components/StudioArtifactView'
import { useResearch } from '../hooks/useResearch'
import { generateId } from '../utils/id'
import { useTaskSimulator } from '../simulator/useTaskSimulator'
import ActivityPanel from '../components/ActivityPanel'
import Studio from '../components/Studio'

// ─── Constants ────────────────────────────────────────────────────────────────

/** Phases that need the simulator running. */
const ACTIVE_PHASES = new Set<Task['phase']>(['queued', 'planning', 'pre_launch', 'executing'])

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProjectPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const { state }     = useResearch()

  const project = state.projects.find(p => p.id === projectId)

  // Guard: redirect to workspace if the project doesn't exist
  if (!project) return <Navigate to="/research" replace />

  // Split into a child component so all hooks run unconditionally after the guard.
  return <ProjectContent project={project} />
}

// ─── Content ──────────────────────────────────────────────────────────────────

function ProjectContent({ project }: { project: Project }) {
  const { dispatch } = useResearch()
  const containerRef = useRef<HTMLDivElement>(null)
  const [leftWidth, setLeftWidth] = useState(42)
  const [isDragging, setIsDragging] = useState(false)

  // Most-recent non-terminal task — the one the simulator drives.
  const activeTask = useMemo(
    () =>
      [...project.tasks]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .find(t => ACTIVE_PHASES.has(t.phase)) ?? null,
    [project.tasks],
  )

  // Task displayed in Studio: active task takes priority; fall back to most-recent.
  const studioTask = useMemo(
    () =>
      activeTask ??
      [...project.tasks].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0] ??
      null,
    [activeTask, project.tasks],
  )

  const parentArtifact = activeTask?.parentArtifactId
    ? (project.artifacts.find(a => a.id === activeTask.parentArtifactId) ?? null)
    : null

  const simulatorControls = useTaskSimulator(activeTask, parentArtifact, project.title)

  const [requestedTab,    setRequestedTab]    = useState<Tab | null>(null)
  const [prefillFollowUp, setPrefillFollowUp] = useState<string | null>(null)

  // Handle drag to resize
  useEffect(() => {
    if (!isDragging) return

    function handleMouseMove(e: MouseEvent) {
      if (!containerRef.current) return
      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100

      // Enforce 30% minimum for each panel
      if (newLeftWidth >= 30 && newLeftWidth <= 70) {
        setLeftWidth(newLeftWidth)
      }
    }

    function handleMouseUp() {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  function handleViewTrace(_taskId: string) {
    setRequestedTab('trace')
  }

  function handleRetry(taskId: string) {
    const failed = project.tasks.find(t => t.id === taskId)
    if (!failed) return
    dispatch({
      type: 'DISPATCH_TASK',
      payload: {
        id:                 generateId(),
        projectId:          project.id,
        prompt:             failed.prompt,
        sourcesKb:          failed.sourcesKb,
        sourcesWeb:         failed.sourcesWeb,
        sourcesProjectOnly: failed.sourcesProjectOnly,
        preLaunchMode:      failed.preLaunchMode,
        parentArtifactId:   failed.parentArtifactId,
        artifactKind:       'report',
        phase:              'queued',
        failureReason:      null,
        startedAt:          null,
        endedAt:            null,
        createdAt:          new Date().toISOString(),
        trace:              null,
        sources:            [],
      },
    })
  }

  function handleModifyRetry(taskId: string) {
    const failed = project.tasks.find(t => t.id === taskId)
    if (!failed) return
    setPrefillFollowUp(failed.prompt)
  }

  function handleFollowUp(prompt: string, parentArtifactId: string | null, sources: { sourcesKb: boolean; sourcesWeb: boolean; sourcesProjectOnly: boolean }) {
    const now = new Date().toISOString()
    dispatch({
      type: 'DISPATCH_TASK',
      payload: {
        id:                 generateId(),
        projectId:          project.id,
        prompt,
        sourcesKb:          sources.sourcesKb,
        sourcesWeb:         sources.sourcesWeb,
        sourcesProjectOnly: sources.sourcesProjectOnly,
        preLaunchMode:      project.preLaunchModeDefault,
        parentArtifactId,
        artifactKind:       'report',
        phase:              'queued',
        failureReason:      null,
        startedAt:          null,
        endedAt:            null,
        createdAt:          now,
        trace:              null,
        sources:            [],
      },
    })
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="h-14 shrink-0 flex items-center gap-2 px-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-20">
        <Link
          to="/research"
          className="flex items-center gap-1.5 shrink-0 text-slate-500 dark:text-zinc-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <BookOpen className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Research</span>
        </Link>

        <span className="shrink-0 text-slate-300 dark:text-zinc-700">/</span>

        <h1 className="text-sm font-semibold text-slate-800 dark:text-zinc-100 truncate min-w-0">
          {project.title}
        </h1>
      </header>

      {/* ── Two-column body ────────────────────────────────────────────── */}
      <div ref={containerRef} className="flex-1 flex min-h-0">

        {/* Activity — resizable */}
        <div style={{ width: `${leftWidth}%` }} className="shrink-0 overflow-y-auto">
          <ActivityPanel
            project={project}
            onFollowUp={handleFollowUp}
            onViewTrace={handleViewTrace}
            onRetryTask={handleRetry}
            onModifyRetryTask={handleModifyRetry}
            prefillFollowUp={prefillFollowUp}
            onPrefillConsumed={() => setPrefillFollowUp(null)}
          />
        </div>

        {/* Divider */}
        <div
          onMouseDown={() => setIsDragging(true)}
          className={`w-px group bg-slate-200 dark:bg-zinc-800 transition-colors ${
            isDragging
              ? 'bg-blue-400 dark:bg-blue-500'
              : 'hover:bg-blue-300 dark:hover:bg-blue-600 cursor-col-resize'
          }`}
          style={{ userSelect: 'none' }}
        >
          <div className="h-full flex items-center justify-center">
            <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col gap-0.5 ${
              isDragging ? 'opacity-100' : ''
            }`}>
              <div className="w-1 h-1 rounded-full bg-blue-400 dark:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-blue-400 dark:bg-blue-500" />
              <div className="w-1 h-1 rounded-full bg-blue-400 dark:bg-blue-500" />
            </div>
          </div>
        </div>

        {/* Studio — resizable */}
        <div style={{ width: `${100 - leftWidth}%` }} className="flex-1 overflow-y-auto">
          <Studio
            project={project}
            task={studioTask}
            simulatorControls={simulatorControls}
            requestedTab={requestedTab}
            onTabConsumed={() => setRequestedTab(null)}
          />
        </div>

      </div>
    </div>
  )
}
