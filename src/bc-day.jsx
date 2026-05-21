import { useState, useEffect } from 'react'
import { BC_COLORS, WEEKDAYS_RU_SHORT, MONTHS_RU, MONTHS_RU_LONG, isToday, isPast } from './bc-shared'
import { PulseRing, InkSlash } from './bc-effects'
import { BigBtn, StatusPill } from './bc-chrome'

// ── Minimal B&W anime heads ───────────────────────────────────────────────────
// No face, just hair silhouettes — clean manga style

const ANIME_HEADS = [
  // 0 — short spiky undercut
  ({ size = 36, ring = '#888' }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <circle cx="30" cy="30" r="28" fill="#fff" stroke={ring} strokeWidth="2.5"/>
      {/* Spiky short hair */}
      <path d="M 8 30 Q 8 12 18 8 L 14 4 L 20 10 L 22 4 L 26 12 L 28 6 L 30 14 L 32 6 L 34 12 L 38 4 L 40 10 L 46 4 L 42 8 Q 52 12 52 30 Q 50 14 40 10 Q 30 6 20 10 Q 10 14 8 30Z" fill="#111"/>
      {/* Face circle */}
      <ellipse cx="30" cy="36" rx="16" ry="15" fill="#f5e8d0"/>
      {/* Shaved sides */}
      <path d="M 8 30 L 10 40" stroke="#d4a882" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
      <path d="M 52 30 L 50 40" stroke="#d4a882" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  // 1 — long messy silver
  ({ size = 36, ring = '#888' }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <circle cx="30" cy="30" r="28" fill="#fff" stroke={ring} strokeWidth="2.5"/>
      {/* Long hair sides */}
      <path d="M 8 28 Q 6 42 8 56 L 14 54 Q 12 42 14 30Z" fill="#ccc"/>
      <path d="M 52 28 Q 54 42 52 56 L 46 54 Q 48 42 46 30Z" fill="#ccc"/>
      {/* Fluffy top */}
      <path d="M 8 28 Q 6 10 18 6 Q 24 2 30 2 Q 36 2 42 6 Q 54 10 52 28 Q 48 10 38 8 L 30 4 L 22 8 Q 12 10 8 28Z" fill="#ddd" stroke="#bbb" strokeWidth="1"/>
      <circle cx="18" cy="14" r="6" fill="#e8e8e8" stroke="#bbb" strokeWidth="0.8"/>
      <circle cx="30" cy="8" r="7" fill="#ececec" stroke="#bbb" strokeWidth="0.8"/>
      <circle cx="42" cy="14" r="6" fill="#e8e8e8" stroke="#bbb" strokeWidth="0.8"/>
      {/* Face */}
      <ellipse cx="30" cy="36" rx="16" ry="15" fill="#f5f0f0"/>
    </svg>
  ),
  // 2 — white spiky Gojo-style (blindfold)
  ({ size = 36, ring = '#888' }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <circle cx="30" cy="30" r="28" fill="#fff" stroke={ring} strokeWidth="2.5"/>
      {/* Wild white spikes */}
      <path d="M 8 32 L 4 18 L 14 26 L 12 8 L 22 20 L 22 4 L 28 18 L 30 2 L 32 18 L 38 4 L 38 20 L 48 8 L 46 26 L 56 18 L 52 32 Q 46 14 30 12 Q 14 14 8 32Z" fill="#f0f0f0" stroke="#ccc" strokeWidth="1"/>
      {/* Face */}
      <ellipse cx="30" cy="38" rx="16" ry="15" fill="#f5e8d0"/>
      {/* Blue blindfold strip */}
      <rect x="14" y="33" width="32" height="8" rx="3" fill="#4361ee"/>
      <circle cx="21" cy="37" r="1.2" fill="#4cc9f0" opacity="0.9"/>
      <circle cx="30" cy="37" r="1.2" fill="#4cc9f0" opacity="0.9"/>
      <circle cx="39" cy="37" r="1.2" fill="#4cc9f0" opacity="0.9"/>
    </svg>
  ),
  // 3 — wavy blonde soft
  ({ size = 36, ring = '#888' }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <circle cx="30" cy="30" r="28" fill="#fff" stroke={ring} strokeWidth="2.5"/>
      {/* Wavy hair -->
      <path d="M 10 30 Q 8 14 18 8 Q 24 4 30 4 Q 36 4 42 8 Q 52 14 50 30 Q 46 12 36 8 L 30 6 L 24 8 Q 14 12 10 30Z" fill="#e8d050" stroke="#c8b030" strokeWidth="1"/>
      {/* Wave strands */}
      <path d="M 12 20 Q 8 30 10 40 Q 12 36 12 28Z" fill="#dcc040"/>
      <path d="M 48 20 Q 52 30 50 40 Q 48 36 48 28Z" fill="#dcc040"/>
      <path d="M 18 8 Q 14 20 16 32" stroke="#c8b030" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M 42 8 Q 46 20 44 32" stroke="#c8b030" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Face */}
      <ellipse cx="30" cy="36" rx="16" ry="15" fill="#fef0e0"/>
    </svg>
  ),
  // 4 — dark short sharp
  ({ size = 36, ring = '#888' }) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      <circle cx="30" cy="30" r="28" fill="#fff" stroke={ring} strokeWidth="2.5"/>
      {/* Dark sharp styled hair */}
      <path d="M 10 30 Q 8 14 18 8 Q 24 4 30 4 Q 36 4 42 8 Q 52 14 50 30 Q 46 12 36 8 L 30 4 L 24 8 Q 14 12 10 30Z" fill="#111" stroke="#1a1a1a" strokeWidth="0.8"/>
      {/* Styled front tufts */}
      <path d="M 20 10 L 14 28 L 24 22 Z" fill="#1a1a1a"/>
      <path d="M 28 6 L 24 26 L 32 20 Z" fill="#222"/>
      <path d="M 36 8 L 38 26 L 44 20 Z" fill="#1a1a1a"/>
      {/* Blue sheen */}
      <path d="M 28 6 L 26 12 L 30 10Z" fill="#4361ee" opacity="0.4"/>
      <path d="M 36 8 L 38 14 L 34 12Z" fill="#4361ee" opacity="0.3"/>
      {/* Face */}
      <ellipse cx="30" cy="36" rx="16" ry="15" fill="#f5e8d0"/>
    </svg>
  ),
]

