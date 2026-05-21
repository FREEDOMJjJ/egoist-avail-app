import { useState, useEffect } from 'react'

const ACTIVITY_TEXTS = {
  couch: ['PO PIVARIKY???', 'Газ', 'CHE DUM?'],
  gaming: ['Сисюльки скинь пж пж', 'Хуйня переделывай', 'Газ'],
  sleep: ['Хуйня переделывай', 'CHE DUM?', 'Сисюльки скинь пж пж'],
  think: ['Газ', 'PO PIVARIKY???', 'CHE DUM?'],
}

const ACTIVITY_LABELS = {
  couch: 'ЮРА ОЖИДАЕТ',
  gaming: 'ЮРА РУБИТСЯ',
  sleep: 'ЮРА ЗАЛИП',
  think: 'ЮРА ПИШЕТ',
}

// Manhwa-style black and white schoolboy mascot
function YuraChibi({ mode }) {
  return (
    <svg viewBox="0 0 200 240" width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="faceG" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#fff"/>
          <stop offset="85%" stopColor="#f0f0f0"/>
          <stop offset="100%" stopColor="#d8d8d8"/>
        </radialGradient>
        <radialGradient id="hairG" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#2a2a2a"/>
          <stop offset="70%" stopColor="#1a1a1a"/>
          <stop offset="100%" stopColor="#0a0a0a"/>
        </radialGradient>
        <filter id="softShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="1" dy="2" result="offsetblur"/>
          <feComponentTransfer><feFuncA type="linear" slope="0.3"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ═══ MODE-SPECIFIC SCENES ═══ */}

      {mode === 'couch' && <>
        {/* Couch */}
        <path d="M 20 160 L 20 220 L 180 220 L 180 160 L 165 150 L 35 150 Z" fill="#1a1a1a" stroke="#000" strokeWidth="2"/>
        <path d="M 30 155 L 170 155 L 170 220 L 30 220 Z" fill="#2a2a2a"/>
        {/* Couch cushions */}
        <rect x="30" y="160" width="50" height="12" rx="4" fill="#3a3a3a" stroke="#222" strokeWidth="1"/>
        <rect x="90" y="160" width="50" height="12" rx="4" fill="#3a3a3a" stroke="#222" strokeWidth="1"/>
        <rect x="150" y="160" width="20" height="12" rx="4" fill="#3a3a3a" stroke="#222" strokeWidth="1"/>
        {/* Armrest */}
        <rect x="12" y="150" width="16" height="70" rx="6" fill="#1a1a1a" stroke="#000" strokeWidth="1.5"/>
        <rect x="172" y="150" width="16" height="70" rx="6" fill="#1a1a1a" stroke="#000" strokeWidth="1.5"/>
        
        {/* Body on couch — relaxed pose */}
        <g transform="translate(60, 140)">
          {/* Torso — school uniform */}
          <path d="M 20 30 L 10 50 L 8 80 L 80 80 L 78 50 L 68 30 Z" fill="#f8f8f8" stroke="#000" strokeWidth="1.5"/>
          {/* Uniform collar */}
          <path d="M 28 30 L 44 40 L 60 30" stroke="#000" strokeWidth="2" fill="none"/>
          {/* Tie */}
          <path d="M 44 40 L 42 58 L 44 62 L 46 58 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1"/>
          {/* Legs relaxed */}
          <path d="M 20 80 L 18 110 L 25 120" stroke="#222" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M 68 80 L 70 110 L 63 120" stroke="#222" strokeWidth="8" fill="none" strokeLinecap="round"/>
          {/* Left arm holding beer */}
          <g style={{ transformOrigin: '18px 45px', animation: 'yrSip 3.8s ease-in-out infinite' }}>
            <path d="M 10 42 L 2 38 L -8 40 L -6 46 L 4 50 Z" fill="#f8f8f8" stroke="#000" strokeWidth="1"/>
            {/* Beer can */}
            <rect x="-20" y="30" width="16" height="28" rx="3" fill="#c0c0c0" stroke="#000" strokeWidth="1.5"/>
            <ellipse cx="-12" cy="30" rx="8" ry="3" fill="#d0d0d0" stroke="#000" strokeWidth="1"/>
            <path d="M -18 35 L -18 50" stroke="#888" strokeWidth="1"/>
            <path d="M -12 35 L -12 50" stroke="#888" strokeWidth="1"/>
            <path d="M -6 35 L -6 50" stroke="#888" strokeWidth="1"/>
            {/* Hand */}
            <ellipse cx="-6" cy="48" rx="5" ry="4" fill="#fff" stroke="#000" strokeWidth="0.8"/>
          </g>
          {/* Right arm resting */}
          <path d="M 78 44 L 88 50 L 92 58" stroke="#f8f8f8" strokeWidth="6" fill="none" strokeLinecap="round"/>
          <ellipse cx="92" cy="62" rx="5" ry="4" fill="#fff" stroke="#000" strokeWidth="0.8"/>
        </g>

        {/* Head */}
        <g transform="translate(100, 110)">
          {/* Face */}
          <ellipse cx="0" cy="10" rx="20" ry="22" fill="url(#faceG)" stroke="#000" strokeWidth="1.5"/>
          {/* Hair — messy dark */}
          <path d="M -22 4 Q -24 -8 -18 -18 Q -12 -26 0 -28 Q 12 -26 18 -18 Q 24 -8 22 4 Q 18 -10 10 -18 L 2 -24 L 0 -26 L -2 -24 L -10 -18 Q -18 -10 -22 4 Z" fill="url(#hairG)" stroke="#000" strokeWidth="1.2"/>
          {/* Front hair strands */}
          <path d="M -14 -18 L -18 2 L -10 -4 Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
          <path d="M -4 -24 L -8 0 L 0 -6 Z" fill="#222" stroke="#000" strokeWidth="0.8"/>
          <path d="M 6 -24 L 2 0 L 10 -6 Z" fill="#222" stroke="#000" strokeWidth="0.8"/>
          {/* Sleepy eyes */}
          <path d="M -10 8 Q -6 6 -2 8" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M 2 8 Q 6 6 10 8" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* Small smile */}
          <path d="M -6 18 Q 0 20 6 18" stroke="#000" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </g>
      </>}

      {mode === 'gaming' && <>
        {/* Gaming chair */}
        <ellipse cx="100" cy="220" rx="40" ry="8" fill="#1a1a1a" opacity="0.3"/>
        <path d="M 70 140 L 65 220 L 135 220 L 130 140 Z" fill="#1a1a1a" stroke="#000" strokeWidth="2"/>
        <path d="M 75 145 L 125 145 L 120 215 L 80 215 Z" fill="#2a2a2a"/>
        {/* Backrest */}
        <path d="M 60 80 L 70 140 L 130 140 L 140 80 Q 130 70 100 68 Q 70 70 60 80 Z" fill="#1a1a1a" stroke="#000" strokeWidth="2"/>
        
        {/* Body sitting */}
        <g transform="translate(100, 100)">
          {/* Torso */}
          <path d="M -20 20 L -24 50 L -20 70 L 20 70 L 24 50 L 20 20 Z" fill="#f8f8f8" stroke="#000" strokeWidth="1.5"/>
          {/* Uniform collar */}
          <path d="M -10 20 L 0 28 L 10 20" stroke="#000" strokeWidth="2" fill="none"/>
          {/* Tie */}
          <path d="M 0 28 L -2 44 L 0 48 L 2 44 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1"/>
          {/* Legs */}
          <path d="M -12 70 L -16 100 L -10 110" stroke="#222" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <path d="M 12 70 L 16 100 L 10 110" stroke="#222" strokeWidth="7" fill="none" strokeLinecap="round"/>
          {/* Arms on controller */}
          <g style={{ transformOrigin: '0px 45px', animation: 'yrWiggle 1.2s ease-in-out infinite' }}>
            <path d="M -24 38 L -32 44 L -28 56" stroke="#f8f8f8" strokeWidth="5" fill="none" strokeLinecap="round"/>
            <path d="M 24 38 L 32 44 L 28 56" stroke="#f8f8f8" strokeWidth="5" fill="none" strokeLinecap="round"/>
            {/* Controller */}
            <ellipse cx="0" cy="55" rx="18" ry="10" fill="#3a3a3a" stroke="#000" strokeWidth="1.5"/>
            <circle cx="-6" cy="52" r="3" fill="#ff99cc" stroke="#000" strokeWidth="0.8"/>
            <circle cx="6" cy="52" r="3" fill="#4cc9f0" stroke="#000" strokeWidth="0.8"/>
            <rect x="-10" y="57" width="4" height="4" rx="1" fill="#2a2a2a"/>
            <rect x="6" y="57" width="4" height="4" rx="1" fill="#2a2a2a"/>
            {/* Hands */}
            <ellipse cx="-30" cy="58" rx="4" ry="3" fill="#fff" stroke="#000" strokeWidth="0.8"/>
            <ellipse cx="30" cy="58" rx="4" ry="3" fill="#fff" stroke="#000" strokeWidth="0.8"/>
          </g>
        </g>

        {/* Head — focused */}
        <g transform="translate(100, 72)">
          <ellipse cx="0" cy="0" rx="18" ry="20" fill="url(#faceG)" stroke="#000" strokeWidth="1.5"/>
          <path d="M -20 -8 Q -22 -18 -16 -26 Q -10 -32 0 -34 Q 10 -32 16 -26 Q 22 -18 20 -8 Q 16 -20 8 -26 L 0 -30 L -8 -26 Q -16 -20 -20 -8 Z" fill="url(#hairG)" stroke="#000" strokeWidth="1.2"/>
          <path d="M -12 -26 L -16 -4 L -8 -10 Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
          <path d="M 0 -30 L -4 -4 L 4 -10 Z" fill="#222" stroke="#000" strokeWidth="0.8"/>
          {/* Focused eyes */}
          <path d="M -8 -2 L -12 0 L -10 4 Q -6 6 -2 4 L -4 0 Z" fill="#000"/>
          <path d="M 2 -2 L 8 0 L 6 4 Q 2 6 -2 4 L 0 0 Z" fill="#000"/>
          <circle cx="-7" cy="1" r="1.2" fill="#fff"/>
          <circle cx="5" cy="1" r="1.2" fill="#fff"/>
          {/* Concentrated mouth */}
          <path d="M -4 10 L 4 10" stroke="#000" strokeWidth="1.2" strokeLinecap="round"/>
        </g>

        {/* Game sparkles */}
        <text x="30" y="60" fontSize="10" fill="#4cc9f0" style={{ animation: 'yrSparkle 0.9s linear infinite' }}>✦</text>
        <text x="170" y="55" fontSize="9" fill="#ff99cc" style={{ animation: 'yrSparkle 1.3s 0.4s linear infinite' }}>★</text>
      </>}

      {mode === 'sleep' && <>
        {/* Bed */}
        <rect x="20" y="160" width="160" height="60" rx="8" fill="#1a1a1a" stroke="#000" strokeWidth="2"/>
        <rect x="25" y="165" width="150" height="50" rx="4" fill="#2a2a2a"/>
        {/* Pillow */}
        <ellipse cx="50" cy="170" rx="30" ry="12" fill="#3a3a3a" stroke="#000" strokeWidth="1"/>
        {/* Blanket */}
        <path d="M 30 180 Q 60 175 90 180 Q 120 185 150 180 L 160 215 L 25 215 Z" fill="#444" stroke="#000" strokeWidth="1.5"/>
        <path d="M 35 185 Q 65 180 95 185 Q 125 190 155 185" stroke="#333" strokeWidth="1" fill="none"/>
        
        {/* Body sleeping */}
        <g transform="translate(60, 165)">
          {/* Torso lying down */}
          <ellipse cx="0" cy="10" rx="28" ry="16" fill="#f8f8f8" stroke="#000" strokeWidth="1"/>
          {/* Arm under head */}
          <path d="M -28 6 Q -40 0 -42 -8 L -36 -10 Q -30 -4 -24 2 Z" fill="#f8f8f8" stroke="#000" strokeWidth="1"/>
          {/* Hand/pillow */}
          <ellipse cx="-38" cy="-8" rx="6" ry="4" fill="#fff" stroke="#000" strokeWidth="0.8"/>
        </g>

        {/* Head sleeping */}
        <g transform="translate(50, 152)">
          <ellipse cx="0" cy="0" rx="16" ry="18" fill="url(#faceG)" stroke="#000" strokeWidth="1.5"/>
          {/* Hair messy */}
          <path d="M -18 -6 Q -20 -16 -14 -22 Q -8 -28 0 -30 Q 8 -28 14 -22 Q 20 -16 18 -6 Q 14 -18 6 -24 L 0 -28 L -6 -24 Q -14 -18 -18 -6 Z" fill="url(#hairG)" stroke="#000" strokeWidth="1.2"/>
          <path d="M -10 -22 L -14 -2 L -6 -8 Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
          <path d="M 0 -28 L -4 -4 L 4 -10 Z" fill="#222" stroke="#000" strokeWidth="0.8"/>
          {/* Closed eyes */}
          <path d="M -10 -2 Q -6 -4 -2 -2" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M 2 -2 Q 6 -4 10 -2" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* Peaceful smile */}
          <path d="M -6 6 Q 0 8 6 6" stroke="#000" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </g>

        {/* Zzz */}
        <g style={{ animation: 'yrFloat 2s ease-in-out infinite' }}>
          <text x="90" y="140" fontFamily="'Permanent Marker', system-ui" fontSize="16" fill="#000" opacity="0.6">Z</text>
          <text x="105" y="130" fontFamily="'Permanent Marker', system-ui" fontSize="14" fill="#000" opacity="0.5">z</text>
          <text x="118" y="122" fontFamily="'Permanent Marker', system-ui" fontSize="11" fill="#000" opacity="0.35">z</text>
        </g>
      </>}

      {mode === 'think' && <>
        {/* Chair */}
        <ellipse cx="100" cy="220" rx="38" ry="8" fill="#1a1a1a" opacity="0.3"/>
        <path d="M 75 150 L 70 220 L 130 220 L 125 150 Z" fill="#1a1a1a" stroke="#000" strokeWidth="2"/>
        <path d="M 80 155 L 120 155 L 115 215 L 85 215 Z" fill="#2a2a2a"/>
        {/* Backrest */}
        <path d="M 65 100 L 75 150 L 125 150 L 135 100 Q 125 90 100 88 Q 75 90 65 100 Z" fill="#1a1a1a" stroke="#000" strokeWidth="2"/>
        
        {/* Desk in front */}
        <rect x="40" y="135" width="120" height="8" rx="2" fill="#2a2a2a" stroke="#000" strokeWidth="1.5"/>
        {/* Laptop on desk */}
        <rect x="60" y="128" width="40" height="7" rx="2" fill="#1a1a1a" stroke="#000" strokeWidth="1"/>
        <rect x="62" y="125" width="36" height="3" rx="1" fill="#3a3a3a"/>
        <path d="M 65 125 L 95 125 L 98 117 L 62 117 Z" fill="#2a2a2a" stroke="#000" strokeWidth="1"/>
        <rect x="66" y="118" width="28" height="6" fill="#0a0a0a"/>
        <text x="80" y="122" textAnchor="middle" fontFamily="'Permanent Marker', system-ui" fontSize="4" fill="#4cc9f0">CODE</text>
        
        {/* Body sitting, leaning */}
        <g transform="translate(100, 110)">
          <path d="M -18 18 L -22 48 L -18 68 L 18 68 L 22 48 L 18 18 Z" fill="#f8f8f8" stroke="#000" strokeWidth="1.5"/>
          <path d="M -8 18 L 0 26 L 8 18" stroke="#000" strokeWidth="2" fill="none"/>
          <path d="M 0 26 L -2 40 L 0 44 L 2 40 Z" fill="#1a1a1a" stroke="#000" strokeWidth="1"/>
          {/* Legs */}
          <path d="M -10 68 L -14 98 L -8 108" stroke="#222" strokeWidth="7" fill="none" strokeLinecap="round"/>
          <path d="M 10 68 L 14 98 L 8 108" stroke="#222" strokeWidth="7" fill="none" strokeLinecap="round"/>
          {/* Arms resting on desk */}
          <path d="M -22 36 L -30 40 L -32 30" stroke="#f8f8f8" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <path d="M 22 36 L 30 40 L 32 30" stroke="#f8f8f8" strokeWidth="5" fill="none" strokeLinecap="round"/>
          <ellipse cx="-32" cy="30" rx="4" ry="3" fill="#fff" stroke="#000" strokeWidth="0.8"/>
          <ellipse cx="32" cy="30" rx="4" ry="3" fill="#fff" stroke="#000" strokeWidth="0.8"/>
        </g>

        {/* Head — thinking pose */}
        <g transform="translate(100, 82)">
          <ellipse cx="0" cy="0" rx="18" ry="20" fill="url(#faceG)" stroke="#000" strokeWidth="1.5"/>
          <path d="M -20 -8 Q -22 -18 -16 -26 Q -10 -32 0 -34 Q 10 -32 16 -26 Q 22 -18 20 -8 Q 16 -20 8 -26 L 0 -30 L -8 -26 Q -16 -20 -20 -8 Z" fill="url(#hairG)" stroke="#000" strokeWidth="1.2"/>
          <path d="M -12 -26 L -16 -4 L -8 -10 Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
          <path d="M 0 -30 L -4 -4 L 4 -10 Z" fill="#222" stroke="#000" strokeWidth="0.8"/>
          {/* Thoughtful eyes */}
          <path d="M -10 -2 L -14 0 L -12 4 Q -8 6 -4 4 L -6 0 Z" fill="#000"/>
          <path d="M 4 -2 L 8 0 L 6 4 Q 2 6 -2 4 L 0 0 Z" fill="#000"/>
          <circle cx="-9" cy="1" r="1" fill="#fff"/>
          <circle cx="5" cy="1" r="1" fill="#fff"/>
          {/* Small neutral mouth */}
          <path d="M -4 10 Q 0 12 4 10" stroke="#000" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </g>

        {/* Thought bubble */}
        <g style={{ animation: 'yrFloat 2s ease-in-out infinite' }}>
          <circle cx="135" cy="60" r="3" fill="#f0f0f0" stroke="#000" strokeWidth="1" opacity="0.7"/>
          <circle cx="145" cy="50" r="5" fill="#f0f0f0" stroke="#000" strokeWidth="1" opacity="0.8"/>
          <ellipse cx="160" cy="35" rx="18" ry="14" fill="#f8f8f8" stroke="#000" strokeWidth="1.5"/>
          <text x="160" y="38" textAnchor="middle" fontSize="10">?</text>
        </g>
      </>}

      <style>{`
        @keyframes yrSip      { 0%,40%,100%{transform:rotate(0deg)} 60%,82%{transform:rotate(-18deg)} }
        @keyframes yrWiggle   { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
        @keyframes yrFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes yrSparkle  { 0%,100%{opacity:0.3;transform:scale(0.9)} 50%{opacity:1;transform:scale(1.1)} }
      `}</style>
    </svg>
  )
}

