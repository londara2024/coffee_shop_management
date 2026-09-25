"use client"

import { useState } from "react"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Point = { t: number; orders: number }

// Minutes since midnight; 15-minute intervals from 06:30 to 19:00.
const START = 6.5 * 60
const END = 19 * 60

function series(peaks: [number, number, number][]): Point[] {
  const out: Point[] = []
  for (let t = START; t <= END; t += 15) {
    const v = peaks.reduce((n, [mu, amp, sd]) => n + amp * Math.exp(-((t - mu) ** 2) / (2 * sd * sd)), 3)
    out.push({ t, orders: Math.round(v) })
  }
  return out
}

const data = {
  today: series([
    [8.5 * 60, 49, 55],
    [12.5 * 60, 30, 50],
    [15.5 * 60, 25, 45],
  ]),
  yesterday: series([
    [8.75 * 60, 42, 60],
    [12.75 * 60, 27, 55],
    [15.75 * 60, 18, 50],
  ]),
}

const peaksAt = [8.5 * 60, 12.5 * 60, 15.5 * 60]
const peakNames = ["Morning rush", "Midday spike", "Afternoon"]

const W = 520
const H = 230
const PAD = { l: 34, r: 12, t: 28, b: 28 }

function clock(t: number) {
  const h = Math.floor(t / 60)
  const m = t % 60
  const hh = ((h + 11) % 12) + 1
  return `${hh}:${m.toString().padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`
}

export function VolumeChart() {
  const [view, setView] = useState<"today" | "yesterday">("today")
  const [hover, setHover] = useState<number | null>(null)
  const pts = data[view]

  const max = 60
  const x = (t: number) => PAD.l + ((t - START) / (END - START)) * (W - PAD.l - PAD.r)
  const y = (v: number) => PAD.t + (1 - v / max) * (H - PAD.t - PAD.b)

  const line = pts.map((p, i) => `${i ? "L" : "M"}${x(p.t).toFixed(1)},${y(p.orders).toFixed(1)}`).join("")
  const area = `${line}L${x(END)},${y(0)}L${x(START)},${y(0)}Z`

  const hovered = hover !== null ? pts[hover] : null

  function onMove(e: React.PointerEvent<SVGRectElement>) {
    const box = e.currentTarget.getBoundingClientRect()
    const t = START + ((e.clientX - box.left) / box.width) * (END - START)
    setHover(Math.max(0, Math.min(pts.length - 1, Math.round((t - START) / 15))))
  }

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Tabs value={view} onValueChange={(v) => setView(v as "today" | "yesterday")}>
          <TabsList className="h-9 bg-oat-deep">
            <TabsTrigger value="today" className="px-3 text-label-md">
              Today (15m intervals)
            </TabsTrigger>
            <TabsTrigger value="yesterday" className="px-3 text-label-md">
              Yesterday
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Orders per 15 minutes, ${view}`}>
          <defs>
            <linearGradient id="volFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8d4f06" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#8d4f06" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 20, 40, 60].map((v) => (
            <g key={v}>
              <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="#241611" strokeOpacity={v ? 0.06 : 0.14} />
              <text x={PAD.l - 8} y={y(v) + 4} textAnchor="end" className="fill-ink-mute text-[11px]">
                {v}
              </text>
            </g>
          ))}
          {[6.5, 8.5, 10.5, 12.5, 14.5, 16.5, 19].map((h) => (
            <text key={h} x={x(h * 60)} y={H - 8} textAnchor="middle" className="fill-ink-mute text-[11px]">
              {clock(h * 60).replace(":00", "")}
            </text>
          ))}
          <path d={area} fill="url(#volFill)" />
          <path d={line} fill="none" stroke="#8d4f06" strokeWidth="2" strokeLinejoin="round" />
          {view === "today"
            ? peaksAt.map((t, i) => {
                const p = pts.find((q) => q.t === t)!
                return (
                  <g key={t}>
                    <circle cx={x(t)} cy={y(p.orders)} r="4.5" fill="#8d4f06" stroke="#f8f3ef" strokeWidth="2" />
                    <text x={x(t)} y={y(p.orders) - 11} textAnchor="middle" className="fill-ink-soft text-[11px] font-semibold">
                      {peakNames[i]} · {p.orders}
                    </text>
                  </g>
                )
              })
            : null}
          {hovered ? (
            <g pointerEvents="none">
              <line x1={x(hovered.t)} x2={x(hovered.t)} y1={PAD.t} y2={y(0)} stroke="#241611" strokeOpacity="0.25" strokeDasharray="3 3" />
              <circle cx={x(hovered.t)} cy={y(hovered.orders)} r="5" fill="#8d4f06" stroke="#fff" strokeWidth="2" />
            </g>
          ) : null}
          <rect
            x={PAD.l}
            y={PAD.t}
            width={W - PAD.l - PAD.r}
            height={H - PAD.t - PAD.b}
            fill="transparent"
            onPointerMove={onMove}
            onPointerLeave={() => setHover(null)}
          />
        </svg>
        {hovered ? (
          <div
            className="pointer-events-none absolute top-2 -translate-x-1/2 rounded-lg bg-espresso px-2.5 py-1.5 text-label-md whitespace-nowrap text-milk shadow-warm-lg"
            style={{ left: `${(x(hovered.t) / W) * 100}%` }}
          >
            <span className="block text-label-sm text-milk/70">{clock(hovered.t)}</span>
            <b className="tabular">{hovered.orders}</b> orders
          </div>
        ) : null}
      </div>

      <table className="sr-only">
        <caption>Orders per 15-minute interval ({view})</caption>
        <tbody>
          {pts.map((p) => (
            <tr key={p.t}>
              <th scope="row">{clock(p.t)}</th>
              <td>{p.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
