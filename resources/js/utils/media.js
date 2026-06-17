export function formatMediaName(url) {
    if (!url) {
        return '';
    }

    const cleanUrl = url.split('?')[0].split('#')[0];
    const fileName = cleanUrl.split('/').filter(Boolean).pop();

    if (!fileName) {
        return 'Current file ready';
    }

    try {
        return decodeURIComponent(fileName);
    } catch {
        return fileName;
    }
}