// ── Avatar ring: green=can, red=cant, gray=pending ────────────────────────────

function AnimeAvatar({ index, status, size = 36 }) {
  const HeadComp = ANIME_HEADS[index % ANIME_HEADS.length]
  const ring = status === 'can' ? '#22c55e' : status === 'cant' ? '#ef4444' : '#4b5563'
  const glow = status === 'can' ? 'rgba(34,197,94,0.3)' : status === 'cant' ? 'rgba(239,68,68,0.3)' : 'transparent'
  return (
    <div style={{
      borderRadius: '50%',
      border: `2.5px solid ${ring}`,
      boxShadow: `0 0 10px ${glow}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: '#fff', flexShrink: 0,
      transition: 'all 300ms cubic-bezier(0.16,1,0.3,1)',
    }}>
      <HeadComp size={size} ring={ring}/>
    </div>
  )
}

// ── DayCard ───────────────────────────────────────────────────────────────────

export function DayCard({ date, daySlots, timeSlots, teamSize, onClick, justChanged }) {
  const today = isToday(date)
  const past  = isPast(date) && !today
  const [popKey, setPopKey] = useState(0)
  useEffect(() => { if (justChanged) setPopKey(k => k + 1) }, [justChanged])

  const slotCounts = timeSlots.map(ts => ({ ...ts, can: daySlots[ts.id]?.can?.length || 0 }))
  const bestCount  = Math.max(0, ...slotCounts.map(s => s.can))
  const fullRoster = bestCount >= teamSize
  const statusLabel = fullRoster ? 'СОСТАВ ГОТОВ' : bestCount === 0 ? 'ЖДЁМ ВСЕХ' : bestCount >= teamSize - 1 ? 'ПОЧТИ ГОТОВ' : 'НЕПОЛНЫЙ'

  const SLOT_ICONS = ['🌄', '⛅', '🌙']

  return (
    <button onClick={onClick} className={justChanged ? 'bc-day-pop' : ''} style={{
      all: 'unset', display: 'block', width: '100%',
      position: 'relative', borderRadius: 16, cursor: 'pointer',
      padding: '12px 14px',
      background: today ? 'rgba(255,255,255,0.97)' : past ? 'rgba(241,238,234,0.78)' : 'rgba(255,255,255,0.9)',
      border: '1.5px solid #000',
      boxShadow: today ? `4px 4px 0 ${BC_COLORS.pink}, 0 8px 24px rgba(0,0,0,0.25)` : '3px 3px 0 #000',
      opacity: past ? 0.82 : 1, boxSizing: 'border-box',
      transition: 'transform 240ms cubic-bezier(0.32, 0.72, 0, 1)',
    }}>
      {today && <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(67,97,238,0.3) 0.6px, transparent 1px)', backgroundSize: '5px 5px', maskImage: 'linear-gradient(120deg, #000 0%, transparent 55%)', WebkitMaskImage: 'linear-gradient(120deg, #000 0%, transparent 55%)', opacity: 0.5 }}/>}
      {justChanged && <PulseRing k={popKey} color={BC_COLORS.pink} size={120}/>}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
        <div style={{ width: 48, flexShrink: 0 }}>
          <div style={{ fontFamily: '"Nunito", system-ui', fontSize: 10, letterSpacing: 2.2, fontWeight: 800, color: today ? '#000' : '#6a6a6a' }}>{WEEKDAYS_RU_SHORT[date.getDay()]}</div>
          <div style={{ fontFamily: '"Permanent Marker", system-ui', fontSize: 36, lineHeight: 0.95, color: '#000', marginTop: 2, letterSpacing: -1 }}>{date.getDate()}</div>
          <div style={{ fontFamily: '"Nunito", system-ui', fontSize: 8, letterSpacing: 1.4, fontWeight: 700, color: '#6a6a6a', marginTop: 2 }}>{MONTHS_RU[date.getMonth()]}</div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {slotCounts.map((ts, i) => {
              const full = ts.can >= teamSize
              return (
                <div key={ts.id} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 8, background: full ? BC_COLORS.pink : ts.can > 0 ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.03)', border: full ? '1px solid #000' : '1px solid rgba(0,0,0,0.1)' }}>
                  <span style={{ fontSize: 14 }}>{SLOT_ICONS[i]}</span>
                  <span style={{ fontFamily: '"Nunito", system-ui', fontWeight: 800, fontSize: 11, color: full ? '#000' : ts.can > 0 ? '#000' : '#9a9a9a' }}>{ts.can}/{teamSize}</span>
                </div>
              )
            })}
          </div>
          <div style={{ marginTop: 7, fontFamily: '"Nunito", system-ui', fontSize: 10, letterSpacing: 1.4, fontWeight: 800, display: 'flex', gap: 8, alignItems: 'center' }}>
            {fullRoster
              ? <span style={{ color: '#000', background: BC_COLORS.pink, padding: '2px 6px', borderRadius: 4, border: '1px solid #000' }}>СОСТАВ ГОТОВ</span>
              : <span style={{ color: '#6a6a6a' }}>{statusLabel}</span>}
            {today && <span style={{ marginLeft: 'auto', fontFamily: '"Permanent Marker", system-ui', fontSize: 12, color: '#4361ee' }}>· СЕГОДНЯ</span>}
          </div>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 42 }}>
          <div style={{ fontFamily: '"Permanent Marker", system-ui', fontSize: 28, lineHeight: 1, color: '#000' }}>{bestCount}<span style={{ color: '#9a9a9a', fontSize: 16 }}>/{teamSize}</span></div>
          <div style={{ fontFamily: '"Nunito", system-ui', fontSize: 8, letterSpacing: 2, fontWeight: 700, color: '#6a6a6a', marginTop: 3 }}>В ИГРЕ</div>
        </div>
      </div>
    </button>
  )
}

export function WeekHeader({ index, days }) {
  const start = days[0], end = days[days.length - 1]
  const sameMonth = start.getMonth() === end.getMonth()
  const range = sameMonth ? `${start.getDate()}–${end.getDate()} ${MONTHS_RU[start.getMonth()]}` : `${start.getDate()} ${MONTHS_RU[start.getMonth()]} – ${end.getDate()} ${MONTHS_RU[end.getMonth()]}`
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '16px 2px 8px', borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: 10 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{ fontFamily: '"Permanent Marker", system-ui', fontSize: 14, color: BC_COLORS.pink }}>{index === 0 ? '#1' : '#2'}</span>
        <span style={{ fontFamily: '"Nunito", system-ui', fontSize: 11, letterSpacing: 2.5, fontWeight: 800, color: '#fff' }}>{index === 0 ? 'ТЕКУЩАЯ НЕДЕЛЯ' : 'СЛЕДУЮЩАЯ НЕДЕЛЯ'}</span>
      </div>
      <span style={{ fontFamily: '"Nunito", system-ui', fontSize: 10, letterSpacing: 1.4, fontWeight: 700, color: 'rgba(255,255,255,0.45)' }}>{range}</span>
    </div>
  )
}

// ── DayModal ──────────────────────────────────────────────────────────────────

export function DayModal({ date, daySlots, timeSlots, teamSize, user, onPick, onClose }) {
  const [selectedSlotId, setSelectedSlotId] = useState(timeSlots[0]?.id || '')
  const [slashKey, setSlashKey] = useState(1)
  const [saving, setSaving] = useState(false)
  const SLOT_ICONS = ['🌄', '⛅', '🌙']
  const slotData   = daySlots[selectedSlotId] || { can: [], cant: [] }
  const yourCan    = slotData.can.find(p => p.user_id === user?.id)
  const yourCant   = slotData.cant.find(p => p.user_id === user?.id)
  const yourStatus = yourCan ? 'can' : yourCant ? 'cant' : null
  const isFullHouse = slotData.can.length >= teamSize
  const wd = ['ВОСКРЕСЕНЬЕ','ПОНЕДЕЛЬНИК','ВТОРНИК','СРЕДА','ЧЕТВЕРГ','ПЯТНИЦА','СУББОТА'][date.getDay()]
  const allPlayers = [...slotData.can.map(p => ({...p, status:'can'})), ...slotData.cant.map(p => ({...p, status:'cant'}))]
  const pendingCount = Math.max(0, teamSize - allPlayers.length)

  async function handlePick(newStatus) {
    if (saving) return
    setSaving(true)
    setSlashKey(k => k + 1)
    const finalStatus = yourStatus === newStatus ? 'clear' : newStatus
    await onPick(selectedSlotId, finalStatus)
    setSaving(false)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100 }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', animation: 'bcFade .28s cubic-bezier(0.32,0.72,0,1)' }}/>
      <div style={{ position: 'absolute', left: 10, right: 10, bottom: 10, background: 'rgba(255,255,255,0.94)', border: '2px solid #000', borderRadius: 22, padding: '20px 18px 16px', boxShadow: `6px 6px 0 ${BC_COLORS.pink}, 0 18px 60px rgba(0,0,0,0.45)`, backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)', animation: 'bcUnfold 460ms cubic-bezier(0.32,0.72,0,1) both', maxHeight: '88vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, pointerEvents: 'none', backgroundImage: 'radial-gradient(rgba(67,97,238,0.4) 0.7px, transparent 1.1px)', backgroundSize: '6px 6px', maskImage: 'radial-gradient(70% 70% at 100% 0%, #000 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(70% 70% at 100% 0%, #000 0%, transparent 70%)', opacity: 0.6 }}/>
        <InkSlash k={slashKey}/>
        <button onClick={onClose} style={{ all: 'unset', position: 'absolute', top: 12, right: 12, zIndex: 8, width: 30, height: 30, borderRadius: '50%', background: '#fff', border: '1.5px solid #000', display: 'grid', placeItems: 'center', cursor: 'pointer', fontFamily: '"Nunito", system-ui', fontSize: 16, fontWeight: 800, color: '#000' }}>×</button>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: '"Nunito", system-ui', fontSize: 10, letterSpacing: 3, fontWeight: 800, color: '#6a6a6a' }}>{wd}</div>
          <div style={{ marginTop: 2, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: '"Permanent Marker", system-ui', fontSize: 64, color: '#000', lineHeight: 0.95, letterSpacing: -1 }}>{date.getDate()}</span>
            <span style={{ fontFamily: '"Nunito", system-ui', fontSize: 15, letterSpacing: 1.6, fontWeight: 800, color: '#000' }}>{MONTHS_RU_LONG[date.getMonth()].toLowerCase()}</span>
          </div>
          <svg viewBox="0 0 120 10" width="100" height="7" style={{ display: 'block', marginTop: 4 }}><path d="M2 5 Q 30 2 60 5 T 118 4" stroke="#4361ee" strokeWidth="3" strokeLinecap="round" fill="none"/></svg>
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 6, position: 'relative', zIndex: 2 }}>
          {timeSlots.map((ts, i) => {
            const cnt = daySlots[ts.id]?.can?.length || 0
            const active = selectedSlotId === ts.id
            const full = cnt >= teamSize
            return (
              <button key={ts.id} onClick={() => setSelectedSlotId(ts.id)} style={{ all: 'unset', cursor: 'pointer', flex: 1, padding: '8px 6px', borderRadius: 10, textAlign: 'center', background: active ? '#000' : full ? '#f0f4ff' : '#f5f5f5', border: active ? '1.5px solid #000' : full ? '1.5px solid #4361ee' : '1.5px solid rgba(0,0,0,0.12)', transition: 'all 200ms' }}>
                <div style={{ fontSize: 20 }}>{SLOT_ICONS[i]}</div>
                <div style={{ fontFamily: '"Nunito", system-ui', fontWeight: 800, fontSize: 10, letterSpacing: 0.8, color: active ? 'rgba(255,255,255,0.65)' : '#6a6a6a', marginTop: 3 }}>{ts.hours}</div>
                <div style={{ fontFamily: '"Permanent Marker", system-ui', fontSize: 14, color: active ? BC_COLORS.pink : full ? '#4361ee' : '#000', marginTop: 2 }}>{cnt}/{teamSize}</div>
              </button>
            )
          })}
        </div>

        {isFullHouse && <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, position: 'relative', zIndex: 2, background: BC_COLORS.pink, border: '1.5px solid #000', fontFamily: '"Nunito", system-ui', fontSize: 12, fontWeight: 900, letterSpacing: 1, color: '#000', textAlign: 'center' }}>🔥 ВСЕ В СБОРЕ — МОЖЕМ ИГРАТЬ ПРАК!</div>}

        <div style={{ marginTop: 14, position: 'relative', zIndex: 2 }}>
          <div style={{ fontFamily: '"Nunito", system-ui', fontSize: 10, letterSpacing: 2.5, fontWeight: 800, color: '#6a6a6a', marginBottom: 8 }}>СОСТАВ СЛОТА</div>
          {allPlayers.map((p, i) => <PlayerRow key={p.user_id} player={p} status={p.status} isMe={p.user_id === user?.id} avatarIndex={i}/>)}
          {Array.from({ length: pendingCount }).map((_, i) => <PendingRow key={`p${i}`} avatarIndex={allPlayers.length + i}/>)}
          {allPlayers.length === 0 && pendingCount === 0 && <div style={{ fontFamily: '"Nunito", system-ui', fontSize: 12, color: '#9a9a9a', textAlign: 'center', padding: '12px 0' }}>Пока никто не отметился</div>}
        </div>

        <div style={{ marginTop: 12, fontFamily: '"Nunito", system-ui', fontSize: 11, letterSpacing: 1.6, fontWeight: 700, color: '#000', textAlign: 'center', position: 'relative', zIndex: 2 }}>СМОЖЕШЬ В ЭТОТ СЛОТ?</div>

        <div style={{ marginTop: 10, display: 'flex', gap: 10, position: 'relative', zIndex: 2 }}>
          <ActionBtn active={yourStatus === 'can'} color="green" onClick={() => handlePick('can')} disabled={saving} label="Я СМОГУ" hint="ДОСТУПЕН"/>
          <ActionBtn active={yourStatus === 'cant'} color="red" onClick={() => handlePick('cant')} disabled={saving} label="Я НЕ СМОГУ" hint="НЕ В СОСТАВЕ"/>
        </div>
      </div>
    </div>
  )
}

function ActionBtn({ active, color, onClick, disabled, label, hint }) {
  const [pressed, setPressed] = useState(false)
  const [ripple, setRipple] = useState(false)
  const handle = () => {
    if (disabled) return
    setPressed(true); setRipple(true)
    setTimeout(() => setPressed(false), 200)
    setTimeout(() => setRipple(false), 500)
    onClick?.()
  }
  const isGreen = color === 'green'
  const bg = active ? (isGreen ? '#22c55e' : '#ef4444') : '#fff'
  const border = isGreen ? '#22c55e' : '#ef4444'
  const textColor = active ? '#fff' : isGreen ? '#22c55e' : '#ef4444'
  return (
    <button onClick={handle} disabled={disabled} style={{ all: 'unset', flex: 1, padding: '14px 10px', textAlign: 'center', cursor: disabled ? 'not-allowed' : 'pointer', background: bg, border: `2px solid ${border}`, borderRadius: 12, boxShadow: active ? `3px 3px 0 ${isGreen ? '#16a34a' : '#dc2626'}` : `2px 2px 0 ${border}40`, position: 'relative', overflow: 'hidden', opacity: disabled ? 0.55 : 1, transform: pressed ? 'scale(0.95) translate(2px,2px)' : 'scale(1)', transition: 'transform 200ms cubic-bezier(0.2,0.8,0.2,1), background 200ms' }}>
      {ripple && <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: isGreen ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)', animation: 'bcRipple 500ms ease-out forwards', pointerEvents: 'none' }}/>}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: '"Nunito", system-ui', fontWeight: 900, fontSize: 14, letterSpacing: 1, color: textColor }}>{active ? (isGreen ? '✓ ' : '✗ ') : ''}{label}</div>
        <div style={{ fontFamily: '"Nunito", system-ui', fontSize: 9, letterSpacing: 2, fontWeight: 700, color: textColor, opacity: 0.65, marginTop: 3 }}>{hint}</div>
      </div>
      <style>{`@keyframes bcRipple{from{transform:scale(0);opacity:1}to{transform:scale(2.5);opacity:0}}`}</style>
    </button>
  )
}

function PlayerRow({ player, status, isMe, avatarIndex }) {
  const name = player.display_name || player.username || '?'
  const showAt = player.username && `@${player.username}` !== name
  const borderColor = status === 'can' ? '#22c55e' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12, marginBottom: 6, background: isMe ? (status === 'can' ? '#f0fdf4' : '#fef2f2') : '#fafafa', border: isMe ? `1.5px solid ${borderColor}` : '1px solid #ebebeb', transition: 'all 200ms' }}>
      <AnimeAvatar index={avatarIndex} status={status} size={32}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: '"Nunito", system-ui', fontWeight: 900, fontSize: 14, letterSpacing: 0.5, color: '#000' }}>
          {name}{isMe && <span style={{ marginLeft: 6, fontFamily: '"Permanent Marker", system-ui', fontSize: 11, letterSpacing: 1.2, color: '#4361ee', fontWeight: 400 }}>· вы</span>}
        </div>
        {showAt && <div style={{ fontFamily: '"Nunito", system-ui', fontSize: 9, letterSpacing: 1.6, fontWeight: 700, color: '#6a6a6a', marginTop: 2 }}>@{player.username}</div>}
      </div>
      <div style={{ fontFamily: '"Nunito", system-ui', fontSize: 9, letterSpacing: 1.8, fontWeight: 800, padding: '4px 10px', borderRadius: 999, background: status === 'can' ? '#22c55e' : '#ef4444', color: '#fff', border: '1px solid rgba(0,0,0,0.15)' }}>
        {status === 'can' ? 'ГОТОВ' : 'ПАС'}
      </div>
    </div>
  )
}

function PendingRow({ avatarIndex }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12, marginBottom: 6, background: 'rgba(0,0,0,0.02)', border: '1px dashed rgba(0,0,0,0.15)' }}>
      <AnimeAvatar index={avatarIndex} status="pending" size={32}/>
      <div style={{ fontFamily: '"Nunito", system-ui', fontWeight: 700, fontSize: 13, color: '#9a9a9a' }}>Ожидаем...</div>
      <div style={{ fontFamily: '"Nunito", system-ui', fontSize: 9, letterSpacing: 1.8, fontWeight: 800, padding: '4px 10px', borderRadius: 999, marginLeft: 'auto', background: 'rgba(107,114,128,0.12)', color: '#6b7280', border: '1px solid rgba(107,114,128,0.25)' }}>ЖДЁМ</div>
    </div>
  )
}
