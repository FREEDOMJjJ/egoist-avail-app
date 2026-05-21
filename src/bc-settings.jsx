// ─── EGOIST · Settings + Premium Sounds + Sakura BG ───────────────────────────
// Минималистичные настройки без тем, без аватарок

import { useState, useEffect, useRef, createContext, useContext } from 'react'

// ═══════════════════════════════════════════════════════════════════════════════
// SOUNDS — премиальные iOS-style звуки через Web Audio API
// ═══════════════════════════════════════════════════════════════════════════════

class SoundEngine {
  constructor() { this.ctx = null; this.enabled = false }
  init() {
    if (this.ctx) return
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)() } catch (_) {}
  }
  setEnabled(v) { this.enabled = !!v; if (v) this.init() }

  // iOS-style "tap" — приглушённый бас с быстрым decay (как нажатие кнопки в iOS)
  tap() {
    if (!this.enabled || !this.ctx) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'; filter.frequency.value = 1200
    osc.type = 'sine'
    osc.frequency.setValueAtTime(180, t)
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.05)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08)
    osc.connect(filter).connect(gain).connect(this.ctx.destination)
    osc.start(t); osc.stop(t + 0.1)
  }

  // iOS-style "success" — мягкая мажорная терция (тон + квинта)
  success() {
    if (!this.enabled || !this.ctx) return
    const t = this.ctx.currentTime
    const notes = [{ f: 587.33, d: 0 }, { f: 880, d: 0.08 }]  // D5, A5
    for (const n of notes) {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = n.f
      gain.gain.setValueAtTime(0.0001, t + n.d)
      gain.gain.exponentialRampToValueAtTime(0.12, t + n.d + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + n.d + 0.35)
      osc.connect(gain).connect(this.ctx.destination)
      osc.start(t + n.d); osc.stop(t + n.d + 0.4)
    }
  }

  // iOS-style "error" — короткое затухающее с приглушённым тоном
  error() {
    if (!this.enabled || !this.ctx) return
    const t = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, t)
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.15)
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.15, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)
    osc.connect(gain).connect(this.ctx.destination)
    osc.start(t); osc.stop(t + 0.25)
  }

  // Простой "click"
  click() { this.tap() }

  // Уведомление
  notify() {
    if (!this.enabled || !this.ctx) return
    const t = this.ctx.currentTime
    const notes = [659.25, 880]  // E5, A5
    notes.forEach((f, i) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'; osc.frequency.value = f
      gain.gain.setValueAtTime(0.0001, t + i * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.12, t + i * 0.08 + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + i * 0.08 + 0.3)
      osc.connect(gain).connect(this.ctx.destination)
      osc.start(t + i * 0.08); osc.stop(t + i * 0.08 + 0.35)
    })
  }
}

export const sound = new SoundEngine()

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════════════════════

