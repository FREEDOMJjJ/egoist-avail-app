import { useState, useEffect, useRef } from 'react'
import { BC_COLORS, WEEKDAYS_RU_SHORT, MONTHS_RU, MONTHS_RU_LONG, isToday, isPast } from './bc-shared'
import { PulseRing } from './bc-effects'
import { AnimeAvatar } from './bc-settings'

// AnimeAvatar imported from bc-settings

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

const TIME_PRESETS = [
  { id: 'morning', label: 'УТРО',  emoji: '🌅', range: '10:00 – 14:00' },
  { id: 'day',     label: 'ДЕНЬ',  emoji: '☀️', range: '14:00 – 19:00' },
  { id: 'night',   label: 'НОЧЬ',  emoji: '🌙', range: '19:00 – 23:00' },
]

export function DayModal({ date, dayData, teamSize, user, onPick, onClose }) {
  const [preset, setPreset]     = useState(null)       // 'morning'/'day'/'night' или null
  const [timeFrom, setTimeFrom] = useState('')          // "18:00"
  const [timeTo, setTimeTo]     = useState('')          // "22:00"
  const [saving, setSaving]     = useState(false)
  const fromRef = useRef(null)
  const toRef   = useRef(null)

  const canPlayers = dayData?.can || []
  const cantPlayers = dayData?.cant || []
  const allPlayers = [...canPlayers.map(p => ({...p,status:'can'})), ...cantPlayers.map(p => ({...p,status:'cant'}))]

  const myId = Number(user?.id)
  const myCanEntry  = canPlayers.find(p => Number(p.user_id) === myId)
  const myCantEntry = cantPlayers.find(p => Number(p.user_id) === myId)
  const myEntry  = myCanEntry || myCantEntry
  const myStatus = myCanEntry ? 'can' : myCantEntry ? 'cant' : null

  const pendingCount = Math.max(0, teamSize - allPlayers.length)
  const isFull = canPlayers.length >= teamSize

  const wd = ['ВОСКРЕСЕНЬЕ','ПОНЕДЕЛЬНИК','ВТОРНИК','СРЕДА','ЧЕТВЕРГ','ПЯТНИЦА','СУББОТА'][date.getDay()]

  // Восстановить выбор пресета или времени
  useEffect(() => {
    const t = myEntry?.time_text
    if (!t || t === 'anytime' || t === 'ALL DAY') return
    // Может быть "MORNING", "DAY", "NIGHT" или "18:00-22:00"
    if (['MORNING','DAY','NIGHT'].includes(t)) {
      setPreset(t.toLowerCase())
    } else if (t.includes('-')) {
      const [a, b] = t.split('-').map(s => s.trim())
      setTimeFrom(a); setTimeTo(b)
    }
  }, [myId])

  function selectPreset(id) {
    setPreset(id)
    setTimeFrom(''); setTimeTo('')
  }

  function onFromChange(v) {
    setTimeFrom(v); setPreset(null)
    // Автопереход на "до" когда введено полное время HH:MM
    if (v.length === 5 && v.includes(':') && toRef.current) {
      setTimeout(() => toRef.current?.focus(), 50)
    }
  }

  async function handleCan() {
    if (saving) return
    setSaving(true)
    try {
      let timeText = 'ALL DAY'
      if (preset) {
        timeText = preset.toUpperCase()
      } else if (timeFrom && timeTo) {
        timeText = `${timeFrom}-${timeTo}`
      } else if (timeFrom) {
        timeText = timeFrom
      }
      const newStatus = myStatus === 'can' ? 'clear' : 'can'
      await onPick(timeText, newStatus)
    } catch(e) {
      console.error('handleCan:', e)
    } finally {
      setSaving(false)
    }
  }

  async function handleCant() {
    if (saving) return
    setSaving(true)
    try {
      const newStatus = myStatus === 'cant' ? 'clear' : 'cant'
      await onPick('anytime', newStatus)
    } catch(e) {
      console.error('handleCant:', e)
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
        <button onClick={onClose} style={{
          position:'absolute', top:14, right:14, zIndex:10,
          width:34, height:34, borderRadius:'50%',
          background:'#000', border:'2px solid #000',
          display:'grid', placeItems:'center', cursor:'pointer',
          boxShadow:'0 2px 8px rgba(0,0,0,0.3)',
          fontSize:18, fontWeight:900, color:'#fff',
          fontFamily:'"Nunito",system-ui',
          lineHeight:1,
        }}>×</button>

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

        {/* ── Выбор времени: пресеты + ручной диапазон ── */}
        <div style={{ marginTop:16, position:'relative', zIndex:2 }}>
          <div style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:2.5, fontWeight:800, color:'#6a6a6a', marginBottom:8 }}>
            КОГДА СМОЖЕШЬ ИГРАТЬ?
          </div>
          <div style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:0.5, fontWeight:600, color:'#9a9a9a', marginBottom:10 }}>
            Если ничего не выбрать — сохранится как ВЕСЬ ДЕНЬ
          </div>

          {/* Пресеты: УТРО / ДЕНЬ / НОЧЬ */}
          <div style={{ display:'flex', gap:6, marginBottom:12 }}>
            {TIME_PRESETS.map(p => {
              const active = preset === p.id
              return (
                <button key={p.id} onClick={() => selectPreset(p.id)} style={{
                  all:'unset', cursor:'pointer', flex:1,
                  padding:'10px 6px', borderRadius:12, textAlign:'center',
                  background: active ? '#000' : '#fff',
                  border:'2px solid #000',
                  boxShadow: active ? 'none' : '2px 2px 0 #000',
                  transition:'transform 180ms cubic-bezier(0.34,1.56,0.64,1)',
                  transform: active ? 'translate(2px,2px)' : '',
                }}>
                  <div style={{ fontSize:20, marginBottom:4 }}>{p.emoji}</div>
                  <div style={{ fontFamily:'"Permanent Marker",system-ui', fontSize:13, letterSpacing:1, color: active ? '#fff' : '#000' }}>{p.label}</div>
                  <div style={{ fontFamily:'"Nunito",system-ui', fontSize:8, fontWeight:800, letterSpacing:0.5, color: active ? 'rgba(255,255,255,0.7)' : '#6a6a6a', marginTop:3 }}>{p.range}</div>
                </button>
              )
            })}
          </div>

          {/* Или вручную: от X до Y (HTML5 type=time → нативный циферблат) */}
          <div style={{
            background:'#fafafa', border:'2px dashed rgba(0,0,0,0.15)', borderRadius:12,
            padding:'12px 14px',
          }}>
            <div style={{ fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:1.5, fontWeight:700, color:'#6a6a6a', marginBottom:8 }}>
              ИЛИ УКАЖИ СВОЁ ВРЕМЯ:
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'"Nunito",system-ui', fontSize:9, fontWeight:800, color:'#9a9a9a', marginBottom:4, letterSpacing:1 }}>С</div>
                <input
                  ref={fromRef}
                  type="time"
                  value={timeFrom}
                  onChange={e => onFromChange(e.target.value)}
                  style={{
                    width:'100%', boxSizing:'border-box',
                    padding:'10px 12px',
                    fontFamily:'"Permanent Marker",system-ui', fontSize:18, color:'#000',
                    background:'#fff', border:'2px solid #000', borderRadius:10,
                    outline:'none',
                    textAlign:'center',
                    appearance:'none', WebkitAppearance:'none',
                  }}
                />
              </div>
              <div style={{ fontFamily:'"Permanent Marker",system-ui', fontSize:20, color:'#000', paddingTop:14 }}>—</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'"Nunito",system-ui', fontSize:9, fontWeight:800, color:'#9a9a9a', marginBottom:4, letterSpacing:1 }}>ДО</div>
                <input
                  ref={toRef}
                  type="time"
                  value={timeTo}
                  onChange={e => { setTimeTo(e.target.value); setPreset(null) }}
                  style={{
                    width:'100%', boxSizing:'border-box',
                    padding:'10px 12px',
                    fontFamily:'"Permanent Marker",system-ui', fontSize:18, color:'#000',
                    background:'#fff', border:'2px solid #000', borderRadius:10,
                    outline:'none',
                    textAlign:'center',
                    appearance:'none', WebkitAppearance:'none',
                  }}
                />
              </div>
            </div>
          </div>
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

function formatTimeText(t) {
  if (!t || t === 'anytime' || t === 'ALL DAY') return '🌅 Весь день'
  if (t === 'MORNING') return '🌅 Утро (10-14)'
  if (t === 'DAY')     return '☀️ День (14-19)'
  if (t === 'NIGHT')   return '🌙 Ночь (19-23)'
  return `🕐 ${t}`
}

function PlayerRow({ player, isMe, avatarIndex }) {
  const status = player.status
  const name = player.display_name || player.username || '?'
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
            {formatTimeText(player.time_text)}
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
