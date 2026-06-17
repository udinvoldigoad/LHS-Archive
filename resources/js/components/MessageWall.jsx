import { useState } from 'react';
import { Send } from 'lucide-react';
import SectionHeader from './SectionHeader.jsx';

export default function MessageWall({ initialMessages }) {
    const [notes, setNotes] = useState(initialMessages);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    function handleSubmit(event) {
        event.preventDefault();

        const trimmedName = name.trim();
        const trimmedMessage = message.trim();

        if (!trimmedName || !trimmedMessage) {
            return;
        }

        setNotes([
            {
                name: trimmedName,
                message: trimmedMessage,
                rotation: notes.length % 2 === 0 ? '1deg' : '-1deg',
            },
            ...notes,
        ]);
        setName('');
        setMessage('');
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
                        Kirim Pesan
                    </button>
                </form>
                <div className="message-wall">
                    {notes.map((note, index) => (
                        <article className="sticky-note" style={{ '--tilt': note.rotation }} key={`${note.name}-${index}`}>
                            <p>{note.message}</p>
                            <span>{note.name}</span>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
