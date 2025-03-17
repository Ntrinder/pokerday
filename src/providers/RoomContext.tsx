import { createContext, useContext, useState } from "react";

interface RoomContextType {
  roomCode: string;
  name: string
  setRoomCode: (code: string) => void;
  setName: (name: string) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({children}: { children: React.ReactNode }) {
  const [roomCode, setRoomCode] = useState('');
  const [name, setName] = useState('');

  return (
    <RoomContext.Provider value={{roomCode, name, setRoomCode, setName}}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
}
