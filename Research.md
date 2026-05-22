# Research — feature specification (v2)

---

## 1. Summary

Research is an intelligence and decisioning workspace that lets a user dispatch a research prompt as a background job and walk away. The agent decomposes the request, gathers and reads sources (internal knowledge base, the open web, or both), and produces a structured artifact. The user can come back at any time to read the result, inspect how the agent reached it, follow up with refinements, and explore the knowledge graph built up across all artifacts in the project.

The product's defining property is **fire-and-forget by default, with opt-in Pre-Launch review for users who want oversight before the agent commits to a plan.**

---

## 2. Mental model

The unit of work is the **task**: one prompt that produces one artifact. Tasks are grouped into **projects**, which are containers for related research. Inside a project, all tasks share the same sources setting and accumulate into the same knowledge graph. Every task is asynchronous. The user never waits in a synchronous chat.

---

## 3. Vocabulary

| Term | Meaning |
|---|---|
| Research | The feature name. The intelligence and decisioning workspace. |
| Project | A container for related research. Has a title, sources setting, activity log, and one or more artifacts. |
| Workspace | The home view. Shows all projects. |
| Studio | The right-hand panel inside a project. Shows artifacts, sources, and trace. |
| Activity | The left-hand chronological log of tasks inside a project. |
| Task | One user prompt, executed as one async job. |
| Phase | A state in the task lifecycle (Queued, Planning, Pre-Launch, Executing, Done, Failed, Canceled). |
| Artifact | The structured output of a task (report, analysis, brief, table, summary). |
| Version | A revision of an artifact, produced by a follow-up task. |
| Trace | The agent's recorded reasoning for a task: plan, steps, sources, decisions. Always produced. |
| Sources | Which sources a task is allowed to use. Set per project. |
| Pre-Launch | The optional gate between Planning and Executing. Behavior depends on the mode selected. |
| Add Source | A user action that injects a specific URL, file, or KB document into a task's source pool. |
| Section | A top-level content block within an artifact, delimited by an H2 heading. |

---

## 4. Sources — the four modes

Each project is configured with a sources mode.

| Mode | What it uses |
|---|---|
| Sweep | Knowledge base across all the user's projects. Broad internal pull. |
| Focus | Knowledge base scoped to the current project only. |
| Discover | Open web only. No knowledge base. |
| Deep Dive | Knowledge base + open web. Most comprehensive and most expensive. |

The UI presents Sources as two independent toggles (Knowledge base / Web) with a sub-toggle under Knowledge base for "this project only." The four named modes are derived from the toggle combinations. To search wider than the current mode allows, the user re-dispatches with a different Sources mode selected.

---

## 5. Pre-Launch — the three modes

Pre-Launch controls what happens after the agent has produced its plan but before it begins expensive retrieval work.

| Mode | Behavior |
|---|---|
| Auto | Plan is recorded into the trace and execution begins immediately. User never sees the gate. True fire-and-forget. |
| Quick Check | Plan is shown with a 20-second countdown. If the user does nothing, execution auto-launches. If present, they can review, edit, add sources, launch early, or cancel. |
| Confirm | Plan is shown and the task halts indefinitely. Execution does not begin until the user explicitly approves. |

The 20-second countdown is fixed in v1 and not user-configurable.

### Default hierarchy (highest wins)

1. Per-task override — "Review before launch" toggle on Dispatch forces Confirm for one task only.
2. Per-project lock — set in project settings, forces a mode for all tasks in the project.
3. Per-sources default — Deep Dive and Discover default to Quick Check; Sweep and Focus default to Auto.
4. Global default — set in user preferences. Default out of the box: Auto.

---

## 6. Task lifecycle

```
Queued → Planning → Pre-Launch → Executing → Done
                         |                    |
                      Canceled             Failed
```

**Queued** — Task dispatched, awaiting a worker. Typically under 2 seconds.

**Planning** — Agent decomposes the prompt into sub-questions (max 6), selects sources, and drafts a strategy. Always runs. Always emits into the trace. Duration: 5–30 seconds.

**Pre-Launch** — Plan is ready. Behavior is determined by the active Pre-Launch mode. In Auto, instantaneous. In Quick Check and Confirm, the Pre-Launch panel surfaces to the user.

**Executing** — Agent retrieves, reads, and synthesizes. Trace events stream live via SSE. Duration: 1–15 minutes.

