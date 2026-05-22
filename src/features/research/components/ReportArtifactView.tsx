import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import DonutChart from '../../analytics/components/charts/DonutChart'
import HorizontalBar from '../../analytics/components/charts/HorizontalBar'
import { useChartTheme } from '../../analytics/hooks/useChartTheme'

// ─── Mock chart data ──────────────────────────────────────────────────────────

const complaintTrend = [
  { month: 'Jan', complaints: 820 },
  { month: 'Feb', complaints: 870 },
  { month: 'Mar', complaints: 910 },
  { month: 'Apr', complaints: 980 },
  { month: 'May', complaints: 1050 },
  { month: 'Jun', complaints: 1140 },
  { month: 'Jul', complaints: 1220 },
  { month: 'Aug', complaints: 1310 },
  { month: 'Sep', complaints: 1180 },
  { month: 'Oct', complaints: 1290 },
  { month: 'Nov', complaints: 1390 },
  { month: 'Dec', complaints: 1480 },
  { month: 'Jan 26', complaints: 1540 },
  { month: 'Feb 26', complaints: 1600 },
  { month: 'Mar 26', complaints: 1680 },
]

const sectorRiskData = [
  { name: 'Real Estate', value: 44, color: '#ef4444' },
  { name: 'Private Equity', value: 20, color: '#f97316' },
  { name: 'Professional Svcs', value: 16, color: '#f59e0b' },
  { name: 'Trade Finance', value: 12, color: '#3b82f6' },
  { name: 'Digital Assets', value: 8, color: '#a855f7' },
]

const sourceRelevanceData = [
  { name: 'FinCEN 2025', value: 97, color: '#3b82f6' },
  { name: 'FATF Guidance', value: 95, color: '#3b82f6' },
  { name: 'Global Fin. Integrity', value: 91, color: '#3b82f6' },
  { name: 'SEC Enforcement', value: 89, color: '#3b82f6' },
  { name: 'OCCRP 2026', value: 86, color: '#3b82f6' },
  { name: 'IMF Working Paper', value: 83, color: '#3b82f6' },
  { name: 'UK Companies House', value: 80, color: '#3b82f6' },
]

const triggerCategoryData = [
  { name: 'Entity-Level', value: 6, color: '#3b82f6' },
  { name: 'Transactional', value: 4, color: '#f59e0b' },
  { name: 'Compliance', value: 2, color: '#a855f7' },
]

// ─── Complaint timeline events ────────────────────────────────────────────────

const timelineEvents = [
  {
    date: 'Jan 2025',
    label: 'Baseline period',
    desc: 'Pre-surge activity level. Steady complaint volume consistent with prior 18-month average.',
    color: 'bg-slate-400',
  },
  {
    date: 'Jun 2025',
    label: 'Mid-year acceleration',
    desc: 'Complaint filings begin accelerating. FinCEN attributes initial surge to CTA non-compliance becoming visible.',
    color: 'bg-amber-500',
  },
  {
    date: 'Oct 2025',
    label: 'OCCRP investigation published',
    desc: 'OCCRP releases 12,000-entity shell company network analysis, triggering regulatory attention and public reporting.',
    color: 'bg-blue-500',
  },
  {
    date: 'Mar 2026',
    label: '+60% threshold crossed',
    desc: 'Year-over-year complaint volume exceeds +60% growth — a level last seen only during post-2008 enforcement sweeps.',
    color: 'bg-red-500',
  },
]

// ─── Root causes ──────────────────────────────────────────────────────────────

