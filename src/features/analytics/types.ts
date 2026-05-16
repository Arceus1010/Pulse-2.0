export type Platform = 'twitter' | 'facebook' | 'tiktok' | 'news' | 'forums' | 'blogs'
export type Sentiment = 'positive' | 'negative' | 'neutral'
export type PestleDim = 'P' | 'E' | 'S' | 'T' | 'L' | 'Env'
export type ClusterColor = 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'teal'
export type InfCategory = 'negative' | 'positive' | 'neutral'

export interface AnalyticsFilter {
  keywords: string[]
  dateFrom: string
  dateTo: string
  platforms: Platform[]
}

export interface KPIMetrics {
  totalMentions: number
  totalMentionsDelta: number
  totalPosts: number
  totalPostsDelta: number
  totalReach: number
  totalReachDelta: number
  engagements: number
  engagementsDelta: number
  sentimentScore: number
  sentimentScoreDelta: number
  uniqueAuthors: number
  uniqueAuthorsDelta: number
}

export interface Post {
  id: string
  author: string
  authorHandle: string
  platform: Platform
  content: string
  likes: number
  shares: number
  reach: number
  sentiment: Sentiment
  publishedAt: string
  url?: string
}

export interface SentimentByPeriod {
  [key: string]: string | number
  period: string
  positive: number
  negative: number
  neutral: number
}

export interface SentimentByPlatform {
  [key: string]: string | number
  platform: string
  positive: number
  negative: number
  neutral: number
}

export interface SourceBreakdown {
  name: string
  posts: number
  reach: number
  positive: number
  negative: number
  neutral: number
}

export interface StateData {
  state: string
  percentage: number
  mentions: number
  delta: number
  sentiment: { positive: number; negative: number; neutral: number }
  topTopics: string[]
  dominantPlatform: string
}

export interface Author {
  id: string
  name: string
  handle: string
  platform: Platform
  reach: string
  sentiment: Sentiment
  recentStatement: string
  initials: string
}

export interface Influencer {
  name: string
  handle: string
  initials: string
  reach: string
  platform: string
  quote: string
}

export interface PestleEntry {
  dimension: PestleDim
  name: string
  count: number
  percentage: number
  tags: string[]
  insight: string
  posts: {
    author: string
    platform: string
    text: string
    sentiment: Sentiment
  }[]
}

export interface TopicCluster {
  label: string
  count: number
  color: ClusterColor
}

export interface EntityNode {
  id: string
  lines: string[]
  type: 'source' | 'author' | 'post' | 'org' | 'topic'
  x?: number
  y?: number
  r: number
}

export interface EntityEdge {
  from: string
  to: string
  label?: string
}

export interface IssueResult {
  id: number
  title: string
  snippet: string
}

export interface ShareOfVoiceItem {
  name: string
  value: number
}

export interface LanguageItem {
  name: string
  value: number
  color: string
}

export interface StrongestRelation {
  label: string
  score: number
  scoreColor: string
}