**Done** — Artifact persisted, trace finalized, source list locked, knowledge graph updated asynchronously within 60 seconds.

**Failed** — Error and reason persisted. Task is retryable. See section 15.

**Canceled** — User canceled the task at Pre-Launch. No artifact is produced.

---

## 7. Permissions and access (v1)

v1 is **single-user only**. Projects are private to the account that created them. No team sharing, no collaboration, no multi-user access in v1. Use a `created_by` field on all records to avoid blocking v2 multi-user work.

### Artifact share links
A user can generate a read-only share link for any artifact version. The link is publicly accessible (no login required) and renders the artifact content and source list only. The trace is not exposed. Share links can be revoked at any time. Default expiry: 30 days. User can set a custom expiry or make the link permanent.

### v2 (out of scope)
Team workspaces, project sharing with roles (viewer / editor / admin), collaborative dispatch.

---

## 8. Settings and preferences

Accessible from the account menu. Relevant settings:

| Setting | Type | Default | Notes |
|---|---|---|---|
| Default Pre-Launch mode | Select | Auto | Applied when no higher-priority default overrides. |
| Default sources mode | Select | Sweep | Pre-selected when creating a new project. |
| Show cost estimate | Toggle | On | Shows estimated API cost in Pre-Launch panel for web-sourced tasks. |
| Notify: task completed | Toggle | On | In-app notification when a task reaches Done. |
| Notify: task failed | Toggle | On | In-app notification when a task reaches Failed. |
| Notify: awaiting review | Toggle | On | In-app notification when a Confirm-mode task reaches Pre-Launch. |
| Email digest | Toggle | Off | Daily summary of completed and failed tasks. |

---

## 9. Real-time events — SSE protocol

All real-time updates are delivered via Server-Sent Events on a per-task connection. The client subscribes when a task is in view. Events are persisted server-side so a reconnecting client can replay missed events from the last received sequence number.

### Connection
```
GET /api/tasks/{task_id}/stream
Headers: Accept: text/event-stream
```

### Event envelope
```json
{
  "event": "event.name",
  "seq": 42,
  "timestamp": "2026-05-18T10:23:00Z",
  "payload": { }
}
```

### Event definitions

**task.phase_changed**
```json
{ "task_id": "uuid", "phase": "executing", "previous_phase": "pre_launch" }
```

**trace.step_started**
```json
{
  "task_id": "uuid",
  "step": {
    "id": "uuid",
    "type": "search_web",
    "inputs": { "queries": ["fintech pricing SEA 2026"], "max_results": 40 }
  }
}
```

**trace.step_progress**
```json
{
  "task_id": "uuid",
  "step_id": "uuid",
  "progress": { "current": 23, "total": 40, "label": "Reading source 23 of 40" }
}
```

**trace.step_completed**
```json
{
  "task_id": "uuid",
  "step": {
    "id": "uuid",
    "type": "search_web",
    "outputs": { "sources_retrieved": 40, "sources_kept": 14, "sources_discarded": 26 },
    "reasoning": "Discarded 12 paywalled sources and 14 with low relevance scores.",
    "duration_ms": 18400
  }
}
```

**trace.conflict_detected**
```json
{
  "task_id": "uuid",
  "step_id": "uuid",
  "conflict": {
    "claim_a": { "source_id": "uuid", "text": "GrabPay charges 0.7%" },
    "claim_b": { "source_id": "uuid", "text": "GrabPay charges 1.2%" },
    "resolution": "Using 0.7% — official rate card dated Mar 2026, newer than secondary source."
  }
}
```

**task.completed**
```json
{ "task_id": "uuid", "artifact_id": "uuid", "artifact_version_id": "uuid", "duration_ms": 241000 }
```

**task.failed**
```json
{ "task_id": "uuid", "reason": "All web queries returned zero usable results.", "step_id": "uuid", "retryable": true }
```

---

## 10. Agent orchestrator

### Model
Claude Sonnet (latest available at deployment time). Upgradable without a spec change.

### Planning
Produces a structured plan: max 6 sub-questions, max 8 web queries, a list of KB queries, and a plain-language synthesis strategy.

### Execution constraints

