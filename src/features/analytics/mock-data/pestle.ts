import type { PestleEntry } from '../types'

export const pestleData: PestleEntry[] = [
  {
    dimension: 'P', name: 'Political', count: 847, percentage: 24,
    tags: ['Politicians', 'Policy', 'Parliament'],
    insight: "Opposition MPs cited SSM enforcement directives in 3 parliamentary questions this month. The MySSM portal launch was credited to Minister Fahmi Fadzil's digitisation mandate, generating positive political framing. However, 31% of political posts carry negative sentiment related to perceived government overreach in the shell company audit campaign.",
    posts: [
      { author: '@MalayMailOnline', platform: 'News',    text: 'Minister Fahmi launches revamped MySSM portal, pledges 48-hour company registration.',                      sentiment: 'positive' },
      { author: '@parti_critic',    platform: 'Twitter', text: 'SSM audit targeting bumiputera SMEs disproportionately — where is the policy fairness?',                    sentiment: 'negative' },
    ],
  },
  {
    dimension: 'E', name: 'Economic', count: 1203, percentage: 34,
    tags: ['Filings', 'Penalties', 'Bursa'],
    insight: 'Economic dimension dominates the dataset (34% of posts). Key drivers: 3,200 shell companies flagged for audit (negative), new MySSM portal reducing registration time to 24h (positive), and RM50/day late filing penalties generating high-volume complaints. Bursa cross-mentions indicate institutional investor monitoring of SSM enforcement outcomes.',
    posts: [
      { author: 'BizWire MY',       platform: 'News',    text: 'SSM warns of surge in shell company registrations — 3,200 flagged for audit in Q1.',                        sentiment: 'negative' },
      { author: '@KLFinanceWatch',  platform: 'Twitter', text: 'Reminder: SSM annual return filings due end of April. Late fees of RM50/day apply.',                        sentiment: 'neutral'  },
    ],
  },
  {
    dimension: 'S', name: 'Social', count: 634, percentage: 18,
    tags: ['SME concerns', 'Complaints'],
    insight: 'Social dimension is driven by SME and startup community sentiment around the registration process. MySSM portal launch generated strong positive buzz among startup Twitter. Counter-narrative: forum posts from small business owners frustrated by penalty notices and deregistration threats. BM-language posts dominate this dimension (61%).',
    posts: [
      { author: '@ssm_malaysia', platform: 'Twitter', text: 'New MySSM portal launched! Register your business in minutes. #SSM #StartupMY',                                sentiment: 'positive' },
      { author: 'lowyat.net',    platform: 'Forums',  text: 'Got deregistration notice from SSM after missing 1 filing — any way to appeal without lawyer?',               sentiment: 'negative' },
    ],
  },
  {
    dimension: 'T', name: 'Technological', count: 412, percentage: 12,
    tags: ['MySSM portal', 'Digital'],
    insight: "Portal digitisation narrative is broadly positive. Key story: MySSM 2.0 launch with API access for third-party integration (legal firms, accounting software). Negative signal: \"MySSM down\" appearing in 47 posts on Apr 28 suggesting a portal outage. Tech dimension posts are predominantly English (58%).",
    posts: [
      { author: '@ssm_malaysia', platform: 'Twitter', text: 'MySSM API now live — integrate company verification directly into your app. Docs at dev.ssm.gov.my',            sentiment: 'positive' },
      { author: '@devmy_forum',  platform: 'Twitter', text: 'MySSM portal down again? Getting 502 errors for the past 2 hours. Anyone else?',                               sentiment: 'negative' },
    ],
  },
  {
    dimension: 'L', name: 'Legal', count: 891, percentage: 25,
    tags: ['Companies Act', 'Enforcement'],
    insight: 'Legal is the highest-risk dimension this month. Shell company enforcement, director liability posts, and Companies Act amendment discussions are all trending upward. MACC cross-mentions (11 posts) signal that some enforcement actions have criminal dimensions. Recommend close monitoring — Legal × Political cross-tagged posts are increasing week-on-week.',
    posts: [
      { author: '@legalMY_watch', platform: 'Twitter', text: 'SSM files 47 criminal charges against phantom directors under s.595 Companies Act 2016.',                    sentiment: 'negative' },
      { author: 'The Edge MY',    platform: 'News',    text: 'Lawyers warn of rising director liability risk as SSM ramps up compliance enforcement.',                      sentiment: 'negative' },
    ],
  },
  {
    dimension: 'Env', name: 'Environmental', count: 247, percentage: 7,
    tags: ['ESG reporting', 'Sustainability'],
    insight: "Smallest dimension but growing. Bursa Malaysia's mandatory ESG disclosure requirements for listed companies are generating SSM cross-mentions (companies filing ESG reports alongside annual returns). Early signal: sustainability-focused investors tracking corporate governance quality via SSM filing compliance.",
    posts: [
      { author: 'Bursa Malaysia',  platform: 'News',    text: 'All Main Market companies must submit sustainability report with annual filing from 2025 onwards.',           sentiment: 'neutral'  },
      { author: '@ESGinvestorMY',  platform: 'Twitter', text: 'Using SSM data to screen for companies with consistent filing history — a proxy for governance quality.',     sentiment: 'positive' },
    ],
  },
]

export const radarData = [
  { dim: 'Political',     negative: 70, positive: 30 },
  { dim: 'Economic',      negative: 58, positive: 55 },
  { dim: 'Social',        negative: 45, positive: 65 },
  { dim: 'Technological', negative: 25, positive: 80 },
  { dim: 'Legal',         negative: 85, positive: 22 },
  { dim: 'Environmental', negative: 30, positive: 58 },
]

export const pestleTrend = [
  { month: 'Jan', P: 500, E: 800,  S: 400, T: 250, L: 600, Env: 150 },
  { month: 'Feb', P: 620, E: 950,  S: 480, T: 300, L: 700, Env: 180 },
  { month: 'Mar', P: 700, E: 1100, S: 570, T: 380, L: 810, Env: 220 },
  { month: 'Apr', P: 847, E: 1203, S: 634, T: 412, L: 891, Env: 247 },
]
