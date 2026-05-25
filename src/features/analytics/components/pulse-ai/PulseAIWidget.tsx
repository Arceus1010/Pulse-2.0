import { Bot, X } from 'lucide-react'
import { usePulseAI } from './usePulseAI'
import ChatPanel from './ChatPanel'
import type { PulseAIWidgetProps } from './types'

export default function PulseAIWidget({ hasAnalysed, keywords }: PulseAIWidgetProps) {
  const {
    isOpen,
    handleOpen,
    handleClose,
    clearMessages,
    messages,
    input,
    setInput,
    isTyping,
    handleSend,
    handlePromptClick,
    inputRef,
    bottomRef,
  } = usePulseAI(hasAnalysed, keywords)

  return (
    <>
      {/* ── Chat panel ───────────────────────────────── */}
      <div
        className={[
          'fixed bottom-20 right-6 z-50 w-96 h-145',
          'transition-all duration-200 ease-out origin-bottom-right',
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 translate-y-3 pointer-events-none',
        ].join(' ')}
        aria-hidden={!isOpen}
      >
        <ChatPanel
          hasAnalysed={hasAnalysed}
          keywords={keywords}
          messages={messages}
          input={input}
          isTyping={isTyping}
          inputRef={inputRef}
          bottomRef={bottomRef}
          onClose={handleClose}
          onClear={clearMessages}
          onInputChange={setInput}
          onSend={handleSend}
          onPromptClick={handlePromptClick}
        />
      </div>

      {/* ── Floating button ──────────────────────────── */}
      <button
        onClick={isOpen ? handleClose : handleOpen}
        aria-label={isOpen ? 'Close Pulse AI' : 'Open Pulse AI'}
        className={[
          'fixed bottom-6 right-6 z-50',
          'w-12 h-12 rounded-full',
          'bg-blue-800 dark:bg-blue-700',
          'hover:bg-blue-900 dark:hover:bg-blue-600',
          'text-white shadow-lg shadow-blue-900/25 dark:shadow-blue-900/40',
          'flex items-center justify-center',
          'transition-all duration-200',
        ].join(' ')}
      >
        <span
          className={`absolute transition-all duration-200 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
        >
          <X className="w-5 h-5" />
        </span>
        <span
          className={`absolute transition-all duration-200 ${isOpen ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`}
        >
          <Bot className="w-5 h-5" />
        </span>

        {/* Context-active indicator dot */}
        {hasAnalysed && !isOpen && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 pointer-events-none" />
        )}
      </button>
    </>
  )
}
