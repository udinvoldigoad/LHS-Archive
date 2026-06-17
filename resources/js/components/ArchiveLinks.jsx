import SectionHeader from './SectionHeader.jsx';
import LinkCard from './LinkCard.jsx';

export default function ArchiveLinks({ links }) {
    return (
        <section className="archive-section" id="links" aria-labelledby="archive-links-title">
            <SectionHeader title="Archive Links" />
            <div className="link-grid">
                {links.map((link) => (
                    <LinkCard key={link.title} link={link} />
                ))}
            </div>
        </section>
    );
}
