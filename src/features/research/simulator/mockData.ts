import type {
  Task,
  Trace,
  TraceStep,
  TraceStepType,
  Artifact,
  ArtifactVersion,
  Source,
  ArtifactKind,
} from '../types'
import { generateId } from '../utils/id'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SimStep {
  step: TraceStep
  /** Milliseconds from the start of the executing phase when this step begins. */
  startDelay: number
  /** Milliseconds from the start of the executing phase when this step completes. */
  completionDelay: number
}

export interface ScheduledSource {
  source: Source
  /** Milliseconds from the start of the executing phase when this source appears. */
  delay: number
}

// ─── Trace initialisation ─────────────────────────────────────────────────────

export function generateInitialTrace(task: Task): Trace {
  const now = new Date().toISOString()
  return {
    id:        generateId(),
    taskId:    task.id,
    goal:      task.prompt,
    status:    'running',
    durationMs: null,
    steps:     [],
    createdAt: now,
    updatedAt: now,
  }
}

// ─── Planning phase — plan step ───────────────────────────────────────────────

export function generatePlanStep(task: Task): TraceStep {
  const subQuestions = [
    'Which industry sectors show the highest concentration of dormant shell company registrations implicated in fraud?',
    'What structural and ownership patterns reliably distinguish abusive shell entities from legitimate holding structures?',
    'What regulatory frameworks — CTA, ROE, FATF — are in place and what gaps remain most exploitable?',
    'What are the primary financial fraud typologies (layering, TBML, procurement fraud) linked to dormant shell companies?',
    'What specific entity-level and transactional signals should trigger an AML or fraud investigation?',
  ]

  const webQueries = [
    '"dormant shell company" financial fraud 2025 2026 investigation',
    '"beneficial ownership" registry FinCEN "Corporate Transparency Act" enforcement',
    '"shell company" sector risk "money laundering" typologies real estate',
    '"investigation triggers" "red flags" shell company fraud AML compliance',
  ]

  const kbQueries = [
    'shell company fraud indicators due diligence beneficial ownership',
    'AML typologies dormant entity money laundering',
    'investigation red flags financial crime entity screening',
  ]

  return {
    id:         generateId(),
    type:       'plan',
    status:     'complete',
    startedAt:  new Date().toISOString(),
    durationMs: 7_500,
    inputs: {
      prompt: task.prompt,
    },
    outputs: {
      subQuestions,
      sourcePlan: {
        ...(task.sourcesWeb ? { webQueries } : {}),
        ...(task.sourcesKb  ? { kbQueries  } : {}),
      },
      strategy: `Decompose the prompt into ${subQuestions.length} sub-questions spanning sector risk, structural typologies, regulatory landscape, fraud mechanics, and investigation triggers. Retrieve enforcement records, FATF guidance, academic research, and investigative reporting. Resolve any conflicting quantitative estimates by deferring to the most recent primary regulatory source, then synthesise a structured ${task.artifactKind} with operational trigger framework.`,
    },
    reasoning:    null,
    userModified: false,
  }
}

// ─── Executing phase — step sequence ─────────────────────────────────────────

export function generateExecutingSteps(task: Task): SimStep[] {
  const now = new Date().toISOString()

  // ── Step 1: Search ────────────────────────────────────────────────────────
  const searchType: TraceStepType = task.sourcesWeb ? 'search_web' : 'search_kb'
  const searchStep: TraceStep = {
    id:         generateId(),
    type:       searchType,
    status:     'running',
    startedAt:  now,
    durationMs: null,
    inputs: task.sourcesWeb
      ? {
          queries: [
            '"dormant shell company" fraud investigation 2025 2026',
            '"beneficial ownership" FinCEN enforcement "Corporate Transparency Act"',
            'shell company sector risk real estate private equity AML typologies',
            '"investigation triggers" red flags dormant entity financial crime',
          ],
          maxResults: 40,
        }
      : {
          queries:      ['shell company fraud beneficial ownership red flags', 'AML typologies dormant entity', 'investigation triggers financial crime'],
          maxDocuments: 50,
        },
    outputs:      {},
    reasoning:    null,
    userModified: false,
  }

  // ── Step 2: Read ──────────────────────────────────────────────────────────
  const readStep: TraceStep = {
    id:           generateId(),
    type:         'read',
    status:       'running',
    startedAt:    now,
    durationMs:   null,
    inputs:       { sourceCount: task.sourcesWeb ? 14 : 9, estimatedTokens: 28_400 },
    outputs:      {},
    reasoning:    null,
    userModified: false,
  }

  // ── Step 3: Synthesize ────────────────────────────────────────────────────
  const synthesizeStep: TraceStep = {
    id:           generateId(),
    type:         'synthesize',
    status:       'running',
    startedAt:    now,
    durationMs:   null,
    inputs:       { subQuestions: 5, documentCount: task.sourcesWeb ? 14 : 9, contextTokens: 22_800 },
    outputs:      {},
    reasoning:    null,
    userModified: false,
  }

  // ── Step 4: Emit ──────────────────────────────────────────────────────────
  const emitStep: TraceStep = {
    id:           generateId(),
    type:         'emit',
    status:       'running',
    startedAt:    now,
    durationMs:   null,
    inputs:       { artifactKind: task.artifactKind },
    outputs:      {},
    reasoning:    null,
    userModified: false,
  }

  return [
    { step: searchStep,    startDelay:  0,      completionDelay:  4_000 },
    { step: readStep,      startDelay:  4_500,  completionDelay:  9_500 },
    { step: synthesizeStep, startDelay: 10_000, completionDelay: 15_500 },
    { step: emitStep,      startDelay: 16_000,  completionDelay: 17_500 },
  ]
}

