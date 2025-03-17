import { Link } from "react-router-dom";
import Card from "../components/Card";
import { useEffect, useState } from "react";
import Vote from "../components/Vote.tsx";
import SummaryItem from "../components/SummaryItem.tsx";
import Joiner from "../components/Joiner.tsx";
import { useRoom } from "../providers/RoomContext.tsx";
import { useSocket } from "../providers/SocketContext.tsx";


function EstimatePage() {
  const fib: number[] = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 90];
  const [selectedNumber, setSelectedNumber] = useState<number>(-1);
  const [lockedIn, setLockedIn] = useState<boolean>(false);
  const [joiners, setJoiners] = useState<string[]>([]);
  const {roomCode, name} = useRoom();
  const {socket} = useSocket();
  const [votes, setVotes] = useState<{ name: string; vote: number }[]>([]);


  useEffect(() => {
    if (!socket) return;

    socket.on("roomMembersUpdate", (members) => {
      setJoiners(members);
    });

    socket.on("voteUpdate", (votesUpdate) => {
      setVotes(votesUpdate);
    });

    socket.on("votesLocked", () => setLockedIn(true));
    socket.on("votesUnlocked", () => setLockedIn(false));

    const handleUnload = () => {
      if (socket && roomCode && name) {
        socket.emit("leaveRoom", { roomId: roomCode, name });
      }
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      socket.off("roomMembersUpdate");
      socket.off("voteUpdate");
      socket.off("lockVotes");
      socket.off("unlockVotes");
      socket.emit("leaveRoom", {roomId: roomCode, name});
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const handleCardClick = (clickedNumber: number) => {
    const deselect = clickedNumber === selectedNumber;
    if (!lockedIn && socket) {
      setSelectedNumber(deselect ? -1 : clickedNumber);
      if (deselect) {
        socket.emit("removeVote", {roomId: roomCode, name});
      } else {
        socket.emit("addVote", {roomId: roomCode, name, vote: clickedNumber});
      }
    }
  }

  const handleLockedClick = () => {
    if (socket) {
      socket.emit(lockedIn ? "unlockVotes" : "lockVotes", {roomId: roomCode});
    }
  }

  const calcMeanVote = () => {
    const total = votes.reduce((acc, curr) => acc + curr.vote, 0)
    const mean = total / votes.length;
    return mean.toPrecision(2)
  }

  const calcModeVote = (): number[] => {
    const frequencyMap: Record<number, number> = {};

    for (const vote of votes) {
      frequencyMap[vote.vote] = (frequencyMap[vote.vote] || 0) + 1;
    }

    const maxCount = Math.max(...Object.values(frequencyMap));
    return Object.keys(frequencyMap)
      .filter((value) => frequencyMap[Number(value)] === maxCount)
      .map(Number);
  };

  return (
    <>
      {/*Header Part*/}
      <div className='estimate-container'>
        <Link className={'home-link'} to={'/'}>🏠</Link>
        <h1>Estimate Me</h1>
      </div>

      <div id='room-code'>
        room code: {roomCode}
      </div>

      {/*Card Part*/}
      <div className="cards-container">
        {fib.map((cardFaceValue) => {
          return (
            <div key={`card-${cardFaceValue}`} className="card-container">
              <Card
                key={cardFaceValue}
                cardFaceValue={cardFaceValue}
                clickCallback={handleCardClick}
                selectedNumber={selectedNumber}
                lockedIn={lockedIn}
              />


              {/*Vote Results Part*/}
              {
                lockedIn && votes
                  .filter(vote => vote.vote === cardFaceValue)
                  .map(vote => {
                      return (
                        <Vote key={vote.name} name={vote.name}/>
                      )
                    }
                  )
              }
            </div>
          )
          }
        )}
      </div>


      {/*Button Part*/}
      <button onClick={() => handleLockedClick()}
              className={'lock-btn'}>
        {lockedIn ? '🔓 Unlock ' : '🔒 Lock In'}
      </button>


      {/*Who's Joined Part*/}
      {
        !lockedIn &&
        <div className="whos-joined-container">
          <h3>Who's Joined</h3>
          <div className="joiner-container">
            {
              joiners
                .map((joiner) => {
                    return (
                      <Joiner
                        key={`joiner-${joiner}`}
                        voted={votes.some(vote => vote.name === joiner)}
                        name={joiner}/>
                    )
                  }
                )
            }
          </div>
        </div>
      }


      {/*Summary Part*/}
      {
        lockedIn &&
        <div className="summary-container">
          <h3>Summary</h3>
          <SummaryItem label="Number of votes" value={votes.length}/>
          <SummaryItem label="Mean" value={calcMeanVote() + "pts"}/>
          <SummaryItem label="Mode" value={calcModeVote().join("pts ") + "pts"}/>
        </div>
      }
    </>
  )
}

export default EstimatePage;
