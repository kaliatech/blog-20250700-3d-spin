import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootEl = document.getElementById('root')

rootEl?.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault()
  },
  { passive: false },
)

createRoot(rootEl!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
