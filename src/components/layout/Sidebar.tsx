import { useState, useRef } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { BarChart3, Bell, BookOpen, ChevronLeft, ChevronRight, Sun, Moon, Settings } from 'lucide-react'
import pulseLogo from '../../assets/Pulse (Logo).svg'
import { useTheme } from '../../hooks/useTheme'
import { useResearch } from '../../features/research/hooks/useResearch'
import NotificationPanel from './NotificationPanel'

const navItems = [
  {
    to: '/analytics',
    label: 'Analytics',
    icon: <BarChart3 className="w-4 h-4 shrink-0" />,
  },
  {
    to: '/research',
    label: 'Research',
    icon: <BookOpen className="w-4 h-4 shrink-0" />,
  },
]

export default function Sidebar() {
  const { isDark, toggle }      = useTheme()
  const { state }               = useResearch()
  const [expanded, setExpanded] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const bellButtonRef = useRef<HTMLButtonElement>(null)

  const unreadCount = state.notifications.filter(n => !n.read).length

  return (
    <aside
      className={`${
        expanded ? 'w-52' : 'w-12'
      } shrink-0 h-screen sticky top-0 flex flex-col border-r border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-[width] duration-200 overflow-hidden`}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-2 border-b border-slate-200 dark:border-zinc-800 shrink-0">
        {expanded && <Link to="/"><img src={pulseLogo} alt="Pulse" className="h-6" /></Link>}
        <button
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          className={`cursor-pointer p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors ${!expanded ? 'mx-auto' : ''}`}
        >
          {expanded ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-1.5 py-3 flex flex-col gap-px">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            title={!expanded ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-1.5 rounded-md text-base transition-colors whitespace-nowrap ${
                !expanded ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 font-medium'
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100'
              }`
            }
          >
            {icon}
            {expanded && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-1.5 py-2 border-t border-slate-200 dark:border-zinc-800 shrink-0 flex flex-col gap-px">

        {/* Bell + Notifications Panel */}
        <div className="relative">
          <button
            ref={bellButtonRef}
            type="button"
            onClick={() => setNotifOpen(o => !o)}
            title="Notifications"
            aria-label="Notifications"
            className={`cursor-pointer relative w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-base transition-colors whitespace-nowrap ${!expanded ? 'justify-center' : ''} ${
              notifOpen
                ? 'bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-zinc-100'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            <span className="relative shrink-0">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-3.5 h-3.5 rounded-full bg-blue-600 text-xs font-bold text-white leading-none">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </span>
            {expanded && <span>Notifications</span>}
          </button>

          {notifOpen && (
            <NotificationPanel
              onClose={() => setNotifOpen(false)}
              buttonRef={bellButtonRef}
              sidebarWidth={expanded ? 208 : 48}
            />
          )}
        </div>

        <button
          onClick={toggle}
          title={isDark ? 'Light mode' : 'Dark mode'}
          aria-label="Toggle theme"
          className={`cursor-pointer w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-base text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors whitespace-nowrap ${!expanded ? 'justify-center' : ''}`}
        >
          {isDark ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
          {expanded && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
        </button>
        <NavLink
          to="/settings"
          title={!expanded ? 'Settings' : undefined}
          className={({ isActive }) =>
            `flex items-center gap-2 px-2 py-1.5 rounded-md text-base transition-colors whitespace-nowrap ${
              !expanded ? 'justify-center' : ''
            } ${
              isActive
                ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 font-medium'
                : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-zinc-100'
            }`
          }
        >
          <Settings className="w-4 h-4 shrink-0" />
          {expanded && <span>Settings</span>}
        </NavLink>
      </div>
    </aside>
  )
}
