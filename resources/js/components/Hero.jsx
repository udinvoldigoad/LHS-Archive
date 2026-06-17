import { Link, Images } from 'lucide-react';

function InstagramIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect width="16" height="16" x="4" y="4" rx="4" />
            <circle cx="12" cy="12" r="3.2" />
            <circle cx="17" cy="7" r="0.7" fill="currentColor" stroke="none" />
        </svg>
    );
}

export default function Hero({ settings, photos }) {
    return (
        <section className="hero-section" id="archive">
            <div className="hero-polaroids" aria-hidden="true">
                {photos.map((photo, index) => (
                    <div className={`hero-polaroid hero-polaroid-${index + 1}`} key={photo.src}>
                        <img src={photo.src} alt="" />
                    </div>
                ))}
            </div>
            <div className="hero-content">
                <p className="archive-kicker">Sumber dari segala sumber</p>
                <h1>{settings.title}</h1>
                <p>{settings.tagline}</p>
                <div className="hero-actions">
                    <a className="archive-button archive-button-primary" href="#links">
                        <Link size={16} aria-hidden="true" />
                        Buka Archive
                    </a>
                    <a className="archive-button archive-button-secondary" href="#gallery">
                        <Images size={16} aria-hidden="true" />
                        Lihat Kenangan
                    </a>
                    <a
                        className="archive-button archive-button-purple"
                        href="https://www.instagram.com/lhs_official99"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <InstagramIcon width={16} height={16} aria-hidden="true" />
                        Instagram
                    </a>
                </div>
            </div>
        </section>
    );
}
