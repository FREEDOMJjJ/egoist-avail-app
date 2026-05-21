import { useState, useEffect, useRef } from 'react'
import { BC_COLORS, WEEKDAYS_RU_SHORT, MONTHS_RU, MONTHS_RU_LONG, isToday, isPast } from './bc-shared'
import { PulseRing } from './bc-effects'

// ── Карандашные аниме головы — 5 разных стилей ────────────────────────────
// Нарисованы bezier-кривыми, имитируют карандашный штрих

const PENCIL_HEADS = [
  // 0 — короткий взъерошенный undercut
  ({ size=36, ring='#888' }) => {
    const glow = ring === '#22c55e' ? 'rgba(34,197,94,0.35)' : ring === '#ef4444' ? 'rgba(239,68,68,0.35)' : 'transparent'
    return (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <circle cx="30" cy="30" r="27" fill="#fff" stroke={ring} strokeWidth="2.5"
        style={{ filter: ring !== '#4b5563' ? `drop-shadow(0 0 6px ${glow})` : 'none' }}/>
      {/* Face - мягкий овал */}
      <ellipse cx="30" cy="34" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      {/* Neck */}
      <path d="M 26 47 Q 30 50 34 47" stroke="#2a2a2a" strokeWidth="1" fill="none"/>
      {/* Hair — короткий undercut, карандашные штрихи */}
      <path d="M 16 30 Q 14 20 18 14 Q 22 8 30 8 Q 38 8 42 14 Q 46 20 44 30"
        fill="#1a1a1a" stroke="#0a0a0a" strokeWidth="1.2" strokeLinejoin="round"/>
      {/* Хаотичные спайки сверху */}
      <path d="M 22 12 L 20 5 L 24 10" fill="#222" stroke="#111" strokeWidth="0.8"/>
      <path d="M 28 9 L 27 3 L 31 8" fill="#222" stroke="#111" strokeWidth="0.8"/>
      <path d="M 34 10 L 35 4 L 37 10" fill="#1a1a1a" stroke="#111" strokeWidth="0.8"/>
      {/* Карандашный штрих на волосах */}
      <path d="M 20 18 C 24 14 32 14 38 16" stroke="#333" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M 18 23 C 22 19 36 19 42 22" stroke="#333" strokeWidth="0.6" fill="none" strokeLinecap="round" opacity="0.4"/>
      {/* Оставленная щетина по бокам */}
      <path d="M 16 30 L 17 38" stroke="#333" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
      <path d="M 44 30 L 43 38" stroke="#333" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
    </svg>
  )},

  // 1 — длинные серебристые небрежные
  ({ size=36, ring='#888' }) => {
    const glow = ring === '#22c55e' ? 'rgba(34,197,94,0.35)' : ring === '#ef4444' ? 'rgba(239,68,68,0.35)' : 'transparent'
    return (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <circle cx="30" cy="30" r="27" fill="#fff" stroke={ring} strokeWidth="2.5"
        style={{ filter: ring !== '#4b5563' ? `drop-shadow(0 0 6px ${glow})` : 'none' }}/>
      {/* Длинные волосы по бокам */}
      <path d="M 16 28 C 14 38 13 48 16 56 L 20 54 C 18 46 18 38 18 30" fill="#c8c8cc" stroke="#999" strokeWidth="1"/>
      <path d="M 44 28 C 46 38 47 48 44 56 L 40 54 C 42 46 42 38 42 30" fill="#c8c8cc" stroke="#999" strokeWidth="1"/>
      {/* Face */}
      <ellipse cx="30" cy="34" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      {/* Hair top — пышные волны */}
      <path d="M 16 28 Q 14 16 22 10 Q 28 6 30 6 Q 32 6 38 10 Q 46 16 44 28"
        fill="#d8d8dc" stroke="#aaa" strokeWidth="1.2"/>
      <circle cx="20" cy="14" r="5" fill="#dedee2" stroke="#aaa" strokeWidth="0.8"/>
      <circle cx="30" cy="10" r="6" fill="#e8e8ec" stroke="#aaa" strokeWidth="0.8"/>
      <circle cx="40" cy="14" r="5" fill="#dedee2" stroke="#aaa" strokeWidth="0.8"/>
      {/* Блик */}
      <path d="M 24 14 C 28 10 34 10 38 14" stroke="#fff" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.7"/>
      {/* Карандашный штрих */}
      <path d="M 22 16 C 26 12 34 12 38 16" stroke="#bbb" strokeWidth="0.5" fill="none" opacity="0.6"/>
    </svg>
  )},

  // 2 — острые спайки Gojo-стиль (белые)
  ({ size=36, ring='#888' }) => {
    const glow = ring === '#22c55e' ? 'rgba(34,197,94,0.35)' : ring === '#ef4444' ? 'rgba(239,68,68,0.35)' : 'transparent'
    return (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <circle cx="30" cy="30" r="27" fill="#fff" stroke={ring} strokeWidth="2.5"
        style={{ filter: ring !== '#4b5563' ? `drop-shadow(0 0 6px ${glow})` : 'none' }}/>
      {/* Face */}
      <ellipse cx="30" cy="35" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      {/* Острые спайки — карандашные */}
      <path d="M 16 30 L 10 14 L 16 22 L 14 8 L 22 20 L 20 6 L 27 18 L 28 4 L 30 16 L 32 4 L 33 18 L 40 6 L 38 20 L 46 8 L 44 22 L 50 14 L 44 30"
        fill="#f0f0f0" stroke="#c8c8c8" strokeWidth="1.2" strokeLinejoin="round"/>
      {/* Карандашный штрих на волосах */}
      <path d="M 20 20 L 22 12" stroke="#ddd" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M 28 14 L 29 6" stroke="#ddd" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M 36 14 L 38 8" stroke="#ddd" strokeWidth="0.8" strokeLinecap="round"/>
      <path d="M 42 20 L 44 14" stroke="#ddd" strokeWidth="0.8" strokeLinecap="round"/>
      {/* Блик */}
      <path d="M 22 22 C 28 16 34 16 40 22" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8"/>
      {/* Тонкая повязка */}
      <rect x="16" y="33" width="28" height="6" rx="2" fill="#3355cc" stroke="#1a2888" strokeWidth="0.8" opacity="0.85"/>
      <line x1="18" y1="36" x2="42" y2="36" stroke="#2244aa" strokeWidth="0.5" opacity="0.5"/>
    </svg>
  )},

  // 3 — волнистые тёмно-русые
  ({ size=36, ring='#888' }) => {
    const glow = ring === '#22c55e' ? 'rgba(34,197,94,0.35)' : ring === '#ef4444' ? 'rgba(239,68,68,0.35)' : 'transparent'
    return (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <circle cx="30" cy="30" r="27" fill="#fff" stroke={ring} strokeWidth="2.5"
        style={{ filter: ring !== '#4b5563' ? `drop-shadow(0 0 6px ${glow})` : 'none' }}/>
      {/* Face */}
      <ellipse cx="30" cy="34" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      {/* Wavy hair — волны карандашом */}
      <path d="M 16 28 Q 14 16 20 10 Q 26 6 30 6 Q 34 6 40 10 Q 46 16 44 28 Q 40 14 34 10 Q 30 8 26 10 Q 20 14 16 28Z"
        fill="#8B6040" stroke="#6b4020" strokeWidth="1.2"/>
      {/* Волнистые линии */}
      <path d="M 18 24 C 20 20 24 22 26 18 C 28 14 32 16 34 12 C 36 10 40 14 42 18"
        stroke="#6b4020" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M 18 28 C 20 24 24 26 26 22 C 28 18 32 20 34 16"
        stroke="#7b5030" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6"/>
      {/* Одна прядь на лбу */}
      <path d="M 26 10 C 22 16 20 22 22 28" stroke="#6b4020" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Блик */}
      <path d="M 24 14 C 28 10 34 10 38 14" stroke="#c09060" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6"/>
    </svg>
  )},

  // 4 — тёмные острые с синим отблеском
  ({ size=36, ring='#888' }) => {
    const glow = ring === '#22c55e' ? 'rgba(34,197,94,0.35)' : ring === '#ef4444' ? 'rgba(239,68,68,0.35)' : 'transparent'
    return (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <circle cx="30" cy="30" r="27" fill="#fff" stroke={ring} strokeWidth="2.5"
        style={{ filter: ring !== '#4b5563' ? `drop-shadow(0 0 6px ${glow})` : 'none' }}/>
      {/* Face */}
      <ellipse cx="30" cy="34" rx="14" ry="15" fill="#faf6f0" stroke="#2a2a2a" strokeWidth="1.2"/>
      {/* Тёмные острые волосы */}
      <path d="M 16 28 Q 14 16 20 10 Q 26 6 30 6 Q 34 6 40 10 Q 46 16 44 28 Q 40 12 34 10 L 30 8 L 26 10 Q 20 12 16 28Z"
        fill="#111" stroke="#000" strokeWidth="1.2"/>
      {/* Острые пряди */}
      <path d="M 22 12 L 18 6 L 24 12" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
      <path d="M 30 8 L 28 2 L 32 8" fill="#222" stroke="#000" strokeWidth="0.8"/>
      <path d="M 38 12 L 42 6 L 36 12" fill="#1a1a1a" stroke="#000" strokeWidth="0.8"/>
      {/* Синий отблеск */}
      <path d="M 22 14 C 26 10 30 10 34 12" stroke="#4361ee" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6"/>
      <path d="M 24 18 C 28 14 34 14 38 18" stroke="#4361ee" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.35"/>
      {/* Карандашный штрих */}
      <path d="M 20 18 C 24 14 36 14 40 18" stroke="#333" strokeWidth="0.5" fill="none" opacity="0.5"/>
    </svg>
  )},
]