const STORAGE_KEY = 'egoist_settings_v2'
function loadSettings() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {} } catch { return {} }
}
function saveSettings(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch (_) {}
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════

const SettingsContext = createContext(null)
export function useSettings() {
  return useContext(SettingsContext) || {
    soundsOn: false, sakuraOn: true,
    setSoundsOn: () => {}, setSakuraOn: () => {},
    openSettings: () => {},
  }
}

export function SettingsProvider({ children }) {
  const saved = loadSettings()
  const [soundsOn, setSoundsOnS] = useState(saved.soundsOn ?? false)
  const [sakuraOn, setSakuraOnS] = useState(saved.sakuraOn ?? true)
  const [open, setOpen]          = useState(false)

  useEffect(() => { sound.setEnabled(soundsOn) }, [soundsOn])
  useEffect(() => { saveSettings({ soundsOn, sakuraOn }) }, [soundsOn, sakuraOn])

  const setSoundsOn = (v) => { setSoundsOnS(v); if (v) setTimeout(() => sound.notify(), 80) }
  const setSakuraOn = (v) => { sound.tap(); setSakuraOnS(v) }
  const openSettings = () => { sound.tap(); setOpen(true) }

  return (
    <SettingsContext.Provider value={{
      soundsOn, sakuraOn,
      setSoundsOn, setSakuraOn, openSettings,
    }}>
      {children}
      {open && <SettingsModal onClose={() => setOpen(false)} />}
      {sakuraOn && <SakuraBackground/>}
    </SettingsContext.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS MODAL — минималистичный, без тем и аватарок
// ═══════════════════════════════════════════════════════════════════════════════

function SettingsModal({ onClose }) {
  const s = useSettings()
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9998,
      background:'rgba(0,0,0,0.55)',
      backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)',
      animation:'sFadeIn .25s ease-out',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        position:'absolute', left:16, right:16, bottom:16,
        background:'rgba(255,255,255,0.96)',
        border:'2px solid #000', borderRadius:22,
        padding:'22px 18px 24px',
        boxShadow:'6px 6px 0 #ff99cc',
        animation:'sSlideUp .35s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ fontFamily:'"Permanent Marker",system-ui', fontSize:24, color:'#000', letterSpacing:1 }}>
            НАСТРОЙКИ
          </div>
          <button onClick={onClose} style={{
            width:32, height:32, borderRadius:'50%',
            background:'#fff', border:'2px solid #000',
            fontSize:18, fontWeight:900, cursor:'pointer',
          }}>×</button>
        </div>

        <Toggle on={s.soundsOn} onChange={s.setSoundsOn} label="🔊 Звуки" hint="Тапы, успех, уведомления"/>
        <div style={{ height:10 }}/>
        <Toggle on={s.sakuraOn} onChange={s.setSakuraOn} label="🌸 Сакура на фоне" hint="Падающие лепестки"/>
      </div>
      <style>{`
        @keyframes sFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes sSlideUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  )
}

function Toggle({ on, onChange, label, hint }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width:'100%', display:'flex', alignItems:'center', gap:12,
      padding:'14px 16px', borderRadius:14,
      background:'#fff', border:'2px solid #000', cursor:'pointer',
      boxShadow:'2px 2px 0 #000', transition:'transform .15s',
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
        <div style={{ fontFamily:'"Nunito",system-ui', fontWeight:900, fontSize:14, color:'#000' }}>{label}</div>
        {hint && <div style={{ fontSize:10, fontWeight:700, color:'#6a6a6a', marginTop:2 }}>{hint}</div>}
      </div>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS ICON — интегрированная кнопка-знак в манга-стиле
// Не круглая шестерёнка, а маленький символ ✦ как часть дизайна
// ═══════════════════════════════════════════════════════════════════════════════

export function SettingsIcon({ style }) {
  const s = useSettings()
  const [hover, setHover] = useState(false)
  return (
    <button onClick={s.openSettings}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        all:'unset', cursor:'pointer',
        width:34, height:34,
        display:'inline-flex', alignItems:'center', justifyContent:'center',
        position:'relative',
        transition:'transform .25s cubic-bezier(0.34,1.56,0.64,1)',
        transform: hover ? 'rotate(60deg)' : 'rotate(0deg)',
        ...style,
      }}>
      <svg viewBox="0 0 32 32" width="28" height="28">
        {/* Манга-стиль шестерёнка — белая обводка чёрная, как все элементы */}
        <g style={{ transformOrigin:'16px 16px' }}>
          <path d="M 16 4 L 18 8 L 22 6 L 23 11 L 28 12 L 26 16 L 28 20 L 23 21 L 22 26 L 18 24 L 16 28 L 14 24 L 10 26 L 9 21 L 4 20 L 6 16 L 4 12 L 9 11 L 10 6 L 14 8 Z"
            fill="#fff" stroke="#000" strokeWidth="2" strokeLinejoin="round"/>
          <circle cx="16" cy="16" r="4.5" fill="#000"/>
          <circle cx="16" cy="16" r="2" fill="#ff99cc"/>
        </g>
      </svg>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAKURA BACKGROUND — мягкие падающие лепестки в манга-стиле
// ═══════════════════════════════════════════════════════════════════════════════

function SakuraBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = canvas.width = window.innerWidth
    let h = canvas.height = window.innerHeight
    let raf

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const petals = Array.from({ length: 22 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h - h * 0.3,
      vx: -0.2 - Math.random() * 0.35,
      vy: 0.4 + Math.random() * 0.5,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.03,
      size: 7 + Math.random() * 7,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.015 + Math.random() * 0.02,
      color: ['#ffb3d9','#ff99cc','#ffc7e0','#ffd1e6'][Math.floor(Math.random() * 4)],
      opacity: 0.55 + Math.random() * 0.3,
    }))

    function drawPetal(p) {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = p.opacity

      // Лепесток сакуры — две дуги формирующие миндалевидную форму
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.moveTo(0, -p.size)
      ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.8, p.size * 0.6, p.size * 0.8, 0, p.size)
      ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.8, -p.size * 0.6, -p.size * 0.8, 0, -p.size)
      ctx.fill()

      // Светлая прожилка по центру
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 0.6
      ctx.beginPath()
      ctx.moveTo(0, -p.size * 0.8)
      ctx.lineTo(0, p.size * 0.8)
      ctx.stroke()
      ctx.restore()
    }

    function loop() {
      ctx.clearRect(0, 0, w, h)
      for (const p of petals) {
        p.wobble += p.wobbleSpeed
        p.x += p.vx + Math.sin(p.wobble) * 0.3
        p.y += p.vy
        p.rot += p.rotV
        if (p.y > h + 30) { p.y = -30; p.x = Math.random() * w + 100 }
        if (p.x < -30) p.x = w + 20
        drawPetal(p)
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position:'fixed', inset:0, zIndex:0, pointerEvents:'none',
    }}/>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIME EYES HERO — глаза + надпись "ВЫ ГОТОВЫ?" / "ГАЗ ЕБАШИТЬСЯ"
// + котик прыгающий внизу
// ═══════════════════════════════════════════════════════════════════════════════

export function AnimeEyesHero({ ready }) {
  // ready: количество готовых игроков сегодня
  const isHype = ready >= 3

  return (
    <div style={{
      position:'relative',
      height: 220,
      borderRadius: 16,
      overflow:'hidden',
      background: 'linear-gradient(180deg, #0a0010 0%, #1a0020 100%)',
      border: '2px solid #000',
      boxShadow: '4px 4px 0 #ff99cc',
      marginBottom: 16,
    }}>
      {/* Decoration grid */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage: 'linear-gradient(rgba(255,153,204,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,153,204,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
      }}/>

      {/* Аниме глаза */}
      <div style={{
        position:'absolute', top:36, left:0, right:0,
        display:'flex', justifyContent:'center', gap:42,
      }}>
        <AnimeEye color={isHype ? '#ff2222' : '#fff'} blood={isHype}/>
        <AnimeEye color={isHype ? '#ff2222' : '#fff'} blood={isHype} flipped/>
      </div>

      {/* Надпись по центру */}
      <div style={{
        position:'absolute', bottom:62, left:0, right:0, textAlign:'center',
      }}>
        {isHype ? (
          <BloodText text="ГАЗ ЕБАШИТЬСЯ"/>
        ) : (
          <div style={{
            fontFamily:'"Permanent Marker",system-ui',
            fontSize:24, letterSpacing:3, color:'#fff',
            textShadow:'0 2px 8px rgba(255,153,204,0.5), 0 0 20px rgba(255,153,204,0.3)',
            animation:'heroPulse 2.5s ease-in-out infinite',
          }}>
            ВЫ ГОТОВЫ?
          </div>
        )}
      </div>

      {/* Котик прыгает внизу */}
      <JumpingCat/>

      <style>{`
        @keyframes heroPulse { 0%,100%{opacity:0.9;transform:scale(1)} 50%{opacity:1;transform:scale(1.03)} }
        @keyframes bloodDrip0 { 0%,100%{height:6px;opacity:0.9} 50%{height:14px;opacity:1} }
        @keyframes bloodDrip1 { 0%,100%{height:4px;opacity:0.8} 50%{height:11px;opacity:1} }
        @keyframes bloodDrip2 { 0%,100%{height:5px;opacity:0.85} 50%{height:13px;opacity:1} }
        @keyframes bloodGlow { 0%,100%{filter:drop-shadow(0 0 4px #ff0000)} 50%{filter:drop-shadow(0 0 12px #ff0000)} }
        @keyframes catJump {
          0%, 100% { transform: translateX(0) translateY(0); }
          25% { transform: translateX(40px) translateY(-30px); }
          50% { transform: translateX(80px) translateY(0); }
          75% { transform: translateX(40px) translateY(-30px); }
        }
        @keyframes catSquish {
          0%, 25%, 50%, 75%, 100% { transform: scaleY(1); }
          12%, 38%, 62%, 88% { transform: scaleY(1.15); }
        }
        @keyframes eyeBlink {
          0%, 92%, 100% { transform: scaleY(1); }
          95%, 97% { transform: scaleY(0.1); }
        }
      `}</style>
    </div>
  )
}

function AnimeEye({ color = '#fff', blood = false, flipped = false }) {
  return (
    <div style={{
      position:'relative',
      width: 70, height: 60,
      transform: flipped ? 'scaleX(-1)' : 'none',
    }}>
      {/* Eye container with blink */}
      <div style={{
        animation:'eyeBlink 4s infinite',
        transformOrigin:'center',
        filter: blood ? 'drop-shadow(0 0 8px rgba(255,0,0,0.6))' : 'drop-shadow(0 0 6px rgba(255,255,255,0.4))',
      }}>
        <svg viewBox="0 0 70 60" width="70" height="60">
          {/* Top eyelid + lashes */}
          <path d="M 4 28 Q 35 4 66 28"
            stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          {/* Lashes */}
          <path d="M 8 24 L 4 18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 18 17 L 16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 30 13 L 30 4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 42 13 L 44 5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          <path d="M 55 18 L 60 11" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          {/* Bottom lid */}
          <path d="M 8 32 Q 35 48 62 32"
            stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          {/* Iris */}
          <ellipse cx="35" cy="30" rx="14" ry="16" fill={color} opacity="0.95"/>
          {/* Pupil */}
          <ellipse cx="35" cy="30" rx="6" ry="14" fill="#000"/>
          {/* Highlight */}
          <ellipse cx="32" cy="22" rx="3" ry="4" fill="#fff" opacity="0.95"/>
          <circle cx="38" cy="35" r="1.5" fill="#fff" opacity="0.5"/>
        </svg>
      </div>
      {/* Blood drips */}
      {blood && (
        <div style={{ position:'absolute', left:0, right:0, top:54 }}>
          {[12, 28, 48].map((x, i) => (
            <div key={i} style={{
              position:'absolute', left:x, top:0,
              width:3, borderRadius:'0 0 50% 50%',
              background:'linear-gradient(180deg, #ff0000 0%, #800000 100%)',
              animation: `bloodDrip${i} ${1.5 + i * 0.3}s ease-in-out infinite, bloodGlow 2s ease-in-out infinite`,
              boxShadow:'0 0 4px rgba(255,0,0,0.8)',
            }}/>
          ))}
        </div>
      )}
    </div>
  )
}

function BloodText({ text }) {
  return (
    <div style={{
      position:'relative',
      fontFamily:'"Permanent Marker",system-ui',
      fontSize:26, letterSpacing:3, fontWeight:'normal',
      color:'#ff2222',
      textShadow:'0 0 12px rgba(255,0,0,0.6), 0 0 24px rgba(255,0,0,0.4), 0 2px 0 #800',
      animation:'heroPulse 1.2s ease-in-out infinite',
      display:'inline-block',
    }}>
      {text}
      {/* Кровь стекает по буквам */}
      <div style={{
        position:'absolute', left:'10%', right:'10%', top:'92%',
        height:0, display:'flex', justifyContent:'space-around',
      }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{
            width:2, borderRadius:'0 0 50% 50%',
            background:'linear-gradient(180deg, #ff0000 0%, #500 100%)',
            animation:`bloodDrip${i % 3} ${1.4 + (i * 0.18)}s ease-in-out infinite`,
            boxShadow:'0 0 4px rgba(255,0,0,0.7)',
          }}/>
        ))}
      </div>
    </div>
  )
}

function JumpingCat() {
  return (
    <div style={{
      position:'absolute', bottom: 8, left: 0,
      animation: 'catJump 3.2s ease-in-out infinite',
    }}>
      <div style={{ animation: 'catSquish 3.2s ease-in-out infinite' }}>
        <svg viewBox="0 0 50 50" width="44" height="44" style={{ display:'block' }}>
          {/* Тело */}
          <ellipse cx="25" cy="32" rx="14" ry="10" fill="#fff" stroke="#000" strokeWidth="1.5"/>
          {/* Голова */}
          <circle cx="25" cy="22" r="10" fill="#fff" stroke="#000" strokeWidth="1.5"/>
          {/* Уши */}
          <path d="M 17 16 L 14 8 L 20 14 Z" fill="#fff" stroke="#000" strokeWidth="1.3"/>
          <path d="M 33 16 L 36 8 L 30 14 Z" fill="#fff" stroke="#000" strokeWidth="1.3"/>
          {/* Уши inner */}
          <path d="M 16 14 L 17 10 L 18 14 Z" fill="#ff99cc"/>
          <path d="M 34 14 L 33 10 L 32 14 Z" fill="#ff99cc"/>
          {/* Глаза — закрытые happy глазки */}
          <path d="M 20 22 Q 22 20 24 22" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M 26 22 Q 28 20 30 22" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          {/* Нос */}
          <path d="M 24 25 L 26 25 L 25 27 Z" fill="#ff99cc"/>
          {/* Рот */}
          <path d="M 25 27 Q 23 29 22 28" stroke="#000" strokeWidth="1" fill="none" strokeLinecap="round"/>
          <path d="M 25 27 Q 27 29 28 28" stroke="#000" strokeWidth="1" fill="none" strokeLinecap="round"/>
          {/* Усы */}
          <line x1="14" y1="24" x2="18" y2="25" stroke="#000" strokeWidth="0.6"/>
          <line x1="14" y1="26" x2="18" y2="26" stroke="#000" strokeWidth="0.6"/>
          <line x1="32" y1="25" x2="36" y2="24" stroke="#000" strokeWidth="0.6"/>
          <line x1="32" y1="26" x2="36" y2="26" stroke="#000" strokeWidth="0.6"/>
          {/* Лапы */}
          <ellipse cx="17" cy="40" rx="3" ry="2" fill="#fff" stroke="#000" strokeWidth="1.2"/>
          <ellipse cx="33" cy="40" rx="3" ry="2" fill="#fff" stroke="#000" strokeWidth="1.2"/>
          {/* Хвост */}
          <path d="M 38 32 Q 46 28 44 20" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M 38 32 Q 46 28 44 20" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9"/>
          <path d="M 38 32 Q 46 28 44 20" stroke="#000" strokeWidth="1" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  )
}
