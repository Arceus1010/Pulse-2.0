import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

import type { Project, Task, TaskPhase } from './types'
import { useResearch } from './hooks/useResearch'
import { generateId } from './utils/id'
import Dispatcher, { type DispatchConfig } from './components/Dispatcher'
import ProjectCard from './components/ProjectCard'

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterOption = 'all' | 'executing' | 'done' | 'failed' | 'awaiting'

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_OPTIONS: FilterOption[] = ['all', 'executing', 'done', 'failed', 'awaiting']

const FILTER_LABELS: Record<FilterOption, string> = {
  all:       'All',
  executing: 'Executing',
  done:      'Done',
  failed:    'Failed',
  awaiting:  'Awaiting review',
}

// Phases that qualify a project for each filter bucket
const FILTER_PHASES: Record<Exclude<FilterOption, 'all'>, TaskPhase[]> = {
  executing: ['queued', 'planning', 'executing'],
  done:      ['done'],
  failed:    ['failed'],
  awaiting:  ['pre_launch'],
}

const EXAMPLE_PROMPTS = [
  'Analyze the competitive landscape of Southeast Asian fintech platforms in 2026',
  'Summarize recent EU regulatory changes affecting AI companies',
  'Compare pricing strategies across major cloud infrastructure providers',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveProjectTitle(prompt: string): string {
  const trimmed = prompt.trim()
  if (trimmed.length <= 60) return trimmed
  const cut = trimmed.slice(0, 60)
  const boundary = cut.lastIndexOf(' ')
  return (boundary > 30 ? cut.slice(0, boundary) : cut) + '…'
}

function getLatestTask(project: Project): Task | null {
  if (!project.tasks.length) return null
  return [...project.tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0]
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Research() {
  const { state, dispatch } = useResearch()
  const navigate = useNavigate()

  const [filter, setFilter] = useState<FilterOption>('all')
  const [prefillPrompt, setPrefillPrompt] = useState<string | undefined>()

  // Derive the filtered + sorted project list
  const filteredProjects = useMemo(() => {
    const sorted = [...state.projects].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    if (filter === 'all') return sorted
    return sorted.filter(p => {
      const latest = getLatestTask(p)
      return latest ? FILTER_PHASES[filter].includes(latest.phase) : false
    })
  }, [state.projects, filter])

  const filterCounts = useMemo(() => {
    const counts: Record<Exclude<FilterOption, 'all'>, number> = { executing: 0, done: 0, failed: 0, awaiting: 0 }
    for (const p of state.projects) {
      const latest = getLatestTask(p)
      if (!latest) continue
      for (const key of Object.keys(FILTER_PHASES) as Exclude<FilterOption, 'all'>[]) {
        if (FILTER_PHASES[key].includes(latest.phase)) counts[key]++
      }
    }
    return counts
  }, [state.projects])

  function handleDispatch(config: DispatchConfig) {
    const now = new Date().toISOString()
    const projectId = generateId()
    const taskId = generateId()

    const project: Project = {
      id:                   projectId,
      title:                deriveProjectTitle(config.prompt),
      sourcesKb:            config.sourcesKb,
      sourcesWeb:           config.sourcesWeb,
      sourcesProjectOnly:   config.sourcesProjectOnly,
      preLaunchModeDefault: config.preLaunchMode,
      tasks:                [],
      artifacts:            [],
      createdAt:            now,
      updatedAt:            now,
    }

    const task: Task = {
      id:                 taskId,
      projectId,
      prompt:             config.prompt,
      sourcesKb:          config.sourcesKb,
      sourcesWeb:         config.sourcesWeb,
      sourcesProjectOnly: config.sourcesProjectOnly,
      preLaunchMode:      config.preLaunchMode,
      parentArtifactId:   null,
      artifactKind:       'report',
      phase:              'queued',
      failureReason:      null,
      startedAt:          null,
      endedAt:            null,
      createdAt:          now,
      trace:              null,
      sources:            [],
    }

    dispatch({ type: 'CREATE_PROJECT', payload: project })
    dispatch({ type: 'DISPATCH_TASK',  payload: task })
    navigate(`/research/projects/${projectId}`)
  }

  const isEmpty = state.projects.length === 0

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header bar ─────────────────────────────────────────────────── */}
      <div className="h-14 flex items-center px-6 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-20">
        <div className="flex items-center gap-2 text-slate-800 dark:text-zinc-100">
          <BookOpen className="w-4 h-4 text-blue-800 dark:text-blue-400" />
          <span className="text-base font-semibold">Research</span>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      {isEmpty
        ? <EmptyWorkspace onDispatch={handleDispatch} prefillPrompt={prefillPrompt} onExampleClick={setPrefillPrompt} />
        : <PopulatedWorkspace
            projects={filteredProjects}
            totalCount={state.projects.length}
            filter={filter}
            filterCounts={filterCounts}
            onFilterChange={setFilter}
            onDispatch={handleDispatch}
          />
      }
    </div>
  )
}

