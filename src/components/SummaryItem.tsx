interface SummaryItemProps {
    label: string;
    value: number | string;
}

function SummaryItem({ label, value }: SummaryItemProps)
{
    return (
        <div className="summary-item">
            <span className="summary-label"> {label}:</span>
            <span className="summary-value"> {value}</span>
        </div>
    )
}


export default SummaryItem;