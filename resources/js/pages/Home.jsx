import { useEffect, useState } from 'react';
import {
    archiveLinks,
    bestMoment,
    heroPhotos,
    members,
    messages,
    moments,
    siteSettings,
} from '../data/archiveData.js';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import BestMoment from '../components/BestMoment.jsx';
import ArchiveLinks from '../components/ArchiveLinks.jsx';
import ScrapbookMoments from '../components/ScrapbookMoments.jsx';
import MemberArchive from '../components/MemberArchive.jsx';
import MessageWall from '../components/MessageWall.jsx';
import MusicToggle from '../components/MusicToggle.jsx';
import Footer from '../components/Footer.jsx';
import Modal from '../components/Modal.jsx';
import {
    cleanHomeHash,
    clearRememberedSectionTarget,
    getRememberedSectionTarget,
    getSectionIdFromHash,
    scrollToSection,
} from '../utils/sectionNavigation.js';

export default function Home() {
    const [activePhoto, setActivePhoto] = useState(null);
    const [activeMember, setActiveMember] = useState(null);

    useEffect(() => {
        function scrollToTop() {
            cleanHomeHash();
            window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }

        function scrollToTarget(id, behavior = 'smooth') {
            cleanHomeHash();

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    scrollToSection(id, behavior);
                    clearRememberedSectionTarget();
                });
            });
        }

        function handleHashChange() {
            const id = getSectionIdFromHash();

            if (!id) {
                return;
            }

            scrollToTarget(id);
        }

        const rememberedTarget = getRememberedSectionTarget();

        if (rememberedTarget) {
            scrollToTarget(rememberedTarget, 'auto');
        } else {
            requestAnimationFrame(() => requestAnimationFrame(scrollToTop));
        }

        window.addEventListener('hashchange', handleHashChange);

        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
        <div className="site-shell">
            <Navbar title={siteSettings.title} />
            <main>
                <Hero settings={siteSettings} photos={heroPhotos} />
                <BestMoment moment={bestMoment} />
                <ArchiveLinks links={archiveLinks} />
                <ScrapbookMoments moments={moments} onOpenPhoto={setActivePhoto} />
                <MemberArchive members={members} onOpenMember={setActiveMember} />
                <MessageWall initialMessages={messages} />
            </main>
            <Footer />
            <MusicToggle music={siteSettings.music} />

            <Modal open={Boolean(activePhoto)} onClose={() => setActivePhoto(null)} labelledBy="photo-modal-title">
                {activePhoto ? (
                    <div className="photo-modal">
                        <img src={activePhoto.imageUrl} alt={activePhoto.title} />
                        <div>
                            <p className="archive-kicker">Polaroid Memory</p>
                            <h2 id="photo-modal-title">{activePhoto.title}</h2>
                            <p>{activePhoto.caption}</p>
                        </div>
                    </div>
                ) : null}
            </Modal>

            <Modal open={Boolean(activeMember)} onClose={() => setActiveMember(null)} labelledBy="member-modal-title">
                {activeMember ? (
                    <div className="member-modal">
                        <img src={activeMember.photoUrl} alt={activeMember.name} />
                        <div>
                            <p className="archive-kicker">Archived Human</p>
                            <h2 id="member-modal-title">{activeMember.name}</h2>
                            <p className="member-modal-role">{activeMember.role}</p>
                            <blockquote>{activeMember.quote}</blockquote>
                            <p>{activeMember.funFact}</p>
                            <a href={activeMember.instagramUrl} target="_blank" rel="noreferrer">
                                Instagram Placeholder
                            </a>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
}
