import { useEffect, useState } from 'react';
import {
    cleanHomeHash,
    getCurrentSectionId,
    getSectionIdFromHash,
    rememberSectionTarget,
    scrollToSection,
} from '../utils/sectionNavigation.js';

export default function Navbar({ title }) {
    const [activeId, setActiveId] = useState('archive');

    const navItems = [
        { id: 'archive', label: 'Home', href: '/#archive' },
        { id: 'video', label: 'Video', href: '/#video' },
        { id: 'links', label: 'Archive', href: '/#links' },
        { id: 'gallery', label: 'Gallery', href: '/#gallery' },
        { id: 'humans', label: 'Humans', href: '/#humans' },
        { id: 'messages', label: 'Messages', href: '/#messages' },
    ];

    useEffect(() => {
        if (window.location.pathname.startsWith('/admin')) {
            setActiveId('admin');
            return undefined;
        }

        let frame = 0;

        function updateActiveSection() {
            window.cancelAnimationFrame(frame);
            frame = window.requestAnimationFrame(() => {
                setActiveId(getCurrentSectionId());
            });
        }

        function updateFromHash() {
            const hashId = getSectionIdFromHash();

            if (hashId) {
                setActiveId(hashId);
                return;
            }

            updateActiveSection();
        }

        const initialHashId = getSectionIdFromHash();

        if (initialHashId) {
            setActiveId(initialHashId);
        } else {
            updateActiveSection();
        }

        window.addEventListener('hashchange', updateFromHash);
        window.addEventListener('resize', updateActiveSection);
        window.addEventListener('scroll', updateActiveSection, { passive: true });

        return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener('hashchange', updateFromHash);
            window.removeEventListener('resize', updateActiveSection);
            window.removeEventListener('scroll', updateActiveSection);
        };
    }, []);

    function handleSectionClick(event, item) {
        if (window.location.pathname !== '/') {
            rememberSectionTarget(item.id);
            return;
        }

        event.preventDefault();
        cleanHomeHash();
        setActiveId(item.id);
        scrollToSection(item.id);
    }

    function handleBrandClick(event) {
        handleSectionClick(event, navItems[0]);
    }

    return (
        <header className="site-nav">
            <a
                className={activeId === 'archive' ? 'nav-brand is-active' : 'nav-brand'}
                href="/#archive"
                onClick={handleBrandClick}
            >
                {title}
            </a>
            <nav className="nav-links" aria-label="Main navigation">
                {navItems.map((item) => (
                    <a
                        aria-current={activeId === item.id ? 'page' : undefined}
                        className={activeId === item.id ? 'is-active' : undefined}
                        href={item.href}
                        key={item.href}
                        onClick={(event) => handleSectionClick(event, item)}
                    >
                        {item.label}
                    </a>
                ))}
            </nav>
            <a
                aria-current={activeId === 'admin' ? 'page' : undefined}
                className={activeId === 'admin' ? 'admin-link is-active' : 'admin-link'}
                href="/admin"
                title="Prepared for later admin password gate"
            >
                Admin Login
            </a>
        </header>
    );
}