// ─── Completed step outputs ───────────────────────────────────────────────────

export function getCompletedOutputs(
  stepType: TraceStepType,
  task: Task,
): Record<string, unknown> {
  switch (stepType) {
    case 'search_web':
      return {
        sourcesRetrieved: 43,
        sourcesKept:      14,
        sourcesDiscarded: 29,
        discardReasons: {
          'Low relevance (< 0.4)':     16,
          'Paywalled content':          7,
          'Outdated (> 18 months)':     4,
          'Duplicate coverage':         2,
        },
      }
    case 'search_kb':
      return {
        documentsRetrieved: 24,
        documentsKept:       9,
        documentsDiscarded: 15,
        discardReasons: {
          'Low relevance (< 0.4)': 11,
          'Insufficient depth':     4,
        },
      }
    case 'read':
      return {
        documentsRead:     task.sourcesWeb ? 14 : 9,
        tokensExtracted:   22_800,
        avgRelevanceScore: 0.83,
      }
    case 'synthesize':
      return {
        sectionsProduced:  5,
        wordCount:         2_214,
        conflictsResolved: 2,
      }
    case 'emit':
      return {
        artifactKind: task.artifactKind,
        sections:     ARTIFACT_SECTIONS[task.artifactKind] ?? ARTIFACT_SECTIONS.report,
        wordCount:    2_214,
      }
    default:
      return {}
  }
}

export const STEP_REASONING: Partial<Record<TraceStepType, string>> = {
  search_web:  'Prioritised sources from FinCEN, FATF, SEC, and peer-reviewed financial crime research published within the past 18 months. Discarded paywalled enforcement digests and results with low specificity to dormant shell entity typologies.',
  search_kb:   'Retrieved the highest-relevance documents from the knowledge base covering AML typologies, entity screening frameworks, and investigation playbooks. Discarded documents with match scores below threshold and those focused on unrelated financial crime categories.',
  read:        'Read all retained sources in full, extracting the most relevant passages for each sub-question — sector risk hierarchy, structural red flags, regulatory gaps, fraud typologies, and investigation triggers. Scored passages by specificity and recency.',
  synthesize:  'Synthesised findings across all sub-questions. Two conflicting quantitative estimates were identified: global shell-fraud transaction value (range: $500B–$2T) and US CTA compliance rates (range: 52–67%). Resolved by deferring to the most recent FinCEN primary source for each figure.',
  emit:        'Structured the synthesised findings into the requested artifact format with section anchors, an operational investigation trigger framework with twelve discrete signals, and inline source attribution throughout.',
}

const ARTIFACT_SECTIONS: Record<ArtifactKind, string[]> = {
  report:   ['Executive Summary', 'Key Findings', 'Highest-Risk Sectors', 'Investigation Triggers', 'Regulatory Landscape', 'Strategic Implications', 'Conclusion'],
  analysis: ['Assessment', 'The Core Tension', 'Verdict'],
  brief:    ['Summary'],
  table:    ['Sector Risk Matrix', 'Key Observations'],
  summary:  ['Synthesis of Sources'],
}

// ─── Sources ──────────────────────────────────────────────────────────────────

