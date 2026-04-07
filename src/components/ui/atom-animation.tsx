import { useEffect, useRef } from 'react'

const CX = 340, CY = 340, A = 260, B = 75
const TRAIL_LEN = 28

interface ElectronConfig {
  orbitAngle: number
  speed: number
  phase: number
  color: string
}

const ELECTRONS: ElectronConfig[] = [
  { orbitAngle: 0,   speed: 0.8,  phase: 0,              color: '#d966b8' },
  { orbitAngle: 60,  speed: 0.65, phase: Math.PI * 0.7,  color: '#2ec4a0' },
  { orbitAngle: 120, speed: 0.9,  phase: Math.PI * 1.4,  color: '#6888d8' },
]

function ellipsePos(t: number, angleDeg: number) {
  const θ = (angleDeg * Math.PI) / 180
  return {
    x: CX + A * Math.cos(t) * Math.cos(θ) - B * Math.sin(t) * Math.sin(θ),
    y: CY + A * Math.cos(t) * Math.sin(θ) + B * Math.sin(t) * Math.cos(θ),
    z: B * Math.sin(t),
  }
}

export function AtomAnimation() {
  const svgRef = useRef<SVGSVGElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const ns = 'http://www.w3.org/2000/svg'
    const nucleusGroup = svg.querySelector('#nucleus-group') as SVGGElement
    const trailsGroup = svg.querySelector('#trails') as SVGGElement
    const electronEls = ELECTRONS.map((_, i) => svg.querySelector(`#e${i + 1}`) as SVGGElement)

    // Create trail dots
    const dots: SVGCircleElement[][] = ELECTRONS.map((e) => {
      const arr: SVGCircleElement[] = []
      for (let k = 0; k < TRAIL_LEN; k++) {
        const c = document.createElementNS(ns, 'circle')
        c.setAttribute('r', '3.5')
        c.setAttribute('fill', e.color)
        c.setAttribute('opacity', '0')
        trailsGroup.appendChild(c)
        arr.push(c)
      }
      return arr
    })

    const histories: { x: number; y: number; z: number }[][] = ELECTRONS.map(() => [])
    let t0: number | null = null

    function frame(ts: number) {
      if (!t0) t0 = ts
      const elapsed = (ts - t0) / 1000

      ELECTRONS.forEach((e, i) => {
        const t = e.phase + elapsed * e.speed
        const { x, y, z } = ellipsePos(t, e.orbitAngle)
        const el = electronEls[i]

        el.setAttribute('transform', `translate(${x},${y})`)

        // z-ordering relative to nucleus
        if (z > 0) {
          svg!.appendChild(el)
        } else {
          svg!.insertBefore(el, nucleusGroup)
        }

        // Trail
        const h = histories[i]
        h.push({ x, y, z })
        if (h.length > TRAIL_LEN) h.shift()

        const n = h.length
        dots[i].forEach((dot, k) => {
          const histIdx = n - TRAIL_LEN + k
          if (histIdx < 0) {
            dot.setAttribute('opacity', '0')
            return
          }
          const p = h[histIdx]
          const frac = k / (TRAIL_LEN - 1)
          dot.setAttribute('cx', String(p.x))
          dot.setAttribute('cy', String(p.y))
          dot.setAttribute('r', String(2 + frac * 3))
          dot.setAttribute('opacity', String(frac * 0.55))
        })
      })

      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      // Clean up trail dots
      while (trailsGroup.firstChild) trailsGroup.removeChild(trailsGroup.firstChild)
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-background flex items-center justify-center">
      {/* Star field */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: [
            'radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.5) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 34% 72%, rgba(255,255,255,0.35) 0%, transparent 100%)',
            'radial-gradient(1.5px 1.5px at 56% 9%, rgba(255,255,255,0.4) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 77% 54%, rgba(255,255,255,0.3) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 91% 28%, rgba(255,255,255,0.45) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 23% 90%, rgba(255,255,255,0.3) 0%, transparent 100%)',
            'radial-gradient(1px 1px at 68% 81%, rgba(255,255,255,0.35) 0%, transparent 100%)',
          ].join(','),
        }}
      />

      <svg
        ref={svgRef}
        viewBox="0 0 680 680"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[min(90vw,480px)] h-[min(90vw,480px)]"
        style={{ filter: 'drop-shadow(0 0 12px rgba(91,70,184,0.35))' }}
      >
        <defs>
          <radialGradient id="nucleus" cx="40%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#9b8fd4" />
            <stop offset="40%" stopColor="#5b46b8" />
            <stop offset="100%" stopColor="#1a0f5c" />
          </radialGradient>
          <radialGradient id="eGreen" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#a0f0d8" />
            <stop offset="100%" stopColor="#2ec4a0" />
          </radialGradient>
          <radialGradient id="ePink" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#f5b8e8" />
            <stop offset="100%" stopColor="#d966b8" />
          </radialGradient>
          <radialGradient id="eBlue" cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#d0e8ff" />
            <stop offset="100%" stopColor="#88b4e8" />
          </radialGradient>
          <filter id="glowPink" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowGreen" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="glowBlue" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Orbit rings */}
        <ellipse id="orbit1" cx="340" cy="340" rx="260" ry="75"
          fill="none" stroke="#b06de0" strokeWidth="1.4" opacity="0.45"
          className="animate-orbit1-glow" />
        <ellipse id="orbit2" cx="340" cy="340" rx="260" ry="75"
          fill="none" stroke="#2ec4a0" strokeWidth="1.4" opacity="0.5"
          transform="rotate(60 340 340)" className="animate-orbit2-glow" />
        <ellipse id="orbit3" cx="340" cy="340" rx="260" ry="75"
          fill="none" stroke="#6888d8" strokeWidth="1.4" opacity="0.45"
          transform="rotate(120 340 340)" className="animate-orbit3-glow" />

        {/* Nucleus */}
        <g id="nucleus-group" className="animate-nucleus-pulse">
          <circle cx="340" cy="340" r="58" fill="url(#nucleus)" />
          <ellipse cx="322" cy="320" rx="18" ry="12" fill="white" opacity="0.45" />
        </g>

        {/* Trail dots container */}
        <g id="trails" />

        {/* Electrons */}
        <g id="e1" filter="url(#glowPink)">
          <circle r="14" fill="url(#ePink)" stroke="#f5a0d8" strokeWidth="1.5" />
          <circle r="5" fill="white" opacity="0.7" transform="translate(-4,-5)" />
        </g>
        <g id="e2" filter="url(#glowGreen)">
          <circle r="14" fill="url(#eGreen)" stroke="#80e8cc" strokeWidth="1.5" />
          <circle r="5" fill="white" opacity="0.7" transform="translate(-4,-5)" />
        </g>
        <g id="e3" filter="url(#glowBlue)">
          <circle r="14" fill="url(#eBlue)" stroke="#b8d8f8" strokeWidth="1.5" />
          <circle r="5" fill="white" opacity="0.7" transform="translate(-4,-5)" />
        </g>
      </svg>
    </div>
  )
}
