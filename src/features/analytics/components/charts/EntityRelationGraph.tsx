import { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import type { ForceGraphMethods, NodeObject, LinkObject } from 'react-force-graph-2d'
// NodeObject / LinkObject use default generics ({}) whose index sig covers custom fields

import { entityNodes, entityEdges } from '../../mock-data/trend'
import { NODE_TYPE_COLORS } from '../../constants'
import { useChartTheme } from '../../hooks/useChartTheme'
import { useTheme } from '../../../../hooks/useTheme'

const NODE_SCALE = 0.65

interface Props {
  activeTypes: Set<string>
}

export default function EntityRelationGraph({ activeTypes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined)
  const [width, setWidth] = useState(600)
  const theme = useChartTheme()
  const { isDark } = useTheme()
  const height = Math.max(380, Math.min(Math.round(width * 0.65), 520))

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Configure d3 forces for better spread once the graph mounts
  useEffect(() => {
    const graph = graphRef.current
    if (!graph) return
    graph.d3Force('link')?.distance(100)
    graph.d3Force('charge')?.strength(-100)
    graph.d3Force('collision', null) // remove default collision if any
  }, [])

  const graphData = useMemo(() => ({
    nodes: entityNodes.map(n => ({ ...n })),
    links: entityEdges.map(e => ({ source: e.from, target: e.to, label: e.label ?? '' })),
  }), [])

  const paintNode = useCallback((node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const active = activeTypes.has(node.type)
    const color: string = NODE_TYPE_COLORS[node.type]
    const r: number = (node.r ?? 18) * NODE_SCALE
    const nx = node.x!
    const ny = node.y!

    ctx.save()
    ctx.globalAlpha = active ? 1 : 0.12

    if (isDark) {
      // Dark mode: dark tinted fill + bright colored border + glow
      ctx.shadowColor = color
      ctx.shadowBlur = active ? 10 / globalScale : 0

      ctx.beginPath()
      ctx.arc(nx, ny, r, 0, 2 * Math.PI)
      ctx.fillStyle = color + '28'
      ctx.fill()

      ctx.shadowBlur = 0
      ctx.beginPath()
      ctx.arc(nx, ny, r, 0, 2 * Math.PI)
      ctx.strokeStyle = color
      ctx.lineWidth = 1.8 / globalScale
      ctx.stroke()

      const fontSize = Math.max(4.5, 6.5 / globalScale)
      ctx.font = `600 ${fontSize}px 'Geist', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = color

      const lines: string[] = node.lines ?? [String(node.id ?? '')]
      const lineH = fontSize * 1.4
      lines.forEach((line, i) => {
        ctx.fillText(line, nx, ny + (i - (lines.length - 1) / 2) * lineH)
      })
    } else {
      // Light mode: solid fill + subtle inner ring + white text
      ctx.beginPath()
      ctx.arc(nx, ny, r, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()

      ctx.beginPath()
      ctx.arc(nx, ny, r - 1.5 / globalScale, 0, 2 * Math.PI)
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'
      ctx.lineWidth = 1.5 / globalScale
      ctx.stroke()

      const fontSize = Math.max(4.5, 6.5 / globalScale)
      ctx.font = `600 ${fontSize}px 'Geist', sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'

      const lines: string[] = node.lines ?? [String(node.id ?? '')]
      const lineH = fontSize * 1.4
      lines.forEach((line, i) => {
        ctx.fillText(line, nx, ny + (i - (lines.length - 1) / 2) * lineH)
      })
    }

    ctx.restore()
  }, [activeTypes, isDark])

  const paintLink = useCallback((link: LinkObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (!link.label) return
    const s = link.source as NodeObject
    const t = link.target as NodeObject
    const mx = (s.x! + t.x!) / 2
    const my = (s.y! + t.y!) / 2
    const active = activeTypes.has(s.type) && activeTypes.has(t.type)

    const fontSize = Math.max(6, 8 / globalScale)
    const pad = { x: 5 / globalScale, y: 2.5 / globalScale }
    const radius = 3 / globalScale

    ctx.save()
    ctx.globalAlpha = active ? 1 : 0.12
    ctx.font = `${fontSize}px 'Geist', sans-serif`

    const textW = ctx.measureText(link.label).width
    const bx = mx - textW / 2 - pad.x
    const by = my - fontSize / 2 - pad.y
    const bw = textW + pad.x * 2
    const bh = fontSize + pad.y * 2

    // Background pill
    ctx.beginPath()
    ctx.moveTo(bx + radius, by)
    ctx.lineTo(bx + bw - radius, by)
    ctx.arcTo(bx + bw, by, bx + bw, by + radius, radius)
    ctx.lineTo(bx + bw, by + bh - radius)
    ctx.arcTo(bx + bw, by + bh, bx + bw - radius, by + bh, radius)
    ctx.lineTo(bx + radius, by + bh)
    ctx.arcTo(bx, by + bh, bx, by + bh - radius, radius)
    ctx.lineTo(bx, by + radius)
    ctx.arcTo(bx, by, bx + radius, by, radius)
    ctx.closePath()
    ctx.fillStyle = theme.tooltip.bg
    ctx.fill()
    ctx.strokeStyle = theme.tooltip.border
    ctx.lineWidth = 0.5 / globalScale
    ctx.stroke()

    // Label text
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = theme.tooltip.label
    ctx.fillText(link.label, mx, my)

    ctx.restore()
  }, [activeTypes, theme.tooltip.bg, theme.tooltip.border, theme.tooltip.label])

  // theme.grid is for chart gridlines (too faint); use theme.text for visible edges
  const edgeColor = theme.text
  const getLinkColor = useCallback((link: LinkObject) => {
    const s = typeof link.source === 'object' ? link.source : null
    const t = typeof link.target === 'object' ? link.target : null
    const active = s && t && activeTypes.has(s.type) && activeTypes.has(t.type)
    return active ? edgeColor : edgeColor + '20'
  }, [activeTypes, edgeColor])

  const scaledR = (node: NodeObject) => ((node.r as number | undefined) ?? 18) * NODE_SCALE

  const getCanvas = () => containerRef.current?.querySelector('canvas')

  const handleNodeHover = useCallback((node: NodeObject | null) => {
    const canvas = getCanvas()
    if (canvas) canvas.style.cursor = node ? 'grab' : 'default'
  }, [])

  const handleNodeDrag = useCallback(() => {
    const canvas = getCanvas()
    if (canvas) canvas.style.cursor = 'grabbing'
  }, [])

  const handleNodeDragEnd = useCallback(() => {
    const canvas = getCanvas()
    if (canvas) canvas.style.cursor = 'default'
  }, [])

  return (
    <div ref={containerRef}>
      <ForceGraph2D
        ref={graphRef}
        width={width}
        height={height}
        graphData={graphData}
        backgroundColor="transparent"
        nodeCanvasObject={paintNode}
        nodeCanvasObjectMode={() => 'replace'}
        nodePointerAreaPaint={(node: NodeObject, hitColor, ctx) => {
          ctx.beginPath()
          ctx.arc(node.x!, node.y!, scaledR(node), 0, 2 * Math.PI)
          ctx.fillStyle = hitColor
          ctx.fill()
        }}
        linkCanvasObject={paintLink}
        linkCanvasObjectMode={() => 'after'}
        linkColor={getLinkColor}
        linkWidth={1.2}
        linkDirectionalArrowLength={4}
        linkDirectionalArrowRelPos={1}
        linkDirectionalArrowColor={() => edgeColor}
        nodeLabel=""
        cooldownTicks={150}
        d3VelocityDecay={0.3}
        onNodeHover={handleNodeHover}
        onNodeDrag={handleNodeDrag}
        onNodeDragEnd={handleNodeDragEnd}
      />
    </div>
  )
}
