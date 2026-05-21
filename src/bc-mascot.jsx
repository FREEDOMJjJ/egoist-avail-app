import { useState, useEffect } from 'react'

export function MangaMascot({ corner = 'bottom-left', enabled = true }) {
  const [mood, setMood]       = useState('idle')
  const [thought, setThought] = useState(null)

  useEffect(() => {
    if (!enabled) return
    const sequence = [
      { mood: 'idle',   thought: null,          ms: 2600 },
      { mood: 'look-r', thought: null,          ms: 1600 },
      { mood: 'idle',   thought: null,          ms: 1600 },
      { mood: 'typing', thought: 'кодю...',     ms: 3200 },
      { mood: 'look-l', thought: null,          ms: 1400 },
      { mood: 'happy',  thought: '★',           ms: 1600 },
      { mood: 'idle',   thought: null,          ms: 2200 },
      { mood: 'sleep',  thought: 'zzz',         ms: 3400 },
      { mood: 'idle',   thought: null,          ms: 2200 },
      { mood: 'look-r', thought: 'когда матч?', ms: 2600 },
      { mood: 'typing', thought: null,          ms: 2800 },
    ]
    let i = 0, alive = true
    function step() {
      if (!alive) return
      const s = sequence[i % sequence.length]
      setMood(s.mood)
      setThought(s.thought)
      setTimeout(() => { i += 1; step() }, s.ms)
    }
    step()
    return () => { alive = false }
  }, [enabled])

  if (!enabled) return null

  const lookL   = mood === 'look-l'
  const lookR   = mood === 'look-r'
  const isSleep = mood === 'sleep'
  const isType  = mood === 'typing'
  const isHappy = mood === 'happy'
  const eyeX    = lookL ? -1.4 : lookR ? 1.4 : 0
  const eyeY    = isSleep ? 0 : isType ? 0.6 : 0

  const pos = corner === 'bottom-left'
    ? { left: 12, bottom: 92 }
    : corner === 'bottom-right'
    ? { right: 12, bottom: 92 }
    : { left: 12, top: 88 }

  return (
    <div style={{ position: 'absolute', ...pos, width: 58, zIndex: 30, pointerEvents: 'none' }}>
      {thought && (
        <div key={thought} style={{
          position: 'absolute', bottom: 60, left: 32,
          background: 'rgba(255,255,255,0.95)', color: '#000',
          fontFamily: '"Nunito", system-ui',
          fontSize: 10, fontWeight: 800, letterSpacing: 0.2,
          padding: '4px 8px', borderRadius: 10,
          border: '1.5px solid #000', boxShadow: '2px 2px 0 #000',
          backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
          animation: 'bcThoughtIn 260ms cubic-bezier(0.16, 1, 0.3, 1)',
          whiteSpace: 'nowrap',
        }}>
          {thought}
          <div style={{
            position: 'absolute', bottom: -7, left: 12,
            width: 0, height: 0,
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderTop: '7px solid #000',
          }} />
          <div style={{
            position: 'absolute', bottom: -4, left: 13,
            width: 0, height: 0,
            borderLeft: '4px solid transparent', borderRight: '4px solid transparent',
            borderTop: '5px solid rgba(255,255,255,0.95)',
          }} />
        </div>
      )}

      <div style={{
        position: 'relative', width: 58, height: 70,
        animation: isSleep
          ? 'bcMascotSleep 3.6s ease-in-out infinite'
          : 'bcMascotBob 2.6s ease-in-out infinite',
      }}>
        <svg viewBox="0 0 60 70" width="58" height="70" style={{ display: 'block' }}>
          <circle cx="30" cy="26" r="22" fill="rgba(248,165,194,0.18)" />
          <path d="M 6 30 Q 6 6 30 5 Q 54 6 54 30 L 48 18 L 42 26 L 36 14 L 30 22 L 24 14 L 18 26 L 12 18 Z" fill="#0a0a0a"/>
          <path d="M 50 26 L 56 18 L 53 30" fill="#0a0a0a"/>
          <path d="M 10 26 L 4 18 L 7 30" fill="#0a0a0a"/>
          <path d="M 14 24 Q 14 16 30 15 Q 46 16 46 24 L 46 34 Q 46 42 30 44 Q 14 42 14 34 Z" fill="#ecebe6" stroke="#000" strokeWidth="0.8"/>
          <line x1={18 + eyeX*0.6} y1={22} x2={24 + eyeX*0.6} y2={22} stroke="#000" strokeWidth="1.2" strokeLinecap="round"/>
          <line x1={36 + eyeX*0.6} y1={22} x2={42 + eyeX*0.6} y2={22} stroke="#000" strokeWidth="1.2" strokeLinecap="round"/>
          {isSleep ? (
            <g>
              <path d={`M ${18+eyeX} ${28+eyeY} Q ${21+eyeX} ${26+eyeY} ${24+eyeX} ${28+eyeY}`} stroke="#000" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
              <path d={`M ${36+eyeX} ${28+eyeY} Q ${39+eyeX} ${26+eyeY} ${42+eyeX} ${28+eyeY}`} stroke="#000" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            </g>
          ) : (
            <g>
              <ellipse cx={21+eyeX} cy={27+eyeY} rx="2" ry="2.7" fill="#000"/>
              <ellipse cx={39+eyeX} cy={27+eyeY} rx="2" ry="2.7" fill="#000"/>
              <circle cx={21.6+eyeX} cy={26+eyeY} r="0.8" fill="#fff"/>
              <circle cx={39.6+eyeX} cy={26+eyeY} r="0.8" fill="#fff"/>
            </g>
          )}
          {isHappy
            ? <path d="M 25 37 Q 30 41 35 37" stroke="#000" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
            : isType
            ? <line x1="27" y1="37" x2="33" y2="37" stroke="#000" strokeWidth="1.2" strokeLinecap="round"/>
            : isSleep
            ? <ellipse cx="30" cy="38" rx="2.5" ry="1.4" fill="#000" opacity="0.7"/>
            : <path d="M 26 38 Q 30 39.5 34 38" stroke="#000" strokeWidth="1" fill="none" strokeLinecap="round"/>
          }
          <circle cx="19" cy="33" r="1.8" fill="#f8a5c2" opacity="0.55"/>
          <circle cx="41" cy="33" r="1.8" fill="#f8a5c2" opacity="0.55"/>
          <rect x="14" y="42" width="32" height="4" fill="#f8a5c2" stroke="#000" strokeWidth="0.5"/>
          <path d="M 18 45 L 15 54 L 20 50 Z" fill="#f8a5c2" stroke="#000" strokeWidth="0.5"/>
          <path d="M 16 45 L 16 64 Q 16 68 20 68 L 40 68 Q 44 68 44 64 L 44 45 Z" fill="#0a0a0a"/>
          <line x1="30" y1="46" x2="30" y2="66" stroke="#fff" strokeWidth="0.5" opacity="0.4"/>
          <text x="30" y="58" textAnchor="middle" fontFamily='"Permanent Marker", system-ui' fontSize="6" fill="#fff" opacity="0.6">EGO</text>
          <g style={{
            transformOrigin: '30px 60px',
            animation: isType ? 'bcMascotType 240ms ease-in-out infinite alternate' : 'none',
          }}>
            <rect x="12" y={isType ? 58 : 56} width="6" height="9" rx="2.5" fill="#ecebe6" stroke="#000" strokeWidth="0.5"/>
            <rect x="42" y={isType ? 60 : 56} width="6" height="9" rx="2.5" fill="#ecebe6" stroke="#000" strokeWidth="0.5"/>
          </g>
          {isType && (
            <g>
              <rect x="11" y="66" width="38" height="4" rx="1" fill="#1a1a1a" stroke="#000" strokeWidth="0.5"/>
              <rect x="14" y="63" width="32" height="3.5" rx="0.5" fill="#f8a5c2" opacity="0.55"/>
            </g>
          )}
          {isSleep && (
            <text x="46" y="20" fontFamily='"Permanent Marker", system-ui' fontSize="9" fill="#f8a5c2"
              style={{ animation: 'bcZFloat 2s ease-out infinite' }}>z</text>
          )}
        </svg>
      </div>

      <style>{`
        @keyframes bcMascotBob {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-2.2px); }
        }
        @keyframes bcMascotSleep {
          0%,100% { transform: rotate(-2.5deg) translateY(0); }
          50%     { transform: rotate(2.5deg) translateY(-1px); }
        }
        @keyframes bcMascotType {
          from { transform: translateY(0); }
          to   { transform: translateY(-1.5px); }
        }
        @keyframes bcThoughtIn {
          from { transform: translateY(6px) scale(0.9); opacity: 0; }
          to   { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes bcZFloat {
          0%   { transform: translate(0, 0); opacity: 0; }
          30%  { opacity: 0.9; }
          100% { transform: translate(4px, -10px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
