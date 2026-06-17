const adminTokenKey = 'lhs-admin-token';

export function readAdminToken() {
    try {
        return window.sessionStorage.getItem(adminTokenKey) || '';
    } catch {
        return '';
    }
}

export function storeAdminToken(token) {
    try {
        window.sessionStorage.setItem(adminTokenKey, token);
    } catch {
        // The token can still live in React state when storage is blocked.
    }
}

export function clearAdminToken() {
    try {
        window.sessionStorage.removeItem(adminTokenKey);
    } catch {
        // Ignore storage access failures.
    }
}

async function request(path, options = {}) {
    const isFormData = typeof FormData !== 'undefined' && options.data instanceof FormData;
    const headers = {
        Accept: 'application/json',
        ...(options.data && !isFormData ? { 'Content-Type': 'application/json' } : {}),
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(path, {
        method: options.method ?? 'GET',
        headers,
        body: options.data ? (isFormData ? options.data : JSON.stringify(options.data)) : undefined,
    });

    const contentType = response.headers.get('content-type') ?? '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
        const message = typeof payload === 'object' && payload?.message ? payload.message : 'Request failed';
        const error = new Error(message);
        error.status = response.status;
        error.payload = payload;
        throw error;
    }

    return payload;
}

export function fetchArchive() {
    return request('/api/archive');
}

export function postPublicMessage(data) {
    return request('/api/messages', {
        method: 'POST',
        data,
    });
}

export function loginAdmin(password) {
    return request('/api/admin/login', {
        method: 'POST',
        data: { password },
    });
}

export function logoutAdmin(token) {
    if (!token) {
        return Promise.resolve({ message: 'Logged out' });
    }

    return request('/api/admin/logout', {
        method: 'POST',
        token,
    });
}

export function fetchAdminDashboard(token) {
    return request('/api/admin/dashboard', { token });
}

export function updateAdminSettings(token, data) {
    return request('/api/admin/settings', {
        method: 'PUT',
        token,
        data,
    });
}

export function uploadAdminMedia(token, file, kind, onProgress, options = {}) {
    const data = new FormData();
    data.append('kind', kind);
    data.append('file', file);

    if (options.variant) {
        data.append('variant', options.variant);
    }

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open('POST', '/api/admin/uploads');
        xhr.setRequestHeader('Accept', 'application/json');

        if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        xhr.upload.addEventListener('progress', (event) => {
            if (!event.lengthComputable) {
                return;
            }

            onProgress?.(Math.round((event.loaded / event.total) * 100));
        });

        xhr.addEventListener('load', () => {
            const contentType = xhr.getResponseHeader('content-type') ?? '';
            let payload = xhr.responseText;

            if (contentType.includes('application/json')) {
                try {
                    payload = JSON.parse(xhr.responseText || '{}');
                } catch {
                    payload = {};
                }
            }

            if (xhr.status < 200 || xhr.status >= 300) {
                const message = typeof payload === 'object' && payload?.message ? payload.message : 'Request failed';
                const error = new Error(message);
                error.status = xhr.status;
                error.payload = payload;
                reject(error);
                return;
            }

            resolve(payload);
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Upload failed. Cek koneksi API.'));
        });

        xhr.send(data);
    });
}

export function createAdminLink(token, data) {
    return request('/api/admin/links', {
        method: 'POST',
        token,
        data,
    });
}

export function updateAdminLink(token, id, data) {
    return request(`/api/admin/links/${id}`, {
        method: 'PUT',
        token,
        data,
    });
}

export function deleteAdminLink(token, id) {
    return request(`/api/admin/links/${id}`, {
        method: 'DELETE',
        token,
    });
}

export function createAdminMoment(token, data) {
    return request('/api/admin/moments', {
        method: 'POST',
        token,
        data,
    });
}

export function updateAdminMoment(token, id, data) {
    return request(`/api/admin/moments/${id}`, {
        method: 'PUT',
        token,
        data,
    });
}

export function deleteAdminMoment(token, id) {
    return request(`/api/admin/moments/${id}`, {
        method: 'DELETE',
        token,
    });
}

export function createAdminPhoto(token, data) {
    return request('/api/admin/photos', {
        method: 'POST',
        token,
        data,
    });
}

export function updateAdminPhoto(token, id, data) {
    return request(`/api/admin/photos/${id}`, {
        method: 'PUT',
        token,
        data,
    });
}

export function deleteAdminPhoto(token, id) {
    return request(`/api/admin/photos/${id}`, {
        method: 'DELETE',
        token,
    });
}

export function createAdminMember(token, data) {
    return request('/api/admin/members', {
        method: 'POST',
        token,
        data,
    });
}

export function updateAdminMember(token, id, data) {
    return request(`/api/admin/members/${id}`, {
        method: 'PUT',
        token,
        data,
    });
}

export function deleteAdminMember(token, id) {
    return request(`/api/admin/members/${id}`, {
        method: 'DELETE',
        token,
    });
}

export function deleteAdminMessage(token, id) {
    return request(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        token,
    });
}
