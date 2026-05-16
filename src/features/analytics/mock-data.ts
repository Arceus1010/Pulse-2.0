import type {
  KPIMetrics, Post, SentimentByPeriod, SentimentByPlatform,
  SourceBreakdown, StateData, Author, Influencer, PestleEntry,
  TopicCluster, EntityNode, EntityEdge, IssueResult,
  ShareOfVoiceItem, LanguageItem, StrongestRelation,
} from './types'
import { CHART_COLORS, SENTIMENT_COLORS } from './constants'

export const kpiMetrics: KPIMetrics = {
  totalMentions: 203789,
  totalMentionsDelta: 18,
  totalPosts: 31,
  totalPostsDelta: 4,
  totalReach: 48715,
  totalReachDelta: -3,
  engagements: 321817,
  engagementsDelta: 24,
  sentimentScore: 62,
  sentimentScoreDelta: 7,
  uniqueAuthors: 1204,
  uniqueAuthorsDelta: 11,
}

export const topPosts: Post[] = [
  { id: '1', author: '@ssm_malaysia', authorHandle: 'ssm_malaysia', platform: 'twitter', content: 'New MySSM portal launched! Register your business in minutes. #SSM #StartupMY', likes: 12400, shares: 3200, reach: 220000, sentiment: 'positive', publishedAt: '2025-04-14' },
  { id: '2', author: 'BizWire MY', authorHandle: 'BizWire MY', platform: 'news', content: 'SSM warns of surge in shell company registrations — 3,200 flagged for audit in Q1.', likes: 8700, shares: 1900, reach: 95000, sentiment: 'negative', publishedAt: '2025-04-19' },
  { id: '3', author: '@KLFinanceWatch', authorHandle: 'KLFinanceWatch', platform: 'twitter', content: 'Reminder: SSM annual return filings due end of April. Late fees of RM50/day apply.', likes: 6100, shares: 890, reach: 52000, sentiment: 'neutral', publishedAt: '2025-04-25' },
  { id: '4', author: 'shamhr00', authorHandle: 'shamhr00', platform: 'tiktok', content: 'POV: You just registered your company on MySSM in under 10 minutes 🤯 #SSM #business', likes: 23000, shares: 2790, reach: 180000, sentiment: 'positive', publishedAt: '2025-04-15' },
  { id: '5', author: 'sinarharianonline', authorHandle: 'sinarharianonline', platform: 'tiktok', content: 'Datuk Seri Abdul Halim Aman dilantik sebagai Ketua Pesurujaya, Suruhanjaya Pencegahan Rasuah Malaysia (SPRM) baharu berkuatkuasa pada 13 Mei 2026...', likes: 7700, shares: 1200, reach: 410000, sentiment: 'neutral', publishedAt: '2025-04-22' },
  { id: '6', author: '501awani', authorHandle: '501awani', platform: 'tiktok', content: 'Suruhanjaya Pencegahan Rasuah Malaysia (SPRM) Selangor mendapat kebenaran untuk menyambung reman seorang timbalan yang dipertua sebuah badan bukan kerajaan...', likes: 207, shares: 4, reach: 38000, sentiment: 'negative', publishedAt: '2025-04-28' },
]

export const trendData = [
  { date: 'Apr 1', engagements: 18000, reach: 8000 },
  { date: 'Apr 7', engagements: 22000, reach: 10000 },
  { date: 'Apr 14', engagements: 62000, reach: 26000 },
  { date: 'Apr 19', engagements: 45000, reach: 20000 },
  { date: 'Apr 25', engagements: 40000, reach: 18000 },
  { date: 'Apr 30', engagements: 38000, reach: 16000 },
]

export const trendByPlatform = [
  { platform: 'Twitter / X', posts: 77440 },
  { platform: 'News Sites', posts: 52980 },
  { platform: 'Facebook', posts: 36532 },
  { platform: 'Forums', posts: 22417 },
  { platform: 'TikTok', posts: 14200 },
  { platform: 'Blogs', posts: 14265 },
]

