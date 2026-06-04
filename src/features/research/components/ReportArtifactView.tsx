import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts'
import DonutChart from '../../analytics/components/charts/DonutChart'
import HorizontalBar from '../../analytics/components/charts/HorizontalBar'
import SentimentStackedBar from '../../analytics/components/charts/SentimentStackedBar'
import { useChartTheme } from '../../analytics/hooks/useChartTheme'

// ─── Engagement trend ─────────────────────────────────────────────────────────

const engagementTrend = [
  { month: 'Jan 25', likes: 1200,  shares: 340,  comments: 890,  total: 2430  },
  { month: 'Feb 25', likes: 1450,  shares: 410,  comments: 1020, total: 2880  },
  { month: 'Mar 25', likes: 1680,  shares: 490,  comments: 1180, total: 3350  },
  { month: 'Apr 25', likes: 2100,  shares: 620,  comments: 1490, total: 4210  },
  { month: 'May 25', likes: 2800,  shares: 840,  comments: 1920, total: 5560  },
  { month: 'Jun 25', likes: 5200,  shares: 1640, comments: 3100, total: 9940  },
  { month: 'Jul 25', likes: 6800,  shares: 2100, comments: 4200, total: 13100 },
  { month: 'Aug 25', likes: 7900,  shares: 2480, comments: 4900, total: 15280 },
  { month: 'Sep 25', likes: 12400, shares: 3900, comments: 7600, total: 23900 },
  { month: 'Oct 25', likes: 18400, shares: 6200, comments: 11200,total: 35800 },
  { month: 'Nov 25', likes: 15600, shares: 5100, comments: 9400, total: 30100 },
  { month: 'Dec 25', likes: 13200, shares: 4200, comments: 7800, total: 25200 },
  { month: 'Jan 26', likes: 12400, shares: 3900, comments: 7200, total: 23500 },
  { month: 'Feb 26', likes: 14800, shares: 4600, comments: 8400, total: 27800 },
  { month: 'Mar 26', likes: 11800, shares: 3600, comments: 6800, total: 22200 },
  { month: 'Apr 26', likes: 9600,  shares: 2900, comments: 5400, total: 17900 },
]

// ─── Timeline events ──────────────────────────────────────────────────────────

const timelineEvents = [
  { date: 'Jan 2025',     label: 'Policy Announcement',          color: 'bg-slate-400',  desc: 'MOF announces BUDI95 as part of 2025 Budget. PADU registration opens. Civil society groups raise data completeness concerns.' },
  { date: 'Jun 2025',     label: 'Pilot Launch — Klang Valley',  color: 'bg-amber-500',  desc: 'Controlled pilot in Selangor and KL. First wave of MyKad terminal and e-wallet failures documented. Elderly users disproportionately affected.' },
  { date: 'Sep–Oct 2025', label: 'National Rollout & Peak Backlash', color: 'bg-red-500', desc: 'Full rollout triggers the highest complaint spike on record. PADU misclassification appeals surge. Viral WhatsApp claims allege cancellation.' },
  { date: 'Nov 2025',     label: 'MCMC Enforcement',             color: 'bg-blue-500',   desc: 'CMA 1998 activated to curb misinformation. First court fines issued. 340+ items flagged across Facebook, TikTok, WhatsApp.' },
  { date: 'Feb 2026',     label: 'Appeal Backlog Disclosed',      color: 'bg-orange-500', desc: "PM's Department confirms ~450,000 pending eligibility appeals. PADU Phase 2 audit announced. Secondary spike driven by media coverage." },
  { date: 'Apr 2026',     label: 'Stabilisation Phase Begins',   color: 'bg-green-500',  desc: 'Complaint volume moderates. PADU Phase 2 corrections, hardware upgrades at ~3,200 stations, dedicated helpline launched.' },
]

// ─── Demographics / sector ────────────────────────────────────────────────────

const sectorRiskData = [
  { name: 'Logistics & Transport', value: 32, color: '#ef4444' },
  { name: 'Gig Economy Workers',   value: 22, color: '#f97316' },
  { name: 'M40 Borderline',        value: 19, color: '#f59e0b' },
  { name: 'Rural Communities',     value: 14, color: '#3b82f6' },
  { name: 'Senior Citizens',       value: 8,  color: '#a855f7' },
  { name: 'Petrol Operators',      value: 5,  color: '#71717a' },
]

// ─── Source relevance ─────────────────────────────────────────────────────────

const sourceRelevanceData = [
  { name: 'MOF — BUDI95 Policy Framework',       value: 96, color: '#3b82f6' },
  { name: 'PADU — Recipient Statistics Q1 2026', value: 94, color: '#3b82f6' },
  { name: 'World Bank — MY Fuel Subsidy (2025)', value: 89, color: '#3b82f6' },
  { name: 'MCMC — CMA 1998 Enforcement',         value: 86, color: '#3b82f6' },
  { name: 'IDEAS Malaysia — BUDI95 Assessment',  value: 82, color: '#3b82f6' },
  { name: 'Bernama — National Rollout Coverage', value: 78, color: '#3b82f6' },
  { name: 'EPU — Fiscal Savings Projection',     value: 75, color: '#3b82f6' },
]

// ─── Complaint themes ─────────────────────────────────────────────────────────

const complaintThemeData = [
  { name: 'MyKad Misuse Fear',         value: 62, color: '#ef4444' },
  { name: 'Foreigner Abuse Narrative', value: 52, color: '#f97316' },
  { name: 'Quota Complaints',          value: 41, color: '#f59e0b' },
  { name: 'Eligibility Errors',        value: 36, color: '#eab308' },
  { name: 'SOP Violations',            value: 28, color: '#94a3b8' },
  { name: 'Gig Worker Quota',          value: 23, color: '#3b82f6' },
  { name: 'T15 Loophole',             value: 19, color: '#22c55e' },
]

// ─── Sentiment data ───────────────────────────────────────────────────────────

const sentimentByPlatform = [
  { platform: 'WhatsApp',  positive: 12, neutral: 18, negative: 70 },
  { platform: 'Forums',    positive: 15, neutral: 20, negative: 65 },
  { platform: 'Facebook',  positive: 20, neutral: 25, negative: 55 },
  { platform: 'Twitter/X', positive: 28, neutral: 22, negative: 50 },
  { platform: 'News',      positive: 32, neutral: 30, negative: 38 },
  { platform: 'TikTok',    positive: 45, neutral: 25, negative: 30 },
]

