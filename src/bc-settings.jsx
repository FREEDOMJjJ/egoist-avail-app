// EGOIST · Settings + Theme + Effects (Sakura/Rain/Waves) + AnimeAvatars
import { useState, useEffect, useRef, createContext, useContext } from 'react'

const SK = 'egoist_s_v4'
const load = () => { try { return JSON.parse(localStorage.getItem(SK)) || {} } catch { return {} } }
const save = s => { try { localStorage.setItem(SK, JSON.stringify(s)) } catch (_) {} }

const THEMES = {
  dark: {
    '--bg': '#000000', '--bg-soft': '#0a0a0a',
    '--text': '#f5f3ee', '--text-dim': 'rgba(245,243,238,0.55)', '--text-faint': 'rgba(245,243,238,0.32)',
    '--card': 'rgba(255,255,255,0.04)', '--card-border': 'rgba(255,255,255,0.1)',
    '--fx': '255,255,255', '--grid-line': 'rgba(255,255,255,0.03)',
  },
  light: {
    '--bg': '#f0ece3', '--bg-soft': '#f7f4ed',
    '--text': '#1a1a1a', '--text-dim': 'rgba(26,26,26,0.6)', '--text-faint': 'rgba(26,26,26,0.38)',
    '--card': 'rgba(0,0,0,0.03)', '--card-border': 'rgba(0,0,0,0.12)',
    '--fx': '60,60,60', '--grid-line': 'rgba(0,0,0,0.04)',
  },
}

function applyTheme(name) {
  const t = THEMES[name] || THEMES.dark
  const root = document.documentElement
  for (const k in t) root.style.setProperty(k, t[k])
  try {
    document.body.style.background = t['--bg']
    const tg = window.Telegram?.WebApp
    tg?.setBackgroundColor?.(name === 'light' ? '#f0ece3' : '#0a0a0a')
    tg?.setHeaderColor?.(name === 'light' ? '#f0ece3' : '#0a0a0a')
  } catch (_) {}
}

const Ctx = createContext(null)
export const useSettings = () => useContext(Ctx) || { effect: 'sakura', theme: 'dark', openSettings: () => {} }

export function SettingsProvider({ children }) {
  const s0 = load()
  const initialEffect = s0.effect ?? (s0.sakuraOn === false ? 'none' : 'sakura')
  const [effect, setEffectS] = useState(initialEffect)
  const [theme, setThemeS]   = useState(s0.theme ?? 'dark')
  const [open, setOpen]      = useState(false)

  useEffect(() => { save({ effect, theme }) }, [effect, theme])
  useEffect(() => { applyTheme(theme) }, [theme])

  return (
    <Ctx.Provider value={{ effect, setEffect: setEffectS, theme, setTheme: setThemeS, openSettings: () => setOpen(true) }}>
      {children}
      {open && <SettingsModal onClose={() => setOpen(false)} />}
      {effect === 'sakura' && <SakuraBackground />}
      {effect === 'rain'   && <RainBackground />}
      {effect === 'waves'  && <WavesBackground />}
    </Ctx.Provider>
  )
}

const EFFECT_OPTIONS = [
  { id: 'sakura', label: '🌸 Сакура',  hint: 'Падающие лепестки' },
  { id: 'rain',   label: '🌧 Дождь',    hint: 'Линии дождя, манга-стиль' },
  { id: 'waves',  label: '📡 Волны',    hint: 'Радар-пульсы' },
  { id: 'none',   label: '⊘ Выключить', hint: 'Чистый фон' },
]