export const likesData = [
  { date: 'Apr 1', likes: 4200 },
  { date: 'Apr 7', likes: 6800 },
  { date: 'Apr 14', likes: 24000 },
  { date: 'Apr 19', likes: 15000 },
  { date: 'Apr 25', likes: 12000 },
  { date: 'Apr 30', likes: 9000 },
]

export const sharesData = [
  { date: 'Apr 1', shares: 1200 },
  { date: 'Apr 7', shares: 2100 },
  { date: 'Apr 14', shares: 8900 },
  { date: 'Apr 19', shares: 5600 },
  { date: 'Apr 25', shares: 4200 },
  { date: 'Apr 30', shares: 3800 },
]

export const sourceBreakdown = [
  { name: 'Twitter / X', value: 38, color: CHART_COLORS.blue },
  { name: 'News Sites', value: 26, color: CHART_COLORS.amber },
  { name: 'Facebook', value: 18, color: CHART_COLORS.indigo },
  { name: 'Forums', value: 11, color: CHART_COLORS.purple },
  { name: 'Blogs', value: 7, color: CHART_COLORS.teal },
]

export const sentimentByPeriod: SentimentByPeriod[] = [
  { period: 'Week 1', positive: 22, negative: 63, neutral: 15 },
  { period: 'Week 2', positive: 20, negative: 68, neutral: 12 },
  { period: 'Week 3', positive: 25, negative: 65, neutral: 10 },
  { period: 'Week 4', positive: 28, negative: 58, neutral: 14 },
]

export const overallSentiment = [
  { name: 'Negative', value: 62, color: SENTIMENT_COLORS.negative },
  { name: 'Positive', value: 24, color: SENTIMENT_COLORS.positive },
  { name: 'Neutral', value: 14, color: SENTIMENT_COLORS.neutral },
]

export const sentimentByPlatform: SentimentByPlatform[] = [
  { platform: 'Twitter', positive: 35, negative: 45, neutral: 20 },
  { platform: 'Facebook', positive: 40, negative: 35, neutral: 25 },
  { platform: 'News', positive: 38, negative: 38, neutral: 24 },
  { platform: 'Forums', positive: 22, negative: 52, neutral: 26 },
  { platform: 'TikTok', positive: 55, negative: 25, neutral: 20 },
]

export const negativeDrivers = [
  { name: 'Late Penalties', value: 34, color: CHART_COLORS.red },
  { name: 'Shell Audit', value: 28, color: CHART_COLORS.pink },
  { name: 'Director Liability', value: 18, color: CHART_COLORS.amber },
  { name: 'Compliance Cost', value: 12, color: CHART_COLORS.purple },
  { name: 'Other', value: 8, color: CHART_COLORS.zinc },
]

export const influencers: Record<string, Influencer[]> = {
  negative: [
    { name: 'Ahmad Zafrul', handle: '@azafrul', initials: 'AZ', reach: '98.2k', platform: 'Twitter', quote: "SSM's enforcement is long overdue but the penalties seem arbitrary — small businesses bear the brunt while large shell networks persist undetected." },
    { name: 'Malaysiakini', handle: 'News', initials: 'MK', reach: '1.2M', platform: 'News', quote: 'Shell company crackdown raises questions about oversight gaps; directors face personal liability under updated Companies Act provisions.' },
    { name: 'LHDN Watch', handle: '@lhdnwatch', initials: 'LW', reach: '44k', platform: 'Twitter', quote: 'Late penalty regime for annual returns is punitive. RM50/day adds up fast for dormant companies with no revenue.' },
  ],
  positive: [
    { name: '@ssm_malaysia', handle: 'Official', initials: 'SM', reach: '220k', platform: 'Twitter', quote: 'New MySSM portal processed 18,000 registrations in 48 hours — fastest onboarding rate in SSM history. #DigitalMalaysia' },
    { name: 'BizMalaysia', handle: '@bizmalaysia', initials: 'BM', reach: '67k', platform: 'Twitter', quote: 'Entrepreneurs finally getting the digital tools they deserve. MySSM portal is a game-changer for startups across Malaysia.' },
    { name: 'MDEC Official', handle: '@mdec', initials: 'MD', reach: '110k', platform: 'Twitter', quote: "SSM's digitisation milestone aligns perfectly with Malaysia Digital Economy Blueprint targets for 2025." },
  ],
  neutral: [
    { name: '@KLFinanceWatch', handle: 'Finance', initials: 'KF', reach: '52k', platform: 'Twitter', quote: 'SSM annual return deadline approaching. File online via MySSM to avoid the RM50/day late charge. Full guide linked below.' },
    { name: 'The Star Online', handle: 'News', initials: 'TS', reach: '800k', platform: 'News', quote: 'SSM reports 203,000 mentions across social platforms in April — up 18% from March, largely driven by MySSM portal launch.' },
    { name: '@acctmalaysia', handle: 'Accounting', initials: 'AM', reach: '28k', platform: 'Twitter', quote: "Summary of SSM's latest updates to annual return requirements. Key changes to note for financial year 2024 filers." },
  ],
}

