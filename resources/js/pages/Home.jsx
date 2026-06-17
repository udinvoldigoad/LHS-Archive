import { useEffect, useState } from 'react';
import {
    archiveLinks as fallbackArchiveLinks,
    bestMoment as fallbackBestMoment,
    heroPhotos,
    members as fallbackMembers,
    messages as fallbackMessages,
    moments as fallbackMoments,
    siteSettings as fallbackSiteSettings,
} from '../data/archiveData.js';
import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import BestMoment from '../components/BestMoment.jsx';
import ArchiveLinks from '../components/ArchiveLinks.jsx';
import ScrapbookMoments from '../components/ScrapbookMoments.jsx';
import MemberArchive from '../components/MemberArchive.jsx';
import MediaPlaceholder from '../components/MediaPlaceholder.jsx';
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
import { fetchArchive, postPublicMessage } from '../services/api.js';

export default function Home() {
    const [activePhoto, setActivePhoto] = useState(null);
    const [activeMember, setActiveMember] = useState(null);
    const [archive, setArchive] = useState({
        settings: fallbackSiteSettings,
        bestMoment: fallbackBestMoment,
        links: fallbackArchiveLinks,
        moments: fallbackMoments,
        members: fallbackMembers,
        messages: fallbackMessages,
    });

    useEffect(() => {
        let isMounted = true;

        fetchArchive()
            .then((data) => {
                if (!isMounted) {
                    return;
                }

                setArchive((current) => ({
                    settings: data.settings ?? current.settings,
                    bestMoment: data.bestMoment ?? current.bestMoment,
                    links: Array.isArray(data.links) ? data.links : current.links,
                    moments: Array.isArray(data.moments) ? data.moments : current.moments,
                    members: Array.isArray(data.members) ? data.members : current.members,
                    messages: Array.isArray(data.messages) ? data.messages : current.messages,
                }));
            })
            .catch(() => {
                // Keep the static archive visible when the API is unavailable.
            });

        return () => {
            isMounted = false;
        };
    }, []);

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
            <Navbar title={archive.settings.title} />
            <main>
                <Hero settings={archive.settings} photos={heroPhotos} />
                <BestMoment moment={archive.bestMoment} />
                <ArchiveLinks links={archive.links} />
                <ScrapbookMoments moments={archive.moments} onOpenPhoto={setActivePhoto} />
                <MemberArchive members={archive.members} onOpenMember={setActiveMember} />
                <MessageWall initialMessages={archive.messages} onSubmitMessage={postPublicMessage} />
            </main>
            <Footer />
            <MusicToggle music={archive.settings.music} />

            <Modal open={Boolean(activePhoto)} onClose={() => setActivePhoto(null)} labelledBy="photo-modal-title">
                {activePhoto ? (
                    <div className="photo-modal">
                        {activePhoto.imageUrl ? (
                            <img src={activePhoto.imageUrl} alt={activePhoto.title} />
                        ) : (
                            <MediaPlaceholder type="image" />
                        )}
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
                        {activeMember.photoUrl ? (
                            <img src={activeMember.photoUrl} alt={activeMember.name} />
                        ) : (
                            <MediaPlaceholder type="member" />
                        )}
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