function SettingsModal({ onClose }) {
  const s = useSettings()
  const isLight = s.theme === 'light'
  const panelBg = isLight ? 'rgba(255,255,255,0.98)' : 'rgba(20,20,20,0.97)'
  const panelText = isLight ? '#000' : '#fff'

  return (
    <div style={{ position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,0.55)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)' }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{
        position:'absolute',left:16,right:16,bottom:16,
        background:panelBg, border:`2px solid ${isLight ? '#000' : '#fff'}`,
        borderRadius:22, padding:'22px 18px 24px', boxShadow:'6px 6px 0 #ff99cc',
        maxHeight:'85vh', overflowY:'auto',
      }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
          <div style={{ fontFamily:'"Permanent Marker",system-ui',fontSize:24,color:panelText,letterSpacing:1 }}>НАСТРОЙКИ</div>
          <button onClick={onClose} style={{ width:34,height:34,borderRadius:'50%',background:'#000',border:'2px solid #000',display:'grid',placeItems:'center',cursor:'pointer',fontSize:18,fontWeight:900,color:'#fff',lineHeight:1 }}>×</button>
        </div>

        <div style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:2.5, fontWeight:800, color:isLight?'#6a6a6a':'rgba(255,255,255,0.4)', marginBottom:10 }}>ТЕМА</div>
        <div style={{ display:'flex', gap:8, marginBottom:22 }}>
          <ThemeBtn active={s.theme==='dark'}  onClick={() => s.setTheme('dark')}  label="🌙 Тёмная" isLight={isLight}/>
          <ThemeBtn active={s.theme==='light'} onClick={() => s.setTheme('light')} label="☀️ Светлая" isLight={isLight}/>
        </div>

        <div style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:2.5, fontWeight:800, color:isLight?'#6a6a6a':'rgba(255,255,255,0.4)', marginBottom:10 }}>ФОНОВЫЙ ЭФФЕКТ</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {EFFECT_OPTIONS.map(opt => (
            <EffectRow key={opt.id} active={s.effect === opt.id} onClick={() => s.setEffect(opt.id)} label={opt.label} hint={opt.hint} isLight={isLight}/>
          ))}
        </div>
      </div>
    </div>
  )
}

function ThemeBtn({ active, onClick, label, isLight }) {
  return (
    <button onClick={onClick} style={{
      flex:1, padding:'14px 8px', borderRadius:14, cursor:'pointer',
      background: active ? '#ff99cc' : (isLight ? '#fff' : 'rgba(255,255,255,0.06)'),
      border:`2px solid ${isLight ? '#000' : (active ? '#ff99cc' : 'rgba(255,255,255,0.2)')}`,
      boxShadow: active ? '2px 2px 0 #000' : 'none',
      fontFamily:'"Permanent Marker",system-ui', fontSize:14, letterSpacing:1,
      color: active ? '#000' : (isLight ? '#000' : '#fff'), transition:'all 180ms',
    }}>{label}</button>
  )
}

function EffectRow({ active, onClick, label, hint, isLight }) {
  return (
    <button onClick={onClick} style={{
      width:'100%', display:'flex', alignItems:'center', gap:12, padding:'13px 16px',
      borderRadius:14, cursor:'pointer',
      background: active ? '#ff99cc' : (isLight ? '#fff' : 'rgba(255,255,255,0.06)'),
      border:`2px solid ${isLight ? '#000' : (active ? '#ff99cc' : 'rgba(255,255,255,0.2)')}`,
      boxShadow: active ? '2px 2px 0 #000' : 'none', transition:'all 180ms',
    }}>
      <div style={{
        width:18, height:18, borderRadius:'50%', flexShrink:0,
        border:`2px solid ${active ? '#000' : (isLight ? '#000' : 'rgba(255,255,255,0.4)')}`,
        background: active ? '#000' : 'transparent', display:'grid', placeItems:'center',
      }}>
        {active && <div style={{ width:7, height:7, borderRadius:'50%', background:'#ff99cc' }}/>}
      </div>
      <div style={{ flex:1, textAlign:'left' }}>
        <div style={{ fontFamily:'"Nunito",system-ui', fontWeight:900, fontSize:14, color: active ? '#000' : (isLight ? '#000' : '#fff') }}>{label}</div>
        <div style={{ fontSize:10, fontWeight:700, color: active ? 'rgba(0,0,0,0.6)' : (isLight ? '#6a6a6a' : 'rgba(255,255,255,0.4)'), marginTop:2 }}>{hint}</div>
      </div>
    </button>
  )
}

