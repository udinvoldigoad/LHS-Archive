import MediaPlaceholder from './MediaPlaceholder.jsx';

export default function PolaroidCard({ moment, onOpen }) {
    const imageUrl = moment.thumbnailUrl || moment.imageUrl;

    return (
        <button
            className="polaroid-card"
            style={{ '--tilt': moment.rotation }}
            type="button"
            onClick={onOpen}
        >
            <span className="polaroid-image">
                {imageUrl ? (
                    <img src={imageUrl} alt={moment.title} loading="lazy" decoding="async" />
                ) : (
                    <MediaPlaceholder type="image" />
                )}
            </span>
            <span className="polaroid-caption">{moment.caption}</span>
        </button>
    );
}
