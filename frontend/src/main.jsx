import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Router from './Router.jsx'
import './style.css'
import apiService from './services/ApiService.js'
import { ThemeProvider } from './contexts/ThemeContext.jsx';
window.api = apiService;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
        <Router />
    </ThemeProvider>
  </StrictMode>,
)