export function SettingsIcon({ style }) {
  const s = useSettings()
  const [rot, setRot] = useState(0)
  return (
    <button onClick={() => { setRot(r => r + 180); s.openSettings() }} style={{
      all:'unset', cursor:'pointer', width:44, height:44, borderRadius:'50%',
      background:'#fff', border:'2.5px solid #000', boxShadow:'3px 3px 0 #ff99cc',
      display:'inline-flex', alignItems:'center', justifyContent:'center', ...style,
    }}>
      <svg viewBox="0 0 32 32" width="26" height="26" style={{
        transformOrigin:'16px 16px', transform:`rotate(${rot}deg)`,
        transition:'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <path d="M16 3 L19 8 L24.5 6.5 L25 12.5 L30.5 14 L27.5 19 L30 24.5 L24 25 L22 30.5 L16 28 L10 30.5 L8 25 L2 24.5 L4.5 19 L1.5 14 L7 12.5 L7.5 6.5 L13 8 Z" fill="#000"/>
        <circle cx="16" cy="16" r="5.5" fill="#fff"/>
        <circle cx="16" cy="16" r="2.5" fill="#ff99cc"/>
      </svg>
    </button>
  )
}

function SakuraBackground() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    let w = c.width = window.innerWidth, h = c.height = window.innerHeight, raf
    const onResize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    function drawPetal(p) {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.globalAlpha = p.alpha
      const g = ctx.createRadialGradient(-p.w*0.15, -p.h*0.2, 0, 0, 0, Math.max(p.w, p.h))
      g.addColorStop(0, p.light); g.addColorStop(0.55, p.color); g.addColorStop(1, p.dark)
      ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, p.h*0.9)
      ctx.bezierCurveTo(-p.w*1.1, p.h*0.4, -p.w*1.1, -p.h*0.3, 0, -p.h)
      ctx.bezierCurveTo(p.w*1.1, -p.h*0.3, p.w*1.1, p.h*0.4, 0, p.h*0.9)
      ctx.closePath(); ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 0.5; ctx.stroke()
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 0.7
      ctx.beginPath(); ctx.moveTo(0, p.h*0.75); ctx.bezierCurveTo(0, p.h*0.2, 0, -p.h*0.4, 0, -p.h*0.85); ctx.stroke()
      ctx.restore()
    }
    const PALETTES = [
      { color:'#ffb3cf', light:'#ffe5ef', dark:'#f590b0' },
      { color:'#ffc0d8', light:'#ffedf4', dark:'#f8a0c0' },
      { color:'#ffd0e4', light:'#fff5f8', dark:'#f5b0cc' },
      { color:'#f9a8c4', light:'#fde0ec', dark:'#e880a0' },
    ]
    const petals = Array.from({ length: 26 }, () => {
      const pl = PALETTES[Math.floor(Math.random()*PALETTES.length)]
      const size = 9 + Math.random()*13
      return { x: Math.random()*w, y: Math.random()*h - h*0.5, w: size*0.44, h: size*0.56,
        vx: -0.18-Math.random()*0.28, vy: 0.48+Math.random()*0.52, rot: Math.random()*Math.PI*2,
        rotV: (Math.random()-0.5)*0.018, wobble: Math.random()*Math.PI*2, wobbleA: 0.22+Math.random()*0.28,
        wobbleS: 0.006+Math.random()*0.009, alpha: 0.52+Math.random()*0.28, ...pl }
    })
    function loop() {
      ctx.clearRect(0,0,w,h)
      for (const p of petals) {
        p.wobble += p.wobbleS
        p.x += p.vx + Math.sin(p.wobble)*p.wobbleA
        p.y += p.vy + Math.cos(p.wobble*0.55)*0.1
        p.rot += p.rotV
        if (p.y > h+30) { p.y = -30; p.x = Math.random()*w + 60 }
        if (p.x < -30)  { p.x = w + 20 }
        drawPetal(p)
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={ref} style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none' }}/>
}

function RainBackground() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    let w = c.width = window.innerWidth, h = c.height = window.innerHeight, raf
    const onResize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight }
    window.addEventListener('resize', onResize)
    const fxRGB = () => (getComputedStyle(document.documentElement).getPropertyValue('--fx').trim() || '255,255,255')
    const ANGLE = 0.28, dx = Math.sin(ANGLE), dy = Math.cos(ANGLE)
    const drops = Array.from({ length: 90 }, () => {
      const pink = Math.random() < 0.12
      return { x: Math.random()*(w+200)-100, y: Math.random()*h, len: 14+Math.random()*26,
        speed: 6+Math.random()*9, alpha: 0.06+Math.random()*0.16, pink, width: pink ? 1.1 : 0.6+Math.random()*0.5 }
    })
    function loop() {
      ctx.clearRect(0,0,w,h)
      const rgb = fxRGB()
      for (const d of drops) {
        d.x += dx*d.speed; d.y += dy*d.speed
        if (d.y > h+30) { d.y = -30; d.x = Math.random()*(w+200)-100 }
        if (d.x > w+50) { d.x = -50 }
        ctx.beginPath()
        ctx.strokeStyle = d.pink ? `rgba(255,153,204,${d.alpha+0.06})` : `rgba(${rgb},${d.alpha})`
        ctx.lineWidth = d.width; ctx.lineCap = 'round'
        ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - dx*d.len, d.y - dy*d.len); ctx.stroke()
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={ref} style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none' }}/>
}

function WavesBackground() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    let w = c.width = window.innerWidth, h = c.height = window.innerHeight, raf
    const onResize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; sources = makeSources() }
    const fxRGB = () => (getComputedStyle(document.documentElement).getPropertyValue('--fx').trim() || '255,255,255')
    function makeSources() {
      return [
        { x: w*0.22, y: h*0.28, pink: false },
        { x: w*0.78, y: h*0.55, pink: true  },
        { x: w*0.45, y: h*0.82, pink: false },
      ]
    }
    let sources = makeSources()
    const MAX_R = Math.max(w, h)*0.42, SPEED = 0.35, RING_GAP = MAX_R/3
    let phase = 0
    window.addEventListener('resize', onResize)
    function loop() {
      ctx.clearRect(0,0,w,h)
      const rgb = fxRGB()
      phase = (phase + SPEED) % RING_GAP
      for (const src of sources) {
        for (let i = 0; i < 3; i++) {
          const r = phase + i*RING_GAP
          if (r < 2 || r > MAX_R) continue
          const fade = 1 - (r/MAX_R), alpha = fade*0.22
          ctx.beginPath(); ctx.arc(src.x, src.y, r, 0, Math.PI*2)
          ctx.strokeStyle = src.pink ? `rgba(255,153,204,${alpha+0.05})` : `rgba(${rgb},${alpha})`
          ctx.lineWidth = src.pink ? 1.4 : 1; ctx.stroke()
        }
        ctx.beginPath(); ctx.arc(src.x, src.y, 2, 0, Math.PI*2)
        ctx.fillStyle = src.pink ? 'rgba(255,153,204,0.5)' : `rgba(${rgb},0.35)`; ctx.fill()
      }
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={ref} style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none' }}/>
}

