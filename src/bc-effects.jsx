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
      <div style={{ position: 'absolute', inset: 0, background: '#000' }} />
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

export function MinimalLoader({ done = false, onTap }) {
  // Буквы появляются по одной, потом линия, потом CS2·SQUAD·5v5, потом точки
  // Всё рассчитано на ~3.5 сек
  return (
    <div
      onClick={onTap}
      style={{
        position: 'absolute', inset: 0, cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 0, background: '#000',
      }}
    >
      {/* Сетка */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)', backgroundSize:'40px 40px', maskImage:'radial-gradient(ellipse at center,black 30%,transparent 80%)', WebkitMaskImage:'radial-gradient(ellipse at center,black 30%,transparent 80%)' }}/>
      {/* Розовый glow */}
      <div style={{ position:'absolute', top:'35%', left:'50%', transform:'translate(-50%,-50%)', width:320, height:320, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(255,110,180,0.1) 0%,transparent 70%)', animation:'bcGlowPulse 3s ease-in-out infinite', pointerEvents:'none' }}/>
      {/* Летящий лепесток */}
      <div style={{ position:'absolute', top:'50%', left:'-10%', animation:'bcPetalDrift 4.6s cubic-bezier(.45,.05,.55,.95) infinite', pointerEvents:'none' }}>
        <div style={{ position:'relative' }}>
          <div style={{ position:'absolute', right:'100%', top:'50%', transform:'translateY(-50%)', width:80, height:1.2, background:'linear-gradient(90deg,transparent,rgba(248,165,194,0.45))', borderRadius:999 }}/>
          <Petal size={16} rot={6} color="#f8a5c2" hand />
        </div>
      </div>

      {/* EGOIST — буквы по одной */}
      <div style={{ position:'relative', zIndex:1, fontFamily:'"Permanent Marker",system-ui', fontSize:72, lineHeight:0.9, color:'#fff', letterSpacing:8, display:'flex', marginBottom:16 }}>
        {Array.from('EGOIST').map((ch, i) => (
          <span key={i} style={{
            display:'inline-block', opacity:0,
            animation:`bcInkReveal 600ms cubic-bezier(.6,.0,.2,1) ${400 + i * 200}ms forwards`,
            textShadow:'0 0 40px rgba(255,110,180,0.4)',
          }}>{ch}</span>
        ))}
      </div>

      {/* Линия-разделитель */}
      <div style={{ position:'relative', zIndex:1, width:0, height:2, background:'linear-gradient(90deg,transparent,#ff6eb4,transparent)', opacity:0, animation:'bcLineExpand 700ms ease-out 1900ms forwards' }}/>

      {/* CS2 · SQUAD · 5v5 */}
      <div style={{ position:'relative', zIndex:1, fontFamily:'"Permanent Marker",system-ui', fontSize:14, letterSpacing:6, color:'rgba(255,110,180,0.8)', opacity:0, animation:'bcFadeIn 600ms 2500ms forwards', marginTop:14 }}>
        CS2 · SQUAD · 5v5
      </div>

      {/* Точки загрузки */}
      <div style={{ position:'relative', zIndex:1, display:'flex', gap:8, marginTop:28, opacity:0, animation:'bcFadeIn 400ms 3000ms forwards' }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#ff6eb4', animation:`bcDotBounce 1.1s ${i*0.18}s ease-in-out infinite` }}/>
        ))}
      </div>

      {/* Тап чтобы продолжить — появляется только когда данные готовы */}
      {done && (
        <div style={{ position:'absolute', bottom:48, left:0, right:0, textAlign:'center', zIndex:2, opacity:0, animation:'bcFadeIn 500ms 0ms forwards' }}>
          <div style={{ fontFamily:'"Nunito",system-ui', fontSize:11, letterSpacing:3, fontWeight:800, color:'rgba(255,255,255,0.45)', animation:'bcTapPulse 1.4s ease-in-out infinite' }}>
            · ТАП ДЛЯ ПРОДОЛЖЕНИЯ ·
          </div>
        </div>
      )}

      <style>{`
        @keyframes bcLineExpand   { from{width:0;opacity:0} to{width:160px;opacity:1} }
        @keyframes bcDotBounce    { 0%,100%{transform:translateY(0);opacity:0.4} 50%{transform:translateY(-7px);opacity:1} }
        @keyframes bcGlowPulse    { 0%,100%{opacity:0.6;transform:translate(-50%,-50%) scale(1)} 50%{opacity:1;transform:translate(-50%,-50%) scale(1.1)} }
        @keyframes bcTapPulse     { 0%,100%{opacity:0.4} 50%{opacity:0.9} }
      `}</style>
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