export const newsSources: SourceBreakdown[] = [
  { name: 'The Star Online',     posts: 4820, reach: 4200000, positive: 55, negative: 25, neutral: 20 },
  { name: 'Sinar Harian',        posts: 980,  reach: 1800000, positive: 25, negative: 55, neutral: 20 },
  { name: 'Malaysiakini',        posts: 3210, reach: 1200000, positive: 20, negative: 60, neutral: 20 },
  { name: 'New Straits Times',   posts: 2980, reach: 800000,  positive: 45, negative: 30, neutral: 25 },
  { name: 'Free Malaysia Today', posts: 2540, reach: 650000,  positive: 30, negative: 50, neutral: 20 },
  { name: 'The Edge MY',         posts: 1120, reach: 500000,  positive: 35, negative: 45, neutral: 20 },
  { name: 'Malay Mail',          posts: 1640, reach: 350000,  positive: 40, negative: 35, neutral: 25 },
  { name: 'BizWire MY',          posts: 1870, reach: 200000,  positive: 15, negative: 70, neutral: 15 },
]

export const socialSources: SourceBreakdown[] = [
  { name: 'TikTok',      posts: 14200, reach: 12000000, positive: 55, negative: 25, neutral: 20 },
  { name: 'News Sites',  posts: 52980, reach: 9500000,  positive: 38, negative: 38, neutral: 24 },
  { name: 'Twitter / X', posts: 77440, reach: 8500000,  positive: 35, negative: 45, neutral: 20 },
  { name: 'Facebook',    posts: 36532, reach: 6200000,  positive: 40, negative: 35, neutral: 25 },
  { name: 'Forums',      posts: 22417, reach: 1800000,  positive: 22, negative: 52, neutral: 26 },
  { name: 'Blogs',       posts: 14265, reach: 900000,   positive: 30, negative: 40, neutral: 30 },
]

export const newsSourcePie = [
  { name: 'The Star Online', value: 4820, color: CHART_COLORS.blue },
  { name: 'Malaysiakini', value: 3210, color: CHART_COLORS.red },
  { name: 'New Straits Times', value: 2980, color: CHART_COLORS.green },
  { name: 'Free Malaysia Today', value: 2540, color: CHART_COLORS.amber },
  { name: 'BizWire MY', value: 1870, color: CHART_COLORS.pink },
  { name: 'Malay Mail', value: 1640, color: CHART_COLORS.purple },
  { name: 'The Edge MY', value: 1120, color: CHART_COLORS.teal },
  { name: 'Sinar Harian', value: 980, color: CHART_COLORS.zinc },
]

export const socialPlatformPie = [
  { name: 'Twitter / X', value: 77440, color: CHART_COLORS.blue },
  { name: 'News Sites', value: 52980, color: CHART_COLORS.amber },
  { name: 'Facebook', value: 36532, color: CHART_COLORS.indigo },
  { name: 'Forums', value: 22417, color: CHART_COLORS.purple },
  { name: 'TikTok', value: 14200, color: CHART_COLORS.pink },
  { name: 'Blogs', value: 14265, color: CHART_COLORS.teal },
]

