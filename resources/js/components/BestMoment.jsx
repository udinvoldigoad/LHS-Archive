import { Play } from 'lucide-react';
import MediaPlaceholder from './MediaPlaceholder.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function BestMoment({ moment }) {
    return (
        <section className="archive-section best-moment-section" id="video" aria-labelledby="best-moment-title">
            <SectionHeader title="Best Moment" />
            <article className="best-moment-frame">
                {moment.thumbnailUrl ? (
                    <img src={moment.thumbnailUrl} alt={moment.title} />
                ) : (
                    <MediaPlaceholder type="video" />
                )}
                <div className="best-moment-vignette" aria-hidden="true" />
                {moment.videoUrl ? (
                    <a className="play-button" href={moment.videoUrl} target="_blank" rel="noreferrer" title="Play best moment">
                        <Play size={28} fill="currentColor" aria-hidden="true" />
                    </a>
                ) : (
                    <button className="play-button" type="button" title="Best moment video belum tersedia" disabled>
                        <Play size={28} fill="currentColor" aria-hidden="true" />
                    </button>
                )}
                <div className="best-moment-caption">
                    <p>{moment.label}</p>
                    <h3 id="best-moment-title">{moment.title}</h3>
                    <span>{moment.description}</span>
                </div>
            </article>
        </section>
    );
}