| Parameter | Limit |
|---|---|
| Max web queries | 8 per task |
| Max web results fetched | 40 per task |
| Max web sources read in full | 20 per task |
| Max KB documents retrieved | 50 per task |
| Max KB documents read in full | 20 per task |
| Max total tokens (input + output) | 200,000 per task |
| Max artifact length | 6,000 words |
| Max trace steps | 20 |
| Max task duration | 15 minutes |
| Per-step timeout | 3 minutes |

### Retry logic
Transient failures (network errors, rate limits, HTTP 5xx) retry up to 2 times with exponential backoff (2s, 8s). Persistent failures transition the task to Failed.

### Artifact structure
Artifacts are produced in Markdown. Top-level sections are delimited by H2 headings. Each section is assigned a stable slug-based ID at generation time (e.g. `executive-summary`, `pricing-matrix`). These IDs are used by the Update artifact flow to target specific sections for regeneration.

### Update artifact — part-by-part regeneration
When a follow-up task runs in Update artifact mode:
1. Agent receives the follow-up prompt, the full existing artifact with section IDs, and the prior trace.
2. Agent identifies which section IDs are affected by the prompt.
3. Only affected sections are regenerated. Unaffected sections are carried through verbatim.
4. The output is a complete artifact document, not a diff. The frontend does not need to merge.

---

## 11. User journey by screen

### 11.1 Workspace — default state

- **Dispatcher (top):** Multi-line prompt input (max 2,000 chars), sources mode selector, Dispatch button, and a "Review before launch" toggle. The toggle forces Confirm for the next dispatch only and resets after use.
- **Project list (below):** Cards sorted by most recently updated. Each shows: project title, most recent task status, sources mode, relative timestamp. Filter chips: All · Executing · Done · Failed · Awaiting review. Status badges update via polling every 10 seconds while Workspace is in view.

### 11.2 Workspace — empty state

No projects exist yet. Dispatcher is prominent and centered. Three example prompt chips shown below the dispatcher that pre-fill the input on click. No project list shown.

### 11.3 Project view — Research tab (task running)

Two-column layout: Activity (left), Studio (right).

**Activity:** Vertical stack of task cards, newest at bottom. Each card shows: prompt (truncated to 3 lines, expandable), current phase badge with detail (e.g. "Executing · step 3 of 6 · 2m elapsed"), artifact title pill and "View trace" link once complete. Below all cards: the follow-up input, collapsed by default.

**Studio:** While any task is in Planning or Executing, Studio shows the Live Trace by default. Once the first task completes, Studio switches to Artifact view. Trace is one tab away.

### 11.4 Project view — empty state

No tasks exist yet. Activity shows: "No tasks yet. Dispatch your first prompt below." Studio shows: "Your artifact will appear here." Follow-up input is expanded by default.

### 11.5 Pre-Launch panel

Shown in Studio when a task is in Pre-Launch under Quick Check or Confirm mode.

**Content sections:**
1. Sub-questions — max 6, the questions the agent will answer.
2. Sources I'll use — KB document names with match count; web query strings with estimated result count, duration, and cost (if cost estimate is enabled in settings).
3. Plan — one paragraph describing the synthesis approach.

**Actions:**
- Add Source — opens the Add Source modal.
- Edit plan — makes sub-questions and source list inline-editable. Changes are recorded in the trace as "user-modified plan."
- Launch now — skips countdown, proceeds to Executing immediately.
- Cancel — transitions task to Canceled. Cannot be undone.

In Quick Check mode: a countdown badge shows in the corner. At 0, task auto-launches.
In Confirm mode: no countdown. Task waits until user acts.

### 11.6 Project view — Research tab (task complete)

**Studio header:** Artifact selector dropdown (if project has more than one artifact), version chips (v1, v2...), Studio tabs (Artifact · Sources · Trace), export icon.

**Artifact tab:** Rendered Markdown. Each H2 section has a hover anchor link. Hovering any paragraph shows a trace icon; clicking it highlights the trace step that generated that section.

**Sources tab:** Full source list with title, URL or KB path, kept/discarded status, relevance score, and discard reason. Sortable by relevance. Filterable by kind (KB / Web / User-added).

**Trace tab:** See section 12.

### 11.7 Follow-up tasks

When dispatching from within a project, the user picks an intent:

- **Update artifact** — targets the currently-selected artifact, produces a new version, performs delta work only.
- **New artifact** — produces a sibling artifact with its own version history.

Intent is inferred from the prompt (modifying language → Update artifact; otherwise → New artifact). A toggle chip is always visible so the user can override before dispatching.