export const newsAuthors: Author[] = [
  { id: 'a1', name: 'The Star Editorial', handle: 'The Star Online', platform: 'news',    reach: '4.2M', sentiment: 'positive', initials: 'TS', recentStatement: 'The MySSM portal launch marks a genuine step forward for Malaysian businesses. Registration times have dropped by 80% and early adoption figures are the strongest in SSM history.' },
  { id: 'a2', name: 'Lim Yen Lin',        handle: 'Malaysiakini',   platform: 'news',    reach: '1.2M', sentiment: 'negative', initials: 'LY', recentStatement: 'Shell company crackdown raises questions about systemic oversight gaps. Directors face personal liability under updated Companies Act provisions, but enforcement resources remain stretched.' },
  { id: 'a3', name: 'Ahmad Zafrul',       handle: '@azafrul',       platform: 'twitter', reach: '98.2k', sentiment: 'negative', initials: 'AZ', recentStatement: "SSM's enforcement is long overdue but the penalties seem arbitrary — small businesses bear the brunt while large shell networks persist undetected." },
  { id: 'a4', name: 'LHDN Watch',         handle: '@lhdnwatch',     platform: 'twitter', reach: '44k',  sentiment: 'negative', initials: 'LW', recentStatement: 'Late penalty regime for annual returns is punitive. RM50/day adds up fast for dormant companies with no revenue. Small operators are being crushed by the compliance burden.' },
  { id: 'a5', name: 'Farhan Ibrahim',     handle: '@farhanibr',     platform: 'twitter', reach: '31k',  sentiment: 'neutral',  initials: 'FI', recentStatement: 'MySSM portal works great for basic registration. But try doing a director change or share transfer — still clunky. Full digitisation is still a work in progress.' },
]

export const socialAuthors: Author[] = [
  { id: 's1', name: '@ssm_malaysia',    handle: 'Twitter', platform: 'twitter', reach: '220k', sentiment: 'positive', initials: 'SM', recentStatement: 'New MySSM portal launched! Register your business in minutes. 18,000 registrations processed in 48 hours — fastest onboarding rate in SSM history. #DigitalMalaysia' },
  { id: 's2', name: 'BizMalaysia',      handle: '@bizmalaysia', platform: 'twitter', reach: '67k', sentiment: 'positive', initials: 'BM', recentStatement: 'Entrepreneurs finally getting the digital tools they deserve. MySSM portal is a game-changer for startups across Malaysia. Registration is now genuinely frictionless.' },
  { id: 's3', name: '@KLFinanceWatch',  handle: 'Twitter', platform: 'twitter', reach: '52k', sentiment: 'neutral',  initials: 'KF', recentStatement: "Reminder: SSM annual return filings due end of April. Late fees of RM50/day apply. Use the new MySSM portal to file online — it's actually pretty seamless now." },
  { id: 's4', name: 'sinarharianonline',handle: 'TikTok',  platform: 'tiktok',  reach: '7.7k likes', sentiment: 'neutral',  initials: 'SN', recentStatement: 'Datuk Seri Abdul Halim Aman dilantik sebagai Ketua Pesurujaya SPRM baharu berkuatkuasa pada 13 Mei 2026. Ramai yang tertanya-tanya tentang hala tuju SPRM.' },
  { id: 's5', name: 'shamhr00',         handle: 'TikTok',  platform: 'tiktok',  reach: '2.3k likes', sentiment: 'positive', initials: 'SH', recentStatement: 'POV: You just registered your company on MySSM in under 10 minutes — the process is genuinely fast now. Old system needed like 3 trips to the office.' },
]

export const geoData: StateData[] = [
  { state: 'Selangor', percentage: 32, mentions: 65213 },
  { state: 'Kuala Lumpur', percentage: 28, mentions: 57060 },
  { state: 'Johor', percentage: 12, mentions: 24455 },
  { state: 'Penang', percentage: 10, mentions: 20379 },
  { state: 'Perak', percentage: 7, mentions: 14265 },
  { state: 'Sabah', percentage: 5, mentions: 10189 },
  { state: 'Sarawak', percentage: 4, mentions: 8152 },
  { state: 'Others', percentage: 2, mentions: 4076 },
]

