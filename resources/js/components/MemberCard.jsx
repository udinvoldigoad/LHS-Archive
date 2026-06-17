import { ExternalLink } from 'lucide-react';
import MediaPlaceholder from './MediaPlaceholder.jsx';

export default function MemberCard({ member, index, onOpen }) {
    const rotation = index % 3 === 0 ? '-1deg' : index % 3 === 1 ? '0.8deg' : '1.4deg';

    return (
        <article className="member-card" style={{ '--tilt': rotation }}>
            <button type="button" onClick={onOpen}>
                {member.photoUrl ? <img src={member.photoUrl} alt={member.name} /> : <MediaPlaceholder type="member" />}
                <span className="member-card-role">Archived Human</span>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <blockquote>{member.quote}</blockquote>
            </button>
            <a href={member.instagramUrl} target="_blank" rel="noreferrer" title={`${member.name} Instagram placeholder`}>
                <ExternalLink size={15} aria-hidden="true" />
                Instagram
            </a>
        </article>
    );
}