### 11.8 Graph tab

Force-directed knowledge graph canvas. Nodes are entities, edges are relationships. Node color encodes entity type. Node size scales with connection count. Solid edges = explicit relationships. Dashed edges = co-occurrence.

Filter panel: toggle entity types, full-text search by entity name, filter by source task or artifact.

Entity detail panel (on node click): canonical name, aliases, type, connection count, mention count, source list, and a deep link to the relevant source in Studio.

**Empty state:** "The knowledge graph builds as you complete tasks. Run your first task to get started." Canvas is not shown until at least one task has completed.

---

## 12. Studio panel — detailed spec

### 12.1 Layout

The Studio occupies the right column of the project view at approximately 58% of the available width. Activity takes the remaining 42%. Not resizable in v1.

Two zones:
- **Studio header** — sticky, always visible regardless of scroll position.
- **Studio body** — scrollable, renders the content of the current tab or panel.

### 12.2 States

The Studio renders differently depending on the current task phase.

| Task phase | Studio shows |
|---|---|
| No tasks yet | Empty state placeholder |
| Queued | Live Trace — "Waiting to start..." |
| Planning | Live Trace — planning step in progress |
| Pre-Launch | Pre-Launch panel (replaces tab structure entirely) |
| Executing | Live Trace with active steps streaming |
| Done | Artifact tab by default, full tab structure visible |
| Failed | Failed state message in body, tab structure hidden |
| Canceled | Canceled state message in body, tab structure hidden |

### 12.3 Studio header

The header is sticky and its contents vary by state.

**When no artifact exists (Queued / Planning / Executing):**
- "Studio" label on the left
- Current task phase badge on the right
- No tabs, no version selector, no artifact selector

**When Pre-Launch is active:**
- "Pre-Launch review" label
- Countdown badge in Quick Check mode (e.g. "Launching in 14s")
- No tabs, no version selector

**When an artifact exists (Done state, or viewing a prior completed task):**
- Left: Artifact selector dropdown — shows the title of the currently displayed artifact with a chevron
- Center: Version chips — v1, v2, v3... Current version is pre-selected and highlighted
- Right: Tab strip (Artifact · Sources · Trace), Export icon, Share icon

Tab state is persisted per artifact. If the user was on the Sources tab when they navigated away, Sources is shown when they return to the same artifact.

### 12.4 Artifact selector

A dropdown listing all artifacts in the current project. Each item shows:
- Artifact title
- Kind badge (Report / Analysis / Brief / Table / Summary)
- Number of versions (e.g. "3 versions")
- Date of most recent version

Selecting an artifact loads its current (latest) version into the Studio body and resets the version selector to the latest version.

### 12.5 Version selector

Shows all versions of the currently selected artifact as chips (v1, v2, v3...).

Clicking an older version loads that version in read-only mode. A banner appears below the Studio header: "Viewing v1 — this is not the current version. [Back to current →]"

The current version is never read-only and has no banner.

### 12.6 Artifact tab

Renders the artifact's Markdown content.

**Header area (above the body):**
- Artifact title — editable inline on click, max 80 characters. Saving does not create a new version.
- Below title: kind badge, word count, version label, creation timestamp.

**Body rendering:**
- Standard Markdown: headings, paragraphs, bold, italic, tables, ordered and unordered lists, blockquotes, inline code.
- No raw HTML in artifacts.
- Tables that exceed the Studio width scroll horizontally within their container.
- Code blocks use a monospaced font. No syntax highlighting in v1.

**Section anchors:**
- Each H2 heading shows a subtle link icon on hover.
- Clicking the icon copies a deep link to the clipboard.
- Link format: `/projects/{project_id}?artifact={artifact_id}&version={version_id}&section={section_slug}`

**Paragraph-to-trace linking:**
- Hovering any paragraph or table row shows a small "↗" icon in the right margin.
- Clicking jumps to the Trace tab and highlights the step that generated that content.
- Each paragraph and section carries a `trace_step_id` written at generation time.
- For paragraphs carried unchanged from a prior version (Update artifact), the link points to the original version's trace step.

**Text selection toolbar:**
A small floating toolbar appears on text selection. Options: Copy, Copy as Markdown.

### 12.7 Sources tab

Shows all sources evaluated by the agent for the currently viewed task version.

**Tab header:**
Source count summary: "X sources · Y kept · Z discarded"

