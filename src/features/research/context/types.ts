import type { Project, Task, Artifact, Trace, TraceStep, Source, Notification, TaskPhase } from '../types'

export interface ResearchState {
  projects: Project[]
  notifications: Notification[]
}

export const INITIAL_STATE: ResearchState = {
  projects: [],
  notifications: [],
}

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
