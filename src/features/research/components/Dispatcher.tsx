import { useState, useEffect } from 'react'
import { Square, CheckSquare, ArrowRight } from 'lucide-react'
import Button from '../../../components/ui/Button'

import type { PreLaunchMode } from '../types'
import Tooltip from '../../../components/ui/Tooltip'

// ─── Public contract ──────────────────────────────────────────────────────────

export interface DispatchConfig {
  prompt: string
  sourcesKb: boolean
  sourcesWeb: boolean
  sourcesProjectOnly: boolean
  preLaunchMode: PreLaunchMode
}

interface DispatcherProps {
  onDispatch: (config: DispatchConfig) => void
  /**
   * When provided, the internal prompt field is replaced with this value.
   * Used by example-prompt chips in the empty workspace state.
   */
  prefillPrompt?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_PROMPT_LENGTH = 2_000

// ─── Component ────────────────────────────────────────────────────────────────

export default function Dispatcher({ onDispatch, prefillPrompt }: DispatcherProps) {
  const [prompt, setPrompt] = useState('')
  const [sourcesKb, setSourcesKb] = useState(true)
  const [sourcesWeb, setSourcesWeb] = useState(false)
  const [sourcesProjectOnly, setSourcesProjectOnly] = useState(false)
  const [reviewBeforeLaunch, setReviewBeforeLaunch] = useState(false)

  // Sync external prefill (example prompt chips)
  useEffect(() => {
    if (prefillPrompt != null) setPrompt(prefillPrompt)
  }, [prefillPrompt])

  // Turning off KB removes the project-only sub-toggle
  function toggleKb() {
    setSourcesKb(v => {
      if (v) setSourcesProjectOnly(false)
      return !v
    })
  }

  function derivePreLaunchMode(): PreLaunchMode {
    if (reviewBeforeLaunch) return 'confirm'
    // Spec: Deep Dive and Discover (web-enabled) default to Quick Check
    return sourcesWeb ? 'quick_check' : 'auto'
  }

  function handleDispatch() {
    if (!canDispatch) return
    onDispatch({
      prompt: prompt.trim(),
      sourcesKb,
      sourcesWeb,
      sourcesProjectOnly,
      preLaunchMode: derivePreLaunchMode(),
    })
    // Reset transient fields; source settings are intentionally sticky
    setPrompt('')
    setReviewBeforeLaunch(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleDispatch()
    }
  }

  const canDispatch = prompt.trim().length > 0 && (sourcesKb || sourcesWeb)

  const charCountClass =
    prompt.length > 1_900 ? 'text-red-500 dark:text-red-400' :
    prompt.length > 1_600 ? 'text-amber-500 dark:text-amber-400' :
    'text-slate-500 dark:text-zinc-400'

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden">

      {/* Prompt textarea */}
      <textarea
        value={prompt}
        onChange={e => setPrompt(e.target.value.slice(0, MAX_PROMPT_LENGTH))}
        onKeyDown={handleKeyDown}
        placeholder="What would you like to research?"
        rows={4}
        className="w-full resize-none bg-transparent px-4 pt-4 pb-3 text-base text-slate-800 dark:text-zinc-100 placeholder:text-slate-500 dark:placeholder:text-zinc-400 outline-none"
      />

      {/* Controls row */}
      <div className="flex items-center gap-2 px-3 pb-3 pt-2 border-t border-slate-200 dark:border-zinc-800">

        {/* Sources toggles */}
        <div className="flex items-center gap-1.5">
          <Tooltip content="Search across your knowledge base">
            <SourceChip label="KB" active={sourcesKb} onClick={toggleKb} />
          </Tooltip>
          {sourcesKb && (
            <Tooltip content="Limit KB search to this project only">
              <SourceChip
                label="Project only"
                active={sourcesProjectOnly}
                onClick={() => setSourcesProjectOnly(v => !v)}
              />
            </Tooltip>
          )}
          <Tooltip content="Search the open web for sources">
            <SourceChip label="Web" active={sourcesWeb} onClick={() => setSourcesWeb(v => !v)} />
          </Tooltip>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Character count / hint */}
        <span className={`text-xs tabular-nums shrink-0 transition-colors ${prompt.length > 0 ? charCountClass : 'text-slate-500 dark:text-zinc-400'}`}>
          {prompt.length > 0
            ? `${prompt.length.toLocaleString()} / ${MAX_PROMPT_LENGTH.toLocaleString()}`
            : '⌘ Enter to dispatch'}
        </span>

        {/* Divider */}
        <div className="w-px h-4 bg-slate-200 dark:bg-zinc-700 shrink-0" />

        {/* Review before launch toggle */}
        <button
          onClick={() => setReviewBeforeLaunch(v => !v)}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors shrink-0 ${
            reviewBeforeLaunch
              ? 'text-amber-700 dark:text-amber-400'
              : 'text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300'
          }`}
        >
          {reviewBeforeLaunch
            ? <CheckSquare className="w-3.5 h-3.5" />
            : <Square className="w-3.5 h-3.5" />
          }
          Review before launch
        </button>

        {/* Dispatch button */}
        <Button
          onClick={handleDispatch}
          disabled={!canDispatch}
          iconRight={<ArrowRight />}
          size="sm"
          className="shrink-0"
        >
          Dispatch
        </Button>

      </div>
    </div>
  )
}

// ─── Internal: source toggle chip ────────────────────────────────────────────

interface SourceChipProps {
  label: string
  active: boolean
  onClick: () => void
}

function SourceChip({ label, active, onClick }: SourceChipProps) {
  return (
    <button
      onClick={onClick}
      className={`h-6 px-2.5 rounded text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-400'
          : 'bg-transparent border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-600 hover:text-slate-700 dark:hover:text-zinc-200'
      }`}
    >
      {label}
    </button>
  )
}
