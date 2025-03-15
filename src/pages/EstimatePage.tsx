import {Link} from "react-router-dom";
import Card from "../components/Card";
import {useEffect, useState} from "react";
import Vote from "../components/Vote.tsx";
import SummaryItem from "../components/SummaryItem.tsx";
import Joiner from "../components/Joiner.tsx";
import {useRoom} from "../providers/RoomContext.tsx";
import { io } from "socket.io-client";

function EstimatePage() {
    const fib: number[] = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 90];
    const socket = io("http://localhost:5000");
    const [selectedNumber, setSelectedNumber] = useState<number>(-1);
    const [lockedIn, setLockedIn] = useState<boolean>(false);
    const { roomCode, joiners, setJoiners } = useRoom();
    const votes: {name: string; value: number}[] = [
        {name: 'niall', value: 0},
        {name: 'przem', value: 2},
        {name: 'james', value: 3},
        {name: 'rachel', value: 3},
        {name: 'kit', value: 5},
        {name: 'maurizio', value: 5},
        {name: 'aisling', value: 5},
    ]

    useEffect(() => {
        socket.emit("joinRoom", { roomId: roomCode, name: "me" });

        const handleUpdateJoiners = (newJoiners) => {
            console.log("Updated joiners:", newJoiners);
        };

        socket.on("updateJoiners", handleUpdateJoiners);

        // Cleanup function to remove listener
        return () => {
            socket.off("updateJoiners", handleUpdateJoiners);
        };
    }, [roomCode]);

    const updateAndLogCardNumber = (newSelectedNumber: number) => {
        if (!lockedIn) {
            setSelectedNumber(newSelectedNumber !== selectedNumber ? newSelectedNumber : -1);
        }
    }

    const calcMeanVote = () => {
        const total = votes.reduce((acc, curr) => acc += curr.value, 0)
        const mean = total / votes.length;
        return mean.toPrecision(2)
    }

    const calcModeVote = (): number[] => {
        const frequencyMap: Record<number, number> = {};

        for (const vote of votes) {
            frequencyMap[vote.value] = (frequencyMap[vote.value] || 0) + 1;
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
                { fib.map(cardFaceValue => {
                    return (
                        <div className="card-container">
                            <Card
                                key={cardFaceValue}
                                cardFaceValue={cardFaceValue}
                                clickCallback={updateAndLogCardNumber}
                                selectedNumber={selectedNumber}
                                lockedIn={lockedIn}
                            />


                            {/*Vote Results Part*/}
                            {
                                lockedIn && votes
                                    .filter(vote => vote.value === cardFaceValue)
                                    .map(vote => {
                                        return (
                                            <>
                                                <Vote key={vote.name} name={vote.name}/>
                                            </>
                                        )}
                                    )
                            }
                        </div>
                    )}
                )}
            </div>


            {/*Button Part*/}
            <button onClick={() => setLockedIn(!lockedIn)} className={'lock-btn'}>
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
                                .map((joiner, index) => {
                                    return (
                                        <>
                                            <Joiner key={index} name={joiner}/>
                                        </>
                                    )}
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
                    <SummaryItem label="Number of votes" value={votes.length} />
                    <SummaryItem label="Mean" value={calcMeanVote() + "pts"} />
                    <SummaryItem label="Mode" value={calcModeVote().join("pts ") + "pts"} />
                </div>
            }
        </>
    )
}

export default EstimatePage;
