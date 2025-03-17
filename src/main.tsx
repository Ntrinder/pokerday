import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RoomProvider } from "./providers/RoomContext.tsx";
import { SocketProvider } from "./providers/SocketContext.tsx";

createRoot(document.getElementById('root')!).render(
  <SocketProvider>
    <RoomProvider>
      <App/>
    </RoomProvider>
  </SocketProvider>
)
