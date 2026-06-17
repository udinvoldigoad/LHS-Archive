import SectionHeader from './SectionHeader.jsx';
import MemberCard from './MemberCard.jsx';

export default function MemberArchive({ members, onOpenMember }) {
    return (
        <section className="archive-section member-section" id="humans" aria-labelledby="members-title">
            <SectionHeader eyebrow="12 archived humans" title="Member Archive">
                Profil digital manusia-manusia yang terlalu penting untuk dibiarkan cuma lewat story.
            </SectionHeader>
            <div className="member-grid">
                {members.map((member, index) => (
                    <MemberCard key={member.name} member={member} index={index} onOpen={() => onOpenMember(member)} />
                ))}
            </div>
        </section>
    );
}
