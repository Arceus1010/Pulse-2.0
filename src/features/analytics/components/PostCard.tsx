import { Heart, Share2, Eye } from 'lucide-react'
import type { Post, Platform } from '../types'
import { PLATFORM_LABELS } from '../constants'

const PLATFORM_BADGE: Record<Platform, string> = {
  twitter: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50',
  facebook: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50',
  tiktok: 'bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800/50',
  news: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50',
  forums: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50',
  blogs: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800/50',
}

const SENTIMENT_BADGE: Record<string, string> = {
  positive: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
  negative: 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400',
  neutral: 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400',
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-4 flex flex-col gap-3 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-400 shrink-0 uppercase">
            {post.author.replace('@', '').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">{post.author}</p>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide border ${PLATFORM_BADGE[post.platform]}`}>
              {PLATFORM_LABELS[post.platform]}
            </span>
          </div>
        </div>
        <span className="text-[10px] text-slate-400 dark:text-zinc-500 shrink-0">{post.publishedAt}</span>
      </div>

      <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3 flex-1">
        {post.content}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-zinc-500">
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{fmt(post.likes)}</span>
          <span className="flex items-center gap-1"><Share2 className="w-3 h-3" />{fmt(post.shares)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${SENTIMENT_BADGE[post.sentiment]}`}>
            {post.sentiment}
          </span>
          <button className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors">
            <Eye className="w-3 h-3" />
            See Post
          </button>
        </div>
      </div>
    </div>
  )
}
