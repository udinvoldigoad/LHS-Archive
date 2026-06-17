import { cleanHomeHash, rememberSectionTarget, scrollToSection } from '../utils/sectionNavigation.js';

export default function Footer() {
    function handleSectionClick(event, id) {
        if (window.location.pathname !== '/') {
            rememberSectionTarget(id);
            return;
        }

        event.preventDefault();
        cleanHomeHash();
        scrollToSection(id);
    }

    return (
        <footer className="site-footer">
            <p>Copyright LHS Archive / Absurdly Serious Nostalgia</p>
            <nav aria-label="Footer links">
                <a href="/#messages" onClick={(event) => handleSectionClick(event, 'messages')}>
                    Contact
                </a>
                <a href="/#archive" onClick={(event) => handleSectionClick(event, 'archive')}>
                    Source
                </a>
                <a href="/admin">Admin</a>
            </nav>
        </footer>
    );
}
