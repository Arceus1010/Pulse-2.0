import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'

import type { Project, Task } from '../types'
import { SOURCES_MODE_LABELS, deriveSourcesMode } from '../types'
import { PhaseBadge } from './PhaseBadge'
import { formatRelativeTime } from '../utils/time'
import { useResearch } from '../hooks/useResearch'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { dispatch } = useResearch()
  const navigate = useNavigate()

  const [menuOpen,      setMenuOpen]      = useState(false)
  const [renaming,      setRenaming]      = useState(false)
  const [draft,         setDraft]         = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const menuRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const latestTask  = getLatestTask(project)
  const sourcesMode = deriveSourcesMode(project.sourcesKb, project.sourcesWeb, project.sourcesProjectOnly)
  const taskCount     = project.tasks.length
  const artifactCount = project.artifacts.length

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen && !confirmDelete) return
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setConfirmDelete(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen, confirmDelete])

  // Focus input when rename starts
  useEffect(() => {
    if (renaming) inputRef.current?.select()
  }, [renaming])

  function startRename(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDraft(project.title)
    setMenuOpen(false)
    setRenaming(true)
  }

  function commitRename() {
    const trimmed = draft.trim().slice(0, 120)
    if (trimmed && trimmed !== project.title) {
      dispatch({ type: 'UPDATE_PROJECT_TITLE', payload: { projectId: project.id, title: trimmed } })
    }
    setRenaming(false)
  }

  function startDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(false)
    setConfirmDelete(true)
  }

  function confirmAndDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    dispatch({ type: 'DELETE_PROJECT', payload: { projectId: project.id } })
    navigate('/research', { replace: true })
  }

  function openMenu(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(v => !v)
    setConfirmDelete(false)
  }

  return (
    <div className="relative group">
      <Link
        to={`/research/projects/${project.id}`}
        className="block bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {renaming ? (
            <input
              ref={inputRef}
              value={draft}
              onChange={e => setDraft(e.target.value.slice(0, 120))}
              onBlur={commitRename}
              onKeyDown={e => {
                if (e.key === 'Enter')  { e.preventDefault(); commitRename() }
                if (e.key === 'Escape') { e.preventDefault(); setRenaming(false) }
              }}
              onClick={e => e.preventDefault()}
              className="flex-1 min-w-0 bg-transparent outline-none border-b-2 border-blue-400 dark:border-blue-600 text-sm font-medium text-slate-800 dark:text-zinc-100 leading-snug"
            />
          ) : (
            <p className="flex-1 min-w-0 text-sm font-medium text-slate-800 dark:text-zinc-100 leading-snug line-clamp-2 group-hover:text-blue-800 dark:group-hover:text-blue-400 transition-colors">
              {project.title}
            </p>
          )}
          <div className="flex items-center gap-1.5 shrink-0">
            {latestTask && <PhaseBadge phase={latestTask.phase} />}

            {/* Context menu trigger */}
            <button
              type="button"
              onClick={openMenu}
              title="Project options"
              className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-0.5 rounded text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
          <span className="font-medium">{SOURCES_MODE_LABELS[sourcesMode]}</span>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
            {artifactCount > 0 && (
              <span className="text-slate-400 dark:text-zinc-500">
                · {artifactCount} {artifactCount === 1 ? 'artifact' : 'artifacts'}
              </span>
            )}
          </span>
          <span aria-hidden>·</span>
          <span>{formatRelativeTime(project.updatedAt)}</span>
        </div>
      </Link>

      {/* ── Dropdown menu ─────────────────────────────────────────────── */}
      {(menuOpen || confirmDelete) && (
        <div
          ref={menuRef}
          className="absolute top-2 right-2 z-20 w-44 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-lg overflow-hidden"
          onClick={e => { e.preventDefault(); e.stopPropagation() }}
        >
          {confirmDelete ? (
            <div className="p-3 flex flex-col gap-2">
              <p className="text-xs text-slate-700 dark:text-zinc-300 leading-snug">
                Delete <span className="font-semibold">"{project.title}"</span>? This cannot be undone.
              </p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={confirmAndDelete}
                  className="flex-1 py-1 rounded text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setConfirmDelete(false) }}
                  className="flex-1 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={startRename}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400 shrink-0" />
                Rename
              </button>
              <div className="my-0.5 border-t border-slate-100 dark:border-zinc-800" />
              <button
                type="button"
                onClick={startDelete}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 shrink-0" />
                Delete project
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLatestTask(project: Project): Task | null {
  if (!project.tasks.length) return null
  return [...project.tasks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0]
}
