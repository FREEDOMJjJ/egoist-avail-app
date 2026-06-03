import { useMemo } from 'react'

export function MangaBg({ petals: petalsOn = true, halftone = true }) {
  const petals = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      left:  8 + i * 16 + (i * 11 % 7),
      delay: -((i * 2.4) % 12),
      dur:   9 + ((i * 2.3) % 7),
      size:  9 + (i % 3) * 2,
      sway:  12 + (i * 5 % 10),
      rot:   9 + ((i * 1.7) % 6),
      tilt:  ((i % 2) ? 1 : -1) * 5,
    })), [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--bg, #000)' }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 92px, rgba(255,255,255,0.03) 92px 93px)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(120% 80% at 50% 0%, rgba(255,255,255,0.035), transparent 60%), radial-gradient(120% 80% at 50% 100%, rgba(255,255,255,0.04), transparent 60%)',
      }} />
      {halftone && (
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.14,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.32) 0.7px, transparent 1.1px)',
          backgroundSize: '6px 6px',
          maskImage: 'radial-gradient(120% 80% at 50% 30%, #000 0%, transparent 65%)',
          WebkitMaskImage: 'radial-gradient(120% 80% at 50% 30%, #000 0%, transparent 65%)',
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(50% 30% at 50% 18%, rgba(248,165,194,0.05), transparent 70%)',
        mixBlendMode: 'screen',
      }} />
      {petalsOn && (
        <div style={{ position: 'absolute', inset: 0 }}>
          {petals.map(p => (
            <div key={p.id} style={{
              position: 'absolute', top: -24, left: `${p.left}%`,
              animation: `bcFall ${p.dur}s linear ${p.delay}s infinite`,
              '--sway': `${p.sway}px`,
              '--tilt': `${p.tilt}deg`,
            }}>
              <div style={{ animation: `bcSway ${p.dur / 3}s ease-in-out infinite alternate` }}>
                <Petal size={p.size} rot={p.rot} hand />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function Petal({ size = 12, rot = 6, color, hand = false }) {
  const pink = color || '#f8a5c2'
  const handPath = (size % 2)
    ? 'M12 2 C 15 5 19 8 22 11 C 20 14 14 14 12 22 C 10 14 4 14 2 11 C 5 8 9 5 12 2 Z'
    : 'M12 3 C 14 6 18 8 21 11 C 19 13 13 13 12 21 C 11 13 5 13 3 11 C 6 8 10 6 12 3 Z'
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{
      animation: `bcPetalSpin ${rot}s linear infinite`,
      filter: 'drop-shadow(0 0 2px rgba(248,165,194,0.45))',
      display: 'block',
    }}>
      <path
        d={hand ? handPath : 'M12 2 C 14 6 18 8 22 10 C 18 12 14 14 12 22 C 10 14 6 12 2 10 C 6 8 10 6 12 2 Z'}
        fill={pink} opacity="0.95"
      />
      <path d="M12 4 C 13 9 13 14 12 21" stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" fill="none" />
    </svg>
  )
}

export function PulseRing({ k, color = '#f8a5c2', size = 80 }) {
  return (
    <div key={k} style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      display: 'grid', placeItems: 'center', overflow: 'hidden',
      borderRadius: 'inherit', zIndex: 4,
    }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        border: `1.5px solid ${color}`,
        animation: 'bcPulseRing 650ms cubic-bezier(.2,.7,.2,1) forwards',
        opacity: 0,
      }} />
    </div>
  )
}

export function PetalBurst({ k, color = '#f8a5c2', tone = 'pink' }) {
  return (
    <div key={k} style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      display: 'grid', placeItems: 'center',
      borderRadius: 'inherit', overflow: 'hidden', zIndex: 6,
    }}>
      {tone === 'pink' ? (
        <div style={{ animation: 'bcDriftUp 360ms ease-out forwards' }}>
          <Petal size={14} rot={3} color={color} hand />
        </div>
      ) : (
        <div style={{
          width: 16, height: 10, borderRadius: '50%',
          background: 'radial-gradient(closest-side, rgba(120,120,120,0.7), rgba(120,120,120,0) 70%)',
          animation: 'bcDriftUp 360ms ease-out forwards',
        }} />
      )}
    </div>
  )
}