export const pestleData: PestleEntry[] = [
  {
    dimension: 'P', name: 'Political', count: 847, percentage: 24,
    tags: ['Politicians', 'Policy', 'Parliament'],
    insight: 'Opposition MPs cited SSM enforcement directives in 3 parliamentary questions this month. The MySSM portal launch was credited to Minister Fahmi Fadzil\'s digitisation mandate, generating positive political framing. However, 31% of political posts carry negative sentiment related to perceived government overreach in the shell company audit campaign.',
    posts: [
      { author: '@MalayMailOnline', platform: 'News', text: 'Minister Fahmi launches revamped MySSM portal, pledges 48-hour company registration.', sentiment: 'positive' },
      { author: '@parti_critic', platform: 'Twitter', text: 'SSM audit targeting bumiputera SMEs disproportionately — where is the policy fairness?', sentiment: 'negative' },
    ],
  },
  {
    dimension: 'E', name: 'Economic', count: 1203, percentage: 34,
    tags: ['Filings', 'Penalties', 'Bursa'],
    insight: 'Economic dimension dominates the dataset (34% of posts). Key drivers: 3,200 shell companies flagged for audit (negative), new MySSM portal reducing registration time to 24h (positive), and RM50/day late filing penalties generating high-volume complaints. Bursa cross-mentions indicate institutional investor monitoring of SSM enforcement outcomes.',
    posts: [
      { author: 'BizWire MY', platform: 'News', text: 'SSM warns of surge in shell company registrations — 3,200 flagged for audit in Q1.', sentiment: 'negative' },
      { author: '@KLFinanceWatch', platform: 'Twitter', text: 'Reminder: SSM annual return filings due end of April. Late fees of RM50/day apply.', sentiment: 'neutral' },
    ],
  },
  {
    dimension: 'S', name: 'Social', count: 634, percentage: 18,
    tags: ['SME concerns', 'Complaints'],
    insight: 'Social dimension is driven by SME and startup community sentiment around the registration process. MySSM portal launch generated strong positive buzz among startup Twitter. Counter-narrative: forum posts from small business owners frustrated by penalty notices and deregistration threats. BM-language posts dominate this dimension (61%).',
    posts: [
      { author: '@ssm_malaysia', platform: 'Twitter', text: 'New MySSM portal launched! Register your business in minutes. #SSM #StartupMY', sentiment: 'positive' },
      { author: 'lowyat.net', platform: 'Forums', text: 'Got deregistration notice from SSM after missing 1 filing — any way to appeal without lawyer?', sentiment: 'negative' },
    ],
  },
  {
    dimension: 'T', name: 'Technological', count: 412, percentage: 12,
    tags: ['MySSM portal', 'Digital'],
    insight: 'Portal digitisation narrative is broadly positive. Key story: MySSM 2.0 launch with API access for third-party integration (legal firms, accounting software). Negative signal: "MySSM down" appearing in 47 posts on Apr 28 suggesting a portal outage. Tech dimension posts are predominantly English (58%).',
    posts: [
      { author: '@ssm_malaysia', platform: 'Twitter', text: 'MySSM API now live — integrate company verification directly into your app. Docs at dev.ssm.gov.my', sentiment: 'positive' },
      { author: '@devmy_forum', platform: 'Twitter', text: 'MySSM portal down again? Getting 502 errors for the past 2 hours. Anyone else?', sentiment: 'negative' },
    ],
  },
  {
    dimension: 'L', name: 'Legal', count: 891, percentage: 25,
    tags: ['Companies Act', 'Enforcement'],
    insight: 'Legal is the highest-risk dimension this month. Shell company enforcement, director liability posts, and Companies Act amendment discussions are all trending upward. MACC cross-mentions (11 posts) signal that some enforcement actions have criminal dimensions. Recommend close monitoring — Legal × Political cross-tagged posts are increasing week-on-week.',
    posts: [
      { author: '@legalMY_watch', platform: 'Twitter', text: 'SSM files 47 criminal charges against phantom directors under s.595 Companies Act 2016.', sentiment: 'negative' },
      { author: 'The Edge MY', platform: 'News', text: 'Lawyers warn of rising director liability risk as SSM ramps up compliance enforcement.', sentiment: 'negative' },
    ],
  },
  {
    dimension: 'Env', name: 'Environmental', count: 247, percentage: 7,
    tags: ['ESG reporting', 'Sustainability'],
    insight: 'Smallest dimension but growing. Bursa Malaysia\'s mandatory ESG disclosure requirements for listed companies are generating SSM cross-mentions (companies filing ESG reports alongside annual returns). Early signal: sustainability-focused investors tracking corporate governance quality via SSM filing compliance.',
    posts: [
      { author: 'Bursa Malaysia', platform: 'News', text: 'All Main Market companies must submit sustainability report with annual filing from 2025 onwards.', sentiment: 'neutral' },
      { author: '@ESGinvestorMY', platform: 'Twitter', text: 'Using SSM data to screen for companies with consistent filing history — a proxy for governance quality.', sentiment: 'positive' },
    ],
  },
]

