import { createContext, useReducer, useEffect, type ReactNode } from 'react'

import type {
  Project,
  Task,
  Artifact,
  Trace,
  TraceStep,
  Source,
  Notification,
  TaskPhase,
} from '../types'

// ─── State ────────────────────────────────────────────────────────────────────

export interface ResearchState {
  projects: Project[]
  notifications: Notification[]
}

const INITIAL_STATE: ResearchState = {
  projects: [],
  notifications: [],
}

function loadState(): ResearchState {
  try {
    const raw = localStorage.getItem('pulse-research')
    return raw ? (JSON.parse(raw) as ResearchState) : INITIAL_STATE
  } catch {
    return INITIAL_STATE
  }
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export type ResearchAction =
  | { type: 'CREATE_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT_TITLE'; payload: { projectId: string; title: string } }
  | { type: 'DELETE_PROJECT'; payload: { projectId: string } }
  | { type: 'DISPATCH_TASK'; payload: Task }
  | { type: 'SET_TASK_PHASE'; payload: { taskId: string; phase: TaskPhase } }
  | { type: 'SET_TASK_TRACE'; payload: { taskId: string; trace: Trace } }
  | { type: 'ADD_TRACE_STEP'; payload: { taskId: string; step: TraceStep } }
  | { type: 'UPDATE_TRACE_STEP'; payload: { taskId: string; step: TraceStep } }
  | { type: 'ADD_SOURCE'; payload: { taskId: string; source: Source } }
  | { type: 'COMPLETE_TASK'; payload: { taskId: string; artifact: Artifact; trace: Trace } }
  | { type: 'FAIL_TASK'; payload: { taskId: string; reason: string } }
  | { type: 'CANCEL_TASK'; payload: { taskId: string } }
  | { type: 'RENAME_ARTIFACT'; payload: { artifactId: string; title: string } }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: { notificationId: string } }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }

// ─── Reducer ──────────────────────────────────────────────────────────────────

function researchReducer(state: ResearchState, action: ResearchAction): ResearchState {
  switch (action.type) {

    case 'CREATE_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      }

    case 'UPDATE_PROJECT_TITLE':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.projectId
            ? { ...p, title: action.payload.title, updatedAt: new Date().toISOString() }
            : p
        ),
      }

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload.projectId),
      }

    case 'DISPATCH_TASK':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.projectId
            ? {
                ...p,
                tasks: [...p.tasks, action.payload],
                updatedAt: new Date().toISOString(),
              }
            : p
        ),
      }

    case 'SET_TASK_PHASE':
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          tasks: p.tasks.map(t =>
            t.id === action.payload.taskId
              ? { ...t, phase: action.payload.phase }
              : t
          ),
        })),
      }

    case 'SET_TASK_TRACE':
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          tasks: p.tasks.map(t =>
            t.id === action.payload.taskId
              ? { ...t, trace: action.payload.trace }
              : t
          ),
        })),
      }

    case 'ADD_TRACE_STEP':
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id !== action.payload.taskId || !t.trace) return t
            return {
              ...t,
              trace: {
                ...t.trace,
                steps: [...t.trace.steps, action.payload.step],
                updatedAt: new Date().toISOString(),
              },
            }
          }),
        })),
      }

    case 'UPDATE_TRACE_STEP':
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id !== action.payload.taskId || !t.trace) return t
            return {
              ...t,
              trace: {
                ...t.trace,
                steps: t.trace.steps.map(s =>
                  s.id === action.payload.step.id ? action.payload.step : s
                ),
                updatedAt: new Date().toISOString(),
              },
            }
          }),
        })),
      }

    case 'ADD_SOURCE':
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          tasks: p.tasks.map(t =>
            t.id === action.payload.taskId
              ? { ...t, sources: [...t.sources, action.payload.source] }
              : t
          ),
        })),
      }

    case 'COMPLETE_TASK': {
      const { taskId, artifact, trace } = action.payload
      return {
        ...state,
        projects: state.projects.map(p => {
          const hasTask = p.tasks.some(t => t.id === taskId)
          if (!hasTask) return p

          // Merge the artifact: update in-place if it already exists (Update artifact
          // flow), otherwise append it as a new entry.
          const existingIndex = p.artifacts.findIndex(a => a.id === artifact.id)
          const updatedArtifacts =
            existingIndex >= 0
              ? p.artifacts.map((a, i) => (i === existingIndex ? artifact : a))
              : [...p.artifacts, artifact]

          return {
            ...p,
            tasks: p.tasks.map(t =>
              t.id === taskId
                ? {
                    ...t,
                    phase: 'done',
                    endedAt: new Date().toISOString(),
                    trace: { ...trace, status: 'complete' },
                  }
                : t
            ),
            artifacts: updatedArtifacts,
            updatedAt: new Date().toISOString(),
          }
        }),
      }
    }

    case 'FAIL_TASK':
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          tasks: p.tasks.map(t =>
            t.id === action.payload.taskId
              ? {
                  ...t,
                  phase: 'failed',
                  failureReason: action.payload.reason,
                  endedAt: new Date().toISOString(),
                }
              : t
          ),
        })),
      }

    case 'CANCEL_TASK':
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          tasks: p.tasks.map(t =>
            t.id === action.payload.taskId
              ? { ...t, phase: 'canceled', endedAt: new Date().toISOString() }
              : t
          ),
        })),
      }

    case 'RENAME_ARTIFACT':
      return {
        ...state,
        projects: state.projects.map(p => ({
          ...p,
          artifacts: p.artifacts.map(a =>
            a.id === action.payload.artifactId
              ? { ...a, title: action.payload.title }
              : a
          ),
        })),
      }

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        // Keep at most 50 notifications, newest first
        notifications: [action.payload, ...state.notifications].slice(0, 50),
      }

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(n =>
          n.id === action.payload.notificationId ? { ...n, read: true } : n
        ),
      }

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      }

    default:
      return state
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

export interface ResearchContextValue {
  state: ResearchState
  dispatch: React.Dispatch<ResearchAction>
}

export const ResearchContext = createContext<ResearchContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ResearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(researchReducer, undefined, loadState)

  useEffect(() => {
    try {
      localStorage.setItem('pulse-research', JSON.stringify(state))
    } catch {
      // Non-fatal: localStorage may be unavailable in restricted environments.
    }
  }, [state])

  return (
    <ResearchContext.Provider value={{ state, dispatch }}>
      {children}
    </ResearchContext.Provider>
  )
}
