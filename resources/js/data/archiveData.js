import heroBackgroundUrl from '../../images/hero-background.jpg';

export const siteSettings = {
    title: 'LHS Archive',
    tagline: 'Tempat kecil buat nyimpen semua hal yang pernah rame bareng.',
    adminPasswordConcept: {
        route: '/admin',
        envKey: 'ADMIN_PASSWORD_HASH',
        status: 'Prepared for a later simple password gate',
    },
    music: {
        title: 'Play Memory',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    },
};

export const heroPhotos = [
    {
        src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
        alt: 'Friends sitting together in warm low light',
    },
    {
        src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
        alt: 'Nostalgic outdoor gathering at sunset',
    },
    {
        src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
        alt: 'Dark concert crowd with bright stage lights',
    },
    {
        src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80',
        alt: 'Friends gathering in a candid group moment',
    },
    {
        src: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=600&q=80',
        alt: 'Party table with warm nostalgic lights',
    },
    {
        src: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=600&q=80',
        alt: 'Friends jumping together in sunset silhouette',
    },
    {
        src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80&sat=-20',
        alt: 'Outdoor memory scene with people at sunset',
    },
    {
        src: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=600&q=80',
        alt: 'Karaoke piano and stage memory',
    },
    {
        src: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=600&q=80',
        alt: 'Friends around a table in casual conversation',
    },
    {
        src: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=600&q=80',
        alt: 'Night city moment with cinematic lights',
    },
];

export const bestMoment = {
    label: 'Featured',
    title: 'Malam Keakraban 2023',
    description: 'Satu video buat membuktikan kalau chaos juga bisa terlihat sinematik.',
    thumbnailUrl: heroBackgroundUrl,
    videoUrl: '',
};

export const archiveLinks = [
    {
        title: 'Google Drive Folder',
        description: 'Kumpulan foto aib dan video unfaded dari tahun ke tahun.',
        url: 'https://example.com/drive-folder',
        category: 'Dokumentasi',
        buttonLabel: 'Buka Folder',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
        rotation: '-1.2deg',
    },
    {
        title: 'Instagram Highlight',
        description: 'Jejak digital yang mungkin kalian mau hapus tapi ga bisa.',
        url: 'https://example.com/instagram-highlight',
        category: 'Sosmed',
        buttonLabel: 'Lihat Postingan',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        rotation: '0.8deg',
    },
    {
        title: 'Playlist Spotify',
        description: 'Lagu-lagu yang sering diputar waktu nongkrong sampai pagi.',
        url: 'https://example.com/playlist',
        category: 'Random',
        buttonLabel: 'Dengerin',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
        rotation: '-1.8deg',
    },
    {
        title: 'Project Iseng',
        description: 'Ide serius lima menit yang berubah jadi archive permanen.',
        url: 'https://example.com/project',
        category: 'Project',
        buttonLabel: 'Buka Project',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
        rotation: '1.4deg',
    },
    {
        title: 'Video Mentah',
        description: 'File mentah, audio pecah, nilai sejarah tetap tinggi.',
        url: 'https://example.com/video',
        category: 'Video',
        buttonLabel: 'Putar Arsip',
        thumbnailUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
        rotation: '-0.4deg',
    },
    {
        title: 'Catatan Basecamp',
        description: 'Dokumen random yang entah kenapa masih penting.',
        url: 'https://example.com/notes',
        category: 'Arsip Foto',
        buttonLabel: 'Lihat Catatan',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&w=800&q=80',
        rotation: '1deg',
    },
];

export const moments = [
    {
        title: 'Foto blur, memorinya jelas.',
        caption: 'Foto blur, memorinya jelas.',
        imageUrl: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=80',
        rotation: '-3deg',
    },
    {
        title: 'Formasi lengkap',
        caption: 'Formasi lengkap (tumben).',
        imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=80',
        rotation: '3deg',
    },
    {
        title: 'Karaoke sampai serak',
        caption: 'Karaoke sampai serak.',
        imageUrl: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=700&q=80',
        rotation: '-1deg',
    },
    {
        title: 'Hari biasa yang jadi arsip',
        caption: 'Hari biasa yang ternyata layak diarsipkan.',
        imageUrl: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=700&q=80',
        rotation: '2deg',
    },
    {
        title: 'Sebelum pura-pura sibuk',
        caption: 'Momen sebelum semuanya pura-pura sibuk.',
        imageUrl: 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=700&q=80',
        rotation: '-2deg',
    },
];

export const members = [
    {
        name: 'Ridho',
        quote: 'Hidup cuma sekali, tapi revisi bisa berkali-kali.',
        instagramUrl: 'https://example.com/ridho',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Aryo',
        quote: 'Kalau bisa dibuat ribet, kenapa harus selesai cepat?',
        instagramUrl: 'https://example.com/aryo',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Syehab',
        quote: 'Diam bukan berarti tidak tahu, bisa jadi sedang loading.',
        instagramUrl: 'https://example.com/syehab',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Nadia',
        quote: 'Masalah boleh banyak, stok ngakak jangan habis.',
        instagramUrl: 'https://example.com/nadia',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Farel',
        quote: 'Aku otw itu konsep, bukan lokasi.',
        instagramUrl: 'https://example.com/farel',
        photoUrl: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Dinda',
        quote: 'Kalau ga difoto, nanti sejarahnya denial.',
        instagramUrl: 'https://example.com/dinda',
        photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Raka',
        quote: 'Aku cuma nanya, kok jadi rapat?',
        instagramUrl: 'https://example.com/raka',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Tasya',
        quote: 'Tenang, ini cuma fase sebelum chaos.',
        instagramUrl: 'https://example.com/tasya',
        photoUrl: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Bagas',
        quote: 'Kita boleh miskom, asal jangan miskin snack.',
        instagramUrl: 'https://example.com/bagas',
        photoUrl: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Mira',
        quote: 'Maksudnya bukan begitu, tapi ya agak begitu.',
        instagramUrl: 'https://example.com/mira',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Jovan',
        quote: 'Plan A gagal? Bagus, plotnya mulai menarik.',
        instagramUrl: 'https://example.com/jovan',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
    },
    {
        name: 'Lala',
        quote: 'Jangan lupa, ini nanti lucu kalau diingat.',
        instagramUrl: 'https://example.com/lala',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
    },
];

export const messages = [
    {
        name: 'Anon yang jelas kenal',
        message: 'Tinggalkan jejak sebelum lupa password kehidupan.',
        rotation: '-1.5deg',
    },
    {
        name: 'Tim Datang Telat',
        message: 'Arsip ini bukti bahwa rencana dadakan kadang paling niat.',
        rotation: '1deg',
    },
    {
        name: 'Penonton Setia',
        message: 'Tidak semua tawa punya dokumentasi, tapi ini salah satunya.',
        rotation: '-0.5deg',
    },
];
