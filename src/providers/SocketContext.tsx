import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({socket: null});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {autoConnect: false});

    newSocket.connect();

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket:", newSocket.id);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{socket}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
