import { useState, useEffect } from 'react'

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
      <g style={{ transformOrigin: '100px 78px', animation: 'bcHairSway 3.4s ease-in-out infinite' }}>
        <path d="M 58 94 L 46 76 L 32 58 L 50 48 L 36 28 L 60 32 L 50 4 L 78 28 L 76 0 L 96 24 L 110 -2 L 118 26 L 134 4 L 134 30 L 156 12 L 150 32 L 174 28 L 162 50 L 180 56 L 164 70 L 180 80 L 158 90 L 172 106 Q 134 102 100 100 Q 68 102 58 94 Z"
          fill="#ffffff" stroke="#111" strokeWidth="2.5" strokeLinejoin="round"/>
        <path d="M 76 46 L 94 26 L 108 48 L 100 68 L 84 63 Z" fill="#e0e0e0" opacity="0.5"/>
      </g>
      <ellipse cx="65" cy="88" rx="4.5" ry="7" fill="#f5c9a0" stroke="#111" strokeWidth="1.8"/>
      <ellipse cx="135" cy="88" rx="4.5" ry="7" fill="#f5c9a0" stroke="#111" strokeWidth="1.8"/>
      <ellipse cx="100" cy="82" rx="37" ry="34" fill="#f5c9a0" stroke="#111" strokeWidth="2.5"/>
      <path d="M 66 68 L 58 104 L 76 90 L 82 98 L 88 78 Z" fill="#fff" stroke="#111" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M 92 76 L 97 108 L 106 93 L 112 104 L 120 82 Z" fill="#fff" stroke="#111" strokeWidth="2.2" strokeLinejoin="round"/>
      <path d="M 126 76 L 136 98 L 132 76 Z" fill="#fff" stroke="#111" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="64" y="80" width="72" height="18" rx="4" fill="#4361ee" stroke="#111" strokeWidth="2"/>
      {[70,78,86,94,102,110,118,126].map((x,i) => (
        <line key={i} x1={x} y1="83" x2={x} y2="95" stroke="#3a56d4" strokeWidth="1" opacity="0.4"/>
      ))}
      <rect x="64" y="80" width="72" height="18" rx="4" fill="none" stroke="#4cc9f0" strokeWidth="1" opacity="0.4" style={{ animation: 'bcGlow 2s ease-in-out infinite' }}/>
      <circle cx="80" cy="89" r="1.5" fill="#4cc9f0" opacity="0.6" style={{ animation: 'bcGlow 2s ease-in-out infinite' }}/>
      <circle cx="100" cy="89" r="1.5" fill="#4cc9f0" opacity="0.6" style={{ animation: 'bcGlow 2s 0.3s ease-in-out infinite' }}/>
      <circle cx="120" cy="89" r="1.5" fill="#4cc9f0" opacity="0.6" style={{ animation: 'bcGlow 2s 0.6s ease-in-out infinite' }}/>
      <path d="M 97 100 Q 100 104 103 100" stroke="#d4956a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M 90 110 Q 100 118 110 110" fill="#e8847a" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="74" cy="100" rx="4" ry="2.5" fill="#ff99cc" opacity="0.5"/>
      <ellipse cx="126" cy="100" rx="4" ry="2.5" fill="#ff99cc" opacity="0.5"/>
    </g>
  )
}

