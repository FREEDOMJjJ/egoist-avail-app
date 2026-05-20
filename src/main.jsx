import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// Initialize Telegram WebApp
try {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready()
    window.Telegram.WebApp.expand()
    window.Telegram.WebApp.setHeaderColor('#0a0a0a')
    window.Telegram.WebApp.setBackgroundColor('#0a0a0a')
  }
} catch (e) {
  console.warn('Telegram WebApp init error:', e)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
