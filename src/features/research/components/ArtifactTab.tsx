import { useState, useMemo } from 'react'
import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { Link2 } from 'lucide-react'

import type { Artifact, ArtifactVersion, ArtifactKind } from '../types'
import { ARTIFACT_KIND_LABELS } from '../types'
import { useResearch } from '../hooks/useResearch'
import ReportArtifactView from './ReportArtifactView'

// ─── Component ────────────────────────────────────────────────────────────────

interface ArtifactTabProps {
  artifact: Artifact | null
  version:  ArtifactVersion | null
}

export default function ArtifactTab({ artifact, version }: ArtifactTabProps) {
  if (!artifact || !version) {
    return (
      <div className="flex-1 flex items-center justify-center px-8 py-16 text-center">
        <p className="text-base text-slate-500 dark:text-zinc-400">No artifact available.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">

      {/* Metadata strip */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 dark:border-zinc-800">
        <EditableTitle artifact={artifact} />
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <KindBadge kind={artifact.kind} />
          <span className="text-sm text-slate-500 dark:text-zinc-400">
            {version.wordCount.toLocaleString()} words
          </span>
          <Dot />
          <span className="text-sm text-slate-500 dark:text-zinc-400">
            v{version.versionNumber}
          </span>
          <Dot />
          <span className="text-sm text-slate-500 dark:text-zinc-400">
            {new Date(version.createdAt).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Content */}
      {artifact.kind === 'report' ? (
        <ReportArtifactView />
      ) : (
        <article className="px-6 py-6 pb-12">
          <MarkdownBody
            content={version.content}
            artifactId={artifact.id}
            versionId={version.id}
          />
        </article>
      )}

    </div>
  )
}

// ─── Editable title ───────────────────────────────────────────────────────────

function EditableTitle({ artifact }: { artifact: Artifact }) {
  const { dispatch } = useResearch()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft]     = useState('')

  function startEdit() {
    setDraft(artifact.title)
    setEditing(true)
  }

  function save() {
    const trimmed = draft.trim().slice(0, 80)
    if (trimmed && trimmed !== artifact.title) {
      dispatch({ type: 'RENAME_ARTIFACT', payload: { artifactId: artifact.id, title: trimmed } })
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value.slice(0, 80))}
        onBlur={save}
        onKeyDown={e => {
          if (e.key === 'Enter') save()
          if (e.key === 'Escape') setEditing(false)
        }}
        className="w-full bg-transparent outline-none border-b-2 border-blue-400 dark:border-blue-600 text-xl font-semibold text-slate-900 dark:text-zinc-50 leading-snug"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={startEdit}
      title="Click to rename"
      className="text-left w-full text-xl font-semibold text-slate-900 dark:text-zinc-50 leading-snug hover:text-blue-800 dark:hover:text-blue-400 transition-colors"
    >
      {artifact.title}
    </button>
  )
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

function MarkdownBody({ content, artifactId, versionId }: {
  content:    string
  artifactId: string
  versionId:  string
}) {
  const components = useMemo<Components>(
    () => buildComponents(artifactId, versionId),
    [artifactId, versionId],
  )

  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </Markdown>
  )
}

function buildComponents(artifactId: string, versionId: string): Components {
  return {
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 mt-0 mb-4">
        {children}
      </h1>
    ),

    h2: ({ children }) => (
      <H2WithAnchor artifactId={artifactId} versionId={versionId}>
        {children}
      </H2WithAnchor>
    ),

    h3: ({ children }) => (
      <h3 className="text-base font-semibold text-slate-800 dark:text-zinc-100 mt-5 mb-2">
        {children}
      </h3>
    ),

    p: ({ children }) => (
      <p className="text-base text-slate-700 dark:text-zinc-300 leading-relaxed mb-3">
        {children}
      </p>
    ),

    strong: ({ children }) => (
      <strong className="font-semibold text-slate-900 dark:text-zinc-100">{children}</strong>
    ),

    em: ({ children }) => <em className="italic">{children}</em>,

    ul: ({ children }) => (
      <ul className="list-disc pl-5 text-base text-slate-700 dark:text-zinc-300 leading-relaxed mb-3 flex flex-col gap-0.5">
        {children}
      </ul>
    ),

    ol: ({ children }) => (
      <ol className="list-decimal pl-5 text-base text-slate-700 dark:text-zinc-300 leading-relaxed mb-3 flex flex-col gap-0.5">
        {children}
      </ol>
    ),

    li: ({ children }) => <li className="leading-relaxed">{children}</li>,

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-slate-200 dark:border-zinc-700 pl-4 text-slate-500 dark:text-zinc-400 italic mb-3 [&>p]:mb-0">
        {children}
      </blockquote>
    ),

    code: ({ children }) => (
      <code className="font-mono text-sm bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-slate-700 dark:text-zinc-300">
        {children}
      </code>
    ),

    pre: ({ children }) => (
      <pre className="bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-700/50 rounded-lg p-4 overflow-x-auto mb-4 text-sm font-mono leading-relaxed text-slate-700 dark:text-zinc-300">
        {children}
      </pre>
    ),

    table: ({ children }) => (
      <div className="overflow-x-auto mb-5 rounded-lg border border-slate-200 dark:border-zinc-700/60">
        <table className="w-full text-base border-collapse">{children}</table>
      </div>
    ),

    thead: ({ children }) => (
      <thead className="bg-slate-50 dark:bg-zinc-800">{children}</thead>
    ),

    tr: ({ children }) => <tr>{children}</tr>,

    th: ({ children }) => (
      <th className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="text-sm text-slate-700 dark:text-zinc-300 px-3 py-2.5 border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0 [tr:last-child_&]:border-b-0">
        {children}
      </td>
    ),

    hr: () => <hr className="border-slate-200 dark:border-zinc-800 my-7" />,

    a: ({ href, children }) => (
      <a
        href={href}
        className="text-blue-700 dark:text-blue-400 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  }
}

// ─── H2 with section anchor ───────────────────────────────────────────────────

function H2WithAnchor({ children, artifactId, versionId }: {
  children:   React.ReactNode
  artifactId: string
  versionId:  string
}) {
  const [copied, setCopied] = useState(false)
  const slug = slugify(extractText(children))

  function copyLink() {
    const base = window.location.href.split('?')[0]
    const url  = `${base}?artifact=${artifactId}&version=${versionId}&section=${slug}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1_500)
    })
  }

  return (
    <h2
      id={slug}
      className="group flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-zinc-50 mt-7 mb-3"
    >
      <span>{children}</span>
      <button
        type="button"
        onClick={copyLink}
        title={copied ? 'Copied!' : 'Copy link to section'}
        className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
      >
        <Link2 className={`w-3.5 h-3.5 ${
          copied
            ? 'text-emerald-500'
            : 'text-slate-400 dark:text-zinc-500 hover:text-slate-500 dark:hover:text-zinc-400'
        }`} />
      </button>
    </h2>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractText(node: React.ReactNode): string {
  if (typeof node === 'string')  return node
  if (typeof node === 'number')  return String(node)
  if (Array.isArray(node))       return node.map(extractText).join('')
  if (React.isValidElement(node)) {
    const p = node.props as { children?: React.ReactNode }
    return extractText(p.children)
  }
  return ''
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function KindBadge({ kind }: { kind: ArtifactKind }) {
  return (
    <span className="text-sm font-medium px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
      {ARTIFACT_KIND_LABELS[kind]}
    </span>
  )
}

function Dot() {
  return <span className="text-sm text-slate-300 dark:text-zinc-600" aria-hidden>·</span>
}
