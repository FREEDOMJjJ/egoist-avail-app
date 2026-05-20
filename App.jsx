import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://your-bot.up.railway.app'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKDAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData || ''
}

function hapticFeedback(type = 'light') {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type)
  } catch (e) {}
}

function notificationFeedback(type = 'success') {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type)
  } catch (e) {}
}

async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'X-Telegram-Init-Data': getTelegramInitData() }
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function apiPost(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Telegram-Init-Data': getTelegramInitData()
    },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

function getCounterClass(count, teamSize) {
  if (count === 0) return 'empty'
  if (count >= teamSize) return 'full'
  if (count >= teamSize - 1) return 'high'
  if (count >= 3) return 'medium'
  return 'low'
}

function generateDays(daysAhead) {
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 0; i < daysAhead; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push(d)
  }
  return days
}

function formatDateKey(date) {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function isToday(date) {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

// ===== MAIN APP =====

export default function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const [data, setData] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [view, setView] = useState('home') // 'home' | 'avail'

  const loadData = async () => {
    try {
      const [meRes, availRes] = await Promise.all([
        apiGet('/api/me'),
        apiGet('/api/availability')
      ])
      setUser(meRes)
      setData(availRes)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Не удалось загрузить данные. Открой приложение через бота.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-emoji">⚔️</div>
        <div>Загрузка...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-emoji">⚠️</div>
        <h2>Ошибка</h2>
        <p>{error}</p>
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
        onSelectSlot={setSelectedSlot}
        selectedSlot={selectedSlot}
      />
    )
  }

  return <HomeView onOpenAvail={() => setView('avail')} data={data} />
}

// ===== HOME VIEW (Hub) =====

function HomeView({ onOpenAvail, data }) {
  // Count full house slots
  const fullHouseCount = data?.slots?.filter(s => s.can.length === data.team_size).length || 0
  const totalMarked = data?.slots?.length || 0

  return (
    <div className="app">
      {/* Top bar */}
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

      {/* Hero banner - Availability */}
      <div className="hero-banner" onClick={() => { hapticFeedback(); onOpenAvail() }}>
        <div className="hero-banner-content">
          <div className="hero-banner-title">Team<br/>Calendar</div>
        </div>
        <div className="hero-banner-art">
          <div className="hero-banner-emoji">📅</div>
        </div>
      </div>

      {/* 2x1 cards */}
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

      {/* 3 small cards */}
      <div className="grid-3">
        <div className="card-small" onClick={() => hapticFeedback()}>
          <span style={{ fontSize: 18 }}>✨</span>
          <div className="card-small-text">Stratbook</div>
        </div>
        <div className="card-icon-only" onClick={() => hapticFeedback()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#fff">
            <path d="M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2 0v8.99h7c0-4.55-3.47-8.49-7-8.99zm0 11v8.97c3.53-.5 7-4.44 7-8.97h-7z"/>
          </svg>
        </div>
        <div className="card-icon-only" onClick={() => hapticFeedback()}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" color="#fff">
            <path d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
          </svg>
        </div>
      </div>

      {/* Yellow glow button - Main CTA (Team Avail) */}
      <button className="glow-button" onClick={() => { hapticFeedback('medium'); onOpenAvail() }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
        </svg>
        <span>Check Availability</span>
      </button>

      {/* Big promo banner */}
      <div className="promo-banner" onClick={() => hapticFeedback()}>
        <div className="promo-banner-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
          </svg>
        </div>
        <div className="promo-banner-text">CS2<br/>Pracc</div>
        <div className="promo-banner-art">🎮</div>
      </div>
    </div>
  )
}

// ===== AVAILABILITY VIEW =====

function AvailView({ data, user, onBack, onReload, onSelectSlot, selectedSlot }) {
  const days = generateDays(data.days_ahead)
  const timeSlots = data.time_slots || [
    { id: 'morning', name: 'Morning', emoji: '🌅', hours: '10-14' },
    { id: 'day', name: 'Day', emoji: '🌇', hours: '14-19' },
    { id: 'evening', name: 'Evening', emoji: '🌃', hours: '19-23' },
  ]

  const slotsByKey = {}
  data.slots.forEach(s => {
    slotsByKey[`${s.slot_date}_${s.slot_time}`] = s
  })

  if (selectedSlot) {
    return (
      <SlotDetail
        slot={selectedSlot}
        slotData={slotsByKey[`${selectedSlot.date}_${selectedSlot.time_id}`] || { can: [], cant: [] }}
        timeSlots={timeSlots}
        user={user}
        teamSize={data.team_size}
        onBack={() => onSelectSlot(null)}
        onUpdate={onReload}
      />
    )
  }

  return (
    <div className="app">
      <div className="top-bar">
        <div className="top-bar-left" onClick={onBack}>
          <div className="close-icon">←</div>
          <span>Back</span>
        </div>
        <div className="top-bar-right">
          <div className="top-bar-btn">⋯</div>
        </div>
      </div>

      <h1 className="page-title">Calendar</h1>

      {days.map(day => {
        const dateKey = formatDateKey(day)
        const isFullHouseDay = timeSlots.some(ts => {
          const slot = slotsByKey[`${dateKey}_${ts.id}`]
          return slot && slot.can.length === data.team_size
        })

        return (
          <div 
            key={dateKey} 
            className={`day-card ${isFullHouseDay ? 'full-house' : ''}`}
          >
            <div className="day-header">
              <div className={`day-name ${isToday(day) ? 'today' : ''}`}>
                {WEEKDAYS_FULL[day.getDay()]}
              </div>
              <div className="day-date">
                {String(day.getDate()).padStart(2, '0')}.
                {String(day.getMonth() + 1).padStart(2, '0')}
              </div>
            </div>

            {timeSlots.map(ts => {
              const slotData = slotsByKey[`${dateKey}_${ts.id}`] || { can: [], cant: [] }
              const canCount = slotData.can.length
              const cantCount = slotData.cant.length
              const isFull = canCount === data.team_size
              const yourStatus = slotData.can.find(p => p.user_id === user.id)
                ? 'can'
                : slotData.cant.find(p => p.user_id === user.id)
                ? 'cant'
                : null

              return (
                <div
                  key={ts.id}
                  className={`slot ${canCount > 0 ? 'has-can' : ''} ${isFull ? 'full' : ''}`}
                  onClick={() => {
                    hapticFeedback()
                    onSelectSlot({
                      date: dateKey,
                      time_id: ts.id,
                      day_name: WEEKDAYS_FULL[day.getDay()],
                      date_display: `${String(day.getDate()).padStart(2, '0')}.${String(day.getMonth() + 1).padStart(2, '0')}.${day.getFullYear()}`
                    })
                  }}
                >
                  <div className="slot-emoji">{ts.emoji}</div>
                  <div className="slot-info">
                    <div className="slot-name">{ts.name}</div>
                    <div className="slot-hours">{ts.hours}</div>
                  </div>
                  <div className="slot-counter">
                    {yourStatus && (
                      <span className={`your-mark ${yourStatus}`}>
                        {yourStatus === 'can' ? '✓' : '✕'}
                      </span>
                    )}
                    <span className="counter-text">
                      {canCount}/{data.team_size}
                    </span>
                    <span className={`counter-dot ${getCounterClass(canCount, data.team_size)}`}></span>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ===== SLOT DETAIL =====

function SlotDetail({ slot, slotData, timeSlots, user, teamSize, onBack, onUpdate }) {
  const [saving, setSaving] = useState(false)
  const ts = timeSlots.find(t => t.id === slot.time_id)
  const yourCan = slotData.can.find(p => p.user_id === user.id)
  const yourCant = slotData.cant.find(p => p.user_id === user.id)
  const yourStatus = yourCan ? 'can' : yourCant ? 'cant' : null
  const isFullHouse = slotData.can.length === teamSize

  const handleSet = async (newStatus) => {
    if (saving) return
    setSaving(true)
    hapticFeedback('medium')
    try {
      const status = yourStatus === newStatus ? 'clear' : newStatus
      await apiPost('/api/availability', {
        slot_date: slot.date,
        slot_time: slot.time_id,
        status
      })
      notificationFeedback('success')
      await onUpdate()
    } catch (err) {
      console.error(err)
      notificationFeedback('error')
      alert('Не удалось сохранить. Попробуй позже.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <button className="modal-back" onClick={onBack}>←</button>
          <div className="modal-title">{slot.day_name}, {slot.date_display}</div>
        </div>

        {/* Slot info */}
        <div className="slot-detail-card">
          <div className="slot-detail-emoji">{ts?.emoji}</div>
          <div className="slot-detail-name">{ts?.name}</div>
          <div className="slot-detail-hours">{ts?.hours} МСК</div>
        </div>

        {/* Full house banner */}
        {isFullHouse && (
          <div className="full-house-banner">
            🔥 ВСЕ В СБОРЕ — МОЖЕМ ИГРАТЬ ПРАК!
          </div>
        )}

        {/* Action buttons */}
        <div className="action-buttons">
          <button
            className={`action-btn can ${yourStatus === 'can' ? 'active' : ''}`}
            onClick={() => handleSet('can')}
            disabled={saving}
          >
            ✓ МОГУ
          </button>
          <button
            className={`action-btn cant ${yourStatus === 'cant' ? 'active' : ''}`}
            onClick={() => handleSet('cant')}
            disabled={saving}
          >
            ✕ НЕ МОГУ
          </button>
        </div>

        {/* Players list - can */}
        <div className="player-list">
          <div className="player-list-title">
            ✓ Могут играть ({slotData.can.length}/{teamSize})
          </div>
          {slotData.can.length === 0 ? (
            <div style={{ color: '#666', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
              Пока никто не отметился
            </div>
          ) : (
            slotData.can.map(p => (
              <div key={p.user_id} className="player-row">
                <div className="player-avatar">
                  {(p.display_name || p.username || '?')[0].toUpperCase()}
                </div>
                <div className="player-name">{p.display_name || p.username}</div>
                <div className="player-username">@{p.username}</div>
              </div>
            ))
          )}
        </div>

        {/* Players list - cant */}
        {slotData.cant.length > 0 && (
          <div className="player-list">
            <div className="player-list-title">
              ✕ Не могут ({slotData.cant.length})
            </div>
            {slotData.cant.map(p => (
              <div key={p.user_id} className="player-row">
                <div className="player-avatar cant">
                  {(p.display_name || p.username || '?')[0].toUpperCase()}
                </div>
                <div className="player-name">{p.display_name || p.username}</div>
                <div className="player-username">@{p.username}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
