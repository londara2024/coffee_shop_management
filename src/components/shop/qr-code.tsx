/** Decorative QR-style pass code (deterministic pattern from a seed string). Not a scannable code. */
export function QrCode({ seed, className }: { seed: string; className?: string }) {
  const n = 21
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  const rand = () => {
    h ^= h << 13
    h ^= h >>> 17
    h ^= h << 5
    return (h >>> 0) / 4294967296
  }
  const inFinder = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9)

  const cells: React.ReactNode[] = []
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (!inFinder(x, y) && rand() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" />)

  const finder = (x: number, y: number) => (
    <g key={`f${x}${y}`}>
      <rect x={x} y={y} width="7" height="7" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="white" />
      <rect x={x + 2} y={y + 2} width="3" height="3" />
    </g>
  )

  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className={className} fill="#241611" shapeRendering="crispEdges" role="img" aria-label={`Pass code ${seed}`}>
      <rect x="-1" y="-1" width={n + 2} height={n + 2} fill="white" />
      {finder(0, 0)}
      {finder(n - 7, 0)}
      {finder(0, n - 7)}
      {cells}
    </svg>
  )
}
