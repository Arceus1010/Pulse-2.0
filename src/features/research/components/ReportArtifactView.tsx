import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import DonutChart from '../../analytics/components/charts/DonutChart'
import HorizontalBar from '../../analytics/components/charts/HorizontalBar'
import { useChartTheme } from '../../analytics/hooks/useChartTheme'

// ─── Mock chart data ──────────────────────────────────────────────────────────

const complaintTrend = [
  { month: 'Jan 25',  complaints: 210  },
  { month: 'Feb 25',  complaints: 245  },
  { month: 'Mar 25',  complaints: 290  },
  { month: 'Apr 25',  complaints: 340  },
  { month: 'May 25',  complaints: 390  },
  { month: 'Jun 25',  complaints: 630  },
  { month: 'Jul 25',  complaints: 760  },
  { month: 'Aug 25',  complaints: 840  },
  { month: 'Sep 25',  complaints: 1340 },
  { month: 'Oct 25',  complaints: 1680 },
  { month: 'Nov 25',  complaints: 1520 },
  { month: 'Dec 25',  complaints: 1450 },
  { month: 'Jan 26',  complaints: 1380 },
  { month: 'Feb 26',  complaints: 1490 },
  { month: 'Mar 26',  complaints: 1310 },
  { month: 'Apr 26',  complaints: 1160 },
]

const sectorRiskData = [
  { name: 'Logistics & Transport', value: 32, color: '#ef4444' },
  { name: 'Gig Economy Workers',   value: 22, color: '#f97316' },
  { name: 'M40 Borderline',        value: 19, color: '#f59e0b' },
  { name: 'Rural Communities',     value: 14, color: '#3b82f6' },
  { name: 'Senior Citizens',       value: 8,  color: '#a855f7' },
  { name: 'Petrol Operators',      value: 5,  color: '#71717a' },
]

const sourceRelevanceData = [
  { name: 'MOF — BUDI95 Policy Framework',       value: 96, color: '#3b82f6' },
  { name: 'PADU — Recipient Statistics Q1 2026', value: 94, color: '#3b82f6' },
  { name: 'World Bank — MY Fuel Subsidy (2025)', value: 89, color: '#3b82f6' },
  { name: 'MCMC — CMA 1998 Enforcement',         value: 86, color: '#3b82f6' },
  { name: 'IDEAS Malaysia — BUDI95 Assessment',  value: 82, color: '#3b82f6' },
  { name: 'Bernama — National Rollout Coverage', value: 78, color: '#3b82f6' },
  { name: 'EPU — Fiscal Savings Projection',     value: 75, color: '#3b82f6' },
]

const triggerCategoryData = [
  { name: 'Pump / Payment System',        value: 6, color: '#3b82f6' },
  { name: 'Eligibility & Database',       value: 4, color: '#f59e0b' },
  { name: 'Communication & Compliance',   value: 2, color: '#a855f7' },
]

// ─── Complaint timeline events ────────────────────────────────────────────────

const timelineEvents = [
  {
    date: 'Jan 2025',
    label: 'Policy Announcement',
    desc: 'MOF announces BUDI95 as part of the 2025 Budget fuel subsidy rationalisation. PADU registration window opens. Civil society groups immediately raise concerns about PADU data completeness.',
    color: 'bg-slate-400',
  },
  {
    date: 'Jun 2025',
    label: 'Pilot Launch — Klang Valley',
    desc: 'Controlled pilot in Selangor and KL. MyKad terminal malfunctions and e-wallet pre-authorisation failures generate the first wave of documented pump-level complaints. Elderly users disproportionately affected.',
    color: 'bg-amber-500',
  },
  {
    date: 'Sep – Oct 2025',
    label: 'National Rollout & Peak Backlash',
    desc: 'Full rollout across Peninsular Malaysia and East Malaysia triggers the highest complaint spike on record. PADU misclassification appeals flood JPM and MOF helplines. Viral WhatsApp claims allege the program has been cancelled.',
    color: 'bg-red-500',
  },
  {
    date: 'Nov 2025',
    label: 'MCMC Enforcement & Court Fines',
    desc: 'MCMC activates CMA 1998 to curb BUDI95 misinformation. First court fines issued for individuals spreading fabricated eligibility criteria on social media. 340+ items flagged across Facebook, TikTok, and WhatsApp.',
    color: 'bg-blue-500',
  },
  {
    date: 'Feb 2026',
    label: 'Eligibility Appeal Backlog Disclosed',
    desc: "PM's Department confirms ~450,000 pending eligibility appeals. Parliamentary questions raised. PADU Phase 2 audit announced. Secondary complaint spike driven by media coverage.",
    color: 'bg-orange-500',
  },
  {
    date: 'Apr 2026',
    label: 'Stabilisation Phase Begins',
    desc: 'Complaint volume moderates following PADU Phase 2 corrections, MyKad terminal hardware upgrades at ~3,200 petrol stations, and launch of dedicated BUDI95 toll-free helpline (1-800-22-2222).',
    color: 'bg-green-500',
  },
]