function AnimeAvatar({ playerIndex, status, size=38 }) {
  const HeadComp = PENCIL_HEADS[playerIndex % PENCIL_HEADS.length]
  const ring = status === 'can' ? '#22c55e' : status === 'cant' ? '#ef4444' : '#4b5563'
  return <HeadComp size={size} ring={ring}/>
}

// ── DayCard — карточка дня ─────────────────────────────────────────────────

export function DayCard({ date, dayData, teamSize, onClick, justChanged }) {
  const today = isToday(date)
  const past  = isPast(date) && !today
  const [popKey, setPopKey] = useState(0)
  useEffect(() => { if (justChanged) setPopKey(k => k + 1) }, [justChanged])

  const canCount = dayData?.can?.length || 0
  const cantCount = dayData?.cant?.length || 0
  const full = canCount >= teamSize
  const almost = canCount >= teamSize - 1 && !full

  const statusLabel = full ? 'СОСТАВ ГОТОВ' : almost ? 'ПОЧТИ ГОТОВ' : canCount > 0 ? `${canCount} ГОТОВЫ` : 'ЖДЁМ ВСЕХ'

  return (
    <button onClick={onClick} style={{
      all: 'unset', display: 'block', width: '100%', cursor: 'pointer',
      position: 'relative', borderRadius: 16, padding: '12px 14px',
      background: today ? 'rgba(255,255,255,0.97)' : past ? 'rgba(241,238,234,0.78)' : 'rgba(255,255,255,0.9)',
      border: '1.5px solid #000',
      boxShadow: today ? `4px 4px 0 ${BC_COLORS.pink}` : '3px 3px 0 #000',
      opacity: past ? 0.8 : 1, boxSizing: 'border-box',
      transition: 'transform 160ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 160ms',
    }}
      onMouseDown={e => e.currentTarget.style.transform = 'translate(2px,2px)'}
      onMouseUp={e => e.currentTarget.style.transform = ''}
      onTouchStart={e => e.currentTarget.style.transform = 'translate(2px,2px)'}
      onTouchEnd={e => e.currentTarget.style.transform = ''}
    >
      {today && <div style={{ position:'absolute',inset:0,borderRadius:'inherit',pointerEvents:'none',backgroundImage:'radial-gradient(rgba(67,97,238,0.25) 0.6px,transparent 1px)',backgroundSize:'5px 5px',maskImage:'linear-gradient(120deg,#000 0%,transparent 55%)',WebkitMaskImage:'linear-gradient(120deg,#000 0%,transparent 55%)',opacity:0.5 }}/>}
      {justChanged && <PulseRing k={popKey} color={BC_COLORS.pink} size={120}/>}

      <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative', zIndex:1 }}>
        {/* Date block */}
        <div style={{ width:48, flexShrink:0 }}>
          <div style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:2.2, fontWeight:800, color: today ? '#000' : '#6a6a6a' }}>{WEEKDAYS_RU_SHORT[date.getDay()]}</div>
          <div style={{ fontFamily:'"Permanent Marker",system-ui', fontSize:36, lineHeight:0.95, color:'#000', marginTop:2, letterSpacing:-1 }}>{date.getDate()}</div>
          <div style={{ fontFamily:'"Nunito",system-ui', fontSize:8, letterSpacing:1.4, fontWeight:700, color:'#6a6a6a', marginTop:2 }}>{MONTHS_RU[date.getMonth()]}</div>
        </div>

        {/* Avatars row with names */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:6 }}>
            {Array.from({ length: teamSize }).map((_, i) => {
              const canPlayer  = dayData?.can?.[i]
              const cantPlayer = !canPlayer ? dayData?.cant?.[i - canCount] : null
              const player     = canPlayer || cantPlayer
              const status     = canPlayer ? 'can' : cantPlayer ? 'cant' : 'pending'
              const name       = player?.display_name || player?.username || null
              return (
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                  <AnimeAvatar playerIndex={i} status={status} size={32}/>
                  <div style={{
                    fontFamily:'"Nunito",system-ui', fontSize:7, fontWeight:900,
                    color: status === 'can' ? '#22c55e' : status === 'cant' ? '#ef4444' : '#9a9a9a',
                    letterSpacing:0.3, width:34, textAlign:'center',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                  }}>{name || '—'}</div>
                </div>
              )
            })}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            {full
              ? <span style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:1.4, fontWeight:900, color:'#000', background:BC_COLORS.pink, padding:'2px 8px', borderRadius:6, border:'1px solid #000' }}>СОСТАВ ГОТОВ</span>
              : <span style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:1.6, fontWeight:800, color:'#6a6a6a' }}>{statusLabel}</span>
            }
            {today && <span style={{ fontFamily:'"Permanent Marker",system-ui', fontSize:12, color:'#4361ee', marginLeft:'auto' }}>· СЕГОДНЯ</span>}
          </div>
        </div>

        {/* Count */}
        <div style={{ textAlign:'right', flexShrink:0, minWidth:38 }}>
          <div style={{ fontFamily:'"Permanent Marker",system-ui', fontSize:28, lineHeight:1, color:'#000' }}>
            {canCount}<span style={{ color:'#9a9a9a', fontSize:16 }}>/{teamSize}</span>
          </div>
        </div>
      </div>
    </button>
  )
}