const sentimentByWeek = [
  { period: 'Sep W1', positive: 20, neutral: 18, negative: 62 },
  { period: 'Sep W2', positive: 16, neutral: 15, negative: 69 },
  { period: 'Oct W1', positive: 12, neutral: 10, negative: 78 },
  { period: 'Oct W2', positive: 10, neutral: 8,  negative: 82 },
  { period: 'Nov W1', positive: 14, neutral: 12, negative: 74 },
  { period: 'Nov W2', positive: 18, neutral: 14, negative: 68 },
  { period: 'Dec W1', positive: 22, neutral: 18, negative: 60 },
  { period: 'Jan W1', positive: 25, neutral: 20, negative: 55 },
]

const overallSentiment = [
  { name: 'Negative', value: 62, color: '#ef4444' },
  { name: 'Neutral',  value: 14, color: '#94a3b8' },
  { name: 'Positive', value: 24, color: '#22c55e' },
]

const sentimentDrivers = [
  { name: 'Eligibility Denial / Dispute', value: 38, color: '#ef4444' },
  { name: 'Pump Verification Failure',    value: 28, color: '#f97316' },
  { name: 'PADU Misclassification',       value: 18, color: '#f59e0b' },
  { name: 'Misinformation / Hoax',        value: 10, color: '#a855f7' },
  { name: 'Other',                        value: 6,  color: '#71717a' },
]

// ─── Influencer data ──────────────────────────────────────────────────────────

const influencerReachData = [
  { name: 'Malaysiakini',    value: 1200, color: '#ef4444' },
  { name: 'Syed Saddiq',    value: 1100, color: '#ef4444' },
  { name: 'Bernama',         value: 900,  color: '#22c55e' },
  { name: 'The Star Online', value: 800,  color: '#94a3b8' },
  { name: 'MOF Malaysia',    value: 340,  color: '#22c55e' },
  { name: '@startup_kl',     value: 88,   color: '#22c55e' },
  { name: '@wargajohor',     value: 62,   color: '#ef4444' },
  { name: 'IDEAS Malaysia',  value: 55,   color: '#94a3b8' },
]

const influencerTimeline = [
  { date: 'Sep 2025', name: 'Bernama',         platform: 'News',       sentiment: 'Positive', reach: '900k',  event: 'National Rollout Coverage',  quote: 'PM confirms BUDI95 has prevented RM1.1 billion in subsidy leakage in the first six months — program on track.' },
  { date: 'Oct 2025', name: 'Malaysiakini',     platform: 'News',       sentiment: 'Negative', reach: '1.2M',  event: 'PADU Data Exposé',           quote: 'Fuel subsidy rollout exposes deep flaws in PADU data infrastructure — gig workers and rural communities hardest hit.' },
  { date: 'Oct 2025', name: '@wargajohor',       platform: 'Twitter/X',  sentiment: 'Negative', reach: '62k',   event: 'Viral Complaint Post',       quote: 'Went to pump petrol, MyKad reader rosak. Paid full RM3.22. Called helpline, 45 min on hold. #BUDI95gagal' },
  { date: 'Nov 2025', name: 'Syed Saddiq',       platform: 'Twitter/X',  sentiment: 'Negative', reach: '1.1M',  event: 'Parliamentary Opposition',   quote: 'BUDI95 should have been a simple subsidy. Instead 450,000 Malaysians are stuck in a bureaucratic nightmare.' },
  { date: 'Nov 2025', name: 'MOF Malaysia',       platform: 'Twitter/X',  sentiment: 'Positive', reach: '340k',  event: 'Fiscal Savings Defence',     quote: 'BUDI95 delivers RM4.2 billion in fiscal savings while protecting 8.6 million B40 households. The program is working.' },
  { date: 'Dec 2025', name: '@startup_kl',        platform: 'Twitter/X',  sentiment: 'Positive', reach: '88k',   event: 'Fintech Opportunity Signal', quote: "BUDI95's forced e-wallet adoption is great for Malaysian fintech. TnG and Boost seeing massive B40 onboarding." },
  { date: 'Feb 2026', name: 'The Star Online',    platform: 'News',       sentiment: 'Neutral',  reach: '800k',  event: 'Moderation Coverage',        quote: 'Complaint volume moderating — PADU Phase 2 corrections show early results, though 450,000 appeals remain unresolved.' },
  { date: 'Mar 2026', name: 'IDEAS Malaysia',      platform: 'Think Tank', sentiment: 'Neutral',  reach: '55k',   event: 'Independent Assessment',     quote: "Our assessment puts PADU income classification accuracy at 82% — below the government's 92% figure." },
]

// ─── Root causes ──────────────────────────────────────────────────────────────

const rootCauses = [
  {
    label: 'PADU Database Inaccuracy',
    desc: "An estimated 18% of registered households have filed eligibility disputes, suggesting material inaccuracies in PADU's income and household composition data. Irregular income earners (gig workers, small traders) are systematically over-classified.",
    color: 'border-red-500 bg-red-50 dark:bg-red-950/30',
    badge: 'Critical',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  },
  {
    label: 'Last-Mile Digital Infrastructure Gap',
    desc: "Pump-level MyKad readers and e-wallet pre-authorisation systems were not stress-tested at national rollout scale. Terminal failure rates peaked at ~12,000 incidents/week in October 2025. East Malaysia's lower connectivity compounds the problem.",
    color: 'border-orange-500 bg-orange-50 dark:bg-orange-950/30',
    badge: 'High',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  },
  {
    label: 'Eligibility Criteria Blind Spots',
    desc: 'The B40/M40 income threshold does not account for income volatility or household composition changes. The ~680,000 gig economy workers whose platform-reported earnings are inconsistently captured in LHDN records are systematically affected.',
    color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30',
    badge: 'High',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  },
  {
    label: 'Communication & Awareness Deficit',
    desc: 'Government communications relied heavily on MyGov portal updates — channels with low penetration in the B40 demographic. The resulting information vacuum was rapidly filled by WhatsApp chains and TikTok content, much of it inaccurate.',
    color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
    badge: 'Elevated',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  },
]

// ─── Risk assessment ──────────────────────────────────────────────────────────

const riskRows = [
  { risk: 'Mass PADU misclassification — political blowback from M40 group', likelihood: 'High', impact: 'High', mitigation: 'Accelerate PADU Phase 2 audit; introduce quarterly income re-verification; implement proactive SMS notification upon eligibility change' },
  { risk: 'Subsidy leakage via PADU data manipulation or straw-household registration', likelihood: 'Medium', impact: 'High', mitigation: 'Cross-reference PADU records with LHDN, EPF, and property ownership data; deploy anomaly detection on households with >3 registered vehicles' },
  { risk: 'Sustained pump-level technical failures undermining trust in digital verification', likelihood: 'High', impact: 'Medium', mitigation: 'Mandate KPDNHEP certification of terminal hardware before station activation; deploy fallback MyKad-only offline verification mode' },
  { risk: 'Localised fuel price inflation in rural / East Malaysian markets outside subsidy reach', likelihood: 'Medium', impact: 'Medium', mitigation: 'KPDNHEP price monitoring expansion to Sabah/Sarawak; increase rural station terminal coverage with MCMC broadband support' },
  { risk: 'CMA 1998 enforcement perceived as suppressing legitimate criticism of BUDI95', likelihood: 'Medium', impact: 'Medium', mitigation: 'MCMC to publish transparent criteria distinguishing misinformation enforcement from policy criticism' },
]

