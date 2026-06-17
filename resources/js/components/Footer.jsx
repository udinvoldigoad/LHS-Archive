import { cleanHomeHash, rememberSectionTarget, scrollToSection } from '../utils/sectionNavigation.js';

export default function Footer() {
    const repositoryUrl = 'https://github.com/udinvoldigoad/LHS-Archive';

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
                <a href="https://www.instagram.com/lhs_official99" target="_blank" rel="noreferrer">
                    Contact
                </a>
                <a href={repositoryUrl} target="_blank" rel="noreferrer">
                    Source
                </a>
                <a href="/#archive" onClick={(event) => handleSectionClick(event, 'archive')}>
                    Back to Top
                </a>
            </nav>
        </footer>
    );
}
