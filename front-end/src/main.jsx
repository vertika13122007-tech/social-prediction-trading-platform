import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from './context/NotificationContext.jsx';
import { LiveUpdatesProvider } from './context/LiveUpdatesContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <LiveUpdatesProvider>
          <App />
        </LiveUpdatesProvider>
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>,
)