**Filter chips (above the table):**
All · Kept · Discarded · KB · Web · User-added
Multiple chips can be active simultaneously.

**Sort controls:**
Sortable by Relevance (default, descending), Kind, Status. One sort active at a time.

**Table columns:**

| Column | Description |
|---|---|
| # | Row number |
| Title | Page title (web) or document name (KB) |
| Kind | KB / Web / User-added badge |
| Status | Kept (green badge) or Discarded (gray badge) |
| Relevance | Score 0–100, shown as a number and a thin fill bar |
| Reason | Discard reason if discarded; blank if kept |

**Row click — inline detail panel:**
Expands below the row without navigating away. Shows:
- Full URL or KB document path (linked)
- Short excerpt: the most relevant passage the agent extracted from this source
- Which trace step read this source (links to that step in the Trace tab)
- Which artifact sections this source contributed to (links to each section in the Artifact tab) — shown for kept sources only

### 12.8 Trace tab

Shows the full reasoning record for the currently viewed task version.

**Header:**
- Task goal in a bordered quote block
- Total task duration, total step count, total sources evaluated

**Step list:**
One card per step, in execution order.

**Step card — collapsed:**
- Status icon: ✓ complete, spinner running, ⚠ conflict, ✗ failed, — skipped
- Step number and type (e.g. "3 · Search web")
- One-line summary (e.g. "40 results retrieved · 14 kept · 26 discarded")
- Duration in seconds
- Subtle horizontal bar showing this step's proportion of total task time

**Step card — expanded (on click):**
- All collapsed content
- Inputs block: sub-questions, query strings, or source IDs rendered as a readable list
- Outputs block: sources kept with relevance scores, sources discarded with reasons, or drafted content
- Reasoning block: shown in a quote-style callout if the agent stated a reason for a decision
- "Edited by you" badge if the user modified this step in Pre-Launch
- Source links: each referenced source links to its row in the Sources tab

**Special step types:**

Conflict step — highlighted in amber:
- Shows both conflicting claims side by side with their source references
- Shows the resolution and the stated reason
- Always starts expanded when the Trace tab is first opened for a task that had a conflict

Emit step — the final artifact output step:
- Lists all artifact section titles that were produced
- Each section title is a link that jumps to that section in the Artifact tab

**Footer:**
Total wall-clock duration and a link to download the trace as JSON.

### 12.9 Live Trace (during Executing)

The Live Trace is distinct from the Trace tab. It is shown in the Studio body during Planning and Executing. The tab structure (Artifact · Sources · Trace) does not appear until the task reaches Done.

**Layout:**
- "Agent is working..." label with a spinner and elapsed time counter, updated every second
- Step list below, same card format as the Trace tab but live:
  - Completed steps: collapsed with their one-line summary
  - Currently running step: expanded by default and updates in real-time as progress events arrive
  - Pending steps: shown in a muted style with step number and type only, no summary yet

**Transition on Done:**
The Live Trace replaces itself with the full Studio tab structure (Artifact tab active by default) the moment the `task.completed` SSE event is received. No page reload.

### 12.10 Export

Triggered by the export icon in the Studio header. Opens a small dropdown (not a modal).

Options:
- Export as Markdown (.md)
- Export as PDF
- Export as JSON

Selecting triggers an immediate browser download. No confirmation dialog.

File naming: `[artifact-title-slugified]-v[version]-[YYYY-MM-DD].[ext]`

Example: `sea-fintech-pricing-comparison-v2-2026-05-18.pdf`

| Format | Contents |
|---|---|
| Markdown (.md) | Raw artifact content only. No metadata. |
| PDF | Artifact title, rendered content, source list as appendix, generation date. Trace not included. |
| JSON | Full artifact version record: content, section map, source list, trace steps. |

### 12.11 Share link

Triggered by the share icon in the Studio header. Visible only when the current task is in Done state.

Opens a small popover with:
- Share link shown as a read-only input with a copy button
- Expiry selector: 7 days · 30 days · 90 days · Never
- Revoke button (shown only if a share link already exists for this version)

Share links are **per artifact version**. A v1 link continues to serve v1 content even after v2 is produced. A new share link must be generated explicitly for v2.

The shared view renders: artifact title, content, and source list. It does not expose the trace, the version history, or any other project context.

---

## 13. Trace spec