export function InkSlash({ k }) {
  return (
    <div key={k} style={{
      position: 'absolute', inset: -10, pointerEvents: 'none',
      overflow: 'hidden', borderRadius: 'inherit', zIndex: 5,
    }}>
      <div style={{
        position: 'absolute', top: '22%', left: '-30%',
        width: '160%', height: 2,
        background: 'linear-gradient(90deg, transparent, #000 35%, #000 65%, transparent)',
        transform: 'rotate(-10deg) translateX(-130%)',
        animation: 'bcSlash 520ms cubic-bezier(.2,.8,.2,1) forwards',
        opacity: 0,
      }} />
    </div>
  )
}

export function MinimalLoader() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 20, background: '#000',
      animation: 'bcFadeIn 380ms ease-out forwards',
    }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
        <svg viewBox="0 0 240 160" width="280" height="180" style={{ opacity: 0.06 }}>
          <path d="M48 78 C 38 56 78 30 110 36 C 150 28 196 56 192 92 C 210 110 178 138 138 130 C 118 152 70 144 56 120 C 30 116 36 92 48 78 Z" fill="#fff" />
        </svg>
      </div>
      <div style={{
        position: 'absolute', top: '50%', left: '-10%',
        animation: 'bcPetalDrift 4.6s cubic-bezier(.45,.05,.55,.95) infinite',
      }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute', right: '100%', top: '50%', transform: 'translateY(-50%)',
            width: 80, height: 1.2,
            background: 'linear-gradient(90deg, transparent, rgba(248,165,194,0.45))',
            borderRadius: 999,
          }} />
          <Petal size={16} rot={6} color="#f8a5c2" hand />
        </div>
      </div>
      <div style={{
        position: 'relative', zIndex: 1,
        fontFamily: '"Permanent Marker", "Rock Salt", system-ui',
        fontSize: 64, lineHeight: 0.9, color: '#fff',
        letterSpacing: 6, display: 'flex',
      }}>
        {Array.from('EGOIST').map((ch, i) => (
          <span key={i} style={{
            display: 'inline-block', opacity: 0,
            animation: `bcInkReveal 480ms cubic-bezier(.6,.0,.2,1) ${300 + i * 130}ms forwards`,
          }}>{ch}</span>
        ))}
      </div>
      <div style={{
        position: 'relative', zIndex: 1,
        fontFamily: '"Nunito", system-ui',
        fontSize: 11, letterSpacing: 4, fontWeight: 700,
        color: 'rgba(248,165,194,0.85)',
        opacity: 0, animation: 'bcFadeIn 600ms 1400ms forwards',
      }}>ЗАГРУЗКА</div>
    </div>
  )
}

export function SkeletonCard({ delay = 0 }) {
  return (
    <div style={{
      borderRadius: 14, padding: '14px',
      border: '1.5px solid #000', background: '#fff',
      display: 'flex', alignItems: 'center', gap: 12,
      position: 'relative', overflow: 'hidden',
      boxShadow: '3px 3px 0 #000',
    }}>
      <div style={{ width: 44, height: 50, borderRadius: 8, background: '#ebebeb' }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ width: '55%', height: 9, borderRadius: 4, background: '#ebebeb' }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 52, height: 22, borderRadius: 6, background: '#ebebeb' }} />
          ))}
        </div>
        <div style={{ width: '40%', height: 8, borderRadius: 4, background: '#ebebeb' }} />
      </div>
      <div style={{ width: 36, height: 28, borderRadius: 4, background: '#ebebeb' }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent, rgba(248,165,194,0.18), transparent)',
        backgroundSize: '40% 100%', backgroundRepeat: 'no-repeat',
        animation: `bcSkShimmer 1.8s linear ${delay}ms infinite`,
      }} />
    </div>
  )
}
