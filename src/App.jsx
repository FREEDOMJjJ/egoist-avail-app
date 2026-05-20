import { useState, useEffect } from 'react'
import { MangaBg, MinimalLoader, SkeletonCard } from './bc-effects'
import { Header, HpFooter, SkeletonHeader } from './bc-chrome'
import { DayCard, WeekHeader, DayModal } from './bc-day'
import { MangaMascot } from './bc-mascot'
import { generateDays, formatDateKey, isToday } from './bc-shared'
import './styles.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://worker-production-40d6.up.railway.app'

function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData || ''
}

function hapticFeedback(type = 'light') {
  try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type) } catch (e) {}
}

function notificationFeedback(type = 'success') {
  try { window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type) } catch (e) {}
}

async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'X-Telegram-Init-Data': getTelegramInitData() },
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': getTelegramInitData(),
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [user, setUser]       = useState(null)
  const [data, setData]       = useState(null)
  const [view, setView]       = useState('home') // 'home' | 'avail'

  const loadData = async () => {
    try {
      const [meRes, availRes] = await Promise.all([
        apiGet('/api/me'),
        apiGet('/api/availability'),
      ])
      setUser(meRes)
      setData(availRes)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Не удалось загрузить данные.\nОткрой приложение через бота.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  if (loading) {
    return (
      <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <MangaBg petals={false} halftone={false} />
        <MinimalLoader />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        position: 'relative', height: '100vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', textAlign: 'center',
        fontFamily: '"Nunito", system-ui',
      }}>
        <MangaBg petals={false} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: '"Permanent Marker", system-ui',
            fontSize: 48, color: '#ff99cc', marginBottom: 16,
          }}>!</div>
          <div style={{
            fontSize: 13, letterSpacing: 1.5, fontWeight: 700,
            color: 'rgba(255,255,255,0.6)',
            whiteSpace: 'pre-line',
          }}>{error}</div>
        </div>
      </div>
    )
  }

  if (view === 'avail') {
    return (
      <AvailView
        data={data}
        user={user}
        onBack={() => setView('home')}
        onReload={loadData}
      />
    )
  }

  return <HomeView onOpenAvail={() => setView('avail')} data={data} />
}

// ─── Home view (hub) ─────────────────────────────────────────────────────────

