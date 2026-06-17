import { useRef, useState } from 'react';
import { Clapperboard, ImageIcon, Music2, Upload } from 'lucide-react';
import { uploadAdminMedia } from '../../services/api.js';
import { formatMediaName } from '../../utils/media.js';

const mediaLimits = {
    image: {
        acceptLabel: 'JPG, PNG, WebP, GIF',
        maxBytes: 10 * 1024 * 1024,
        previewLabel: 'Image preview',
    },
    video: {
        acceptLabel: 'MP4, WebM, MOV',
        maxBytes: 100 * 1024 * 1024,
        previewLabel: 'Video preview',
    },
    audio: {
        acceptLabel: 'MP3, WAV, OGG, M4A',
        maxBytes: 20 * 1024 * 1024,
        previewLabel: 'Audio preview',
    },
};

export default function UploadField({ accept, currentUrl = '', kind, label, onClear, onUploaded, token }) {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const [progress, setProgress] = useState(0);
    const [lastFile, setLastFile] = useState(null);
    const inputRef = useRef(null);
    const limit = mediaLimits[kind] ?? mediaLimits.image;

    async function uploadFile(event) {
        const file = event.target.files?.[0];
        event.target.value = '';

        if (!file) {
            return;
        }

        setLastFile({
            name: file.name,
            size: file.size,
        });
        setProgress(0);
        setError('');

        if (file.size > limit.maxBytes) {
            setStatus('idle');
            setError(`File terlalu besar. Maksimal ${formatBytes(limit.maxBytes)} untuk ${kind}.`);
            return;
        }

        setStatus('uploading');

        try {
            const media = await uploadAdminMedia(token, file, kind, setProgress);
            onUploaded?.(media.url);
            setStatus('uploaded');
            setProgress(100);
        } catch (uploadError) {
            setError(resolveUploadError(uploadError));
            setStatus('idle');
            setProgress(0);
        }
    }

    return (
        <div className="admin-upload-inline">
            <MediaPreview currentUrl={currentUrl} kind={kind} />
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
                            setProgress(0);
                            setLastFile(null);
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
            <div className="admin-upload-help">
                <span>{limit.acceptLabel}</span>
                <span>Max {formatBytes(limit.maxBytes)}</span>
                {lastFile ? <span>{lastFile.name} / {formatBytes(lastFile.size)}</span> : null}
            </div>
            {status === 'uploading' ? (
                <div className="admin-upload-progress" aria-label="Upload progress" aria-valuemax="100" aria-valuemin="0" aria-valuenow={progress} role="progressbar">
                    <span style={{ width: `${progress}%` }} />
                    <strong>{progress}%</strong>
                </div>
            ) : null}
            <input
                accept={accept}
                disabled={status === 'uploading'}
                ref={inputRef}
                type="file"
                onChange={uploadFile}
            />
            {status === 'uploaded' ? <span>Uploaded. Preview updated.</span> : null}
            {error ? <p className="admin-form-error">{error}</p> : null}
        </div>
    );
}

function MediaPreview({ currentUrl, kind }) {
    if (currentUrl && kind === 'image') {
        return (
            <a className="admin-upload-preview" href={currentUrl} target="_blank" rel="noreferrer" title="Open image preview">
                <img src={currentUrl} alt="Uploaded media preview" />
            </a>
        );
    }

    if (currentUrl && kind === 'video') {
        return (
            <div className="admin-upload-preview">
                <video src={currentUrl} controls muted preload="metadata" title="Uploaded video preview" />
            </div>
        );
    }

    if (currentUrl && kind === 'audio') {
        return (
            <div className="admin-upload-preview admin-upload-preview-audio">
                <Music2 size={24} aria-hidden="true" />
                <audio src={currentUrl} controls preload="metadata" />
            </div>
        );
    }

    const Icon = kind === 'video' ? Clapperboard : kind === 'audio' ? Music2 : ImageIcon;
    const label = mediaLimits[kind]?.previewLabel ?? 'Media preview';

    return (
        <div className="admin-upload-preview admin-upload-preview-empty">
            <Icon size={24} aria-hidden="true" />
            <span>{label}</span>
            <small>Upload dulu, baru memorinya nongol.</small>
        </div>
    );
}

function resolveUploadError(error) {
    if (error.payload?.errors) {
        return Object.values(error.payload.errors).flat().join(' ');
    }

    return error.message || 'Upload failed. Cek file dan koneksi API.';
}

function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / 1024 ** exponent;

    return `${value >= 10 || exponent === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[exponent]}`;
}