### Data structure
```
trace
  id: uuid
  task_id: uuid
  goal: string
  status: enum [running, complete, failed]
  duration_ms: int
  steps: [
    {
      id: uuid
      type: enum [plan, search_kb, search_web, read, synthesize, conflict, emit]
      status: enum [running, complete, failed, skipped]
      started_at: timestamp
      duration_ms: int
      inputs: jsonb
      outputs: jsonb
      reasoning: text (nullable)
      user_modified: bool
    }
  ]
```

### Trace tab UI
Steps are shown as a vertical list. Each step has a status icon, type label, and one-line summary. Expanding a step shows full inputs, outputs, and reasoning. Conflict steps are highlighted in amber. User-modified steps show an "Edited by you" badge.

---

## 13. Add Source spec

### Accepted input types

| Type | Constraints |
|---|---|
| URL | Must be publicly accessible. Paywalled pages are flagged at read time, not at submission time. |
| File upload | Accepted: PDF, DOCX, TXT, MD, CSV. Max 10MB per file. Max 3 files per task. |
| KB document | Search and select from user's accessible KB. No per-task limit. |

### Availability

| Surface | When | Effect |
|---|---|---|
| Pre-Launch panel | Before execution | Added to the plan before retrieval begins. |
| Activity card (running) | While task is Executing | Triggers a sub-read job folded into current synthesis. Main task does not restart. |
| Activity card (done) | After task is Done | Creates a follow-up Update artifact task with the added source. User must dispatch explicitly. |

---

## 14. Artifact spec

### Format
All artifacts are produced and stored as Markdown. Rendered in Studio using a standard Markdown renderer supporting: headings, paragraphs, bold, italic, tables, ordered/unordered lists, blockquotes, inline code. Raw HTML within artifacts is not supported.

### Kinds

| Kind | When used |
|---|---|
| Report | Default. Long-form structured output with multiple sections. |
| Analysis | Focused, opinion-forward. Typically shorter than a report. |
| Brief | Executive summary. Max 500 words. No sub-sections. |
| Table | Structured comparison or data matrix. Minimal prose. |
| Summary | Condensed synthesis of a source set. |

Kind is inferred by the agent from the prompt. The user can override via a kind selector in the dispatcher before sending.

### Titles
Auto-generated by the agent at the end of synthesis. Sentence case, max 80 characters. User can rename at any time by clicking the title in Studio. Renaming does not create a new version.

### Versioning
- Numbered sequentially from v1.
- Each version is produced by exactly one task.
- Versions are immutable once produced.
- Only the current (highest-numbered) version can be the base for an Update artifact task.
- Old versions are fully readable with their own sources and trace.

### Export

| Format | Contents |
|---|---|
| Markdown (.md) | Raw artifact content only. |
| PDF | Title, rendered content, source list as appendix, generation date. Trace not included. |
| JSON | Full artifact version record: content, source list, trace. |

Share links expose artifact content and source list only. Trace and version history are not exposed.

---

## 15. Failure handling

Failed tasks are first-class items in the Activity log and are never hidden.

Each failed task card shows:
- Failed badge with plain-language reason.
- **Retry** — re-dispatches with identical parameters.
- **Modify and retry** — opens a pre-filled Pre-Launch panel for adjustment.

Partial successes (task completed but low source confidence) display as Done with a yellow caution badge and a banner on the artifact: "This result is based on limited sources. Consider adding sources or broadening the search scope."

---

## 16. Error states and edge cases

| Scenario | Behavior |
|---|---|
| KB returns zero results (KB-only mode) | Task fails: "No matching documents found in the knowledge base for this prompt." |
| KB returns zero results (Deep Dive mode) | Task continues with web sources only. Trace notes KB returned zero results. |
| All web results are paywalled | Task fails: "All retrieved web pages require authentication. Try adding sources manually or switching to a KB mode." |
| Add Source URL is paywalled | Source is added to plan. At read time, agent marks it unreadable and logs it in trace. Task continues with remaining sources. |
| Agent exceeds token budget | Synthesis truncated at current state. Artifact produced with banner: "This artifact was truncated due to length limits. Consider narrowing your prompt." |
| Task exceeds 15-minute timeout | Task fails: "This task took too long to complete. Try a more focused prompt or a narrower sources scope." |
| SSE connection lost mid-stream | Client retries every 5 seconds for up to 2 minutes. On reconnect, missed events are replayed from last received sequence number. If task has already completed, client fetches final state via REST. |
| User closes tab while task is running | Task continues on backend. User sees completed state on next visit. No data is lost. |
| Dispatch while offline | Dispatch button is disabled. Banner: "You're offline. Reconnect to dispatch tasks." |
| Add Source file type not accepted | Upload rejected immediately: "Only PDF, DOCX, TXT, MD, and CSV files are accepted." |
| Project queue full (5 tasks queued) | Dispatch rejected: "This project already has 5 tasks queued. Wait for one to complete before dispatching more." |