// ─── Root causes ──────────────────────────────────────────────────────────────

const rootCauses = [
  {
    label: 'PADU Database Inaccuracy',
    desc: "An estimated 18% of registered households have filed eligibility disputes, suggesting material inaccuracies in the income and household composition data underlying PADU's classification algorithm. Irregular income earners (gig workers, small traders) are systematically over-classified.",
    color: 'border-red-500 bg-red-50 dark:bg-red-950/30',
    badge: 'Critical',
    badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  },
  {
    label: 'Last-Mile Digital Infrastructure Gap',
    desc: "Pump-level MyKad readers and e-wallet pre-authorisation systems were not stress-tested at national rollout scale. Terminal failure rates peaked at ~12,000 incidents/week in October 2025. East Malaysia's lower smartphone and e-wallet penetration rate compounds the problem.",
    color: 'border-orange-500 bg-orange-50 dark:bg-orange-950/30',
    badge: 'High',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  },
  {
    label: 'Eligibility Criteria Blind Spots',
    desc: 'The B40/M40 income threshold does not adequately account for income volatility, household composition changes, or the ~680,000 gig economy workers whose platform-reported earnings are inconsistently captured in LHDN tax records used to populate PADU.',
    color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30',
    badge: 'High',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
  },
  {
    label: 'Communication & Awareness Deficit',
    desc: 'Government public communications around BUDI95 relied heavily on formal press statements and MyGov portal updates — channels with low penetration in the target B40 demographic. The resulting information vacuum was rapidly filled by WhatsApp chains and TikTok content, much of it inaccurate.',
    color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
    badge: 'Elevated',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  },
]

// ─── Risk assessment rows ─────────────────────────────────────────────────────

const riskRows = [
  { risk: 'Mass PADU misclassification — political blowback from M40 group', likelihood: 'High', impact: 'High', mitigation: 'Accelerate PADU Phase 2 audit; introduce quarterly income re-verification; implement proactive SMS notification upon eligibility change' },
  { risk: 'Subsidy leakage via PADU data manipulation or straw-household registration', likelihood: 'Medium', impact: 'High', mitigation: 'Cross-reference PADU records with LHDN, EPF, and property ownership data; deploy anomaly detection on households with >3 registered vehicles' },
  { risk: 'Sustained pump-level technical failures undermining trust in digital verification', likelihood: 'High', impact: 'Medium', mitigation: 'Mandate KPDNHEP certification of terminal hardware before station activation; deploy fallback MyKad-only offline verification mode' },
  { risk: 'Localised fuel price inflation in rural / East Malaysian markets outside subsidy reach', likelihood: 'Medium', impact: 'Medium', mitigation: 'KPDNHEP price monitoring expansion to Sabah/Sarawak; increase rural station terminal coverage with MCMC broadband support' },
  { risk: 'CMA 1998 enforcement perceived as suppressing legitimate criticism of BUDI95', likelihood: 'Medium', impact: 'Medium', mitigation: 'MCMC to publish transparent criteria distinguishing misinformation enforcement from policy criticism; increase proactive official communications to reduce the misinformation niche' },
]

