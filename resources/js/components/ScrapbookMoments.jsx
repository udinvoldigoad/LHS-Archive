import SectionHeader from './SectionHeader.jsx';
import PolaroidCard from './PolaroidCard.jsx';

export default function ScrapbookMoments({ moments, onOpenPhoto }) {
    return (
        <section className="archive-section scrapbook-section" id="gallery" aria-labelledby="moments-title">
            <SectionHeader title="Scrapbook Moments" />
            <div className="polaroid-row">
                {moments.map((moment) => (
                    <PolaroidCard key={moment.title} moment={moment} onOpen={() => onOpenPhoto(moment)} />
                ))}
            </div>
        </section>
    );
}
