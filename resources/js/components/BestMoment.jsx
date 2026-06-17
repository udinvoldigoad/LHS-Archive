import { useState } from 'react';
import { Play } from 'lucide-react';
import MediaPlaceholder from './MediaPlaceholder.jsx';
import SectionHeader from './SectionHeader.jsx';

export default function BestMoment({ moment }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const hasVideo = Boolean(moment.videoUrl);

    return (
        <section className="archive-section best-moment-section" id="video" aria-label="Best Moment">
            <SectionHeader title="Best Moment" />
            <article className="best-moment-frame">
                {isPlaying && hasVideo ? (
                    <video
                        className="best-moment-video"
                        src={moment.videoUrl}
                        controls
                        autoPlay
                        playsInline
                        poster={moment.thumbnailUrl || undefined}
                        title={moment.title}
                    />
                ) : moment.thumbnailUrl ? (
                    <img className="best-moment-cover" src={moment.thumbnailUrl} alt={moment.title} />
                ) : hasVideo ? (
                    <video
                        className="best-moment-video best-moment-preview-video"
                        src={moment.videoUrl}
                        muted
                        playsInline
                        preload="metadata"
                        title={`${moment.title} preview`}
                    />
                ) : (
                    <MediaPlaceholder type="video" />
                )}
                {!isPlaying ? <div className="best-moment-vignette" aria-hidden="true" /> : null}
                {hasVideo && !isPlaying ? (
                    <button className="play-button" type="button" title="Play best moment" onClick={() => setIsPlaying(true)}>
                        <Play size={28} fill="currentColor" aria-hidden="true" />
                    </button>
                ) : !hasVideo ? (
                    <button className="play-button" type="button" title="Best moment video belum tersedia" disabled>
                        <Play size={28} fill="currentColor" aria-hidden="true" />
                    </button>
                ) : null}
                {!isPlaying ? (
                    <div className="best-moment-caption">
                        <p>{moment.label}</p>
                        <h3 id="best-moment-title">{moment.title}</h3>
                        <span>{moment.description}</span>
                    </div>
                ) : null}
            </article>
        </section>
    );
}
