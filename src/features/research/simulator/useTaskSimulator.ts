import { useState, useEffect, useRef } from 'react'

import type { Task, Artifact, Trace, TraceStep } from '../types'
import { useResearch } from '../hooks/useResearch'
import type { ResearchAction } from '../context/research.context'
import { generateId } from '../utils/id'
import {
  generateInitialTrace,
  generatePlanStep,
  generateExecutingSteps,
  generateScheduledSources,
  generateArtifact,
  getCompletedOutputs,
  STEP_REASONING,
} from './mockData'

const FAILURE_PROBABILITY = 0.15

// ─── Public contract ──────────────────────────────────────────────────────────

export interface SimulatorControls {
  /** Manually proceed past the Pre-Launch gate. No-op outside of pre_launch phase. */
  launch: () => void
  /** Cancel the task at the Pre-Launch gate. No-op outside of pre_launch phase. */
  cancel: () => void
  /**
   * Seconds remaining before the task auto-launches in quick_check mode.
   * Null when not in quick_check pre_launch.
   */
  countdownSeconds: number | null
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Drives a single task through its full lifecycle using client-side timers.
 * Mount this hook in the ProjectPage for the task currently being viewed.
 *
 * Phase transitions:
 *   queued → planning  (after 2 s)
 *   planning → pre_launch  (after 7.5 s — plan step emitted)
 *   pre_launch → executing  (auto: 300 ms, quick_check: 20 s countdown, confirm: user action)
 *   executing → done  (after ~18 s — steps streamed, artifact written)
 */
export function useTaskSimulator(task: Task | null, parentArtifact: Artifact | null = null, projectTitle = ''): SimulatorControls {
  const { dispatch } = useResearch()
  const [countdownSeconds, setCountdownSeconds] = useState<number | null>(null)

  // Keep a stable ref so timer callbacks always call the current dispatch
  // without being listed as an effect dependency (dispatch from useReducer is
  // already stable, but the ref pattern makes the intent explicit).
  const dispatchRef = useRef<(action: ResearchAction) => void>(dispatch)
  const projectTitleRef = useRef(projectTitle)

  useEffect(() => {
    dispatchRef.current = dispatch
  }, [dispatch])

  useEffect(() => {
    projectTitleRef.current = projectTitle
  }, [projectTitle])

  // ── queued → planning ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!task || task.phase !== 'queued') return

    const taskId = task.id
    const trace  = generateInitialTrace(task)

    const id = setTimeout(() => {
      dispatchRef.current({ type: 'SET_TASK_TRACE', payload: { taskId, trace } })
      dispatchRef.current({ type: 'SET_TASK_PHASE', payload: { taskId, phase: 'planning' } })
    }, 2_000)

    return () => clearTimeout(id)
  }, [task])

  // ── planning → pre_launch ─────────────────────────────────────────────────
  useEffect(() => {
    if (!task || task.phase !== 'planning') return

    const taskId   = task.id
    const planStep = generatePlanStep(task)

    // Show the step as running immediately so the live trace has something to display.
    dispatchRef.current({
      type:    'ADD_TRACE_STEP',
      payload: { taskId, step: { ...planStep, status: 'running', durationMs: null } },
    })

    const id = setTimeout(() => {
      dispatchRef.current({
        type:    'UPDATE_TRACE_STEP',
        payload: { taskId, step: planStep }, // planStep already has status: 'complete'
      })
      dispatchRef.current({ type: 'SET_TASK_PHASE', payload: { taskId, phase: 'pre_launch' } })
      if (task.preLaunchMode !== 'auto') {
        dispatchRef.current({
          type: 'ADD_NOTIFICATION',
          payload: {
            id:        generateId(),
            type:      'awaiting_review',
            projectId: task.projectId,
            taskId,
            message:   `${projectTitleRef.current}: awaiting your review`,
            read:      false,
            createdAt: new Date().toISOString(),
          },
        })
      }
    }, 7_500)

    return () => clearTimeout(id)
  }, [task])

  // ── pre_launch handling ───────────────────────────────────────────────────
  useEffect(() => {
    if (!task || task.phase !== 'pre_launch') return

    const taskId = task.id
    const mode   = task.preLaunchMode

    function startExecuting() {
      dispatchRef.current({ type: 'SET_TASK_PHASE', payload: { taskId, phase: 'executing' } })
    }

    if (mode === 'auto') {
      const id = setTimeout(startExecuting, 300)
      return () => clearTimeout(id)
    }

    if (mode === 'quick_check') {
      let countdown = 20
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCountdownSeconds(countdown)

      const intervalId = setInterval(() => {
        countdown -= 1
        if (countdown <= 0) {
          clearInterval(intervalId)
          startExecuting()
          setCountdownSeconds(null)
        } else {
          setCountdownSeconds(countdown)
        }
      }, 1_000)

      return () => {
        clearInterval(intervalId)
        setCountdownSeconds(null)
      }
    }

    // confirm: do nothing — execution waits for an explicit launch() call.
  }, [task])

  // ── executing → done ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!task || task.phase !== 'executing') return

    // Capture stable snapshots. Task content and parent artifact never change after
    // the executing phase begins, so these remain valid for the full timer sequence.
    const snapshot         = task
    const parentSnapshot   = parentArtifact
    const taskId   = snapshot.id
    const ids: ReturnType<typeof setTimeout>[] = []

    function later(fn: () => void, delay: number) {
      const id = setTimeout(fn, delay)
      ids.push(id)
    }

    const simSteps = generateExecutingSteps(snapshot)

    // ── Emit each step as running, then update to complete ───────────────────

    simSteps.forEach(({ step, startDelay, completionDelay }) => {
      // Start: mark running
      later(() => {
        dispatchRef.current({
          type:    'ADD_TRACE_STEP',
          payload: { taskId, step: { ...step, status: 'running', startedAt: new Date().toISOString() } },
        })
      }, startDelay)

      // Complete: fill in outputs and reasoning
      later(() => {
        const completedStep: TraceStep = {
          ...step,
          status:     'complete',
          durationMs: completionDelay - startDelay,
          outputs:    getCompletedOutputs(step.type, snapshot),
          reasoning:  STEP_REASONING[step.type] ?? null,
        }
        dispatchRef.current({ type: 'UPDATE_TRACE_STEP', payload: { taskId, step: completedStep } })
      }, completionDelay)
    })

    // ── Stream sources during execution ──────────────────────────────────────

    generateScheduledSources(snapshot).forEach(({ source, delay }) => {
      later(() => {
        dispatchRef.current({ type: 'ADD_SOURCE', payload: { taskId, source } })
      }, delay)
    })

    // ── Complete (or fail) the task ──────────────────────────────────────────

    const totalDurationMs = simSteps[simSteps.length - 1].completionDelay + 500
    const willFail        = Math.random() < FAILURE_PROBABILITY

    later(() => {
      if (willFail) {
        const reason = 'Synthesis failed: conflicting source data could not be resolved.'
        dispatchRef.current({
          type:    'FAIL_TASK',
          payload: { taskId, reason },
        })
        dispatchRef.current({
          type: 'ADD_NOTIFICATION',
          payload: {
            id:        generateId(),
            type:      'task_failed',
            projectId: snapshot.projectId,
            taskId,
            message:   `${projectTitleRef.current}: task failed — ${reason}`,
            read:      false,
            createdAt: new Date().toISOString(),
          },
        })
        return
      }

      const artifact = generateArtifact(snapshot, parentSnapshot)

      // Build the canonical final trace, merging the plan step from the snapshot
      // with all executing steps in their completed state.
      const completedSimSteps: TraceStep[] = simSteps.map(({ step, startDelay, completionDelay }) => ({
        ...step,
        status:     'complete' as const,
        durationMs: completionDelay - startDelay,
        outputs:    getCompletedOutputs(step.type, snapshot),
        reasoning:  STEP_REASONING[step.type] ?? null,
      }))

      const finalTrace: Trace = {
        ...(snapshot.trace ?? generateInitialTrace(snapshot)),
        steps:      [...(snapshot.trace?.steps ?? []), ...completedSimSteps],
        status:     'complete',
        durationMs: totalDurationMs,
        updatedAt:  new Date().toISOString(),
      }

      dispatchRef.current({
        type:    'COMPLETE_TASK',
        payload: { taskId, artifact, trace: finalTrace },
      })
      dispatchRef.current({
        type: 'ADD_NOTIFICATION',
        payload: {
          id:        generateId(),
          type:      'task_completed',
          projectId: snapshot.projectId,
          taskId,
          message:   `${projectTitleRef.current}: your artifact is ready`,
          read:      false,
          createdAt: new Date().toISOString(),
        },
      })
    }, totalDurationMs)

    return () => ids.forEach(clearTimeout)
  }, [task, parentArtifact])

  // ── Controls ──────────────────────────────────────────────────────────────

  function launch() {
    if (!task || task.phase !== 'pre_launch') return
    setCountdownSeconds(null)
    dispatchRef.current({ type: 'SET_TASK_PHASE', payload: { taskId: task.id, phase: 'executing' } })
  }

  function cancel() {
    if (!task || task.phase !== 'pre_launch') return
    setCountdownSeconds(null)
    dispatchRef.current({ type: 'CANCEL_TASK', payload: { taskId: task.id } })
  }

  return { launch, cancel, countdownSeconds }
}
