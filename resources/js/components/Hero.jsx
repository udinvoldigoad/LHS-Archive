import { Link, MessageCircle, Images } from 'lucide-react';

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
                    <a className="archive-button archive-button-purple" href="#messages">
                        <MessageCircle size={16} aria-hidden="true" />
                        Tulis Pesan
                    </a>
                </div>
            </div>
        </section>
    );
}
