import type { TopicCluster, EntityNode, EntityEdge, ShareOfVoiceItem, LanguageItem, StrongestRelation } from '../types'
import { CHART_COLORS } from '../constants'

export const topicClusters: TopicCluster[] = [
  { label: 'Business registration', count: 947, color: 'blue'   },
  { label: 'Company compliance',    count: 421, color: 'red'    },
  { label: 'Annual filing',         count: 413, color: 'amber'  },
  { label: 'Director changes',      count: 314, color: 'purple' },
  { label: 'SSM portal',            count: 283, color: 'blue'   },
  { label: 'License renewal',       count: 261, color: 'green'  },
  { label: 'Late penalty',          count: 97,  color: 'red'    },
  { label: 'Form 9',                count: 146, color: 'amber'  },
  { label: 'Winding up',            count: 39,  color: 'purple' },
  { label: 'Sdn Bhd',               count: 31,  color: 'blue'   },
  { label: 'Shell company',         count: 4,   color: 'teal'   },
]

export const shareOfVoice: ShareOfVoiceItem[] = [
  { name: 'SSM',         value: 45 },
  { name: 'MySSM',       value: 22 },
  { name: 'Suruhanjaya', value: 18 },
  { name: 'CTOS',        value: 8  },
  { name: 'COM',         value: 4  },
]

export const languageBreakdown: LanguageItem[] = [
  { name: 'Bahasa Malaysia', value: 49, color: CHART_COLORS.blue  },
  { name: 'English',         value: 34, color: CHART_COLORS.green },
  { name: 'Chinese',         value: 13, color: CHART_COLORS.amber },
  { name: 'Other',           value: 4,  color: CHART_COLORS.zinc  },
]

export const strongestRelations: StrongestRelation[] = [
  { label: '@ssm_malaysia → MySSM Portal',      score: 0.92 },
  { label: 'BizWire MY → Shell Company Report', score: 0.87 },
  { label: '@KLFinanceWatch → Annual Filing',   score: 0.79 },
  { label: 'Twitter → Legal Cluster',           score: 0.74 },
  { label: 'NST → Companies Act Coverage',      score: 0.68 },
]

export const entityNodes: EntityNode[] = [
  { id: 'ssm',           lines: ['SSM'],               type: 'org',    r: 26 },
  { id: 'bnm',           lines: ['Bank', 'Negara'],    type: 'org',    r: 22 },
  { id: 'mof',           lines: ['MOF'],               type: 'org',    r: 17 },
  { id: 'companies_act', lines: ['Companies', 'Act'],  type: 'org',    r: 14 },
  { id: 'twitter',       lines: ['Twitter / X'],       type: 'source', r: 17 },
  { id: 'the_edge',      lines: ['The Edge'],          type: 'source', r: 16 },
  { id: 'bernama',       lines: ['Bernama'],           type: 'source', r: 15 },
  { id: 'tiktok',        lines: ['TikTok'],            type: 'source', r: 14 },
  { id: 'ssm_acc',       lines: ['@ssm', 'malaysia'],  type: 'author', r: 16 },
  { id: 'edge_acc',      lines: ['@Edge', 'Markets'],  type: 'author', r: 15 },
  { id: 'klfw',          lines: ['@KLFin', 'Watch'],   type: 'author', r: 14 },
  { id: 'audit_notice',  lines: ['Audit', 'Notice'],   type: 'post',   r: 14 },
  { id: 'bnm_report',    lines: ['BNM', 'Report'],     type: 'post',   r: 14 },
  { id: 'shell',         lines: ['Shell', 'Companies'],type: 'topic',  r: 22 },
  { id: 'late_filing',   lines: ['Late', 'Filing'],    type: 'topic',  r: 19 },
  { id: 'penalty',       lines: ['RM50/day', 'Penalty'],type: 'topic', r: 16 },
  { id: 'aml',           lines: ['AML', 'Risk'],       type: 'topic',  r: 18 },
]

export const entityEdges: EntityEdge[] = [
  { from: 'mof',          to: 'ssm',           label: 'oversees'   },
  { from: 'mof',          to: 'bnm',           label: 'oversees'   },
  { from: 'ssm',          to: 'companies_act', label: 'enforces'   },
  { from: 'ssm',          to: 'late_filing',   label: 'tracks'     },
  { from: 'ssm',          to: 'shell',         label: 'regulates'  },
  { from: 'ssm',          to: 'ssm_acc',       label: 'operates'   },
  { from: 'ssm',          to: 'audit_notice',  label: 'issues'     },
  { from: 'bnm',          to: 'aml',           label: 'monitors'   },
  { from: 'bnm',          to: 'shell',         label: 'flags'      },
  { from: 'bnm',          to: 'bnm_report',    label: 'publishes'  },
  { from: 'ssm',          to: 'bnm',           label: 'coordinates'},
  { from: 'shell',        to: 'aml',           label: 'poses'      },
  { from: 'shell',        to: 'late_filing',   label: 'linked to'  },
  { from: 'late_filing',  to: 'penalty',       label: 'triggers'   },
  { from: 'companies_act',to: 'penalty',       label: 'specifies'  },
  { from: 'twitter',      to: 'ssm_acc'                            },
  { from: 'twitter',      to: 'edge_acc'                           },
  { from: 'twitter',      to: 'klfw'                               },
  { from: 'the_edge',     to: 'audit_notice',  label: 'covers'     },
  { from: 'bernama',      to: 'bnm_report',    label: 'reports'    },
  { from: 'ssm_acc',      to: 'late_filing',   label: 'warns'      },
  { from: 'edge_acc',     to: 'shell',         label: 'reports on' },
  { from: 'klfw',         to: 'aml',           label: 'covers'     },
  { from: 'tiktok',       to: 'shell',         label: 'amplifies'  },
]
