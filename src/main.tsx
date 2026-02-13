import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './scss/normalize.css'
import './index.scss'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
