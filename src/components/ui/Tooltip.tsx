import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: string
  children: React.ReactElement
  side?: 'top' | 'bottom'
  delay?: number
}

export default function Tooltip({ content, children, side = 'top', delay = 200 }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const showTimeoutRef = useRef<number | null>(null)
  const hideTimeoutRef = useRef<number | null>(null)

  const calculateCoords = useCallback(() => {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setCoords({
      x: r.left + r.width / 2,
      y: side === 'top' ? r.top - 6 : r.bottom + 6,
    })
  }, [side])

  const show = useCallback(() => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    showTimeoutRef.current = setTimeout(() => {
      calculateCoords()
      setVisible(true)
    }, delay)
  }, [delay, calculateCoords])

  const hide = useCallback(() => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false)
    }, 50)
  }, [])

  useEffect(() => {
    if (!visible) return

    const handleScroll = () => hide()
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide()
    }

    window.addEventListener('scroll', handleScroll, true)
    document.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [visible, hide])

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </div>
      {visible &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: 'fixed',
              left: `${coords.x}px`,
              top: side === 'top' ? `${coords.y}px` : undefined,
              bottom: side === 'bottom' ? `${window.innerHeight - coords.y}px` : undefined,
              transform: side === 'top' ? 'translateX(-50%) translateY(-100%)' : 'translateX(-50%)',
              pointerEvents: 'none',
              zIndex: 9999,
            }}
            className="px-2 py-1 rounded text-sm leading-snug font-medium bg-slate-900 dark:bg-zinc-700 text-white dark:text-zinc-100 shadow-md whitespace-normal max-w-55 text-center"
          >
            {content}
          </div>,
          document.body
        )}
    </>
  )
}
