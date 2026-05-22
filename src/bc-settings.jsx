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
          <button onClick={onClose} style={{ width:32,height:32,borderRadius:'50%',background:'#fff',border:'2px solid #000',fontSize:18,fontWeight:900,cursor:'pointer' }}>×</button>
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
    let w = c.width = window.innerWidth
    let h = c.height = window.innerHeight
    let raf
    const onResize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight }
    window.addEventListener('resize', onResize)

    const COLORS = ['#ffb3d9','#ff99cc','#ffc7e0','#ffd1e8','#ffe0f0']

    // Каждый лепесток — 5 закруглённых лепестков вокруг центра (цветок сакуры)
    function drawFlower(ctx, x, y, size, rot, alpha) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.globalAlpha = alpha
      for (let i = 0; i < 5; i++) {
        ctx.save()
        ctx.rotate((i * Math.PI * 2) / 5)
        ctx.fillStyle = COLORS[i % COLORS.length]
        ctx.beginPath()
        ctx.ellipse(0, -size * 0.55, size * 0.28, size * 0.42, 0, 0, Math.PI * 2)
        ctx.fill()
        // Прожилка
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'
        ctx.lineWidth = 0.4
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(0, -size * 0.9)
        ctx.stroke()
        ctx.restore()
      }
      // Центр
      ctx.fillStyle = '#fff'
      ctx.globalAlpha = alpha * 0.8
      ctx.beginPath()
      ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    // Отдельные лепестки
    function drawPetal(ctx, x, y, size, rot, alpha) {
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.globalAlpha = alpha
      ctx.fillStyle = COLORS[Math.floor(Math.random() * COLORS.length)]
      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.bezierCurveTo(size * 0.5, -size * 0.7, size * 0.6, size * 0.5, 0, size)
      ctx.bezierCurveTo(-size * 0.6, size * 0.5, -size * 0.5, -size * 0.7, 0, -size)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'
      ctx.lineWidth = 0.5
      ctx.beginPath(); ctx.moveTo(0,-size*0.7); ctx.lineTo(0,size*0.7); ctx.stroke()
      ctx.restore()
    }

    const particles = Array.from({ length: 30 }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h - h * 0.5,
      size: 4 + Math.random() * 7,
      vx: -0.15 - Math.random() * 0.3,
      vy: 0.5 + Math.random() * 0.7,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.025,
      wobble: Math.random() * Math.PI * 2,
      wobbleA: 0.3 + Math.random() * 0.4,
      wobbleS: 0.008 + Math.random() * 0.012,
      alpha: 0.5 + Math.random() * 0.35,
      isFlower: i < 6, // первые 6 — полные цветки
      colorIdx: Math.floor(Math.random() * COLORS.length),
    }))

    function loop() {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.wobble += p.wobbleS
        p.x += p.vx + Math.sin(p.wobble) * p.wobbleA
        p.y += p.vy + Math.cos(p.wobble * 0.7) * 0.15
        p.rot += p.rotV
        if (p.y > h + 40) { p.y = -40; p.x = Math.random() * w + 80 }
        if (p.x < -40)    { p.x = w + 20 }
        if (p.isFlower) {
          drawFlower(ctx, p.x, p.y, p.size, p.rot, p.alpha)
        } else {
          ctx.save()
          ctx.fillStyle = COLORS[p.colorIdx]
          drawPetal(ctx, p.x, p.y, p.size, p.rot, p.alpha)
          ctx.restore()
        }
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
  return (
    <div style={{
      position:'relative', height:210,
      borderRadius:16, overflow:'hidden',
      background:'linear-gradient(180deg, #000000 0%, #0a000f 40%, #12001a 100%)',
      border:'2px solid #000',
      boxShadow:'4px 4px 0 #ff99cc',
      marginBottom:16,
    }}>
      {/* Туман / глубина */}
      <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(80,0,100,0.25) 0%, transparent 70%)',pointerEvents:'none' }}/>

      {/* Аниме глаза — Solo Leveling узкие */}
      <div style={{ position:'absolute',top:38,left:0,right:0,display:'flex',justifyContent:'center',gap:48,alignItems:'center' }}>
        <SLEye color={isHype ? '#ff1111' : '#9966ff'} glow={isHype ? '#ff0000' : '#6600ff'} flipped={false}/>
        <SLEye color={isHype ? '#ff1111' : '#9966ff'} glow={isHype ? '#ff0000' : '#6600ff'} flipped={true}/>
      </div>

      {/* Мистический свет между глазами */}
      <div style={{
        position:'absolute', top:48, left:'50%', transform:'translateX(-50%)',
        width:60, height:40,
        background:`radial-gradient(ellipse, ${isHype ? 'rgba(255,0,0,0.15)' : 'rgba(120,0,255,0.12)'} 0%, transparent 70%)`,
        transition:'background 1s',
        pointerEvents:'none',
      }}/>

      {/* Надпись */}
      <div style={{ position:'absolute',bottom:54,left:0,right:0,textAlign:'center' }}>
        {isHype
          ? <BloodText text="ГАЗ ЕБАШИТЬСЯ"/>
          : <ReadyText/>
        }
      </div>

      {/* Котик */}
      <JumpingCat/>

      <style>{`
        @keyframes slEyeGlow { 0%,100%{opacity:0.85} 50%{opacity:1} }
        @keyframes slBlink { 0%,94%,100%{transform:scaleY(1)} 96%,98%{transform:scaleY(0.05)} }
        @keyframes heroPulse { 0%,100%{opacity:0.9;transform:scale(1)} 50%{opacity:1;transform:scale(1.04)} }
        @keyframes bloodFlow {
          0%   { height:4px;  opacity:0.7 }
          40%  { height:16px; opacity:1   }
          70%  { height:12px; opacity:0.9 }
          100% { height:4px;  opacity:0.7 }
        }
        @keyframes letterDrip0 { 0%,100%{height:5px} 50%{height:18px} }
        @keyframes letterDrip1 { 0%,100%{height:3px} 50%{height:14px} }
        @keyframes letterDrip2 { 0%,100%{height:4px} 50%{height:16px} }
        @keyframes catJump {
          0%   { transform:translateX(4px)  translateY(0px) }
          20%  { transform:translateX(24px) translateY(-28px) scaleX(0.9) scaleY(1.1) }
          40%  { transform:translateX(48px) translateY(0px) scaleX(1.1) scaleY(0.9) }
          60%  { transform:translateX(28px) translateY(-20px) }
          80%  { transform:translateX(8px)  translateY(0px) }
          100% { transform:translateX(4px)  translateY(0px) }
        }
        @keyframes catTail { 0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(20deg)} }
        @keyframes readyFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
      `}</style>
    </div>
  )
}