const rootCauses = [
  {
    label: 'Beneficial Ownership Opacity',
    desc: 'Most jurisdictions still permit multi-tier ownership structures that cannot be traced to a natural person within three layers. This is the single most exploitable structural gap.',
    color: 'border-red-500 bg-red-50 dark:bg-red-950/30',
    badge: 'Critical',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  },
  {
    label: 'CTA Compliance Gap',
    desc: 'US beneficial ownership filing compliance remains below 60% among pre-existing entities as of Q1 2026. The regulatory blind spot is largest in the highest-risk sectors.',
    color: 'border-orange-500 bg-orange-50 dark:bg-orange-950/30',
    badge: 'High',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  },
  {
    label: 'Regulatory Arbitrage',
    desc: 'Delaware, Nevada, BVI, and Cayman Islands appear in 60%+ of cross-border investigations. Jurisdiction-shopping exploits inconsistent disclosure standards across borders.',
    color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30',
    badge: 'High',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  },
  {
    label: 'Structural Industry Tolerance',
    desc: 'Real estate and private equity have historically accepted beneficial ownership opacity as a commercial privacy feature. This tolerance creates embedded vulnerability that monitoring systems are not calibrated to detect.',
    color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
    badge: 'Elevated',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  },
]

// ─── Risk assessment rows ─────────────────────────────────────────────────────

const riskRows = [
  { risk: 'Enforcement action — real estate sector', likelihood: 'High', impact: 'High', mitigation: 'UBO-level KYB at onboarding across all RE transactions; not as EDD threshold' },
  { risk: 'CTA enforcement escalation H2 2026', likelihood: 'High', impact: 'Medium', mitigation: 'Audit pre-existing entity BO filings immediately; remediate gaps before H2 2026 enforcement window' },
  { risk: 'SAR filing under-reporting', likelihood: 'Medium', impact: 'High', mitigation: 'Review thresholds against updated typology evidence; recalibrate to current dormancy-plus-transaction patterns' },
  { risk: 'Crypto-real estate combined typology', likelihood: 'Medium', impact: 'High', mitigation: 'Deploy combined monitoring spanning both crypto and RE transaction streams; current siloed tools are blind to the structure' },
  { risk: 'AMLA obliged entity designation (EU)', likelihood: 'Medium', impact: 'Medium', mitigation: 'Assess designation risk using AMLA criteria; prepare compliance posture ahead of mid-2026 announcement' },
]

// ─── Suggested solutions ──────────────────────────────────────────────────────

const solutions = [
  { solution: 'UBO-level KYB as onboarding default in high-risk sectors', priority: 'Critical', effort: 'Medium', impact: 'High', owner: 'KYB / Compliance' },
  { solution: 'Dormancy signal integration into transaction monitoring', priority: 'Critical', effort: 'High', impact: 'High', owner: 'TM Engineering' },
  { solution: 'SAR threshold review against updated typologies', priority: 'High', effort: 'Low', impact: 'High', owner: 'FinCrime' },
  { solution: 'Combined crypto-RE shell monitoring layer', priority: 'High', effort: 'High', impact: 'High', owner: 'TM Engineering' },
  { solution: 'Pre-existing entity BO filing audit and remediation', priority: 'High', effort: 'Medium', impact: 'Medium', owner: 'Compliance Ops' },
  { solution: 'Jurisdiction red-flag registry (DE, NV, BVI, Cayman)', priority: 'Medium', effort: 'Low', impact: 'Medium', owner: 'KYB / Compliance' },
]

// ─── Next steps table ─────────────────────────────────────────────────────────