// ─── Solutions ────────────────────────────────────────────────────────────────

const solutions = [
  { solution: 'PADU Phase 2 income audit with gig/informal economy data integration', priority: 'Critical', effort: 'High',   impact: 'High',   owner: 'JPM / PADU / LHDN' },
  { solution: 'Offline MyKad-only fallback mode at all BUDI95-enabled pump terminals',  priority: 'Critical', effort: 'Medium', impact: 'High',   owner: 'KPDNHEP / MOF' },
  { solution: 'Proactive SMS / MyGov push notification on eligibility status change',   priority: 'High',     effort: 'Low',    impact: 'High',   owner: 'MAMPU / PADU' },
  { solution: 'Dedicated BUDI95 toll-free helpline with 48-hour appeal SLA',            priority: 'High',     effort: 'Medium', impact: 'High',   owner: 'MOF Customer Affairs' },
  { solution: 'Digital literacy outreach programme targeting elderly and rural recipients', priority: 'High', effort: 'High',   impact: 'Medium', owner: 'KKMM / KPDNHEP' },
  { solution: 'Real-time subsidy leakage and anomaly detection dashboard',              priority: 'Medium',   effort: 'High',   impact: 'High',   owner: 'MOF / EPU / PADU' },
]

const solutionCards = [
  {
    title: 'PADU Phase 2 Income Audit & Gig Economy Integration',
    priority: 'Critical',
    color: 'border-red-500 bg-red-50 dark:bg-red-950/30',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    problem: 'Approximately 450,000 eligibility appeals remain unresolved. Gig and informal workers (~680,000 individuals) are systematically misclassified because PADU relies on LHDN tax records that do not capture variable platform-based income.',
    actions: [
      'Integrate EPF, SOCSO, and gig platform (Grab, Foodpanda) earnings APIs into PADU income calculation engine',
      'Shift to quarterly income re-verification for households with documented income variability',
      'Mandate reason codes on all appeal rejections — currently 34% of rejections provide no explanation to the applicant',
      'Establish a 30-day fast-track SLA for first-time appeals and a dedicated M40 borderline review unit within PADU',
    ],
    outcome: 'Reduces misclassification from ~18% to below 8%; clears the 450,000-case backlog before the politically critical one-year anniversary milestone in September 2026.',
    owner: 'JPM / PADU / LHDN',
    timeline: 'Q2–Q3 2026',
  },
  {
    title: 'Offline Pump Verification Fallback Mode',
    priority: 'Critical',
    color: 'border-red-500 bg-red-50 dark:bg-red-950/30',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    problem: 'Terminal failure rates peaked at ~12,000 incidents/week in October 2025, forcing eligible users to pay the full RM3.22/L unsubsidised price. East Malaysia\'s lower broadband connectivity amplifies the problem.',
    actions: [
      'Deploy offline MyKad-only verification mode — cache eligibility locally on terminal for a 48-hour fallback window without server dependency',
      'Mandate KPDNHEP certification of all pump hardware before BUDI95 activation; publish a public certification registry for consumer verification',
      'Accelerate hardware upgrade programme to the remaining ~800 non-certified stations with government co-funding mechanism',
      'Implement automated e-wallet refund for eligible users verifiably charged at unsubsidised rate due to terminal or server failure',
    ],
    outcome: 'Eliminates the highest-anger event type in the complaint dataset ("paid full price despite being eligible"); reduces pump-level failure incidents by an estimated 85%.',
    owner: 'KPDNHEP / MOF',
    timeline: 'Q2–Q3 2026',
  },
  {
    title: 'Proactive Eligibility Communication & Digital Outreach',
    priority: 'High',
    color: 'border-orange-500 bg-orange-50 dark:bg-orange-950/30',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    problem: 'Users discover eligibility changes only at the pump — the highest-anger, highest-shareability event in the complaint dataset. Formal government communications reach fewer than 40% of the B40 target demographic.',
    actions: [
      'Send SMS to all registered recipients within 24 hours of any eligibility status change, with a direct PADU appeal link included',
      'Integrate BUDI95 status and in-app appeal flow into MyGov+ with push notification support for status changes',
      'Launch a WhatsApp chatbot for eligibility self-checks and appointment booking — meeting B40 users on their primary communication channel',
      'Partner with TikTok creators and Astro Awani for targeted explainer content in Bahasa Malaysia, Tamil, and Mandarin',
    ],
    outcome: 'Reduces pump-side eligibility dispute incidents by an estimated 60%; cuts BUDI95 helpline call volume by ~30%; closes the information vacuum that misinformation currently fills.',
    owner: 'MAMPU / PADU / KKMM',
    timeline: 'Q2 2026',
  },
  {
    title: 'Real-Time Subsidy Leakage & Anomaly Detection',
    priority: 'Medium',
    color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    problem: 'No real-time subsidy leakage monitoring currently exists. Straw-household registrations and high-volume vehicle abuse cannot be detected at scale without cross-agency data integration.',
    actions: [
      'Build a cross-agency data pipeline linking PADU, LHDN, EPF, JPJ, and PETRONAS transaction logs in a unified integrity dashboard',
      'Deploy ML-based anomaly detection for patterns: households with >3 registered vehicles, sudden income drops, or abnormally high weekly fuel volume relative to household size',
      'Publish quarterly BUDI95 integrity reports with aggregate leakage estimates (no individual-level data) to maintain public accountability',
      'Establish a public tip-off channel for suspected subsidy abuse, with a defined 30-day investigation SLA and outcome communication',
    ],
    outcome: 'Enables an estimated RM200–400M in additional annual fiscal savings through leakage reduction; strengthens the evidence base for program continuation in future Budget cycles.',
    owner: 'MOF / EPU / PADU',
    timeline: 'Q4 2026',
  },
]

// ─── Next steps ───────────────────────────────────────────────────────────────

