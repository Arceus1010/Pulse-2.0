import type { KPIMetrics, Post } from '../types'
import { CHART_COLORS } from '../constants'

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
  { id: '1', author: '@ssm_malaysia',      authorHandle: 'ssm_malaysia',      platform: 'twitter', content: 'New MySSM portal launched! Register your business in minutes. #SSM #StartupMY',                                                                                                                                                              likes: 12400, shares: 3200, reach: 220000, sentiment: 'positive', publishedAt: '2025-04-14' },
  { id: '2', author: 'BizWire MY',         authorHandle: 'BizWire MY',         platform: 'news',    content: 'SSM warns of surge in shell company registrations — 3,200 flagged for audit in Q1.',                                                                                                                                                         likes: 8700,  shares: 1900, reach: 95000,  sentiment: 'negative', publishedAt: '2025-04-19' },
  { id: '3', author: '@KLFinanceWatch',    authorHandle: 'KLFinanceWatch',    platform: 'twitter', content: 'Reminder: SSM annual return filings due end of April. Late fees of RM50/day apply.',                                                                                                                                                          likes: 6100,  shares: 890,  reach: 52000,  sentiment: 'neutral',  publishedAt: '2025-04-25' },
  { id: '4', author: 'shamhr00',           authorHandle: 'shamhr00',           platform: 'tiktok',  content: 'POV: You just registered your company on MySSM in under 10 minutes 🤯 #SSM #business',                                                                                                                                                        likes: 23000, shares: 2790, reach: 180000, sentiment: 'positive', publishedAt: '2025-04-15' },
  { id: '5', author: 'sinarharianonline',  authorHandle: 'sinarharianonline',  platform: 'tiktok',  content: 'Datuk Seri Abdul Halim Aman dilantik sebagai Ketua Pesurujaya, Suruhanjaya Pencegahan Rasuah Malaysia (SPRM) baharu berkuatkuasa pada 13 Mei 2026...',                                                                                        likes: 7700,  shares: 1200, reach: 410000, sentiment: 'neutral',  publishedAt: '2025-04-22' },
  { id: '6', author: '501awani',           authorHandle: '501awani',           platform: 'tiktok',  content: 'Suruhanjaya Pencegahan Rasuah Malaysia (SPRM) Selangor mendapat kebenaran untuk menyambung reman seorang timbalan yang dipertua sebuah badan bukan kerajaan...',                                                                              likes: 207,   shares: 4,    reach: 38000,  sentiment: 'negative', publishedAt: '2025-04-28' },
]

export const trendData = [
  { date: 'Apr 1',  engagements: 18000, reach: 8000  },
  { date: 'Apr 7',  engagements: 22000, reach: 10000 },
  { date: 'Apr 14', engagements: 62000, reach: 26000 },
  { date: 'Apr 19', engagements: 45000, reach: 20000 },
  { date: 'Apr 25', engagements: 40000, reach: 18000 },
  { date: 'Apr 30', engagements: 38000, reach: 16000 },
]

export const trendByPlatform = [
  { platform: 'Twitter / X', posts: 77440 },
  { platform: 'News Sites',  posts: 52980 },
  { platform: 'Facebook',    posts: 36532 },
  { platform: 'Forums',      posts: 22417 },
  { platform: 'TikTok',      posts: 14200 },
  { platform: 'Blogs',       posts: 14265 },
]

export const likesData = [
  { date: 'Apr 1',  likes: 4200  },
  { date: 'Apr 7',  likes: 6800  },
  { date: 'Apr 14', likes: 24000 },
  { date: 'Apr 19', likes: 15000 },
  { date: 'Apr 25', likes: 12000 },
  { date: 'Apr 30', likes: 9000  },
]

export const sharesData = [
  { date: 'Apr 1',  shares: 1200 },
  { date: 'Apr 7',  shares: 2100 },
  { date: 'Apr 14', shares: 8900 },
  { date: 'Apr 19', shares: 5600 },
  { date: 'Apr 25', shares: 4200 },
  { date: 'Apr 30', shares: 3800 },
]

export const sourceBreakdown = [
  { name: 'Twitter / X', value: 38, color: CHART_COLORS.blue   },
  { name: 'News Sites',  value: 26, color: CHART_COLORS.amber  },
  { name: 'Facebook',    value: 18, color: CHART_COLORS.indigo },
  { name: 'Forums',      value: 11, color: CHART_COLORS.purple },
  { name: 'Blogs',       value: 7,  color: CHART_COLORS.teal   },
]
