# Pulse

**From raw signal to actionable intelligence.**

Pulse is an open-source intelligence and analytics dashboard that gives analysts a unified view across social monitoring, OSINT investigation, analytics, and AI-driven reasoning — without switching tools.

---

## Features

| Pillar | Description |
|---|---|
| **Social & News Monitoring** | Aggregate content from Facebook, Instagram, YouTube, TikTok, X, and news APIs. Filter by keyword, date range, and platform in real time. |
| **OSINT Investigation** | Deep reconnaissance on people, companies, domains, emails, and IPs. Cross-reference public databases, threat feeds, breach records, and dark web sources. |
| **Analytics** | Sentiment trends, entity tracking, topic modeling, and engagement dashboards derived from collected data — all in one unified view. |
| **AI Reasoning** | AI-driven analysis and decision support layered on top of collected data. Move from raw signals to actionable intelligence conclusions automatically. |

---

## Tech Stack

- **React 19** + **TypeScript**
- **React Router 7**
- **Vite** (with Rolldown)
- **Tailwind CSS 4**
- **Recharts** — line, bar, radar, and donut charts
- **react-force-graph-2d** — entity relation graphs
- **react-simple-maps** — geographic map views
- **react-grid-heatmap** — heatmap visualisation
- **lucide-react** — icons

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

---

## Project Structure

```
src/
├── components/          # Shared layout and UI primitives
├── features/            # Feature modules (pages, components, hooks, data)
├── context/             # React context providers
├── hooks/               # Shared custom hooks
├── assets/
├── App.tsx              # Landing page
├── AppRouter.tsx        # Route configuration
└── main.tsx
```

---

## Dark Mode

Pulse ships with a built-in dark/light mode toggle. Theme state is managed via `ThemeContext` and persisted across sessions.
