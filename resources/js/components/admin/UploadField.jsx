import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { uploadAdminMedia } from '../../services/api.js';
import { formatMediaName } from '../../utils/media.js';

export default function UploadField({ accept, currentUrl = '', kind, label, onClear, onUploaded, token }) {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const inputRef = useRef(null);

    async function uploadFile(event) {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            return;
        }

        setStatus('uploading');
        setError('');

        try {
            const media = await uploadAdminMedia(token, file, kind);
            onUploaded?.(media.url);
            setStatus('uploaded');
        } catch (uploadError) {
            setError(resolveUploadError(uploadError));
            setStatus('idle');
        }
    }

    return (
        <div className="admin-upload-inline">
            <div className="admin-upload-current">
                <span>{currentUrl ? formatMediaName(currentUrl) : 'No file uploaded yet.'}</span>
                {currentUrl ? (
                    <a href={currentUrl} target="_blank" rel="noreferrer">
                        Preview
                    </a>
                ) : null}
                {currentUrl && onClear ? (
                    <button
                        className="admin-upload-clear"
                        type="button"
                        onClick={() => {
                            setStatus('idle');
                            onClear();
                        }}
                    >
                        Clear
                    </button>
                ) : null}
            </div>
            <button
                className="admin-upload-trigger"
                type="button"
                disabled={status === 'uploading'}
                onClick={() => inputRef.current?.click()}
            >
                <Upload size={17} aria-hidden="true" />
                {status === 'uploading' ? 'Uploading...' : label}
            </button>
            <input
                accept={accept}
                disabled={status === 'uploading'}
                ref={inputRef}
                type="file"
                onChange={uploadFile}
            />
            {status === 'uploaded' ? <span>Uploaded. URL field updated.</span> : null}
            {error ? <p className="admin-form-error">{error}</p> : null}
        </div>
    );
}

function resolveUploadError(error) {
    if (error.payload?.errors) {
        return Object.values(error.payload.errors).flat().join(' ');
    }

    return error.message || 'Upload failed. Cek file dan koneksi API.';
}