export function WeekHeader({ index, days }) {
  const start = days[0], end = days[days.length - 1]
  const sameMonth = start.getMonth() === end.getMonth()
  const range = sameMonth
    ? `${start.getDate()}–${end.getDate()} ${MONTHS_RU[start.getMonth()]}`
    : `${start.getDate()} ${MONTHS_RU[start.getMonth()]} – ${end.getDate()} ${MONTHS_RU[end.getMonth()]}`
  return (
    <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'16px 2px 8px', borderBottom:'1px solid rgba(255,255,255,0.12)', marginBottom:10 }}>
      <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
        <span style={{ fontFamily:'"Permanent Marker",system-ui', fontSize:14, color:BC_COLORS.pink }}>{index === 0 ? '#1' : '#2'}</span>
        <span style={{ fontFamily:'"Nunito",system-ui', fontSize:11, letterSpacing:2.5, fontWeight:800, color:'#fff' }}>{index === 0 ? 'ТЕКУЩАЯ НЕДЕЛЯ' : 'СЛЕДУЮЩАЯ НЕДЕЛЯ'}</span>
      </div>
      <span style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:1.4, fontWeight:700, color:'rgba(255,255,255,0.45)' }}>{range}</span>
    </div>
  )
}

// ── DayModal — модал выбора ────────────────────────────────────────────────

