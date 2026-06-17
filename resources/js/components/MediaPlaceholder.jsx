import { ImageIcon, UserRound, Video } from 'lucide-react';

const placeholderContent = {
    image: {
        icon: ImageIcon,
        label: 'Belum ada foto',
        hint: 'Memori masih nunggu diupload.',
    },
    thumbnail: {
        icon: ImageIcon,
        label: 'Belum ada thumbnail',
        hint: 'Link-nya ada, sampulnya belum.',
    },
    member: {
        icon: UserRound,
        label: 'Foto member kosong',
        hint: 'Manusianya ada, fotonya menyusul.',
    },
    video: {
        icon: Video,
        label: 'Video belum punya sampul',
        hint: 'Best moment masih nunggu bukti visual.',
    },
};

export default function MediaPlaceholder({ hint, label, type = 'image' }) {
    const content = placeholderContent[type] ?? placeholderContent.image;
    const Icon = content.icon;

    return (
        <span className={`archive-media-placeholder archive-media-placeholder-${type}`}>
            <Icon size={28} aria-hidden="true" />
            <span>{label ?? content.label}</span>
            <small>{hint ?? content.hint}</small>
        </span>
    );
}
