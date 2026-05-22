// ─── EGOIST · Settings + Sakura + AnimeEyes + AnimeAvatars ───────────────────
import { useState, useEffect, useRef, createContext, useContext } from 'react'

// ═══════════════════════════════════════════════════════════════════════════════
// STORAGE
// ═══════════════════════════════════════════════════════════════════════════════
const SK = 'egoist_s_v3'
const load = () => { try { return JSON.parse(localStorage.getItem(SK)) || {} } catch { return {} } }
const save = s => { try { localStorage.setItem(SK, JSON.stringify(s)) } catch (_) {} }

// ═══════════════════════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════════════════════
const Ctx = createContext(null)
export const useSettings = () => useContext(Ctx) || { sakuraOn: true, openSettings: () => {} }

export function SettingsProvider({ children }) {
  const s0 = load()
  const [sakuraOn, setSakuraOnS] = useState(s0.sakuraOn ?? true)
  const [open, setOpen] = useState(false)

  useEffect(() => { save({ sakuraOn }) }, [sakuraOn])

  const setSakuraOn  = v => setSakuraOnS(v)
  const openSettings = () => setOpen(true)

  return (
    <Ctx.Provider value={{ sakuraOn, setSakuraOn, openSettings }}>
      {children}
      {open && <SettingsModal onClose={() => setOpen(false)} />}
      {sakuraOn && <SakuraBackground />}
    </Ctx.Provider>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════════════════════
function SettingsModal({ onClose }) {
  const s = useSettings()
  return (
    <div style={{ position:'fixed',inset:0,zIndex:9998,background:'rgba(0,0,0,0.55)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)' }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{ position:'absolute',left:16,right:16,bottom:16,background:'rgba(255,255,255,0.96)',border:'2px solid #000',borderRadius:22,padding:'22px 18px 24px',boxShadow:'6px 6px 0 #ff99cc' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20 }}>
          <div style={{ fontFamily:'"Permanent Marker",system-ui',fontSize:24,color:'#000',letterSpacing:1 }}>НАСТРОЙКИ</div>
          <button onClick={onClose} style={{ width:34,height:34,borderRadius:'50%',background:'#000',border:'2px solid #000',display:'grid',placeItems:'center',cursor:'pointer',fontSize:18,fontWeight:900,color:'#fff',lineHeight:1 }}>×</button>
        </div>
        <Toggle on={s.sakuraOn} onChange={s.setSakuraOn} label="🌸 Сакура" hint="Падающие лепестки на фоне"/>
      </div>
    </div>
  )
}

function Toggle({ on, onChange, label, hint }) {
  return (
    <button onClick={() => onChange(!on)} style={{ width:'100%',display:'flex',alignItems:'center',gap:12,padding:'14px 16px',borderRadius:14,background:'#fff',border:'2px solid #000',cursor:'pointer',boxShadow:'2px 2px 0 #000' }}>
      <div style={{ width:44,height:24,borderRadius:999,background:on?'#22c55e':'#d0d0d0',border:'2px solid #000',position:'relative',flexShrink:0,transition:'background .2s' }}>
        <div style={{ position:'absolute',top:1,left:on?22:2,width:16,height:16,borderRadius:'50%',background:'#fff',border:'1.5px solid #000',transition:'left .25s cubic-bezier(0.34,1.56,0.64,1)' }}/>
      </div>
      <div style={{ flex:1,textAlign:'left' }}>
        <div style={{ fontFamily:'"Nunito",system-ui',fontWeight:900,fontSize:14,color:'#000' }}>{label}</div>
        {hint && <div style={{ fontSize:10,fontWeight:700,color:'#6a6a6a',marginTop:2 }}>{hint}</div>}
      </div>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS ICON — вписана в дизайн
// ═══════════════════════════════════════════════════════════════════════════════
export function SettingsIcon({ style }) {
  const s = useSettings()
  const [rot, setRot] = useState(0)
  return (
    <button
      onClick={() => { setRot(r => r + 90); s.openSettings() }}
      style={{ all:'unset',cursor:'pointer',width:34,height:34,display:'inline-flex',alignItems:'center',justifyContent:'center',...style }}
    >
      <svg viewBox="0 0 32 32" width="28" height="28">
        <path d="M16 4 L18 8 L22 6 L23 11 L28 12 L26 16 L28 20 L23 21 L22 26 L18 24 L16 28 L14 24 L10 26 L9 21 L4 20 L6 16 L4 12 L9 11 L10 6 L14 8 Z"
          fill="#fff" stroke="#000" strokeWidth="2" strokeLinejoin="round"
          style={{ transformOrigin:'16px 16px', transform:`rotate(${rot}deg)`, transition:'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        <circle cx="16" cy="16" r="4.5" fill="#000"/>
        <circle cx="16" cy="16" r="2" fill="#ff99cc"/>
      </svg>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAKURA — реалистичные лепестки как в видео
// ═══════════════════════════════════════════════════════════════════════════════
function SakuraBackground() {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current; if (!c) return
    const ctx = c.getContext('2d')
    let w = c.width  = window.innerWidth
    let h = c.height = window.innerHeight
    let raf
    const onResize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    // Форма реального лепестка сакуры:
    // широкий округлый верх, слегка сужается к основанию с выемкой
    function drawPetal(p) {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.globalAlpha = p.alpha

      // Радиальный градиент — светлее в центре, темнее по краям
      const g = ctx.createRadialGradient(-p.w * 0.15, -p.h * 0.2, 0, 0, 0, Math.max(p.w, p.h))
      g.addColorStop(0,   p.light)
      g.addColorStop(0.55, p.color)
      g.addColorStop(1,   p.dark)
      ctx.fillStyle = g

      // Лепесток: широкий округлый, как у сакуры
      ctx.beginPath()
      ctx.moveTo(0, p.h * 0.9)
      // левая сторона
      ctx.bezierCurveTo(
        -p.w * 1.1,  p.h * 0.4,
        -p.w * 1.1, -p.h * 0.3,
         0,          -p.h
      )
      // правая сторона
      ctx.bezierCurveTo(
         p.w * 1.1, -p.h * 0.3,
         p.w * 1.1,  p.h * 0.4,
         0,           p.h * 0.9
      )
      ctx.closePath()
      ctx.fill()

      // Тихая обводка для чёткости
      ctx.strokeStyle = `rgba(255,255,255,0.18)`
      ctx.lineWidth   = 0.5
      ctx.stroke()

      // Центральная прожилка
      ctx.strokeStyle = `rgba(255,255,255,0.3)`
      ctx.lineWidth   = 0.7
      ctx.beginPath()
      ctx.moveTo(0,  p.h * 0.75)
      ctx.bezierCurveTo(0, p.h * 0.2, 0, -p.h * 0.4, 0, -p.h * 0.85)
      ctx.stroke()

      // Боковые прожилки (2 штуки)
      ctx.strokeStyle = `rgba(255,255,255,0.15)`
      ctx.lineWidth   = 0.5
      ;[[-0.4, 0.3], [0.4, 0.3]].forEach(([dx, dy]) => {
        ctx.beginPath()
        ctx.moveTo(0, p.h * 0.2)
        ctx.bezierCurveTo(
          p.w * dx * 0.6,  -p.h * 0.1,
          p.w * dx * 1.0,  -p.h * dy,
          p.w * dx * 0.8,  -p.h * 0.8
        )
        ctx.stroke()
      })

      ctx.restore()
    }

    const PALETTES = [
      { color:'#ffb3cf', light:'#ffe5ef', dark:'#f590b0' },
      { color:'#ffc0d8', light:'#ffedf4', dark:'#f8a0c0' },
      { color:'#ffd0e4', light:'#fff5f8', dark:'#f5b0cc' },
      { color:'#f9a8c4', light:'#fde0ec', dark:'#e880a0' },
    ]

    const petals = Array.from({ length: 26 }, () => {
      const pl   = PALETTES[Math.floor(Math.random() * PALETTES.length)]
      const size = 9 + Math.random() * 13
      return {
        x:       Math.random() * w,
        y:       Math.random() * h - h * 0.5,
        w:       size * 0.44,
        h:       size * 0.56,
        vx:      -0.18 - Math.random() * 0.28,
        vy:       0.48 + Math.random() * 0.52,
        rot:     Math.random() * Math.PI * 2,
        rotV:    (Math.random() - 0.5) * 0.018,
        wobble:  Math.random() * Math.PI * 2,
        wobbleA: 0.22 + Math.random() * 0.28,
        wobbleS: 0.006 + Math.random() * 0.009,
        alpha:   0.52 + Math.random() * 0.28,
        ...pl,
      }
    })

    function loop() {
      ctx.clearRect(0, 0, w, h)
      for (const p of petals) {
        p.wobble += p.wobbleS
        p.x += p.vx + Math.sin(p.wobble) * p.wobbleA
        p.y += p.vy + Math.cos(p.wobble * 0.55) * 0.1
        p.rot += p.rotV
        if (p.y > h + 30) { p.y = -30; p.x = Math.random() * w + 60 }
        if (p.x < -30)    { p.x = w + 20 }
        drawPetal(p)
      }
      raf = requestAnimationFrame(loop)
    }
    loop()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])
  return <canvas ref={ref} style={{ position:'fixed',inset:0,zIndex:0,pointerEvents:'none' }}/>
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIME EYES — Solo Leveling / Hunter x Hunter стиль
// Узкие прищуренные с ярким неоновым свечением
// ═══════════════════════════════════════════════════════════════════════════════
export function AnimeEyesHero({ ready }) {
  const isHype = ready >= 3
  const pct = Math.round((ready / 5) * 100)

  return (
    <div style={{
      position: 'relative',
      borderRadius: 16,
      overflow: 'hidden',
      border: isHype ? '2px solid #000' : '2px solid #000',
      boxShadow: isHype ? '4px 4px 0 #000' : '4px 4px 0 #ff99cc',
      marginBottom: 16,
      background: '#fff',
    }}>
      {/* Гифка / CSS фоллбек */}
      <div style={{
        height: 140,
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0010 0%, #1a0030 50%, #0a0010 100%)',
      }}>
        {/* Гифка — показывается когда файл есть в public/ */}
        <img
          src="/giphy.gif"
          alt=""
          onError={e => { e.currentTarget.style.display = 'none' }}
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            display: 'block',
          }}
        />
        {/* CSS фон пока нет гифки */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(100,0,180,0.4) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 70% 60%, rgba(180,0,80,0.3) 0%, transparent 60%)',
          animation: 'heroBgPulse 4s ease-in-out infinite',
        }}/>
        {/* Сетка */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.08,
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}/>
        {/* Градиент снизу */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.95) 100%)',
        }}/>
        <style>{`@keyframes heroBgPulse { 0%,100%{opacity:0.7} 50%{opacity:1} }`}</style>
      </div>

      {/* Нижняя панель — белая как карточки */}
      <div style={{
        background: '#fff',
        padding: '10px 14px 12px',
        position: 'relative',
      }}>
        {/* Halftone уголок */}
        <div style={{
          position:'absolute', top:0, right:0, width:80, height:80, pointerEvents:'none',
          backgroundImage:'radial-gradient(rgba(67,97,238,0.2) 0.6px,transparent 1px)',
          backgroundSize:'5px 5px',
          maskImage:'radial-gradient(60% 60% at 100% 0%,#000,transparent)',
          WebkitMaskImage:'radial-gradient(60% 60% at 100% 0%,#000,transparent)',
        }}/>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
          {/* Текст */}
          <div>
            <div style={{
              fontFamily:'"Permanent Marker",system-ui',
              fontSize: isHype ? 22 : 20,
              letterSpacing: 2,
              color: isHype ? '#000' : '#000',
              lineHeight: 1.1,
              animation: isHype ? 'heroHype 1s ease-in-out infinite' : 'heroFloat 3s ease-in-out infinite',
            }}>
              {isHype ? 'ПОГНАЛИ' : 'ВЫ ГОТОВЫ?'}
            </div>
            <div style={{
              fontFamily:'"Nunito",system-ui', fontWeight:800,
              fontSize:10, letterSpacing:2, color:'#6a6a6a',
              marginTop:4,
            }}>
              {isHype ? `ГАЗ · ЕБАШИТЬСЯ · ${ready}/5 В ДЕЛЕ` : 'EGOIST · CS2 · 5v5'}
            </div>
          </div>

          {/* Мини прогресс */}
          <div style={{ flexShrink:0, textAlign:'right' }}>
            <div style={{
              fontFamily:'"Permanent Marker",system-ui',
              fontSize:28, lineHeight:1, color:'#000', letterSpacing:-1,
            }}>{ready}<span style={{ fontSize:16, color:'#9a9a9a' }}>/5</span></div>
            <div style={{
              display:'flex', gap:3, marginTop:5, justifyContent:'flex-end',
            }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{
                  width:12, height:4, borderRadius:999,
                  background: i < ready
                    ? (isHype ? '#000' : '#ff99cc')
                    : 'rgba(0,0,0,0.1)',
                  border: '1px solid rgba(0,0,0,0.15)',
                  transition:`background ${200+i*60}ms ease`,
                }}/>
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

// ═══════════════════════════════════════════════════════════════════════════════
// ANIME AVATARS — 8 уникальных нарисованных аниме-персонажей
// Стиль Hunter x Hunter / Solo Leveling — с лицами, без фигур
// ═══════════════════════════════════════════════════════════════════════════════




const ANIME_CHARS = [
  // 0 — Solo Leveling style: тёмные волосы, синие глаза, шрам
  ({ size }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <defs>
        <radialGradient id="f0" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#fde8c8"/><stop offset="100%" stopColor="#f0c090"/>
        </radialGradient>
      </defs>
      {/* Волосы задние */}
      <path d="M 10 32 Q 8 15 18 8 Q 30 2 42 8 Q 52 15 50 32 Q 46 12 30 10 Q 14 12 10 32Z" fill="#111" stroke="#000" strokeWidth="1"/>
      {/* Лицо */}
      <path d="M 16 32 C 14 22 18 12 30 10 C 42 12 46 22 44 32 C 44 44 40 52 30 54 C 20 52 16 44 16 32Z" fill="url(#f0)" stroke="#d4956a" strokeWidth="1"/>
      {/* Волосы передние пряди */}
      <path d="M 18 10 L 14 26 L 20 22 Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
      <path d="M 24 8  L 20 24 L 27 20 Z" fill="#222"    stroke="#000" strokeWidth="0.8"/>
      <path d="M 36 8  L 40 24 L 33 20 Z" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
      {/* Брови */}
      <path d="M 19 26 Q 23 23 27 25" stroke="#1a0800" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 33 25 Q 37 23 41 26" stroke="#1a0800" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Глаза — SL стиль, острые */}
      <path d="M 18 30 Q 23 24 28 30 L 27 36 Q 23 40 18 36 Z" fill="#0a0020"/>
      <ellipse cx="23" cy="32" rx="5" ry="5.5" fill="#1155cc"/>
      <ellipse cx="23" cy="32" rx="2.8" ry="3"   fill="#0033aa"/>
      <ellipse cx="23" cy="32" rx="1.2" ry="1.4" fill="#000"/>
      <ellipse cx="21" cy="29" rx="1.8" ry="2.2" fill="#fff" opacity="0.9"/>
      <path d="M 32 30 Q 37 24 42 30 L 42 36 Q 37 40 32 36 Z" fill="#0a0020"/>
      <ellipse cx="37" cy="32" rx="5" ry="5.5" fill="#1155cc"/>
      <ellipse cx="37" cy="32" rx="2.8" ry="3"   fill="#0033aa"/>
      <ellipse cx="37" cy="32" rx="1.2" ry="1.4" fill="#000"/>
      <ellipse cx="35" cy="29" rx="1.8" ry="2.2" fill="#fff" opacity="0.9"/>
      {/* Шрам — характерно для SL */}
      <path d="M 28 35 L 32 40" stroke="#c08060" strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
      {/* Нос */}
      <path d="M 28 40 Q 30 43 32 40" stroke="#d4956a" strokeWidth="1" fill="none" strokeLinecap="round"/>
      {/* Рот */}
      <path d="M 24 47 Q 30 51 36 47" stroke="#c07858" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  // 1 — HxH Killua: серебристые волосы, голубые глаза
  ({ size }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <defs>
        <radialGradient id="f1" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#fff0f0"/><stop offset="100%" stopColor="#f0d8d0"/>
        </radialGradient>
      </defs>
      <path d="M 10 30 Q 8 12 20 6 Q 30 2 40 6 Q 52 12 50 30 Q 46 10 30 8 Q 14 10 10 30Z" fill="#e8e8f0" stroke="#bbb" strokeWidth="1"/>
      <circle cx="18" cy="12" r="6"  fill="#dedee8" stroke="#bbb" strokeWidth="0.8"/>
      <circle cx="30" cy="7"  r="7"  fill="#eeeef8" stroke="#bbb" strokeWidth="0.8"/>
      <circle cx="42" cy="12" r="6"  fill="#dedee8" stroke="#bbb" strokeWidth="0.8"/>
      <path d="M 16 30 C 14 20 18 10 30 8 C 42 10 46 20 44 30 C 44 44 40 54 30 56 C 20 54 16 44 16 30Z" fill="url(#f1)" stroke="#d4a898" strokeWidth="1"/>
      <path d="M 18 26 Q 23 22 27 24" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 33 24 Q 37 22 42 26" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="23" cy="31" rx="5.5" ry="6" fill="#0055aa"/>
      <ellipse cx="23" cy="31" rx="3"   ry="3.5" fill="#0033cc"/>
      <ellipse cx="23" cy="31" rx="1.2" ry="1.4" fill="#000"/>
      <ellipse cx="21" cy="28" rx="1.8" ry="2"   fill="#fff" opacity="0.95"/>
      <ellipse cx="37" cy="31" rx="5.5" ry="6" fill="#0055aa"/>
      <ellipse cx="37" cy="31" rx="3"   ry="3.5" fill="#0033cc"/>
      <ellipse cx="37" cy="31" rx="1.2" ry="1.4" fill="#000"/>
      <ellipse cx="35" cy="28" rx="1.8" ry="2"   fill="#fff" opacity="0.95"/>
      <path d="M 28 41 Q 30 44 32 41" stroke="#d4a090" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M 25 48 Q 30 53 35 48" stroke="#c08070" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  // 2 — Berserk/dark: алые глаза, шрам через лицо
  ({ size }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <defs>
        <radialGradient id="f2" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#fde0c0"/><stop offset="100%" stopColor="#e8b880"/>
        </radialGradient>
      </defs>
      <path d="M 10 32 Q 6 12 22 5 Q 30 1 38 5 Q 54 12 50 32 Q 46 10 30 9 Q 14 10 10 32Z" fill="#1a0a00" stroke="#000" strokeWidth="1"/>
      <path d="M 20 7 L 14 24 L 22 20 Z" fill="#2a1200" stroke="#000" strokeWidth="0.8"/>
      <path d="M 30 5 L 28 22 L 33 20 Z" fill="#2a1200" stroke="#000" strokeWidth="0.8"/>
      <path d="M 40 7 L 46 22 L 38 20 Z" fill="#1a0a00" stroke="#000" strokeWidth="0.8"/>
      <path d="M 16 32 C 14 20 18 10 30 8 C 42 10 46 20 44 32 C 44 46 40 56 30 58 C 20 56 16 46 16 32Z" fill="url(#f2)" stroke="#c08040" strokeWidth="1"/>
      {/* Диагональный шрам */}
      <path d="M 22 20 L 38 44" stroke="#a06030" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7"/>
      <path d="M 19 28 Q 23 23 27 27" stroke="#3a1000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 33 27 Q 37 23 41 28" stroke="#3a1000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 17 32 Q 23 25 28 32 L 27 39 Q 23 43 17 39 Z" fill="#1a0000"/>
      <ellipse cx="22" cy="34" rx="5.5" ry="6" fill="#cc1111"/>
      <ellipse cx="22" cy="34" rx="3"   ry="3.5" fill="#880000"/>
      <ellipse cx="22" cy="34" rx="1.2" ry="1.4" fill="#000"/>
      <ellipse cx="20" cy="30" rx="2"   ry="2.3" fill="#fff" opacity="0.85"/>
      <path d="M 32 32 Q 38 25 43 32 L 43 38 Q 38 43 32 39 Z" fill="#1a0000"/>
      <ellipse cx="38" cy="34" rx="5.5" ry="6" fill="#cc1111"/>
      <ellipse cx="38" cy="34" rx="3"   ry="3.5" fill="#880000"/>
      <ellipse cx="38" cy="34" rx="1.2" ry="1.4" fill="#000"/>
      <ellipse cx="36" cy="30" rx="2"   ry="2.3" fill="#fff" opacity="0.85"/>
      <path d="M 28 43 Q 30 47 32 43" stroke="#c08040" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M 24 50 Q 30 56 36 50" stroke="#a06030" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  // 3 — HxH Gon style: тёмные лучистые волосы, зелёные глаза
  ({ size }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <defs>
        <radialGradient id="f3" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#fff5e0"/><stop offset="100%" stopColor="#f0d090"/>
        </radialGradient>
      </defs>
      <path d="M 12 32 Q 8 10 22 4 Q 30 0 38 4 Q 52 10 48 32 Q 45 8 30 6 Q 15 8 12 32Z" fill="#1a1200" stroke="#000" strokeWidth="1"/>
      <path d="M 12 28 L 8  14 L 16 22 Z"  fill="#111000" stroke="#000" strokeWidth="0.8"/>
      <path d="M 18 8  L 14 20 L 20 18 Z"  fill="#221800" stroke="#000" strokeWidth="0.8"/>
      <path d="M 30 4  L 28 18 L 33 16 Z"  fill="#1a1400" stroke="#000" strokeWidth="0.8"/>
      <path d="M 44 10 L 48 22 L 40 18 Z"  fill="#111000" stroke="#000" strokeWidth="0.8"/>
      <path d="M 48 28 L 52 14 L 44 22 Z"  fill="#111000" stroke="#000" strokeWidth="0.8"/>
      <path d="M 16 32 C 14 20 18 10 30 8 C 42 10 46 20 44 32 C 44 46 40 56 30 58 C 20 56 16 46 16 32Z" fill="url(#f3)" stroke="#c89850" strokeWidth="1"/>
      <path d="M 19 27 Q 23 24 27 26" stroke="#2a1800" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 33 26 Q 37 24 41 27" stroke="#2a1800" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="23" cy="32" rx="5.5" ry="6" fill="#116622"/>
      <ellipse cx="23" cy="32" rx="3"   ry="3.5" fill="#0d5518"/>
      <ellipse cx="23" cy="32" rx="1.2" ry="1.4" fill="#000"/>
      <ellipse cx="21" cy="29" rx="1.8" ry="2.1" fill="#fff" opacity="0.9"/>
      <ellipse cx="37" cy="32" rx="5.5" ry="6" fill="#116622"/>
      <ellipse cx="37" cy="32" rx="3"   ry="3.5" fill="#0d5518"/>
      <ellipse cx="37" cy="32" rx="1.2" ry="1.4" fill="#000"/>
      <ellipse cx="35" cy="29" rx="1.8" ry="2.1" fill="#fff" opacity="0.9"/>
      <path d="M 27 42 Q 30 45 33 42" stroke="#c89850" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M 24 49 Q 30 54 36 49" stroke="#a07840" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  // 4 — Naruto style: золотые глаза, усы шрамы
  ({ size }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <defs>
        <radialGradient id="f4" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#fff8e0"/><stop offset="100%" stopColor="#f5d878"/>
        </radialGradient>
      </defs>
      <path d="M 10 30 Q 6 12 20 5 Q 30 1 40 5 Q 54 12 50 30 Q 46 8 30 6 Q 14 8 10 30Z" fill="#dda800" stroke="#b88000" strokeWidth="1"/>
      <circle cx="30" cy="10" r="8" fill="#f0c000" stroke="#c0a000" strokeWidth="0.8"/>
      <path d="M 14 30 C 12 18 18 8 30 6 C 42 8 48 18 46 30 C 46 46 42 57 30 59 C 18 57 14 46 14 30Z" fill="url(#f4)" stroke="#c8a040" strokeWidth="1"/>
      {/* Усы шрамы как у Наруто */}
      <line x1="14" y1="35" x2="20" y2="37" stroke="#c8a040" strokeWidth="1.2" opacity="0.7"/>
      <line x1="14" y1="38" x2="20" y2="39" stroke="#c8a040" strokeWidth="1.2" opacity="0.7"/>
      <line x1="14" y1="41" x2="20" y2="41" stroke="#c8a040" strokeWidth="1.2" opacity="0.7"/>
      <line x1="46" y1="35" x2="40" y2="37" stroke="#c8a040" strokeWidth="1.2" opacity="0.7"/>
      <line x1="46" y1="38" x2="40" y2="39" stroke="#c8a040" strokeWidth="1.2" opacity="0.7"/>
      <line x1="46" y1="41" x2="40" y2="41" stroke="#c8a040" strokeWidth="1.2" opacity="0.7"/>
      <path d="M 18 27 Q 23 24 27 26" stroke="#7a5000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 33 26 Q 37 24 42 27" stroke="#7a5000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="23" cy="33" rx="5.5" ry="6" fill="#ee8800"/>
      <ellipse cx="23" cy="33" rx="3"   ry="4"   fill="#cc6600"/>
      <ellipse cx="23" cy="33" rx="1.2" ry="1.8" fill="#000"/>
      <ellipse cx="21" cy="29" rx="1.8" ry="2.2" fill="#fff" opacity="0.9"/>
      <ellipse cx="37" cy="33" rx="5.5" ry="6" fill="#ee8800"/>
      <ellipse cx="37" cy="33" rx="3"   ry="4"   fill="#cc6600"/>
      <ellipse cx="37" cy="33" rx="1.2" ry="1.8" fill="#000"/>
      <ellipse cx="35" cy="29" rx="1.8" ry="2.2" fill="#fff" opacity="0.9"/>
      <path d="M 28 44 Q 30 47 32 44" stroke="#c8a040" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M 23 51 Q 30 56 37 51" stroke="#a07830" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  // 5 — AOT style: серые глаза, длинные волосы
  ({ size }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <defs>
        <radialGradient id="f5" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#f0f0f0"/><stop offset="100%" stopColor="#d8d8d8"/>
        </radialGradient>
      </defs>
      <path d="M 10 30 Q 6 15 14 8 Q 30 2 46 8 Q 54 15 50 30 Q 48 10 30 8 Q 12 10 10 30Z" fill="#555560" stroke="#333" strokeWidth="1"/>
      <path d="M 8  28 Q 6  40 9  52 L 14 50 Q 11 40 12 30 Z" fill="#4a4a58" stroke="#333" strokeWidth="0.8"/>
      <path d="M 52 28 Q 54 40 51 52 L 46 50 Q 49 40 48 30 Z" fill="#4a4a58" stroke="#333" strokeWidth="0.8"/>
      <path d="M 16 30 C 14 18 18 8 30 6 C 42 8 46 18 44 30 C 44 46 40 56 30 58 C 20 56 16 46 16 30Z" fill="url(#f5)" stroke="#bbb" strokeWidth="1"/>
      <path d="M 18 27 Q 23 24 27 26" stroke="#555" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 33 26 Q 37 24 42 27" stroke="#555" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="23" cy="32" rx="5.5" ry="6" fill="#6688aa"/>
      <ellipse cx="23" cy="32" rx="3"   ry="3.5" fill="#445566"/>
      <ellipse cx="23" cy="32" rx="1.3" ry="1.5" fill="#111"/>
      <ellipse cx="21" cy="28" rx="2"   ry="2.3" fill="#fff" opacity="0.9"/>
      <ellipse cx="37" cy="32" rx="5.5" ry="6" fill="#6688aa"/>
      <ellipse cx="37" cy="32" rx="3"   ry="3.5" fill="#445566"/>
      <ellipse cx="37" cy="32" rx="1.3" ry="1.5" fill="#111"/>
      <ellipse cx="35" cy="28" rx="2"   ry="2.3" fill="#fff" opacity="0.9"/>
      <path d="M 28 42 Q 30 45 32 42" stroke="#bbb" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M 25 49 Q 30 54 35 49" stroke="#999" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  // 6 — Demon Slayer style: розовые глаза, мягкий
  ({ size }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <defs>
        <radialGradient id="f6" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#fff0f5"/><stop offset="100%" stopColor="#f0c8d8"/>
        </radialGradient>
      </defs>
      <path d="M 12 30 Q 8 12 22 5 Q 30 1 38 5 Q 52 12 48 30 Q 44 8 30 6 Q 16 8 12 30Z" fill="#cc4488" stroke="#aa2266" strokeWidth="1"/>
      <path d="M 20 8 L 16 24 L 23 19 Z" fill="#cc3377" stroke="#aa2266" strokeWidth="0.8"/>
      <path d="M 40 8 L 44 24 L 37 19 Z" fill="#cc3377" stroke="#aa2266" strokeWidth="0.8"/>
      <path d="M 30 5 L 27 20 L 32 18 Z" fill="#dd4488" stroke="#aa2266" strokeWidth="0.8"/>
      <path d="M 16 30 C 14 18 18 8 30 6 C 42 8 46 18 44 30 C 44 46 40 56 30 58 C 20 56 16 46 16 30Z" fill="url(#f6)" stroke="#d4a0b0" strokeWidth="1"/>
      <path d="M 19 27 Q 23 24 27 26" stroke="#8a3050" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 33 26 Q 37 24 41 27" stroke="#8a3050" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <ellipse cx="23" cy="32" rx="5.5" ry="6.5" fill="#dd66aa"/>
      <ellipse cx="23" cy="32" rx="3"   ry="3.8" fill="#bb3388"/>
      <ellipse cx="23" cy="32" rx="1.2" ry="1.5" fill="#000"/>
      <ellipse cx="21" cy="28" rx="1.8" ry="2.2" fill="#fff" opacity="0.9"/>
      <ellipse cx="37" cy="32" rx="5.5" ry="6.5" fill="#dd66aa"/>
      <ellipse cx="37" cy="32" rx="3"   ry="3.8" fill="#bb3388"/>
      <ellipse cx="37" cy="32" rx="1.2" ry="1.5" fill="#000"/>
      <ellipse cx="35" cy="28" rx="1.8" ry="2.2" fill="#fff" opacity="0.9"/>
      <path d="M 27 43 Q 30 47 33 43" stroke="#d4a0b0" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M 24 50 Q 30 55 36 50" stroke="#c090a0" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  ),

  // 7 — JJK Gojo style: белые волосы, бирюзовые глаза, повязка
  ({ size }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <defs>
        <radialGradient id="f7" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#fdf8f0"/><stop offset="100%" stopColor="#f0e8d8"/>
        </radialGradient>
      </defs>
      <path d="M 10 32 L 6  14 L 14 22 L 12 6  L 22 18 L 20 4  L 28 16 L 30 2  L 32 16 L 40 4  L 38 18 L 48 6  L 46 22 L 54 14 L 50 32 Q 44 10 30 8 Q 16 10 10 32Z" fill="#e8e8f8" stroke="#c0c0d8" strokeWidth="1"/>
      <path d="M 22 16 L 20 8  L 26 14 Z" fill="#f0f0ff" stroke="#c0c0d8" strokeWidth="0.8"/>
      <path d="M 30 6  L 28 14 L 32 12 Z" fill="#f4f4ff" stroke="#c0c0d8" strokeWidth="0.8"/>
      <path d="M 38 16 L 40 8  L 34 14 Z" fill="#f0f0ff" stroke="#c0c0d8" strokeWidth="0.8"/>
      <path d="M 16 32 C 14 20 18 10 30 8 C 42 10 46 20 44 32 C 44 46 40 56 30 58 C 20 56 16 46 16 32Z" fill="url(#f7)" stroke="#c8a888" strokeWidth="1"/>
      {/* Повязка */}
      <rect x="15" y="29" width="30" height="9" rx="3" fill="#1a2a6a" stroke="#0a1850" strokeWidth="1"/>
      <line x1="17" y1="32" x2="43" y2="32" stroke="#2a3a8a" strokeWidth="0.6" opacity="0.6"/>
      {[22,28,34,40].map((x,i) => <circle key={i} cx={x} cy="33.5" r="1.2" fill="#4488cc" opacity="0.8"/>)}
      <path d="M 19 27 Q 23 24 27 26" stroke="#555" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 33 26 Q 37 24 41 27" stroke="#555" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 27 44 Q 30 48 33 44" stroke="#c8a888" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M 24 51 Q 30 56 36 51" stroke="#a88860" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    </svg>
  ),
]

// ═══════════════════════════════════════════════════════════════════════════════
// MONOGRAM AVATARS — ч/б манга стиль, как карточки календаря
// ═══════════════════════════════════════════════════════════════════════════════

export function AnimeAvatar({ playerIndex = 0, status = 'pending', size = 36, name = '' }) {
  const letter = (name || '?').charAt(0).toUpperCase()
  const fs     = Math.round(size * 0.42)

  const bg     = status === 'pending' ? '#f5f5f5' : '#fff'
  const border = status === 'can'  ? '#22c55e'
               : status === 'cant' ? '#ef4444'
               : 'rgba(0,0,0,0.25)'
  const shadow = status === 'can'  ? '0 0 0 2px #22c55e, 0 0 8px rgba(34,197,94,0.4)'
               : status === 'cant' ? '0 0 0 2px #ef4444, 0 0 8px rgba(239,68,68,0.4)'
               : '0 0 0 1.5px rgba(0,0,0,0.2)'
  const textColor = status === 'can'  ? '#22c55e'
                  : status === 'cant' ? '#ef4444'
                  : '#9a9a9a'

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg,
      border: `2px solid ${border}`,
      boxShadow: shadow,
      flexShrink: 0,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative',
    }}>
      {/* Halftone уголок — как на карточках */}
      {status === 'can' && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%', overflow: 'hidden', pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(34,197,94,0.25) 0.6px, transparent 1px)',
          backgroundSize: '4px 4px',
          maskImage: 'radial-gradient(60% 60% at 100% 0%, #000, transparent)',
          WebkitMaskImage: 'radial-gradient(60% 60% at 100% 0%, #000, transparent)',
        }}/>
      )}
      <span style={{
        fontFamily: '"Permanent Marker", system-ui',
        fontSize: fs,
        color: textColor,
        lineHeight: 1,
        userSelect: 'none',
        position: 'relative', zIndex: 1,
      }}>{letter}</span>
    </div>
  )
}
