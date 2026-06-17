import { ExternalLink } from 'lucide-react';
import MediaPlaceholder from './MediaPlaceholder.jsx';

export default function LinkCard({ link }) {
    return (
        <article className="link-card" style={{ '--tilt': link.rotation }}>
            <div className="link-card-media">
                {link.thumbnailUrl ? (
                    <img src={link.thumbnailUrl} alt="" loading="lazy" decoding="async" />
                ) : (
                    <MediaPlaceholder type="thumbnail" />
                )}
                <span className="link-card-media-tag">{link.category}</span>
            </div>
            <p className="card-category">{link.category}</p>
            <h3>{link.title}</h3>
            <p>{link.description}</p>
            <a className="mini-action" href={link.url} target="_blank" rel="noreferrer">
                {link.buttonLabel}
                <ExternalLink size={13} aria-hidden="true" />
            </a>
        </article>
    );
}