export function MangaMascotCard({ userName, todayCount, teamSize, fullHouseCount }) {
  const MODES = ['think', 'gaming', 'couch', 'sleep']
  const [modeIdx, setModeIdx] = useState(0)
  const [textIdx, setTextIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setModeIdx(i => (i + 1) % MODES.length), 12000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTextIdx(i => i + 1), 7000)
    return () => clearInterval(t)
  }, [])

  const mode = MODES[modeIdx]
  const texts = ACTIVITY_TEXTS[mode]
  const text = texts[textIdx % texts.length]

  return (
    <div style={{
      background: 'rgba(255,255,255,0.92)',
      border: '2px solid #000', borderRadius: 16,
      padding: '14px 14px 14px 16px',
      display: 'flex', alignItems: 'stretch', gap: 8,
      minHeight: 168, position: 'relative', overflow: 'hidden',
      boxShadow: '4px 4px 0 #000',
    }}>
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(67,97,238,0.15) 0.6px, transparent 1px)',
        backgroundSize: '5px 5px',
        maskImage: 'linear-gradient(135deg, #000 0%, transparent 55%)',
        WebkitMaskImage: 'linear-gradient(135deg, #000 0%, transparent 55%)',
      }}/>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{
            fontFamily: '"Nunito", system-ui',
            fontSize: 9, letterSpacing: 2.5, fontWeight: 800,
            color: '#000', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#000', border: '1px solid #000',
              display: 'inline-block',
            }}/>
            {ACTIVITY_LABELS[mode]}
          </div>

          <div key={text} style={{
            background: '#fff', border: '2px solid #000',
            borderRadius: 14, padding: '10px 14px',
            maxWidth: 155, position: 'relative',
            boxShadow: '3px 3px 0 #000',
            fontFamily: '"Nunito", system-ui',
            fontWeight: 800, fontSize: 13, color: '#000',
            lineHeight: 1.3,
            animation: 'yrBubbleIn 300ms cubic-bezier(0.16,1,0.3,1)',
          }}>
            {text}
            <div style={{ position: 'absolute', right: -13, top: 16, width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '13px solid #000' }}/>
            <div style={{ position: 'absolute', right: -9, top: 18, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '10px solid #fff' }}/>
          </div>
        </div>

        <div style={{ fontFamily: '"Permanent Marker", system-ui', fontSize: 13, color: fullHouseCount > 0 ? '#000' : '#6a6a6a' }}>
          {todayCount >= teamSize ? '🔥 5/5 — ГО!' : `Сегодня: ${todayCount}/${teamSize}`}
        </div>
      </div>

      <div style={{ width: 125, flexShrink: 0, display: 'flex', alignItems: 'flex-end' }}>
        <YuraChibi mode={mode} />
      </div>

      <style>{`
        @keyframes yrBubbleIn { from { transform: scale(0.85) translateY(4px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
      `}</style>
    </div>
  )
}
