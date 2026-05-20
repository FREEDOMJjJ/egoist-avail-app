import { useState, useEffect } from 'react'
import { BC_COLORS, WEEKDAYS_RU_SHORT, MONTHS_RU, MONTHS_RU_LONG, isToday, isPast } from './bc-shared'
import { PulseRing, InkSlash } from './bc-effects'
import { BigBtn, StatusPill } from './bc-chrome'

// DayCard — white manga panel per day
// daySlots: { [slotId]: { can: [...users], cant: [...users] } }
export function DayCard({ date, daySlots, timeSlots, teamSize, onClick, justChanged }) {
  const today = isToday(date)
  const past  = isPast(date) && !today

  const [popKey, setPopKey] = useState(0)
  useEffect(() => { if (justChanged) setPopKey(k => k + 1) }, [justChanged])

  const slotCounts = timeSlots.map(ts => ({
    ...ts,
    can: daySlots[ts.id]?.can?.length || 0,
  }))
  const bestCount  = Math.max(0, ...slotCounts.map(s => s.can))
  const fullRoster = bestCount >= teamSize

  const statusLabel = fullRoster
    ? 'СОСТАВ ГОТОВ'
    : bestCount === 0
    ? 'ЖДЁМ ВСЕХ'
    : bestCount >= teamSize - 1
    ? 'ПОЧТИ ГОТОВ'
    : 'НЕПОЛНЫЙ'

  return (
    <button
      onClick={onClick}
      className={justChanged ? 'bc-day-pop' : ''}
      style={{
        all: 'unset', display: 'block', width: '100%',
        position: 'relative', borderRadius: 16, cursor: 'pointer',
        padding: '12px 14px',
        background: today
          ? 'rgba(255,255,255,0.95)'
          : past ? 'rgba(241,238,234,0.78)' : 'rgba(255,255,255,0.88)',
        border: '1.5px solid #000',
        boxShadow: today
          ? `4px 4px 0 ${BC_COLORS.pink}, inset 0 1px 0 rgba(255,255,255,0.9), 0 8px 24px rgba(0,0,0,0.25)`
          : '3px 3px 0 #000, inset 0 1px 0 rgba(255,255,255,0.7)',
        opacity: past ? 0.82 : 1,
        boxSizing: 'border-box',
        backdropFilter: 'blur(22px) saturate(170%)',
        WebkitBackdropFilter: 'blur(22px) saturate(170%)',
        transition: 'transform 240ms cubic-bezier(0.32, 0.72, 0, 1)',
        willChange: 'transform',
      }}
    >
      {/* halftone wash on today */}
      {today && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,153,204,0.5) 0.6px, transparent 1.0px)',
          backgroundSize: '5px 5px',
          maskImage: 'linear-gradient(120deg, #000 0%, transparent 55%)',
          WebkitMaskImage: 'linear-gradient(120deg, #000 0%, transparent 55%)',
          opacity: 0.6,
        }} />
      )}

      {justChanged && <PulseRing k={popKey} color={BC_COLORS.pink} size={120} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
        {/* date column */}
        <div style={{ width: 48, flexShrink: 0 }}>
          <div style={{
            fontFamily: '"Nunito", system-ui',
            fontSize: 10, letterSpacing: 2.2, fontWeight: 800,
            color: today ? '#000' : '#6a6a6a',
          }}>
            {WEEKDAYS_RU_SHORT[date.getDay()]}
          </div>
          <div style={{
            fontFamily: '"Permanent Marker", "Rock Salt", system-ui',
            fontSize: 36, lineHeight: 0.95, color: '#000', marginTop: 2, letterSpacing: -1,
          }}>
            {date.getDate()}
          </div>
          <div style={{
            fontFamily: '"Nunito", system-ui',
            fontSize: 8, letterSpacing: 1.4, fontWeight: 700,
            color: '#6a6a6a', marginTop: 2,
          }}>
            {MONTHS_RU[date.getMonth()]}
          </div>
        </div>

        {/* middle: slot pills + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {slotCounts.map(ts => {
              const full = ts.can >= teamSize
              return (
                <div key={ts.id} style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: '4px 8px', borderRadius: 8,
                  background: full ? BC_COLORS.pink : ts.can > 0 ? 'rgba(0,0,0,0.06)' : 'rgba(0,0,0,0.03)',
                  border: full ? '1px solid #000' : '1px solid rgba(0,0,0,0.10)',
                }}>
                  <span style={{ fontSize: 12 }}>{ts.emoji}</span>
                  <span style={{
                    fontFamily: '"Nunito", system-ui', fontWeight: 800, fontSize: 11,
                    color: full ? '#000' : ts.can > 0 ? '#000' : '#9a9a9a',
                    letterSpacing: 0.3,
                  }}>{ts.can}/{teamSize}</span>
                </div>
              )
            })}
          </div>
          <div style={{
            marginTop: 7,
            fontFamily: '"Nunito", system-ui',
            fontSize: 10, letterSpacing: 1.4, fontWeight: 800,
            display: 'flex', gap: 8, alignItems: 'center',
          }}>
            {fullRoster
              ? (
                <span style={{
                  color: '#000', background: BC_COLORS.pink,
                  padding: '2px 6px', borderRadius: 4, border: '1px solid #000',
                }}>СОСТАВ ГОТОВ</span>
              )
              : <span style={{ color: '#6a6a6a' }}>{statusLabel}</span>
            }
            {today && (
              <span style={{
                marginLeft: 'auto',
                fontFamily: '"Permanent Marker", system-ui',
                fontSize: 12, color: BC_COLORS.pink, letterSpacing: 1.5,
              }}>· СЕГОДНЯ</span>
            )}
          </div>
        </div>

        {/* right: best count */}
        <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 42 }}>
          <div style={{
            fontFamily: '"Permanent Marker", system-ui',
            fontSize: 28, lineHeight: 1, color: '#000',
          }}>
            {bestCount}<span style={{ color: '#9a9a9a', fontSize: 16 }}>/{teamSize}</span>
          </div>
          <div style={{
            fontFamily: '"Nunito", system-ui',
            fontSize: 8, letterSpacing: 2, fontWeight: 700,
            color: '#6a6a6a', marginTop: 3,
          }}>В ИГРЕ</div>
        </div>
      </div>
    </button>
  )
}

