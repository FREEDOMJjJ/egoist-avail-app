import { useState } from 'react'
import { BC_COLORS, MONTHS_RU } from './bc-shared'
import { Petal, PetalBurst } from './bc-effects'

function IconBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      width: 36, height: 36, borderRadius: 12,
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(255,255,255,0.22)',
      display: 'grid', placeItems: 'center', color: '#fff',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 12px rgba(0,0,0,0.25)',
      transition: 'transform 200ms, background 200ms',
    }}>
      {children}
    </button>
  )
}

export function Header({ teamSize = 5 }) {
  return (
    <div style={{ padding: '6px 18px 6px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          fontFamily: '"Nunito", system-ui',
          fontSize: 10, letterSpacing: 3, fontWeight: 800,
          color: 'rgba(255,255,255,0.55)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Petal size={10} rot={3} />
          <span>СОСТАВ · {teamSize}</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <IconBtn>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7" stroke="#fff" strokeWidth="1.6" />
              <path d="M10 6v4l2.5 2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </IconBtn>
          <IconBtn>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </IconBtn>
        </div>
      </div>

      <div style={{ marginTop: 14, textAlign: 'left', position: 'relative' }}>
        {/* manga screentone wedge */}
        <div style={{
          position: 'absolute', top: -8, right: -18, width: 220, height: 130,
          pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.32) 0.7px, transparent 1.1px)',
          backgroundSize: '6px 6px',
          maskImage: 'linear-gradient(225deg, #000 0%, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(225deg, #000 0%, transparent 70%)',
          opacity: 0.55,
        }} />
        {/* speed lines */}
        <svg viewBox="0 0 260 90" width="260" height="90" style={{
          position: 'absolute', top: 10, right: -10, opacity: 0.65, zIndex: 0,
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i}
              x1={140 + i * 14} y1={2 + i * 3}
              x2={250} y2={6 + i * 8}
              stroke="#fff" strokeWidth={i % 2 ? 0.5 : 0.8} opacity={0.4 - i * 0.03}
              strokeLinecap="round"
            />
          ))}
        </svg>

        <h1 style={{
          margin: 0, position: 'relative', zIndex: 1,
          fontFamily: '"Permanent Marker", "Rock Salt", system-ui',
          fontWeight: 400, fontSize: 78, lineHeight: 0.85,
          letterSpacing: 5, color: '#fff',
        }}>EGOIST</h1>

        <svg viewBox="0 0 220 14" width="78%" height="10" style={{ display: 'block', marginTop: 4, position: 'relative', zIndex: 1 }}>
          <path d="M 4 8 Q 30 2 70 6 T 140 6 T 216 5"
            stroke={BC_COLORS.pink} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
        </svg>

        <div style={{
          marginTop: 10, position: 'relative', zIndex: 1,
          fontFamily: '"Nunito", system-ui',
          fontSize: 13, fontWeight: 800, letterSpacing: 3, color: '#fff',
        }}>КАЛЕНДАРЬ</div>
        <div style={{
          marginTop: 4, position: 'relative', zIndex: 1,
          fontFamily: '"Nunito", system-ui',
          fontSize: 10, fontWeight: 500, letterSpacing: 2,
          color: 'rgba(255,255,255,0.55)',
        }}>2 НЕДЕЛИ · 14 ДНЕЙ · ОТМЕТЬ ГОТОВНОСТЬ</div>
      </div>
    </div>
  )
}

export function HpFooter({ bestCount, teamSize, onMore }) {
  const pct = teamSize > 0 ? (bestCount / teamSize) * 100 : 0
  const segW = teamSize > 0 ? 100 / teamSize : 20

  return (
    <div style={{
      padding: '10px 16px 12px',
      borderTop: '1px solid rgba(255,255,255,0.18)',
      background: 'rgba(0,0,0,0.55)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      boxShadow: '0 -10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'baseline', marginBottom: 7,
      }}>
        <span style={{
          fontFamily: '"Nunito", system-ui',
          fontSize: 10, letterSpacing: 2.5, fontWeight: 800,
          color: 'rgba(255,255,255,0.7)',
        }}>СОСТАВ НА СЕГОДНЯ</span>
        <span style={{
          fontFamily: '"Permanent Marker", system-ui',
          fontSize: 18, color: BC_COLORS.pink, letterSpacing: 1,
        }}>{bestCount} / {teamSize}</span>
      </div>

      <div style={{
        height: 10, borderRadius: 5,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.16)',
        overflow: 'hidden', position: 'relative',
      }}>
        {/* segment dividers */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
          backgroundImage: `repeating-linear-gradient(90deg, transparent 0 calc(${segW}% - 1px), rgba(255,255,255,0.18) calc(${segW}% - 1px) ${segW}%)`,
        }} />
        <div style={{
          width: `${pct}%`, height: '100%',
          background: `linear-gradient(90deg, ${BC_COLORS.pink}, #fff)`,
          boxShadow: `0 0 6px ${BC_COLORS.pink}88`,
          transition: 'width .6s cubic-bezier(.2,.8,.2,1)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
            backgroundSize: '40% 100%', backgroundRepeat: 'no-repeat',
            animation: 'bcShimmer 2.4s linear infinite',
          }} />
        </div>
      </div>

      <div style={{
        marginTop: 8, display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: '"Nunito", system-ui',
        fontSize: 10, letterSpacing: 1.4, fontWeight: 700,
      }}>
        <Legend dotColor={BC_COLORS.pink} label="МОГУ" />
        <Legend dotColor={BC_COLORS.steel} label="НЕ МОГУ" />
        <Legend dotColor="rgba(255,255,255,0.2)" label="ЖДЁМ" hollow />
        <button onClick={onMore} style={{
          marginLeft: 'auto', all: 'unset', cursor: 'pointer',
          fontFamily: '"Nunito", system-ui',
          fontSize: 11, letterSpacing: 1.6, fontWeight: 800,
          color: BC_COLORS.pink,
        }}>СОСТАВ →</button>
      </div>
    </div>
  )
}