function SLEye({ color, glow, flipped }) {
  return (
    <div style={{
      transform: flipped ? 'scaleX(-1)' : 'none',
      filter: `drop-shadow(0 0 8px ${glow}) drop-shadow(0 0 20px ${glow}80)`,
      animation: 'slEyeGlow 2.5s ease-in-out infinite',
      width:75, height:55,
    }}>
      <svg viewBox="0 0 75 55" width="75" height="55">
        <defs>
          <radialGradient id={`iris_${flipped?1:0}`} cx="38%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.95"/>
            <stop offset="30%" stopColor={color} stopOpacity="1"/>
            <stop offset="100%" stopColor={glow} stopOpacity="0.9"/>
          </radialGradient>
        </defs>
        {/* Нижнее веко */}
        <path d="M 4 32 Q 37 50 71 32" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.4"/>
        {/* Верхнее веко — характерная для SL форма: плоское сверху, резкий изгиб */}
        <path d="M 3 30 Q 8 18 20 14 Q 37 8 54 14 Q 66 18 72 30"
          stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round"/>
        {/* Длинные ресницы сверху */}
        <line x1="6"  y1="26" x2="2"  y2="17" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="14" y1="19" x2="11" y2="8"  stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="24" y1="14" x2="23" y2="3"  stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="37" y1="11" x2="37" y2="0"  stroke="#fff" strokeWidth="2"   strokeLinecap="round"/>
        <line x1="50" y1="14" x2="51" y2="3"  stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="60" y1="19" x2="63" y2="8"  stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="69" y1="26" x2="73" y2="17" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        {/* Глаз — форма SL-стиль: узкий, острый к углам */}
        <g style={{ animation:'slBlink 5s ease-in-out infinite', transformOrigin:'37px 28px' }}>
          <path d="M 4 28 Q 20 14 37 14 Q 54 14 71 28 Q 54 42 37 42 Q 20 42 4 28 Z"
            fill={`url(#iris_${flipped?1:0})`} opacity="0.92"/>
          {/* Зрачок — вертикальный как у кошки/SL */}
          <ellipse cx="37" cy="28" rx="5" ry="11" fill="#000" opacity="0.95"/>
          {/* Свет */}
          <ellipse cx="33" cy="22" rx="3.5" ry="5" fill="#fff" opacity="0.9"/>
          <circle cx="41" cy="32" r="1.5" fill="#fff" opacity="0.5"/>
        </g>
      </svg>
    </div>
  )
}

function ReadyText() {
  return (
    <div style={{
      fontFamily:'"Permanent Marker",system-ui',
      fontSize:22, letterSpacing:4, color:'#fff',
      textShadow:'0 0 10px rgba(153,102,255,0.7), 0 0 30px rgba(153,102,255,0.4)',
      animation:'readyFloat 2.8s ease-in-out infinite',
    }}>
      ВЫ ГОТОВЫ?
    </div>
  )
}