export const radarData = [
  { dim: 'Political', negative: 70, positive: 30 },
  { dim: 'Economic', negative: 58, positive: 55 },
  { dim: 'Social', negative: 45, positive: 65 },
  { dim: 'Technological', negative: 25, positive: 80 },
  { dim: 'Legal', negative: 85, positive: 22 },
  { dim: 'Environmental', negative: 30, positive: 58 },
]

export const pestleTrend = [
  { month: 'Jan', P: 500, E: 800, S: 400, T: 250, L: 600, Env: 150 },
  { month: 'Feb', P: 620, E: 950, S: 480, T: 300, L: 700, Env: 180 },
  { month: 'Mar', P: 700, E: 1100, S: 570, T: 380, L: 810, Env: 220 },
  { month: 'Apr', P: 847, E: 1203, S: 634, T: 412, L: 891, Env: 247 },
]

export const topicClusters: TopicCluster[] = [
  { label: 'Business registration', count: 947, color: 'blue' },
  { label: 'Company compliance', count: 421, color: 'red' },
  { label: 'Annual filing', count: 413, color: 'amber' },
  { label: 'Director changes', count: 314, color: 'purple' },
  { label: 'SSM portal', count: 283, color: 'blue' },
  { label: 'License renewal', count: 261, color: 'green' },
  { label: 'Late penalty', count: 97, color: 'red' },
  { label: 'Form 9', count: 146, color: 'amber' },
  { label: 'Winding up', count: 39, color: 'purple' },
  { label: 'Sdn Bhd', count: 31, color: 'blue' },
  { label: 'Shell company', count: 4, color: 'teal' },
]

export const shareOfVoice: ShareOfVoiceItem[] = [
  { name: 'SSM', value: 45 },
  { name: 'MySSM', value: 22 },
  { name: 'Suruhanjaya', value: 18 },
  { name: 'CTOS', value: 8 },
  { name: 'COM', value: 4 },
]

export const languageBreakdown: LanguageItem[] = [
  { name: 'Bahasa Malaysia', value: 49, color: CHART_COLORS.blue },
  { name: 'English', value: 34, color: CHART_COLORS.green },
  { name: 'Chinese', value: 13, color: CHART_COLORS.amber },
  { name: 'Other', value: 4, color: CHART_COLORS.zinc },
]

export const strongestRelations: StrongestRelation[] = [
  { label: '@ssm_malaysia → MySSM Portal', score: 0.92, scoreColor: CHART_COLORS.blue },
  { label: 'BizWire MY → Shell Company Report', score: 0.87, scoreColor: CHART_COLORS.blue },
  { label: '@KLFinanceWatch → Annual Filing', score: 0.79, scoreColor: CHART_COLORS.blue },
  { label: 'Twitter → Legal Cluster', score: 0.74, scoreColor: CHART_COLORS.amber },
  { label: 'NST → Companies Act Coverage', score: 0.68, scoreColor: CHART_COLORS.green },
]

