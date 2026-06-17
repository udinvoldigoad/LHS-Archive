import { Play } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';

export default function BestMoment({ moment }) {
    return (
        <section className="archive-section best-moment-section" id="video" aria-labelledby="best-moment-title">
            <SectionHeader title="Best Moment" />
            <article className="best-moment-frame">
                <img src={moment.thumbnailUrl} alt={moment.title} />
                <div className="best-moment-vignette" aria-hidden="true" />
                <button className="play-button" type="button" title="Play best moment placeholder">
                    <Play size={28} fill="currentColor" aria-hidden="true" />
                </button>
                <div className="best-moment-caption">
                    <p>{moment.label}</p>
                    <h3 id="best-moment-title">{moment.title}</h3>
                    <span>{moment.description}</span>
                </div>
            </article>
        </section>
    );
}