// ─── Suggested solutions ──────────────────────────────────────────────────────

const solutions = [
  { solution: 'PADU Phase 2 income audit with gig/informal economy data integration', priority: 'Critical', effort: 'High',   impact: 'High',   owner: 'JPM / PADU / LHDN' },
  { solution: 'Offline MyKad-only fallback mode at all BUDI95-enabled pump terminals',  priority: 'Critical', effort: 'Medium', impact: 'High',   owner: 'KPDNHEP / MOF' },
  { solution: 'Proactive SMS / MyGov push notification on eligibility status change',   priority: 'High',     effort: 'Low',    impact: 'High',   owner: 'MAMPU / PADU' },
  { solution: 'Dedicated BUDI95 toll-free helpline with 48-hour appeal SLA',            priority: 'High',     effort: 'Medium', impact: 'High',   owner: 'MOF Customer Affairs' },
  { solution: 'Digital literacy outreach programme targeting elderly and rural recipients', priority: 'High', effort: 'High',   impact: 'Medium', owner: 'KKMM / KPDNHEP' },
  { solution: 'Real-time subsidy leakage and anomaly detection dashboard',              priority: 'Medium',   effort: 'High',   impact: 'High',   owner: 'MOF / EPU / PADU' },
]

// ─── Next steps table ─────────────────────────────────────────────────────────

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
    'Complaint Timeline',
    'Fact-Check Analytics',
    'Most Impacted Demographics / Sectors',
    'Root Cause Breakdown',
    'Public Backlash Triggers',
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
            <p className="text-xs font-medium uppercase tracking-widest text-slate-500 dark:text-zinc-400 mb-1">Intelligence Report</p>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-zinc-50 leading-snug">
              BUDI95 Intelligence Report<br />
              <span className="font-normal text-slate-500 dark:text-zinc-400">Is BUDI95 Creating More Benefits or More Concerns?</span>
            </h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">Prepared by Pulse Research · May 2026 · v1</p>
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
        <Callout color="blue">
          Malaysia's BUDI95 targeted RON95 subsidy program locks the pump price at <strong>RM1.99/L</strong> for eligible B40 and lower-M40 households, against a floating unsubsidised market price currently hovering near <strong>RM3.22/L</strong>. The program generates an estimated <strong>RM4.2 billion</strong> in annual fiscal savings by redirecting subsidy value away from high-income consumers — yet public complaints about eligibility misclassification, pump verification failures, and PADU database inaccuracies have surged <strong>+78%</strong> since national rollout in September 2025, creating a widening gap between the program's measurable benefits and its public perception.
        </Callout>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <KpiCard value="RM1.99"  label="Subsidised RON95 price (eligible users)"    color="text-green-600 dark:text-green-400" />
          <KpiCard value="RM4.2B" label="Estimated annual fiscal savings (EPU 2025)"  color="text-blue-600 dark:text-blue-400" />
          <KpiCard value="+78%"   label="Public complaint surge since Sep 2025"       color="text-red-600 dark:text-red-400" />
          <KpiCard value="8.6M"   label="Registered eligible recipients (PADU)"       color="text-amber-600 dark:text-amber-400" />
        </div>
      </Section>

      {/* ── 2. Problem Statement ───────────────────────────────────── */}
      <Section id="section-2" number={2} title="Problem Statement">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          The BUDI95 rollout has exposed three compounding problem layers: a <strong className="text-slate-800 dark:text-zinc-200">data accuracy gap</strong> in the PADU household income registry, a <strong className="text-slate-800 dark:text-zinc-200">last-mile delivery failure</strong> at the physical pump interface, and a <strong className="text-slate-800 dark:text-zinc-200">communication vacuum</strong> that misinformation has rushed to fill. These layers are not independent — data inaccuracy triggers eligibility disputes, disputes generate negative press, and press generates social media misinformation that MCMC must then police.
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
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
      </Section>

      {/* ── 3. Complaint Timeline ──────────────────────────────────── */}
      <Section id="section-3" number={3} title="Complaint Timeline">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Monthly public complaint volume across KPDNHEP helplines, PADU dispute portal, MCMC channels, and aggregated social media mentions (Jan 2025 – Apr 2026). The October 2025 spike coincides with the national rollout reaching East Malaysia. The February 2026 secondary peak reflects the media coverage of the eligibility appeal backlog. Gradual moderation from March 2026 onward tracks PADU Phase 2 corrections and pump hardware upgrades.
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
                <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">{ev.date} — {ev.label}</span>
                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mt-0.5">{ev.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 4. Fact-Check Analytics ────────────────────────────────── */}
      <Section id="section-4" number={4} title="Fact-Check Analytics">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Source pool quality assessment. Of 47 web and social sources retrieved across government portals, NGO publications, news outlets, and social media monitoring platforms, <strong className="text-slate-800 dark:text-zinc-200">14 were retained</strong> after relevance and credibility filtering. Sentiment analysis of retained sources skews <strong className="text-slate-800 dark:text-zinc-200">55% concern / 30% neutral / 15% positive</strong> — reflecting the current online discourse environment, which systematically over-represents negative experiences relative to the silent majority of users successfully using the subsidy.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900">
            <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-3">Source Relevance Scores (Top 7)</p>
            <HorizontalBar data={sourceRelevanceData} valueFormatter={v => `${v}`} />
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900 flex flex-col">
            <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-3">Sources Retained vs. Discarded</p>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full">
                <DonutChart
                  data={[
                    { name: 'Kept',                   value: 14, color: '#3b82f6' },
                    { name: 'Unverified / Fake News', value: 18, color: '#e2e8f0' },
                    { name: 'Low Relevance',           value: 9,  color: '#cbd5e1' },
                    { name: 'Outdated (pre-BUDI95)',   value: 5,  color: '#94a3b8' },
                    { name: 'Duplicate Coverage',      value: 1,  color: '#64748b' },
                  ]}
                  height={180}
                  innerRadius={50}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1 mt-2">
              {[
                { label: 'Kept (14)',                    color: 'bg-blue-500' },
                { label: 'Unverified / Fake News (18)',  color: 'bg-slate-200 dark:bg-slate-600' },
                { label: 'Low Relevance (9)',            color: 'bg-slate-300 dark:bg-slate-500' },
                { label: 'Outdated, pre-BUDI95 (5)',     color: 'bg-slate-400' },
                { label: 'Duplicate Coverage (1)',       color: 'bg-slate-500 dark:bg-slate-400' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full shrink-0 ${l.color}`} />
                  <span className="text-sm text-slate-500 dark:text-zinc-400">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 px-4 py-3">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>3 sources flagged</strong> for partisan or politically motivated framing (two opposition-aligned blogs, one industry lobby publication) and excluded from synthesis. Viral social media content retained for sentiment volume analysis only — not used as factual reference. MCMC's own enforcement log used as the authoritative source for misinformation item counts.
          </p>
        </div>
      </Section>

      {/* ── 5. Most Impacted Demographics / Sectors ───────────────── */}
      <Section id="section-5" number={5} title="Most Impacted Demographics / Sectors">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          BUDI95's impact is unevenly distributed. While the program's eligibility design targets B40 and lower-M40 households, implementation friction concentrates harm in specific demographic and economic segments — particularly those with irregular income patterns, low digital literacy, or operational dependence on fuel. The analysis identifies six groups experiencing disproportionate impact relative to their share of the overall recipient population.
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
                ['Logistics & Transport Sector',             'Critical', 'High operational fuel dependency; commercial fleets excluded from residential subsidy',                      'Excluded (commercial)',        'KPDN / JPJ'],
                ['Gig Economy Workers',                      'High',     'Irregular income misread by PADU as above-threshold; ~680K classified outside B40',                         'Partial / Disputed',           'MOF / EPU / PADU'],
                ['M40 Borderline Earners',                   'High',     'Households near the B40/M40 income boundary experience volatility in eligibility status',                   'Conditional / Fluctuating',    'MOF / PADU'],
                ['Rural Communities (Sabah/Sarawak)',        'High',     'Limited petrol station terminal coverage; e-wallet penetration low; MyKad reader uptake lagging',          'Eligible but under-served',    'KPDNHEP / MCMC'],
                ['Senior Citizens / Low Digital Literacy',  'Elevated', 'e-Wallet setup barriers and pump self-service failure lead to effective exclusion of eligible users',       'Eligible but access-impaired', 'KKMM / MOF'],
                ['Petrol Station Operators',                 'Elevated', 'Cash-flow timing mismatch between subsidy disbursement and fuel purchase cost; terminal upgrade burden',  'Not applicable',               'KPDNHEP / PETRONAS'],
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

      {/* ── 6. Root Cause Breakdown ────────────────────────────────── */}
      <Section id="section-6" number={6} title="Root Cause Breakdown">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Four structural root causes underpin the BUDI95 rollout's friction. These are not independent — they compound one another. PADU inaccuracy generates eligibility disputes; disputes generate media coverage; media coverage generates misinformation; misinformation generates MCMC enforcement; and enforcement generates its own public blowback. Resolving any one of these nodes in isolation addresses symptoms, not the system.
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

      {/* ── 7. Public Backlash Triggers ───────────────────────────── */}
      <Section id="section-7" number={7} title="Public Backlash Triggers">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          12 discrete signals that trigger public complaint escalation, system failures, or misinformation events. No single trigger is fully diagnostic — the most damaging incidents arise when pump-level failures (Triggers 1–6) coincide with eligibility uncertainty (Triggers 7–10), creating a compounded experience of rejection that users then share online, activating the misinformation layer (Triggers 11–12).
        </p>
        <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 p-4 bg-white dark:bg-zinc-900 mb-4">
          <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 mb-3">Trigger Distribution by Category</p>
          <HorizontalBar data={triggerCategoryData} valueFormatter={v => `${v} signals`} />
        </div>

        <TriggerGroup title="Pump / Payment System Signals" color="text-blue-700 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900/40">
          {[
            ['MyKad Reader Terminal Failure', 'Pump-level NFC/MyKad reader malfunctions prevent identity verification entirely, forcing the user to pay the unsubsidised price or abandon the transaction. Peak incidence: October 2025.'],
            ['e-Wallet Pre-Authorisation Rejection', "e-Wallet pre-auth holds require a minimum balance threshold. Users with low balances on Touch 'n Go or Boost are rejected even when technically eligible, generating complaints that conflate system limits with eligibility denial."],
            ['Subsidy Price Not Applied Despite Confirmed Eligibility', 'Connectivity failures between the pump terminal and the national BUDI95 verification server result in the unsubsidised price being charged to confirmed eligible users — a particularly high-anger event type.'],
            ['Server Latency Causing Queue Pile-Up', 'High simultaneous transaction load on the BUDI95 verification API — especially during peak refuelling hours — creates pump-side delays of 30–90 seconds per transaction, generating queues and public frustration.'],
            ['Automatic Disqualification Due to Expired Documents', 'Expired JPJ road tax or vehicle insurance automatically flags a vehicle in the verification system, disqualifying an otherwise-eligible user without explanation at the point of sale.'],
            ['Double-Charge After Failed Transaction Rollback', 'Failed subsidy transactions that are partially processed result in double-charge incidents, particularly with e-wallet direct debit. Complaint intensity is high and generates significant social media amplification.'],
          ].map(([title, desc], i) => (
            <TriggerRow key={i} number={i + 1} title={title} desc={desc} />
          ))}
        </TriggerGroup>

        <TriggerGroup title="Eligibility & Database Signals" color="text-amber-700 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-950/30 border-amber-100 dark:border-amber-900/40">
          {[
            ['Sudden Eligibility Status Change Without Notification', 'PADU recalculates household income eligibility periodically. Users who lose eligibility between cycles receive no proactive notification, discovering their status change only at the pump — a high-anger, high-shareability event.'],
            ['PADU Income Data Mismatch vs. Actual Household Situation', 'Gig workers, seasonal employees, and informal traders frequently find their PADU-registered income bracket does not reflect their actual financial situation, having been derived from LHDN records that do not capture all income types.'],
            ['Household Split / Composition Change Not Reflected', 'Households that have recently separated, divorced, or experienced member emigration may still be registered under the original household composition, distorting per-capita income calculations and eligibility outcomes.'],
            ['Appeal Rejection With No Reason Provided', 'The PADU dispute portal does not currently mandate a reason field for appeal rejections. Users who receive unexplained rejections — approximately 34% of closed appeals as of February 2026 — generate secondary complaints about administrative transparency.'],
          ].map(([title, desc], i) => (
            <TriggerRow key={i} number={i + 7} title={title} desc={desc} />
          ))}
        </TriggerGroup>

        <TriggerGroup title="Communication & Compliance Signals" color="text-purple-700 dark:text-purple-400" bg="bg-purple-50 dark:bg-purple-950/30 border-purple-100 dark:border-purple-900/40">
          {[
            ['Viral Misinformation Activation (MCMC Alert)', 'False claims about BUDI95 cancellation, eligibility criteria changes, or alleged government corruption spread via WhatsApp and TikTok. Each viral wave generates a secondary complaint spike as users seek official clarification from helplines.'],
            ['Petrol Station Non-Compliance with Price Display Regulations', 'Stations failing to display the RM1.99 subsidised price prominently alongside the RM3.22 unsubsidised price — as mandated under the Price Control & Anti-Profiteering Act 2011 — generate consumer confusion and complaints to KPDNHEP.'],
          ].map(([title, desc], i) => (
            <TriggerRow key={i} number={i + 11} title={title} desc={desc} />
          ))}
        </TriggerGroup>
      </Section>

      {/* ── 8. Regulatory Landscape ───────────────────────────────── */}
      <Section id="section-8" number={8} title="Regulatory Landscape">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          BUDI95 operates across multiple overlapping regulatory frameworks spanning fiscal policy, data governance, consumer protection, and communications law. The program is the first Malaysian subsidy mechanism to simultaneously invoke all four frameworks in its day-to-day operation — a structural complexity that has contributed to enforcement gaps and inter-agency coordination friction.
        </p>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
          <table className="w-full text-base border-collapse">
            <thead className="bg-slate-50 dark:bg-zinc-800">
              <tr>
                {['Framework', 'Jurisdiction', 'Status', 'Key Gap'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-2.5 border-b border-slate-200 dark:border-zinc-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['BUDI95 Policy Framework (MOF Circular 2025)',            'Malaysia — Federal', 'Active — phased rollout completed Jan 2026',    'No standardised SLA for appeal resolution; ~450K cases pending without defined clearance timeline'],
                ['PADU Data Governance Framework (JPM)',                   'Malaysia — Federal', 'Active — Phase 2 audit in progress Q2 2026',    'Income data sourced primarily from LHDN; gig/informal economy income largely uncaptured; update cadence quarterly rather than real-time'],
                ['Communications & Multimedia Act 1998 (CMA) — MCMC',     'Malaysia — Federal', 'Actively enforced since Nov 2025',               'Enforcement actions perceived by some civil society groups as disproportionate; risk of chilling legitimate public criticism'],
                ['Price Control & Anti-Profiteering Act 2011 (KPDNHEP)',  'Malaysia — Federal', 'Active — spot inspections ongoing',             'Enforcement capacity thin relative to the ~3,200 RON95-selling stations nationwide; self-reporting by operators remains voluntary'],
                ['Personal Data Protection Act 2010 (PDPA) — MyData',     'Malaysia — Federal', 'Relevant to PADU data handling',                'Clarity required on citizen rights to inspect and correct PADU records; current correction pathway routes through JPM rather than PDPA Commissioner'],
              ].map(([framework, jurisdiction, status, gap], i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-zinc-800/60 last:border-b-0">
                  <td className="px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-zinc-200">{framework}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-zinc-400">{jurisdiction}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-zinc-400">{status}</td>
                  <td className="px-3 py-2.5 text-sm text-slate-500 dark:text-zinc-400">{gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ── 9. Risk Assessment ────────────────────────────────────── */}
      <Section id="section-9" number={9} title="Risk Assessment">
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

      {/* ── 10. Suggested Solutions ───────────────────────────────── */}
      <Section id="section-10" number={10} title="Suggested Solutions">
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-700/60">
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
      </Section>

      {/* ── 11. Minority Marks & Neutral Comparison ───────────────── */}
      <Section id="section-11" number={11} title="Minority Marks & Neutral Comparison">
        <p className="text-base text-slate-600 dark:text-zinc-400 leading-relaxed mb-4">
          Points of divergence between official government data and independent assessments, and a neutral comparison of concern indices across analytical frameworks. The central finding: official metrics consistently present BUDI95 in a more favourable light than independent assessments — not because the official data is fabricated, but because it measures implementation inputs (registrations, fiscal savings) rather than implementation outcomes (user experience, eligibility accuracy, sentiment).
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200 dark:border-zinc-700/60">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Points of Divergence</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-zinc-800">
              {[
                ['Eligible recipients count',             '7.5M – 9.1M',  'MOF registered PADU figure (8.6M) used as primary reference; lower estimate excludes pending registration approvals, higher estimate includes contested household compositions'],
                ['Annual fiscal savings projection',      'RM3.8B – RM5.1B', 'EPU mid-range projection (RM4.2B) retained; range reflects RON95 global price volatility assumptions across scenarios, not a data discrepancy'],
                ['PADU income classification accuracy',   '78% – 92%',    'IDEAS Malaysia independent assessment (82%) used; government figure (92%) measures technical registration success rate, not income data correctness — a definitional difference, not fraud'],
              ].map(([topic, range, resolution], i) => (
                <div key={i} className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-700 dark:text-zinc-200">{topic}</p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5">Source range: <span className="font-medium text-slate-600 dark:text-zinc-400">{range}</span></p>
                  <p className="text-sm text-slate-500 dark:text-zinc-400 mt-0.5 italic">{resolution}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-zinc-700/60 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-800/60 border-b border-slate-200 dark:border-zinc-700/60">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Benchmark Comparison</p>
            </div>
            <div className="p-4">
              <HorizontalBar
                data={[
                  { name: 'This Analysis',            value: 12, color: '#3b82f6' },
                  { name: 'IDEAS Malaysia Audit',     value: 9,  color: '#94a3b8' },
                  { name: 'World Bank Reform Review', value: 8,  color: '#94a3b8' },
                  { name: 'MOF Official Assessment',  value: 5,  color: '#94a3b8' },
                ]}
                valueFormatter={v => `${v} concern areas`}
              />
              <p className="text-sm text-slate-500 dark:text-zinc-400 mt-3">
                This analysis identifies 12 discrete public backlash triggers vs. 5–9 in benchmark frameworks. The incremental signals address gig economy eligibility blind spots, pump UI/UX failures, and the PADU-PDPA jurisdictional gap not covered by existing official assessments.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 12. Monitoring, Alerts & Next Steps ───────────────────── */}
      <Section id="section-12" number={12} title="Monitoring, Alerts & Next Steps">
        <Callout color="amber">
          The February 2026 eligibility appeal backlog and the October 2025 complaint peak are not the end of the BUDI95 turbulence cycle — they are leading indicators of a second-order phase. If PADU Phase 2 corrections do not resolve the 450,000 pending appeals by Q3 2026, the program faces a politically significant milestone: <strong>one year of unresolved disputes</strong>, which will provide opposition parties and civil society groups with a materially stronger narrative than anything generated during the rollout period. The window to stabilise is Q2–Q3 2026.
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

function TriggerGroup({ title, color, bg, children }: {
  title: string
  color: string
  bg: string
  children: React.ReactNode
}) {
  return (
    <div className={`mb-3 rounded-xl border ${bg} overflow-hidden`}>
      <div className={`px-4 py-2 border-b ${bg}`}>
        <p className={`text-xs font-semibold uppercase tracking-wider ${color}`}>{title}</p>
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
      <span className="text-sm font-bold text-slate-500 dark:text-zinc-400 tabular-nums w-5 shrink-0 mt-0.5">{number}.</span>
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100">{title}</p>
        <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  )
}
