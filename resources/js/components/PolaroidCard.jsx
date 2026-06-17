export default function PolaroidCard({ moment, onOpen }) {
    return (
        <button
            className="polaroid-card"
            style={{ '--tilt': moment.rotation }}
            type="button"
            onClick={onOpen}
        >
            <span className="polaroid-image">
                <img src={moment.imageUrl} alt={moment.title} />
            </span>
            <span className="polaroid-caption">{moment.caption}</span>
        </button>
    );
}
