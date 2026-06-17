import SectionHeader from './SectionHeader.jsx';
import LinkCard from './LinkCard.jsx';
import EmptyArchiveState from './EmptyArchiveState.jsx';

export default function ArchiveLinks({ links }) {
    return (
        <section className="archive-section" id="links" aria-labelledby="archive-links-title">
            <SectionHeader title="Archive Links" />
            {links.length ? (
                <div className="link-grid">
                    {links.map((link) => (
                        <LinkCard key={link.id ?? link.title} link={link} />
                    ))}
                </div>
            ) : (
                <EmptyArchiveState title="Belum ada link archive">
                    Admin belum menaruh sumber apa pun di sini. Arsipnya sedang pura-pura rapi.
                </EmptyArchiveState>
            )}
        </section>
    );
}