function HomeView({ onOpenAvail, data }) {
  const fullHouseCount = data?.slots?.filter(s => s.can.length === data.team_size).length || 0

  return (
    <div className="app">
      <div className="top-bar">
        <div className="top-bar-left">
          <div className="close-icon">✕</div>
          <span>EGOIST</span>
        </div>
        <div className="top-bar-right">
          <div className="top-bar-btn">⌄</div>
          <div className="top-bar-btn">⋯</div>
        </div>
      </div>

      <h1 className="page-title">Hub</h1>

      <div className="hero-banner" onClick={() => { hapticFeedback(); onOpenAvail() }}>
        <div className="hero-banner-content">
          <div className="hero-banner-title">Team<br/>Calendar</div>
          {fullHouseCount > 0 && (
            <div style={{ marginTop: 8, fontSize: 13, color: '#555', fontWeight: 600 }}>
              🔥 {fullHouseCount} слот{fullHouseCount > 1 ? 'а' : ''} — полный состав
            </div>
          )}
        </div>
        <div className="hero-banner-art">
          <div className="hero-banner-emoji">📅</div>
        </div>
      </div>

      <div className="grid-2x1">
        <div className="card-large" onClick={() => hapticFeedback()}>
          <div className="card-icon-circle">
            <svg className="card-icon-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div>
            <div className="card-title">Scrims</div>
            <div className="card-subtitle">Matches & stats</div>
          </div>
        </div>
        <div className="card-large" onClick={() => hapticFeedback()}>
          <div className="card-icon-circle">
            <svg className="card-icon-svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div>
            <div className="card-title">Profile</div>
            <div className="card-subtitle">Your stats</div>
          </div>
        </div>
      </div>

      <button className="glow-button" onClick={() => { hapticFeedback('medium'); onOpenAvail() }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
        </svg>
        <span>Check Availability</span>
      </button>

      <div className="promo-banner" onClick={() => hapticFeedback()}>
        <div className="promo-banner-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
          </svg>
        </div>
        <div className="promo-banner-text">CS2<br/>Праки</div>
        <div className="promo-banner-art">🎮</div>
      </div>
    </div>
  )
}

// ─── Avail view — fully BC-designed ──────────────────────────────────────────

function AvailView({ data, user, onBack, onReload }) {
  const [openDay, setOpenDay]                 = useState(null)
  const [recentlyChanged, setRecentlyChanged] = useState(null)
  const [skeletonDone, setSkeletonDone]       = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setSkeletonDone(true), 600)
    return () => clearTimeout(id)
  }, [])

  const days      = generateDays(data.days_ahead || 14)
  const timeSlots = data.time_slots || [
    { id: 'morning', name: 'Утро',  emoji: '🌅', hours: '10-14' },
    { id: 'day',     name: 'День',  emoji: '🌇', hours: '14-19' },
    { id: 'evening', name: 'Вечер', emoji: '🌃', hours: '19-23' },
  ]
  const teamSize = data.team_size || 5

  const slotsByKey = {}
  data.slots.forEach(s => {
    slotsByKey[`${s.slot_date}_${s.slot_time}`] = s
  })

  function getDaySlots(dateKey) {
    const obj = {}
    timeSlots.forEach(ts => {
      obj[ts.id] = slotsByKey[`${dateKey}_${ts.id}`] || { can: [], cant: [] }
    })
    return obj
  }

  const todayKey   = formatDateKey(new Date())
  const todaySlots = getDaySlots(todayKey)
  const todayBest  = Math.max(0, ...timeSlots.map(ts => todaySlots[ts.id]?.can?.length || 0))

  async function handlePick(slotId, status) {
    if (!openDay) return
    hapticFeedback('medium')
    const dateKey = formatDateKey(openDay)
    try {
      await apiPost('/api/availability', {
        slot_date: dateKey,
        slot_time: slotId,
        status,
      })
      notificationFeedback('success')
      setRecentlyChanged(dateKey)
      setTimeout(() => setRecentlyChanged(null), 700)
      await onReload()
    } catch (err) {
      console.error(err)
      notificationFeedback('error')
    }
  }

  const week1 = days.slice(0, 7)
  const week2 = days.slice(7, 14)

  return (
    <div style={{
      position: 'relative', height: '100vh', overflow: 'hidden',
      color: '#f5f3ee',
      fontFamily: '"Nunito", system-ui, sans-serif',
    }}>
      <MangaBg petals halftone />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 8, flexShrink: 0 }} />

        <div style={{ flex: 1, overflow: 'auto', position: 'relative', paddingBottom: 4 }}>
          {!skeletonDone ? (
            <div style={{ padding: '6px 16px' }}>
              <SkeletonHeader />
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <SkeletonCard key={i} delay={i * 80} />
                ))}
              </div>
            </div>
          ) : (
            <>
              <Header teamSize={teamSize} />

              <div style={{ padding: '0 12px' }}>
                <WeekHeader index={0} days={week1} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {week1.map(d => {
                    const key = formatDateKey(d)
                    return (
                      <DayCard
                        key={key} date={d}
                        daySlots={getDaySlots(key)}
                        timeSlots={timeSlots}
                        teamSize={teamSize}
                        justChanged={recentlyChanged === key}
                        onClick={() => { hapticFeedback(); setOpenDay(d) }}
                      />
                    )
                  })}
                </div>

                <WeekHeader index={1} days={week2} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {week2.map(d => {
                    const key = formatDateKey(d)
                    return (
                      <DayCard
                        key={key} date={d}
                        daySlots={getDaySlots(key)}
                        timeSlots={timeSlots}
                        teamSize={teamSize}
                        justChanged={recentlyChanged === key}
                        onClick={() => { hapticFeedback(); setOpenDay(d) }}
                      />
                    )
                  })}
                </div>

                <div style={{
                  marginTop: 18, padding: '12px 14px', borderRadius: 12,
                  border: '1px dashed rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.03)',
                  fontFamily: '"Nunito", system-ui',
                  fontSize: 11, letterSpacing: 0.4, lineHeight: 1.45, fontWeight: 600,
                  color: 'rgba(255,255,255,0.65)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 16 }}>🌸</span>
                  <div>
                    Тапни по дню — отметь готовность.<br />
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Придёт пуш от бота при сборе {teamSize}/{teamSize}.
                    </span>
                  </div>
                </div>

                <div style={{ height: 140 }} />
              </div>
            </>
          )}
        </div>
      </div>

      {skeletonDone && (
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 80 }}>
          <HpFooter
            bestCount={todayBest}
            teamSize={teamSize}
            onMore={() => {
              const todayDate = days.find(d => isToday(d))
              if (todayDate) setOpenDay(todayDate)
            }}
          />
        </div>
      )}

      {openDay && (
        <DayModal
          date={openDay}
          daySlots={getDaySlots(formatDateKey(openDay))}
          timeSlots={timeSlots}
          teamSize={teamSize}
          user={user}
          onPick={handlePick}
          onClose={() => setOpenDay(null)}
        />
      )}

      {skeletonDone && <MangaMascot corner="bottom-left" enabled />}
    </div>
  )
}