const nextSteps = [
  { item: 'PADU Phase 2 income audit — integrate EPF, gig platform & LHDN data',      owner: 'JPM / PADU',      due: 'Q3 2026', status: 'In Progress',  statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
  { item: 'Pump terminal MyKad hardware upgrade — nationwide 3,200 stations',          owner: 'KPDNHEP',         due: 'Q3 2026', status: 'In Progress',  statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
  { item: 'BUDI95 eligibility appeal fast-track — 48-hour SLA implementation',         owner: 'MOF',             due: 'Q2 2026', status: 'Pending',      statusColor: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400' },
  { item: 'Proactive eligibility change SMS notification system (MyGov integration)',  owner: 'MAMPU / PADU',    due: 'Q2 2026', status: 'Pending',      statusColor: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400' },
  { item: 'MCMC BUDI95 misinformation monitoring dashboard (real-time)',               owner: 'MCMC',            due: 'Q2 2026', status: 'Not Started',  statusColor: 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500' },
  { item: 'Digital literacy outreach — elderly & rural rollout (KKMM partnership)',   owner: 'KKMM',            due: 'Q3 2026', status: 'Not Started',  statusColor: 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500' },
  { item: 'Subsidy leakage anomaly detection — cross-agency data pipeline build',     owner: 'MOF / EPU',       due: 'Q4 2026', status: 'Not Started',  statusColor: 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportArtifactView() {
  const theme = useChartTheme()

  const toc = [
    'Executive Summary',
    'Problem Statement',
    'Sentiment by Platform',
    'Influencer & Voice Analysis',
    'Fact-Check Analytics',
    'Most Impacted Demographics / Sectors',
    'Root Cause Breakdown',
    'Risk Assessment',
    'Suggested Solutions',
    'Data Confidence & Source Comparison',
    'Strategic Implications for Private Sector',
    'Monitoring, Alerts & Next Steps',
  ]

  return (
    <div className="px-6 py-6 pb-16 flex flex-col gap-10 w-full">

      {/* ── Report header ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 bg-slate-50 dark:bg-zinc-900 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">Intelligence Report</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 leading-snug">
              BUDI95 Intelligence Report<br />
              <span className="font-normal text-slate-500 dark:text-zinc-400">Is BUDI95 Creating More Benefits or More Concerns?</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">Prepared by Pulse Research · May 2026 · v2</p>
          </div>
          <div className="flex flex-col gap-1.5 text-right shrink-0">
            <MetaChip label="Classification" value="Internal" />
            <MetaChip label="Topic" value="Fuel Subsidy Policy / Public Sentiment" />
            <MetaChip label="Report Type" value="Research Report" />
            <MetaChip label="Sources Reviewed" value="14 web · 4 KB" />
            <MetaChip label="Est. Read" value="14 min" />
          </div>
        </div>
      </div>

      {/* ── Table of contents ─────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200 dark:border-zinc-700/60">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Table of Contents</p>
        </div>
        <div className="grid grid-cols-2 gap-0 divide-y divide-slate-100 dark:divide-zinc-800">
          {toc.map((item, i) => (
            <a
              key={item}
              href={`#section-${i + 1}`}
              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/40 hover:text-blue-700 dark:hover:text-blue-400 transition-colors col-span-1 border-r border-slate-100 dark:border-zinc-800 odd:border-r even:border-r-0"
            >
              <span className="text-xs font-medium text-slate-500 dark:text-zinc-400 tabular-nums w-4 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* ── 1. Executive Summary ───────────────────────────────────── */}
      <Section id="section-1" number={1} title="Executive Summary">
        <div className="flex flex-col gap-3 mb-4">
          <div className="rounded-lg border-l-4 border-teal-500 bg-teal-50 dark:bg-teal-950/30 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-1.5">Problem</p>
            <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
              BUDI95 launched in September 2025 to measured public acceptance — the program's fiscal savings rationale was broadly understood, and 8.6 million B40 and lower-M40 households enrolled within the first quarter. Eight months on, a deepening eligibility and infrastructure crisis has taken hold online. An estimated 450,000 households remain locked in unresolved appeals, pump-level verification failures peaked at ~12,000 incidents per week, and public complaint volume has surged +78% since national rollout — eroding confidence in the program's ability to deliver its core promise.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5">Top Finding</p>
            <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
              The complaint crisis is concentrated in four compounding failure modes: PADU database inaccuracy (~18% misclassification rate), last-mile pump infrastructure failures, eligibility blind spots for gig workers (~680,000 individuals), and a communication vacuum that misinformation has rushed to fill. These are not isolated incidents — they form a self-reinforcing feedback loop. Critically, negative voices command 1.85× the audience reach of positive voices, creating a perception gap that is significantly wider than the underlying operational reality of the program.
            </p>
          </div>
          <div className="rounded-lg border-l-4 border-amber-400 bg-amber-50 dark:bg-amber-950/30 px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5">Top Recommended Action</p>
            <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed">
              Launch an immediate eligibility transparency initiative — publish real-time PADU dispute resolution statistics at a public dashboard, activate the offline pump verification fallback mode within 60 days, and deploy proactive SMS notifications for all eligibility status changes. These three actions address the highest-anger complaint categories and close the communication vacuum that is amplifying negative sentiment well beyond its true operational scale.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <KpiCard value="62%"  label="Negative public sentiment share"       color="text-red-600 dark:text-red-400" />
          <KpiCard value="186k" label="Total monitored mentions (Sep–Apr)"    color="text-blue-600 dark:text-blue-400" />
          <KpiCard value="86%"  label="Analysis confidence level"             color="text-green-600 dark:text-green-400" />
        </div>
      </Section>

      {/* ── 2. Problem Statement ───────────────────────────────────── */}
      <Section id="section-2" number={2} title="Problem Statement">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          The BUDI95 rollout has exposed three compounding problem layers: a <strong className="text-slate-800 dark:text-zinc-200">data accuracy gap</strong> in the PADU household income registry, a <strong className="text-slate-800 dark:text-zinc-200">last-mile delivery failure</strong> at the physical pump interface, and a <strong className="text-slate-800 dark:text-zinc-200">communication vacuum</strong> that misinformation has rushed to fill.
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60 mb-5">
          <table className="w-full text-base border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Indicator', 'Value', 'Source'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['PADU-registered eligible households (B40 + lower M40)',           '8.6 million',          'MOF / PADU Q1 2026'],
                ['Estimated households with pending eligibility appeals',            '~450,000',             'JPM Helpdesk, Feb 2026'],
                ['Share of registered recipients disputing classification',          '~18%',                 'IDEAS Malaysia 2026'],
                ['Average weekly pump verification failures (Oct 2025 peak)',        '~12,000 incidents',    'KPDNHEP Field Report'],
                ['Subsidised price vs. unsubsidised floating price',                'RM1.99 vs. RM3.22/L',  'MOF / PETRONAS, May 2026'],
                ['Social media false claims flagged by MCMC',                       '340+ items',           'MCMC Enforcement, 2025–26'],
                ['Gig economy workers excluded from B40 classification',            '~680,000 individuals', 'EPU / DOSM 2025'],
                ['YoY complaint volume increase since national rollout',             '+78%',                 'KPDNHEP / Helpline Data'],
              ].map(([ind, val, src], i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2 text-sm text-slate-700 dark:text-zinc-300">{ind}</td>
                  <td className="px-3 py-2 text-sm font-semibold text-slate-900 dark:text-zinc-100">{val}</td>
                  <td className="px-3 py-2 text-sm text-slate-500 dark:text-zinc-400">{src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
          <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-1">Evolution of the Issue Over Time</p>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mb-4">Public engagement across all monitored platforms · spikes annotated with the KOL or publisher that triggered them</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            {/* Total engagement */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-2">Total Engagement</p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={engagementTrend} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: theme.text, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: theme.text, fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                  <Tooltip
                    contentStyle={{ backgroundColor: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 6, fontSize: 11, color: theme.tooltip.text }}
                    labelStyle={{ color: theme.tooltip.label, fontSize: 10, marginBottom: 2 }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(v: any) => [typeof v === 'number' ? v.toLocaleString() : v, 'Total']}
                  />
                  <Area type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} fill="url(#totalGrad)" dot={false} activeDot={{ r: 4 }} />
                  <ReferenceLine x="Jun 25" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1.5} />
                  <ReferenceLine x="Oct 25" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} />
                  <ReferenceLine x="Nov 25" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} />
                  <ReferenceLine x="Feb 26" stroke="#f97316" strokeDasharray="3 3" strokeWidth={1.5} />
                  <ReferenceLine x="Apr 26" stroke="#22c55e" strokeDasharray="3 3" strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Breakdown by type */}
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 mb-2">Breakdown by Type</p>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={engagementTrend} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: theme.text, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: theme.text, fontSize: 10 }} axisLine={false} tickLine={false}
                    tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
                  <Tooltip
                    contentStyle={{ backgroundColor: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 6, fontSize: 11, color: theme.tooltip.text }}
                    labelStyle={{ color: theme.tooltip.label, fontSize: 10, marginBottom: 2 }}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(v: any, name: any) => [typeof v === 'number' ? v.toLocaleString() : v, name]}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
                  <Line type="monotone" dataKey="likes"    name="Likes"    stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="shares"   name="Shares"   stroke="#f97316" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="comments" name="Comments" stroke="#a855f7" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                  <ReferenceLine x="Jun 25" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1.5} />
                  <ReferenceLine x="Oct 25" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} />
                  <ReferenceLine x="Nov 25" stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1.5} />
                  <ReferenceLine x="Feb 26" stroke="#f97316" strokeDasharray="3 3" strokeWidth={1.5} />
                  <ReferenceLine x="Apr 26" stroke="#22c55e" strokeDasharray="3 3" strokeWidth={1.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          {timelineEvents.map(ev => (
            <div key={ev.date} className="flex items-start gap-3">
              <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${ev.color}`} />
              <div>
                <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">{ev.date} — {ev.label}</span>
                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mt-0.5">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 3. Sentiment by Platform ───────────────────────────────── */}
      <Section id="section-3" number={3} title="Sentiment by Platform">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Sentiment distribution across monitored platforms (Sep 2025 – Apr 2026). WhatsApp and Forums are the most hostile channels — both operate with minimal moderation and high peer-trust dynamics, making them primary vectors for complaint amplification and misinformation. TikTok skews more positive, driven by government agency content. The overall score sits at <strong className="text-slate-800 dark:text-zinc-200">62% negative</strong>, though this over-represents vocal dissenters relative to the silent majority successfully using the subsidy.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
            <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-1">Sentiment by Platform</p>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mb-3">% positive / neutral / negative per channel</p>
            <SentimentStackedBar data={sentimentByPlatform} xKey="platform" height={220} horizontal />
            <div className="flex items-center gap-4 mt-3">
              {[
                { label: 'Positive', color: 'bg-green-400' },
                { label: 'Neutral',  color: 'bg-slate-300 dark:bg-zinc-600' },
                { label: 'Negative', color: 'bg-red-400' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full ${l.color}`} />
                  <span className="text-xs text-slate-500 dark:text-zinc-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
              <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-3">Overall Sentiment</p>
              <DonutChart data={overallSentiment} height={150} innerRadius={42} valueFormatter={v => `${v}%`} />
              <div className="flex items-center justify-center gap-4 mt-2">
                {overallSentiment.map(s => (
                  <div key={s.name} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-slate-500 dark:text-zinc-400">{s.name} ({s.value}%)</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
              <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-3">Top Negative Sentiment Drivers</p>
              <HorizontalBar data={sentimentDrivers} valueFormatter={v => `${v}%`} />
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
          <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-1">Weekly Sentiment Trend (Sep 2025 – Jan 2026)</p>
          <p className="text-xs text-slate-400 dark:text-zinc-500 mb-3">Negative sentiment peaked at 82% in Oct W2, coinciding with East Malaysia rollout and terminal failure surge</p>
          <SentimentStackedBar data={sentimentByWeek} xKey="period" height={200} />
        </div>
      </Section>

      {/* ── 4. Influencer & Voice Analysis ────────────────────────── */}
      <Section id="section-4" number={4} title="Influencer & Voice Analysis">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Top voices shaping the BUDI95 narrative, ranked by audience reach. Negative voices command significantly higher organic reach — driven by high-emotion personal experiences that generate strong sharing behaviour. The timeline below shows when each major voice entered the discourse and what event triggered their post.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
            <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-1">Top Voices by Audience Reach</p>
            <p className="text-xs text-slate-400 dark:text-zinc-500 mb-3">Estimated combined reach (followers / monthly readers, in thousands)</p>
            <HorizontalBar data={influencerReachData} valueFormatter={v => `${v}k`} />
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
            <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-3">Sentiment Balance by Voice Type</p>
            <DonutChart
              data={[
                { name: 'Negative voices', value: 3, color: '#ef4444' },
                { name: 'Positive voices', value: 3, color: '#22c55e' },
                { name: 'Neutral / Analytical', value: 2, color: '#94a3b8' },
              ]}
              height={150}
              innerRadius={42}
            />
            <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 px-3 py-2">
              <p className="text-xs text-amber-700 dark:text-amber-300">
                <strong>Reach imbalance:</strong> Negative voices (Malaysiakini + Syed Saddiq) command 2.3M combined reach vs. 1.24M for positive voices — a 1.85× amplification disadvantage for the pro-program narrative.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200 dark:border-zinc-700/60">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Voice Timeline — When Key Voices Spoke Out</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-base border-collapse">
              <thead className="bg-slate-50 dark:bg-zinc-800">
                <tr>
                  {['Period', 'Voice / Publisher', 'Platform', 'Sentiment', 'Reach', 'Trigger Event', 'Key Quote'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {influencerTimeline.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                    <td className="px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-zinc-300 whitespace-nowrap">{row.date}</td>
                    <td className="px-3 py-2.5 text-sm font-semibold text-slate-800 dark:text-zinc-100 whitespace-nowrap">{row.name}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-500 dark:text-zinc-400 whitespace-nowrap">{row.platform}</td>
                    <td className="px-3 py-2.5"><SentimentBadge sentiment={row.sentiment} /></td>
                    <td className="px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-zinc-300 whitespace-nowrap">{row.reach}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-zinc-400 whitespace-nowrap">{row.event}</td>
                    <td className="px-3 py-2.5 text-sm text-slate-500 dark:text-zinc-400 italic max-w-xs">"{row.quote}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 px-4 py-3">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Narrative gap identified:</strong> No credible independent positive voice exists outside government channels. Civil society and think tank voices (IDEAS, World Bank) occupy the neutral tier — there is no non-government advocate actively defending the program's design rationale to a mass audience. This vacuum is a strategic communication risk.
          </p>
        </div>
      </Section>

      {/* ── 5. Fact-Check Analytics ────────────────────────────────── */}
      <Section id="section-5" number={5} title="Fact-Check Analytics">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Analysis of public discourse themes, audience segments generating the highest complaint volume, and geographic distribution of negative mentions across Malaysia. Of 47 web and social sources retrieved, <strong className="text-slate-800 dark:text-zinc-200">14 were retained</strong> after relevance and credibility filtering.
        </p>

        <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200 mb-2">5.1 Complaint Theme Breakdown</p>
        <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900 mb-4">
          <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-1">Negative mention themes — BUDI95</p>
          <HorizontalBar data={complaintThemeData} valueFormatter={v => `${v}%`} />
          <p className="text-xs text-slate-400 dark:text-zinc-500 mt-3">Percentages exceed 100% as individual mentions may cite multiple themes.</p>
        </div>

        <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200 mb-2">5.2 Audience Segmentation</p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60 mb-4">
          <table className="w-full text-base border-collapse">
            <thead className="bg-slate-800 dark:bg-zinc-700">
              <tr>
                {['Segment', 'Share', 'Primary Complaint', 'Platform'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-white px-3 py-2.5 border-b border-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Everyday recipients',    '38%', 'Eligibility errors, MyKad chip issues, quota running out',         'Facebook, WhatsApp, Google Reviews'],
                ['Fear amplifiers',        '31%', 'Foreigner abuse, Singaporean IC borrowing, enforcement inadequacy', 'Facebook groups, X/Twitter'],
                ['Gig / e-hailing workers','18%', 'Quota ceiling too low, exemption process unclear',                 'TikTok, Telegram groups'],
                ['Political commentators', '13%', 'T15 loophole, subsidy fairness, fiscal sustainability',            'Malaysia Kini, X, blogs'],
              ].map(([seg, share, complaint, platform], i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-zinc-200">{seg}</td>
                  <td className="px-3 py-2.5 text-sm font-semibold text-slate-900 dark:text-zinc-100">{share}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-zinc-400">{complaint}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-500 dark:text-zinc-400">{platform}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200 mb-2">5.3 Geographic Distribution</p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60 mb-4">
          <table className="w-full text-base border-collapse">
            <thead className="bg-slate-800 dark:bg-zinc-700">
              <tr>
                {['State / Region', 'Mention Volume', 'Complaint Intensity', 'Top Complaint'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-white px-3 py-2.5 border-b border-slate-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Selangor',       'High (34%)',    'Medium',    'Foreigner narrative, quota concerns'],
                ['Kuala Lumpur',   'High (24%)',    'Medium',    'MyKad SOP violations, T15 debate'],
                ['Johor',          'Medium (16%)',  'Very high', 'Singaporean abuse fears (border proximity)'],
                ['Penang',         'Medium (10%)',  'High',      'Eligibility errors, gig worker quota'],
                ['Sabah / Sarawak','Low (8%)',      'High',      'Awareness gaps, MyKad chip issues'],
                ['Other states',   'Low (8%)',      'Low',       'General eligibility queries'],
              ].map(([state, vol, intensity, complaint], i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-zinc-200">{state}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-zinc-400">{vol}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-zinc-400">{intensity}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-500 dark:text-zinc-400">{complaint}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 px-4 py-3">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>3 sources flagged</strong> for partisan or politically motivated framing (two opposition-aligned blogs, one industry lobby publication) and excluded from synthesis. Viral social media content retained for sentiment volume analysis only — not used as factual reference.
          </p>
        </div>
      </Section>

      {/* ── 6. Most Impacted Demographics / Sectors ───────────────── */}
      <Section id="section-6" number={6} title="Most Impacted Demographics / Sectors">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          BUDI95's impact is unevenly distributed. Implementation friction concentrates harm in specific demographic and economic segments — particularly those with irregular income patterns, low digital literacy, or operational dependence on fuel.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
            <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-1">Impact Concentration by Segment (%)</p>
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-3">Share of documented concern volume by demographic</p>
            <DonutChart data={sectorRiskData} height={180} innerRadius={48} valueFormatter={v => `${v}%`} />
            <div className="grid grid-cols-1 gap-1 mt-3">
              {sectorRiskData.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-sm text-slate-600 dark:text-zinc-400">{s.name}</span>
                  <span className="ml-auto text-sm font-medium text-slate-700 dark:text-zinc-300">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
            <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-3">Concern Count by Segment</p>
            <HorizontalBar
              data={[
                { name: 'Logistics & Transport', value: 9, color: '#ef4444' },
                { name: 'Gig Economy Workers',   value: 7, color: '#f97316' },
                { name: 'M40 Borderline',        value: 6, color: '#f59e0b' },
                { name: 'Rural Communities',     value: 5, color: '#3b82f6' },
                { name: 'Senior Citizens',       value: 4, color: '#a855f7' },
                { name: 'Petrol Operators',      value: 3, color: '#71717a' },
              ]}
              valueFormatter={v => `${v} concerns`}
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
          <table className="w-full text-base border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Demographic', 'Risk Level', 'Primary Concern', 'Eligibility Status', 'Primary Regulator'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Logistics & Transport Sector',            'Critical', 'High operational fuel dependency; commercial fleets excluded from residential subsidy',                      'Excluded (commercial)',        'KPDN / JPJ'],
                ['Gig Economy Workers',                     'High',     'Irregular income misread by PADU as above-threshold; ~680K classified outside B40',                         'Partial / Disputed',           'MOF / EPU / PADU'],
                ['M40 Borderline Earners',                  'High',     'Households near the B40/M40 income boundary experience volatility in eligibility status',                   'Conditional / Fluctuating',    'MOF / PADU'],
                ['Rural Communities (Sabah/Sarawak)',       'High',     'Limited petrol station terminal coverage; e-wallet penetration low; MyKad reader uptake lagging',          'Eligible but under-served',    'KPDNHEP / MCMC'],
                ['Senior Citizens / Low Digital Literacy', 'Elevated', 'e-Wallet setup barriers and pump self-service failure lead to effective exclusion of eligible users',       'Eligible but access-impaired', 'KKMM / MOF'],
                ['Petrol Station Operators',                'Elevated', 'Cash-flow timing mismatch between subsidy disbursement and fuel purchase cost; terminal upgrade burden',   'Not applicable',               'KPDNHEP / PETRONAS'],
              ].map(([demo, risk, concern, eligibility, regulator], i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-zinc-200">{demo}</td>
                  <td className="px-3 py-2.5"><RiskBadge level={risk} /></td>
                  <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-zinc-400">{concern}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-zinc-400">{eligibility}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-500 dark:text-zinc-400">{regulator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 7. Root Cause Breakdown ────────────────────────────────── */}
      <Section id="section-7" number={7} title="Root Cause Breakdown">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Four structural root causes underpin BUDI95's rollout friction. These are not independent — they compound one another. PADU inaccuracy generates eligibility disputes; disputes generate media coverage; media coverage generates misinformation; misinformation generates MCMC enforcement; and enforcement generates its own public blowback. Resolving any one in isolation addresses symptoms, not the system.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rootCauses.map(rc => (
            <div key={rc.label} className={`rounded-xl border-l-4 p-4 ${rc.color}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-base font-semibold text-slate-800 dark:text-zinc-100">{rc.label}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${rc.badgeColor}`}>{rc.badge}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">{rc.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 8. Risk Assessment ────────────────────────────────────── */}
      <Section id="section-8" number={8} title="Risk Assessment">
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
          <table className="w-full text-base border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Risk', 'Likelihood', 'Impact', 'Mitigation'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riskRows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-sm text-slate-700 dark:text-zinc-300">{row.risk}</td>
                  <td className="px-3 py-2.5"><LikelihoodBadge level={row.likelihood} /></td>
                  <td className="px-3 py-2.5"><LikelihoodBadge level={row.impact} /></td>
                  <td className="px-3 py-2.5 text-sm text-slate-500 dark:text-zinc-400">{row.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 9. Suggested Solutions ────────────────────────────────── */}
      <Section id="section-9" number={9} title="Suggested Solutions">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Six prioritised interventions across data infrastructure, last-mile delivery, communications, and fiscal integrity. The four highest-priority actions are detailed below with concrete implementation steps and expected outcomes.
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60 mb-5">
          <table className="w-full text-base border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Solution', 'Priority', 'Effort', 'Impact', 'Owner'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {solutions.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-sm text-slate-700 dark:text-zinc-300">{row.solution}</td>
                  <td className="px-3 py-2.5"><RiskBadge level={row.priority} /></td>
                  <td className="px-3 py-2.5"><EffortBadge level={row.effort} /></td>
                  <td className="px-3 py-2.5"><LikelihoodBadge level={row.impact} /></td>
                  <td className="px-3 py-2.5 text-sm text-slate-500 dark:text-zinc-400 whitespace-nowrap">{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm font-semibold text-slate-700 dark:text-zinc-200 mb-3">Detailed Action Plans</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {solutionCards.map(card => (
            <div key={card.title} className={`rounded-xl border-l-4 p-4 ${card.color}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{card.title}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${card.badgeColor}`}>{card.priority}</span>
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Problem</p>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-3">{card.problem}</p>
              <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Action Steps</p>
              <ul className="flex flex-col gap-1.5 mb-3">
                {card.actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 shrink-0" />
                    {action}
                  </li>
                ))}
              </ul>
              <p className="text-xs font-medium text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1">Expected Outcome</p>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-2">{card.outcome}</p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-slate-500 dark:text-zinc-400">Owner: <span className="font-medium text-slate-700 dark:text-zinc-300">{card.owner}</span></span>
                <span className="text-xs text-slate-500 dark:text-zinc-400">Target: <span className="font-medium text-slate-700 dark:text-zinc-300">{card.timeline}</span></span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 10. Data Confidence & Source Comparison ───────────────── */}
      <Section id="section-10" number={10} title="Data Confidence & Source Comparison">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Points of divergence between official government data and independent assessments. Official metrics consistently present BUDI95 more favourably — not because the data is fabricated, but because it measures implementation inputs (registrations, fiscal savings) rather than implementation outcomes (user experience, eligibility accuracy, sentiment).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200 dark:border-zinc-700/60">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Points of Divergence</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {[
                ['Eligible recipients count',             '7.5M – 9.1M',     'MOF registered PADU figure (8.6M) used as primary reference; range reflects pending registration approvals and contested household compositions'],
                ['Annual fiscal savings projection',      'RM3.8B – RM5.1B', 'EPU mid-range projection (RM4.2B) retained; range reflects RON95 global price volatility assumptions across scenarios'],
                ['PADU income classification accuracy',   '78% – 92%',       'IDEAS Malaysia independent assessment (82%) used; government figure (92%) measures technical registration success rate, not income data correctness'],
              ].map(([topic, range, resolution], i) => (
                <div key={i} className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-200">{topic}</p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">Source range: <span className="font-medium text-slate-600 dark:text-zinc-400">{range}</span></p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5 italic">{resolution}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
              <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-3">Source Relevance Scores (Top 7)</p>
              <HorizontalBar data={sourceRelevanceData} valueFormatter={v => `${v}`} />
            </div>
            <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
              <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-3">Benchmark Comparison</p>
              <HorizontalBar
                data={[
                  { name: 'This Analysis',            value: 12, color: '#3b82f6' },
                  { name: 'IDEAS Malaysia Audit',     value: 9,  color: '#94a3b8' },
                  { name: 'World Bank Reform Review', value: 8,  color: '#94a3b8' },
                  { name: 'MOF Official Assessment',  value: 5,  color: '#94a3b8' },
                ]}
                valueFormatter={v => `${v} concern areas`}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── 11. Strategic Implications for Private Sector ─────────── */}
      <Section id="section-11" number={11} title="Strategic Implications for Private Sector">
        <Callout color="blue">
          BUDI95's rollout has created a newly segmented, income-verified consumer base of <strong>8.6 million B40 and lower-M40 households</strong>. The program's friction points are simultaneously a public policy problem and a <strong>private sector opportunity</strong>: the gaps government cannot fill quickly enough create commercial openings for fintech, insurance, logistics, and data infrastructure players.
        </Callout>

        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
          <table className="w-full text-base border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Sector', 'Sentiment Signal', 'Opportunity', 'Risk Exposure', 'Urgency'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Fintech & E-wallets',             'UX failures blamed on TnG / Boost in 28% of pump complaints',     'High',     'Medium',   'Immediate'],
                ['Petrol Station Operators',         'Terminal non-compliance cited in 22% of KPDNHEP complaints',       'Medium',   'High',     'Immediate'],
                ['Logistics & Fleet Operators',      'Commercial exclusion driving 32% of sector concern volume',        'Low',      'Critical', 'Immediate'],
                ['B40-focused Consumer Brands',      '8.6M income-verified households — highest-ever B40 segmentation', 'High',     'Low',      'Q3 2026'],
                ['Insurance & Financial Services',   'Income stress clusters visible in PADU dispute geography',         'Medium',   'Low',      'Q3 2026'],
                ['RegTech & Data Verification',      'PADU 18% inaccuracy rate signals demand for better tooling',       'High',     'Low',      'Q4 2026'],
              ].map(([sector, signal, opp, risk, urgency], i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-zinc-200 whitespace-nowrap">{sector}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-zinc-400">{signal}</td>
                  <td className="px-3 py-2.5"><LikelihoodBadge level={opp} /></td>
                  <td className="px-3 py-2.5"><RiskBadge level={risk} /></td>
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-zinc-300 whitespace-nowrap">{urgency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              sector: 'Fintech & E-wallets (TnG, Boost, MAE)',
              color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
              badge: 'High Opportunity',
              badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
              points: [
                'BUDI95 forces first-time e-wallet adoption among B40 users — largest onboarding event in Malaysian fintech history.',
                'Pump-side UX failures are being attributed to e-wallets in public discourse, creating brand risk even when the fault is terminal hardware.',
                'Recommended action: Launch a dedicated BUDI95 onboarding flow, waive minimum balance requirements for subsidy transactions, and publish a clear user-facing explainer separating e-wallet limits from BUDI95 eligibility.',
              ],
            },
            {
              sector: 'Petrol Station Operators',
              color: 'border-orange-500 bg-orange-50 dark:bg-orange-950/30',
              badge: 'High Risk',
              badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
              points: [
                'Hardware upgrade cost burden falls on operators — estimated RM8,000–15,000 per terminal for KPDNHEP-certified readers.',
                'Non-compliant stations face spot inspections and fines under the Price Control & Anti-Profiteering Act 2011.',
                'Recommended action: Prioritise terminal certification ahead of KPDNHEP enforcement escalation in Q3 2026; explore loyalty programme partnerships with e-wallet providers to capture BUDI95 user repeat visits.',
              ],
            },
            {
              sector: 'Logistics & Fleet Operators',
              color: 'border-red-500 bg-red-50 dark:bg-red-950/30',
              badge: 'Critical Risk',
              badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
              points: [
                'Commercial and fleet vehicles are explicitly excluded from BUDI95 eligibility — a RM1.23/L price gap versus eligible private users creates a structural cost disadvantage.',
                'Sentiment data shows logistics sector contributing 32% of professional sector complaint volume, the highest of any group.',
                'Recommended action: Negotiate long-term fuel supply contracts to hedge against floating price exposure; engage KPDNHEP through industry associations on commercial fleet subsidy inclusion in the next Budget cycle.',
              ],
            },
            {
              sector: 'B40-focused Consumer Brands',
              color: 'border-green-500 bg-green-50 dark:bg-green-950/30',
              badge: 'High Opportunity',
              badgeColor: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
              points: [
                'PADU has created the most accurate B40 household dataset in Malaysian history — 8.6M verified recipients with known income bands, household sizes, and geographic distribution.',
                'Each eligible household saves approximately RM1.23/L on RON95 — equivalent to RM60–120/month in freed-up consumer spending.',
                'Recommended action: Use BUDI95 eligibility geography to target below-the-line marketing in high-density B40 districts; time campaigns to coincide with PADU Phase 2 stabilisation in Q3 2026 when consumer confidence recovers.',
              ],
            },
          ].map(card => (
            <div key={card.sector} className={`rounded-xl border-l-4 p-4 ${card.color}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{card.sector}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${card.badgeColor}`}>{card.badge}</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {card.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-400 dark:bg-zinc-500 shrink-0" />
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Callout color="amber">
          <strong>Decision-ready summary:</strong> If you are a <strong>fintech company</strong>, act now on UX — the B40 onboarding window is open but brand risk is accumulating. If you are a <strong>consumer brand</strong>, wait for PADU Phase 2 stabilisation (Q3 2026) then target with confidence. If you are in <strong>logistics</strong>, this is a cost management problem — escalate to procurement and government affairs immediately. If you are building <strong>data or RegTech infrastructure</strong>, PADU's 18% inaccuracy rate is a market signal: demand for better income verification tooling is real and policy-backed.
        </Callout>
      </Section>

      {/* ── 12. Monitoring, Alerts & Next Steps ───────────────────── */}
      <Section id="section-12" number={12} title="Monitoring, Alerts & Next Steps">
        <Callout color="amber">
          If PADU Phase 2 corrections do not resolve the 450,000 pending appeals by Q3 2026, the program faces a politically significant milestone: <strong>one year of unresolved disputes</strong>. This will provide opposition parties and civil society groups with a materially stronger narrative than anything generated during the rollout period. The window to stabilise is Q2–Q3 2026.
        </Callout>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
          <table className="w-full text-base border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Action Item', 'Owner', 'Due', 'Status'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nextSteps.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-sm text-slate-700 dark:text-zinc-300">{row.item}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-500 dark:text-zinc-400 whitespace-nowrap">{row.owner}</td>
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-zinc-300 whitespace-nowrap">{row.due}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${row.statusColor}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ id, number, title, children }: {
  id: string
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="flex flex-col gap-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold">
          {number}
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-zinc-50">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function Callout({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'amber' }) {
  const styles = {
    blue: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/40 text-blue-800 dark:text-blue-200',
    amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-200',
  }
  return (
    <div className={`rounded-lg border px-4 py-3 text-base leading-relaxed ${styles[color]}`}>
      {children}
    </div>
  )
}

function KpiCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 px-4 py-3 flex flex-col gap-0.5">
      <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
      <p className="text-sm text-slate-500 dark:text-zinc-400 leading-snug">{label}</p>
    </div>
  )
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <span className="text-xs text-slate-500 dark:text-zinc-400">{label}:</span>
      <span className="text-xs font-medium text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{value}</span>
    </div>
  )
}

function RiskBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Critical: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    High: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
    Elevated: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    Medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    Low: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${styles[level] ?? styles.Low}`}>{level}</span>
  )
}

function LikelihoodBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    High: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    Low: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${styles[level] ?? styles.Low}`}>{level}</span>
  )
}

function EffortBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Low: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    High: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${styles[level] ?? styles.Medium}`}>{level}</span>
  )
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const styles: Record<string, string> = {
    Negative: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    Positive: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    Neutral:  'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
  }
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${styles[sentiment] ?? styles.Neutral}`}>{sentiment}</span>
  )
}
