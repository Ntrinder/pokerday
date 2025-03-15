import {useNavigate} from "react-router-dom";
import {createRoom, joinRoom} from "../services/apiService.ts";
import {useState} from "react";
import {useRoom} from "../providers/RoomContext.tsx";

function HomePage() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [roomCodeInput, setRoomCodeInput] = useState("");
    const {setRoomCode, setJoiners} = useRoom();

    const handleCreateRoom = async () => {
        try {
            const createResponse = await createRoom();
            const newRoomCode = createResponse.roomId;
            setRoomCode(newRoomCode);
            return newRoomCode;
        } catch (error) {
            console.log(error);
        }
    }

    const handleJoinRoom = async (roomId: string) => {
        try {
            const joinRoomResponse = await joinRoom({roomId, name});
            setJoiners(joinRoomResponse);
            setRoomCode(roomId);
            navigate('/estimate');
        } catch (error) {
            console.log(error);
        }
    }

    const handleCreateRoomClick = async () => {
        try {
            const roomId = await handleCreateRoom();
            await handleJoinRoom(roomId);
        } catch (error) {
            console.error(error);
        }
    }

    const handleJoinRoomClick = async () => {
        try {
            await handleJoinRoom(roomCodeInput);
        } catch (error) {
            console.error(error);
        }
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleRoomCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRoomCodeInput(event.target.value);
    };

    return (
        <>
            <div className={'arc'}/>
            <h1>pokerday</h1>
            <div className="room-btns-container">
                {/*Username Part*/}
                <div className="enter-username-container">
                    <input
                        type="text"
                        placeholder="...enter name :)"
                        maxLength={30}
                        className={'username-input'}
                        onChange={handleNameChange}
                    />
                </div>


                {/*Create Room Part*/}
                <div className="create-room-container">
                    Create New Room
                    <button
                        onClick={() => handleCreateRoomClick()}
                        className={'create-room-btn'}
                    >♠️♦️♣️♥️</button>
                </div>


                {/*Join Room Part*/}
                <div className="join-room-container">
                    Join Room
                    <div className="join-room-elements-container">
                        <input
                            type="text"
                            placeholder="code"
                            maxLength={4}
                            className={'join-room-input'}
                            onChange={handleRoomCodeChange}
                        />
                        <button
                            onClick={() => handleJoinRoomClick()}
                            className={'join-room-btn'}
                        >🚀</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomePage;