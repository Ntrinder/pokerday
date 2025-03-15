import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {RoomProvider} from "./providers/RoomContext.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RoomProvider>
          <App />
      </RoomProvider>
  </StrictMode>,
)