function BloodText({ text }) {
  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <div style={{
        fontFamily:'"Permanent Marker",system-ui',
        fontSize:24, letterSpacing:3,
        color:'#ff2222',
        textShadow:'0 0 10px rgba(255,0,0,0.7), 0 0 25px rgba(255,0,0,0.4), 0 2px 0 #600',
        animation:'heroPulse 1.1s ease-in-out infinite',
      }}>{text}</div>
      <div style={{ position:'absolute',left:'5%',right:'5%',top:'90%',display:'flex',justifyContent:'space-around',height:0 }}>
        {[0,1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            width:2.5, borderRadius:'0 0 50% 50%',
            background:'linear-gradient(180deg,#ff0000 0%,#7a0000 100%)',
            boxShadow:'0 0 4px rgba(255,0,0,0.8)',
            animation:`letterDrip${i%3} ${1.3+i*0.15}s ease-in-out ${i*0.12}s infinite`,
          }}/>
        ))}
      </div>
    </div>
  )
}

function JumpingCat() {
  return (
    <div style={{ position:'absolute',bottom:6,left:6,animation:'catJump 4s cubic-bezier(0.4,0,0.6,1) infinite' }}>
      <svg viewBox="0 0 46 46" width="40" height="40">
        {/* Тело */}
        <ellipse cx="23" cy="31" rx="13" ry="9" fill="#fff" stroke="#000" strokeWidth="1.5"/>
        {/* Голова */}
        <circle cx="23" cy="20" r="9.5" fill="#fff" stroke="#000" strokeWidth="1.5"/>
        {/* Уши */}
        <path d="M 15 15 L 12 7 L 19 13 Z" fill="#fff" stroke="#000" strokeWidth="1.3"/>
        <path d="M 31 15 L 34 7 L 27 13 Z" fill="#fff" stroke="#000" strokeWidth="1.3"/>
        <path d="M 15.5 13 L 16.5 9 L 18 13 Z" fill="#ff99cc"/>
        <path d="M 30.5 13 L 29.5 9 L 28 13 Z" fill="#ff99cc"/>
        {/* Глаза — закрытые дуги */}
        <path d="M 18 20 Q 20.5 17.5 23 20" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M 23 20 Q 25.5 17.5 28 20" stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        {/* Нос + рот */}
        <path d="M 22 23 L 24 23 L 23 25 Z" fill="#ff99cc"/>
        <path d="M 23 25 Q 21 27 20 26" stroke="#000" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M 23 25 Q 25 27 26 26" stroke="#000" strokeWidth="1" fill="none" strokeLinecap="round"/>
        {/* Усы */}
        <line x1="10" y1="22" x2="17" y2="23" stroke="#000" strokeWidth="0.7"/>
        <line x1="10" y1="24" x2="17" y2="24" stroke="#000" strokeWidth="0.7"/>
        <line x1="36" y1="22" x2="29" y2="23" stroke="#000" strokeWidth="0.7"/>
        <line x1="36" y1="24" x2="29" y2="24" stroke="#000" strokeWidth="0.7"/>
        {/* Лапки */}
        <ellipse cx="16" cy="38" rx="3" ry="2" fill="#fff" stroke="#000" strokeWidth="1.2"/>
        <ellipse cx="30" cy="38" rx="3" ry="2" fill="#fff" stroke="#000" strokeWidth="1.2"/>
        {/* Хвост с анимацией */}
        <path d="M 35 30 Q 43 25 41 17"
          stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round"
          style={{ transformOrigin:'35px 30px', animation:'catTail 0.8s ease-in-out infinite' }}/>
        <path d="M 35 30 Q 43 25 41 17"
          stroke="#000" strokeWidth="1.5" fill="none" strokeLinecap="round"
          style={{ transformOrigin:'35px 30px', animation:'catTail 0.8s ease-in-out infinite' }}/>
      </svg>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// ANIME AVATARS — 8 уникальных нарисованных аниме-персонажей
// Стиль Hunter x Hunter / Solo Leveling — с лицами, без фигур
// ═══════════════════════════════════════════════════════════════════════════════

export function AnimeAvatar({ playerIndex = 0, status = 'pending', size = 36 }) {
  const ring = status === 'can' ? '#22c55e' : status === 'cant' ? '#ef4444' : '#4b5563'
  const glow = status === 'can' ? '0 0 8px rgba(34,197,94,0.5)' : status === 'cant' ? '0 0 8px rgba(239,68,68,0.5)' : 'none'
  const idx = playerIndex % ANIME_CHARS.length
  const Char = ANIME_CHARS[idx]
  return (
    <div style={{
      borderRadius:'50%', border:`2.5px solid ${ring}`,
      boxShadow: glow, display:'inline-flex',
      alignItems:'center', justifyContent:'center',
      background: ANIME_BG[idx], flexShrink:0,
      overflow:'hidden', width:size, height:size,
    }}>
      <Char size={size}/>
    </div>
  )
}

const ANIME_BG = [
  '#0d0020', // 0 - тёмно-фиолетовый
  '#001428', // 1 - тёмно-синий
  '#1a0000', // 2 - тёмно-красный
  '#001a0d', // 3 - тёмно-зелёный
  '#1a1400', // 4 - тёмно-золотой
  '#0a0a14', // 5 - тёмно-серый
  '#1a000f', // 6 - тёмно-малиновый
  '#000f1a', // 7 - тёмно-циановый
]

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
