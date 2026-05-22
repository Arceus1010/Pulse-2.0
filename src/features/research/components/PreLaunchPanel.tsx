import { useState } from 'react'
import { Globe, Database, Edit2, Check, X, Plus, Trash2 } from 'lucide-react'

import type { Task, TraceStep } from '../types'
import type { SimulatorControls } from '../simulator/useTaskSimulator'
import { useResearch } from '../hooks/useResearch'

// ─── Local types ──────────────────────────────────────────────────────────────

interface PlanOutputs {
  subQuestions?: string[]
  sourcePlan?: {
    webQueries?: string[]
    kbQueries?: string[]
  }
  strategy?: string
}

interface PreLaunchPanelProps {
  task: Task
  simulatorControls: SimulatorControls
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PreLaunchPanel({ task, simulatorControls }: PreLaunchPanelProps) {
  const { dispatch } = useResearch()

  const planStep = task.trace?.steps.find(s => s.type === 'plan')
  const outputs  = planStep?.outputs as PlanOutputs | undefined

  const [editing, setEditing] = useState(false)
  const [draftSubQ,     setDraftSubQ]     = useState<string[]>([])
  const [draftWebQ,     setDraftWebQ]     = useState<string[]>([])
  const [draftKbQ,      setDraftKbQ]      = useState<string[]>([])

  function startEdit() {
    setDraftSubQ([...(outputs?.subQuestions              ?? [])])
    setDraftWebQ([...(outputs?.sourcePlan?.webQueries   ?? [])])
    setDraftKbQ([...(outputs?.sourcePlan?.kbQueries     ?? [])])
    setEditing(true)
  }

  function saveEdit() {
    if (!planStep) { setEditing(false); return }

    const updatedStep: TraceStep = {
      ...planStep,
      outputs: {
        ...planStep.outputs,
        subQuestions: draftSubQ.filter(q => q.trim()),
        sourcePlan: {
          ...(typeof planStep.outputs.sourcePlan === 'object' && planStep.outputs.sourcePlan !== null
            ? planStep.outputs.sourcePlan as object
            : {}),
          ...(task.sourcesWeb ? { webQueries: draftWebQ.filter(q => q.trim()) } : {}),
          ...(task.sourcesKb  ? { kbQueries:  draftKbQ.filter(q =>  q.trim()) } : {}),
        },
      },
      userModified: true,
    }

    dispatch({ type: 'UPDATE_TRACE_STEP', payload: { taskId: task.id, step: updatedStep } })
    setEditing(false)
  }

  function discardEdit() {
    setEditing(false)
  }

  const subQuestions = editing ? draftSubQ : (outputs?.subQuestions              ?? [])
  const webQueries   = editing ? draftWebQ : (outputs?.sourcePlan?.webQueries   ?? [])
  const kbQueries    = editing ? draftKbQ  : (outputs?.sourcePlan?.kbQueries    ?? [])

  return (
    <div className="flex-1 flex flex-col px-5 py-6 gap-6">

      {/* Sub-questions */}
      {(subQuestions.length > 0 || editing) && (
        <section className="flex flex-col gap-3">
          <SectionHeader
            label="Sub-questions"
            badge={subQuestions.length > 0 ? String(subQuestions.length) : undefined}
          />

          {editing ? (
            <EditList
              items={draftSubQ}
              onChange={setDraftSubQ}
              placeholder="Sub-question…"
              maxItems={6}
              addLabel="Add question"
            />
          ) : (
            <ol className="flex flex-col gap-2">
              {subQuestions.map((q, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed">
                  <span className="shrink-0 font-semibold text-slate-500 dark:text-zinc-400 w-4 text-right">
                    {i + 1}.
                  </span>
                  {q}
                </li>
              ))}
            </ol>
          )}
        </section>
      )}

      {/* Sources I'll use */}
      {(task.sourcesWeb || task.sourcesKb) && (
        <section className="flex flex-col gap-3">
          <SectionHeader label="Sources I'll use" />

          <div className="flex flex-col gap-3">

            {task.sourcesWeb && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-slate-500 dark:text-zinc-400" />
                  <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Web search</span>
                </div>

                {editing ? (
                  <EditList
                    items={draftWebQ}
                    onChange={setDraftWebQ}
                    placeholder="Search query…"
                    maxItems={8}
                    addLabel="Add query"
                    mono
                  />
                ) : (
                  <ul className="flex flex-col gap-1">
                    {webQueries.map((q, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-600 shrink-0" />
                        <span className="text-xs text-slate-600 dark:text-zinc-400 font-mono leading-relaxed break-all">
                          {q}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {task.sourcesKb && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3 h-3 text-slate-500 dark:text-zinc-400" />
                  <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400">Knowledge base</span>
                </div>

                {editing ? (
                  <EditList
                    items={draftKbQ}
                    onChange={setDraftKbQ}
                    placeholder="Knowledge base query…"
                    maxItems={8}
                    addLabel="Add query"
                    mono
                  />
                ) : (
                  <ul className="flex flex-col gap-1">
                    {kbQueries.map((q, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-600 shrink-0" />
                        <span className="text-xs text-slate-600 dark:text-zinc-400 font-mono leading-relaxed break-all">
                          {q}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

          </div>
        </section>
      )}

      {/* Plan */}
      {outputs?.strategy && (
        <section className="flex flex-col gap-2">
          <SectionHeader label="Plan" />
          <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed bg-slate-50 dark:bg-zinc-800/60 rounded-md px-3 py-2.5">
            {outputs.strategy}
          </p>
          {planStep?.userModified && (
            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
              Edited by you
            </span>
          )}
        </section>
      )}

      {/* Action bar */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        {editing ? (
          <>
            <button
              type="button"
              onClick={saveEdit}
              className="h-7 px-3 rounded-sm bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3 h-3" />
              Save changes
            </button>
            <button
              type="button"
              onClick={discardEdit}
              className="h-7 px-3 rounded-sm border border-slate-200 dark:border-zinc-700 text-xs text-slate-600 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors flex items-center gap-1.5"
            >
              <X className="w-3 h-3" />
              Discard
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={simulatorControls.launch}
              className="h-7 px-4 rounded-sm bg-blue-800 hover:bg-blue-900 text-white text-xs font-semibold transition-colors"
            >
              Launch now
            </button>
            <button
              type="button"
              onClick={startEdit}
              className="h-7 px-3 rounded-sm border border-slate-200 dark:border-zinc-700 text-xs text-slate-600 dark:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-600 transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3 h-3" />
              Edit plan
            </button>
            <button
              type="button"
              onClick={simulatorControls.cancel}
              className="h-7 px-3 rounded-sm border border-slate-200 dark:border-zinc-700 text-xs text-slate-600 dark:text-zinc-300 hover:border-red-300 dark:hover:border-red-800/60 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-auto"
            >
              Cancel
            </button>
          </>
        )}
      </div>

    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ label, badge }: { label: string; badge?: string }) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
        {label}
      </h2>
      {badge && (
        <span className="text-[11px] font-medium tabular-nums px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400">
          {badge}
        </span>
      )}
    </div>
  )
}

// ─── Editable list ────────────────────────────────────────────────────────────

interface EditListProps {
  items:     string[]
  onChange:  (items: string[]) => void
  placeholder: string
  maxItems:  number
  addLabel:  string
  mono?:     boolean
}

function EditList({ items, onChange, placeholder, maxItems, addLabel, mono = false }: EditListProps) {
  function update(index: number, value: string) {
    const next = [...items]
    next[index] = value
    onChange(next)
  }

  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function add() {
    if (items.length >= maxItems) return
    onChange([...items, ''])
  }

  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <input
            type="text"
            value={item}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholder}
            className={`flex-1 min-w-0 h-7 px-2.5 rounded-sm border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 placeholder:text-slate-500 dark:placeholder:text-zinc-400 outline-none focus:border-blue-300 dark:focus:border-blue-700/60 transition-colors text-sm ${
              mono ? 'font-mono' : ''
            }`}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="shrink-0 w-6 h-6 flex items-center justify-center rounded text-slate-400 dark:text-zinc-500 hover:text-red-400 dark:hover:text-red-400 transition-colors"
            aria-label="Remove"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}

      {items.length < maxItems && (
        <button
          type="button"
          onClick={add}
          className="flex items-center gap-1 self-start text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors mt-0.5"
        >
          <Plus className="w-3 h-3" />
          {addLabel}
        </button>
      )}
    </div>
  )
}
