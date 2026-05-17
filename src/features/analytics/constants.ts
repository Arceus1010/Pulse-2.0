import type { Platform } from './types'

export const CHART_COLORS = {
  blue: '#3b82f6',
  green: '#22c55e',
  red: '#ef4444',
  amber: '#f59e0b',
  purple: '#a855f7',
  teal: '#14b8a6',
  pink: '#ec4899',
  zinc: '#71717a',
  indigo: '#6366f1',
} as const

export const PLATFORM_COLORS: Record<string, string> = {
  twitter: '#3b82f6',
  'Twitter / X': '#3b82f6',
  news: '#f59e0b',
  News: '#f59e0b',
  facebook: '#6366f1',
  Facebook: '#6366f1',
  tiktok: '#ec4899',
  TikTok: '#ec4899',
  forums: '#a855f7',
  Forums: '#a855f7',
  blogs: '#14b8a6',
  Blogs: '#14b8a6',
}

export const PLATFORM_LABELS: Record<string, string> = {
  twitter: 'Twitter / X',
  news: 'News',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  forums: 'Forums',
  blogs: 'Blogs',
}

export const SENTIMENT_COLORS = {
  positive: '#22c55e',
  negative: '#ef4444',
  neutral: '#71717a',
} as const

export const PESTLE_COLORS: Record<string, string> = {
  P: '#ef4444',
  E: '#f59e0b',
  S: '#22c55e',
  T: '#3b82f6',
  L: '#a855f7',
  Env: '#14b8a6',
}

export const ALL_PLATFORMS: Platform[] = ['twitter', 'facebook', 'tiktok', 'news', 'forums', 'blogs']

export const PESTLE_LETTER_DISPLAY: Record<string, string> = {
  P: 'P', E: 'E', S: 'S', T: 'T', L: 'L', Env: 'En',
}

export const NODE_TYPE_COLORS: Record<string, string> = {
  source: CHART_COLORS.blue,
  author: CHART_COLORS.green,
  post:   CHART_COLORS.amber,
  org:    CHART_COLORS.purple,
  topic:  CHART_COLORS.red,
}
