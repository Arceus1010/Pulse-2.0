import type { AIResponse } from './types'

function formatKw(keywords: string[]): string {
  if (keywords.length === 1) return `"${keywords[0]}"`
  if (keywords.length === 2) return `"${keywords[0]}" and "${keywords[1]}"`
  return keywords.slice(0, -1).map(k => `"${k}"`).join(', ') + `, and "${keywords[keywords.length - 1]}"`
}

const NUDGE = 'Enter keywords above and click Analyse to get context-specific answers.'

const GENERAL: AIResponse[] = [
  {
    content:
      "I'm Pulse AI, your intelligence assistant. I can answer general questions about media monitoring and analytics right now. Enter keywords and run an analysis to unlock context-specific insights.",
    callout: 'Try asking about sentiment analysis, trend detection, platform coverage, or PESTLE.',
  },
  {
    content:
      "Without an active analysis I can help with questions about sentiment methodology, platform coverage, or PESTLE frameworks. What would you like to know?",
  },
  {
    content:
      'Sentiment analysis classifies content as positive, negative, or neutral using language patterns and contextual signals. The ratio shifts quickly in response to real-world events.',
    callout: NUDGE,
  },
  {
    content:
      'Media intelligence tracks how topics evolve across platforms — measuring volume, sentiment, geographic reach, and key influencers over time.',
    callout: 'Each dimension tells a different part of the story. Start with volume and sentiment to establish the baseline.',
  },
  {
    content:
      'PESTLE analysis maps macro-environmental factors affecting a narrative: Political, Economic, Social, Technological, Legal, and Environmental. It is especially useful for risk and opportunity mapping.',
    callout: NUDGE,
  },
  {
    content:
      'Platform mix matters because each channel attracts a different audience and expresses different sentiment. News, social media, and forums often diverge significantly on the same topic.',
    callout: NUDGE,
  },
  {
    content:
      'Trend spikes in conversation volume typically correlate with real-world events. Cross-referencing timelines with external news surfaces the root cause behind sudden shifts.',
    callout: NUDGE,
  },
]

export function generateResponse(message: string, keywords: string[]): AIResponse {
  const q = message.toLowerCase()

  if (keywords.length === 0) {
    if (q.includes('sentiment') || q.includes('positive') || q.includes('negative') || q.includes('neutral'))
      return GENERAL[2]
    if (q.includes('trend') || q.includes('spike') || q.includes('volume') || q.includes('time'))
      return GENERAL[6]
    if (q.includes('pestle') || q.includes('political') || q.includes('economic') || q.includes('factor'))
      return GENERAL[4]
    if (q.includes('source') || q.includes('platform') || q.includes('twitter') || q.includes('news'))
      return GENERAL[5]
    if (q.includes('media') || q.includes('intelligence') || q.includes('monitor'))
      return GENERAL[3]
    return GENERAL[Math.floor(Math.random() * GENERAL.length)]
  }

  const kw = formatKw(keywords)

  if (q.includes('sentiment') || q.includes('positive') || q.includes('negative') || q.includes('neutral'))
    return {
      content: `The sentiment picture around ${kw} tends to be layered — overall framing often coexists with a vocal minority expressing concern. Check the Sentiment tab for the exact split across each platform.`,
      callout:
        'Look for divergence between Twitter and news sentiment. When they split, social usually moves first and news follows within 24–48 hours.',
      tabHint: { label: 'Sentiment tab', tab: 'sentiment' },
    }

  if (
    q.includes('trend') ||
    q.includes('spike') ||
    q.includes('over time') ||
    q.includes('volume') ||
    q.includes('pattern') ||
    q.includes('when')
  )
    return {
      content: `Conversation around ${kw} rarely stays flat. Spikes typically follow media events, announcements, or controversy. The Trend tab shows where the inflection points are and how quickly momentum builds or fades.`,
      callout:
        'Inflection points that coincide with external news events are the highest-signal moments — they reveal what is actually driving the narrative.',
      tabHint: { label: 'Trend tab', tab: 'trend' },
    }

  if (
    q.includes('geo') ||
    q.includes('region') ||
    q.includes('location') ||
    q.includes('state') ||
    q.includes('where') ||
    q.includes('map') ||
    q.includes('spread')
  )
    return {
      content: `Geographic distribution for ${kw} reveals where the narrative is strongest. Urban centres and specific states often lead before a story spreads nationally. The Geographic tab has a state-level heatmap.`,
      callout:
        'Regional sentiment often diverges from the national average. State-level spikes that precede national coverage are your earliest warning signal.',
      tabHint: { label: 'Geographic tab', tab: 'geo' },
    }

  if (
    q.includes('pestle') ||
    q.includes('political') ||
    q.includes('economic') ||
    q.includes('social') ||
    q.includes('factor') ||
    q.includes('risk')
  )
    return {
      content: `From a PESTLE lens, ${kw} touches multiple dimensions simultaneously. Political and social factors tend to be the most volatile drivers. The PESTLE tab maps each dimension with supporting evidence from the data.`,
      callout:
        'High scores on Political and Social dimensions signal elevated reputational sensitivity — these are the areas requiring the fastest response.',
      tabHint: { label: 'PESTLE tab', tab: 'pestle' },
    }

  if (
    q.includes('source') ||
    q.includes('platform') ||
    q.includes('twitter') ||
    q.includes('facebook') ||
    q.includes('news') ||
    q.includes('channel') ||
    q.includes('media')
  )
    return {
      content: `Platform mix matters for ${kw}. Social platforms amplify emotional reactions quickly, while news outlets tend toward more measured framing. The Source tab shows where volume and sentiment diverge most.`,
      callout:
        'When social sentiment contradicts news sentiment, track which moves first — it usually predicts the eventual consensus direction.',
      tabHint: { label: 'Source tab', tab: 'source' },
    }

  if (
    q.includes('influencer') ||
    q.includes('account') ||
    q.includes('voice') ||
    q.includes('key person') ||
    q.includes('who is')
  )
    return {
      content: `Key accounts driving conversation around ${kw} shape how the narrative spreads. High-reach voices with aligned sentiment can accelerate or dampen a story significantly. The Overview tab surfaces the top influencers.`,
      callout:
        'A single high-reach account switching sentiment is a leading indicator of a narrative shift — watch these accounts closely.',
      tabHint: { label: 'Overview tab', tab: 'overview' },
    }

  return {
    content: `Based on your analysis of ${kw}, several angles are worth exploring — sentiment distribution, geographic reach, platform mix, and key influencers. Which dimension would you like to dig into?`,
    callout:
      'Start with sentiment and trend — they answer "what happened" before you investigate "why" with source and PESTLE.',
  }
}
