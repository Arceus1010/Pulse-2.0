import { useState, useRef, useEffect, useCallback } from 'react'
import type { ChatMessage } from './types'
import { generateResponse } from './mockResponses'

let _seq = 0
function uid() {
  return `m${++_seq}-${Math.random().toString(36).slice(2, 6)}`
}

function formatKwShort(keywords: string[]): string {
  if (keywords.length === 1) return `"${keywords[0]}"`
  if (keywords.length === 2) return `"${keywords[0]}" and "${keywords[1]}"`
  return `"${keywords[0]}", "${keywords[1]}" and ${keywords.length - 2} more`
}

function makeWelcome(hasAnalysed: boolean, keywords: string[]): ChatMessage {
  return {
    id: uid(),
    role: 'assistant',
    content:
      hasAnalysed && keywords.length > 0
        ? `Hi! I'm Pulse AI. I can see you're analysing ${formatKwShort(keywords)}. Ask me anything about the data — sentiment, trends, geographic spread, or key influencers.`
        : "Hi! I'm Pulse AI, your intelligence assistant. I can answer general questions right now. Enter keywords and run an analysis above to unlock context-specific insights.",
    timestamp: Date.now(),
  }
}

const typingDelay = () => 850 + Math.random() * 550

export function usePulseAI(hasAnalysed: boolean, keywords: string[]) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const prevAnalysedRef = useRef(hasAnalysed)
  const prevKeywordsKeyRef = useRef(keywords.join(','))
  const inputRef = useRef<HTMLInputElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const handleOpen = useCallback(() => {
    setIsOpen(true)
    setMessages(prev => (prev.length === 0 ? [makeWelcome(hasAnalysed, keywords)] : prev))
    setTimeout(() => inputRef.current?.focus(), 60)
  }, [hasAnalysed, keywords])

  const handleClose = useCallback(() => setIsOpen(false), [])

  const clearMessages = useCallback(() => {
    setMessages([makeWelcome(hasAnalysed, keywords)])
  }, [hasAnalysed, keywords])

  // Auto-scroll to bottom when messages or typing indicator changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Inject a context-change divider when analysis runs while chat has messages
  useEffect(() => {
    const keywordsKey = keywords.join(',')
    const firstAnalysis = hasAnalysed && !prevAnalysedRef.current
    const keywordsChanged =
      hasAnalysed && keywordsKey !== prevKeywordsKeyRef.current && keywordsKey !== ''

    if (firstAnalysis || keywordsChanged) {
      setMessages(prev => {
        if (prev.length === 0) return prev
        return [
          ...prev,
          {
            id: uid(),
            role: 'assistant',
            variant: 'context-event',
            content: '',
            keywords: [...keywords],
            timestamp: Date.now(),
          },
        ]
      })
    }

    prevAnalysedRef.current = hasAnalysed
    prevKeywordsKeyRef.current = keywordsKey
  }, [hasAnalysed, keywords]) // eslint-disable-line react-hooks/exhaustive-deps

  // Core send — does not touch input state
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || isTyping) return

      const userMsg: ChatMessage = {
        id: uid(),
        role: 'user',
        content: trimmed,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, userMsg])
      setIsTyping(true)

      const sentAt = Date.now()
      const delay = typingDelay()

      setTimeout(() => {
        const { content, callout, tabHint } = generateResponse(trimmed, hasAnalysed ? keywords : [])
        const responseTimeMs = Date.now() - sentAt
        setMessages(prev => [
          ...prev,
          {
            id: uid(),
            role: 'assistant',
            content,
            callout,
            tabHint,
            responseTimeMs,
            timestamp: Date.now(),
          },
        ])
        setIsTyping(false)
      }, delay)
    },
    [isTyping, hasAnalysed, keywords],
  )

  // Reads from the input field — the primary send path
  const handleSend = useCallback(() => {
    sendMessage(input)
    setInput('')
  }, [input, sendMessage])

  // Used by suggested prompt chips — sends without going through the input field
  const handlePromptClick = useCallback(
    (text: string) => {
      sendMessage(text)
    },
    [sendMessage],
  )

  return {
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
  }
}
