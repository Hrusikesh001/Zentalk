import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import { SocketProvider } from './context/socketContext.jsx'
import { DrawerProvider } from './context/DrawerContext.jsx'
import { CallProvider } from './context/CallContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <SocketProvider>
        <DrawerProvider>
          <CallProvider>
            <App />
          </CallProvider>
        </DrawerProvider>
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
)
