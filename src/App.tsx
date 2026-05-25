import { useNavigate } from 'react-router-dom'
import { MessageCircle, Search, BarChart3, Sparkles, Sun, Moon } from 'lucide-react'
import pulseLogo from './assets/Pulse (Logo).svg'
import { useTheme } from './hooks/useTheme'
import Button from './components/ui/Button'

const pillars = [
  {
    icon: <MessageCircle className="w-4 h-4" />,
    label: 'Social & News',
    title: 'Social Media & News Monitoring',
    description: 'Aggregate content from Facebook, Instagram, YouTube, TikTok, X, and news APIs. Filter by keyword, date range, and platform in real time.',
  },
  {
    icon: <Search className="w-4 h-4" />,
    label: 'OSINT',
    title: 'OSINT Investigation',
    description: 'Deep reconnaissance on people, companies, domains, emails, and IPs. Cross-reference public databases, threat feeds, breach records, and dark web sources.',
  },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    label: 'Analytics',
    title: 'Analytics',
    description: 'Sentiment trends, entity tracking, topic modeling, and engagement dashboards derived from your collected data — all in one unified view.',
  },
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: 'AI Reasoning',
    title: 'Intelligence Reasoning',
    description: 'AI-driven analysis and decision support layered on top of collected data. Move from raw signals to actionable intelligence conclusions automatically.',
  },
]


export default function App() {
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-200">

      {/* Nav */}
      <nav className="shrink-0 border-b border-slate-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-11 flex items-center justify-between">
          <img src={pulseLogo} alt="Pulse" className="h-6" />
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="cursor-pointer p-1 rounded-sm border border-slate-200 dark:border-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full px-6 gap-10">

        {/* Hero */}
        <section className="text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.1] my-3">
              From raw signal to{' '}
              <span className="text-blue-800 dark:text-blue-400">actionable intelligence</span>
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 text-base leading-relaxed mb-6">
              Pulse gives analysts a unified view across social monitoring, OSINT investigation, analytics, and AI-driven reasoning — without switching tools.
            </p>
            <div className="flex items-center justify-center">
              <Button onClick={() => navigate('/analytics')} size="lg">
                Get Started
              </Button>
            </div>
          </div>
        </section>

        {/* Pillars */}
        <section id="pillars">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.label}
                className="border border-slate-200 dark:border-zinc-800 rounded-lg p-4 hover:border-blue-800/30 dark:hover:border-blue-400/20 transition-colors bg-white dark:bg-zinc-900/60"
              >
                <div className="w-7 h-7 rounded-md bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-3 text-blue-800 dark:text-blue-400">
                  {pillar.icon}
                </div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-1">{pillar.label}</p>
                <h3 className="font-semibold text-base text-slate-900 dark:text-zinc-100 mb-1.5">{pillar.title}</h3>
                <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

    </div>
  )
}