---

## 17. Knowledge graph

### Entity extraction
Runs as a separate background job triggered when a task reaches Done. Not blocking — artifact is available before extraction completes. Expected completion: under 60 seconds.

The job:
1. Parses the artifact and all kept sources.
2. Identifies entities: people, companies, concepts, geographies, dates, products.
3. Identifies explicit relationships between entities where stated in the text.
4. Identifies co-occurrences (same paragraph, no explicit relationship).
5. Merges new entities and edges into the project graph using canonical ID matching.

### Deduplication
Two-pass approach:
1. Exact match on canonical name (lowercased, punctuation stripped).
2. Model-based fuzzy match for aliases. Confidence threshold: 0.85. Below threshold, a new node is created.

Aliases are stored on the entity record and shown in the entity detail panel.

---

## 18. Concurrency and queuing

| Rule | Limit |
|---|---|
| Max concurrent tasks per user (across all projects) | 3 |
| Max concurrent tasks per project | 1 |
| Max queued tasks per project | 5 |
| Behavior when project queue is full | Dispatch is rejected with an error message. |

When a project has a running task and a new task is dispatched, the new task enters Queued and begins Planning only when the running task reaches Done or Failed.

---

## 19. Constraints and limits

| Item | Limit |
|---|---|
| Prompt length | 2,000 characters |
| Project title | 120 characters |
| Artifact title | 80 characters |
| Projects per user | 100 (soft limit) |
| Tasks per project | 200 |
| Artifact versions per artifact | 20 |
| Artifacts per project | 20 |
| File upload size | 10MB per file |
| File uploads per task | 3 |
| Artifact word count | 6,000 words |
| Share link default expiry | 30 days |

---

## 20. Notifications

### In-app
A notification bell in the global nav shows an unread count. Clicking it opens a panel showing the 50 most recent notifications. Each links to the relevant task or project.

| Type | Message |
|---|---|
| Awaiting review | "[Project title]: awaiting your review" |
| Task completed | "[Project title]: your artifact is ready" |
| Task failed | "[Project title]: task failed — [reason]" |

### Email
Optional daily digest of completed and failed tasks. Off by default. Configurable in settings.

---

## 21. Mobile and responsive

v1 is desktop-first. Minimum supported viewport: 1024px.

Below 1024px: Activity and Studio collapse to a single column. Activity shown by default. Studio accessible via a "View result" button that slides up as a bottom sheet. Dispatch is available.

Below 768px: Graph tab is hidden with the message: "The knowledge graph is available on desktop."

Read-only share links render fully on all viewport sizes with no restrictions.

Full mobile parity is a v2 item.

---

## 22. Implementation order

1. Data model + job queue. Stub agent emitting fake trace events. Prove the pipeline.
2. Workspace + dispatcher + Auto mode. End-to-end fire-and-forget loop with live trace via SSE.
3. Project view — running state. All SSE event types wired. Most important polish surface.
4. Project view — complete state. Artifact viewer, version selector, Sources tab, Trace tab, section-to-trace linking.
5. Pre-Launch panel and modes. Gate phase, panel UI, all three modes, defaults hierarchy, settings page.
6. Add Source. All three surfaces.
7. Real agent orchestrator. Swap stub for real planner-executor.
8. Update artifact (part-by-part regeneration). Requires real orchestrator.
9. Knowledge graph + Graph tab. Requires real artifact volume.
10. Share links, export, failure handling polish, notifications. Continuous from step 3.

---

## 23. Data model

