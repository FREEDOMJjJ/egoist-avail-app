import { useState, useEffect } from 'react'

// ── Gojo Satoru chibi ────────────────────────────────────────────────────────

const ACTIVITY_TEXTS = {
  laptop: ['Газ', 'CHE DUM?', 'PO PIVARIKY???'],
  gaming: ['Сисюльки скинь пж пж', 'Хуйня переделывай', 'Газ'],
  beer:   ['PO PIVARIKY???', 'CHE DUM?', 'Сисюльки скинь пж пж'],
  wait:   ['Хуйня переделывай', 'Газ', 'CHE DUM?'],
}

const ACTIVITY_LABELS = {
  laptop: 'ЮРА ПИШЕТ',
  gaming: 'ЮРА РУБИТСЯ',
  beer:   'ЮРА ОЖИДАЕТ',
  wait:   'ЮРА ЗАЛИП',
}

function GojoHead() {
  return (
    <g>
      {/* White spiky hair back */}
      <g style={{ transformOrigin: '100px 78px', animation: 'bcHairSway 3.4s ease-in-out infinite' }}>
        <path d="M 58 94 L 46 76 L 32 58 L 50 48 L 36 28 L 60 32 L 50 4 L 78 28 L 76 0 L 96 24 L 110 -2 L 118 26 L 134 4 L 134 30 L 156 12 L 150 32 L 174 28 L 162 50 L 180 56 L 164 70 L 180 80 L 158 90 L 172 106 Q 134 102 100 100 Q 68 102 58 94 Z"
          fill="#ffffff" stroke="#111" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M 76 46 L 94 26 L 108 48 L 100 68 L 84 63 Z" fill="#e0e0e0" opacity="0.5"/>
        <path d="M 118 34 L 130 18 L 140 38 L 132 54 Z" fill="#e0e0e0" opacity="0.4"/>
      </g>

      {/* Ears */}
      <ellipse cx="65" cy="88" rx="4.5" ry="7" fill="#f5c9a0" stroke="#111" strokeWidth="1.8"/>
      <ellipse cx="135" cy="88" rx="4.5" ry="7" fill="#f5c9a0" stroke="#111" strokeWidth="1.8"/>

      {/* Face */}
      <ellipse cx="100" cy="82" rx="37" ry="34" fill="#f5c9a0" stroke="#111" strokeWidth="2.5"/>

      {/* Front bangs */}
      <path d="M 66 68 L 58 104 L 76 90 L 82 98 L 88 78 Z" fill="#fff" stroke="#111" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M 92 76 L 97 108 L 106 93 L 112 104 L 120 82 Z" fill="#fff" stroke="#111" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M 126 76 L 136 98 L 132 76 Z" fill="#fff" stroke="#111" strokeWidth="2" strokeLinejoin="round"/>

      {/* Blue blindfold */}
      <rect x="64" y="80" width="72" height="18" rx="4" fill="#4361ee" stroke="#111" strokeWidth="2"/>
      {[70,78,86,94,102,110,118,126].map((x,i) => (
        <line key={i} x1={x} y1="83" x2={x} y2="95" stroke="#3a56d4" strokeWidth="1" opacity="0.45"/>
      ))}
      {/* Blindfold glow */}
      <rect x="64" y="80" width="72" height="18" rx="4" fill="none" stroke="#4cc9f0" strokeWidth="1" opacity="0.4"
        style={{ animation: 'bcGlow 2s ease-in-out infinite' }}/>
      {/* Six eyes under blindfold hint */}
      <circle cx="80" cy="89" r="1.5" fill="#4cc9f0" opacity="0.6" style={{ animation: 'bcGlow 2s ease-in-out infinite' }}/>
      <circle cx="100" cy="89" r="1.5" fill="#4cc9f0" opacity="0.6" style={{ animation: 'bcGlow 2s 0.3s ease-in-out infinite' }}/>
      <circle cx="120" cy="89" r="1.5" fill="#4cc9f0" opacity="0.6" style={{ animation: 'bcGlow 2s 0.6s ease-in-out infinite' }}/>

      {/* Nose */}
      <path d="M 97 100 Q 100 104 103 100" stroke="#d4956a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>

      {/* Mouth — smirk */}
      <path d="M 90 110 Q 100 118 110 110" fill="#e8847a" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M 92 111 Q 100 115 108 111" stroke="#fff" strokeWidth="0.6" fill="none" opacity="0.5"/>

      {/* Blush */}
      <ellipse cx="74" cy="100" rx="4" ry="2.5" fill="#ff99cc" opacity="0.5"/>
      <ellipse cx="126" cy="100" rx="4" ry="2.5" fill="#ff99cc" opacity="0.5"/>
    </g>
  )
}