export function DayModal({ date, dayData, teamSize, user, onPick, onClose }) {
  const [timeInput, setTimeInput] = useState('')
  const [isAllDay, setIsAllDay] = useState(false)
  const [saving, setSaving] = useState(false)
  const [slashKey, setSlashKey] = useState(1)
  const inputRef = useRef(null)

  const canPlayers = dayData?.can || []
  const cantPlayers = dayData?.cant || []
  const allPlayers = [...canPlayers.map(p => ({...p,status:'can'})), ...cantPlayers.map(p => ({...p,status:'cant'}))]

  // Number() защита от расхождения типов string vs number
  const myId = Number(user?.id)
  const myCanEntry  = canPlayers.find(p => Number(p.user_id) === myId)
  const myCantEntry = cantPlayers.find(p => Number(p.user_id) === myId)
  const myEntry  = myCanEntry || myCantEntry
  const myStatus = myCanEntry ? 'can' : myCantEntry ? 'cant' : null

  const pendingCount = Math.max(0, teamSize - allPlayers.length)
  const isFull = canPlayers.length >= teamSize

  const wd = ['ВОСКРЕСЕНЬЕ','ПОНЕДЕЛЬНИК','ВТОРНИК','СРЕДА','ЧЕТВЕРГ','ПЯТНИЦА','СУББОТА'][date.getDay()]

  // Восстановить текущее время если уже отмечен
  useEffect(() => {
    if (myEntry?.time_text && myEntry.time_text !== 'anytime') {
      if (myEntry.time_text === 'ALL DAY') {
        setIsAllDay(true)
      } else {
        setTimeInput(myEntry.time_text)
      }
    }
  }, [myId])

  async function handleCan() {
    if (saving) return
    setSaving(true)
    setSlashKey(k => k + 1)
    try {
      const timeText = isAllDay ? 'ALL DAY' : timeInput.trim() || 'anytime'
      const newStatus = myStatus === 'can' ? 'clear' : 'can'
      await onPick(timeText, newStatus)
    } catch(e) {
      console.error('handleCan error:', e)
    } finally {
      setSaving(false)
    }
  }

  async function handleCant() {
    if (saving) return
    setSaving(true)
    setSlashKey(k => k + 1)
    try {
      const newStatus = myStatus === 'cant' ? 'clear' : 'cant'
      await onPick('anytime', newStatus)
    } catch(e) {
      console.error('handleCant error:', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:9999 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(6px)', WebkitBackdropFilter:'blur(6px)' }}
      />
      {/* Modal sheet */}
      <div style={{
        position:'absolute', left:10, right:10, bottom:10,
        background:'#fff', border:'2px solid #000', borderRadius:22,
        padding:'20px 18px 24px',
        boxShadow:`6px 6px 0 ${BC_COLORS.pink}`,
        maxHeight:'85vh', overflowY:'auto', overflowX:'hidden',
        WebkitOverflowScrolling:'touch',
        animation:'bcUnfold 400ms cubic-bezier(0.34,1.56,0.64,1) both',
      }}>

        {/* Halftone угол */}
        <div style={{ position:'absolute',top:0,right:0,width:120,height:120,pointerEvents:'none',backgroundImage:'radial-gradient(rgba(67,97,238,0.3) 0.7px,transparent 1px)',backgroundSize:'6px 6px',maskImage:'radial-gradient(60% 60% at 100% 0%,#000 0%,transparent 70%)',WebkitMaskImage:'radial-gradient(60% 60% at 100% 0%,#000 0%,transparent 70%)',opacity:0.5,borderRadius:'inherit',overflow:'hidden' }}/>

        {/* Закрыть */}
        <button onClick={onClose} style={{ all:'unset',position:'absolute',top:12,right:12,zIndex:8,width:30,height:30,borderRadius:'50%',background:'#fff',border:'1.5px solid #000',display:'grid',placeItems:'center',cursor:'pointer',fontFamily:'"Nunito",system-ui',fontSize:16,fontWeight:800 }}>×</button>

        {/* Заголовок */}
        <div style={{ position:'relative',zIndex:2 }}>
          <div style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:3, fontWeight:800, color:'#6a6a6a' }}>{wd}</div>
          <div style={{ marginTop:2, display:'flex', alignItems:'baseline', gap:10 }}>
            <span style={{ fontFamily:'"Permanent Marker",system-ui', fontSize:64, color:'#000', lineHeight:0.95, letterSpacing:-1 }}>{date.getDate()}</span>
            <span style={{ fontFamily:'"Nunito",system-ui', fontSize:15, letterSpacing:1.6, fontWeight:800, color:'#000' }}>{MONTHS_RU_LONG[date.getMonth()].toLowerCase()}</span>
          </div>
          <svg viewBox="0 0 120 10" width="100" height="7"><path d="M2 5 Q 30 2 60 5 T 118 4" stroke="#4361ee" strokeWidth="3" strokeLinecap="round" fill="none"/></svg>
        </div>

        {isFull && (
          <div style={{ marginTop:12, padding:'10px 14px', borderRadius:10, background:BC_COLORS.pink, border:'1.5px solid #000', fontFamily:'"Nunito",system-ui', fontSize:12, fontWeight:900, letterSpacing:1, color:'#000', textAlign:'center', position:'relative', zIndex:2 }}>
            🔥 ВСЕ В СБОРЕ — МОЖЕМ ИГРАТЬ ПРАК!
          </div>
        )}

        {/* ── Поле времени ── */}
        <div style={{ marginTop:16, position:'relative', zIndex:2 }}>
          <div style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:2.5, fontWeight:800, color:'#6a6a6a', marginBottom:8 }}>КОГДА СМОЖЕШЬ ИГРАТЬ?</div>

          {/* ALL DAY кнопка */}
          <button onClick={() => { setIsAllDay(a => !a); setTimeInput('') }} style={{
            all:'unset', cursor:'pointer',
            display:'inline-flex', alignItems:'center', gap:6,
            padding:'8px 16px', borderRadius:10, marginBottom:10,
            background: isAllDay ? '#000' : '#fff',
            border:'2px solid #000',
            boxShadow: isAllDay ? 'none' : '2px 2px 0 #000',
            fontFamily:'"Permanent Marker",system-ui',
            fontSize:14, letterSpacing:1,
            color: isAllDay ? '#fff' : '#000',
            transition:'all 180ms cubic-bezier(0.34,1.56,0.64,1)',
            transform: isAllDay ? 'translate(2px,2px)' : '',
          }}>
            <span style={{ fontSize:16 }}>{isAllDay ? '✓' : '🌅'}</span>
            ALL DAY
          </button>

          {/* Или конкретное время */}
          {!isAllDay && (
            <div style={{ position:'relative' }}>
              <div style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:1.5, fontWeight:700, color:'#9a9a9a', marginBottom:6 }}>ИЛИ УКАЖИ ВРЕМЯ:</div>
              <input
                ref={inputRef}
                value={timeInput}
                onChange={e => setTimeInput(e.target.value)}
                placeholder="напр. 18:00 или после 20"
                maxLength={30}
                style={{
                  width:'100%', boxSizing:'border-box',
                  padding:'12px 14px',
                  fontFamily:'"Nunito",system-ui', fontSize:15, fontWeight:700, color:'#000',
                  background:'#fafafa', border:'2px solid #000', borderRadius:12,
                  outline:'none', boxShadow:'2px 2px 0 #000',
                  transition:'box-shadow 150ms',
                }}
                onFocus={e => e.target.style.boxShadow = `2px 2px 0 ${BC_COLORS.pink}`}
                onBlur={e => e.target.style.boxShadow = '2px 2px 0 #000'}
              />
            </div>
          )}
        </div>

        {/* ── Список игроков ── */}
        <div style={{ marginTop:16, position:'relative', zIndex:2 }}>
          <div style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:2.5, fontWeight:800, color:'#6a6a6a', marginBottom:8 }}>СОСТАВ</div>
          {allPlayers.map((p, i) => <PlayerRow key={p.user_id} player={p} isMe={p.user_id === user?.id} avatarIndex={i}/>)}
          {Array.from({ length: pendingCount }).map((_, i) => <PendingRow key={`p${i}`} avatarIndex={allPlayers.length + i}/>)}
          {allPlayers.length === 0 && pendingCount === 0 && (
            <div style={{ fontFamily:'"Nunito",system-ui', fontSize:12, color:'#9a9a9a', textAlign:'center', padding:'12px 0' }}>Пока никто не отметился</div>
          )}
        </div>

        {/* ── Кнопки ── */}
        <div style={{ marginTop:14, fontFamily:'"Nunito",system-ui', fontSize:11, letterSpacing:1.6, fontWeight:700, color:'#000', textAlign:'center', position:'relative', zIndex:2 }}>
          СМОЖЕШЬ СЫГРАТЬ?
        </div>
        <div style={{ marginTop:10, display:'flex', gap:10, position:'relative', zIndex:2 }}>
          <ActionBtn active={myStatus === 'can'} color="green" onClick={handleCan} disabled={saving} label="Я СМОГУ" hint={myStatus === 'can' ? 'СНЯТЬ ОТМЕТКУ' : 'ГОТОВ ИГРАТЬ'}/>
          <ActionBtn active={myStatus === 'cant'} color="red" onClick={handleCant} disabled={saving} label="НЕ СМОГУ" hint={myStatus === 'cant' ? 'СНЯТЬ ОТМЕТКУ' : 'НЕ В СОСТАВЕ'}/>
        </div>
      </div>
    </div>
  )
}