export function generateScheduledSources(task: Task): ScheduledSource[] {
  const now = new Date().toISOString()
  const scheduled: ScheduledSource[] = []

  if (task.sourcesWeb) {
    const webEntries = [
      {
        title:          'FinCEN — Beneficial Ownership Information: 2025 Enforcement Update',
        uri:            'https://fincen.gov/resources/statutes-regulations/guidance/beneficial-ownership-2025',
        kept:           true,
        relevanceScore: 97,
        excerpt:        'CTA compliance among pre-existing entities remains below 60% as of Q1 2026. FinCEN has signalled enforcement escalation targeting high-risk sectors — real estate, fund administration, and legal services — in H2 2026.',
        discardReason:  null,
      },
      {
        title:          'FATF — Guidance on Beneficial Ownership of Legal Persons (2023, updated 2025)',
        uri:            'https://fatf-gafi.org/publications/beneficial-ownership/documents/guidance-beneficial-ownership-legal-persons-2023.html',
        kept:           true,
        relevanceScore: 95,
        excerpt:        'The revised FATF standard requires countries to ensure competent authorities can obtain beneficial ownership information rapidly and reliably. Mutual evaluation findings continue to identify shell company opacity as the most common technical deficiency.',
        discardReason:  null,
      },
      {
        title:          'Global Financial Integrity — Illicit Financial Flows Report 2025',
        uri:            'https://gfintegrity.org/report/illicit-financial-flows-2025',
        kept:           true,
        relevanceScore: 91,
        excerpt:        'Shell companies remain the dominant vehicle for cross-border illicit financial flows. Real estate-based layering alone accounts for an estimated $300–400 billion in annual IFF volume, with dormant entities featuring in the majority of documented cases.',
        discardReason:  null,
      },
      {
        title:          'SEC Enforcement — Shell Company Actions Summary 2024–2025',
        uri:            'https://sec.gov/divisions/enforce/shell-company-enforcement-2024-2025',
        kept:           true,
        relevanceScore: 89,
        excerpt:        'The SEC brought 47 enforcement actions involving dormant or near-dormant shell companies in 2024, up from 31 in 2023. The most common violation pattern: acquisition of shell companies with SEC reporting history to bypass registration requirements.',
        discardReason:  null,
      },
      {
        title:          'OCCRP — Shell Company Networks: Investigation Database (2026)',
        uri:            'https://occrp.org/en/investigations/shell-company-networks-2026',
        kept:           true,
        relevanceScore: 86,
        excerpt:        'Analysis of 12,000+ shell company entities across 64 jurisdictions reveals that 78% of shells implicated in documented fraud had no employees, no independently owned assets, and no verifiable beneficial owner at the time of the fraudulent transaction.',
        discardReason:  null,
      },
      {
        title:          'IMF Working Paper — Corporate Opacity and Financial Crime: Sector Exposure (2025)',
        uri:            'https://imf.org/publications/wp/2025/corporate-opacity-financial-crime',
        kept:           true,
        relevanceScore: 83,
        excerpt:        'Real estate, private equity, and professional services consistently rank as the top three sectors by shell company fraud exposure across the 42 jurisdictions studied. Crypto-linked shell structures have grown fastest year-over-year.',
        discardReason:  null,
      },
      {
        title:          'UK Companies House — Register of Overseas Entities: Year One Review',
        uri:            'https://companieshouse.gov.uk/roe-year-one-review-2024',
        kept:           true,
        relevanceScore: 80,
        excerpt:        'Agent-assisted and nominee-facilitated registrations continue to undermine data quality in the ROE. Approximately 14% of registered entries contain materially incomplete or unverifiable beneficial ownership information.',
        discardReason:  null,
      },
      {
        title:          'Journal of Financial Crime — Dormant Shell Entity Typologies (2024)',
        uri:            'https://emerald.com/insight/publication/jfc/dormant-shell-typologies-2024',
        kept:           true,
        relevanceScore: 77,
        excerpt:        'Layering through 3–7 entity tiers before reaching a jurisdiction-opacity barrier is the most common structural evasion pattern. High-relevance source: analysis covers 1,400+ enforcement cases across 15 jurisdictions.',
        discardReason:  null,
      },
      {
        title:          'FinCEN Geographic Targeting Orders — 2025 Renewal Notice',
        uri:            'https://fincen.gov/resources/statutes-regulations/administrative-rulings/geographic-targeting-orders-2025',
        kept:           true,
        relevanceScore: 74,
        excerpt:        'GTOs renewed for 12 metropolitan areas covering residential and commercial real estate transactions above $300,000. All-cash purchases remain the primary trigger criterion, with LLC/shell purchaser structure as a mandatory disclosure field.',
        discardReason:  null,
      },
      {
        title:          'Transparency International — Anti-Money Laundering Index 2025',
        uri:            'https://transparency.org/en/publications/aml-index-2025',
        kept:           true,
        relevanceScore: 69,
        excerpt:        'Delaware, Nevada, BVI, and Cayman Islands appear in over 60% of cross-border shell fraud investigations reviewed for this index. All four jurisdictions continue to receive below-average scores on beneficial ownership transparency.',
        discardReason:  null,
      },
      {
        title:          'General AML News Digest — April 2026',
        uri:            'https://amlnewsdigest.com/april-2026',
        kept:           false,
        relevanceScore: 38,
        excerpt:        null,
        discardReason:  'Aggregated news digest — low specificity relative to primary source alternatives covering the same material.',
      },
      {
        title:          'Company Formation Industry Trade Group — Annual Report 2024',
        uri:            'https://acra-trade.org/annual-report-2024',
        kept:           false,
        relevanceScore: 24,
        excerpt:        null,
        discardReason:  'Industry self-reporting with significant conflict of interest; findings contradict primary regulatory sources on compliance rates.',
      },
      {
        title:          'Historical Survey of Offshore Tax Havens (2010)',
        uri:            'https://tax-journal.org/offshore-survey-2010',
        kept:           false,
        relevanceScore: 14,
        excerpt:        null,
        discardReason:  'Content predates the relevant regulatory and structural landscape by 15+ years — not applicable to current typologies.',
      },
    ]

    webEntries.forEach((entry, i) => {
      scheduled.push({
        delay: 800 + i * 450,
        source: {
          id:             generateId(),
          taskId:         task.id,
          kind:           'web',
          uri:            entry.uri,
          title:          entry.title,
          kept:           entry.kept,
          discardReason:  entry.discardReason,
          relevanceScore: entry.relevanceScore,
          excerpt:        entry.excerpt,
          createdAt:      now,
        },
      })
    })
  }

  if (task.sourcesKb) {
    const kbEntries = [
      {
        title:          'Internal AML Typologies Handbook — Shell Entity Patterns v4.1',
        kept:           true,
        relevanceScore: 93,
        excerpt:        'The handbook catalogues 24 distinct dormant shell entity patterns observed in enforcement and due diligence contexts, with sector-specific prevalence rates and recommended investigation thresholds for each.',
      },
      {
        title:          'Entity Risk Screening Framework — Beneficial Ownership Module',
        kept:           true,
        relevanceScore: 87,
        excerpt:        'The framework\'s beneficial ownership module defines tiered investigation triggers: three co-occurring red flags triggers enhanced due diligence; five or more triggers escalation to the financial crime team.',
      },
      {
        title:          'Investigation Playbook — Dormant Shell Company Cases',
        kept:           true,
        relevanceScore: 82,
        excerpt:        'Step-by-step case handling for dormant shell investigations: entity registry verification, beneficial ownership trace, transactional pattern analysis, SAR filing criteria, and inter-agency referral protocol.',
      },
      {
        title:          'Sector Risk Assessment — Real Estate & Private Funds 2025',
        kept:           true,
        relevanceScore: 75,
        excerpt:        'Real estate and private funds are classified as Tier 1 financial crime risk sectors. Both require UBO-level KYB at onboarding as standard — not enhanced due diligence triggers.',
      },
      {
        title:          'Trade-Based Money Laundering Detection Guide',
        kept:           false,
        relevanceScore: 41,
        excerpt:        null,
      },
    ]

    kbEntries.forEach((entry, i) => {
      scheduled.push({
        delay: 1_400 + i * 700,
        source: {
          id:             generateId(),
          taskId:         task.id,
          kind:           'kb',
          uri:            null,
          title:          entry.title,
          kept:           entry.kept,
          discardReason:  entry.kept ? null : 'Lower relevance than primary source alternatives covering trade finance typologies.',
          relevanceScore: entry.relevanceScore,
          excerpt:        entry.excerpt ?? null,
          createdAt:      now,
        },
      })
    })
  }

  return scheduled
}

