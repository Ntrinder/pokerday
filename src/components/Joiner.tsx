import { Tooltip } from "react-tooltip";

interface JoinerProps {
  name: string,
  voted: boolean,
}

function Joiner({name, voted}: JoinerProps) {
  const firstLetter = name.charAt(0).toUpperCase();
  const tooltipId = `tooltip-${name}`;

  return (
    <>
      <div className={`joiner ${voted ? 'voted' : ''}`} data-tooltip-id={tooltipId}>{firstLetter}</div>
      <Tooltip id={tooltipId} place="top" content={name}/>
    </>
  );
}

export default Joiner;
