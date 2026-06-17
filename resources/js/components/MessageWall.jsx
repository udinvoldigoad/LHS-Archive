import { useEffect, useState } from 'react';
import { Send } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';
import EmptyArchiveState from './EmptyArchiveState.jsx';

export default function MessageWall({ initialMessages, onSubmitMessage }) {
    const [notes, setNotes] = useState(initialMessages);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle');

    useEffect(() => {
        setNotes(initialMessages);
    }, [initialMessages]);

    async function handleSubmit(event) {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedMessage = message.trim();

        if (!trimmedName || !trimmedMessage) {
            return;
        }

        setStatus('saving');

        try {
            const savedMessage = onSubmitMessage
                ? await onSubmitMessage({ name: trimmedName, message: trimmedMessage })
                : { name: trimmedName, message: trimmedMessage };

            if (savedMessage.is_visible || savedMessage.isVisible) {
                setNotes((currentNotes) => [
                    {
                        ...savedMessage,
                        name: savedMessage.name ?? trimmedName,
                        message: savedMessage.message ?? trimmedMessage,
                        rotation: savedMessage.rotation ?? (currentNotes.length % 2 === 0 ? '1deg' : '-1deg'),
                    },
                    ...currentNotes,
                ]);
            }

            setName('');
            setMessage('');
            setStatus(savedMessage.is_visible || savedMessage.isVisible ? 'saved' : 'moderating');
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
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Nama arsiparis dadakan"
                    />
                    <label htmlFor="guest-message">Pesan</label>
                    <textarea
                        id="guest-message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Tinggalkan jejak sebelum lupa password kehidupan."
                        rows="5"
                    />
                    <button className="archive-button archive-button-primary" type="submit">
                        <Send size={16} aria-hidden="true" />
                        {status === 'saving' ? 'Mengirim...' : 'Kirim Pesan'}
                    </button>
                    {status === 'moderating' ? (
                        <p className="form-status-success">Pesan masuk. Tunggu admin approve dulu sebelum muncul.</p>
                    ) : null}
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
                        Pesan baru akan muncul setelah admin approve. Dramanya tertib dulu.
                    </EmptyArchiveState>
                )}
            </div>
        </section>
    );
}