// ─── Artifact ─────────────────────────────────────────────────────────────────

export function generateArtifact(task: Task, parentArtifact?: Artifact | null): Artifact {
  const content   = ARTIFACT_CONTENT[task.artifactKind]
  const wordCount = content.split(/\s+/).filter(Boolean).length
  const now       = new Date().toISOString()
  const versionId = generateId()

  // Update flow: add a new version to the existing artifact
  if (parentArtifact && task.parentArtifactId) {
    const versionNumber = parentArtifact.versions.length + 1
    const newVersion: ArtifactVersion = {
      id:            versionId,
      artifactId:    parentArtifact.id,
      taskId:        task.id,
      content,
      summary:       `Revised artifact — version ${versionNumber} synthesised from an updated source pool incorporating the latest FinCEN and FATF guidance.`,
      versionNumber,
      wordCount,
      createdAt:     now,
    }
    return {
      ...parentArtifact,
      currentVersionId: versionId,
      versions:         [...parentArtifact.versions, newVersion],
    }
  }

  // New artifact flow
  const artifactId = generateId()
  const version: ArtifactVersion = {
    id:            versionId,
    artifactId,
    taskId:        task.id,
    content,
    summary:       'Research artifact synthesised from FinCEN guidance, FATF typologies, SEC enforcement records, OCCRP investigations, and academic financial crime research.',
    versionNumber: 1,
    wordCount,
    createdAt:     now,
  }
  return {
    id:               artifactId,
    projectId:        task.projectId,
    title:            deriveArtifactTitle(task.prompt),
    kind:             task.artifactKind,
    currentVersionId: versionId,
    versions:         [version],
    createdAt:        now,
  }
}

function deriveArtifactTitle(prompt: string): string {
  const trimmed = prompt.trim()
  if (trimmed.length <= 72) return trimmed
  const cut = trimmed.slice(0, 72)
  const boundary = cut.lastIndexOf(' ')
  return (boundary > 36 ? cut.slice(0, boundary) : cut) + '…'
}

// ─── Artifact content templates ───────────────────────────────────────────────

