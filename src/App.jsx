import { useState, useEffect, useCallback, useRef, useMemo, Component } from 'react'

// ─── Error Boundary ───────────────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null } }
  static getDerivedStateFromError(e) { return { error: e } }
  render() {
    if (this.state.error) {
      return (
        <div style={{ position:'fixed', inset:0, background:'#000', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px', color:'#fff', fontFamily:'monospace' }}>
          <div style={{ fontSize:32, marginBottom:16 }}>💥</div>
          <div style={{ fontFamily:'"Permanent Marker",system-ui', fontSize:22, color:'#ff6eb4', marginBottom:12 }}>CRASH</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', textAlign:'center', whiteSpace:'pre-wrap', maxWidth:320 }}>
            {String(this.state.error?.message || this.state.error)}
          </div>
          <button onClick={() => window.location.reload()} style={{ marginTop:24, padding:'10px 24px', background:'#ff6eb4', color:'#000', border:'2px solid #fff', borderRadius:10, fontWeight:900, cursor:'pointer', fontSize:13 }}>ПЕРЕЗАГРУЗИТЬ</button>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function useToast() {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)
  const showToast = useCallback((msg, type = 'success') => {
    clearTimeout(timerRef.current)
    setToast({ msg, type, key: Date.now() })
    timerRef.current = setTimeout(() => setToast(null), 2500)
  }, [])
  return { toast, showToast }
}

function Toast({ toast }) {
  if (!toast) return null
  const ok = toast.type === 'success'
  return (
    <div key={toast.key} style={{
      position:'fixed', bottom:110, left:16, right:16, zIndex:9990,
      background:'#fff',
      border:`2px solid ${ok ? '#22c55e' : '#ef4444'}`,
      borderRadius:14, padding:'12px 16px',
      boxShadow:`4px 4px 0 ${ok ? '#22c55e' : '#ef4444'}`,
      display:'flex', alignItems:'center', gap:10,
      animation:'toastIn 300ms cubic-bezier(0.34,1.56,0.64,1)',
      fontFamily:'"Nunito",system-ui',
    }}>
      <span style={{fontSize:18}}>{ok ? '✅' : '❌'}</span>
      <span style={{fontWeight:800, fontSize:13, color:'#000', flex:1}}>{toast.msg}</span>
      <style>{`@keyframes toastIn { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }`}</style>
    </div>
  )
}

import { MangaBg, MinimalLoader, SkeletonCard } from './bc-effects'
import { Header, HpFooter, SkeletonHeader } from './bc-chrome'
import { DayCard, WeekHeader, DayModal } from './bc-day'
import { generateDays, formatDateKey, isToday } from './bc-shared'
import { MangaMascotCard } from './bc-mascot'
import { SettingsProvider, SettingsIcon, AnimeEyesHero } from './bc-settings'
import './styles.css'

const API_URL = import.meta.env.VITE_API_URL || 'https://stratbook-bot-production.up.railway.app'

// WebApp уже инициализирован в main.jsx

function getTelegramInitData() {
  return window.Telegram?.WebApp?.initData || ''
}

function getTelegramUserId() {
  try {
    const tg = window.Telegram?.WebApp
    if (tg?.initDataUnsafe?.user?.id) return String(tg.initDataUnsafe.user.id)
  } catch (_) {}
  return null
}

async function apiGet(path) {
  const headers = {}
  const initData = getTelegramInitData()
  if (initData) headers['X-Telegram-Init-Data'] = initData
  // uid fallback для форков где initData пустой
  const uid = getTelegramUserId()
  const sep = path.includes('?') ? '&' : '?'
  const extra = (!initData && uid) ? `${sep}uid=${uid}` : ''
  const res = await fetch(`${API_URL}${path}${extra}`, { headers })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

async function apiPost(path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const initData = getTelegramInitData()
  if (initData) headers['X-Telegram-Init-Data'] = initData
  const uid = getTelegramUserId()
  const sep = path.includes('?') ? '&' : '?'
  const extra = (!initData && uid) ? `${sep}uid=${uid}` : ''
  const res = await fetch(`${API_URL}${path}${extra}`, {
    method: 'POST', headers, body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

function hapticFeedback(type = 'light') {
  try { window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type) } catch (e) {}
}

function notificationFeedback(type = 'success') {
  try { window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type) } catch (e) {}
}



export default function App() {
  return (
    <SettingsProvider>
      <AppInner/>
    </SettingsProvider>
  )
}

function AppInner() {
  // Не блокируем по платформе — сервер сам проверит initData
  // На Desktop Telegram WebApp объект может быть пустым но работать
  const [loading, setLoading]       = useState(true)
  const [loaderDone, setLoaderDone] = useState(false)
  const [tapped, setTapped]         = useState(false)
  const [error, setError]           = useState(null)
  const [user, setUser]             = useState(null)
  const [data, setData]             = useState(null)
  const [view, setView]             = useState('home')

  const CACHE_KEY = 'egoist_avail_v2'

  const loadData = useCallback(async () => {
    try {
      const [meRes, availRes] = await Promise.all([
        apiGet('/api/me'),
        apiGet('/api/availability'),
      ])
      setUser(meRes)
      setData(availRes)
      setError(null)
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ me: meRes, avail: availRes, ts: Date.now() }))
      } catch (_) {}
    } catch (err) {
      console.error(err)
      setError('Не удалось загрузить данные.\nОткрой приложение через бота.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced reload — защита от частых вызовов
  const reloadTimer = useRef(null)
  const debouncedReload = useCallback(() => {
    if (reloadTimer.current) clearTimeout(reloadTimer.current)
    reloadTimer.current = setTimeout(() => loadData(), 600)
  }, [loadData])

  useEffect(() => {
    // Показать кэш сразу
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { me, avail, ts } = JSON.parse(cached)
        if (Date.now() - ts < 10 * 60 * 1000) {
          setUser(me); setData(avail); setLoading(false)
        }
      }
    } catch (_) {}

    // Ждём initData — на Desktop может заполняться с задержкой
    let initDelay
    const startTime = Date.now()
    function waitForInitData() {
      const initData = window.Telegram?.WebApp?.initData
      if (initData || Date.now() - startTime > 2000) {
        // initData появился или таймаут 2 сек — грузим
        loadData()
      } else {
        // Ждём ещё 100мс
        initDelay = setTimeout(waitForInitData, 100)
      }
    }
    initDelay = setTimeout(waitForInitData, 100)

    const loaderTimer = setTimeout(() => setLoaderDone(true), 3800)

    // ── SSE — реалтайм обновления ──
    let es = null
    let retryDelay = 3000
    let retryTimer = null
    let alive = true

    function connectSSE() {
      if (!alive) return
      try {
        const initData = window.Telegram?.WebApp?.initData || ''
        const sep = API_URL.includes('?') ? '&' : '?'
        // SSE не поддерживает заголовки — передаём initData как query param
        es = new EventSource(`${API_URL}/api/events${initData ? `${sep}tg=${encodeURIComponent(initData)}` : ''}`)

        es.onopen = () => {
          retryDelay = 3000  // сброс при успехе
        }

        es.addEventListener('availability_update', () => {
          debouncedReload()
        })

        es.onerror = () => {
          es?.close()
          es = null
          if (!alive) return
          // Экспоненциальный backoff: 3s → 6s → 12s → max 60s
          retryTimer = setTimeout(() => {
            retryDelay = Math.min(retryDelay * 2, 60000)
            connectSSE()
          }, retryDelay)
        }
      } catch (err) {
        console.warn('SSE connect failed:', err)
      }
    }

    connectSSE()

    return () => {
      alive = false
      clearTimeout(initDelay)
      clearTimeout(loaderTimer)
      clearTimeout(reloadTimer.current)
      clearTimeout(retryTimer)
      es?.close()
    }
  }, [])

  const showLoader = loading || (!loaderDone && !tapped)

  if (showLoader) {
    return (
      <div
        style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
        onClick={() => { if (loaderDone) setTapped(true) }}
      >
        <MangaBg petals={false} halftone={false} />
        <MinimalLoader done={loaderDone} onTap={() => setTapped(true)} />
      </div>
    )
  }

  if (error) {
    const tg = window.Telegram?.WebApp
    const diagInfo = {
      telegramExists: typeof window.Telegram !== 'undefined' ? '✓' : '❌',
      webAppExists: typeof window.Telegram?.WebApp !== 'undefined' ? '✓' : '❌',
      initDataLen: tg?.initData?.length || 0,
      userId: tg?.initDataUnsafe?.user?.id || '❌ нет',
      platform: tg?.platform || '❌ нет',
      version: tg?.version || '❌ нет',
    }
    return (
      <div style={{
        position:'fixed', inset:0, background:'#000',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        padding:'32px 24px', fontFamily:'"Nunito",system-ui', color:'#fff',
      }}>
        <div style={{ fontSize:40, marginBottom:12 }}>⚠️</div>
        <div style={{
          fontFamily:'"Permanent Marker",system-ui', fontSize:20,
          color:'#ff99cc', marginBottom:12,
        }}>ОШИБКА ЗАГРУЗКИ</div>

        <div style={{
          width:'100%', background:'rgba(255,255,255,0.05)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:12, padding:'12px 16px', marginBottom:16,
          fontSize:11, fontFamily:'monospace', color:'rgba(255,255,255,0.7)',
          textAlign:'left', lineHeight:2,
        }}>
          <div style={{color:'#ff99cc', marginBottom:4, fontSize:12}}>ДИАГНОСТИКА:</div>
          <div>window.Telegram: {diagInfo.telegramExists}</div>
          <div>WebApp объект: {diagInfo.webAppExists}</div>
          <div>initData длина: {diagInfo.initDataLen}</div>
          <div>userId: {diagInfo.userId}</div>
          <div>platform: {diagInfo.platform}</div>
          <div>version: {diagInfo.version}</div>
        </div>

        <button onClick={() => { setError(null); setLoading(true); loadData() }} style={{
          padding:'12px 28px', background:'#ff99cc', color:'#000',
          border:'2px solid #000', borderRadius:12,
          fontWeight:900, fontSize:14, cursor:'pointer',
          boxShadow:'3px 3px 0 #000', marginBottom:12,
        }}>
          ПОПРОБОВАТЬ СНОВА
        </button>
      </div>
    )
  }

  // Если данные не пришли — показать ошибку
  if (!data && !error) {
    return (
      <div style={{ position:'fixed', inset:0, background:'#000', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <MangaBg petals={false} halftone={false} />
        <div style={{ position:'relative', zIndex:1, textAlign:'center', color:'#fff', fontFamily:'"Nunito",system-ui' }}>
          <div style={{ fontSize:32, marginBottom:12 }}>⚠️</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>Нет данных от сервера</div>
          <button onClick={loadData} style={{ marginTop:16, padding:'10px 24px', background:'#ff99cc', color:'#000', border:'2px solid #000', borderRadius:10, fontWeight:900, cursor:'pointer' }}>ОБНОВИТЬ</button>
        </div>
      </div>
    )
  }

  if (view === 'avail') {
    return (
      <ErrorBoundary>
        <AvailView data={data} user={user} onBack={() => setView('home')} onReload={debouncedReload} />
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <HomeView onOpenAvail={() => setView('avail')} data={data} user={user} />
    </ErrorBoundary>
  )
}


// ─── Streak counter ───────────────────────────────────────────────────────────

function StreakCard({ streak }) {
  if (!streak) return null
  const { current = 0, best = 0 } = streak
  if (current === 0 && best === 0) return null
  return (
    <div style={{
      display:'flex', gap:10, marginBottom:12,
    }}>
      {current > 0 && (
        <div style={{
          flex:1, background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:12, padding:'10px 14px',
          display:'flex', alignItems:'center', gap:10,
        }}>
          <span style={{fontSize:22}}>🔥</span>
          <div>
            <div style={{fontFamily:'"Permanent Marker",system-ui', fontSize:22, color:'#ff99cc', lineHeight:1}}>{current}</div>
            <div style={{fontFamily:'"Nunito",system-ui', fontSize:9, letterSpacing:2, fontWeight:800, color:'rgba(255,255,255,0.4)', marginTop:3}}>ДНЕЙ ПОДРЯД</div>
          </div>
        </div>
      )}
      {best > 0 && (
        <div style={{
          flex:1, background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:12, padding:'10px 14px',
          display:'flex', alignItems:'center', gap:10,
        }}>
          <span style={{fontSize:22}}>🏆</span>
          <div>
            <div style={{fontFamily:'"Permanent Marker",system-ui', fontSize:22, color:'rgba(255,255,255,0.7)', lineHeight:1}}>{best}</div>
            <div style={{fontFamily:'"Nunito",system-ui', fontSize:9, letterSpacing:2, fontWeight:800, color:'rgba(255,255,255,0.4)', marginTop:3}}>РЕКОРД</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Random map button ────────────────────────────────────────────────────────

function RandomMapBtn() {
  const [map, setMap] = useState(null)
  const [loading, setLoading] = useState(false)

  async function roll() {
    setLoading(true)
    try {
      const res = await apiGet('/api/random-map')
      setMap(res.map)
    } catch (_) {}
    setLoading(false)
  }

  if (!map) {
    return (
      <button onClick={roll} disabled={loading} style={{
        width:'100%', background:'rgba(255,255,255,0.04)',
        border:'1px solid rgba(255,255,255,0.1)',
        borderRadius:12, padding:'12px 16px',
        display:'flex', alignItems:'center', gap:12,
        cursor:'pointer', marginBottom:12,
        transition:'transform 150ms',
      }}>
        <span style={{fontSize:20}}>🎲</span>
        <span style={{fontFamily:'"Permanent Marker",system-ui', fontSize:14, color:'rgba(255,255,255,0.6)', letterSpacing:1}}>
          {loading ? 'ВЫБИРАЕМ...' : 'РАНДОМ КАРТА'}
        </span>
      </button>
    )
  }

  return (
    <div style={{
      marginBottom:12,
      background:'rgba(255,255,255,0.95)',
      border:'2px solid #000', borderRadius:12,
      padding:'12px 16px',
      boxShadow:'3px 3px 0 #000',
      display:'flex', alignItems:'center', gap:12,
      position:'relative', overflow:'hidden',
    }}>
      <div style={{position:'absolute',top:0,right:0,width:60,height:60,pointerEvents:'none',backgroundImage:'radial-gradient(rgba(255,153,204,0.4) 0.7px,transparent 1px)',backgroundSize:'5px 5px',maskImage:'radial-gradient(60% 60% at 100% 0%,#000,transparent)',WebkitMaskImage:'radial-gradient(60% 60% at 100% 0%,#000,transparent)'}}/>
      <span style={{fontSize:28}}>{map.emoji}</span>
      <div style={{flex:1}}>
        <div style={{fontFamily:'"Permanent Marker",system-ui', fontSize:18, color:'#000', letterSpacing:1}}>{map.name}</div>
        <div style={{fontFamily:'"Nunito",system-ui', fontSize:9, letterSpacing:2, fontWeight:800, color:'#6a6a6a', marginTop:2}}>КАРТА НА ПРАК</div>
      </div>
      <button onClick={roll} style={{
        all:'unset', cursor:'pointer', fontSize:20,
        padding:'4px 8px', borderRadius:8,
        background:'rgba(0,0,0,0.06)',
      }}>🔄</button>
    </div>
  )
}

// ─── Home view — manga style ──────────────────────────────────────────────────

function HomeView({ onOpenAvail, data, user }) {
  const [streak, setStreak] = useState(null)
  useEffect(() => {
    apiGet('/api/streak').then(setStreak).catch(() => {})
  }, [])
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

      {/* Settings icon — top right */}
      <div style={{ position:'fixed', top:14, right:14, zIndex:50 }}>
        <SettingsIcon/>
      </div>

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
            fontFamily: '"Permanent Marker", system-ui',
          }}>CS2 SQUAD</div>
        </div>

        {/* Anime Eyes Hero — заменяет маскота */}
        <AnimeEyesHero ready={todayBest}/>

        <StreakCard streak={streak}/>
        {/* Счётчик состава с прогресс-баром */}
        <SquadCounter today={todayBest} total={teamSize} fullCount={fullHouseCount}/>

        <RandomMapBtn/>
        {/* Main CTA — manga style */}
        <button
          onClick={() => { hapticFeedback('medium'); onOpenAvail() }}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.95)', color: '#000',
            border: '2px solid #000', borderRadius: 16,
            padding: '18px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            fontFamily: '"Permanent Marker", system-ui',
            fontSize: 18, letterSpacing: 2,
            boxShadow: '4px 4px 0 #ff99cc',
            cursor: 'pointer',
            marginBottom: 12,
            position: 'relative', overflow: 'hidden',
            transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms',
          }}
          onMouseDown={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '2px 2px 0 #ff99cc' }}
          onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #ff99cc' }}
          onTouchStart={e => { e.currentTarget.style.transform = 'translate(2px,2px)'; e.currentTarget.style.boxShadow = '2px 2px 0 #ff99cc' }}
          onTouchEnd={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #ff99cc' }}
        >
          {/* Halftone угол как на остальных карточках */}
          <div style={{
            position:'absolute', bottom:0, right:0,
            width:70, height:70, pointerEvents:'none',
            backgroundImage: 'radial-gradient(rgba(255,153,204,0.5) 0.8px, transparent 1px)',
            backgroundSize: '6px 6px',
            maskImage: 'radial-gradient(70% 70% at 100% 100%, #000, transparent)',
            WebkitMaskImage: 'radial-gradient(70% 70% at 100% 100%, #000, transparent)',
          }}/>
          <span style={{ fontSize: 22, position:'relative', zIndex:1 }}>📅</span>
          <span style={{ position:'relative', zIndex:1 }}>ОТКРЫТЬ КАЛЕНДАРЬ</span>
        </button>

        {/* Secondary cards */}
        <div style={{ display: 'flex', gap: 10 }}>
          <TapeCard title="STRATBOOK" sub="Стратегии на карты" />
          <TapeCard title="NADES" sub="Гранаты на картах" />
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


// ─── Animated calendar button ────────────────────────────────────────────────

// ─── Tape card — временно не работает ────────────────────────────────────────

function TapeCard({ title, sub }) {
  return (
    <div style={{
      flex: 1,
      background: 'rgba(255,255,255,0.88)',
      border: '2px solid #000', borderRadius: 14,
      padding: '14px 12px',
      boxShadow: '3px 3px 0 #000',
      position: 'relative', overflow: 'hidden',
      opacity: 0.75,
      cursor: 'not-allowed',
    }}>
      <div style={{
        fontFamily: '"Permanent Marker", system-ui',
        fontSize: 14, color: '#000', letterSpacing: 1,
        marginBottom: 2,
      }}>{title}</div>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: 1,
        color: '#6a6a6a',
      }}>{sub}</div>
      {/* Yellow tape */}
      <div style={{
        position: 'absolute',
        top: 18, left: -28, right: -28,
        height: 22,
        background: 'repeating-linear-gradient(45deg, #ffd60a, #ffd60a 12px, #000 12px, #000 14px, #ffd60a 14px, #ffd60a 26px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: 'rotate(-6deg)',
        zIndex: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      }}>
        <span style={{
          fontFamily: '"Permanent Marker", system-ui',
          fontSize: 9, letterSpacing: 2, color: '#000',
          fontWeight: 900, textTransform: 'uppercase',
          background: '#ffd60a', padding: '0 8px',
          whiteSpace: 'nowrap',
        }}>⚠ ВРЕМЕННО НЕ РАБОТАЕТ</span>
      </div>
    </div>
  )
}

function CalButton({ onClick }) {
  const [pressed, setPressed] = useState(false)
  const [ripple, setRipple] = useState(false)

  const handle = () => {
    setPressed(true)
    setRipple(true)
    setTimeout(() => setPressed(false), 200)
    setTimeout(() => setRipple(false), 600)
    onClick?.()
  }

  return (
    <button onClick={handle} style={{
      all: 'unset',
      width: '100%',
      background: 'rgba(255,255,255,0.95)', color: '#000',
      border: '2px solid #000', borderRadius: 16,
      padding: '18px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      fontFamily: '"Permanent Marker", system-ui',
      fontWeight: 900, fontSize: 18, letterSpacing: 2,
      boxShadow: pressed ? '2px 2px 0 #ff99cc' : '4px 4px 0 #ff99cc',
      cursor: 'pointer',
      marginBottom: 12,
      position: 'relative', overflow: 'hidden',
      transform: pressed ? 'translate(2px, 2px)' : 'translate(0,0)',
      transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 200ms',
    }}>
      {/* Manga halftone corner */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0,
        width: 80, height: 80,
        backgroundImage: 'radial-gradient(rgba(255,153,204,0.5) 0.8px, transparent 1px)',
        backgroundSize: '6px 6px',
        maskImage: 'radial-gradient(70% 70% at 100% 100%, #000, transparent)',
        WebkitMaskImage: 'radial-gradient(70% 70% at 100% 100%, #000, transparent)',
        pointerEvents: 'none',
      }}/>
      {/* Shimmer */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
        backgroundSize: '30% 100%', backgroundRepeat: 'no-repeat',
        animation: 'btnShimmer 2.8s ease-in-out infinite',
      }}/>
      {/* Ripple */}
      {ripple && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,153,204,0.3)',
          borderRadius: 'inherit',
          animation: 'btnRipple 600ms ease-out forwards',
          pointerEvents: 'none',
        }}/>
      )}
      <span style={{ fontSize: 24, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>📅</span>
      <span style={{ position: 'relative', zIndex: 1 }}>ОТКРЫТЬ КАЛЕНДАРЬ</span>
      <style>{`
        @keyframes btnShimmer { 0%,100%{background-position:-40% 0} 50%{background-position:140% 0} }
        @keyframes btnRipple { from{transform:scale(0);opacity:1} to{transform:scale(3);opacity:0} }
      `}</style>
    </button>
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
        fontFamily: '"Nunito", system-ui',
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

// ─── Squad Counter — анимированный счётчик с прогресс-баром ──────────────────

function SquadCounter({ today = 0, total = 5, fullCount = 0 }) {
  const pct     = total > 0 ? (today / total) * 100 : 0
  const isFull  = today >= total
  const label   = isFull ? '🔥 СОСТАВ ГОТОВ' : today === 0 ? 'ГДЕ ВСЕ?' : today < total - 1 ? 'СОБИРАЕМСЯ...' : 'ПОЧТИ СОСТАВ'
  const barColor = isFull ? '#22c55e' : today >= total - 1 ? '#ff99cc' : today > 0 ? '#4cc9f0' : 'rgba(255,255,255,0.2)'

  return (
    <div style={{
      marginTop: 12, marginBottom: 12,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14, padding: '14px 16px',
    }}>
      {/* Top row */}
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom: 10 }}>
        <div style={{
          fontFamily:'"Nunito",system-ui', fontSize:10, letterSpacing:2.5,
          fontWeight:800, color:'rgba(255,255,255,0.4)',
        }}>СЕГОДНЯ</div>
        <div style={{
          fontFamily:'"Permanent Marker",system-ui',
          fontSize:13, letterSpacing:1.5,
          color: isFull ? '#22c55e' : 'rgba(255,255,255,0.35)',
        }}>{label}</div>
      </div>

      {/* Counter + bar row */}
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {/* Big number */}
        <div style={{
          fontFamily:'"Permanent Marker",system-ui',
          fontSize:42, lineHeight:1, color:'#fff',
          letterSpacing:-1, flexShrink:0,
          textShadow: isFull ? '0 0 20px rgba(34,197,94,0.5)' : 'none',
          transition:'text-shadow 0.5s',
        }}>
          {today}
          <span style={{ fontSize:20, color:'rgba(255,255,255,0.3)', letterSpacing:0 }}>/{total}</span>
        </div>

        {/* Progress bar */}
        <div style={{ flex:1 }}>
          {/* Bar track */}
          <div style={{
            height: 8, borderRadius: 999,
            background:'rgba(255,255,255,0.08)',
            overflow:'hidden', position:'relative',
          }}>
            <div style={{
              position:'absolute', inset:'0 auto 0 0',
              width:`${pct}%`,
              background: isFull
                ? 'linear-gradient(90deg,#22c55e,#86efac)'
                : `linear-gradient(90deg,${barColor},${barColor}cc)`,
              borderRadius:999,
              transition:'width 600ms cubic-bezier(0.34,1.56,0.64,1), background 500ms',
              boxShadow: isFull ? '0 0 8px rgba(34,197,94,0.6)' : 'none',
            }}/>
          </div>
          {/* Dots per slot */}
          <div style={{ display:'flex', gap:4, marginTop:7 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{
                flex:1, height:4, borderRadius:999,
                background: i < today
                  ? (isFull ? '#22c55e' : '#ff99cc')
                  : 'rgba(255,255,255,0.1)',
                transition:`background ${300 + i*60}ms ease`,
                boxShadow: i < today && isFull ? '0 0 4px rgba(34,197,94,0.5)' : 'none',
              }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Full house streak */}
      {fullCount > 0 && (
        <div style={{
          marginTop:10, paddingTop:10,
          borderTop:'1px solid rgba(255,255,255,0.06)',
          display:'flex', alignItems:'center', gap:6,
        }}>
          <span style={{ fontSize:12 }}>🔥</span>
          <span style={{
            fontFamily:'"Nunito",system-ui', fontSize:10,
            fontWeight:800, letterSpacing:1.5,
            color:'rgba(255,153,204,0.6)',
          }}>{fullCount} ПОЛНЫХ ДНЯ НА ГОРИЗОНТЕ</span>
        </div>
      )}
    </div>
  )
}

// ─── Manga secondary card ─────────────────────────────────────────────────────



// ─── Gojo Satoru SVG — chibi with blindfold ──────────────────────────────────

function GojoMascotSVG({ mode }) {
  return (
    <svg viewBox="0 0 200 230" width="100%" style={{ display: 'block', overflow: 'visible' }}>

      {/* ── BODY ── */}
      {/* Neck */}
      <rect x="92" y="115" width="16" height="7" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.5"/>

      {/* JJK uniform — dark navy/black */}
      <path d="M 74 120 Q 66 136 62 158 L 56 202 Q 100 212 144 202 L 138 158 Q 134 136 126 120 Z"
        fill="#1a1a2e" stroke="#0a0a0a" strokeWidth="2.6"/>
      {/* uniform collar V-shape */}
      <path d="M 80 118 L 100 130 L 120 118 L 120 132 L 100 138 L 80 132 Z"
        fill="#0f0f1a" stroke="#0a0a0a" strokeWidth="2"/>
      {/* uniform white trim line */}
      <line x1="80" y1="125" x2="100" y2="133" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
      <line x1="120" y1="125" x2="100" y2="133" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
      {/* center seam */}
      <line x1="100" y1="138" x2="100" y2="202" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>

      {/* Arms based on mode */}
      {mode === 'laptop' && (
        <>
          {/* left arm */}
          <path d="M 66 172 Q 58 180 62 192 L 74 192 L 76 176 Z" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2"/>
          {/* right arm */}
          <path d="M 134 172 Q 142 180 138 192 L 126 192 L 124 176 Z" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2"/>
          {/* laptop */}
          <path d="M 48 172 L 152 172 L 158 144 L 42 144 Z" fill="#1a1a2e" stroke="#0a0a0a" strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M 52 169 L 148 169 L 154 147 L 46 147 Z" fill="#0a0a14"/>
          <text x="100" y="163" textAnchor="middle" fontFamily="Permanent Marker, system-ui" fontSize="11" fill="#ff99cc">EG</text>
          <path d="M 36 182 L 164 182 L 172 204 L 28 204 Z" fill="#2a2a3f" stroke="#0a0a0a" strokeWidth="2.2" strokeLinejoin="round"/>
          {/* keys */}
          {Array.from({length:18}).map((_,i)=>(
            <rect key={i} x={44+(i%9)*10} y={184+Math.floor(i/9)*5.5} width="7.5" height="3.5" rx="0.8"
              fill={i===4||i===13?"#ff99cc":"#3a3a4a"}/>
          ))}
          {/* tap animation */}
          <g style={{transformOrigin:'68px 188px', animation:'bcTapL 0.7s ease-in-out infinite'}}>
            <path d="M 64 172 Q 58 182 62 190 L 74 190 L 76 176 Z" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8"/>
          </g>
          <g style={{transformOrigin:'132px 188px', animation:'bcTapR 0.7s ease-in-out infinite'}}>
            <path d="M 136 172 Q 142 182 138 190 L 126 190 L 124 176 Z" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8"/>
          </g>
        </>
      )}
      {mode === 'gaming' && (
        <>
          <path d="M 74 126 Q 62 154 74 172 L 90 166 L 86 134 Z" fill="#1a1a2e" stroke="#0a0a0a" strokeWidth="2"/>
          <path d="M 126 126 Q 138 154 126 172 L 110 166 L 114 134 Z" fill="#1a1a2e" stroke="#0a0a0a" strokeWidth="2"/>
          <g style={{transformOrigin:'100px 170px', animation:'bcWiggle 1.3s ease-in-out infinite'}}>
            <rect x="72" y="160" width="56" height="30" rx="13" fill="#2a2a3f" stroke="#0a0a0a" strokeWidth="2"/>
            <rect x="82" y="168" width="5" height="5" rx="1" fill="#666"/>
            <rect x="90" y="164" width="5" height="5" rx="1" fill="#666"/>
            <circle cx="118" cy="168" r="3.5" fill="#ff99cc" stroke="#0a0a0a" strokeWidth="1.2"/>
            <circle cx="126" cy="174" r="3.5" fill="#fff" stroke="#0a0a0a" strokeWidth="1.2"/>
            <circle cx="112" cy="174" r="3.5" fill="#4fc" stroke="#0a0a0a" strokeWidth="1.2"/>
            <ellipse cx="78" cy="174" rx="5" ry="5" fill="#1a1a2e" stroke="#0a0a0a" strokeWidth="1.2"/>
            <line x1="75" y1="174" x2="81" y2="174" stroke="#666" strokeWidth="1.2"/>
            <line x1="78" y1="171" x2="78" y2="177" stroke="#666" strokeWidth="1.2"/>
          </g>
          <g style={{animation:'bcSparkle 0.9s linear infinite'}}>
            <text x="148" y="155" fontSize="10" fill="#ff99cc">✦</text>
          </g>
          <ellipse cx="88" cy="165" rx="6" ry="5" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8"/>
          <ellipse cx="112" cy="165" rx="6" ry="5" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8"/>
        </>
      )}
      {mode === 'beer' && (
        <>
          <path d="M 68 132 Q 54 164 58 192 L 68 196 Q 72 172 80 140 Z" fill="#1a1a2e" stroke="#0a0a0a" strokeWidth="2"/>
          <g style={{transformOrigin:'124px 126px', animation:'bcSip 3.4s ease-in-out infinite'}}>
            <path d="M 122 126 L 140 118 L 158 132 L 150 144 L 132 136 Z" fill="#1a1a2e" stroke="#0a0a0a" strokeWidth="2.2"/>
            <g transform="translate(142 104)">
              <rect x="-14" y="-18" width="28" height="34" rx="3" fill="#fafaf7" stroke="#0a0a0a" strokeWidth="2.2"/>
              <path d="M -14 -16 Q -10 -25 -4 -18 Q 0 -27 6 -18 Q 12 -25 14 -16 L 14 -10 L -14 -10 Z"
                fill="#fff" stroke="#0a0a0a" strokeWidth="2"/>
              <line x1="-14" y1="-2" x2="14" y2="-2" stroke="#0a0a0a" strokeWidth="1" opacity="0.3"/>
              <path d="M 14 -8 Q 24 -4 24 4 Q 24 12 14 12" fill="none" stroke="#0a0a0a" strokeWidth="2.2"/>
              <ellipse cx="-14" cy="6" rx="6" ry="5" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8"/>
            </g>
            <circle cx="138" cy="88" r="1.8" fill="#fff" opacity="0.7">
              <animate attributeName="cy" values="94;78" dur="1.8s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0;0.8;0" dur="1.8s" repeatCount="indefinite"/>
            </circle>
          </g>
        </>
      )}
      {mode === 'wait' && (
        <>
          <path d="M 74 134 Q 66 150 100 162 L 126 154 L 132 144 Q 112 140 100 144 L 86 137 Z"
            fill="#1a1a2e" stroke="#0a0a0a" strokeWidth="2"/>
          <path d="M 126 140 Q 132 158 100 164 L 78 156 L 72 146 Q 94 146 100 150 L 118 138 Z"
            fill="#0f0f1a" stroke="#0a0a0a" strokeWidth="2"/>
          <ellipse cx="74" cy="150" rx="5" ry="4" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8"/>
          <ellipse cx="126" cy="150" rx="5" ry="4" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8"/>
          <g style={{animation:'bcDots 1.4s ease-in-out infinite'}}>
            <circle cx="158" cy="62" r="2.4" fill="#ff99cc" stroke="#0a0a0a" strokeWidth="1"/>
            <circle cx="168" cy="56" r="2" fill="#ff99cc" stroke="#0a0a0a" strokeWidth="1" opacity="0.7"/>
            <circle cx="176" cy="50" r="1.6" fill="#ff99cc" stroke="#0a0a0a" strokeWidth="1" opacity="0.45"/>
          </g>
        </>
      )}

      {/* ── HEAD ── */}
      {/* Hair back — big fluffy white spikes */}
      <g style={{transformOrigin:'100px 88px', animation:'bcHairSway 3.4s ease-in-out infinite'}}>
        <path d="M 54 98 L 44 80 L 30 62 L 48 52 L 34 32 L 58 36 L 48 8 L 76 32 L 74 4 L 94 28 L 108 2 L 116 30 L 132 8 L 132 34 L 154 16 L 148 36 L 172 32 L 160 54 L 178 60 L 162 74 L 178 84 L 156 94 L 170 110 Q 132 106 100 104 Q 68 106 54 98 Z"
          fill="#f0f0f0" stroke="#0a0a0a" strokeWidth="2.6" strokeLinejoin="miter"/>
        <path d="M 76 50 L 94 30 L 106 52 L 98 72 L 84 67 Z" fill="#e0e0e0" opacity="0.8"/>
        <path d="M 110 28 L 124 46 L 116 66 L 106 56 Z" fill="#e8e8e8" opacity="0.6"/>
      </g>

      {/* Ears */}
      <ellipse cx="64" cy="91" rx="4.5" ry="7" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8"/>
      <ellipse cx="136" cy="91" rx="4.5" ry="7" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="1.8"/>

      {/* Face skin */}
      <ellipse cx="100" cy="86" rx="37" ry="34" fill="#fde6dc" stroke="#0a0a0a" strokeWidth="2.6"/>

      {/* Front bangs over forehead */}
      <path d="M 66 72 L 58 108 L 76 94 L 82 102 L 88 82 Z" fill="#f0f0f0" stroke="#0a0a0a" strokeWidth="2.2" strokeLinejoin="miter"/>
      <path d="M 93 80 L 98 112 L 106 97 L 112 108 L 120 86 Z" fill="#f0f0f0" stroke="#0a0a0a" strokeWidth="2.2" strokeLinejoin="miter"/>
      <path d="M 126 80 L 136 102 L 132 80 Z" fill="#f0f0f0" stroke="#0a0a0a" strokeWidth="2.2"/>

      {/* ── BLINDFOLD (key Gojo feature!) ── */}
      {/* main band */}
      <path d="M 62 82 Q 100 76 138 82 L 138 96 Q 100 100 62 96 Z"
        fill="#0a0a0a" stroke="#0a0a0a" strokeWidth="1"/>
      {/* fabric fold highlight */}
      <path d="M 66 84 Q 100 79 134 84" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" fill="none"/>
      {/* subtle eye bulge under blindfold */}
      <ellipse cx="82" cy="89" rx="11" ry="5" fill="#111" opacity="0.6"/>
      <ellipse cx="118" cy="89" rx="11" ry="5" fill="#111" opacity="0.6"/>
      {/* blindfold knot at back - implied by slight wrap effect */}
      <path d="M 62 82 Q 56 89 62 96" stroke="#0a0a0a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M 138 82 Q 144 89 138 96" stroke="#0a0a0a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

      {/* Nose */}
      <ellipse cx="100" cy="100" rx="2" ry="1.5" fill="rgba(0,0,0,0.15)"/>

      {/* Mouth — confident smirk */}
      <path d="M 94 108 Q 100 114 108 110" stroke="#c07070" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M 94 108 Q 92 110 94 112" stroke="#c07070" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

      {/* Cheek blush */}
      <ellipse cx="74" cy="102" rx="4" ry="2.5" fill="#ff99cc" opacity="0.45"/>
      <ellipse cx="126" cy="102" rx="4" ry="2.5" fill="#ff99cc" opacity="0.45"/>

      {/* Six Eyes glow — subtle purple aura around blindfold */}
      <ellipse cx="82" cy="89" rx="13" ry="7" fill="none"
        stroke="rgba(139,92,246,0.35)" strokeWidth="2"
        style={{animation:'bcSixEyes 2s ease-in-out infinite'}}/>
      <ellipse cx="118" cy="89" rx="13" ry="7" fill="none"
        stroke="rgba(139,92,246,0.35)" strokeWidth="2"
        style={{animation:'bcSixEyes 2s ease-in-out infinite'}}/>

      <style>{`
        @keyframes bcHairSway { 0%,100%{transform:rotate(-1.5deg)} 50%{transform:rotate(1.5deg)} }
        @keyframes bcSip { 0%,40%,100%{transform:rotate(0deg)} 60%,80%{transform:rotate(-22deg)} }
        @keyframes bcDots { 0%,100%{opacity:0.4;transform:translateY(0)} 50%{opacity:1;transform:translateY(-3px)} }
        @keyframes bcBubble { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-2px)} }
        @keyframes bcWiggle { 0%,100%{transform:rotate(-2deg)} 50%{transform:rotate(2deg)} }
        @keyframes bcTapL { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes bcTapR { 0%,100%{transform:translateY(-3px)} 50%{transform:translateY(0)} }
        @keyframes bcSparkle { 0%,100%{opacity:0.2} 50%{opacity:1} }
        @keyframes bcSixEyes {
          0%,100%{opacity:0.3;stroke-width:1.5px}
          50%{opacity:0.7;stroke-width:2.5px}
        }
      `}</style>
    </svg>
  )
}

// ─── Avail view ───────────────────────────────────────────────────────────────

function AvailView({ data, user, onBack, onReload }) {
  const { toast, showToast } = useToast()
  const [openDay, setOpenDay]           = useState(null)
  const [recentlyChanged, setRecentlyChanged] = useState(null)
  const [skeletonDone, setSkeletonDone] = useState(false)
  const [localSlots, setLocalSlots]     = useState(null)

  // Pull-to-refresh
  const [pullY, setPullY]         = useState(0)
  const [pulling, setPulling]     = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const touchStartY = useRef(0)
  const scrollRef   = useRef(null)
  const pullYRef    = useRef(0)  // ref для чтения внутри closure
  const PULL_THRESHOLD = 64

  // Pull-to-refresh через useEffect — единственный способ получить passive:false
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let startY = 0
    let pulling = false

    function onStart(e) {
      if (el.scrollTop > 0) return
      startY = e.touches[0].clientY
      pulling = false
    }

    function onMove(e) {
      if (el.scrollTop > 0) { setPullY(0); return }
      const dy = e.touches[0].clientY - startY
      if (dy > 4) {
        e.preventDefault() // работает только с passive:false
        pulling = true
        setPulling(true)
const v = Math.min(dy * 0.45, PULL_THRESHOLD + 16)
        pullYRef.current = v
        setPullY(v)
      }
    }

    async function onEnd() {
      if (!pulling) return
      pulling = false
      setPulling(false)
      const currentY = pullYRef.current
      setPullY(0)
      if (currentY >= PULL_THRESHOLD) {
        setRefreshing(true)
        hapticFeedback('medium')
        try {
          await onReload()
        } catch(e) {
          console.error('refresh error:', e)
        } finally {
          setRefreshing(false)
        }
      }
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove',  onMove,  { passive: false }) // passive:false — ключевое
    el.addEventListener('touchend',   onEnd,   { passive: true })

    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove',  onMove)
      el.removeEventListener('touchend',   onEnd)
    }
  }, [skeletonDone, onReload])

  useEffect(() => {
    const id = setTimeout(() => setSkeletonDone(true), 600)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!data || !user) return
    const myId = Number(user.id)
    // Сбрасываем localSlots только если сервер вернул наши данные
    // (хотя бы в одном слоте есть наш ID)
    const slots = data?.slots || []
    const hasOurData = slots.some(s =>
      [...(s.can||[]), ...(s.cant||[])].some(p => Number(p.user_id) === myId)
    )
    // Всегда сбрасываем — SSE гарантирует что данные свежие
    setLocalSlots(null)
  }, [data])

  const days     = useMemo(() => generateDays(data?.days_ahead || 14), [data?.days_ahead])
  const teamSize = data?.team_size || 5

  // useMemo — не пересчитываем на каждый ре-рендер
  const sourceSlots = localSlots ?? (data?.slots || [])
  const dayDataMap = useMemo(() => {
    const map = {}
    sourceSlots.forEach(s => {
      map[s.slot_date] = { can: s.can || [], cant: s.cant || [] }
    })
    return map
  }, [sourceSlots])

  const todayKey  = useMemo(() => formatDateKey(new Date()), [])
  const todayBest = dayDataMap[todayKey]?.can?.length || 0

  const handlePick = useCallback(async (timeText, status) => {
    if (!openDay) return
    hapticFeedback('medium')
    const dateKey = formatDateKey(openDay)

    // ── Оптимистичное обновление — сразу меняем UI ──
    const prevSlots = localSlots ?? (data?.slots || [])
    const myId = Number(user?.id)
    const myUsername = user?.username || ''
    const myDisplay  = user?.first_name || user?.username || 'Я'

    const updatedSlots = prevSlots.map(slot => {
      if (slot.slot_date !== dateKey) return slot
      let can  = (slot.can  || []).filter(p => Number(p.user_id) !== myId)
      let cant = (slot.cant || []).filter(p => Number(p.user_id) !== myId)
      if (status === 'can')  can  = [...can,  { user_id: myId, username: myUsername, display_name: myDisplay, time_text: timeText }]
      if (status === 'cant') cant = [...cant, { user_id: myId, username: myUsername, display_name: myDisplay, time_text: '' }]
      return { ...slot, can, cant }
    })

    const hasSlot = prevSlots.some(s => s.slot_date === dateKey)
    if (!hasSlot && status !== 'clear') {
      const newSlot = { slot_date: dateKey, can: [], cant: [] }
      if (status === 'can')  newSlot.can  = [{ user_id: myId, username: myUsername, display_name: myDisplay, time_text: timeText }]
      if (status === 'cant') newSlot.cant = [{ user_id: myId, username: myUsername, display_name: myDisplay, time_text: '' }]
      updatedSlots.push(newSlot)
    }

    setLocalSlots(updatedSlots)
    setRecentlyChanged(dateKey)
    setTimeout(() => setRecentlyChanged(null), 700)

    // ── Отправляем на сервер в фоне — с таймаутом 5 сек ──
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 5000)
      await apiPost('/api/availability', { slot_date: dateKey, time_text: timeText, status })
      clearTimeout(timer)
      notificationFeedback('success')
      // Показываем toast с подтверждением
      const statusLabel = status === 'can' ? 'Отмечено ✓' : status === 'cant' ? 'Пас отмечен' : 'Отметка снята'
      const timeLabel = timeText && timeText !== 'ALL DAY' && timeText !== 'anytime'
        ? ` · ${timeText === 'MORNING' ? 'Утро' : timeText === 'DAY' ? 'День' : timeText === 'NIGHT' ? 'Ночь' : timeText}`
        : ''
      showToast(`${statusLabel}${timeLabel}`)
    } catch (err) {
      console.error('handlePick error:', err)
      notificationFeedback('error')
      showToast('Ошибка сохранения', 'error')
      setLocalSlots(null)
    }
  }, [openDay, localSlots, data, user])

  const week1 = days.slice(0, 7)
  const week2 = days.slice(7, 14)

  return (
    <div style={{
      position: 'relative', height: '100vh', overflow: 'hidden',
      color: '#f5f3ee', fontFamily: '"Nunito", system-ui, sans-serif',
    }}>
      <MangaBg petals halftone />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Back button */}
        <div style={{
          position: 'absolute', top: 12, left: 12, zIndex: 90,
        }}>
          <button onClick={() => { hapticFeedback(); onBack() }} style={{
            all: 'unset', cursor: 'pointer',
            width: 38, height: 38, borderRadius: 12,
            background: 'rgba(255,255,255,0.12)',
            border: '1.5px solid rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div style={{ height: 8, flexShrink: 0 }} />
        <div
          ref={scrollRef}
          style={{ flex: 1, overflow: 'auto', position: 'relative', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}
        >
          {/* Pull-to-refresh индикатор */}
          <div style={{
            height: pullY || (refreshing ? 48 : 0),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
            transition: pulling ? 'none' : 'height 300ms cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {(pullY > 10 || refreshing) && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                fontFamily: '"Nunito",system-ui', fontSize: 11, fontWeight: 800,
                color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ff99cc',
                  animation: refreshing ? 'spin 0.7s linear infinite' : 'none',
                  transform: !refreshing ? `rotate(${Math.min(pullY / PULL_THRESHOLD, 1) * 360}deg)` : undefined,
                  transition: pulling ? 'none' : 'transform 200ms',
                }}/>
                {refreshing ? 'ОБНОВЛЯЕМ...' : pullY >= PULL_THRESHOLD ? 'ОТПУСТИ' : 'ПОТЯНИ ЕЩЁ'}
              </div>
            )}
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
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
                      <DayCard key={key} date={d}
                        dayData={dayDataMap[key] || { can: [], cant: [] }}
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
                      <DayCard key={key} date={d}
                        dayData={dayDataMap[key] || { can: [], cant: [] }}
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
            cantCount={dayDataMap[todayKey]?.cant?.length || 0}
            teamSize={teamSize}
            onMore={() => {
              const todayDate = days.find(d => isToday(d))
              if (todayDate) setOpenDay(todayDate)
            }}
          />
        </div>
      )}

      <Toast toast={toast}/>

      {openDay && (
        <DayModal
          date={openDay}
          dayData={dayDataMap[formatDateKey(openDay)] || { can: [], cant: [] }}
          teamSize={teamSize}
          user={user}
          onPick={handlePick}
          onClose={() => setOpenDay(null)}
        />
      )}
    </div>
  )
}
