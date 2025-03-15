import {Tooltip} from "react-tooltip";

interface JoinerProps {
    name: string,
}

function Joiner({name}: JoinerProps) {
    const firstLetter = name.charAt(0).toUpperCase();
    const tooltipId = `tooltip-${name}`;

    return (
        <>
            <div className='joiner' data-tooltip-id={tooltipId}>{firstLetter}</div>
            <Tooltip id={tooltipId} place="top" content={name} />
        </>
    );
}

export default Joiner;