const ARTIFACT_CONTENT: Record<ArtifactKind, string> = {
  report: `## Executive Summary

Public complaints related to dormant shell companies being exploited for financial fraud have surged 60% in the current year — a level last seen only during post-crisis enforcement sweeps. This report identifies the sectors bearing the highest concentration of risk, characterises the structural and transactional patterns that distinguish abusive shell entities from legitimate holding structures, and defines twelve specific triggers that should prompt an investigation.

The analysis draws on FinCEN guidance, FATF typologies, SEC enforcement records, OCCRP investigation data, and peer-reviewed financial crime research. Three sectors emerge as critically or highly elevated in risk: real estate, private equity and fund administration, and professional services. Six additional sectors carry elevated but lower systemic exposure. The investigation trigger framework developed in Section 4 provides an operational tool for prioritising cases without generating unacceptable false-positive rates among legitimate corporate structures.

## Key Findings

- Dormant shell entity filings implicated in fraud have increased 34% globally over three years, with the US, UK, and UAE accounting for the majority of incorporation activity in high-opacity jurisdictions.
- 78% of shell companies implicated in documented fraud cases had no employees, no independently owned assets, and no verifiable beneficial owner at the time of the fraudulent transaction (OCCRP, 2026).
- Real estate accounts for an estimated 44% of all documented shell company fraud by transaction value, driven by structural tolerance for anonymous ownership and large single-ticket transaction sizes.
- Four jurisdictions — Delaware, Nevada, British Virgin Islands, and Cayman Islands — appear in over 60% of cross-border shell fraud investigations (Transparency International, 2025).
- Layering through 3–7 entity tiers before reaching a jurisdiction-opacity barrier is the most common structural evasion pattern, occurring in over 65% of enforcement cases reviewed.
- US CTA beneficial ownership filing compliance among pre-existing entities remains below 60% as of Q1 2026, with the highest non-compliance rates concentrated in the sectors with the highest fraud risk.
- Enforcement actions involving dormant shell structures increased 52% year-over-year across the SEC, FinCEN, and UK FCA combined.

## Highest-Risk Sectors

**Real Estate — Risk: Critical**

Real estate is the sector most systematically exploited through dormant shell company structures. The combination of high single-ticket transaction values, limited beneficial ownership disclosure requirements across many jurisdictions, and industry practice of accepting anonymous LLCs as purchasers has created deep structural vulnerability. FinCEN Geographic Targeting Orders (GTOs) — renewed for 12 US metropolitan areas in 2025 — have repeatedly confirmed real estate transactions as the primary layering mechanism. Shell companies used in real estate fraud are typically characterised by all-cash purchases, nominee director structures, rapid resale activity, and LLCs where the managing member is itself an opaque entity.

**Private Equity and Fund Administration — Risk: High**

Private fund structures offer significant structural opacity when combined with shell entity networks. Dormant feeder funds, special-purpose vehicles, and general partner entities are frequently used to layer beneficial ownership across multiple tiers. The sector's reliance on carried interest structures and limited regulatory disclosure has made it attractive for embedding fraudulent shell entities within otherwise legitimate fund hierarchies. EU and UK regulators have identified private funds as the fastest-growing sector in SARs related to beneficial ownership concerns.

**Professional Services — Legal and Accounting — Risk: High**

Law firms and accounting practices are frequently the incorporation agents for dormant shell structures used in fraud. Attorney-client privilege and professional secrecy norms create substantial barriers to regulatory oversight in many jurisdictions. Recent enforcement actions by the Solicitors Regulation Authority (SRA) and US state bar associations have identified patterns of law firm-facilitated shell creation. Accounting firms are implicated primarily through nominee director and registered agent services.

**Import/Export and Trade Finance — Risk: High**

Trade-based money laundering (TBML) is the primary fraud typology in this sector. Dormant shell companies create fictitious import/export counterparties, enabling value movement across borders through false invoicing, phantom shipments, and over/under-invoicing schemes. The signature pattern is a pronounced mismatch between declared transaction values and the shell entity's reported capitalisation or operational footprint.

**Cryptocurrency and Digital Asset Platforms — Risk: Elevated**

Dormant shell companies are increasingly used as fiat-crypto bridge counterparties, allowing pseudonymous entities to interface with the regulated financial system. The combination of blockchain pseudonymity and corporate opacity creates a two-layer barrier to beneficial ownership tracing. FinCEN, the FCA, and ESMA have all issued specific guidance addressing shell company risk in digital asset contexts in 2024–2025.

**Construction and Public Procurement — Risk: Elevated**

Public procurement fraud frequently involves shell company networks. Dormant entities create the appearance of competitive tendering while funnelling contracts to entities under common beneficial control. The sector is particularly exposed in jurisdictions with limited procurement transparency and routine use of nominee structures.

## Investigation Triggers

The following signals — individually or in combination — should prompt enhanced due diligence or active investigation. No single trigger is diagnostic; the co-occurrence of five or more, particularly combining dormancy, layered ownership, and high-value transactional activity, is the highest-confidence indicator of an abusive structure.

**Entity-Level Signals**

1. **Dormancy + sudden transaction activity.** An entity with no prior trading history or minimal transaction volume initiates large-value activity within a compressed window (typically 30–90 days).
2. **Layered ownership exceeding three tiers.** Beneficial ownership cannot be traced to a natural person within three entity layers without encountering a jurisdiction-opacity barrier (BVI, Cayman, Delaware LLC, etc.).
3. **Nominee director with no industry connection.** The director is a professional nominee whose declared background bears no plausible relationship to the industry in which the entity is transacting.
4. **Registered address is a formation agent or shared by 50+ entities.** The registered address is a commercial formation agent or legal office shared by a disproportionate number of other entities — a reliable signal of mass-incorporation activity.
5. **Capitalisation-to-transaction value mismatch.** An entity with minimal share capital or no disclosed assets is a party to transactions whose value materially exceeds its apparent financial capacity.
6. **Multiple ownership changes within 12 months preceding the transaction.** Beneficial ownership was transferred one or more times within the year before the flagged transaction — a standard layering technique.

**Transactional Signals**

7. **Structuring near reporting thresholds.** Payments structured in amounts just below mandatory reporting thresholds across multiple transactions in a short period.
8. **All-cash acquisition of high-value assets.** Cash purchase of real estate, vehicles, art, or other high-value assets by an entity with no verifiable source of funds.
9. **Counterparty chain of dormant entities.** A transaction involves two or more dormant shell companies on both sides, with no direct counterparty exhibiting identifiable commercial operations.
10. **Round-number inter-entity transfers.** Regular transfers of precisely rounded amounts between entities under suspected common control — characteristic of internal fund circulation rather than arm's-length commercial transactions.

**Compliance and Regulatory Signals**

11. **Lapsed corporate registry filings.** The entity has failed to file required annual returns, accounts, or beneficial ownership declarations while remaining active in transactional terms — a dissonance pattern common in abandoned shells that have been reactivated.
12. **Adverse media or sanctions proximity.** The entity, its named directors, or its registered agent appears in adverse media, sanctions databases, or enforcement records in connection with other entities or jurisdictions.

## Regulatory Landscape

**United States — Corporate Transparency Act (CTA)**
Effective 1 January 2024, the CTA requires most US legal entities to report beneficial ownership information to FinCEN. The rule creates 23 exemptions. Compliance among pre-existing entities is estimated below 60% as of Q1 2026, with enforcement escalation signalled for H2 2026. The highest non-compliance concentration is in micro-entities across real estate and professional services — precisely the categories with elevated fraud risk.

**United Kingdom — Register of Overseas Entities (ROE)**
Introduced under the Economic Crime (Transparency and Enforcement) Act 2022, the ROE requires overseas entities owning UK land to disclose beneficial owners. Companies House verification standards have been identified as insufficiently robust: approximately 14% of registered entries contain materially incomplete or unverifiable information, undermining the register's investigative utility.

**European Union — AML Package 2024**
The EU's 2024 AML regulation package extends AML obligations to additional sector categories and mandates direct application without member state transposition. The new Anti-Money Laundering Authority (AMLA) is expected to be fully operational in 2026 with direct supervisory authority over highest-risk obliged entities.

**FATF Mutual Evaluation Cycle**
The US, UK, and Australia mutual evaluations have each rated beneficial ownership and legal person transparency as areas of significant weakness. These findings directly inform bilateral enforcement cooperation and correspondent banking risk appetites.

## Strategic Implications

The 60% complaint surge should be treated as a leading indicator of forthcoming regulatory escalation. Enforcement cycles have historically followed complaint surges with a 12–24 month lag — the current pattern implies materially elevated enforcement probability through 2026–2027.

For compliance functions, the practical implications are threefold. First, KYB (Know Your Business) procedures at onboarding must reach ultimate beneficial owner level as a default across all high-risk sectors — not merely as an enhanced-due-diligence threshold. Second, transaction monitoring rules need to incorporate entity-level dormancy signals — not just the transactional red flags that current monitoring systems are calibrated to detect. Third, SAR filing thresholds should be reviewed against the expanded typology evidence; current thresholds in many organisations were calibrated to an earlier generation of fraud patterns.

## Conclusion

The shell company fraud landscape in 2026 is characterised by increasing structural sophistication in evasion and a regulatory response that remains a step behind. The complaint surge is not anomalous — it is the visible surface of a fraud pattern well-documented in enforcement records, SAR trend data, and investigative reporting.

The sectors most exposed — real estate, private equity, professional services, trade finance, and digital assets — share a defining structural feature: institutional tolerance for beneficial ownership opacity that has historically been treated as a feature of commercial privacy rather than a vulnerability to exploitation.

The twelve investigation triggers in Section 4 provide an operational prioritisation framework. No single signal is diagnostic. It is the co-occurrence of multiple signals — particularly the combination of dormancy, layered ownership, capitalisation mismatch, and high-value transactional activity — that most reliably distinguishes abusive structures from legitimate ones. Organisations that build this multi-signal logic into their monitoring infrastructure now are best positioned ahead of the enforcement escalation the current complaint trajectory foreshadows.`,

  analysis: `## Assessment

The evidence is unusually consistent on the central question: the risk is real, it is sector-concentrated, and the regulatory infrastructure required to address it systematically remains inadequate. The 60% complaint increase is not statistical noise — it is the visible surface of a fraud pattern that is well-documented in enforcement records, suspicious activity report trends, and cross-jurisdictional investigative reporting.

The sectors identified as highest-risk share a structural characteristic more than an industry characteristic. Real estate accepts anonymous LLCs as buyers. Private funds rely on layered SPV structures as a standard operating model. Professional services are protected by confidentiality norms that regulators have been slow to override. In each case, beneficial ownership opacity is an embedded institutional feature — and it is precisely that feature which fraudulent actors systematically exploit.

The investigation trigger framework is where the operational value lies. Twelve discrete signals have been identified across entity-level, transactional, and compliance dimensions. The critical insight: no single trigger is diagnostic. Shell companies used in legitimate corporate structuring will routinely exhibit two or three of these signals. It is the co-occurrence of five or more — particularly dormancy, layered ownership, and transactional anomaly together — that most reliably separates abusive structures from legitimate holding vehicles.

Two quantitative conflicts were identified and resolved during synthesis. First, estimates of global shell-fraud transaction value range from $500 billion to $2 trillion annually — a spread too wide to be operationally useful. The $300–400 billion real estate figure from Global Financial Integrity was retained as the most methodologically transparent and jurisdiction-specific estimate. Second, US CTA compliance rates across sources ranged from 52% to 67%; FinCEN's own Q1 2026 figure of below 60% was used as the primary reference.

## The Core Tension

The fundamental tension is between the regulatory imperative for beneficial ownership transparency and the legitimate privacy and commercial confidentiality interests that underlie legal corporate structures globally.

This tension is not abstract. Many shell company structures used in fraud are superficially identical to the legitimate holding structures used by family offices, private equity managers, and multinational corporations for entirely lawful tax planning and governance purposes. The fraud is in the intent and the transaction — not the structure itself. A three-tier BVI-Delaware-LLC ownership chain can be either a routine private equity fund structure or a layered laundering vehicle. The structure alone does not resolve the question.

This means that investigation frameworks relying purely on entity-level characteristics will generate significant false positives among legitimate actors. The most effective detection approaches combine entity-level dormancy and ownership screening with transactional pattern analysis and counterparty network mapping — treating the shell company not as the endpoint of investigation but as the starting point for a broader relationship and transaction inquiry.

The regulatory response is also navigating this tension imperfectly. The CTA's 23 exemptions, the ROE's verification gaps, and FATF's reliance on self-reported mutual evaluations all reflect the difficulty of achieving genuine transparency without materially disrupting legitimate commercial structures. The result is a patchwork that sophisticated fraudulent actors have proven adept at mapping and exploiting.

## Verdict

The weight of evidence supports treating dormant shell company fraud as an elevated-priority compliance risk — not a routine AML concern that existing monitoring frameworks are adequate to address.

The 60% complaint surge, combined with the regulatory escalation trajectory across all major jurisdictions, creates conditions in which enforcement action is likely to intensify materially over the next 18–24 months. Organisations in the five highest-risk sectors that have not yet updated their KYB and transaction monitoring frameworks to reflect the typologies identified in this research carry meaningful regulatory exposure.

The asymmetry is clear: the cost of proactive framework remediation is materially lower than the cost of reactive engagement with regulators following an enforcement action. The sectors and triggers identified in this analysis provide a sufficient foundation for that remediation to begin.`,

  brief: `## Summary

Public complaints about dormant shell companies being exploited for financial fraud have risen 60% this year — a leading indicator of enforcement escalation, not simply increased awareness. The research identifies the sectors most exposed and the patterns most reliably associated with abusive structures.

**Bottom line:** Real estate, private equity, professional services, trade finance, and digital assets are the five highest-risk sectors. An investigation should be triggered when three or more of the twelve identified signals are present simultaneously — with dormancy combined with layered ownership and high-value transactional activity being the highest-conviction pattern. CTA compliance remains below 60% among US entities, meaning most of the highest-risk domestic structures are still operating in regulatory blind spots.

**Three things to watch:**

1. **CTA enforcement escalation in H2 2026.** FinCEN has signalled sector-targeted enforcement beginning in the second half of 2026, with real estate and professional services as the first-mover targets. Organisations in these sectors with incomplete UBO documentation are directly in the enforcement path.

2. **AMLA operationalisation in the EU.** The Anti-Money Laundering Authority's first cohort of directly supervised entities will be announced mid-2026. Designation as a high-risk obliged entity carries significant compliance and reputational consequences, and the criteria for designation closely track the sector risk hierarchy identified in this report.

3. **Crypto-to-real estate shell structures.** The fastest-growing and least-detected typology combines blockchain pseudonymity with corporate opacity — a shell entity used as the fiat bridge between a crypto wallet and a real estate acquisition. Existing monitoring tools in both sectors are calibrated to detect each risk in isolation, not the combined structure.`,

  table: `## Sector Risk Matrix

| Sector | Risk Level | Shell Usage | Primary Fraud Typology | Key Red Flags | Primary Regulator |
|---|---|---|---|---|---|
| Real Estate | Critical | Very High | Layering, property-based laundering | All-cash purchases, anonymous LLCs, rapid resale, nominee directors | FinCEN GTOs, CTA |
| Private Equity / Fund Admin | High | High | Feeder fund layering, SPV fraud | Dormant feeder funds, offshore GP entities, complex multi-tier ownership | SEC, AIFMD, FCA |
| Professional Services (Legal/Accounting) | High | High | Incorporation facilitation, nominee abuse | Agent-assisted registration, director shared across 50+ entities | SRA, state bar authorities |
| Trade Finance / Import-Export | High | Medium-High | Trade-based money laundering (TBML) | Invoice value mismatch, phantom shipments, over/under-invoicing | Customs, correspondent banks |
| Digital Assets / Crypto | Elevated | Medium | Fiat-crypto bridge, pseudonymous counterparty | Shell as exchange on/off-ramp, mixer-adjacent transaction chains | FinCEN, FCA, ESMA |
| Construction / Procurement | Elevated | Medium | Bid-rigging, procurement fraud | Common beneficial owner across bidders, circular award patterns | Procurement agencies, national audit |

## Key Observations

Real estate is the highest-risk sector by a significant margin — accounting for an estimated 44% of documented shell company fraud by transaction value. The sector's structural vulnerability (large single-ticket transactions, tolerance for anonymous LLC purchasers, all-cash deals) makes it the path of least resistance for dormant shell networks seeking to layer and integrate illicit funds.

The digital assets row is the fastest-moving risk. Crypto-to-real estate shell structures — combining blockchain pseudonymity with corporate opacity — represent the fastest-growing typology in enforcement filings over the past 18 months. Existing monitoring systems in both sectors are calibrated to detect each risk in isolation; the combined typology largely escapes current detection frameworks.

Four jurisdictions — Delaware, Nevada, BVI, and Cayman Islands — appear in over 60% of cross-border shell fraud investigations. The presence of any of these jurisdictions in a multi-tier ownership chain should be treated as a material red flag requiring additional UBO verification, not a routine finding.

CTA compliance below 60% among US entities means that the highest-risk domestic shell structures are, at this moment, largely invisible to the beneficial ownership registry infrastructure that regulators are relying on. This gap will close as enforcement escalates — but during the transition period, investigative frameworks cannot assume that registry data alone provides adequate UBO coverage.`,

  summary: `## Synthesis of Sources

Sources reviewed were strongly convergent on the sector risk hierarchy and the structural characteristics of abusive dormant shell entities. FinCEN guidance, FATF typologies, SEC enforcement data, OCCRP investigation analysis, and peer-reviewed academic research all identify real estate, private equity, and professional services as the top three sectors by exposure — an unusual degree of cross-source consistency that increases confidence in the finding.

**Points of consensus across all sources:**
- Real estate is unambiguously the highest-risk sector by both case count and transaction value
- Dormancy combined with layered ownership (3+ tiers) and high-value transactional activity is the most reliable co-occurring indicator set for fraudulent shell structures
- Regulatory response is intensifying across all major jurisdictions, with a historically consistent 12–24 month enforcement lag following complaint surges
- CTA and ROE frameworks have partially disrupted historic opacity channels but compliance and data quality gaps remain material
- Four jurisdictions (Delaware, Nevada, BVI, Cayman) appear disproportionately across all source types as the preferred incorporation locations for shells implicated in fraud

**Points of divergence between sources:**
- Global shell-fraud transaction value estimates vary widely ($500B–$2T annually), reflecting definitional and methodological differences; the $300–400B real estate-specific figure has stronger methodological grounding
- CTA compliance rate estimates vary across sources (52–67%); FinCEN's own Q1 2026 figure is the most authoritative reference
- Sources disagree on whether digital asset shell structures represent a genuinely new risk vector or primarily a new mechanism for existing typologies — enforcement data suggests both are true simultaneously

**Source confidence notes:**
The highest-confidence findings — sector risk hierarchy and investigation trigger co-occurrence patterns — are supported by both regulatory primary sources and independent empirical research simultaneously. Three sources were flagged as potentially carrying industry conflict of interest (formation agent trade group publications) and were excluded from the synthesis. OCCRP investigation data provides detailed case-level evidence that may not be statistically representative of the broader fraud population but is used here for typology illustration rather than quantitative inference.`,
}
