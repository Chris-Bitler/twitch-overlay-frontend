export const OverlayPart = ({ event, num }) => {
    return <div className={`transition-${num+1}`}>
        <div className={`container`}>
            <div className="username">
                {event.username}
            </div>
            <div className="event">
                {event.text}
            </div>
        </div>
    </div>
}