```sql
project
  id                          uuid PK
  title                       varchar(120)
  sources_kb_bool             bool
  sources_web_bool            bool
  sources_project_only_bool   bool
  pre_launch_mode_default     enum('auto','quick_check','confirm')
  created_by                  uuid FK → users.id
  created_at                  timestamp
  updated_at                  timestamp

task
  id                          uuid PK
  project_id                  uuid FK → project.id
  prompt                      text
  sources_kb_bool             bool
  sources_web_bool            bool
  sources_project_only_bool   bool
  pre_launch_mode             enum('auto','quick_check','confirm')
  parent_artifact_id          uuid FK → artifact.id (nullable)
  artifact_kind               enum('report','analysis','brief','table','summary')
  phase                       enum('queued','planning','pre_launch','executing','done','failed','canceled')
  failure_reason              text (nullable)
  started_at                  timestamp (nullable)
  ended_at                    timestamp (nullable)
  created_at                  timestamp

artifact
  id                          uuid PK
  project_id                  uuid FK → project.id
  title                       varchar(80)
  kind                        enum('report','analysis','brief','table','summary')
  current_version_id          uuid FK → artifact_version.id (nullable)
  created_at                  timestamp

artifact_version
  id                          uuid PK
  artifact_id                 uuid FK → artifact.id
  task_id                     uuid FK → task.id
  content                     text
  summary                     text
  version_number              int
  word_count                  int
  created_at                  timestamp

share_link
  id                          uuid PK
  artifact_version_id         uuid FK → artifact_version.id
  token                       varchar (unique)
  expires_at                  timestamp (nullable)
  revoked_bool                bool
  created_at                  timestamp

trace
  id                          uuid PK
  task_id                     uuid FK → task.id (unique)
  goal                        text
  status                      enum('running','complete','failed')
  duration_ms                 int
  steps                       jsonb
  created_at                  timestamp
  updated_at                  timestamp

source
  id                          uuid PK
  task_id                     uuid FK → task.id
  kind                        enum('kb','web','user_added')
  uri                         text (nullable)
  kb_document_id              uuid (nullable)
  title                       text
  kept_bool                   bool
  discard_reason              text (nullable)
  relevance_score             float (nullable)
  created_at                  timestamp

entity
  id                          uuid PK
  project_id                  uuid FK → project.id
  canonical_name              varchar(255)
  kind                        enum('person','company','concept','geography','product','date','other')
  aliases                     jsonb
  created_at                  timestamp

entity_mention
  id                          uuid PK
  entity_id                   uuid FK → entity.id
  source_id                   uuid FK → source.id (nullable)
  artifact_version_id         uuid FK → artifact_version.id (nullable)
  context_snippet             text
  created_at                  timestamp

entity_edge
  id                          uuid PK
  source_entity_id            uuid FK → entity.id
  target_entity_id            uuid FK → entity.id
  relationship_type           varchar(100)
  edge_kind                   enum('explicit','co_occurrence')
  evidence_score              float
  created_at                  timestamp

notification
  id                          uuid PK
  user_id                     uuid FK → users.id
  type                        enum('awaiting_review','task_completed','task_failed')
  project_id                  uuid FK → project.id
  task_id                     uuid FK → task.id (nullable)
  message                     text
  read_bool                   bool
  created_at                  timestamp
```

---

## 24. Open questions

These require a business or product decision before the relevant build step.

| # | Question | Needed by |
|---|---|---|
| 1 | What is the billing model for API usage? Is cost absorbed by the platform, passed to the user, or credit-based? This determines whether cost estimates in the Pre-Launch panel are shown and how Deep Dive usage is governed. | Step 7 |
| 2 | Is "Research" the final feature name? The current name is a working placeholder. A final name is needed before public-facing strings, URLs, and marketing copy are written. | Step 2 |
| 3 | Which knowledge base system is being integrated? The spec assumes a KB exists but does not define the KB API, search mechanism, or document schema. | Step 7 |
| 4 | What is the data retention policy? How long are tasks, artifacts, and traces kept? Can users delete their own data? | Before launch |
| 5 | Are there content moderation requirements on prompts or artifacts (e.g. PII detection, output filtering)? | Before launch |

---

## 25. Future direction — Stance mode

A more ambitious framing reframes projects around hypotheses the user is testing rather than questions they are asking. The user stakes a claim, picks a posture (Strengthen / Stress-test / Find blind spots), and the agent runs a multi-persona deliberation producing a verdict with confidence level, strongest support, strongest challenge, fail conditions, and a watch list. Verdicts stay live, monitoring their own sources for changes and updating confidence over time. The Graph tab becomes a belief network connecting all active verdicts.

This is a deliberate next step built on the v1 foundation above, not an accidental gap.
