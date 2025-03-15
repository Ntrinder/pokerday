import {createContext, useContext, useState} from "react";

interface RoomContextType {
    roomCode: string;
    joiners: string[];
    setRoomCode: (code: string) => void;
    setJoiners: (users: string[]) => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({children}: {children: React.ReactNode})  {
    const [roomCode, setRoomCode] = useState('');
    const [joiners, setJoiners] = useState<string[]>([]);


    return (
        <RoomContext.Provider value={{ roomCode, joiners, setRoomCode, setJoiners }}>
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
