// ─── EGOIST · Settings, Themes, Sounds, Parallax, Animated BG ──────────────────
// Полностью изолирован, не ломает существующий код

import { useState, useEffect, useRef, createContext, useContext } from 'react'

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ТЕМЫ (32) — dark / light / cyberpunk / mono
// ═══════════════════════════════════════════════════════════════════════════════

export const THEMES = {
  dark: {
    name: 'DARK', emoji: '🌙',
    bg: '#0a0a0f', bg2: '#13131e',
    surface: 'rgba(255,255,255,0.04)',
    card: 'rgba(255,255,255,0.95)',
    border: '#000',
    text: '#fff', textDim: 'rgba(255,255,255,0.6)',
    accent: '#ff99cc', accent2: '#4361ee',
    glow: 'rgba(255,153,204,0.25)',
  },
  light: {
    name: 'LIGHT', emoji: '☀️',
    bg: '#f5f0eb', bg2: '#ffffff',
    surface: 'rgba(0,0,0,0.04)',
    card: '#fff',
    border: '#000',
    text: '#000', textDim: 'rgba(0,0,0,0.6)',
    accent: '#ff6eb4', accent2: '#4361ee',
    glow: 'rgba(255,110,180,0.3)',
  },
  cyber: {
    name: 'CYBER', emoji: '⚡',
    bg: '#0a0014', bg2: '#1a0033',
    surface: 'rgba(157,0,255,0.08)',
    card: 'rgba(20,5,40,0.92)',
    border: '#00ffff',
    text: '#00ffff', textDim: 'rgba(0,255,255,0.6)',
    accent: '#ff00aa', accent2: '#00ffff',
    glow: 'rgba(0,255,255,0.4)',
  },
  mono: {
    name: 'MONO', emoji: '◼️',
    bg: '#1a1a1a', bg2: '#2a2a2a',
    surface: 'rgba(255,255,255,0.05)',
    card: 'rgba(255,255,255,0.95)',
    border: '#000',
    text: '#fff', textDim: 'rgba(255,255,255,0.55)',
    accent: '#fff', accent2: '#888',
    glow: 'rgba(255,255,255,0.2)',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. КАСТОМНЫЕ АВАТАРКИ (33) — 8 вариантов голов
// ═══════════════════════════════════════════════════════════════════════════════

export const AVATAR_PRESETS = [
  { id: 0, name: 'Undercut' },
  { id: 1, name: 'Silver' },
  { id: 2, name: 'Blindfold' },
  { id: 3, name: 'Blonde' },
  { id: 4, name: 'Dark' },
  { id: 5, name: 'Mohawk' },
  { id: 6, name: 'Long' },
  { id: 7, name: 'Sharp' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// 3. ЗВУКИ (34) — Web Audio API без файлов
// ═══════════════════════════════════════════════════════════════════════════════

class SoundEngine {
  constructor() {
    this.ctx = null
    this.enabled = false
  }
  init() {
    if (this.ctx) return
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    } catch (_) {}
  }
  setEnabled(v) { this.enabled = !!v; if (v) this.init() }

  beep(freq = 440, duration = 0.08, type = 'sine', vol = 0.15) {
    if (!this.enabled || !this.ctx) return
    try {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      gain.gain.value = vol
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration)
      osc.connect(gain).connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + duration)
    } catch (_) {}
  }
  click()   { this.beep(800, 0.04, 'square', 0.08) }
  tap()     { this.beep(600, 0.05, 'sine', 0.12) }
  success() {
    this.beep(523, 0.08, 'sine', 0.15)
    setTimeout(() => this.beep(784, 0.12, 'sine', 0.15), 70)
  }
  error()   { this.beep(220, 0.15, 'sawtooth', 0.10) }
  notify()  {
    this.beep(659, 0.06, 'sine', 0.12)
    setTimeout(() => this.beep(880, 0.10, 'sine', 0.12), 50)
  }
}

export const sound = new SoundEngine()

// ═══════════════════════════════════════════════════════════════════════════════
// 4. STORAGE — настройки в localStorage
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'egoist_settings_v1'

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  } catch { return {} }
}
function saveSettings(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch (_) {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const SettingsContext = createContext(null)

export function useSettings() {
  return useContext(SettingsContext) || {
    theme: 'dark',
    themeData: THEMES.dark,
    avatarId: 0,
    soundsOn: false,
    bgAnim: 'particles',
    parallax: false,
    setTheme: () => {},
    setAvatarId: () => {},
    setSoundsOn: () => {},
    setBgAnim: () => {},
    setParallax: () => {},
    openSettings: () => {},
  }
}

export function SettingsProvider({ children }) {
  const saved = loadSettings()
  const [theme, setThemeState]       = useState(saved.theme || 'dark')
  const [avatarId, setAvatarIdState] = useState(saved.avatarId ?? 0)
  const [soundsOn, setSoundsOnState] = useState(saved.soundsOn ?? false)
  const [bgAnim, setBgAnimState]     = useState(saved.bgAnim || 'particles')
  const [parallax, setParallaxState] = useState(saved.parallax ?? false)
  const [open, setOpen]              = useState(false)

  // Sync sound engine
  useEffect(() => { sound.setEnabled(soundsOn) }, [soundsOn])

  // Persist
  useEffect(() => {
    saveSettings({ theme, avatarId, soundsOn, bgAnim, parallax })
  }, [theme, avatarId, soundsOn, bgAnim, parallax])

  const setTheme    = (v) => { sound.click(); setThemeState(v) }
  const setAvatarId = (v) => { sound.click(); setAvatarIdState(v) }
  const setSoundsOn = (v) => { setSoundsOnState(v); if (v) setTimeout(() => sound.notify(), 100) }
  const setBgAnim   = (v) => { sound.click(); setBgAnimState(v) }
  const setParallax = (v) => { sound.click(); setParallaxState(v) }
  const openSettings = () => { sound.tap(); setOpen(true) }

  return (
    <SettingsContext.Provider value={{
      theme, themeData: THEMES[theme] || THEMES.dark,
      avatarId, soundsOn, bgAnim, parallax,
      setTheme, setAvatarId, setSoundsOn, setBgAnim, setParallax,
      openSettings,
    }}>
      {children}
      {open && <SettingsModal onClose={() => setOpen(false)} />}
      {parallax && <ParallaxLayer/>}
      {bgAnim !== 'off' && <AnimatedBackground type={bgAnim}/>}
    </SettingsContext.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════════════════════

function SettingsModal({ onClose }) {
  const s = useSettings()

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9998,
      background:'rgba(0,0,0,0.55)', backdropFilter:'blur(10px)',
      WebkitBackdropFilter:'blur(10px)',
      animation:'sFadeIn .25s ease-out',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position:'absolute', left:10, right:10, bottom:10,
        background:'rgba(255,255,255,0.96)',
        border:'2px solid #000', borderRadius:22,
        padding:'22px 18px 24px',
        boxShadow:'6px 6px 0 #ff99cc',
        maxHeight:'90vh', overflowY:'auto',
        animation:'sSlideUp .35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
          <div style={{ fontFamily:'"Permanent Marker",system-ui', fontSize:24, color:'#000', letterSpacing:1 }}>
            НАСТРОЙКИ
          </div>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:'50%',
            background:'#fff', border:'2px solid #000',
            fontSize:18, fontWeight:900, cursor:'pointer',
          }}>×</button>
        </div>

        {/* Тема */}
        <Section title="🎨 ТЕМА">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:8 }}>
            {Object.entries(THEMES).map(([id, t]) => (
              <button key={id} onClick={() => s.setTheme(id)} style={{
                padding:'12px 10px', borderRadius:12,
                background: s.theme === id ? t.bg : '#fff',
                border:`2px solid ${s.theme === id ? t.accent : '#000'}`,
                boxShadow: s.theme === id ? `3px 3px 0 ${t.accent}` : '2px 2px 0 #000',
                cursor:'pointer', textAlign:'left',
                display:'flex', alignItems:'center', gap:8,
                transition:'transform .15s cubic-bezier(0.34,1.56,0.64,1)',
                transform: s.theme === id ? 'translate(2px,2px)' : 'none',
              }}>
                <span style={{ fontSize:24 }}>{t.emoji}</span>
                <div>
                  <div style={{
                    fontFamily:'"Permanent Marker",system-ui', fontSize:14,
                    color: s.theme === id ? t.text : '#000',
                    letterSpacing:1,
                  }}>{t.name}</div>
                  {s.theme === id && (
                    <div style={{ fontSize:9, fontWeight:800, letterSpacing:1.4, color:t.textDim, marginTop:2 }}>
                      ✓ ВЫБРАНО
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* Аватарка */}
        <Section title="👤 ТВОЯ АВАТАРКА">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8 }}>
            {AVATAR_PRESETS.map(a => (
              <button key={a.id} onClick={() => s.setAvatarId(a.id)} style={{
                padding:'8px 4px', borderRadius:10,
                background: s.avatarId === a.id ? '#000' : '#fff',
                border:'2px solid #000',
                boxShadow: s.avatarId === a.id ? 'none' : '2px 2px 0 #000',
                cursor:'pointer',
                display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                transform: s.avatarId === a.id ? 'translate(2px,2px)' : 'none',
                transition:'transform .15s',
              }}>
                <PresetAvatar id={a.id} size={40} ring={s.avatarId === a.id ? '#ff99cc' : '#666'}/>
                <div style={{
                  fontFamily:'"Nunito",system-ui', fontSize:8, fontWeight:900, letterSpacing:0.5,
                  color: s.avatarId === a.id ? '#fff' : '#000',
                }}>{a.name}</div>
              </button>
            ))}
          </div>
        </Section>

        {/* Звуки */}
        <Section title="🔊 ЗВУКИ">
          <Toggle on={s.soundsOn} onChange={s.setSoundsOn} label={s.soundsOn ? 'Включены' : 'Выключены'} hint="Клики, успех, уведомления"/>
        </Section>

        {/* Анимированный фон */}
        <Section title="✨ АНИМИРОВАННЫЙ ФОН">
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {[
              { id:'off',       label:'OFF',       emoji:'⬛' },
              { id:'particles', label:'PARTICLES', emoji:'•' },
              { id:'stars',     label:'STARS',     emoji:'✦' },
              { id:'grid',      label:'GRID',      emoji:'⊞' },
              { id:'sakura',    label:'SAKURA',    emoji:'🌸' },
            ].map(opt => (
              <button key={opt.id} onClick={() => s.setBgAnim(opt.id)} style={{
                flex:'1 1 calc(50% - 4px)', padding:'10px 8px', borderRadius:10,
                background: s.bgAnim === opt.id ? '#000' : '#fff',
                border:'2px solid #000', cursor:'pointer',
                boxShadow: s.bgAnim === opt.id ? 'none' : '2px 2px 0 #000',
                fontFamily:'"Permanent Marker",system-ui', fontSize:11,
                color: s.bgAnim === opt.id ? '#fff' : '#000', letterSpacing:1,
                transform: s.bgAnim === opt.id ? 'translate(2px,2px)' : 'none',
                transition:'transform .15s',
              }}>{opt.emoji} {opt.label}</button>
            ))}
          </div>
        </Section>

        {/* Параллакс */}
        <Section title="🎬 ПАРАЛЛАКС">
          <Toggle on={s.parallax} onChange={s.setParallax} label={s.parallax ? 'Включён' : 'Выключен'} hint="Слои движутся при наклоне (только iOS)"/>
        </Section>
      </div>

      <style>{`
        @keyframes sFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes sSlideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{
        fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:2.5, fontWeight:800,
        color:'#6a6a6a', marginBottom:10,
      }}>{title}</div>
      {children}
    </div>
  )
}

function Toggle({ on, onChange, label, hint }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width:'100%', display:'flex', alignItems:'center', gap:12,
      padding:'12px 14px', borderRadius:12,
      background:'#fff', border:'2px solid #000', cursor:'pointer',
      boxShadow:'2px 2px 0 #000',
      transition:'transform .15s',
    }}
      onMouseDown={e => e.currentTarget.style.transform = 'translate(2px,2px)'}
      onMouseUp={e => e.currentTarget.style.transform = ''}
      onTouchStart={e => e.currentTarget.style.transform = 'translate(2px,2px)'}
      onTouchEnd={e => e.currentTarget.style.transform = ''}
    >
      <div style={{
        width:44, height:24, borderRadius:999,
        background: on ? '#22c55e' : '#d0d0d0',
        border:'2px solid #000',
        position:'relative', flexShrink:0,
        transition:'background .2s',
      }}>
        <div style={{
          position:'absolute', top:1, left: on ? 22 : 2,
          width:16, height:16, borderRadius:'50%',
          background:'#fff', border:'1.5px solid #000',
          transition:'left .25s cubic-bezier(0.34,1.56,0.64,1)',
        }}/>
      </div>
      <div style={{ flex:1, textAlign:'left' }}>
        <div style={{ fontFamily:'"Nunito",system-ui', fontWeight:900, fontSize:13, color:'#000' }}>{label}</div>
        {hint && <div style={{ fontSize:10, fontWeight:700, color:'#6a6a6a', marginTop:2 }}>{hint}</div>}
      </div>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. PRESET AVATARS — 8 голов в одном компоненте
// ═══════════════════════════════════════════════════════════════════════════════

export function PresetAvatar({ id = 0, size = 36, ring = '#666' }) {
  const glow = ring === '#22c55e' ? 'rgba(34,197,94,0.4)' : ring === '#ef4444' ? 'rgba(239,68,68,0.4)' : 'transparent'
  const filterStyle = ring === '#22c55e' || ring === '#ef4444' ? `drop-shadow(0 0 6px ${glow})` : 'none'

  const heads = [
    // 0 - Undercut
    <g key="0">
      <ellipse cx="30" cy="34" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      <path d="M 16 30 Q 14 18 20 12 Q 26 8 30 8 Q 34 8 40 12 Q 46 18 44 30 Q 38 16 30 14 Q 22 16 16 30Z" fill="#1a1a1a" stroke="#000" strokeWidth="1"/>
      <path d="M 22 14 L 20 6 L 24 12 L 26 4 L 28 12 L 30 5 L 32 12 L 34 4 L 36 12 L 40 6 L 38 14" fill="#1a1a1a"/>
    </g>,
    // 1 - Silver
    <g key="1">
      <ellipse cx="30" cy="34" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      <path d="M 14 28 Q 12 14 22 8 Q 30 4 38 8 Q 48 14 46 28 Q 42 16 36 14 L 30 12 L 24 14 Q 18 16 14 28Z" fill="#d8d8e0" stroke="#999" strokeWidth="1"/>
      <circle cx="22" cy="14" r="5" fill="#dedee8" stroke="#aaa" strokeWidth="0.6"/>
      <circle cx="30" cy="9" r="6" fill="#e4e4ec" stroke="#aaa" strokeWidth="0.6"/>
      <circle cx="38" cy="14" r="5" fill="#dedee8" stroke="#aaa" strokeWidth="0.6"/>
    </g>,
    // 2 - Blindfold
    <g key="2">
      <ellipse cx="30" cy="36" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      <path d="M 14 30 L 10 14 L 16 22 L 14 6 L 22 18 L 22 4 L 28 16 L 30 2 L 32 16 L 38 4 L 38 18 L 46 6 L 44 22 L 50 14 L 46 30 Q 40 14 30 13 Q 20 14 14 30Z" fill="#f0f0f0" stroke="#bbb" strokeWidth="1"/>
      <rect x="16" y="33" width="28" height="6" rx="2" fill="#3355cc"/>
      <circle cx="22" cy="36" r="1" fill="#4cc9f0"/>
      <circle cx="30" cy="36" r="1" fill="#4cc9f0"/>
      <circle cx="38" cy="36" r="1" fill="#4cc9f0"/>
    </g>,
    // 3 - Blonde
    <g key="3">
      <ellipse cx="30" cy="34" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      <path d="M 14 28 Q 12 14 22 8 Q 30 4 38 8 Q 48 14 46 28 Q 42 12 36 10 L 30 8 L 24 10 Q 18 12 14 28Z" fill="#e8d050" stroke="#c8a020" strokeWidth="1"/>
      <path d="M 22 12 C 18 22 18 32 20 36 L 18 20 Z" fill="#dcc040"/>
      <path d="M 38 12 C 42 22 42 32 40 36 L 42 20 Z" fill="#dcc040"/>
    </g>,
    // 4 - Dark
    <g key="4">
      <ellipse cx="30" cy="34" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      <path d="M 14 28 Q 12 14 20 8 Q 30 4 40 8 Q 48 14 46 28 Q 42 12 34 10 L 30 6 L 26 10 Q 18 12 14 28Z" fill="#111" stroke="#000" strokeWidth="1"/>
      <path d="M 22 12 L 16 26 L 24 22 Z" fill="#1a1a1a"/>
      <path d="M 30 6 L 26 26 L 32 22 Z" fill="#222"/>
      <path d="M 38 12 L 40 26 L 36 22 Z" fill="#1a1a1a"/>
      <path d="M 28 8 L 28 14" stroke="#4361ee" strokeWidth="1" opacity="0.6"/>
    </g>,
    // 5 - Mohawk
    <g key="5">
      <ellipse cx="30" cy="34" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      <path d="M 18 28 L 22 16 L 18 14 L 22 10 L 16 12 L 22 8 L 26 14 L 30 4 L 34 14 L 38 8 L 44 12 L 38 10 L 42 14 L 38 16 L 42 28Z" fill="#ff3366" stroke="#000" strokeWidth="1.2"/>
      <path d="M 16 30 C 16 36 18 40 22 42" stroke="#2a2a2a" strokeWidth="0.8" fill="none"/>
      <path d="M 44 30 C 44 36 42 40 38 42" stroke="#2a2a2a" strokeWidth="0.8" fill="none"/>
    </g>,
    // 6 - Long
    <g key="6">
      <ellipse cx="30" cy="34" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      <path d="M 12 28 Q 8 50 14 56 L 22 52 Q 18 36 18 28Z" fill="#5a3a20" stroke="#3a2010" strokeWidth="1"/>
      <path d="M 48 28 Q 52 50 46 56 L 38 52 Q 42 36 42 28Z" fill="#5a3a20" stroke="#3a2010" strokeWidth="1"/>
      <path d="M 14 28 Q 12 14 22 8 Q 30 4 38 8 Q 48 14 46 28 Q 40 12 30 10 Q 20 12 14 28Z" fill="#6a4a30" stroke="#3a2010" strokeWidth="1"/>
    </g>,
    // 7 - Sharp
    <g key="7">
      <ellipse cx="30" cy="34" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      <path d="M 14 30 L 18 12 L 20 22 L 24 8 L 26 20 L 30 6 L 32 20 L 34 8 L 38 22 L 40 12 L 46 30 Q 38 16 30 14 Q 22 16 14 30Z" fill="#2a2a2a" stroke="#000" strokeWidth="1"/>
      <path d="M 22 20 L 24 16" stroke="#4361ee" strokeWidth="0.8" opacity="0.5"/>
      <path d="M 30 12 L 30 18" stroke="#4361ee" strokeWidth="0.8" opacity="0.5"/>
    </g>,
  ]

  return (
    <svg viewBox="0 0 60 60" width={size} height={size} style={{ filter: filterStyle }}>
      <circle cx="30" cy="30" r="27" fill="#fff" stroke={ring} strokeWidth="2.5"/>
      {heads[id % heads.length]}
    </svg>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. ANIMATED BACKGROUND (36) — particles / stars / grid / sakura
// ═══════════════════════════════════════════════════════════════════════════════

function AnimatedBackground({ type = 'particles' }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    let raf

    const onResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    // ── Particles ──
    const particles = type === 'particles' || type === 'stars'
      ? Array.from({ length: type === 'stars' ? 80 : 50 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          a: Math.random() * 0.6 + 0.2,
        }))
      : []

    // ── Sakura petals ──
    const petals = type === 'sakura'
      ? Array.from({ length: 20 }, () => ({
          x: Math.random() * w,
          y: Math.random() * h - h,
          vx: -0.3 - Math.random() * 0.3,
          vy: 0.5 + Math.random() * 0.6,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.04,
          size: 6 + Math.random() * 6,
          color: ['#ff99cc','#ffb3d9','#ffc7e0'][Math.floor(Math.random() * 3)],
        }))
      : []

    function drawParticles() {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = type === 'stars' ? `rgba(255,255,255,${p.a})` : `rgba(255,153,204,${p.a * 0.5})`
        ctx.fill()
      }
    }

    function drawSakura() {
      ctx.clearRect(0, 0, w, h)
      for (const p of petals) {
        p.x += p.vx; p.y += p.vy; p.rot += p.rotV
        if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w + 50 }
        if (p.x < -20) p.x = w + 20

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.7
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size * 0.4, p.size * 0.8, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    function drawGrid() {
      ctx.clearRect(0, 0, w, h)
      const time = Date.now() / 1000
      const offset = (time * 20) % 40
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      for (let x = -40 + offset; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = -40 + offset; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }
    }

    function loop() {
      if (type === 'sakura') drawSakura()
      else if (type === 'grid') drawGrid()
      else drawParticles()
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [type])

  return (
    <canvas ref={canvasRef} style={{
      position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity:0.7,
    }}/>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 9. PARALLAX (37) — gyroscope (iOS) или fallback на mouse
// ═══════════════════════════════════════════════════════════════════════════════

function ParallaxLayer() {
  const [tilt, setTilt] = useState({ x:0, y:0 })

  useEffect(() => {
    let unsub = () => {}

    async function setup() {
      // iOS 13+ требует разрешения
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const r = await DeviceOrientationEvent.requestPermission()
          if (r !== 'granted') return
        } catch (_) { return }
      }

      const handler = (e) => {
        const gx = (e.gamma || 0) / 45   // -1..1
        const bx = (e.beta || 0) / 45
        setTilt({ x: Math.max(-1, Math.min(1, gx)), y: Math.max(-1, Math.min(1, bx)) })
      }
      window.addEventListener('deviceorientation', handler)
      unsub = () => window.removeEventListener('deviceorientation', handler)
    }
    setup()

    return () => unsub()
  }, [])

  return (
    <>
      <div style={{
        position:'fixed', inset:'-10%', zIndex:0, pointerEvents:'none',
        transform: `translate(${tilt.x * 8}px, ${tilt.y * 8}px)`,
        transition:'transform .15s ease-out',
        background:'radial-gradient(circle at 30% 20%, rgba(255,153,204,0.08) 0%, transparent 50%)',
      }}/>
      <div style={{
        position:'fixed', inset:'-10%', zIndex:0, pointerEvents:'none',
        transform: `translate(${tilt.x * -16}px, ${tilt.y * -16}px)`,
        transition:'transform .2s ease-out',
        background:'radial-gradient(circle at 70% 70%, rgba(67,97,238,0.08) 0%, transparent 50%)',
      }}/>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// 10. SETTINGS BUTTON (35) — кнопка-шестерёнка для открытия настроек
// ═══════════════════════════════════════════════════════════════════════════════

export function SettingsButton({ style }) {
  const s = useSettings()
  const [hover, setHover] = useState(false)

  return (
    <button onClick={s.openSettings}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width:42, height:42, borderRadius:'50%',
        background:'rgba(255,255,255,0.92)',
        border:'2px solid #000', cursor:'pointer',
        boxShadow: hover ? '4px 4px 0 #ff99cc' : '2px 2px 0 #000',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:20,
        transition:'box-shadow .15s, transform .15s',
        transform: hover ? 'translate(-1px,-1px)' : '',
        ...style,
      }}>⚙️</button>
  )
}
