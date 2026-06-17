import SectionHeader from './SectionHeader.jsx';
import PolaroidCard from './PolaroidCard.jsx';
import EmptyArchiveState from './EmptyArchiveState.jsx';

export default function ScrapbookMoments({ moments, onOpenPhoto }) {
    return (
        <section className="archive-section scrapbook-section" id="gallery" aria-labelledby="moments-title">
            <SectionHeader title="Scrapbook Moments" />
            {moments.length ? (
                <div className="polaroid-row">
                    {moments.map((moment) => (
                        <PolaroidCard key={moment.id ?? moment.title} moment={moment} onOpen={() => onOpenPhoto(moment)} />
                    ))}
                </div>
            ) : (
                <EmptyArchiveState title="Belum ada polaroid">
                    Moment-nya belum dikurasi. Nanti bagian ini akan penuh bukti kejadian.
                </EmptyArchiveState>
            )}
        </section>
    );
}
