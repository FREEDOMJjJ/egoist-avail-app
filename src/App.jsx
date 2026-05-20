import { useState, useEffect } from 'react'
import { MangaBg, MinimalLoader, SkeletonCard } from './bc-effects'
import { Header, HpFooter, SkeletonHeader } from './bc-chrome'
import { DayCard, WeekHeader, DayModal } from './bc-day'
import { generateDays, formatDateKey, isToday } from './bc-shared'
import './styles.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://stratbook-bot-production.up.railway.app'

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
  const headers = {}
  const initData = getTelegramInitData()
  if (initData) headers['X-Telegram-Init-Data'] = initData
  const res = await fetch(`${API_URL}${path}`, { headers })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function apiPost(path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const initData = getTelegramInitData()
  if (initData) headers['X-Telegram-Init-Data'] = initData
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
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
  const [view, setView]       = useState('home')

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
          <button onClick={() => { setError(null); setLoading(true); loadData() }} style={{
            marginTop: 24, padding: '12px 24px',
            background: '#ff99cc', color: '#000',
            border: '2px solid #000', borderRadius: 12,
            fontWeight: 900, fontSize: 14, cursor: 'pointer',
            boxShadow: '3px 3px 0 #000',
          }}>
            ПОПРОБОВАТЬ СНОВА
          </button>
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

  return <HomeView onOpenAvail={() => setView('avail')} data={data} user={user} />
}

// ─── Home view — manga style ──────────────────────────────────────────────────

