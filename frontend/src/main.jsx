import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
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
            <GoogleOAuthProvider
              clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                <App />
            </GoogleOAuthProvider>
          </CallProvider>
        </DrawerProvider>
      </SocketProvider>
    </AuthProvider>
  </BrowserRouter>
)
