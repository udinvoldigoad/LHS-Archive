import SectionHeader from './SectionHeader.jsx';
import MemberCard from './MemberCard.jsx';

export default function MemberArchive({ members, onOpenMember }) {
    return (
        <section className="archive-section member-section" id="members" aria-labelledby="members-title">
            <SectionHeader eyebrow="12 archived members" title="Member Archive">
                Kumpulan Manusia Gila.
            </SectionHeader>
            <div className="member-grid">
                {members.map((member, index) => (
                    <MemberCard key={member.name} member={member} index={index} onOpen={() => onOpenMember(member)} />
                ))}
            </div>
        </section>
    );
}