function GojoChibi({ mode }) {
  return (
    <svg viewBox="0 0 200 225" width="100%" style={{ display: 'block', overflow: 'visible' }}>

      {/* ── Body ── */}
      {/* Neck */}
      <rect x="93" y="114" width="14" height="7" rx="2" fill="#f5c9a0" stroke="#111" strokeWidth="1.5"/>

      {/* JJK dark jacket */}
      <path d="M 74 120 Q 66 138 62 162 L 58 202 Q 100 210 142 202 L 138 162 Q 134 138 126 120 Z"
        fill="#1a1a2e" stroke="#111" strokeWidth="2.5"/>
      {/* Jacket highlight */}
      <path d="M 84 122 Q 78 140 76 162" stroke="#2d2d4e" strokeWidth="1.5" fill="none" opacity="0.7"/>
      <path d="M 116 122 Q 122 140 124 162" stroke="#2d2d4e" strokeWidth="1.5" fill="none" opacity="0.7"/>

      {/* High collar */}
      <path d="M 83 118 L 100 127 L 117 118 L 117 130 L 100 135 L 83 130 Z"
        fill="#0f0f1a" stroke="#111" strokeWidth="1.8"/>
      <path d="M 90 119 L 100 124 L 110 119" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.25"/>

      {/* Gold buttons */}
      <circle cx="100" cy="148" r="2.8" fill="#d4a017" stroke="#111" strokeWidth="0.8"/>
      <circle cx="100" cy="148" r="1.1" fill="#fff8" opacity="0.7"/>
      <circle cx="100" cy="162" r="2.2" fill="#d4a017" stroke="#111" strokeWidth="0.8"/>

      {/* Belt */}
      <rect x="60" y="177" width="80" height="7" rx="2" fill="#0f0f1a" stroke="#333" strokeWidth="1"/>
      <rect x="96" y="175" width="8" height="11" rx="1.5" fill="#d4a017" stroke="#111" strokeWidth="1"/>

      {/* ── Arms by mode ── */}

      {mode === 'laptop' && <>
        <path d="M 74 128 Q 58 155 60 180 L 72 182 Q 73 165 80 138 Z" fill="#1a1a2e" stroke="#111" strokeWidth="2"/>
        <ellipse cx="62" cy="184" rx="7" ry="6" fill="#f5c9a0" stroke="#111" strokeWidth="1.5"/>
        <path d="M 126 128 Q 142 155 140 180 L 128 182 Q 127 165 120 138 Z" fill="#1a1a2e" stroke="#111" strokeWidth="2"/>
        <ellipse cx="138" cy="184" rx="7" ry="6" fill="#f5c9a0" stroke="#111" strokeWidth="1.5"/>
        {/* Laptop */}
        <path d="M 44 174 L 156 174 L 162 149 L 38 149 Z" fill="#16213e" stroke="#111" strokeWidth="2"/>
        <path d="M 48 171 L 152 171 L 157 152 L 43 152 Z" fill="#0a0a1a"/>
        <text x="100" y="167" textAnchor="middle" fontFamily="Permanent Marker,system-ui" fontSize="12" fill="#4cc9f0">EG</text>
        <path d="M 34 184 L 166 184 L 172 202 L 28 202 Z" fill="#0f0f1a" stroke="#111" strokeWidth="2"/>
        {/* Tapping hands */}
        <g style={{ animation: 'bcTapL 0.65s ease-in-out infinite' }}>
          <path d="M 58 170 Q 53 178 56 186 L 68 186 L 70 173 Z" fill="#f5c9a0" stroke="#111" strokeWidth="1.5"/>
        </g>
        <g style={{ animation: 'bcTapR 0.65s ease-in-out infinite' }}>
          <path d="M 142 170 Q 147 178 144 186 L 132 186 L 130 173 Z" fill="#f5c9a0" stroke="#111" strokeWidth="1.5"/>
        </g>
        <text x="42" y="168" fontSize="9" fill="#4cc9f0" style={{ animation: 'bcSparkle 0.9s linear infinite' }}>✦</text>
        <text x="152" y="168" fontSize="7" fill="#4cc9f0" style={{ animation: 'bcSparkle 1.2s 0.4s linear infinite' }}>·</text>
      </>}

      {mode === 'gaming' && <>
        <path d="M 74 126 Q 62 152 74 170 L 90 164 L 86 134 Z" fill="#1a1a2e" stroke="#111" strokeWidth="2"/>
        <path d="M 126 126 Q 138 152 126 170 L 110 164 L 114 134 Z" fill="#1a1a2e" stroke="#111" strokeWidth="2"/>
        <g style={{ transformOrigin: '100px 168px', animation: 'bcWiggle 1.2s ease-in-out infinite' }}>
          <rect x="70" y="158" width="60" height="34" rx="15" fill="#16213e" stroke="#111" strokeWidth="2"/>
          <rect x="79" y="168" width="5" height="14" rx="1.5" fill="#0f0f1a"/>
          <rect x="75" y="172" width="14" height="5" rx="1.5" fill="#0f0f1a"/>
          <circle cx="116" cy="168" r="3.5" fill="#4cc9f0" stroke="#111" strokeWidth="1"/>
          <circle cx="123" cy="174" r="3.5" fill="#f72585" stroke="#111" strokeWidth="1"/>
          <circle cx="116" cy="180" r="3.5" fill="#7209b7" stroke="#111" strokeWidth="1"/>
          <circle cx="92" cy="183" r="5" fill="#0f3460" stroke="#111" strokeWidth="1.5"/>
          <circle cx="108" cy="183" r="5" fill="#0f3460" stroke="#111" strokeWidth="1.5"/>
        </g>
        <text x="54" y="154" fontSize="10" fill="#4cc9f0" style={{ animation: 'bcSparkle 0.7s linear infinite' }}>✦</text>
        <text x="148" y="150" fontSize="8" fill="#f72585" style={{ animation: 'bcSparkle 1.1s 0.3s linear infinite' }}>★</text>
      </>}

      {mode === 'beer' && <>
        <path d="M 74 128 Q 60 158 62 188 L 74 192 Q 76 168 84 138 Z" fill="#1a1a2e" stroke="#111" strokeWidth="2"/>
        <ellipse cx="64" cy="194" rx="7" ry="6" fill="#f5c9a0" stroke="#111" strokeWidth="1.5"/>
        <g style={{ transformOrigin: '126px 126px', animation: 'bcSip 3.2s ease-in-out infinite' }}>
          <path d="M 124 126 L 140 118 L 158 132 L 150 144 L 132 136 Z" fill="#1a1a2e" stroke="#111" strokeWidth="2"/>
          <rect x="126" y="82" width="30" height="36" rx="3" fill="#eaeaea" stroke="#111" strokeWidth="2"/>
          <path d="M 126 85 Q 130 74 137 83 Q 141 74 147 83 Q 153 74 156 85 L 156 94 L 126 94 Z"
            fill="#fff" stroke="#111" strokeWidth="2"/>
          <line x1="126" y1="104" x2="156" y2="104" stroke="#111" strokeWidth="1" opacity="0.2"/>
          <path d="M 156 92 Q 167 90 167 100 Q 167 110 156 108" fill="none" stroke="#111" strokeWidth="2"/>
          <ellipse cx="122" cy="106" rx="6" ry="5" fill="#f5c9a0" stroke="#111" strokeWidth="1.5"/>
          <circle cx="136" cy="88" r="2" fill="#fff">
            <animate attributeName="cy" values="94;78" dur="1.8s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.9;0" dur="1.8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="144" cy="90" r="1.5" fill="#fff">
            <animate attributeName="cy" values="94;76" dur="1.4s" begin="0.4s" repeatCount="indefinite"/>
            <animate attributeName="opacity" values="0;0.9;0" dur="1.4s" begin="0.4s" repeatCount="indefinite"/>
          </circle>
        </g>
      </>}

      {mode === 'wait' && <>
        <path d="M 74 134 Q 66 150 100 160 L 126 154 L 132 144 Q 110 140 100 144 L 86 136 Z"
          fill="#1a1a2e" stroke="#111" strokeWidth="2"/>
        <path d="M 126 140 Q 132 158 100 164 L 78 156 L 72 146 Q 96 146 100 150 L 118 138 Z"
          fill="#141426" stroke="#111" strokeWidth="2"/>
        <ellipse cx="74" cy="150" rx="6" ry="5" fill="#f5c9a0" stroke="#111" strokeWidth="1.5"/>
        <ellipse cx="126" cy="150" rx="6" ry="5" fill="#f5c9a0" stroke="#111" strokeWidth="1.5"/>
        <g style={{ animation: 'bcDots 1.4s ease-in-out infinite' }}>
          <circle cx="160" cy="62" r="3" fill="#4cc9f0" stroke="#111" strokeWidth="1"/>
          <circle cx="170" cy="56" r="2.4" fill="#4cc9f0" stroke="#111" strokeWidth="1" opacity="0.7"/>
          <circle cx="178" cy="50" r="1.8" fill="#4cc9f0" stroke="#111" strokeWidth="1" opacity="0.45"/>
        </g>
        {/* Six eyes effect */}
        <g style={{ animation: 'bcGlow 2s ease-in-out infinite' }}>
          <circle cx="162" cy="74" r="3" fill="#4cc9f0" opacity="0.7"/>
          <circle cx="170" cy="70" r="2.2" fill="#4cc9f0" opacity="0.5"/>
          <circle cx="177" cy="66" r="1.6" fill="#4cc9f0" opacity="0.35"/>
        </g>
      </>}

      {/* ── Head (always on top) ── */}
      <GojoHead />

      <style>{`
        @keyframes bcHairSway { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
        @keyframes bcSip { 0%,40%,100%{transform:rotate(0deg)} 60%,80%{transform:rotate(-24deg)} }
        @keyframes bcDots { 0%,100%{opacity:0.4;transform:translateY(0)} 50%{opacity:1;transform:translateY(-4px)} }
        @keyframes bcWiggle { 0%,100%{transform:rotate(-2.5deg)} 50%{transform:rotate(2.5deg)} }
        @keyframes bcTapL { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes bcTapR { 0%,100%{transform:translateY(-3px)} 50%{transform:translateY(0)} }
        @keyframes bcSparkle { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes bcGlow { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes bcBubble { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
      `}</style>
    </svg>
  )
}

