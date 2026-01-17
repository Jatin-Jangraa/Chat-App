import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './Context/AuthContect.tsx'
import { ChatProvider } from './Context/Chat.context.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <ChatProvider>
    <App />
    </ChatProvider>
    </AuthProvider>
  </StrictMode>,
)