// ─── Empty workspace ──────────────────────────────────────────────────────────

interface EmptyWorkspaceProps {
  onDispatch: (config: DispatchConfig) => void
  prefillPrompt: string | undefined
  onExampleClick: (prompt: string) => void
}

function EmptyWorkspace({ onDispatch, prefillPrompt, onExampleClick }: EmptyWorkspaceProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 gap-8">

      {/* Hero */}
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-800 dark:text-blue-400">
          <BookOpen className="w-6 h-6" />
        </div>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-zinc-100">Research</h1>
        <p className="text-sm leading-relaxed text-slate-500 dark:text-zinc-400 max-w-xs">
          Dispatch a research prompt and let the agent gather sources, synthesize insights,
          and produce a structured artifact — while you do something else.
        </p>
      </div>

      {/* Dispatcher */}
      <div className="w-full max-w-2xl">
        <Dispatcher onDispatch={onDispatch} prefillPrompt={prefillPrompt} />
      </div>

      {/* Example prompt chips */}
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {EXAMPLE_PROMPTS.map(prompt => (
          <button
            key={prompt}
            onClick={() => onExampleClick(prompt)}
            className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-slate-500 dark:text-zinc-400 hover:border-blue-200 dark:hover:border-blue-800/60 hover:text-blue-800 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors text-left"
          >
            {prompt}
          </button>
        ))}
      </div>

    </div>
  )
}

// ─── Populated workspace ──────────────────────────────────────────────────────

interface PopulatedWorkspaceProps {
  projects: Project[]
  totalCount: number
  filter: FilterOption
  filterCounts: Record<Exclude<FilterOption, 'all'>, number>
  onFilterChange: (f: FilterOption) => void
  onDispatch: (config: DispatchConfig) => void
}

function PopulatedWorkspace({
  projects,
  totalCount,
  filter,
  filterCounts,
  onFilterChange,
  onDispatch,
}: PopulatedWorkspaceProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-col gap-6">

        {/* Dispatcher */}
        <Dispatcher onDispatch={onDispatch} />

        {/* Filter row */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {FILTER_OPTIONS.map(opt => {
              const count = opt === 'all' ? totalCount : filterCounts[opt]
              const isActive = filter === opt
              return (
                <button
                  key={opt}
                  onClick={() => onFilterChange(opt)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                      : 'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200'
                  }`}
                >
                  {FILTER_LABELS[opt]}
                  <span className={`tabular-nums ${isActive ? 'opacity-60' : 'opacity-50'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex-1" />

          <span className="text-sm text-slate-400 dark:text-zinc-500 tabular-nums">
            {projects.length === totalCount
              ? `${totalCount} ${totalCount === 1 ? 'project' : 'projects'}`
              : `${projects.length} of ${totalCount}`}
          </span>
        </div>

        {/* Project grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center gap-2 text-center">
            <p className="text-base font-medium text-slate-500 dark:text-zinc-400">
              No projects match this filter
            </p>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Try a different filter or dispatch a new prompt above.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
