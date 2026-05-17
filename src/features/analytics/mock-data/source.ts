import type { SourceBreakdown, Author } from '../types'

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

export const newsAuthors: Author[] = [
  { id: 'a1', name: 'The Star Editorial', handle: 'The Star Online', platform: 'news',    reach: '4.2M',  sentiment: 'positive', initials: 'TS', recentStatement: 'The MySSM portal launch marks a genuine step forward for Malaysian businesses. Registration times have dropped by 80% and early adoption figures are the strongest in SSM history.' },
  { id: 'a2', name: 'Lim Yen Lin',        handle: 'Malaysiakini',   platform: 'news',    reach: '1.2M',  sentiment: 'negative', initials: 'LY', recentStatement: 'Shell company crackdown raises questions about systemic oversight gaps. Directors face personal liability under updated Companies Act provisions, but enforcement resources remain stretched.' },
  { id: 'a3', name: 'Ahmad Zafrul',       handle: '@azafrul',       platform: 'twitter', reach: '98.2k', sentiment: 'negative', initials: 'AZ', recentStatement: "SSM's enforcement is long overdue but the penalties seem arbitrary — small businesses bear the brunt while large shell networks persist undetected." },
  { id: 'a4', name: 'LHDN Watch',         handle: '@lhdnwatch',     platform: 'twitter', reach: '44k',   sentiment: 'negative', initials: 'LW', recentStatement: 'Late penalty regime for annual returns is punitive. RM50/day adds up fast for dormant companies with no revenue. Small operators are being crushed by the compliance burden.' },
  { id: 'a5', name: 'Farhan Ibrahim',     handle: '@farhanibr',     platform: 'twitter', reach: '31k',   sentiment: 'neutral',  initials: 'FI', recentStatement: 'MySSM portal works great for basic registration. But try doing a director change or share transfer — still clunky. Full digitisation is still a work in progress.' },
]

export const socialAuthors: Author[] = [
  { id: 's1', name: '@ssm_malaysia',     handle: 'Twitter', platform: 'twitter', reach: '220k',      sentiment: 'positive', initials: 'SM', recentStatement: 'New MySSM portal launched! Register your business in minutes. 18,000 registrations processed in 48 hours — fastest onboarding rate in SSM history. #DigitalMalaysia' },
  { id: 's2', name: 'BizMalaysia',       handle: '@bizmalaysia', platform: 'twitter', reach: '67k',  sentiment: 'positive', initials: 'BM', recentStatement: 'Entrepreneurs finally getting the digital tools they deserve. MySSM portal is a game-changer for startups across Malaysia. Registration is now genuinely frictionless.' },
  { id: 's3', name: '@KLFinanceWatch',   handle: 'Twitter', platform: 'twitter', reach: '52k',       sentiment: 'neutral',  initials: 'KF', recentStatement: "Reminder: SSM annual return filings due end of April. Late fees of RM50/day apply. Use the new MySSM portal to file online — it's actually pretty seamless now." },
  { id: 's4', name: 'sinarharianonline', handle: 'TikTok',  platform: 'tiktok',  reach: '7.7k likes',sentiment: 'neutral',  initials: 'SN', recentStatement: 'Datuk Seri Abdul Halim Aman dilantik sebagai Ketua Pesurujaya SPRM baharu berkuatkuasa pada 13 Mei 2026. Ramai yang tertanya-tanya tentang hala tuju SPRM.' },
  { id: 's5', name: 'shamhr00',          handle: 'TikTok',  platform: 'tiktok',  reach: '2.3k likes',sentiment: 'positive', initials: 'SH', recentStatement: 'POV: You just registered your company on MySSM in under 10 minutes — the process is genuinely fast now. Old system needed like 3 trips to the office.' },
]
