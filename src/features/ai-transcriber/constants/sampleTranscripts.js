/**
 * Sampel Notulensi & Transkrip Rapat untuk Demonstrasi Local AI Transcriber
 * Dibuat realistis berdasarkan konteks evaluasi produk LocalHub bersama Pak Paul
 */

export const SAMPLE_MEETINGS = [
  {
    id: 'sample-paul-review',
    title: 'Evaluasi Blueprint Vending Machine LocalHub & Ekosistem JC',
    duration: '04 menit 28 detik',
    date: '31 Oktober 2026',
    speakers: ['Pak Paul (Trainer & Mentor JC)', 'Faqih (Lead Dev)', 'Tim Komunitas'],
    summary:
      'Rapat membahas transformasi utilitas lokal menjadi wadah vending machine aplikasi mandiri. Pak Paul memberikan arahan penting: jangan memberikan gratisan tanpa batas, melainkan berikan demo interaktif di web browser agar calon pembeli dapat mencoba langsung tanpa takut dianggap virus/malware. Disepakati juga penggabungan model bisnis dengan aktivitas koin platform belajar JC.',
    keyDecisions: [
      'Menyediakan Studio Uji Coba Suara Online (Demo Sandbox 5–10 detik) langsung di browser tanpa perlu instalasi kabel virtual atau aplikasi lokal.',
      'Mengintegrasikan model bisnis dengan sistem penukaran koin aktivitas platform JC menggunakan kode voucher (misal: JCPRO, DEMO10).',
      'Menjadikan Local AI Meeting Transcriber sebagai slot aplikasi Pro berbayar (Rp 49.000 / Pro Voucher Pass).',
      'Seluruh pemrosesan transkripsi AI berjalan 100% lokal (on-device) di laptop pengguna untuk menjamin kerahasiaan data rapat.',
    ],
    actionItems: [
      {
        task: 'Bangun Web Demo Sandbox 5-10 detik di browser peramban',
        pic: 'Faqih',
        deadline: '31 Okt 2026',
        status: 'completed',
      },
      {
        task: 'Integrasikan gerbang penukaran voucher koin platform JC',
        pic: 'Faqih',
        deadline: '31 Okt 2026',
        status: 'completed',
      },
      {
        task: 'Rilis slot aplikasi Local AI Meeting Transcriber untuk akun Pro',
        pic: 'Faqih',
        deadline: '31 Okt 2026',
        status: 'completed',
      },
      {
        task: 'Sinkronisasi token reward aktivitas platform dengan LocalHub',
        pic: 'Tim Platform JC',
        deadline: '05 Nov 2026',
        status: 'in_progress',
      },
    ],
    transcriptSegments: [
      {
        time: '00:05',
        speaker: 'Pak Paul',
        text: 'Kasih demo bukan gratisan... Buka aplikasi ini dianggap virus atau aplikasi coba-coba aja kalau harus install langsung.',
      },
      {
        time: '00:18',
        speaker: 'Pak Paul',
        text: 'Nah disitu research nya. Gimana orang bisa nyoba online dulu sebelum beli. Bisnis model nya disambung sama platform jadi aktifitas koin atau apa dari sana terintegrasi buat dapetin atau nyoba hub ini.',
      },
      {
        time: '00:42',
        speaker: 'Faqih',
        text: 'Ide sangat brilian Pak Paul! Kita langsung buatkan Studio Uji Coba Suara 5 detik di web menggunakan Web Audio API murni. Pengguna rekam 5 detik, dengar suaranya berubah jadi Cepreng, Bass, atau Wanita tanpa perlu install apa pun.',
      },
      {
        time: '01:15',
        speaker: 'Faqih',
        text: 'Untuk bisnis modelnya, kita sediakan tab Tukar Voucher Platform di modal koin. Member atau mahasiswa pelatihan JC cukup masukkan kode seperti JCPRO atau DEMO10 untuk membuka akses secara instan.',
      },
      {
        time: '01:45',
        speaker: 'Pak Paul',
        text: 'Mantap, kalau begitu jalurnya jelas! Aplikasi vending machine ini jadi punya wadah otentikasi mandiri dan slot fitur Pro seperti AI Transcriber bisa langsung dimonetisasi.',
      },
    ],
  },
  {
    id: 'sample-daily-standup',
    title: 'Daily Standup Tim Engineering & Rilis Fitur Baru',
    duration: '02 menit 15 detik',
    date: '30 Oktober 2026',
    speakers: ['Faqih (Lead Dev)', 'QA Tester', 'Product Owner'],
    summary:
      'Pemeriksaan stabilitas build produksi dan verifikasi performa transfer berkas Wi-Fi Hotspot mandiri. Seluruh linting ESLint dan Vite build berada pada status 0 error.',
    keyDecisions: [
      'Menstandarisasi komponen modal universal untuk mencegah background scrolling bug.',
      'Mengaktifkan deteksi hotspot otomatis 192.168.137.1 untuk skenario luar ruangan.',
    ],
    actionItems: [
      {
        task: 'Verifikasi latensi Web Audio API di bawah 20ms',
        pic: 'Faqih',
        deadline: '30 Okt 2026',
        status: 'completed',
      },
      {
        task: 'Uji responsivitas antarmuka di layar ponsel 375px',
        pic: 'QA Tester',
        deadline: '31 Okt 2026',
        status: 'completed',
      },
    ],
    transcriptSegments: [
      {
        time: '00:03',
        speaker: 'Faqih',
        text: 'Selamat pagi tim, hari ini kita pastikan build produksi bersih dari semua warning linting dan styling Figma token.',
      },
      {
        time: '00:25',
        speaker: 'QA Tester',
        text: 'Laporan pengujian modal sudah terverifikasi. Tidak ada lagi layout-shift atau scrolling di body saat modal dibuka.',
      },
      {
        time: '00:48',
        speaker: 'Product Owner',
        text: 'Bagus sekali. Pastikan slot aplikasi Pro siap untuk dipresentasikan.',
      },
    ],
  },
]