function GojoChibi({ mode }) {
  return (
    <svg viewBox="0 0 200 240" width="100%" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="faceG" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#fde8c8"/>
          <stop offset="70%" stopColor="#f5c9a0"/>
          <stop offset="100%" stopColor="#e8b48a"/>
        </radialGradient>
        <radialGradient id="hairG" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffffff"/>
          <stop offset="60%" stopColor="#e8e8f0"/>
          <stop offset="100%" stopColor="#c8c8e0"/>
        </radialGradient>
        <filter id="glowF"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>

      {/* Neck */}
      <path d="M 88 118 C 86 122 85 130 86 136 L 114 136 C 115 130 114 122 112 118 Z" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/>

      {/* Torso JJK */}
      <path d="M 60 136 C 48 144 36 158 32 178 C 28 196 30 220 32 240 L 168 240 C 170 220 172 196 168 178 C 164 158 152 144 140 136 C 130 130 118 126 100 126 C 82 126 70 130 60 136 Z" fill="#1a1a2e" stroke="#0f0f1a" strokeWidth="1.5"/>
      <path d="M 62 140 C 52 152 46 168 44 188" stroke="#2a2a4e" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M 138 140 C 148 152 154 168 156 188" stroke="#2a2a4e" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.5"/>

      {/* High collar */}
      <path d="M 80 126 C 78 128 76 134 78 140 L 100 145 L 122 140 C 124 134 122 128 120 126 C 112 122 88 122 80 126 Z" fill="#0f0f1a" stroke="#1a1a2e" strokeWidth="1"/>
      <path d="M 84 128 C 90 124 110 124 116 128" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none"/>

      {/* Gold buttons */}
      <circle cx="100" cy="158" r="3.5" fill="#d4a017"/><circle cx="100" cy="158" r="2" fill="#e8c040"/><circle cx="100" cy="158" r="0.8" fill="rgba(255,255,255,0.8)"/>
      <circle cx="100" cy="170" r="2.8" fill="#d4a017"/><circle cx="100" cy="170" r="1.5" fill="#e8c040"/>

      {/* Belt */}
      <path d="M 42 186 L 158 186 L 160 194 L 40 194 Z" fill="#111" stroke="#2a2a2a" strokeWidth="0.8"/>
      <rect x="93" y="183" width="14" height="14" rx="2" fill="#d4a017" stroke="#111" strokeWidth="0.8"/>

      {/* MODE ARMS */}
      {mode === 'laptop' && <>
        <path d="M 64 138 C 52 150 44 166 44 186 L 52 188 C 54 170 60 156 70 144 Z" fill="#1a1a2e" stroke="#0f0f1a" strokeWidth="1"/>
        <ellipse cx="48" cy="192" rx="8" ry="7" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/>
        <path d="M 136 138 C 148 150 156 166 156 186 L 148 188 C 146 170 140 156 130 144 Z" fill="#1a1a2e" stroke="#0f0f1a" strokeWidth="1"/>
        <ellipse cx="152" cy="192" rx="8" ry="7" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/>
        <path d="M 34 186 L 166 186 L 170 160 L 30 160 Z" fill="#1c2340" stroke="#2a3560" strokeWidth="1.5"/>
        <rect x="36" y="162" width="128" height="22" rx="1" fill="#0a0f1e"/>
        <text x="100" y="177" textAnchor="middle" fontFamily="'Permanent Marker', system-ui" fontSize="10" fill="#4cc9f0">EGOIST.GG</text>
        <path d="M 28 194 L 172 194 L 176 216 L 24 216 Z" fill="#141830" stroke="#1e2440" strokeWidth="1.2"/>
        <g style={{ animation: 'bcTapL 0.55s ease-in-out infinite' }}><ellipse cx="48" cy="200" rx="7" ry="6" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/></g>
        <g style={{ animation: 'bcTapR 0.55s ease-in-out infinite' }}><ellipse cx="152" cy="200" rx="7" ry="6" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/></g>
        <text x="26" y="158" fontSize="10" fill="#4cc9f0" opacity="0.8" style={{ animation: 'bcSparkle 1s linear infinite' }}>{"</>"}</text>
      </>}
      {mode === 'gaming' && <>
        <path d="M 64 138 C 52 156 52 174 60 188 L 70 184 C 64 172 66 158 74 146 Z" fill="#1a1a2e" stroke="#0f0f1a" strokeWidth="1"/>
        <path d="M 136 138 C 148 156 148 174 140 188 L 130 184 C 136 172 134 158 126 146 Z" fill="#1a1a2e" stroke="#0f0f1a" strokeWidth="1"/>
        <g style={{ transformOrigin: '100px 178px', animation: 'bcWiggle 1.4s ease-in-out infinite' }}>
          <path d="M 64 164 C 62 152 70 144 84 144 L 116 144 C 130 144 138 152 136 164 L 130 186 C 126 196 118 200 100 200 C 82 200 74 196 70 186 Z" fill="#1c2340" stroke="#2a3560" strokeWidth="1.5"/>
          <ellipse cx="74" cy="186" rx="10" ry="8" fill="#161c36" stroke="#2a3560" strokeWidth="1"/>
          <ellipse cx="126" cy="186" rx="10" ry="8" fill="#161c36" stroke="#2a3560" strokeWidth="1"/>
          <rect x="76" y="164" width="6" height="18" rx="2" fill="#0f1428"/>
          <rect x="70" y="170" width="18" height="6" rx="2" fill="#0f1428"/>
          <circle cx="118" cy="162" r="5" fill="#4cc9f0" stroke="#3aadcc" strokeWidth="1"/>
          <circle cx="126" cy="170" r="5" fill="#f72585" stroke="#cc1060" strokeWidth="1"/>
          <circle cx="118" cy="178" r="5" fill="#7209b7" stroke="#500880" strokeWidth="1"/>
          <circle cx="110" cy="170" r="5" fill="#22c55e" stroke="#16903e" strokeWidth="1"/>
          <circle cx="86" cy="180" r="8" fill="#0f1428" stroke="#2a3560" strokeWidth="1.2"/>
          <circle cx="86" cy="180" r="4.5" fill="#1c2340"/>
          <circle cx="108" cy="180" r="8" fill="#0f1428" stroke="#2a3560" strokeWidth="1.2"/>
          <circle cx="108" cy="180" r="4.5" fill="#1c2340"/>
          <ellipse cx="70" cy="186" rx="9" ry="8" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/>
          <ellipse cx="130" cy="186" rx="9" ry="8" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/>
        </g>
        <text x="48" y="160" fontSize="12" fill="#4cc9f0" style={{ animation: 'bcSparkle 0.8s linear infinite' }}>✦</text>
        <text x="152" y="154" fontSize="9" fill="#f72585" style={{ animation: 'bcSparkle 1.2s 0.4s linear infinite' }}>★</text>
      </>}
      {mode === 'beer' && <>
        <path d="M 64 138 C 52 154 48 174 50 200 L 60 202 C 60 178 64 160 72 146 Z" fill="#1a1a2e" stroke="#0f0f1a" strokeWidth="1"/>
        <ellipse cx="55" cy="206" rx="9" ry="8" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/>
        <g style={{ transformOrigin: '130px 140px', animation: 'bcSip 3.5s ease-in-out infinite' }}>
          <path d="M 136 138 C 150 126 162 120 168 114 L 172 120 C 166 128 154 136 140 148 Z" fill="#1a1a2e" stroke="#0f0f1a" strokeWidth="1"/>
          <rect x="154" y="72" width="34" height="44" rx="4" fill="#f0f0e8" stroke="#c8c890" strokeWidth="1.5"/>
          <path d="M 154 74 Q 158 62 165 72 Q 169 60 175 72 Q 179 60 186 74 L 188 80 L 154 80 Z" fill="#fff" stroke="#c8c890" strokeWidth="1.5"/>
          <rect x="156" y="82" width="30" height="32" rx="2" fill="#d4a017" opacity="0.5"/>
          <path d="M 188 80 C 200 80 204 86 204 96 C 204 106 200 112 188 112" fill="none" stroke="#c8c890" strokeWidth="2.5"/>
          <circle cx="168" cy="96" r="2.5" fill="rgba(255,255,255,0.6)"><animate attributeName="cy" values="110;74" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.8;0" dur="2s" repeatCount="indefinite"/></circle>
          <circle cx="176" cy="100" r="2" fill="rgba(255,255,255,0.6)"><animate attributeName="cy" values="110;76" dur="1.6s" begin="0.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0;0.8;0" dur="1.6s" begin="0.5s" repeatCount="indefinite"/></circle>
          <ellipse cx="154" cy="116" rx="9" ry="8" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/>
        </g>
      </>}
      {mode === 'wait' && <>
        <path d="M 64 138 C 54 148 52 160 60 174 L 100 168 L 122 170 L 132 162 C 120 156 104 154 100 158 L 86 148 Z" fill="#1a1a2e" stroke="#0f0f1a" strokeWidth="1"/>
        <path d="M 136 138 C 146 148 148 160 140 174 L 100 168 L 78 170 L 68 162 C 80 156 96 154 100 158 L 114 148 Z" fill="#141426" stroke="#0f0f1a" strokeWidth="1"/>
        <ellipse cx="68" cy="168" rx="9" ry="7" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/>
        <ellipse cx="132" cy="168" rx="9" ry="7" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/>
        <g style={{ animation: 'bcDots 1.6s ease-in-out infinite' }}>
          <circle cx="162" cy="70" r="4" fill="#4cc9f0" filter="url(#glowF)"/>
          <circle cx="174" cy="62" r="3.2" fill="#4cc9f0" opacity="0.7" filter="url(#glowF)"/>
          <circle cx="184" cy="54" r="2.4" fill="#4cc9f0" opacity="0.45" filter="url(#glowF)"/>
        </g>
      </>}

      {/* ═══ HEAD — manhwa quality ═══ */}

      {/* White hair back — spiky, detailed */}
      <g style={{ transformOrigin: '100px 75px', animation: 'bcHairSway 4s ease-in-out infinite' }}>
        <path d="M 52 90 C 48 72 50 52 58 38 C 64 28 72 18 80 12 C 88 8 96 6 100 6 C 104 6 112 8 120 12 C 128 18 136 28 142 38 C 150 52 152 72 148 90 C 144 72 136 54 124 42 C 114 32 108 28 100 26 C 92 28 86 32 76 42 C 64 54 56 72 52 90 Z" fill="url(#hairG)" stroke="#c0c0d8" strokeWidth="1.2"/>
        {/* Spikes */}
        <path d="M 58 38 L 46 16 L 58 28 L 56 8 L 68 24 L 70 6 L 78 22 Z" fill="#f4f4fc" stroke="#c0c0d8" strokeWidth="1"/>
        <path d="M 78 18 L 74 2 L 82 14 L 82 0 L 90 14 Z" fill="#f8f8ff" stroke="#c0c0d8" strokeWidth="1"/>
        <path d="M 94 10 L 92 -2 L 98 10 L 100 -4 L 102 10 L 108 -2 L 106 10 Z" fill="#fff" stroke="#d0d0e8" strokeWidth="1"/>
        <path d="M 118 14 L 118 0 L 126 14 Z" fill="#f8f8ff" stroke="#c0c0d8" strokeWidth="1"/>
        <path d="M 124 16 L 128 2 L 136 18 L 138 4 L 146 22 Z" fill="#f4f4fc" stroke="#c0c0d8" strokeWidth="1"/>
        <path d="M 144 38 L 154 16 L 142 28 L 146 8 L 134 24 Z" fill="#f0f0f8" stroke="#c0c0d8" strokeWidth="1"/>
        {/* Shine */}
        <path d="M 80 28 C 78 36 78 44 80 52" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
        <path d="M 94 22 C 92 32 92 44 94 54" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.45"/>
        <path d="M 116 26 C 118 36 118 46 116 56" stroke="#fff" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.4"/>
        {/* Front strands */}
        <path d="M 68 30 C 62 46 60 62 66 76 L 74 68 Z" fill="#f0f0f8" stroke="#c8c8e0" strokeWidth="0.8"/>
        <path d="M 80 22 C 74 38 72 54 76 68 L 84 60 Z" fill="#f4f4fc" stroke="#c8c8e0" strokeWidth="0.8"/>
        <path d="M 94 18 C 90 34 90 50 94 64 L 100 58 Z" fill="#f8f8ff" stroke="#c8c8e0" strokeWidth="0.8"/>
        <path d="M 108 18 C 112 34 112 50 108 64 L 102 58 Z" fill="#f8f8ff" stroke="#c8c8e0" strokeWidth="0.8"/>
        <path d="M 122 20 C 128 36 128 52 122 66 L 116 60 Z" fill="#f4f4fc" stroke="#c8c8e0" strokeWidth="0.8"/>
      </g>

      {/* Ears */}
      <path d="M 54 78 C 50 80 48 86 50 94 C 52 100 56 103 60 102 C 58 100 54 96 52 92 C 50 86 50 80 54 78 Z" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/>
      <path d="M 146 78 C 150 80 152 86 150 94 C 148 100 144 103 140 102 C 142 100 146 96 148 92 C 150 86 150 80 146 78 Z" fill="url(#faceG)" stroke="#c8956a" strokeWidth="0.8"/>
      {/* Ear shadows */}
      <path d="M 54 82 C 52 86 52 92 54 96" stroke="rgba(180,120,80,0.2)" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 146 82 C 148 86 148 92 146 96" stroke="rgba(180,120,80,0.2)" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Face */}
      <path d="M 60 68 C 58 56 60 42 66 32 C 72 22 82 18 100 18 C 118 18 128 22 134 32 C 140 42 142 56 140 68 C 140 84 136 98 128 110 C 122 120 114 126 100 128 C 86 126 78 120 72 110 C 64 98 60 84 60 68 Z" fill="url(#faceG)" stroke="#c8956a" strokeWidth="1.2"/>
      {/* Face side shadow */}
      <path d="M 128 38 C 134 50 138 62 138 74 C 138 88 134 102 126 112" stroke="rgba(180,120,80,0.2)" strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* Face highlight */}
      <path d="M 76 38 C 72 46 70 56 72 66" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" strokeLinecap="round"/>

      {/* Blue blindfold */}
      <path d="M 62 70 C 62 66 66 62 72 60 L 128 60 C 134 62 138 66 138 70 L 138 80 C 138 84 134 86 128 86 L 72 86 C 66 86 62 84 62 80 Z" fill="#3355cc" stroke="#1a2888" strokeWidth="1.5"/>
      <path d="M 64 66 L 136 66 L 136 70 L 64 70 Z" fill="rgba(255,255,255,0.08)"/>
      {[70,78,86,94,102,110,118,126].map((x,i) => (
        <line key={i} x1={x} y1="62" x2={x} y2="84" stroke="#2244aa" strokeWidth="0.8" opacity="0.4"/>
      ))}
      <path d="M 62 70 C 62 66 66 62 72 60 L 128 60 C 134 62 138 66 138 70 L 138 80 C 138 84 134 86 128 86 L 72 86 C 66 86 62 84 62 80 Z" fill="none" stroke="#4cc9f0" strokeWidth="0.6" opacity="0.35" filter="url(#glowF)"/>
      {/* Six eyes */}
      {[76,100,124].map((x,i) => (
        <ellipse key={i} cx={x} cy="73" rx="3.5" ry="3.5" fill="#4cc9f0" opacity="0">
          <animate attributeName="opacity" values="0;0.7;0" dur="2.5s" begin={`${i*0.4}s`} repeatCount="indefinite"/>
        </ellipse>
      ))}

      {/* Nose subtle */}
      <path d="M 95 96 C 93 100 94 104 100 106 C 106 104 107 100 105 96" stroke="#d4956a" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="95" cy="104" r="1.8" fill="rgba(180,100,60,0.25)"/>
      <circle cx="105" cy="104" r="1.8" fill="rgba(180,100,60,0.25)"/>

      {/* Mouth — confident */}
      <path d="M 88 116 C 90 112 96 110 100 112 C 104 110 110 112 112 116" stroke="#c87860" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 100 112 C 103 115 108 116 112 115" fill="#e8907a" stroke="none" opacity="0.35"/>

      {/* Blush */}
      <ellipse cx="74" cy="102" rx="9" ry="4.5" fill="#ff99cc" opacity="0.18"/>
      <ellipse cx="126" cy="102" rx="9" ry="4.5" fill="#ff99cc" opacity="0.18"/>

      <style>{`
        @keyframes bcHairSway { 0%,100%{transform:rotate(-1.2deg)translateY(0)} 50%{transform:rotate(1.2deg)translateY(-1px)} }
        @keyframes bcSip      { 0%,40%,100%{transform:rotate(0deg)} 62%,82%{transform:rotate(-28deg)} }
        @keyframes bcDots     { 0%,100%{opacity:0.4;transform:translateY(0)} 50%{opacity:1;transform:translateY(-5px)} }
        @keyframes bcWiggle   { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
        @keyframes bcTapL     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes bcTapR     { 0%,100%{transform:translateY(-3px)} 50%{transform:translateY(0)} }
        @keyframes bcSparkle  { 0%,100%{opacity:0.2;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.1)} }
        @keyframes bcGlow     { 0%,100%{opacity:0.3} 50%{opacity:0.9} }
      `}</style>
    </svg>
  )
}

