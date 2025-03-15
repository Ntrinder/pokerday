import {Tooltip} from "react-tooltip";

interface VoteProps {
    name: string;
}

function Vote({name}: VoteProps)  {
    const firstLetter = name.charAt(0).toUpperCase();
    const tooltipId = `tooltip-${name}`;

    return (
        <div>
            <div className='vote' data-tooltip-id={tooltipId}>{firstLetter}</div>
            <Tooltip id={tooltipId} place="top" content={name} />
        </div>
    );
}

export default Vote;