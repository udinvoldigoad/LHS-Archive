export const sectionIds = ['archive', 'video', 'links', 'gallery', 'members', 'messages'];
const sectionAliases = {
    humans: 'members',
};
const sectionTargetStorageKey = 'lhs-archive-section-target';

function normalizeSectionId(id) {
    return sectionAliases[id] ?? id;
}

export function getSectionIdFromHash(hash = window.location.hash) {
    const id = normalizeSectionId(hash.replace('#', ''));

    return sectionIds.includes(id) ? id : '';
}

export function cleanHomeHash() {
    if (!window.location.hash) {
        return;
    }

    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
}

export function rememberSectionTarget(id) {
    const normalizedId = normalizeSectionId(id);

    if (!sectionIds.includes(normalizedId)) {
        return;
    }

    try {
        window.sessionStorage.setItem(sectionTargetStorageKey, normalizedId);
    } catch {
        // Browsers can block sessionStorage in strict privacy modes.
    }
}

export function getRememberedSectionTarget() {
    try {
        const id = normalizeSectionId(window.sessionStorage.getItem(sectionTargetStorageKey) ?? '');

        return sectionIds.includes(id) ? id : '';
    } catch {
        return '';
    }
}

export function clearRememberedSectionTarget() {
    try {
        window.sessionStorage.removeItem(sectionTargetStorageKey);
    } catch {
        // Ignore storage access failures.
    }
}

export function getNavOffset() {
    return (document.querySelector('.site-nav')?.offsetHeight ?? 70) + 18;
}

export function scrollToSection(id, behavior = 'smooth') {
    const section = document.getElementById(normalizeSectionId(id));

    if (!section) {
        return false;
    }

    const top = Math.max(0, section.getBoundingClientRect().top + window.scrollY - getNavOffset());
    window.scrollTo({ top, behavior });

    return true;
}

export function getCurrentSectionId() {
    const readLine = getNavOffset() + Math.min(window.innerHeight * 0.18, 160);
    let nearestId = 'archive';
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const id of sectionIds) {
        const section = document.getElementById(id);

        if (!section) {
            continue;
        }

        const rect = section.getBoundingClientRect();

        if (rect.top <= readLine && rect.bottom > readLine) {
            return id;
        }

        const distance = Math.abs(rect.top - readLine);

        if (distance < nearestDistance) {
            nearestDistance = distance;
            nearestId = id;
        }
    }

    return nearestId;
}
