
interface CardProps {
    cardFaceValue: number,
    clickCallback: (num: number) => void,
    selectedNumber: number,
    lockedIn: boolean,
}

function Card({ cardFaceValue, selectedNumber, clickCallback, lockedIn }: CardProps) {
    const noSelection = selectedNumber === -1;
    const imSelected = selectedNumber === cardFaceValue;
    const imLockedIn = imSelected && lockedIn;

    return (
        <div
            onClick={() => clickCallback(cardFaceValue)}
            className={`card ${imLockedIn ? 'card-locked' : noSelection ? '' : imSelected ? 'card-selected' : 'card-unselected'}`}
        >
            {cardFaceValue}
        </div>
    );
}

export default Card;