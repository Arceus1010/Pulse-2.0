import type { SentimentByPeriod, SentimentByPlatform, Influencer, IssueResult } from '../types'
import { CHART_COLORS, SENTIMENT_COLORS } from '../constants'

export const sentimentByPeriod: SentimentByPeriod[] = [
  { period: 'Week 1', positive: 22, negative: 63, neutral: 15 },
  { period: 'Week 2', positive: 20, negative: 68, neutral: 12 },
  { period: 'Week 3', positive: 25, negative: 65, neutral: 10 },
  { period: 'Week 4', positive: 28, negative: 58, neutral: 14 },
]

export const overallSentiment = [
  { name: 'Negative', value: 62, color: SENTIMENT_COLORS.negative },
  { name: 'Positive', value: 24, color: SENTIMENT_COLORS.positive },
  { name: 'Neutral',  value: 14, color: SENTIMENT_COLORS.neutral  },
]

export const sentimentByPlatform: SentimentByPlatform[] = [
  { platform: 'Twitter',  positive: 35, negative: 45, neutral: 20 },
  { platform: 'Facebook', positive: 40, negative: 35, neutral: 25 },
  { platform: 'News',     positive: 38, negative: 38, neutral: 24 },
  { platform: 'Forums',   positive: 22, negative: 52, neutral: 26 },
  { platform: 'TikTok',   positive: 55, negative: 25, neutral: 20 },
]

export const negativeDrivers = [
  { name: 'Late Penalties',    value: 34, color: CHART_COLORS.red    },
  { name: 'Shell Audit',       value: 28, color: CHART_COLORS.pink   },
  { name: 'Director Liability',value: 18, color: CHART_COLORS.amber  },
  { name: 'Compliance Cost',   value: 12, color: CHART_COLORS.purple },
  { name: 'Other',             value: 8,  color: CHART_COLORS.zinc   },
]

export const influencers: Record<string, Influencer[]> = {
  negative: [
    { name: 'Ahmad Zafrul', handle: '@azafrul',   initials: 'AZ', reach: '98.2k', platform: 'Twitter', quote: "SSM's enforcement is long overdue but the penalties seem arbitrary — small businesses bear the brunt while large shell networks persist undetected." },
    { name: 'Malaysiakini', handle: 'News',        initials: 'MK', reach: '1.2M',  platform: 'News',    quote: 'Shell company crackdown raises questions about oversight gaps; directors face personal liability under updated Companies Act provisions.' },
    { name: 'LHDN Watch',   handle: '@lhdnwatch', initials: 'LW', reach: '44k',   platform: 'Twitter', quote: 'Late penalty regime for annual returns is punitive. RM50/day adds up fast for dormant companies with no revenue.' },
  ],
  positive: [
    { name: '@ssm_malaysia', handle: 'Official',     initials: 'SM', reach: '220k', platform: 'Twitter', quote: 'New MySSM portal processed 18,000 registrations in 48 hours — fastest onboarding rate in SSM history. #DigitalMalaysia' },
    { name: 'BizMalaysia',  handle: '@bizmalaysia', initials: 'BM', reach: '67k',  platform: 'Twitter', quote: 'Entrepreneurs finally getting the digital tools they deserve. MySSM portal is a game-changer for startups across Malaysia.' },
    { name: 'MDEC Official', handle: '@mdec',        initials: 'MD', reach: '110k', platform: 'Twitter', quote: "SSM's digitisation milestone aligns perfectly with Malaysia Digital Economy Blueprint targets for 2025." },
  ],
  neutral: [
    { name: '@KLFinanceWatch', handle: 'Finance',    initials: 'KF', reach: '52k',  platform: 'Twitter', quote: 'SSM annual return deadline approaching. File online via MySSM to avoid the RM50/day late charge. Full guide linked below.' },
    { name: 'The Star Online', handle: 'News',        initials: 'TS', reach: '800k', platform: 'News',    quote: 'SSM reports 203,000 mentions across social platforms in April — up 18% from March, largely driven by MySSM portal launch.' },
    { name: '@acctmalaysia',   handle: 'Accounting', initials: 'AM', reach: '28k',  platform: 'Twitter', quote: "Summary of SSM's latest updates to annual return requirements. Key changes to note for financial year 2024 filers." },
  ],
}

export const issues: IssueResult[] = [
  'SSM issues 3,200 audit notices to shell companies',
  'MySSM portal processes record registrations',
  'Late filing penalties spark SME backlash',
  'Companies Act director liability amendment tabled',
  'Annual return deadline confusion — FAQ released',
  'Bursa Malaysia delist three non-compliant companies',
  'Opposition questions SSM enforcement selective targeting',
  'Digital registration cuts processing time by 80%',
  'SSM CEO addresses shell company press conference',
  'RM50/day late penalty — legal challenge filed',
  'Selangor leads in new business registrations Q1',
  'Foreign company registration rules tightened',
  'Winding up petitions surge 41% YoY',
  'Form 9 submission errors — common mistakes guide',
  'SSM opens 5 new service centres nationwide',
  'Companies Act 2016 enforcement intensified',
  'MySSM API now available for fintech integrations',
  'Penang SME cluster demands penalty waiver',
  'KL startup ecosystem growth — SSM data',
  'Directors must verify residential address — new rule',
  'Sdn Bhd formation guide updated for 2025',
  'Nominee director rules under review',
  'Annual return portal crashes on deadline day',
  'SSM extends filing grace period by 14 days',
  'Corporate secretary registration requirements updated',
  'Foreign beneficial owner disclosure mandated',
  'E-stamp duty for share transfers launched',
  'New SSM enforcement division recruits 200 officers',
  'Bumiputera company registration incentive scheme',
  'SME Corp Malaysia partners SSM for SME data',
  'Digital signature acceptance for SSM filings',
  'Legal aid available for companies facing winding up',
  'SSM whistleblower portal launched',
  'Audit exemption threshold raised for micro-SMEs',
  'Branch office registration rules clarified',
  'SSM annual report 2024 released',
  'MySSM mobile app launches for iOS and Android',
  'Company search API now public — developer preview',
  'Selangor Business Registry integrates with SSM',
  'Johor business park registrations grow 22%',
  'Cross-border company recognition treaty signed',
  'SSM joins ASEAN business registry network',
  'Corporate governance code updated — key changes',
  'Non-profit organisation registration simplified',
  'Co-operative society rules align with Companies Act',
  'SSM staff training portal launched',
  'Business name reservation extended to 60 days',
  'Q1 2025 new company registrations hit record 18k',
  'Sarawak dissolves state assembly',
  'PAS Claims It Can Win First Sarawak Seat',
].map((title, i) => ({
  id: i + 1,
  title,
  snippet: 'SSM-related: found in Apr 2025 monitoring dataset',
}))