function HomeView({ onOpenAvail, data, user }) {
  const fullHouseCount = data?.slots?.filter(s => s.can?.length >= (data.team_size || 5)).length || 0
  const todaySlots = data?.slots?.filter(s => s.slot_date === formatDateKey(new Date())) || []
  const todayBest = Math.max(0, ...todaySlots.map(s => s.can?.length || 0))
  const teamSize = data?.team_size || 5
  const userName = user?.first_name || user?.username || 'ИГРОК'

  return (
    <div style={{
      position: 'relative', minHeight: '100vh', overflow: 'hidden',
      fontFamily: '"Nunito", system-ui',
      color: '#f5f3ee',
    }}>
      <MangaBg petals halftone />

      <div style={{ position: 'relative', zIndex: 1, padding: '52px 16px 140px' }}>

        {/* Top greeting */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 10, letterSpacing: 3, fontWeight: 800,
            color: 'rgba(255,255,255,0.5)', marginBottom: 6,
          }}>
            ✿ ДОБРО ПОЖАЛОВАТЬ
          </div>
          <div style={{
            fontFamily: '"Permanent Marker", system-ui',
            fontSize: 52, lineHeight: 0.9, color: '#fff',
            letterSpacing: 3,
          }}>EGOIST</div>
          <div style={{ height: 3, width: 80, background: '#ff99cc', borderRadius: 4, marginTop: 6 }} />
          <div style={{
            marginTop: 8, fontSize: 13, fontWeight: 800,
            letterSpacing: 2, color: 'rgba(255,255,255,0.7)',
          }}>CS2 SQUAD</div>
        </div>

        {/* Mascot card */}
        <MangaMascotCard
          userName={userName}
          todayCount={todayBest}
          teamSize={teamSize}
          fullHouseCount={fullHouseCount}
        />

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 10, marginTop: 12, marginBottom: 12,
        }}>
          <StatCard emoji="🔥" label="ПОЛНЫХ СЛОТОВ" value={fullHouseCount} accent />
          <StatCard emoji="👥" label="СЕГОДНЯ" value={`${todayBest}/${teamSize}`} />
          <StatCard emoji="📅" label="ДНЕЙ ВПЕРЁД" value={14} />
        </div>

        {/* Main CTA */}
        <button
          onClick={() => { hapticFeedback('medium'); onOpenAvail() }}
          style={{
            width: '100%',
            background: '#ff99cc', color: '#000',
            border: '2.5px solid #000', borderRadius: 16,
            padding: '18px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            fontFamily: '"Permanent Marker", system-ui',
            fontSize: 20, letterSpacing: 2,
            boxShadow: '4px 4px 0 #000',
            cursor: 'pointer',
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 24 }}>📅</span>
          ОТКРЫТЬ КАЛЕНДАРЬ
        </button>

        {/* Secondary cards */}
        <div style={{ display: 'flex', gap: 10 }}>
          <MangaCard
            emoji="⚔️"
            title="СТРАЙКБУК"
            sub="Стратегии на карты"
            onClick={() => hapticFeedback()}
          />
          <MangaCard
            emoji="💣"
            title="ГРАНАТЫ"
            sub="Ролики и линапы"
            onClick={() => hapticFeedback()}
          />
        </div>

        {/* Bottom note */}
        <div style={{
          marginTop: 16,
          padding: '12px 14px', borderRadius: 12,
          border: '1px dashed rgba(255,255,255,0.18)',
          background: 'rgba(255,255,255,0.03)',
          fontSize: 11, letterSpacing: 0.4, lineHeight: 1.5,
          fontWeight: 600, color: 'rgba(255,255,255,0.55)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 18 }}>🌸</span>
          <div>
            Отметь готовность в календаре.<br/>
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>
              Бот уведомит всех когда состав {teamSize}/{teamSize}.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Manga stat card ──────────────────────────────────────────────────────────

function StatCard({ emoji, label, value, accent }) {
  return (
    <div style={{
      flex: 1,
      background: accent ? 'rgba(255,153,204,0.12)' : 'rgba(255,255,255,0.05)',
      border: accent ? '1.5px solid rgba(255,153,204,0.4)' : '1.5px solid rgba(255,255,255,0.1)',
      borderRadius: 12,
      padding: '12px 10px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
      <div style={{
        fontFamily: '"Permanent Marker", system-ui',
        fontSize: 22, color: accent ? '#ff99cc' : '#fff',
        lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontSize: 8, letterSpacing: 1.5, fontWeight: 800,
        color: 'rgba(255,255,255,0.45)', marginTop: 4,
      }}>{label}</div>
    </div>
  )
}

// ─── Manga secondary card ─────────────────────────────────────────────────────

function MangaCard({ emoji, title, sub, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        background: 'rgba(255,255,255,0.88)',
        border: '2px solid #000', borderRadius: 14,
        padding: '14px 12px',
        cursor: 'pointer',
        boxShadow: '3px 3px 0 #000',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{emoji}</div>
      <div style={{
        fontFamily: '"Permanent Marker", system-ui',
        fontSize: 14, color: '#000', letterSpacing: 1,
        marginBottom: 2,
      }}>{title}</div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 1,
        color: '#6a6a6a',
      }}>{sub}</div>
      {/* halftone corner */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 60, height: 60,
        backgroundImage: 'radial-gradient(rgba(255,153,204,0.6) 0.7px, transparent 1px)',
        backgroundSize: '5px 5px',
        maskImage: 'radial-gradient(60% 60% at 100% 100%, #000, transparent)',
        WebkitMaskImage: 'radial-gradient(60% 60% at 100% 100%, #000, transparent)',
      }} />
    </div>
  )
}

// ─── Gojo mascot card ─────────────────────────────────────────────────────────

function MangaMascotCard({ userName, todayCount, teamSize, fullHouseCount }) {
  const [mode, setMode] = useState('wait')
  const [textIdx, setTextIdx] = useState(0)

  const MODES = ['laptop', 'gaming', 'beer', 'wait']
  const TEXTS = {
    laptop: ['Когда матч?', 'Расписание уже?', 'Отмечайтесь!'],
    gaming: ['Го катку?', 'Кто в ранке?', 'Я готов!'],
    beer:   ['Жду состав', 'Холодненькое 🍺', 'Где все??'],
    wait:   ['Скучаю...', 'Когда уже', 'Эй, отметьтесь'],
  }

  useEffect(() => {
    const t = setInterval(() => setMode(m => {
      const i = MODES.indexOf(m)
      return MODES[(i + 1) % MODES.length]
    }), 6000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setTextIdx(i => i + 1), 3000)
    return () => clearInterval(t)
  }, [])

  const texts = TEXTS[mode]
  const text = texts[textIdx % texts.length]

  return (
    <div style={{
      background: 'rgba(255,255,255,0.9)',
      border: '2px solid #000', borderRadius: 16,
      padding: '14px 14px 14px 16px',
      display: 'flex', alignItems: 'stretch', gap: 8,
      minHeight: 160, position: 'relative', overflow: 'hidden',
      boxShadow: '4px 4px 0 #000',
    }}>
      {/* halftone */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'radial-gradient(rgba(255,153,204,0.4) 0.6px, transparent 1px)',
        backgroundSize: '5px 5px',
        maskImage: 'linear-gradient(120deg, #000 0%, transparent 50%)',
        WebkitMaskImage: 'linear-gradient(120deg, #000 0%, transparent 50%)',
        opacity: 0.5,
      }} />

      {/* Left — text */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{
            fontSize: 9, letterSpacing: 2.5, fontWeight: 800,
            color: '#6a6a6a', marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#ff99cc', border: '1px solid #000',
              display: 'inline-block',
            }} />
            ГОДЖО · {mode === 'laptop' ? 'ПИШЕТ' : mode === 'gaming' ? 'РУБИТСЯ' : mode === 'beer' ? 'ОЖИДАЕТ' : 'ЗАЛИП'}
          </div>

          {/* Speech bubble */}
          <div style={{
            background: '#fff', border: '2px solid #000',
            borderRadius: 14, padding: '10px 14px',
            maxWidth: 150, position: 'relative',
            boxShadow: '2px 2px 0 #000',
            fontFamily: '"Nunito", system-ui',
            fontWeight: 800, fontSize: 13, color: '#000',
            lineHeight: 1.3,
            animation: 'bcBubble 3s ease-in-out infinite',
          }}>
            {text}
            <div style={{
              position: 'absolute', right: -12, top: 16,
              width: 0, height: 0,
              borderTop: '7px solid transparent',
              borderBottom: '7px solid transparent',
              borderLeft: '12px solid #000',
            }} />
            <div style={{
              position: 'absolute', right: -8, top: 18,
              width: 0, height: 0,
              borderTop: '5px solid transparent',
              borderBottom: '5px solid transparent',
              borderLeft: '9px solid #fff',
            }} />
          </div>
        </div>

        <div style={{
          fontFamily: '"Nunito", system-ui',
          fontWeight: 700, fontSize: 11, color: '#000',
        }}>
          {todayCount >= teamSize
            ? '🔥 Состав 5/5 — го!'
            : `На сегодня: ${todayCount}/${teamSize}`
          }
        </div>
      </div>

      {/* Right — Gojo SVG */}
      <div style={{ width: 120, flexShrink: 0, display: 'flex', alignItems: 'flex-end' }}>
        <GojoMascotSVG mode={mode} />
      </div>
    </div>
  )
}