export function AnimeEyesHero({ ready }) {
  const isHype = ready >= 3
  return (
    <div style={{
      position: 'relative', borderRadius: 16, overflow: 'hidden', border: '2px solid #000',
      boxShadow: isHype ? '4px 4px 0 #000' : '4px 4px 0 #ff99cc', marginBottom: 16, background: '#fff',
    }}>
      <div style={{ height: 140, position: 'relative', overflow: 'hidden', background: '#000' }}>
        <img src="/giphy.gif" alt="" onError={e => { e.currentTarget.style.display = 'none' }}
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}/>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.98) 100%)' }}/>
      </div>
      <div style={{ background: '#fff', padding: '10px 14px 12px', position: 'relative' }}>
        <div style={{ position:'absolute', top:0, right:0, width:80, height:80, pointerEvents:'none',
          backgroundImage:'radial-gradient(rgba(67,97,238,0.2) 0.6px,transparent 1px)', backgroundSize:'5px 5px',
          maskImage:'radial-gradient(60% 60% at 100% 0%,#000,transparent)',
          WebkitMaskImage:'radial-gradient(60% 60% at 100% 0%,#000,transparent)' }}/>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          <div>
            <div style={{ fontFamily:'"Permanent Marker",system-ui', fontSize: isHype ? 22 : 20, letterSpacing: 2,
              color:'#000', lineHeight: 1.1, animation: isHype ? 'heroHype 1s ease-in-out infinite' : 'heroFloat 3s ease-in-out infinite' }}>
              {isHype ? 'ПОГНАЛИ' : 'ВЫ ГОТОВЫ?'}
            </div>
            <div style={{ fontFamily:'"Nunito",system-ui', fontWeight:800, fontSize:10, letterSpacing:2, color:'#6a6a6a', marginTop:4 }}>
              {isHype ? `ГАЗ · ЕБАШИТЬСЯ · ${ready}/5 В ДЕЛЕ` : 'EGOIST · CS2 · 5v5'}
            </div>
          </div>
          <div style={{ flexShrink:0, textAlign:'right' }}>
            <div style={{ fontFamily:'"Permanent Marker",system-ui', fontSize:28, lineHeight:1, color:'#000', letterSpacing:-1 }}>
              {ready}<span style={{ fontSize:16, color:'#9a9a9a' }}>/5</span></div>
            <div style={{ display:'flex', gap:3, marginTop:5, justifyContent:'flex-end' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ width:12, height:4, borderRadius:999,
                  background: i < ready ? (isHype ? '#000' : '#ff99cc') : 'rgba(0,0,0,0.1)',
                  border: '1px solid rgba(0,0,0,0.15)', transition:`background ${200+i*60}ms ease` }}/>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes heroHype  { 0%,100%{transform:scale(1)}   50%{transform:scale(1.03)} }
        @keyframes heroFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
      `}</style>
    </div>
  )
}

export function AnimeAvatar({ playerIndex = 0, status = 'pending', size = 36, name = '' }) {
  const letter = (name || '?').charAt(0).toUpperCase()
  const fs = Math.round(size * 0.42)
  const bg = status === 'pending' ? '#f5f5f5' : '#fff'
  const border = status === 'can' ? '#22c55e' : status === 'cant' ? '#ef4444' : 'rgba(0,0,0,0.25)'
  const shadow = status === 'can' ? '0 0 0 2px #22c55e, 0 0 8px rgba(34,197,94,0.4)'
               : status === 'cant' ? '0 0 0 2px #ef4444, 0 0 8px rgba(239,68,68,0.4)' : '0 0 0 1.5px rgba(0,0,0,0.2)'
  const textColor = status === 'can' ? '#22c55e' : status === 'cant' ? '#ef4444' : '#9a9a9a'
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: bg, border: `2px solid ${border}`,
      boxShadow: shadow, flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      {status === 'can' && (
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(34,197,94,0.25) 0.6px, transparent 1px)', backgroundSize: '4px 4px',
          maskImage: 'radial-gradient(60% 60% at 100% 0%, #000, transparent)',
          WebkitMaskImage: 'radial-gradient(60% 60% at 100% 0%, #000, transparent)' }}/>
      )}
      <span style={{ fontFamily: '"Permanent Marker", system-ui', fontSize: fs, color: textColor,
        lineHeight: 1, userSelect: 'none', position: 'relative', zIndex: 1 }}>{letter}</span>
    </div>
  )
}