// WeekHeader — section divider
export function WeekHeader({ index, days }) {
  const start = days[0], end = days[days.length - 1]
  const sameMonth = start.getMonth() === end.getMonth()
  const range = sameMonth
    ? `${start.getDate()}–${end.getDate()} ${MONTHS_RU[start.getMonth()]}`
    : `${start.getDate()} ${MONTHS_RU[start.getMonth()]} – ${end.getDate()} ${MONTHS_RU[end.getMonth()]}`

  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      padding: '16px 2px 8px',
      borderBottom: '1px solid rgba(255,255,255,0.12)',
      marginBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
        <span style={{
          fontFamily: '"Permanent Marker", system-ui',
          fontSize: 14, color: BC_COLORS.pink, letterSpacing: 1,
        }}>{index === 0 ? '#1' : '#2'}</span>
        <span style={{
          fontFamily: '"Nunito", system-ui',
          fontSize: 11, letterSpacing: 2.5, fontWeight: 800, color: '#fff',
        }}>{index === 0 ? 'ТЕКУЩАЯ НЕДЕЛЯ' : 'СЛЕДУЮЩАЯ НЕДЕЛЯ'}</span>
      </div>
      <span style={{
        fontFamily: '"Nunito", system-ui',
        fontSize: 10, letterSpacing: 1.4, fontWeight: 700,
        color: 'rgba(255,255,255,0.45)',
      }}>{range}</span>
    </div>
  )
}