export const entityNodes: EntityNode[] = [
  // Orgs
  { id: 'ssm',          lines: ['SSM'],               type: 'org',    r: 26 },
  { id: 'bnm',          lines: ['Bank', 'Negara'],    type: 'org',    r: 22 },
  { id: 'mof',          lines: ['MOF'],               type: 'org',    r: 17 },
  { id: 'companies_act',lines: ['Companies', 'Act'],  type: 'org',    r: 14 },
  // Sources
  { id: 'twitter',      lines: ['Twitter / X'],       type: 'source', r: 17 },
  { id: 'the_edge',     lines: ['The Edge'],          type: 'source', r: 16 },
  { id: 'bernama',      lines: ['Bernama'],           type: 'source', r: 15 },
  { id: 'tiktok',       lines: ['TikTok'],            type: 'source', r: 14 },
  // Authors
  { id: 'ssm_acc',      lines: ['@ssm', 'malaysia'],  type: 'author', r: 16 },
  { id: 'edge_acc',     lines: ['@Edge', 'Markets'],  type: 'author', r: 15 },
  { id: 'klfw',         lines: ['@KLFin', 'Watch'],   type: 'author', r: 14 },
  // Posts
  { id: 'audit_notice', lines: ['Audit', 'Notice'],   type: 'post',   r: 14 },
  { id: 'bnm_report',   lines: ['BNM', 'Report'],     type: 'post',   r: 14 },
  // Topics
  { id: 'shell',        lines: ['Shell', 'Companies'],type: 'topic',  r: 22 },
  { id: 'late_filing',  lines: ['Late', 'Filing'],    type: 'topic',  r: 19 },
  { id: 'penalty',      lines: ['RM50/day', 'Penalty'],type: 'topic', r: 16 },
  { id: 'aml',          lines: ['AML', 'Risk'],       type: 'topic',  r: 18 },
]

export const entityEdges: EntityEdge[] = [
  // MOF oversees both regulators
  { from: 'mof',          to: 'ssm',          label: 'oversees' },
  { from: 'mof',          to: 'bnm',          label: 'oversees' },
  // SSM cluster
  { from: 'ssm',          to: 'companies_act',label: 'enforces' },
  { from: 'ssm',          to: 'late_filing',  label: 'tracks' },
  { from: 'ssm',          to: 'shell',        label: 'regulates' },
  { from: 'ssm',          to: 'ssm_acc',      label: 'operates' },
  { from: 'ssm',          to: 'audit_notice', label: 'issues' },
  // BNM cluster
  { from: 'bnm',          to: 'aml',          label: 'monitors' },
  { from: 'bnm',          to: 'shell',        label: 'flags' },
  { from: 'bnm',          to: 'bnm_report',   label: 'publishes' },
  // Cross-cluster bridge
  { from: 'ssm',          to: 'bnm',          label: 'coordinates' },
  // Topic chain
  { from: 'shell',        to: 'aml',          label: 'poses' },
  { from: 'shell',        to: 'late_filing',  label: 'linked to' },
  { from: 'late_filing',  to: 'penalty',      label: 'triggers' },
  { from: 'companies_act',to: 'penalty',      label: 'specifies' },
  // Platforms → Authors
  { from: 'twitter',      to: 'ssm_acc' },
  { from: 'twitter',      to: 'edge_acc' },
  { from: 'twitter',      to: 'klfw' },
  // Platforms → Posts
  { from: 'the_edge',     to: 'audit_notice', label: 'covers' },
  { from: 'bernama',      to: 'bnm_report',   label: 'reports' },
  // Authors → Topics
  { from: 'ssm_acc',      to: 'late_filing',  label: 'warns' },
  { from: 'edge_acc',     to: 'shell',        label: 'reports on' },
  { from: 'klfw',         to: 'aml',          label: 'covers' },
  // TikTok amplifies
  { from: 'tiktok',       to: 'shell',        label: 'amplifies' },
]

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

export const NODE_TYPE_COLORS: Record<string, string> = {
  source: CHART_COLORS.blue,
  author: CHART_COLORS.green,
  post: CHART_COLORS.amber,
  org: CHART_COLORS.purple,
  topic: CHART_COLORS.red,
}

export const PESTLE_LETTER_DISPLAY: Record<string, string> = {
  P: 'P', E: 'E', S: 'S', T: 'T', L: 'L', Env: 'E',
}