function PlayerRow({ player, isMe, avatarIndex }) {
  const status = player.status
  const name = player.display_name || player.username || '?'
  const timeText = player.time_text && player.time_text !== 'anytime' ? player.time_text : null
  const borderColor = status === 'can' ? '#22c55e' : '#ef4444'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:12, marginBottom:6, background: isMe ? (status === 'can' ? '#f0fdf4' : '#fef2f2') : '#fafafa', border: isMe ? `1.5px solid ${borderColor}` : '1px solid #ebebeb' }}>
      <AnimeAvatar playerIndex={avatarIndex} status={status} size={36}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontFamily:'"Nunito",system-ui', fontWeight:900, fontSize:14, letterSpacing:0.5, color:'#000' }}>
          {name}
          {isMe && <span style={{ marginLeft:6, fontFamily:'"Permanent Marker",system-ui', fontSize:11, letterSpacing:1.2, color:'#4361ee' }}>· вы</span>}
        </div>
        {status === 'can' && (
          <div style={{ fontFamily:'"Nunito",system-ui', fontSize:11, fontWeight:700, color:'#22c55e', marginTop:2 }}>
            {timeText ? `🕐 ${timeText}` : '🌅 Весь день'}
          </div>
        )}
      </div>
      <div style={{ fontFamily:'"Nunito",system-ui', fontSize:9, letterSpacing:1.8, fontWeight:800, padding:'4px 10px', borderRadius:999, background: status === 'can' ? '#22c55e' : '#ef4444', color:'#fff', border:'1px solid rgba(0,0,0,0.15)' }}>
        {status === 'can' ? 'ГОТОВ' : 'ПАС'}
      </div>
    </div>
  )
}

