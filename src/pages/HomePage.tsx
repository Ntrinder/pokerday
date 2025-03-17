import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../services/apiService.ts";
import { useEffect, useState } from "react";
import { useRoom } from "../providers/RoomContext.tsx";
import { useSocket } from "../providers/SocketContext.tsx";


function HomePage() {
  const navigate = useNavigate();
  const [roomCodeInput, setRoomCodeInput] = useState("");
  const {name, setRoomCode, setName} = useRoom();
  const {socket} = useSocket();
  const [error, setError] = useState("");

  useEffect(() => {
    setName("");
  }, []);

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

      if (roomId === "") {
        setError("Please enter a room code");
        return
      }

      if (name === "") {
        setError("Please enter a display name");
        return
      }

      await joinRoom({roomId, name});
      setRoomCode(roomId);

      if (socket) {
        socket.emit('joinRoom', {roomId, name});
      }

      navigate('/estimate');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
      return;
    }
  }

  const handleCreateRoomClick = async () => {
    if (!name.trim()) {
      setError("Please enter a display name");
      return;
    }
    setError("");
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
            placeholder="...enter your display name :)"
            maxLength={30}
            className={'username-input'}
            onChange={handleNameChange}
          />
        </div>


        {/*Create Room Part*/}
        <div className="create-room-container">
          <button
            onClick={() => handleCreateRoomClick()}
            className={'create-room-btn'}
          >create new room</button>
        </div>


        {/*Join Room Part*/}
        <div className="join-room-container">
          <input
            type="text"
            placeholder="enter room code"
            maxLength={4}
            className={'join-room-input'}
            onChange={handleRoomCodeChange}
          />
          <button
            onClick={() => handleJoinRoomClick()}
            className={'join-room-btn'}
          >join 🚀
          </button>
        </div>
      </div>
      {error && <p className="error-text">{error}</p>}
    </>
  )
}

export default HomePage;