// DayModal — slides up from bottom, slot tabs + can/cant list + action buttons
// onPick(slotId, status) where status = 'can' | 'cant' | 'clear'
export function DayModal({ date, daySlots, timeSlots, teamSize, user, onPick, onClose }) {
  const [selectedSlotId, setSelectedSlotId] = useState(timeSlots[0]?.id || '')
  const [slashKey, setSlashKey] = useState(1)
  const [saving, setSaving] = useState(false)

  const slotData  = daySlots[selectedSlotId] || { can: [], cant: [] }
  const yourCan   = slotData.can.find(p => p.user_id === user.id)
  const yourCant  = slotData.cant.find(p => p.user_id === user.id)
  const yourStatus = yourCan ? 'can' : yourCant ? 'cant' : null
  const isFullHouse = slotData.can.length >= teamSize
  const wd = ['ВОСКРЕСЕНЬЕ','ПОНЕДЕЛЬНИК','ВТОРНИК','СРЕДА','ЧЕТВЕРГ','ПЯТНИЦА','СУББОТА'][date.getDay()]

  async function handlePick(newStatus) {
    if (saving) return
    setSaving(true)
    setSlashKey(k => k + 1)
    const finalStatus = yourStatus === newStatus ? 'clear' : newStatus
    await onPick(selectedSlotId, finalStatus)
    setSaving(false)
  }

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'auto' }}>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.32)',
        backdropFilter: 'blur(8px) saturate(140%)',
        WebkitBackdropFilter: 'blur(8px) saturate(140%)',
        animation: 'bcFade .28s cubic-bezier(0.32, 0.72, 0, 1)',
      }} />

      {/* paper card */}
      <div style={{
        position: 'absolute', left: 10, right: 10, bottom: 10,
        background: 'rgba(255,255,255,0.92)',
        border: '2px solid #000', borderRadius: 22,
        padding: '20px 18px 16px',
        boxShadow: `6px 6px 0 ${BC_COLORS.pink}, 0 18px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.9)`,
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        transformOrigin: '50% 100%',
        animation: 'bcUnfold 460ms cubic-bezier(0.32, 0.72, 0, 1) both',
        maxHeight: '88vh', overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {/* halftone corner */}
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 160, height: 160,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(rgba(255,153,204,0.7) 0.7px, transparent 1.1px)',
          backgroundSize: '6px 6px',
          maskImage: 'radial-gradient(70% 70% at 100% 0%, #000 0%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(70% 70% at 100% 0%, #000 0%, transparent 70%)',
          opacity: 0.65,
        }} />
        <InkSlash k={slashKey} />

        {/* close button */}
        <button onClick={onClose} style={{
          all: 'unset', position: 'absolute', top: 12, right: 12, zIndex: 8,
          width: 30, height: 30, borderRadius: '50%',
          background: '#fff', border: '1.5px solid #000',
          display: 'grid', placeItems: 'center', cursor: 'pointer',
          fontFamily: '"Nunito", system-ui', fontSize: 16, fontWeight: 800, color: '#000', lineHeight: 1,
        }}>×</button>

        {/* date header */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            fontFamily: '"Nunito", system-ui',
            fontSize: 10, letterSpacing: 3, fontWeight: 800, color: '#6a6a6a',
          }}>{wd}</div>
          <div style={{ marginTop: 2, display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{
              fontFamily: '"Permanent Marker", system-ui',
              fontSize: 64, color: '#000', lineHeight: 0.95, letterSpacing: -1,
            }}>{date.getDate()}</span>
            <span style={{
              fontFamily: '"Nunito", system-ui',
              fontSize: 15, letterSpacing: 1.6, fontWeight: 800, color: '#000',
            }}>{MONTHS_RU_LONG[date.getMonth()].toLowerCase()}</span>
          </div>
          <svg viewBox="0 0 120 10" width="100" height="7" style={{ display: 'block', marginTop: 4 }}>
            <path d="M2 5 Q 30 2 60 5 T 118 4" stroke={BC_COLORS.pink} strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        </div>

        {/* slot tabs */}
        <div style={{ marginTop: 14, display: 'flex', gap: 6, position: 'relative', zIndex: 2 }}>
          {timeSlots.map(ts => {
            const cnt    = daySlots[ts.id]?.can?.length || 0
            const active = selectedSlotId === ts.id
            const full   = cnt >= teamSize
            return (
              <button key={ts.id} onClick={() => setSelectedSlotId(ts.id)} style={{
                all: 'unset', cursor: 'pointer', flex: 1,
                padding: '8px 6px', borderRadius: 10, textAlign: 'center',
                background: active ? '#000' : full ? '#fff0f6' : '#f5f5f5',
                border: active ? '1.5px solid #000' : full ? `1.5px solid ${BC_COLORS.pink}` : '1.5px solid rgba(0,0,0,0.12)',
                transition: 'all 200ms',
              }}>
                <div style={{ fontSize: 18 }}>{ts.emoji}</div>
                <div style={{
                  fontFamily: '"Nunito", system-ui', fontWeight: 800, fontSize: 10,
                  letterSpacing: 0.8, color: active ? 'rgba(255,255,255,0.65)' : '#6a6a6a', marginTop: 3,
                }}>{ts.hours}</div>
                <div style={{
                  fontFamily: '"Permanent Marker", system-ui', fontSize: 14,
                  color: active ? BC_COLORS.pink : full ? BC_COLORS.pink : '#000', marginTop: 2,
                }}>{cnt}/{teamSize}</div>
              </button>
            )
          })}
        </div>

        {/* full house banner */}
        {isFullHouse && (
          <div style={{
            marginTop: 12, padding: '10px 14px', borderRadius: 10, position: 'relative', zIndex: 2,
            background: BC_COLORS.pink, border: '1.5px solid #000',
            fontFamily: '"Nunito", system-ui', fontSize: 12, fontWeight: 900, letterSpacing: 1,
            color: '#000', textAlign: 'center',
          }}>🔥 ВСЕ В СБОРЕ — МОЖЕМ ИГРАТЬ ПРАК!</div>
        )}

        {/* roster */}
        <div style={{ marginTop: 14, position: 'relative', zIndex: 2 }}>
          {slotData.can.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{
                fontFamily: '"Nunito", system-ui', fontSize: 10, letterSpacing: 2.5, fontWeight: 800,
                color: '#6a6a6a', marginBottom: 6,
              }}>✓ МОГУТ ИГРАТЬ ({slotData.can.length}/{teamSize})</div>
              {slotData.can.map(p => (
                <PlayerRow key={p.user_id} player={p} status="can" isMe={p.user_id === user.id} />
              ))}
            </div>
          )}

          {slotData.cant.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{
                fontFamily: '"Nunito", system-ui', fontSize: 10, letterSpacing: 2.5, fontWeight: 800,
                color: '#6a6a6a', marginBottom: 6,
              }}>× НЕ МОГУТ ({slotData.cant.length})</div>
              {slotData.cant.map(p => (
                <PlayerRow key={p.user_id} player={p} status="cant" isMe={p.user_id === user.id} />
              ))}
            </div>
          )}

          {slotData.can.length === 0 && slotData.cant.length === 0 && (
            <div style={{
              fontFamily: '"Nunito", system-ui', fontSize: 12,
              color: '#9a9a9a', textAlign: 'center', padding: '12px 0',
            }}>Пока никто не отметился</div>
          )}
        </div>

        {/* prompt */}
        <div style={{
          marginTop: 12,
          fontFamily: '"Nunito", system-ui', fontSize: 11, letterSpacing: 1.6, fontWeight: 700,
          color: '#000', textAlign: 'center', position: 'relative', zIndex: 2,
        }}>СМОЖЕШЬ В ЭТОТ СЛОТ?</div>

        {/* action buttons */}
        <div style={{ marginTop: 10, display: 'flex', gap: 10, position: 'relative', zIndex: 2 }}>
          <BigBtn
            color="pink" active={yourStatus === 'can'}
            onClick={() => handlePick('can')} hint="ДОСТУПЕН" disabled={saving}
          >Я СМОГУ</BigBtn>
          <BigBtn
            color="dark" active={yourStatus === 'cant'}
            onClick={() => handlePick('cant')} hint="НЕ В СОСТАВЕ" disabled={saving}
          >Я НЕ СМОГУ</BigBtn>
        </div>
      </div>
    </div>
  )
}

function PlayerRow({ player, status, isMe }) {
  const name    = player.display_name || player.username || '?'
  const initial = name[0].toUpperCase()
  const showAt  = player.username && `@${player.username}` !== name
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 10px', borderRadius: 10, marginBottom: 4,
      background: isMe ? '#fff0f6' : '#fafafa',
      border: isMe ? `1.5px solid ${BC_COLORS.pink}` : '1px solid #ebebeb',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
        background: status === 'can' ? BC_COLORS.pink : '#ebebeb',
        border: `1.5px solid ${status === 'can' ? '#000' : '#d0d0d0'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Nunito", system-ui', fontWeight: 900, fontSize: 14,
        color: status === 'can' ? '#000' : '#9a9a9a',
      }}>{initial}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: '"Nunito", system-ui', fontWeight: 900, fontSize: 14, letterSpacing: 0.5, color: '#000' }}>
          {name}
          {isMe && (
            <span style={{
              marginLeft: 6,
              fontFamily: '"Permanent Marker", system-ui', fontSize: 11,
              letterSpacing: 1.2, color: BC_COLORS.pink, fontWeight: 400,
            }}>· вы</span>
          )}
        </div>
        {showAt && (
          <div style={{
            fontFamily: '"Nunito", system-ui', fontSize: 9, letterSpacing: 1.6,
            fontWeight: 700, color: '#6a6a6a', marginTop: 2,
          }}>@{player.username}</div>
        )}
      </div>
      <StatusPill status={status} />
    </div>
  )
}