function PendingRow({ avatarIndex }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:12, marginBottom:6, background:'rgba(0,0,0,0.02)', border:'1px dashed rgba(0,0,0,0.15)' }}>
      <AnimeAvatar playerIndex={avatarIndex} status="pending" size={36}/>
      <div style={{ fontFamily:'"Nunito",system-ui', fontWeight:700, fontSize:13, color:'#9a9a9a' }}>Ожидаем...</div>
      <div style={{ fontFamily:'"Nunito",system-ui', fontSize:9, letterSpacing:1.8, fontWeight:800, padding:'4px 10px', borderRadius:999, marginLeft:'auto', background:'rgba(107,114,128,0.12)', color:'#6b7280', border:'1px solid rgba(107,114,128,0.25)' }}>ЖДЁМ</div>
    </div>
  )
}

function ActionBtn({ active, color, onClick, disabled, label, hint }) {
  const [pressed, setPressed] = useState(false)
  const handle = (e) => {
    e.stopPropagation()
    if (disabled) return
    setPressed(true)
    setTimeout(() => setPressed(false), 200)
    onClick?.()
  }
  const isGreen = color === 'green'
  const accent = isGreen ? '#22c55e' : '#ef4444'
  const dark = isGreen ? '#16a34a' : '#dc2626'
  return (
    <button
      onClick={handle}
      style={{
        flex:1, padding:'14px 10px', textAlign:'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: active ? accent : '#fff',
        border:`2px solid ${accent}`,
        borderRadius:12,
        boxShadow: active ? `3px 3px 0 ${dark}` : `2px 2px 0 ${accent}40`,
        position:'relative', overflow:'hidden',
        opacity: disabled ? 0.55 : 1,
        transform: pressed ? 'scale(0.95) translate(2px,2px)' : 'scale(1)',
        transition:'transform 200ms cubic-bezier(0.34,1.56,0.64,1), background 200ms',
        pointerEvents: 'all',
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
        fontFamily: 'inherit',
      }}
    >
      <div style={{ fontFamily:'"Nunito",system-ui', fontWeight:900, fontSize:14, letterSpacing:1, color: active ? '#fff' : accent }}>{active ? (isGreen ? '✓ ' : '✗ ') : ''}{label}</div>
      <div style={{ fontFamily:'"Nunito",system-ui', fontSize:9, letterSpacing:2, fontWeight:700, color: active ? 'rgba(255,255,255,0.7)' : accent, opacity:0.8, marginTop:3 }}>{hint}</div>
    </button>
  )
}
