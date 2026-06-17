import SectionHeader from './SectionHeader.jsx';
import MemberCard from './MemberCard.jsx';
import EmptyArchiveState from './EmptyArchiveState.jsx';

export default function MemberArchive({ members, onOpenMember }) {
    return (
        <section className="archive-section member-section" id="members" aria-labelledby="members-title">
            <SectionHeader eyebrow={`${members.length} archived members`} title="Member Archive">
                Kumpulan Manusia Gila.
            </SectionHeader>
            {members.length ? (
                <div className="member-grid">
                    {members.map((member, index) => (
                        <MemberCard key={member.id ?? member.name} member={member} index={index} onOpen={() => onOpenMember(member)} />
                    ))}
                </div>
            ) : (
                <EmptyArchiveState title="Belum ada member">
                    Belum ada manusia yang masuk katalog. Sedikit menyeramkan, tapi valid.
                </EmptyArchiveState>
            )}
        </section>
    );
}
