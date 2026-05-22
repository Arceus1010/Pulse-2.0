import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  content: string
  children: React.ReactElement
  side?: 'top' | 'bottom'
}

export default function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords]   = useState({ x: 0, y: 0 })
  const triggerRef = useRef<HTMLElement | null>(null)

  function show() {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setCoords({
      x: r.left + r.width / 2,
      y: side === 'top' ? r.top - 6 : r.bottom + 6,
    })
    setVisible(true)
  }

  useEffect(() => {
    if (!visible) return
    function hide() { setVisible(false) }
    window.addEventListener('scroll', hide, true)
    return () => window.removeEventListener('scroll', hide, true)
  }, [visible])

  const child = children as React.ReactElement<{
    ref?: React.Ref<HTMLElement>
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    onFocus?: () => void
    onBlur?: () => void
  }>

  const cloned = {
    ...child,
    props: {
      ...child.props,
      ref: (el: HTMLElement | null) => { triggerRef.current = el },
      onMouseEnter: show,
      onMouseLeave: () => setVisible(false),
      onFocus:      show,
      onBlur:       () => setVisible(false),
    },
  }

  return (
    <>
      {cloned as React.ReactElement}
      {visible && createPortal(
        <div
          role="tooltip"
          style={{
            position:  'fixed',
            left:      coords.x,
            top:       side === 'top' ? coords.y : undefined,
            bottom:    side === 'bottom' ? `calc(100vh - ${coords.y}px)` : undefined,
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 9999,
          }}
          className={`
            px-2 py-1 rounded text-[11px] leading-snug font-medium
            bg-slate-900 dark:bg-zinc-700 text-white dark:text-zinc-100
            shadow-md whitespace-nowrap max-w-[220px] whitespace-normal text-center
            ${side === 'top' ? '-translate-y-full' : ''}
          `}
        >
          {content}
        </div>,
        document.body,
      )}
    </>
  )
}
