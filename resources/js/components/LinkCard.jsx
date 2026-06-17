import { ExternalLink } from 'lucide-react';

export default function LinkCard({ link }) {
    return (
        <article className="link-card" style={{ '--tilt': link.rotation }}>
            <div className="link-card-media">
                <img src={link.thumbnailUrl} alt="" />
                <span>{link.category}</span>
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
