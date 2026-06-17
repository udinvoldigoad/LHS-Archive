import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function MusicToggle({ music }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    useEffect(() => {
        if (!audioRef.current || !music.url) {
            return;
        }

        audioRef.current.volume = 0.2;
        audioRef.current.muted = true;
        audioRef.current.play().then(() => {
            setIsPlaying(true);
        }).catch(() => {
            setIsPlaying(false);
        });
    }, [music.url]);

    async function toggleMusic() {
        if (!audioRef.current) {
            setIsPlaying((current) => !current);
            setIsMuted((current) => !current);
            return;
        }

        if (!isPlaying) {
            await audioRef.current.play();
            setIsPlaying(true);
            setIsMuted(false);
            audioRef.current.muted = false;
            return;
        }

        const nextMuted = !isMuted;
        audioRef.current.muted = nextMuted;
        setIsMuted(nextMuted);
    }

    return (
        <div className="music-control">
            {music.url ? <audio ref={audioRef} src={music.url} loop preload="none" /> : null}
            <button type="button" onClick={toggleMusic} title="Toggle memory music">
                {isPlaying && !isMuted ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
                <span>{isPlaying && !isMuted ? 'Mute' : music.title}</span>
            </button>
        </div>
    );
}
