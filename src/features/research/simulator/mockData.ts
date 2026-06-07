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
    'What is the overall volume and trajectory of public complaints about BUDI95 across social media, news, and forums from Jan 2025 to Apr 2026?',
    'Who are the key influencers, KOLs, and media publishers shaping the BUDI95 narrative, and what sentiment does each voice carry?',
    'What are the dominant complaint themes — PADU misclassification, MyKad terminal failures, eligibility errors, foreigner abuse narrative — and how do they rank by volume?',
    'Which misinformation claims about BUDI95 are most widely circulated, and what enforcement actions has MCMC taken under CMA 1998?',
    'What are the structural root causes of public dissatisfaction, and what solutions have government, civil society, and independent analysts proposed?',
  ]

  const webQueries = [
    '"BUDI95" fuel subsidy Malaysia complaints sentiment 2025 2026',
    '"PADU" misclassification eligibility error "BUDI95" site:malaysiakini.com OR site:freemalaysiatoday.com',
    '"BUDI95" misinformation "MyKad" foreigner abuse MCMC enforcement',
    'Syed Saddiq BUDI95 Parliament criticism subsidy reform Malaysia',
  ]

  const kbQueries = [
    'BUDI95 fuel subsidy policy PADU eligibility framework MOF',
    'Malaysia RON95 subsidy complaint social media sentiment analysis',
    'MCMC misinformation enforcement fuel subsidy Malaysia 2025',
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
      strategy: `Decompose the prompt into ${subQuestions.length} sub-questions spanning complaint volume trends, influencer mapping, complaint theme taxonomy, misinformation landscape, and root cause analysis. Retrieve policy documents, news coverage, social media data, MCMC enforcement records, and independent think-tank assessments. Resolve divergences between official government metrics and independent estimates by flagging both, then synthesise a structured ${task.artifactKind} with actionable intelligence for policy and communications stakeholders.`,
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
            '"BUDI95" complaints sentiment Malaysia 2025 2026',
            '"PADU" eligibility error misclassification fuel subsidy',
            '"BUDI95" misinformation MCMC enforcement "CMA 1998"',
            'Syed Saddiq BUDI95 Parliament opposition subsidy Malaysia',
          ],
          maxResults: 40,
        }
      : {
          queries:      ['BUDI95 fuel subsidy PADU eligibility policy', 'Malaysia RON95 complaint sentiment analysis', 'MCMC misinformation enforcement subsidy'],
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
  search_web:  'Prioritised sources from MOF, PADU, Bernama, Malaysiakini, Free Malaysia Today, and MCMC published between Jan 2025 and Apr 2026. Discarded aggregator content with low specificity and results predating the BUDI95 rollout period.',
  search_kb:   'Retrieved the highest-relevance internal documents covering BUDI95 policy framework, PADU eligibility criteria, and prior subsidy reform assessments. Discarded documents with match scores below threshold and those covering unrelated social policy domains.',
  read:        'Read all retained sources in full, extracting the most relevant passages for each sub-question — complaint volume trends, influencer sentiment breakdown, complaint theme taxonomy, misinformation claim inventory, and root cause analysis. Scored passages by specificity and publication recency.',
  synthesize:  'Synthesised findings across all five sub-questions. Two conflicting quantitative estimates were identified: PADU income classification accuracy (government: 92% vs. IDEAS Malaysia: 82%) and eligible recipient count (MOF: 8.6M vs. range 7.5M–9.1M). Resolved by retaining both figures with source attribution and flagging the methodological divergence.',
  emit:        'Structured the synthesised findings into the requested artifact format with section anchors, a complaint theme taxonomy, influencer voice timeline, narrative network analysis, and root cause and risk matrix with actionable recommended solutions.',
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
        title:          'MOF Malaysia — BUDI95 Fuel Subsidy Policy Framework & Implementation Guidelines',
        uri:            'https://mof.gov.my/budi95-policy-framework-2025',
        kept:           true,
        relevanceScore: 96,
        excerpt:        'BUDI95 delivers targeted RON95 fuel subsidies to 8.6 million B40 and lower-M40 households via PADU-linked MyKad verification. The program has generated RM4.2 billion in fiscal savings in its first year while protecting eligible recipients from full market price exposure.',
        discardReason:  null,
      },
      {
        title:          'Malaysiakini — Fuel Subsidy Rollout Exposes Deep Flaws in PADU Infrastructure',
        uri:            'https://malaysiakini.com/news/budi95-padu-data-flaws-2025',
        kept:           true,
        relevanceScore: 94,
        excerpt:        'The national rollout of BUDI95 in September 2025 has exposed systemic weaknesses in PADU\'s income classification data. An estimated 18% of registered households have filed eligibility disputes, with gig workers and rural communities disproportionately affected by over-classification errors.',
        discardReason:  null,
      },
      {
        title:          'MCMC — CMA 1998 Enforcement Action: BUDI95 Misinformation Report Q4 2025',
        uri:            'https://mcmc.gov.my/enforcement/budi95-misinformation-q4-2025',
        kept:           true,
        relevanceScore: 91,
        excerpt:        'MCMC has flagged 340+ items of false or misleading content related to BUDI95 across Facebook, TikTok, and WhatsApp since October 2025. The most prevalent claims — that foreigners can access the subsidy using borrowed MyKad, and that the program is being cancelled — have been formally classified as misinformation under CMA 1998.',
        discardReason:  null,
      },
      {
        title:          'IDEAS Malaysia — Independent Assessment of BUDI95 Implementation Accuracy',
        uri:            'https://ideas.org.my/publications/budi95-assessment-2026',
        kept:           true,
        relevanceScore: 89,
        excerpt:        'Our independent assessment puts PADU income classification accuracy at 82% — materially below the government\'s reported 92% figure, which measures technical registration success rather than income data correctness. The 10-point gap represents approximately 860,000 households whose eligibility classification may be inaccurate.',
        discardReason:  null,
      },
      {
        title:          'Bernama — PM Confirms BUDI95 Has Prevented RM1.1B in Subsidy Leakage',
        uri:            'https://bernama.com/bm/am/news.php?id=budi95-savings-pm-statement',
        kept:           true,
        relevanceScore: 86,
        excerpt:        'Prime Minister confirms BUDI95 has prevented RM1.1 billion in subsidy leakage in the first six months of operation, with 8.6 million B40 households successfully registered. The program is on track to deliver RM4.2 billion in annual fiscal savings against the pre-reform baseline.',
        discardReason:  null,
      },
      {
        title:          'Free Malaysia Today — BUDI95 Terminal Failures: 12,000 Incidents per Week at Peak',
        uri:            'https://fmt.com.my/budi95-terminal-failures-kpdnhep-2025',
        kept:           true,
        relevanceScore: 83,
        excerpt:        'MyKad reader and e-wallet pre-authorisation terminal failures peaked at approximately 12,000 incidents per week during the October 2025 national rollout. KPDNHEP has confirmed 3,200 stations are still operating with non-certified hardware, with upgrades estimated at RM8,000–15,000 per terminal.',
        discardReason:  null,
      },
      {
        title:          'The Star Online — BUDI95 Appeal Backlog: 450,000 Pending Cases Disclosed',
        uri:            'https://thestar.com.my/news/nation/budi95-appeal-backlog-feb2026',
        kept:           true,
        relevanceScore: 80,
        excerpt:        "The Prime Minister's Department has confirmed approximately 450,000 PADU eligibility appeals remain unresolved. PADU Phase 2 audit has been announced, with corrections expected to begin in Q2 2026. Complaint volume has moderated from the October 2025 peak but remains elevated.",
        discardReason:  null,
      },
      {
        title:          'World Bank — Malaysia Fuel Subsidy Reform: Targeting Efficiency Assessment 2025',
        uri:            'https://worldbank.org/malaysia-fuel-subsidy-reform-2025',
        kept:           true,
        relevanceScore: 75,
        excerpt:        'Malaysia\'s move to targeted fuel subsidies via BUDI95 is consistent with regional best practice. Income-based targeting through PADU represents a significant improvement over blanket subsidies, though data accuracy challenges are common in first-generation targeted subsidy rollouts globally.',
        discardReason:  null,
      },
      {
        title:          'EPU Malaysia — Fiscal Savings and Macroeconomic Impact of BUDI95 (2025)',
        uri:            'https://epu.gov.my/fiscal-savings-budi95-2025',
        kept:           true,
        relevanceScore: 71,
        excerpt:        'The Economic Planning Unit projects RM4.2 billion in annual fiscal savings from BUDI95, with a range of RM3.8B–RM5.1B across RON95 global price volatility scenarios. Savings are being partially redirected to targeted cash transfer programmes under STR.',
        discardReason:  null,
      },
      {
        title:          'Sin Chew Daily — BUDI95 Sentiment Among Chinese Community: Survey Results',
        uri:            'https://sinchew.com.my/budi95-community-survey-2025',
        kept:           true,
        relevanceScore: 66,
        excerpt:        'A survey of 1,200 respondents in Selangor and KL found 68% of Chinese Malaysian respondents expressing dissatisfaction with BUDI95 implementation, primarily citing MyKad terminal failures and PADU income classification disputes rather than the subsidy concept itself.',
        discardReason:  null,
      },
      {
        title:          'General Malaysia News Digest — October 2025',
        uri:            'https://malaysianews.net/digest-oct-2025',
        kept:           false,
        relevanceScore: 31,
        excerpt:        null,
        discardReason:  'Aggregated news digest with low specificity — primary source alternatives from Bernama and Malaysiakini cover the same events with greater detail and source attribution.',
      },
      {
        title:          'Subsidy Policy Forum — Southeast Asia Regional Comparison (2022)',
        uri:            'https://subsidyforum.org/sea-comparison-2022',
        kept:           false,
        relevanceScore: 22,
        excerpt:        null,
        discardReason:  'Content predates the BUDI95 rollout by three years — not applicable to current implementation findings.',
      },
      {
        title:          'Anonymous WhatsApp Post — BUDI95 Cancellation Claim (flagged by MCMC)',
        uri:            null,
        kept:           false,
        relevanceScore: 8,
        excerpt:        null,
        discardReason:  'Unverifiable anonymous content formally classified as misinformation by MCMC under CMA 1998.',
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
        title:          'Internal Brief — BUDI95 Policy Landscape & PADU Architecture Overview',
        kept:           true,
        relevanceScore: 95,
        excerpt:        'BUDI95 uses PADU-linked MyKad biometric verification at RON95 pump terminals. The income threshold is set at RM5,000/month household income. PADU integrates LHDN tax records, EPF contribution data, and property ownership information — but gig economy income from platform sources is inconsistently captured.',
      },
      {
        title:          'Social Listening Report — BUDI95 Complaint Theme Taxonomy Q3–Q4 2025',
        kept:           true,
        relevanceScore: 88,
        excerpt:        'Analysis of 186,000 BUDI95-related social media posts identified seven primary complaint themes. MyKad Misuse Fear (62% of misinformation posts) and Foreigner Abuse Narrative (52%) dominate the misinformation cluster. Eligibility Errors (36%) and SOP Violations (28%) represent genuine implementation complaints distinct from false claims.',
      },
      {
        title:          'Stakeholder Mapping — BUDI95 Key Voices & Media Influence Network',
        kept:           true,
        relevanceScore: 83,
        excerpt:        'Negative voices command 2.3M combined audience reach versus 1.24M for pro-program voices — a 1.85× amplification disadvantage for the government narrative. Syed Saddiq (1.1M reach) and Malaysiakini (1.2M reach) are the two most influential negative voices. No credible independent positive voice exists outside official government channels.',
      },
      {
        title:          'Risk Register — BUDI95 Implementation Risks Q1 2026',
        kept:           true,
        relevanceScore: 76,
        excerpt:        'Four risks rated High or Critical: (1) PADU misclassification political blowback from M40 group; (2) sustained pump-level technical failures; (3) subsidy leakage via PADU data manipulation; (4) MCMC enforcement perceived as suppressing legitimate criticism.',
      },
      {
        title:          'Historical Reference — Malaysia BR1M Subsidy Programme Complaint Patterns 2013–2018',
        kept:           false,
        relevanceScore: 38,
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
