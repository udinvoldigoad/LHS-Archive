import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';
import EmptyArchiveState from './EmptyArchiveState.jsx';

export default function MessageWall({ initialMessages, onSubmitMessage }) {
    const [notes, setNotes] = useState(initialMessages);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [website, setWebsite] = useState('');
    const [status, setStatus] = useState('idle');
    const [isMessageFocused, setIsMessageFocused] = useState(false);

    useEffect(() => {
        setNotes(initialMessages);
    }, [initialMessages]);

    async function handleSubmit(event) {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedMessage = message.trim();

        if (!trimmedName || !trimmedMessage || website) {
            return;
        }

        setStatus('saving');

        try {
            const savedMessage = onSubmitMessage
                ? await onSubmitMessage({ name: trimmedName, message: trimmedMessage, website })
                : { name: trimmedName, message: trimmedMessage };

            setNotes((currentNotes) => [
                {
                    ...savedMessage,
                    name: savedMessage.name ?? trimmedName,
                    message: savedMessage.message ?? trimmedMessage,
                    rotation: savedMessage.rotation ?? (currentNotes.length % 2 === 0 ? '1deg' : '-1deg'),
                },
                ...currentNotes,
            ]);

            setName('');
            setMessage('');
            setStatus('saved');
        } catch {
            setStatus('error');
        }
    }

    return (
        <section className="archive-section message-section" id="messages" aria-labelledby="messages-title">
            <SectionHeader eyebrow="Guest notes" title="Pesan Kenangan">
                Jejak kecil dari orang-orang yang pernah ikut bikin rame.
            </SectionHeader>
            <div className="message-layout">
                <form className="message-form" onSubmit={handleSubmit}>
                    <label htmlFor="guest-name">Nama</label>
                    <input
                        id="guest-name"
                        maxLength="80"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Nama arsiparis dadakan"
                    />
                    <label className="message-honeypot" htmlFor="guest-website">
                        Website
                        <input
                            id="guest-website"
                            name="website"
                            tabIndex="-1"
                            autoComplete="off"
                            value={website}
                            onChange={(event) => setWebsite(event.target.value)}
                        />
                    </label>
                    <label htmlFor="guest-message">Pesan</label>
                    <textarea
                        id="guest-message"
                        maxLength="500"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onBlur={() => setIsMessageFocused(false)}
                        onFocus={() => setIsMessageFocused(true)}
                        placeholder="Tinggalkan jejak sebelum lupa password kehidupan."
                        rows="5"
                    />
                    {(isMessageFocused || message.length > 0) ? (
                        <p className="message-typing-status" aria-live="polite">
                            <span aria-hidden="true" />
                            {message.length ? `Sedang mengetik ${message.length}/500` : 'Kursor pesan aktif'}
                        </p>
                    ) : null}
                    <button className="archive-button archive-button-primary" type="submit" disabled={status === 'saving'}>
                        <Send size={16} aria-hidden="true" />
                        {status === 'saving' ? 'Mengirim...' : 'Kirim Pesan'}
                    </button>
                    {status === 'saved' ? <p className="form-status-success">Pesan sudah tampil di wall.</p> : null}
                    {status === 'error' ? <p className="form-status-error">Pesan gagal dikirim. Coba lagi sebentar.</p> : null}
                </form>
                {notes.length ? (
                    <div className="message-wall">
                        {notes.map((note, index) => (
                            <article className="sticky-note" style={{ '--tilt': note.rotation }} key={`${note.id ?? note.name}-${index}`}>
                                <p>{note.message}</p>
                                <span>{note.name}</span>
                            </article>
                        ))}
                    </div>
                ) : (
                    <EmptyArchiveState title="Belum ada pesan tampil">
                        Pesan pertama yang dikirim akan langsung nongol di sini.
                    </EmptyArchiveState>
                )}
            </div>
        </section>
    );
}
