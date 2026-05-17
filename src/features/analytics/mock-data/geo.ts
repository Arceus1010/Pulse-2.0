import type { StateData } from '../types'

export const geoData: StateData[] = [
  { state: 'Selangor',        percentage: 22, mentions: 44834, delta: 8,  sentiment: { positive: 45, neutral: 33, negative: 22 }, topTopics: ['MySSM Portal', 'Company Registration', 'Digital'],  dominantPlatform: 'Twitter'  },
  { state: 'Kuala Lumpur',    percentage: 20, mentions: 40758, delta: 3,  sentiment: { positive: 38, neutral: 31, negative: 31 }, topTopics: ['Shell Companies', 'Enforcement', 'Bursa'],          dominantPlatform: 'News'     },
  { state: 'Johor',           percentage: 10, mentions: 20379, delta: 15, sentiment: { positive: 52, neutral: 30, negative: 18 }, topTopics: ['SME Growth', 'Registration', 'MySSM'],              dominantPlatform: 'Facebook' },
  { state: 'Penang',          percentage: 9,  mentions: 18341, delta: 5,  sentiment: { positive: 41, neutral: 35, negative: 24 }, topTopics: ['Tech Startups', 'Portal', 'API'],                   dominantPlatform: 'Twitter'  },
  { state: 'Perak',           percentage: 6,  mentions: 12227, delta: -2, sentiment: { positive: 29, neutral: 33, negative: 38 }, topTopics: ['Late Filings', 'Penalties', 'SME'],                 dominantPlatform: 'Facebook' },
  { state: 'Pahang',          percentage: 5,  mentions: 10190, delta: 6,  sentiment: { positive: 40, neutral: 35, negative: 25 }, topTopics: ['Business Tourism', 'Registration', 'SME'],          dominantPlatform: 'Facebook' },
  { state: 'Sabah',           percentage: 5,  mentions: 10190, delta: 11, sentiment: { positive: 61, neutral: 27, negative: 12 }, topTopics: ['Registration', 'New Business', 'SME'],              dominantPlatform: 'TikTok'   },
  { state: 'Negeri Sembilan', percentage: 4,  mentions: 8152,  delta: 9,  sentiment: { positive: 51, neutral: 30, negative: 19 }, topTopics: ['New Business', 'SME', 'MySSM'],                     dominantPlatform: 'Twitter'  },
  { state: 'Sarawak',         percentage: 4,  mentions: 8152,  delta: 7,  sentiment: { positive: 55, neutral: 30, negative: 15 }, topTopics: ['MySSM Portal', 'Digital', 'Startups'],              dominantPlatform: 'TikTok'   },
  { state: 'Terengganu',      percentage: 3,  mentions: 6114,  delta: 4,  sentiment: { positive: 38, neutral: 36, negative: 26 }, topTopics: ['Oil & Gas', 'SME', 'Compliance'],                   dominantPlatform: 'Facebook' },
  { state: 'Kelantan',        percentage: 3,  mentions: 6114,  delta: -5, sentiment: { positive: 28, neutral: 34, negative: 38 }, topTopics: ['Compliance', 'Late Filings', 'Rural SME'],          dominantPlatform: 'Facebook' },
  { state: 'Melaka',          percentage: 3,  mentions: 6114,  delta: 2,  sentiment: { positive: 53, neutral: 30, negative: 17 }, topTopics: ['Tourism Business', 'Heritage SME', 'Registration'], dominantPlatform: 'Facebook' },
  { state: 'Putrajaya',       percentage: 2,  mentions: 4076,  delta: -3, sentiment: { positive: 35, neutral: 40, negative: 25 }, topTopics: ['Enforcement', 'Policy', 'Compliance'],              dominantPlatform: 'News'     },
  { state: 'Kedah',           percentage: 2,  mentions: 4076,  delta: -1, sentiment: { positive: 33, neutral: 37, negative: 30 }, topTopics: ['Agri-Business', 'SME', 'Portal'],                   dominantPlatform: 'Facebook' },
  { state: 'Labuan',          percentage: 1,  mentions: 2038,  delta: 12, sentiment: { positive: 67, neutral: 23, negative: 10 }, topTopics: ['Offshore Finance', 'Company Registration', 'Digital'],dominantPlatform: 'News'   },
  { state: 'Perlis',          percentage: 1,  mentions: 2038,  delta: 3,  sentiment: { positive: 44, neutral: 38, negative: 18 }, topTopics: ['Registration', 'SME', 'Portal'],                    dominantPlatform: 'Facebook' },
]
