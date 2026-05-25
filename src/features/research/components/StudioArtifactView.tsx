import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, ChevronDown, Check, Link2, FileText, Braces, Printer } from 'lucide-react'

import type { Project, Task, Artifact, ArtifactVersion } from '../types'
import { ARTIFACT_KIND_LABELS } from '../types'
import ArtifactTab from './ArtifactTab'
import SourcesTab from './SourcesTab'
import TraceTab from './TraceTab'
import TabBar from '../../../components/ui/TabBar'

// ─── Types ────────────────────────────────────────────────────────────────────

export type Tab = 'artifact' | 'sources' | 'trace'

const TABS: { value: Tab; label: string }[] = [
  { value: 'artifact', label: 'Artifact' },
  { value: 'sources',  label: 'Sources'  },
  { value: 'trace',    label: 'Trace'    },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface StudioArtifactViewProps {
  project:        Project
  task:           Task
  requestedTab?:  Tab | null
  onTabConsumed?: () => void
}

export default function StudioArtifactView({ project, task, requestedTab, onTabConsumed }: StudioArtifactViewProps) {
  const [searchParams] = useSearchParams()

  // Default to the artifact produced by this task
  const defaultArtifact =
    project.artifacts.find(a => a.versions.some(v => v.taskId === task.id)) ??
    project.artifacts[0] ??
    null

  // Initialise from URL params (share links), validated against actual data
  const [selectedArtifactId,  setSelectedArtifactId]  = useState<string | null>(() => {
    const id = searchParams.get('artifact')
    return id && project.artifacts.some(a => a.id === id) ? id : defaultArtifact?.id ?? null
  })
  const [selectedVersionId,   setSelectedVersionId]   = useState<string | null>(
    () => searchParams.get('version'),
  )
  const [tabPerArtifact,      setTabPerArtifact]      = useState<Record<string, Tab>>({})
  const [artifactMenuOpen,    setArtifactMenuOpen]    = useState(false)
  const [exportMenuOpen,      setExportMenuOpen]      = useState(false)

  const artifact = project.artifacts.find(a => a.id === selectedArtifactId) ?? defaultArtifact

  // Resolve displayed version: explicit selection → current version → first version
  const version: ArtifactVersion | null =
    (selectedVersionId
      ? artifact?.versions.find(v => v.id === selectedVersionId)
      : artifact?.versions.find(v => v.id === artifact?.currentVersionId) ??
        artifact?.versions[0]) ?? null

  const isOldVersion =
    selectedVersionId !== null &&
    artifact !== null &&
    selectedVersionId !== artifact.currentVersionId

  const sortedVersions = artifact
    ? [...artifact.versions].sort((a, b) => a.versionNumber - b.versionNumber)
    : []

  const versionTask = version
    ? (project.tasks.find(t => t.id === version.taskId) ?? task)
    : task
  const sources = versionTask.sources

  const activeTab = tabPerArtifact[artifact?.id ?? ''] ?? 'artifact'

  function setActiveTab(tab: Tab) {
    const key = artifact?.id ?? ''
    setTabPerArtifact(prev => ({ ...prev, [key]: tab }))
  }

  // Consume a tab switch requested by the parent (e.g. "View trace →" in ActivityPanel)
  const tabRequestConsumedRef = useRef(false)
  useEffect(() => {
    if (!requestedTab || !artifact || tabRequestConsumedRef.current) return
    setTabPerArtifact(prev => ({ ...prev, [artifact.id]: requestedTab }))
    onTabConsumed?.()
    tabRequestConsumedRef.current = true
  }, [requestedTab, artifact, onTabConsumed])

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleJumpToSection(slug: string) {
    setActiveTab('artifact')
    setTimeout(() => {
      document.getElementById(slug)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  function selectArtifact(id: string) {
    setSelectedArtifactId(id)
    setSelectedVersionId(null)
    setArtifactMenuOpen(false)
  }

  function selectVersion(id: string) {
    const isCurrent = id === artifact?.currentVersionId
    setSelectedVersionId(isCurrent ? null : id)
  }

  function filenameBase() {
    if (!artifact || !version) return 'artifact'
    const slug = artifact.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    const date = version.createdAt.slice(0, 10)
    return `${slug}-v${version.versionNumber}-${date}`
  }

  function handleExportMd() {
    if (!artifact || !version) return
    const blob = new Blob([version.content], { type: 'text/markdown;charset=utf-8' })
    triggerDownload(blob, `${filenameBase()}.md`)
  }

  function handleExportJson() {
    if (!artifact || !version) return
    const data = {
      artifact: { id: artifact.id, title: artifact.title, kind: artifact.kind, createdAt: artifact.createdAt },
      version:  { id: version.id, versionNumber: version.versionNumber, wordCount: version.wordCount, createdAt: version.createdAt, content: version.content },
      sources:  versionTask.sources,
      trace:    versionTask.trace,
      metadata: { exportedAt: new Date().toISOString(), exportedBy: 'Pulse 2.0' },
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    triggerDownload(blob, `${filenameBase()}.json`)
  }

  function handlePrint() {
    if (!artifact || !version) return
    const title   = artifact.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')
    const content = JSON.stringify(version.content)
    const w = window.open('', '_blank')
    if (!w) return
    w.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><title>${title}</title>
<script src="https://cdn.jsdelivr.net/npm/marked@14/marked.min.js"></script>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,-apple-system,sans-serif;max-width:760px;margin:48px auto;padding:0 24px;color:#1e293b;font-size:14px;line-height:1.6}
h1{font-size:22px;font-weight:700;margin-bottom:24px;color:#0f172a}
h2{font-size:16px;font-weight:600;margin:28px 0 10px;color:#0f172a}
h3{font-size:13px;font-weight:600;margin:18px 0 6px;color:#0f172a}
p{margin-bottom:12px}ul,ol{padding-left:20px;margin-bottom:12px}li{margin-bottom:4px}
strong{font-weight:600}em{font-style:italic}
blockquote{border-left:3px solid #cbd5e1;padding:2px 12px;color:#64748b;margin:12px 0;font-style:italic}
code{font-family:monospace;background:#f1f5f9;padding:1px 5px;border-radius:3px;font-size:12px}
pre{background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:14px;overflow-x:auto;margin-bottom:16px}
pre code{background:none;padding:0}
table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:13px}
thead{background:#f8fafc}
th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.04em;font-weight:600;color:#64748b;padding:10px 12px;border-bottom:1px solid #e2e8f0}
td{padding:10px 12px;border-bottom:1px solid #f1f5f9}
hr{border:none;border-top:1px solid #e2e8f0;margin:28px 0}
@media print{body{margin:0}}
</style>
</head>
<body>
<h1>${title}</h1>
<div id="body"></div>
<script>
document.getElementById('body').innerHTML=marked.parse(${content});
setTimeout(function(){window.print()},400);
</script>
</body>
</html>`)
    w.document.close()
  }

  return (
    <div className="flex flex-col min-h-full">

      {/* ── Done-state header ────────────────────────────────────────── */}
      <div className="h-11 shrink-0 flex items-center gap-2 px-3 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-10">

        {/* Artifact selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => project.artifacts.length > 1 && setArtifactMenuOpen(v => !v)}
            className={`flex items-center gap-1 max-w-45 ${
              project.artifacts.length > 1
                ? 'cursor-pointer hover:text-slate-900 dark:hover:text-zinc-100'
                : 'cursor-default'
            }`}
          >
            <span className="text-sm font-medium text-slate-700 dark:text-zinc-200 truncate">
              {artifact?.title ?? 'Artifact'}
            </span>
            {project.artifacts.length > 1 && (
              <ChevronDown className="w-3 h-3 text-slate-500 dark:text-zinc-400 shrink-0" />
            )}
          </button>

          {artifactMenuOpen && (
            <ArtifactMenu
              artifacts={project.artifacts}
              selectedId={artifact?.id ?? null}
              onSelect={selectArtifact}
              onClose={() => setArtifactMenuOpen(false)}
            />
          )}
        </div>

        {/* Version chips */}
        {sortedVersions.length > 0 && (
          <div className="flex items-center gap-0.5 shrink-0">
            {sortedVersions.map(v => {
              const isActive = v.id === (selectedVersionId ?? artifact?.currentVersionId)
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => selectVersion(v.id)}
                  className={`px-1.5 py-0.5 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200'
                      : 'text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300'
                  }`}
                >
                  v{v.versionNumber}
                </button>
              )
            })}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* Tab strip */}
        <TabBar
          options={TABS}
          value={activeTab}
          onChange={v => setActiveTab(v as Tab)}
        />

        {/* Share */}
        <SharePopover artifact={artifact ?? null} version={version} />

        {/* Export dropdown */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setExportMenuOpen(v => !v)}
            disabled={!version}
            title="Export"
            className="flex items-center gap-0.5 p-1 text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300 disabled:opacity-30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <ChevronDown className="w-3 h-3" />
          </button>

          {exportMenuOpen && (
            <ExportMenu
              onMarkdown={() => { handleExportMd();  setExportMenuOpen(false) }}
              onJson={     () => { handleExportJson(); setExportMenuOpen(false) }}
              onPrint={    () => { handlePrint();      setExportMenuOpen(false) }}
              onClose={    () => setExportMenuOpen(false)}
            />
          )}
        </div>

      </div>

      {/* ── Old-version banner ───────────────────────────────────────── */}
      {isOldVersion && (
        <div className="shrink-0 flex items-center gap-3 px-5 py-2 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/30">
          <span className="text-sm text-amber-700 dark:text-amber-400">
            Viewing v{version?.versionNumber} — this is not the current version.
          </span>
          <button
            type="button"
            onClick={() => setSelectedVersionId(null)}
            className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:underline"
          >
            Back to current →
          </button>
        </div>
      )}

      {/* ── Tab body ─────────────────────────────────────────────────── */}
      <div className="flex-1">
        {activeTab === 'artifact' && (
          <ArtifactTab artifact={artifact} version={version} />
        )}
        {activeTab === 'sources' && (
          <SourcesTab sources={sources} />
        )}
        {activeTab === 'trace' && (
          <TraceTab task={versionTask} onJumpToSection={handleJumpToSection} />
        )}
      </div>

    </div>
  )
}

// ─── Export dropdown menu ─────────────────────────────────────────────────────

function ExportMenu({ onMarkdown, onJson, onPrint, onClose }: {
  onMarkdown: () => void
  onJson:     () => void
  onPrint:    () => void
  onClose:    () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-1.5 w-52 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 py-1 overflow-hidden"
    >
      <ExportItem icon={<FileText className="w-3.5 h-3.5" />} label="Download Markdown" onClick={onMarkdown} />
      <ExportItem icon={<Braces   className="w-3.5 h-3.5" />} label="Download JSON"     onClick={onJson} />
      <div className="my-1 border-t border-slate-100 dark:border-zinc-800" />
      <ExportItem icon={<Printer  className="w-3.5 h-3.5" />} label="Print / Save as PDF" onClick={onPrint} />
    </div>
  )
}

function ExportItem({ icon, label, onClick }: {
  icon:    React.ReactNode
  label:   string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors"
    >
      <span className="text-slate-500 dark:text-zinc-400 shrink-0">{icon}</span>
      {label}
    </button>
  )
}

// ─── Artifact dropdown menu ───────────────────────────────────────────────────

function ArtifactMenu({ artifacts, selectedId, onSelect, onClose }: {
  artifacts:  Artifact[]
  selectedId: string | null
  onSelect:   (id: string) => void
  onClose:    () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 mt-1.5 w-72 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 py-1 overflow-hidden"
    >
      {artifacts.map(a => {
        const latestVersion = [...a.versions].sort((x, y) => y.versionNumber - x.versionNumber)[0]
        const latestDate    = latestVersion?.createdAt.slice(0, 10) ?? ''
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => onSelect(a.id)}
            className={`w-full flex items-start gap-2 px-3 py-2.5 text-left transition-colors ${
              a.id === selectedId
                ? 'bg-blue-50/60 dark:bg-blue-950/20'
                : 'hover:bg-slate-50 dark:hover:bg-zinc-800'
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-zinc-100 truncate">
                {a.title}
              </p>
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">
                {ARTIFACT_KIND_LABELS[a.kind]}
                {' · '}
                {a.versions.length} {a.versions.length === 1 ? 'version' : 'versions'}
                {latestDate && ` · ${latestDate}`}
              </p>
            </div>
            {a.id === selectedId && (
              <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── Share popover ────────────────────────────────────────────────────────────

type ExpiryOption = '7d' | '30d' | '90d' | 'never'
const EXPIRY_OPTIONS: { value: ExpiryOption; label: string }[] = [
  { value: '7d',    label: '7d'   },
  { value: '30d',   label: '30d'  },
  { value: '90d',   label: '90d'  },
  { value: 'never', label: 'Never' },
]

function SharePopover({ artifact, version }: { artifact: Artifact | null; version: ArtifactVersion | null }) {
  const [open,   setOpen]   = useState(false)
  const [copied, setCopied] = useState(false)
  const [expiry, setExpiry] = useState<ExpiryOption>('30d')
  const ref = useRef<HTMLDivElement>(null)

  const url = artifact && version
    ? `${window.location.origin}${window.location.pathname}?artifact=${artifact.id}&version=${version.id}`
    : ''

  useEffect(() => {
    if (!open) return
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  function handleCopy() {
    if (!url) return
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1_500)
    })
  }

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        disabled={!artifact || !version}
        title="Share"
        aria-label="Share"
        className={`p-1 disabled:opacity-30 transition-colors ${
          open
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-500 dark:text-zinc-400 hover:text-slate-600 dark:hover:text-zinc-300'
        }`}
      >
        <Link2 className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1.5 w-72 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 p-3 flex flex-col gap-3">

          {/* URL row */}
          <div className="flex items-stretch gap-1.5">
            <input
              type="text"
              readOnly
              value={url}
              onFocus={e => e.target.select()}
              className="flex-1 min-w-0 text-sm bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded px-2 py-1.5 text-slate-600 dark:text-zinc-300 outline-none truncate"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors whitespace-nowrap"
            >
              {copied ? <><Check className="w-3 h-3" />Copied</> : 'Copy'}
            </button>
          </div>

          {/* Expiry row */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
              Link expires
            </span>
            <div className="flex gap-1.5">
              {EXPIRY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setExpiry(opt.value)}
                  className={`flex-1 px-2 py-1 rounded text-sm font-medium border transition-colors ${
                    expiry === opt.value
                      ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40 text-blue-700 dark:text-blue-400'
                      : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-zinc-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a   = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}
