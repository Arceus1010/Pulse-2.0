import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, Clock, X, AlertCircle, CheckCircle } from 'lucide-react'

import type { Notification, NotificationType } from '../../features/research/types'
import { useResearch } from '../../features/research/hooks/useResearch'

interface NotificationPanelProps {
  onClose: () => void
  sidebarWidth: number
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

export default function NotificationPanel({ onClose, sidebarWidth, buttonRef }: NotificationPanelProps) {
  const [panelBottom, setPanelBottom] = useState(0)
  const { state, dispatch } = useResearch()
  const navigate = useNavigate()
  const notifications = state.notifications
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPanelBottom(window.innerHeight - rect.bottom)
    }
  }, [buttonRef])

  function handleMarkAllRead() {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' })
  }

  function handleDismiss(notifId: string, e: React.MouseEvent) {
    e.stopPropagation()
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { notificationId: notifId } })
  }

  function handleClick(notif: Notification) {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: { notificationId: notif.id } })
    navigate(`/research/projects/${notif.projectId}`)
    onClose()
  }

  const gap = 8 // small gap between sidebar and panel
  const panelLeft = sidebarWidth + gap

  const panel = (
    <>
      {/* Backdrop - fade in */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        style={{
          animation: 'fadeIn 200ms ease-out',
        }}
      />

      {/* Panel - fade in + slide up */}
      <div
        style={{
          position: 'fixed',
          left: `${panelLeft}px`,
          bottom: `${panelBottom}px`,
          zIndex: 50,
          animation: 'slideUpAndFadeIn 300ms ease-out',
        }}
        className="w-72 flex flex-col rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl overflow-hidden"
      >
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUpAndFadeIn {
            from {
              opacity: 0;
              transform: translateY(12px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded text-xs font-bold text-white bg-blue-600 dark:bg-blue-500">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 transition-colors"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick action bar */}
        {unreadCount > 0 && (
          <div className="px-4 py-2 border-b border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
            >
              <Check className="w-3 h-3" />
              Mark all read
            </button>
          </div>
        )}

        {/* List */}
        <div className="overflow-y-auto flex-1 max-h-80">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <Bell className="w-5 h-5 text-slate-300 dark:text-zinc-600 mb-2" />
              <p className="text-sm text-slate-500 dark:text-zinc-400">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {notifications.map(n => (
                <NotifRow key={n.id} notif={n} onDismiss={handleDismiss} onClick={() => handleClick(n)} />
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  )

  return createPortal(panel, document.body)
}

// ─── Notification Row ────────────────────────────────────────────────────────

function NotifRow({
  notif,
  onClick,
  onDismiss,
}: {
  notif: Notification
  onClick: () => void
  onDismiss: (id: string, e: React.MouseEvent) => void
}) {
  const typeConfig = getTypeConfig(notif.type)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full text-left flex items-start gap-2.5 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-zinc-800/50 ${
        !notif.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
      }`}
    >
      {/* Unread indicator */}
      {!notif.read && (
        <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${typeConfig.dotColor}`} />
      )}

      {/* Icon */}
      <div className="mt-1 shrink-0 text-slate-400 dark:text-zinc-500">
        {typeConfig.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">
            {typeConfig.label}
          </span>
          <span className="text-xs text-slate-400 dark:text-zinc-500 shrink-0">
            {relativeTime(notif.createdAt)}
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-2">
          {notif.message}
        </p>
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={e => onDismiss(notif.id, e)}
        className="shrink-0 text-slate-400 dark:text-zinc-600 hover:text-slate-600 dark:hover:text-zinc-400 transition-colors opacity-0 group-hover:opacity-100"
        title="Dismiss"
      >
        <X className="w-3 h-3" />
      </button>
    </button>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface TypeConfig {
  label: string
  icon: React.ReactNode
  dotColor: string
}

function getTypeConfig(type: NotificationType): TypeConfig {
  if (type === 'awaiting_review') {
    return {
      label: 'Awaiting Review',
      icon: <Clock className="w-3 h-3" />,
      dotColor: 'bg-amber-400 dark:bg-amber-500',
    }
  }
  if (type === 'task_completed') {
    return {
      label: 'Task Complete',
      icon: <CheckCircle className="w-3 h-3" />,
      dotColor: 'bg-emerald-400 dark:bg-emerald-500',
    }
  }
  return {
    label: 'Task Failed',
    icon: <AlertCircle className="w-3 h-3" />,
    dotColor: 'bg-red-400 dark:bg-red-500',
  }
}

function relativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime()
  const secs = Math.floor(ms / 1_000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}