// ─── Gojo SVG (uses bc-mascot scenes) ────────────────────────────────────────

function GojoMascotSVG({ mode }) {
  return (
    <svg viewBox="0 0 200 220" width="100%" style={{ display: 'block', overflow: 'visible' }}>
      {/* Body */}
      <g>
        {/* Neck */}
        <rect x="92" y="113" width="16" height="6" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.5" />
        {/* Torso */}
        <path d="M 76 118 Q 70 132 66 152 L 60 198 Q 100 206 140 198 L 134 152 Q 130 132 124 118 Z"
          fill="#202024" stroke="#0a0a0a" strokeWidth="2.6" />
        {/* High collar */}
        <path d="M 82 116 L 100 124 L 118 116 L 118 128 L 100 132 L 82 128 Z"
          fill="#101012" stroke="#0a0a0a" strokeWidth="2" />
        {/* Gold button */}
        <circle cx="120" cy="142" r="3" fill="#e3b948" stroke="#0a0a0a" strokeWidth="0.9" />
        <circle cx="120" cy="142" r="1" fill="#fff" opacity="0.7" />

        {/* Arms based on mode */}
        {mode === 'laptop' && (
          <>
            <path d="M 66 168 Q 60 178 64 188 L 76 188 L 78 174 Z" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2" />
            <path d="M 134 168 Q 140 178 136 188 L 124 188 L 122 174 Z" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2" />
            {/* laptop */}
            <path d="M 50 168 L 150 168 L 156 142 L 44 142 Z" fill="#1a1a1f" stroke="#0a0a0a" strokeWidth="2" />
            <path d="M 54 165 L 146 165 L 152 145 L 48 145 Z" fill="#0a0a0a" />
            <text x="100" y="160" textAnchor="middle" fontFamily="Permanent Marker, system-ui" fontSize="12" fill="#ff99cc">EG</text>
            <path d="M 40 178 L 160 178 L 168 200 L 32 200 Z" fill="#2a2a2f" stroke="#0a0a0a" strokeWidth="2" />
          </>
        )}
        {mode === 'gaming' && (
          <>
            <path d="M 76 124 Q 64 150 76 168 L 92 162 L 88 132 Z" fill="#202024" stroke="#0a0a0a" strokeWidth="2" />
            <path d="M 124 124 Q 136 150 124 168 L 108 162 L 112 132 Z" fill="#202024" stroke="#0a0a0a" strokeWidth="2" />
            {/* controller */}
            <rect x="72" y="158" width="56" height="32" rx="14" fill="#2a2a2f" stroke="#0a0a0a" strokeWidth="2" />
            <circle cx="114" cy="170" r="4" fill="#ff99cc" stroke="#0a0a0a" strokeWidth="1.5" />
            <circle cx="122" cy="178" r="4" fill="#fff" stroke="#0a0a0a" strokeWidth="1.5" />
            <circle cx="88" cy="172" r="6" fill="#1a1a1f" stroke="#0a0a0a" strokeWidth="1.5" />
          </>
        )}
        {mode === 'beer' && (
          <>
            <path d="M 70 130 Q 56 160 60 188 L 70 192 Q 74 168 82 138 Z" fill="#202024" stroke="#0a0a0a" strokeWidth="2" />
            <g style={{ transformOrigin: '124px 124px', animation: 'bcSip 3.4s ease-in-out infinite' }}>
              <path d="M 122 124 L 138 116 L 156 130 L 148 142 L 130 134 Z" fill="#202024" stroke="#0a0a0a" strokeWidth="2" />
              <rect x="126" y="84" width="28" height="34" rx="3" fill="#fafaf7" stroke="#0a0a0a" strokeWidth="2" />
              <path d="M 126 86 Q 130 76 136 84 Q 140 76 146 84 Q 152 76 154 86 L 154 94 L 126 94 Z" fill="#fff" stroke="#0a0a0a" strokeWidth="2" />
              <path d="M 154 90 Q 162 88 162 96 Q 162 104 154 104" fill="none" stroke="#0a0a0a" strokeWidth="2" />
            </g>
          </>
        )}
        {mode === 'wait' && (
          <>
            {/* arms crossed */}
            <path d="M 76 132 Q 68 148 100 158 L 124 152 L 130 142 Q 110 138 100 142 L 88 135 Z" fill="#202024" stroke="#0a0a0a" strokeWidth="2" />
            <path d="M 124 138 Q 130 156 100 162 L 80 154 L 74 144 Q 96 144 100 148 L 116 136 Z" fill="#181819" stroke="#0a0a0a" strokeWidth="2" />
            <g style={{ animation: 'bcDots 1.4s ease-in-out infinite' }}>
              <circle cx="156" cy="60" r="2.4" fill="#ff99cc" stroke="#0a0a0a" strokeWidth="1" />
              <circle cx="166" cy="55" r="2" fill="#ff99cc" stroke="#0a0a0a" strokeWidth="1" opacity="0.7" />
              <circle cx="174" cy="49" r="1.6" fill="#ff99cc" stroke="#0a0a0a" strokeWidth="1" opacity="0.45" />
            </g>
          </>
        )}
      </g>

      {/* Head */}
      <g>
        {/* White hair back spikes */}
        <g style={{ transformOrigin: '100px 90px', animation: 'bcHairSway 3.4s ease-in-out infinite' }}>
          <path d="M 56 96 L 46 78 L 32 60 L 50 50 L 36 30 L 60 34 L 50 6 L 78 30 L 76 2 L 96 26 L 110 0 L 118 28 L 134 6 L 134 32 L 156 14 L 150 34 L 174 30 L 162 52 L 180 58 L 164 72 L 180 82 L 158 92 L 172 108 Q 134 104 100 102 Q 68 104 56 96 Z"
            fill="#ffffff" stroke="#0a0a0a" strokeWidth="2.6" strokeLinejoin="miter" />
          <path d="M 78 48 L 96 28 L 108 50 L 100 70 L 86 65 Z" fill="#e8e8e8" opacity="0.7" />
        </g>

        {/* Ears */}
        <ellipse cx="65" cy="89" rx="4" ry="6.5" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8" />
        <ellipse cx="135" cy="89" rx="4" ry="6.5" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8" />

        {/* Face */}
        <ellipse cx="100" cy="84" rx="36" ry="33" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2.6" />

        {/* Front bangs */}
        <path d="M 68 70 L 60 106 L 78 92 L 84 100 L 90 80 Z" fill="#fff" stroke="#0a0a0a" strokeWidth="2.2" />
        <path d="M 95 78 L 100 110 L 108 95 L 114 106 L 122 84 Z" fill="#fff" stroke="#0a0a0a" strokeWidth="2.2" />
        <path d="M 128 78 L 138 100 L 134 78 Z" fill="#fff" stroke="#0a0a0a" strokeWidth="2.2" />

        {/* Sunglasses */}
        <circle cx="82" cy="88" r="13" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="2.6" />
        <circle cx="118" cy="88" r="13" fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="2.6" />
        <line x1="94.5" y1="88" x2="105.5" y2="88" stroke="#0a0a0a" strokeWidth="2.4" />
        <ellipse cx="77" cy="84" rx="2.6" ry="3" fill="#fff" opacity="0.92" />
        <ellipse cx="113" cy="84" rx="2.6" ry="3" fill="#fff" opacity="0.92" />

        {/* Mouth */}
        <path d="M 93 104 Q 100 113 107 104 Z" fill="#ff8aa6" stroke="#0a0a0a" strokeWidth="1.6" />

        {/* Blush */}
        <ellipse cx="75" cy="100" rx="3" ry="2" fill="#ff99cc" opacity="0.55" />
        <ellipse cx="125" cy="100" rx="3" ry="2" fill="#ff99cc" opacity="0.55" />
      </g>

      <style>{`
        @keyframes bcHairSway { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
        @keyframes bcSip { 0%,40%,100%{transform:rotate(0deg)} 60%,80%{transform:rotate(-22deg)} }
        @keyframes bcDots { 0%,100%{opacity:0.4;transform:translateY(0)} 50%{opacity:1;transform:translateY(-3px)} }
        @keyframes bcBubble { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes bcWiggle { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
      `}</style>
    </svg>
  )
}

// ─── Avail view ───────────────────────────────────────────────────────────────

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
      await apiPost('/api/availability', { slot_date: dateKey, slot_time: slotId, status })
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
      color: '#f5f3ee', fontFamily: '"Nunito", system-ui, sans-serif',
    }}>
      <MangaBg petals halftone />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 8, flexShrink: 0 }} />
        <div style={{ flex: 1, overflow: 'auto', position: 'relative', paddingBottom: 4 }}>
          {!skeletonDone ? (
            <div style={{ padding: '6px 16px' }}>
              <SkeletonHeader />
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} delay={i * 80} />)}
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
                      <DayCard key={key} date={d} daySlots={getDaySlots(key)}
                        timeSlots={timeSlots} teamSize={teamSize}
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
                      <DayCard key={key} date={d} daySlots={getDaySlots(key)}
                        timeSlots={timeSlots} teamSize={teamSize}
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
    </div>
  )
}