const nextSteps = [
  { item: 'Audit pre-existing entity BO filings', owner: 'Compliance Ops', due: 'Q2 2026', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
  { item: 'Update KYB procedure — UBO default for RE and PE', owner: 'KYB Team', due: 'Q2 2026', status: 'Pending', statusColor: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400' },
  { item: 'TM dormancy signal specification', owner: 'TM Engineering', due: 'Q3 2026', status: 'Not Started', statusColor: 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500' },
  { item: 'SAR threshold review workshop', owner: 'FinCrime', due: 'Q3 2026', status: 'Not Started', statusColor: 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500' },
  { item: 'Jurisdiction red-flag registry build', owner: 'KYB / Compliance', due: 'Q3 2026', status: 'Not Started', statusColor: 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-500' },
  { item: 'AMLA designation risk assessment', owner: 'Legal / Compliance', due: 'Q2 2026', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportArtifactView() {
  const theme = useChartTheme()

  const toc = [
    'Executive Summary',
    'Problem Statement',
    'Complaint Timeline',
    'Fact-Check Analytics',
    'Highest-Risk Sectors',
    'Root Cause Breakdown',
    'Investigation Triggers',
    'Regulatory Landscape',
    'Risk Assessment',
    'Suggested Solutions',
    'Minority Marks & Neutral Comparison',
    'Monitoring, Alerts & Next Steps',
  ]

  return (
    <div className="px-6 py-6 pb-16 flex flex-col gap-10 w-full">

      {/* ── Report header ─────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 bg-slate-50 dark:bg-zinc-900 p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">Intelligence Report</p>
            <h1 className="text-xl font-bold text-slate-900 dark:text-zinc-50 leading-snug">
              Dormant Shell Company Fraud<br />
              <span className="font-normal text-slate-500 dark:text-zinc-400">Risk Landscape & Investigation Framework</span>
            </h1>
            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">Prepared by Pulse Research · May 2026 · v1</p>
          </div>
          <div className="flex flex-col gap-1.5 text-right shrink-0">
            <MetaChip label="Classification" value="Internal" />
            <MetaChip label="Topic" value="Financial Crime / AML" />
            <MetaChip label="Report Type" value="Research Report" />
            <MetaChip label="Sources Reviewed" value="13 web · 5 KB" />
            <MetaChip label="Est. Read" value="12 min" />
          </div>
        </div>
      </div>

      {/* ── Table of contents ─────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200 dark:border-zinc-700/60">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Table of Contents</p>
        </div>
        <div className="grid grid-cols-2 gap-0 divide-y divide-slate-100 dark:divide-zinc-800">
          {toc.map((item, i) => (
            <a
              key={item}
              href={`#section-${i + 1}`}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800/40 hover:text-blue-700 dark:hover:text-blue-400 transition-colors col-span-1 border-r border-slate-100 dark:border-zinc-800 odd:border-r even:border-r-0"
            >
              <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 tabular-nums w-4 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* ── 1. Executive Summary ───────────────────────────────────── */}
      <Section id="section-1" number={1} title="Executive Summary">
        <Callout color="blue">
          Public complaints related to dormant shell companies being exploited for financial fraud have surged <strong>60%</strong> this year — a level last seen only during post-crisis enforcement sweeps. Three sectors are critically or highly elevated in risk: real estate, private equity and fund administration, and professional services. Twelve specific investigation triggers have been identified spanning entity-level, transactional, and compliance dimensions.
        </Callout>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <KpiCard value="+60%" label="Complaint Surge YoY" color="text-red-600 dark:text-red-400" />
          <KpiCard value="3" label="Critical / High Sectors" color="text-orange-600 dark:text-orange-400" />
          <KpiCard value="12" label="Investigation Triggers" color="text-blue-600 dark:text-blue-400" />
          <KpiCard value="<60%" label="US CTA Compliance" color="text-amber-600 dark:text-amber-400" />
        </div>
      </Section>

      {/* ── 2. Problem Statement ───────────────────────────────────── */}
      <Section id="section-2" number={2} title="Problem Statement">
        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Dormant shell entity filings implicated in fraud have increased <strong className="text-slate-800 dark:text-zinc-200">34%</strong> globally over three years, with the US, UK, and UAE accounting for the majority of incorporation activity in high-opacity jurisdictions. 78% of shell companies implicated in documented fraud cases had no employees, no independently owned assets, and no verifiable beneficial owner at the time of the fraudulent transaction.
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Indicator', 'Value', 'Source'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Dormant shell filings implicated in fraud (3yr increase)', '+34%', 'OCCRP 2026'],
                ['Shells with no employees / assets / verified UBO', '78%', 'OCCRP 2026'],
                ['Real estate share of shell fraud by transaction value', '44%', 'GFI 2025'],
                ['Jurisdictions in 60%+ of cross-border investigations', '4 (DE, NV, BVI, Cayman)', 'TI 2025'],
                ['Most common layering structure', '3–7 entity tiers', 'JFC 2024'],
                ['US CTA compliance (pre-existing entities, Q1 2026)', '<60%', 'FinCEN 2026'],
                ['YoY increase in SEC/FinCEN/FCA shell enforcement actions', '+52%', 'Multiple'],
              ].map(([ind, val, src], i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2 text-xs text-slate-700 dark:text-zinc-300">{ind}</td>
                  <td className="px-3 py-2 text-xs font-semibold text-slate-900 dark:text-zinc-100">{val}</td>
                  <td className="px-3 py-2 text-xs text-slate-500 dark:text-zinc-400">{src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 3. Complaint Timeline ──────────────────────────────────── */}
      <Section id="section-3" number={3} title="Complaint Timeline">
        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Monthly complaint volume against dormant shell entities across FinCEN, SEC, and FCA channels (Jan 2025 – Mar 2026). The 60% threshold was crossed in Q1 2026, consistent with historical patterns preceding major enforcement escalations.
        </p>
        <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={complaintTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
              <XAxis dataKey="month" tick={{ fill: theme.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.text, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: theme.tooltip.bg, border: `1px solid ${theme.tooltip.border}`, borderRadius: 6, fontSize: 12, color: theme.tooltip.text }}
                labelStyle={{ color: theme.tooltip.label, fontSize: 11, marginBottom: 2 }}
                itemStyle={{ color: theme.tooltip.text }}
                formatter={(v: unknown) => [v, 'Complaints']}
              />
              <Line type="monotone" dataKey="complaints" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {timelineEvents.map(ev => (
            <div key={ev.date} className="flex items-start gap-3">
              <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${ev.color}`} />
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200">{ev.date} — {ev.label}</span>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mt-0.5">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 4. Fact-Check Analytics ────────────────────────────────── */}
      <Section id="section-4" number={4} title="Fact-Check Analytics">
        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Source pool quality assessment. 13 of 43 retrieved web sources were retained after relevance filtering; 29 were discarded for low relevance, paywall, outdatedness, or duplication.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-3">Source Relevance Scores (Top 7)</p>
            <HorizontalBar data={sourceRelevanceData} valueFormatter={v => `${v}`} />
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900 flex flex-col">
            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-3">Sources Retained vs. Discarded</p>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full">
                <DonutChart
                  data={[
                    { name: 'Kept', value: 13, color: '#3b82f6' },
                    { name: 'Low Relevance', value: 16, color: '#e2e8f0' },
                    { name: 'Paywalled', value: 7, color: '#cbd5e1' },
                    { name: 'Outdated', value: 4, color: '#94a3b8' },
                    { name: 'Duplicate', value: 2, color: '#64748b' },
                  ]}
                  height={180}
                  innerRadius={50}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1 mt-2">
              {[
                { label: 'Kept (13)', color: 'bg-blue-500' },
                { label: 'Low Relevance (16)', color: 'bg-slate-200 dark:bg-slate-600' },
                { label: 'Paywalled (7)', color: 'bg-slate-300 dark:bg-slate-500' },
                { label: 'Outdated (4)', color: 'bg-slate-400' },
                { label: 'Duplicate (2)', color: 'bg-slate-500 dark:bg-slate-400' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${l.color}`} />
                  <span className="text-xs text-slate-500 dark:text-zinc-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 px-4 py-3">
          <p className="text-xs text-amber-700 dark:text-amber-300">
            <strong>3 sources flagged</strong> for potential industry conflict of interest (formation agent trade group publications) and excluded from synthesis. OCCRP case-level data retained for typology illustration only — not used for quantitative inference.
          </p>
        </div>
      </Section>

      {/* ── 5. Highest-Risk Sectors ────────────────────────────────── */}
      <Section id="section-5" number={5} title="Highest-Risk Sectors">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-1">Fraud Volume by Sector (%)</p>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-3">Share of documented shell company fraud by transaction value</p>
            <DonutChart data={sectorRiskData} height={180} innerRadius={48} valueFormatter={v => `${v}%`} />
            <div className="grid grid-cols-1 gap-1 mt-3">
              {sectorRiskData.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-slate-600 dark:text-zinc-400">{s.name}</span>
                  <span className="ml-auto text-xs font-medium text-slate-700 dark:text-zinc-300">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
            <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-3">Trigger Count by Sector Risk</p>
            <HorizontalBar
              data={[
                { name: 'Real Estate', value: 8, color: '#ef4444' },
                { name: 'Private Equity', value: 6, color: '#f97316' },
                { name: 'Prof. Services', value: 5, color: '#f59e0b' },
                { name: 'Trade Finance', value: 5, color: '#3b82f6' },
                { name: 'Digital Assets', value: 4, color: '#a855f7' },
                { name: 'Construction', value: 3, color: '#71717a' },
              ]}
              valueFormatter={v => `${v} triggers`}
            />
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Sector', 'Risk Level', 'Shell Usage', 'Primary Typology', 'Primary Regulator'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Real Estate', 'Critical', 'Very High', 'Layering / property laundering', 'FinCEN GTOs, CTA'],
                ['Private Equity / Fund Admin', 'High', 'High', 'Feeder fund layering, SPV fraud', 'SEC, AIFMD, FCA'],
                ['Professional Services', 'High', 'High', 'Incorporation facilitation, nominee abuse', 'SRA, state bars'],
                ['Trade Finance / Import-Export', 'High', 'Medium-High', 'Trade-based money laundering (TBML)', 'Customs, correspondent banks'],
                ['Digital Assets', 'Elevated', 'Medium', 'Fiat-crypto bridge, pseudonymous counterparty', 'FinCEN, FCA, ESMA'],
                ['Construction / Procurement', 'Elevated', 'Medium', 'Bid-rigging, procurement fraud', 'Procurement agencies'],
              ].map(([sector, risk, usage, typology, regulator], i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-zinc-200">{sector}</td>
                  <td className="px-3 py-2.5"><RiskBadge level={risk} /></td>
                  <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-zinc-400">{usage}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-zinc-400">{typology}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-zinc-400">{regulator}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 6. Root Cause Breakdown ────────────────────────────────── */}
      <Section id="section-6" number={6} title="Root Cause Breakdown">
        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Four structural root causes underpin the shell company fraud landscape. These are not independent — they compound one another. Opacity enables arbitrage, arbitrage suppresses compliance, and industry tolerance makes compliance feel optional.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rootCauses.map(rc => (
            <div key={rc.label} className={`rounded-xl border-l-4 p-4 ${rc.color}`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{rc.label}</p>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${rc.badgeColor}`}>{rc.badge}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{rc.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 7. Investigation Triggers ──────────────────────────────── */}
      <Section id="section-7" number={7} title="Investigation Triggers">
        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          12 signals identified across entity-level, transactional, and compliance dimensions. No single trigger is diagnostic — co-occurrence of five or more, particularly dormancy + layered ownership + high-value transactional activity, is the highest-confidence indicator.
        </p>
        <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900 mb-4">
          <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400 mb-3">Trigger Distribution by Category</p>
          <HorizontalBar data={triggerCategoryData} valueFormatter={v => `${v} signals`} />
        </div>

        <TriggerGroup title="Entity-Level Signals" color="text-blue-700 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40">
          {[
            ['Dormancy + sudden transaction activity', 'An entity with no prior trading history initiates large-value activity within a compressed 30–90 day window.'],
            ['Layered ownership exceeding three tiers', 'Beneficial ownership cannot be traced to a natural person within three entity layers without encountering a jurisdiction-opacity barrier.'],
            ['Nominee director with no industry connection', 'The director is a professional nominee whose declared background bears no plausible relationship to the transacting industry.'],
            ['Registered address shared by 50+ entities', 'The registered address is a commercial formation agent or legal office shared by a disproportionate number of other entities.'],
            ['Capitalisation-to-transaction value mismatch', 'An entity with minimal share capital is party to transactions whose value materially exceeds its apparent financial capacity.'],
            ['Multiple ownership changes in 12 months preceding transaction', 'Beneficial ownership was transferred one or more times within the year before the flagged transaction.'],
          ].map(([title, desc], i) => (
            <TriggerRow key={i} number={i + 1} title={title} desc={desc} />
          ))}
        </TriggerGroup>

        <TriggerGroup title="Transactional Signals" color="text-amber-700 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40">
          {[
            ['Structuring near reporting thresholds', 'Payments structured just below mandatory reporting thresholds across multiple transactions in a short period.'],
            ['All-cash acquisition of high-value assets', 'Cash purchase of real estate, vehicles, or art by an entity with no verifiable source of funds.'],
            ['Counterparty chain of dormant entities', 'A transaction involves two or more dormant shell companies on both sides with no identifiable commercial operations.'],
            ['Round-number inter-entity transfers', 'Regular transfers of precisely rounded amounts between entities under suspected common control.'],
          ].map(([title, desc], i) => (
            <TriggerRow key={i} number={i + 7} title={title} desc={desc} />
          ))}
        </TriggerGroup>

        <TriggerGroup title="Compliance & Regulatory Signals" color="text-purple-700 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/40">
          {[
            ['Lapsed corporate registry filings', 'The entity has failed to file required annual returns or BO declarations while remaining active in transactional terms.'],
            ['Adverse media or sanctions proximity', 'The entity, its directors, or its registered agent appears in adverse media, sanctions databases, or enforcement records.'],
          ].map(([title, desc], i) => (
            <TriggerRow key={i} number={i + 11} title={title} desc={desc} />
          ))}
        </TriggerGroup>
      </Section>

      {/* ── 8. Regulatory Landscape ───────────────────────────────── */}
      <Section id="section-8" number={8} title="Regulatory Landscape">
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Framework', 'Jurisdiction', 'Status', 'Key Gap'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Corporate Transparency Act (CTA)', 'United States', 'Active — enforcement escalating H2 2026', '<60% compliance; 23 broad exemptions; micro-entity blind spot'],
                ['Register of Overseas Entities (ROE)', 'United Kingdom', 'Active — data quality concerns', '14% of entries contain incomplete or unverifiable UBO information'],
                ['AML Package 2024 + AMLA', 'European Union', 'AMLA operationalising mid-2026', 'Member state transposition lag; AMLA supervised entity list not yet published'],
                ['FATF Mutual Evaluation Cycle', 'Global', 'US/UK/AU evaluations completed', 'Beneficial ownership transparency rated as significant weakness in all three'],
                ['FinCEN GTOs', 'United States', 'Renewed 2025 — 12 metro areas', 'Residential focus only; commercial RE remains partially uncovered'],
              ].map(([framework, jurisdiction, status, gap], i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-zinc-200">{framework}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-zinc-400">{jurisdiction}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-600 dark:text-zinc-400">{status}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-zinc-400">{gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 9. Risk Assessment ────────────────────────────────────── */}
      <Section id="section-9" number={9} title="Risk Assessment">
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Risk', 'Likelihood', 'Impact', 'Mitigation'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {riskRows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-xs text-slate-700 dark:text-zinc-300">{row.risk}</td>
                  <td className="px-3 py-2.5"><LikelihoodBadge level={row.likelihood} /></td>
                  <td className="px-3 py-2.5"><LikelihoodBadge level={row.impact} /></td>
                  <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-zinc-400">{row.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 10. Suggested Solutions ───────────────────────────────── */}
      <Section id="section-10" number={10} title="Suggested Solutions">
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Solution', 'Priority', 'Effort', 'Impact', 'Owner'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {solutions.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-xs text-slate-700 dark:text-zinc-300">{row.solution}</td>
                  <td className="px-3 py-2.5"><RiskBadge level={row.priority} /></td>
                  <td className="px-3 py-2.5"><EffortBadge level={row.effort} /></td>
                  <td className="px-3 py-2.5"><LikelihoodBadge level={row.impact} /></td>
                  <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap">{row.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 11. Minority Marks & Neutral Comparison ───────────────── */}
      <Section id="section-11" number={11} title="Minority Marks & Neutral Comparison">
        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Points of divergence between sources, and neutral comparison against benchmark frameworks.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200 dark:border-zinc-700/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Points of Divergence</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {[
                ['Global fraud transaction value', '$500B–$2T', 'Range too wide; GFI real estate figure ($300–400B) retained as primary reference'],
                ['US CTA compliance rate', '52%–67%', 'FinCEN Q1 2026 primary figure (<60%) used as authoritative reference'],
                ['Crypto shell risk vector', 'New vs. existing typology', 'Enforcement data supports both simultaneously — treated as distinct compounding layer'],
              ].map(([topic, range, resolution], i) => (
                <div key={i} className="px-4 py-3">
                  <p className="text-xs font-medium text-slate-700 dark:text-zinc-200">{topic}</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">Source range: <span className="font-medium text-slate-600 dark:text-zinc-400">{range}</span></p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 italic">{resolution}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200 dark:border-zinc-700/60">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Benchmark Comparison</p>
            </div>
            <div className="p-4">
              <HorizontalBar
                data={[
                  { name: 'This Analysis', value: 12, color: '#3b82f6' },
                  { name: 'FATF Typology List', value: 9, color: '#94a3b8' },
                  { name: 'FinCEN Red Flags', value: 8, color: '#94a3b8' },
                  { name: 'FCA Guidance', value: 7, color: '#94a3b8' },
                ]}
                valueFormatter={v => `${v} signals`}
              />
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-3">
                This analysis identifies 12 discrete triggers vs. 7–9 in benchmark frameworks — incremental signals address dormancy reactivation, crypto-RE combined structures, and ROE data quality gaps not covered by existing guidance.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 12. Monitoring, Alerts & Next Steps ───────────────────── */}
      <Section id="section-12" number={12} title="Monitoring, Alerts & Next Steps">
        <Callout color="amber">
          The 60% complaint surge should be treated as a leading indicator of forthcoming regulatory escalation. Enforcement cycles have historically followed complaint surges with a <strong>12–24 month lag</strong> — implying materially elevated enforcement probability through 2026–2027.
        </Callout>
        <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Action Item', 'Owner', 'Due', 'Status'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {nextSteps.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-xs text-slate-700 dark:text-zinc-300">{row.item}</td>
                  <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-zinc-400 whitespace-nowrap">{row.owner}</td>
                  <td className="px-3 py-2.5 text-xs font-medium text-slate-700 dark:text-zinc-300 whitespace-nowrap">{row.due}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${row.statusColor}`}>{row.status}</span>
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
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[12px] font-bold">
          {number}
        </div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-zinc-50">{title}</h2>
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
    <div className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${styles[color]}`}>
      {children}
    </div>
  )
}

function KpiCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 bg-white dark:bg-zinc-900 px-4 py-3 flex flex-col gap-0.5">
      <p className={`text-2xl font-bold tabular-nums ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 dark:text-zinc-400 leading-snug">{label}</p>
    </div>
  )
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <span className="text-[11px] text-slate-500 dark:text-zinc-400">{label}:</span>
      <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">{value}</span>
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
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${styles[level] ?? styles.Low}`}>{level}</span>
  )
}

function LikelihoodBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    High: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    Low: 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400',
  }
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${styles[level] ?? styles.Low}`}>{level}</span>
  )
}

function EffortBadge({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Low: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    High: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  }
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${styles[level] ?? styles.Medium}`}>{level}</span>
  )
}

function TriggerGroup({ title, color, bg, children }: {
  title: string
  color: string
  bg: string
  children: React.ReactNode
}) {
  return (
    <div className={`mb-3 rounded-xl border ${bg} overflow-hidden`}>
      <div className={`px-4 py-2 border-b ${bg}`}>
        <p className={`text-[11px] font-semibold uppercase tracking-wider ${color}`}>{title}</p>
      </div>
      <div className="divide-y divide-slate-100 dark:divide-zinc-800/50">
        {children}
      </div>
    </div>
  )
}

function TriggerRow({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 tabular-nums w-5 shrink-0 mt-0.5">{number}.</span>
      <div>
        <p className="text-xs font-semibold text-slate-800 dark:text-zinc-100">{title}</p>
        <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  )
}
