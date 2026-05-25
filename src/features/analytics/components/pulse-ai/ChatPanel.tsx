import { Bot, Send, X, Trash2, RefreshCw, ArrowRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ChatMessage, TabKey } from './types'
import type { RefObject } from 'react'

// ── Helpers ───────────────────────────────────────────────────────────────────

const TAB_CHIPS = [
  'Sentiment tab',
  'Trend tab',
  'Geographic tab',
  'PESTLE tab',
  'Source tab',
  'Overview tab',
]
const TAB_CHIP_RE = new RegExp(`(${TAB_CHIPS.join('|')})`)

/** Splits body text and wraps tab references in styled inline chips */
function RichBody({ text }: { text: string }) {
  const parts = text.split(TAB_CHIP_RE)
  return (
    <>
      {parts.map((part, i) =>
        TAB_CHIPS.includes(part) ? (
          <span
            key={i}
            className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-sm bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400 text-xs font-semibold align-middle leading-none whitespace-nowrap"
          >
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatResponseTime(ms: number): string {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`
}

// ── Suggested prompts ─────────────────────────────────────────────────────────

const PROMPTS_GENERAL = [
  'What is sentiment analysis?',
  'How does PESTLE work?',
  'What platforms do you track?',
  'How does trend detection work?',
]

const PROMPTS_CONTEXTUAL = [
  "What's the overall sentiment?",
  'Show me the trend patterns',
  'Which platforms dominate?',
  'Who are the key influencers?',
]

interface SuggestedPromptsProps {
  hasAnalysed: boolean
  onClick: (text: string) => void
}

function SuggestedPrompts({ hasAnalysed, onClick }: SuggestedPromptsProps) {
  const prompts = hasAnalysed ? PROMPTS_CONTEXTUAL : PROMPTS_GENERAL
  return (
    <div className="px-1 pt-2 pb-1">
      <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2 px-1">
        Suggested
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {prompts.map(p => (
          <button
            key={p}
            onClick={() => onClick(p)}
            className="text-left px-2.5 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/60 text-xs text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600 hover:text-slate-800 dark:hover:text-zinc-100 transition-colors leading-snug"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Context-event divider ─────────────────────────────────────────────────────

interface ContextEventProps {
  keywords: string[]
  timestamp: number
}

function ContextEvent({ keywords, timestamp }: ContextEventProps) {
  return (
    <div className="flex flex-col items-center gap-2 py-2 px-1">
      <div className="flex items-center gap-3 w-full">
        <div className="h-px flex-1 bg-emerald-200 dark:bg-emerald-900/50" />
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider shrink-0">
          <RefreshCw className="w-3 h-3" />
          Context updated
        </div>
        <div className="h-px flex-1 bg-emerald-200 dark:bg-emerald-900/50" />
      </div>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {keywords.map(kw => (
          <span
            key={kw}
            className="inline-flex items-center h-5 px-2 rounded-sm bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-400 text-xs font-medium"
          >
            {kw}
          </span>
        ))}
      </div>
      <span className="text-xs text-slate-300 dark:text-zinc-600">{formatTime(timestamp)}</span>
    </div>
  )
}

// ── Tab-hint navigation chip ──────────────────────────────────────────────────

interface TabHintChipProps {
  label: string
  tab: TabKey
}

function TabHintChip({ label, tab }: TabHintChipProps) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(`/analytics/${tab}`)}
      className="inline-flex items-center gap-1 mt-2 px-2.5 py-1.5 rounded-sm border border-blue-200 dark:border-blue-800/60 bg-white dark:bg-zinc-900 text-blue-700 dark:text-blue-400 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
    >
      <ArrowRight className="w-3 h-3 shrink-0" />
      {label}
    </button>
  )
}

// ── AI message bubble ─────────────────────────────────────────────────────────

function AIBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-5 h-5 rounded-full bg-blue-800 dark:bg-blue-700 flex items-center justify-center shrink-0 mb-0.5">
        <Bot className="w-3 h-3 text-white" />
      </div>
      <div className="max-w-[82%] flex flex-col gap-1">
        <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg rounded-bl-sm px-3 py-2.5">
          <p className="text-sm leading-relaxed text-slate-800 dark:text-zinc-200">
            <RichBody text={msg.content} />
          </p>

          {msg.callout && (
            <div className="mt-2.5 pl-2.5 border-l-2 border-blue-300 dark:border-blue-700">
              <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400 italic">
                {msg.callout}
              </p>
            </div>
          )}

          {msg.tabHint && <TabHintChip label={msg.tabHint.label} tab={msg.tabHint.tab} />}
        </div>

        <div className="flex items-center gap-2 px-0.5">
          <span className="text-xs text-slate-300 dark:text-zinc-600">
            {formatTime(msg.timestamp)}
          </span>
          {msg.responseTimeMs !== undefined && (
            <>
              <span className="text-xs text-slate-200 dark:text-zinc-700">·</span>
              <span className="text-xs text-slate-300 dark:text-zinc-600">
                {formatResponseTime(msg.responseTimeMs)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── User message bubble ───────────────────────────────────────────────────────

function UserBubble({ msg }: { msg: ChatMessage }) {
  return (
    <div className="flex items-end gap-2 justify-end">
      <div className="max-w-[82%] flex flex-col items-end gap-1">
        <div className="bg-blue-800 dark:bg-blue-700 text-white rounded-lg rounded-br-sm px-3 py-2.5">
          <p className="text-sm leading-relaxed">{msg.content}</p>
        </div>
        <span className="text-xs text-slate-300 dark:text-zinc-600 px-0.5">
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  )
}

// ── ChatPanel ─────────────────────────────────────────────────────────────────

interface ChatPanelProps {
  hasAnalysed: boolean
  keywords: string[]
  messages: ChatMessage[]
  input: string
  isTyping: boolean
  inputRef: RefObject<HTMLInputElement | null>
  bottomRef: RefObject<HTMLDivElement | null>
  onClose: () => void
  onClear: () => void
  onInputChange: (value: string) => void
  onSend: () => void
  onPromptClick: (text: string) => void
}

export default function ChatPanel({
  hasAnalysed,
  keywords,
  messages,
  input,
  isTyping,
  inputRef,
  bottomRef,
  onClose,
  onClear,
  onInputChange,
  onSend,
  onPromptClick,
}: ChatPanelProps) {
  const showClear = messages.length > 1

  // Show suggested prompts after the welcome or after a context-event
  const lastMsg = messages[messages.length - 1]
  const showPrompts =
    !isTyping &&
    messages.length > 0 &&
    (messages.length === 1 || lastMsg?.variant === 'context-event')

  const placeholder = hasAnalysed && keywords.length > 0 ? 'Ask about your analysis…' : 'Ask Pulse AI…'

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-800 shadow-xl shadow-slate-900/10 dark:shadow-black/40 overflow-hidden">

      {/* ── Header ───────────────────────────────────── */}
      <div className="shrink-0 border-b border-slate-200 dark:border-zinc-800 px-4 pt-3 pb-2.5 bg-white dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-2">
          {/* Identity */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-blue-800 dark:bg-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 leading-none">
                Pulse AI
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    hasAnalysed ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-zinc-600'
                  }`}
                />
                <span className="text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
                  {hasAnalysed ? 'Context active' : 'General mode'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 shrink-0">
            {showClear && (
              <button
                onClick={onClear}
                title="Clear conversation"
                className="flex items-center justify-center w-6 h-6 rounded-sm text-slate-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              title="Close"
              className="flex items-center justify-center w-6 h-6 rounded-sm text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Keyword context row */}
        {hasAnalysed && keywords.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5 ml-9 flex-wrap">
            {keywords.slice(0, 3).map(kw => (
              <span
                key={kw}
                className="inline-flex items-center h-5 px-2 rounded-sm bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-400 text-xs font-medium"
              >
                {kw}
              </span>
            ))}
            {keywords.length > 3 && (
              <span className="text-xs text-slate-400 dark:text-zinc-500">
                +{keywords.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Message thread ───────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => {
          if (msg.variant === 'context-event') {
            return (
              <ContextEvent
                key={msg.id}
                keywords={msg.keywords ?? []}
                timestamp={msg.timestamp}
              />
            )
          }
          if (msg.role === 'assistant') return <AIBubble key={msg.id} msg={msg} />
          return <UserBubble key={msg.id} msg={msg} />
        })}

        {/* Suggested prompts — appear after welcome or after context switch */}
        {showPrompts && (
          <SuggestedPrompts hasAnalysed={hasAnalysed} onClick={onPromptClick} />
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-2 justify-start">
            <div className="w-5 h-5 rounded-full bg-blue-800 dark:bg-blue-700 flex items-center justify-center shrink-0 mb-0.5">
              <Bot className="w-3 h-3 text-white" />
            </div>
            <div className="bg-slate-100 dark:bg-zinc-800 rounded-lg rounded-bl-sm px-3 py-2.5">
              <div className="flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 animate-bounce"
                    style={{ animationDelay: `${i * 160}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* ── Input ────────────────────────────────────── */}
      <div className="shrink-0 border-t border-slate-200 dark:border-zinc-800 px-3 py-3 bg-white dark:bg-zinc-900">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-zinc-800 rounded-lg px-3 py-2 border border-slate-200 dark:border-zinc-700 focus-within:border-blue-300 dark:focus-within:border-blue-700 transition-colors">
          <input
            ref={inputRef}
            value={input}
            onChange={e => onInputChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                onSend()
              }
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-none min-w-0"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isTyping}
            className="text-blue-800 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {!hasAnalysed && (
          <div className="flex items-center justify-center gap-1 mt-2">
            <Sparkles className="w-3 h-3 text-slate-300 dark:text-zinc-600" />
            <p className="text-xs text-slate-400 dark:text-zinc-500">
              Run an analysis for contextual insights
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