export function MangaMascotCard({ userName, todayCount, teamSize, fullHouseCount }) {
  const MODES = ['laptop', 'gaming', 'beer', 'wait']
  const [modeIdx, setModeIdx] = useState(0)
  const [textIdx, setTextIdx] = useState(0)

  // Замедленные смены — 8 сек режим, 5 сек текст
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
        backgroundImage: 'radial-gradient(rgba(67,97,238,0.25) 0.6px, transparent 1px)',
        backgroundSize: '5px 5px',
        maskImage: 'linear-gradient(135deg, #000 0%, transparent 55%)',
        WebkitMaskImage: 'linear-gradient(135deg, #000 0%, transparent 55%)',
      }}/>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{
            fontFamily: '"Nunito", system-ui',
            fontSize: 9, letterSpacing: 2.5, fontWeight: 800,
            color: '#4361ee', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#4cc9f0', border: '1px solid #000',
              display: 'inline-block', boxShadow: '0 0 4px #4cc9f0',
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
            animation: 'bcBubbleIn 300ms cubic-bezier(0.16,1,0.3,1)',
          }}>
            {text}
            <div style={{ position: 'absolute', right: -13, top: 16, width: 0, height: 0, borderTop: '7px solid transparent', borderBottom: '7px solid transparent', borderLeft: '13px solid #000' }}/>
            <div style={{ position: 'absolute', right: -9, top: 18, width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '10px solid #fff' }}/>
            <span style={{ position: 'absolute', left: -7, top: -8, fontSize: 13, color: '#4cc9f0' }}>✦</span>
          </div>
        </div>

        <div style={{ fontFamily: '"Permanent Marker", system-ui', fontSize: 13, color: fullHouseCount > 0 ? '#4361ee' : '#000' }}>
          {todayCount >= teamSize ? '🔥 5/5 — ГО!' : `Сегодня: ${todayCount}/${teamSize}`}
        </div>
      </div>

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