function Legend({ dotColor, label, hollow }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: hollow ? 'transparent' : dotColor,
        border: `1px solid ${dotColor}`,
        boxShadow: hollow ? 'none' : `0 0 4px ${dotColor}aa`,
      }} />
      <span style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</span>
    </div>
  )
}

export function BigBtn({ color, active, onClick, children, hint, disabled }) {
  const isPos = color === 'pink'
  const [burstKey, setBurstKey] = useState(0)
  const [pressed, setPressed] = useState(false)

  const handle = () => {
    if (disabled) return
    setBurstKey(k => k + 1)
    setPressed(true)
    setTimeout(() => setPressed(false), 220)
    onClick?.()
  }

  const palette = isPos
    ? { bg: active ? BC_COLORS.pink : '#fff', border: '#000', text: '#000', shadow: '2px 2px 0 #000' }
    : { bg: active ? '#1a1a1a' : '#2a2a2a', border: '#fff', text: '#fff', shadow: active ? '2px 2px 0 #555' : '2px 2px 0 #ffffff33' }

  return (
    <button onClick={handle} style={{
      all: 'unset', boxSizing: 'border-box',
      flex: 1, padding: '14px 12px',
      textAlign: 'center', cursor: disabled ? 'not-allowed' : 'pointer',
      background: palette.bg, border: `2px solid ${palette.border}`,
      color: palette.text, borderRadius: 12,
      boxShadow: palette.shadow,
      position: 'relative', overflow: 'visible',
      opacity: disabled ? 0.55 : 1,
      transform: pressed ? 'scale(0.96)' : 'scale(1)',
      transition: 'transform 220ms cubic-bezier(.2,.7,.2,1), background .25s, box-shadow .2s',
    }}>
      {burstKey > 0 && (
        <PetalBurst k={burstKey} color={isPos ? BC_COLORS.pink : '#9a9a9a'} tone={isPos ? 'pink' : 'dust'} />
      )}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isPos
            ? <Petal size={14} rot={4} color={active ? '#fff' : BC_COLORS.pink} />
            : <span style={{ fontFamily: '"Nunito", system-ui', fontWeight: 900, fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1 }}>×</span>
          }
          <span style={{ fontFamily: '"Nunito", system-ui', fontWeight: 900, fontSize: 15, letterSpacing: 1.4 }}>{children}</span>
        </div>
        {hint && (
          <div style={{ fontFamily: '"Nunito", system-ui', fontSize: 9, letterSpacing: 2, fontWeight: 700, opacity: 0.55 }}>{hint}</div>
        )}
      </div>
    </button>
  )
}

export function StatusPill({ status }) {
  const base = {
    fontFamily: '"Nunito", system-ui', fontSize: 9, letterSpacing: 1.8,
    fontWeight: 800, padding: '5px 10px', borderRadius: 999, whiteSpace: 'nowrap',
  }
  if (status === 'can')  return <span style={{ ...base, color: '#000', background: BC_COLORS.pink, border: '1px solid #000' }}>В ИГРЕ</span>
  if (status === 'cant') return <span style={{ ...base, color: '#fff', background: '#2a2a2a', border: '1px solid rgba(255,255,255,0.3)' }}>ПАС</span>
  return <span style={{ ...base, color: 'rgba(0,0,0,0.5)', background: 'transparent', border: '1px dashed rgba(0,0,0,0.3)' }}>ЖДЁМ</span>
}

export function SkeletonHeader() {
  return (
    <div style={{ paddingTop: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 64, height: 14, borderRadius: 3, background: 'rgba(255,255,255,0.12)' }} />
      </div>
      <div style={{ width: 280, height: 64, borderRadius: 6, background: 'rgba(255,255,255,0.08)', marginTop: 16 }} />
      <div style={{ width: 220, height: 14, borderRadius: 3, background: 'rgba(255,255,255,0.08)', marginTop: 14 }} />
      <div style={{ width: 180, height: 9, borderRadius: 3, background: 'rgba(255,255,255,0.05)', marginTop: 8 }} />
    </div>
  )
}
