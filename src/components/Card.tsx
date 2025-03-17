interface CardProps {
  cardFaceValue: number,
  clickCallback: (num: number) => void,
  selectedNumber: number,
  lockedIn: boolean,
}

function Card({cardFaceValue, selectedNumber, clickCallback, lockedIn}: CardProps) {
  const noSelection = selectedNumber === -1;
  const imSelected = selectedNumber === cardFaceValue;

  const resolveCardClass = () => {
    if (!lockedIn && noSelection) {
      return 'card';
    }

    if (!lockedIn && imSelected) {
      return 'card card-selected';
    }

    if (lockedIn && !imSelected) {
      return 'card card-locked';
    }

    if (lockedIn && imSelected) {
      return 'card card-locked card-locked-selected';
    }

    return 'card';
  }

  return (
    <div
      onClick={() => clickCallback(cardFaceValue)}
      className={resolveCardClass()}
    >
      {cardFaceValue}
    </div>
  );
}

export default Card;
