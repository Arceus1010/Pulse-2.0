// ─── Primitive enums ─────────────────────────────────────────────────────────

export type SourcesMode = 'sweep' | 'focus' | 'discover' | 'deep_dive'

export type PreLaunchMode = 'auto' | 'quick_check' | 'confirm'

export type TaskPhase =
  | 'queued'
  | 'planning'
  | 'pre_launch'
  | 'executing'
  | 'done'
  | 'failed'
  | 'canceled'

export type ArtifactKind = 'report' | 'analysis' | 'brief' | 'table' | 'summary'

export type TraceStepType =
  | 'plan'
  | 'search_kb'
  | 'search_web'
  | 'read'
  | 'synthesize'
  | 'conflict'
  | 'emit'

export type TraceStepStatus = 'running' | 'complete' | 'failed' | 'skipped'

export type TraceStatus = 'running' | 'complete' | 'failed'

export type SourceKind = 'kb' | 'web' | 'user_added'

export type NotificationType = 'awaiting_review' | 'task_completed' | 'task_failed'

// ─── Trace ───────────────────────────────────────────────────────────────────

export interface TraceStep {
  id: string
  type: TraceStepType
  status: TraceStepStatus
  startedAt: string
  durationMs: number | null
  inputs: Record<string, unknown>
  outputs: Record<string, unknown>
  reasoning: string | null
  userModified: boolean
}

export interface Trace {
  id: string
  taskId: string
  goal: string
  status: TraceStatus
  durationMs: number | null
  steps: TraceStep[]
  createdAt: string
  updatedAt: string
}

// ─── Source ──────────────────────────────────────────────────────────────────

export interface Source {
  id: string
  taskId: string
  kind: SourceKind
  uri: string | null
  title: string
  kept: boolean
  discardReason: string | null
  relevanceScore: number | null
  excerpt: string | null
  createdAt: string
}

// ─── Artifact ────────────────────────────────────────────────────────────────

export interface ArtifactVersion {
  id: string
  artifactId: string
  taskId: string
  content: string
  summary: string
  versionNumber: number
  wordCount: number
  createdAt: string
}

export interface Artifact {
  id: string
  projectId: string
  title: string
  kind: ArtifactKind
  currentVersionId: string | null
  versions: ArtifactVersion[]
  createdAt: string
}

// ─── Task ────────────────────────────────────────────────────────────────────

export interface Task {
  id: string
  projectId: string
  prompt: string
  sourcesKb: boolean
  sourcesWeb: boolean
  sourcesProjectOnly: boolean
  preLaunchMode: PreLaunchMode
  /** Set for "Update artifact" follow-up tasks. Null for new artifacts. */
  parentArtifactId: string | null
  artifactKind: ArtifactKind
  phase: TaskPhase
  failureReason: string | null
  startedAt: string | null
  endedAt: string | null
  createdAt: string
  /** Populated incrementally by the task simulator during execution. */
  trace: Trace | null
  sources: Source[]
}

// ─── Project ─────────────────────────────────────────────────────────────────

export interface Project {
  id: string
  title: string
  sourcesKb: boolean
  sourcesWeb: boolean
  sourcesProjectOnly: boolean
  preLaunchModeDefault: PreLaunchMode
  tasks: Task[]
  artifacts: Artifact[]
  createdAt: string
  updatedAt: string
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string
  type: NotificationType
  projectId: string
  taskId: string | null
  message: string
  read: boolean
  createdAt: string
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

/**
 * Derives the named sources mode from the three independent boolean toggles.
 * The four named modes map to all combinations of KB on/off and Web on/off.
 */
export function deriveSourcesMode(
  kb: boolean,
  web: boolean,
  projectOnly: boolean,
): SourcesMode {
  if (kb && web) return 'deep_dive'
  if (kb && projectOnly) return 'focus'
  if (kb) return 'sweep'
  return 'discover'
}

// ─── Display labels ───────────────────────────────────────────────────────────

export const SOURCES_MODE_LABELS: Record<SourcesMode, string> = {
  sweep:     'Sweep',
  focus:     'Focus',
  discover:  'Discover',
  deep_dive: 'Deep Dive',
}

export const ARTIFACT_KIND_LABELS: Record<ArtifactKind, string> = {
  report:   'Report',
  analysis: 'Analysis',
  brief:    'Brief',
  table:    'Table',
  summary:  'Summary',
}

export const TASK_PHASE_LABELS: Record<TaskPhase, string> = {
  queued:     'Queued',
  planning:   'Planning',
  pre_launch: 'Pre-Launch',
  executing:  'Executing',
  done:       'Done',
  failed:     'Failed',
  canceled:   'Canceled',
}

export const PRE_LAUNCH_MODE_LABELS: Record<PreLaunchMode, string> = {
  auto:        'Auto',
  quick_check: 'Quick Check',
  confirm:     'Confirm',
}

export const TRACE_STEP_TYPE_LABELS: Record<TraceStepType, string> = {
  plan:        'Plan',
  search_kb:   'Search knowledge base',
  search_web:  'Search web',
  read:        'Read source',
  synthesize:  'Synthesize',
  conflict:    'Resolve conflict',
  emit:        'Emit artifact',
}
