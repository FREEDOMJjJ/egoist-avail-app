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
      <path d="M 60 136 C 48 144 36 158 32 178 C 28 196 30 220 32 240 L 168 240 C 170 220 172 196 168 178 C 164 158 152 144 140 136 C 130 130 118 126 100 126 C 82 126 70 130 60 136 Z" fill="#1a1a2
