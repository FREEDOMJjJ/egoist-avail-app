// EGOIST monochrome manga palette + helpers

export const BC_COLORS = {
  ink:       '#000000',
  paper:     '#ffffff',
  paperDim:  '#f3f1ec',
  charcoal:  '#0a0a0a',
  graphite:  '#1a1a1a',
  ash:       '#2a2a2a',
  steel:     '#6a6a6a',
  mist:      '#c8c4c0',
  pink:      '#ff99cc',
  petal:     '#ffb7c5',
  textOnInk: '#f5f3ee',
  textDim:   'rgba(245,243,238,0.55)',
  textFaint: 'rgba(245,243,238,0.32)',
  border:    'rgba(255,255,255,0.14)',
}

// Sunday-first (matches Date.getDay())
export const WEEKDAYS_RU_SHORT = ['ВС','ПН','ВТ','СР','ЧТ','ПТ','СБ']
export const MONTHS_RU = ['ЯНВ','ФЕВ','МАР','АПР','МАЯ','ИЮН','ИЮЛ','АВГ','СЕН','ОКТ','НОЯ','ДЕК']
export const MONTHS_RU_LONG = ['ЯНВАРЯ','ФЕВРАЛЯ','МАРТА','АПРЕЛЯ','МАЯ','ИЮНЯ','ИЮЛЯ','АВГУСТА','СЕНТЯБРЯ','ОКТЯБРЯ','НОЯБРЯ','ДЕКАБРЯ']

export function isToday(date) {
  const now = new Date()
  return date.getFullYear() === now.getFullYear() &&
         date.getMonth()    === now.getMonth()    &&
         date.getDate()     === now.getDate()
}

export function isPast(date) {
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const d   = new Date(date); d.setHours(0, 0, 0, 0)
  return d < now
}

export function formatDateKey(date) {
  const yyyy = date.getFullYear()
  const mm   = String(date.getMonth() + 1).padStart(2, '0')
  const dd   = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function generateDays(count) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i); return d
  })
}