export function MangaMascotCard({ userName, todayCount, teamSize, fullHouseCount }) {
  const MODES = ['laptop', 'gaming', 'beer', 'wait']
  const [modeIdx, setModeIdx] = useState(0)
  const [textIdx, setTextIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setModeIdx(i => (i + 1) % MODES.length), 6000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTextIdx(i => i + 1), 3200)
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
      {/* Halftone */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(67,97,238,0.25) 0.6px, transparent 1px)',
        backgroundSize: '5px 5px',
        maskImage: 'linear-gradient(135deg, #000 0%, transparent 55%)',
        WebkitMaskImage: 'linear-gradient(135deg, #000 0%, transparent 55%)',
      }}/>

      {/* Left — text */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          {/* Label */}
          <div style={{
            fontFamily: '"Nunito", system-ui',
            fontSize: 9, letterSpacing: 2.5, fontWeight: 800,
            color: '#4361ee', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#4cc9f0',
              border: '1px solid #000',
              display: 'inline-block',
              boxShadow: '0 0 4px #4cc9f0',
              animation: 'bcGlow 2s ease-in-out infinite',
            }}/>
            {ACTIVITY_LABELS[mode]}
          </div>

          {/* Speech bubble */}
          <div key={text} style={{
            background: '#fff', border: '2px solid #000',
            borderRadius: 14, padding: '10px 14px',
            maxWidth: 155, position: 'relative',
            boxShadow: '3px 3px 0 #000',
            fontFamily: '"Nunito", system-ui',
            fontWeight: 800, fontSize: 13, color: '#000',
            lineHeight: 1.3,
            animation: 'bcBubbleIn 300ms cubic-bezier(0.16,1,0.3,1)',
          }}>
            {text}
            {/* Arrow */}
            <div style={{
              position: 'absolute', right: -13, top: 16,
              width: 0, height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: '13px solid #000',
            }}/>
            <div style={{
              position: 'absolute', right: -9, top: 18,
              width: 0, height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: '10px solid #fff',
            }}/>
            {/* Sparkle */}
            <span style={{
              position: 'absolute', left: -7, top: -8,
              fontSize: 13, color: '#4cc9f0',
            }}>✦</span>
          </div>
        </div>

        {/* Status */}
        <div style={{
          fontFamily: '"Permanent Marker", system-ui',
          fontSize: 13, color: fullHouseCount > 0 ? '#4361ee' : '#000',
          letterSpacing: 0.5,
        }}>
          {todayCount >= teamSize
            ? '🔥 5/5 — ГО!'
            : `Сегодня: ${todayCount}/${teamSize}`}
        </div>
      </div>

      {/* Right — Gojo */}
      <div style={{ width: 125, flexShrink: 0, display: 'flex', alignItems: 'flex-end' }}>
        <GojoChibi mode={mode} />
      </div>

      <style>{`
        @keyframes bcBubbleIn {
          from { transform: scale(0.85) translateY(4px); opacity: 0; }
          to   { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
