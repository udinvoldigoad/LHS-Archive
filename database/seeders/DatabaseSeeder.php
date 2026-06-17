<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Link;
use App\Models\Member;
use App\Models\Message;
use App\Models\Moment;
use App\Models\Photo;
use App\Models\Setting;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Setting::query()->updateOrCreate(
            ['id' => 1],
            [
                'site_title' => 'LHS Archive',
                'tagline' => 'Tempat kecil buat nyimpen semua hal yang pernah rame bareng.',
                'best_moment_title' => 'Malam Keakraban 2023',
                'best_moment_description' => 'Satu video buat membuktikan kalau chaos juga bisa terlihat sinematik.',
                'best_moment_video_url' => null,
                'background_music_url' => 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            ]
        );

        $links = [
            [
                'title' => 'Google Drive Folder',
                'description' => 'Kumpulan foto aib dan video unfaded dari tahun ke tahun.',
                'url' => 'https://example.com/drive-folder',
                'category' => 'Dokumentasi',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Instagram Highlight',
                'description' => 'Jejak digital yang mungkin kalian mau hapus tapi ga bisa.',
                'url' => 'https://example.com/instagram-highlight',
                'category' => 'Sosmed',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Playlist Spotify',
                'description' => 'Lagu-lagu yang sering diputar waktu nongkrong sampai pagi.',
                'url' => 'https://example.com/playlist',
                'category' => 'Random',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Project Iseng',
                'description' => 'Ide serius lima menit yang berubah jadi archive permanen.',
                'url' => 'https://example.com/project',
                'category' => 'Project',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Video Mentah',
                'description' => 'File mentah, audio pecah, nilai sejarah tetap tinggi.',
                'url' => 'https://example.com/video',
                'category' => 'Video',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
            ],
            [
                'title' => 'Catatan Basecamp',
                'description' => 'Dokumen random yang entah kenapa masih penting.',
                'url' => 'https://example.com/notes',
                'category' => 'Arsip Foto',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&w=800&q=80',
            ],
        ];

        foreach ($links as $index => $link) {
            $category = Category::query()->updateOrCreate(
                ['slug' => Str::slug($link['category'])],
                ['name' => $link['category']]
            );

            Link::query()->updateOrCreate(
                ['title' => $link['title']],
                [
                    'category_id' => $category->id,
                    'description' => $link['description'],
                    'url' => $link['url'],
                    'thumbnail_url' => $link['thumbnail_url'],
                    'is_featured' => $index === 0,
                    'sort_order' => $index,
                ]
            );
        }

        $moments = [
            [
                'title' => 'Foto blur, memorinya jelas.',
                'caption' => 'Foto blur, memorinya jelas.',
                'image_url' => 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=700&q=80',
                'rotation' => '-3deg',
            ],
            [
                'title' => 'Formasi lengkap',
                'caption' => 'Formasi lengkap (tumben).',
                'image_url' => 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=700&q=80',
                'rotation' => '3deg',
            ],
            [
                'title' => 'Karaoke sampai serak',
                'caption' => 'Karaoke sampai serak.',
                'image_url' => 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=700&q=80',
                'rotation' => '-1deg',
            ],
            [
                'title' => 'Hari biasa yang jadi arsip',
                'caption' => 'Hari biasa yang ternyata layak diarsipkan.',
                'image_url' => 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=700&q=80',
                'rotation' => '2deg',
            ],
            [
                'title' => 'Sebelum pura-pura sibuk',
                'caption' => 'Momen sebelum semuanya pura-pura sibuk.',
                'image_url' => 'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=700&q=80',
                'rotation' => '-2deg',
            ],
        ];

        foreach ($moments as $index => $momentData) {
            $moment = Moment::query()->updateOrCreate(
                ['slug' => Str::slug($momentData['title'])],
                [
                    'title' => $momentData['title'],
                    'description' => $momentData['caption'],
                ]
            );

            Photo::query()->updateOrCreate(
                [
                    'moment_id' => $moment->id,
                    'image_url' => $momentData['image_url'],
                ],
                [
                    'caption' => $momentData['caption'],
                    'rotation' => $momentData['rotation'],
                    'sort_order' => $index,
                ]
            );
        }

        $members = [
            ['Ridho', 'Tukang Ide Dadakan', 'Hidup cuma sekali, tapi revisi bisa berkali-kali.', 'Sering punya ide pas deadline sudah melihat dari kejauhan.', 'https://example.com/ridho', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80'],
            ['Aryo', 'Divisi Rame-Rame', 'Kalau bisa dibuat ribet, kenapa harus selesai cepat?', 'Datang membawa energi, pulang membawa cerita.', 'https://example.com/aryo', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80'],
            ['Syehab', 'Penjaga Mood Tidak Resmi', 'Diam bukan berarti tidak tahu, bisa jadi sedang loading.', 'Kadang terlihat santai, padahal pikirannya tabrakan.', 'https://example.com/syehab', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80'],
            ['Nadia', 'Operator Ketawa', 'Masalah boleh banyak, stok ngakak jangan habis.', 'Bisa mengubah obrolan random jadi agenda serius.', 'https://example.com/nadia', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80'],
            ['Farel', 'Koordinator Hilang Sinyal', 'Aku otw itu konsep, bukan lokasi.', 'Paling sering muncul pas semua orang sudah mulai pasrah.', 'https://example.com/farel', 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=500&q=80'],
            ['Dinda', 'Menteri Dokumentasi', 'Kalau ga difoto, nanti sejarahnya denial.', 'Memiliki bukti visual untuk hampir semua kejadian.', 'https://example.com/dinda', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80'],
            ['Raka', 'Ahli Debat Ringan', 'Aku cuma nanya, kok jadi rapat?', 'Bisa membuka diskusi dari satu kalimat polos.', 'https://example.com/raka', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80'],
            ['Tasya', 'Kurator Drama Kecil', 'Tenang, ini cuma fase sebelum chaos.', 'Selalu tahu mana cerita yang perlu disimpan.', 'https://example.com/tasya', 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=500&q=80'],
            ['Bagas', 'Bendahara Cemilan', 'Kita boleh miskom, asal jangan miskin snack.', 'Datang dengan plastik kresek yang isinya misterius.', 'https://example.com/bagas', 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=500&q=80'],
            ['Mira', 'Penerjemah Situasi', 'Maksudnya bukan begitu, tapi ya agak begitu.', 'Punya kemampuan merapikan obrolan yang hampir meledak.', 'https://example.com/mira', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'],
            ['Jovan', 'Pilot Rencana B', 'Plan A gagal? Bagus, plotnya mulai menarik.', 'Tenang di luar, tab browser mentalnya dua puluh.', 'https://example.com/jovan', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80'],
            ['Lala', 'Arsiparis Perasaan', 'Jangan lupa, ini nanti lucu kalau diingat.', 'Sering benar tentang momen yang awalnya terlihat biasa.', 'https://example.com/lala', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80'],
        ];

        foreach ($members as $index => [$name, $role, $quote, $funFact, $instagramUrl, $photoUrl]) {
            Member::query()->updateOrCreate(
                ['name' => $name],
                [
                    'nickname' => null,
                    'role' => $role,
                    'quote' => $quote,
                    'fun_fact' => $funFact,
                    'instagram_url' => $instagramUrl,
                    'photo_url' => $photoUrl,
                    'sort_order' => $index,
                ]
            );
        }

        $messages = [
            ['Anon yang jelas kenal', 'Tinggalkan jejak sebelum lupa password kehidupan.'],
            ['Tim Datang Telat', 'Arsip ini bukti bahwa rencana dadakan kadang paling niat.'],
            ['Penonton Setia', 'Tidak semua tawa punya dokumentasi, tapi ini salah satunya.'],
        ];

        foreach ($messages as [$name, $message]) {
            Message::query()->updateOrCreate(
                [
                    'name' => $name,
                    'message' => $message,
                ],
                ['is_visible' => true]
            );
        }
    }
}
