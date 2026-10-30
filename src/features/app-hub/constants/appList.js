/**
 * Registry Katalog Aplikasi Vending Machine (LocalHub App Store)
 * Setiap aplikasi diibaratkan seperti "snack/softdrink" yang tersedia di dalam vending machine.
 * Berisi metadata lengkap, jalur rute, kategori, fitur kunci, serta skema lisensi / payment jalur masa depan.
 */

export const APP_CATEGORIES = [
  { id: 'all', label: 'Semua Aplikasi' },
  { id: 'audio', label: 'Audio & Meeting' },
  { id: 'storage', label: 'Penyimpanan & File' },
  { id: 'ai', label: 'Kecerdasan Buatan (AI)' },
]

export const APP_REGISTRY = [
  {
    id: 'voice-changer',
    name: 'Voice Changer Meeting',
    tagline: 'Pengubah Suara Vokal Mikrofon Real-Time',
    category: 'audio',
    categoryLabel: 'Audio Utility',
    badge: 'Siap Pakai',
    version: 'v1.2 Stable',
    route: '/voice-changer',
    isExternal: false,
    iconName: 'Mic',
    accentColor: 'emerald',
    gradientBg: 'from-emerald-500/15 via-teal-500/5 to-transparent',
    borderColor: 'border-emerald-300/80',
    status: 'active', // 'active' | 'coming_soon' | 'locked'
    pricing: {
      tier: 'free', // 'free' | 'freemium' | 'pro'
      priceLabel: '100% Gratis',
      isUnlocked: true,
    },
    description:
      'Ubah suara vokal langsung saat rapat online di Google Meet, Zoom, atau Discord dengan karakter suara natural tanpa feedback loop dan tanpa distorsi.',
    features: [
      '6 Preset Suara: Cepreng, Bass, Wanita, Pria, Robot, Normal',
      'Anti-Mantul Otomatis (Zero-Setting Auto Pilot)',
      'Waveform & Frequency Spectrum Visualizer 60 FPS',
      'Integrasi Virtual Audio Cable (VB-CABLE)',
    ],
    stats: {
      latency: '< 15 ms',
      tech: 'Web Audio API',
      connection: '100% Offline',
    },
  },
  {
    id: 'shared-storage',
    name: 'Shared Storage Hub',
    tagline: 'Pusat Penyimpanan Bersama Wi-Fi & Hotspot',
    category: 'storage',
    categoryLabel: 'LAN Cloud Storage',
    badge: 'Hotspot Ready',
    version: 'v1.0 Fresh',
    route: '/file-transfer',
    isExternal: false,
    iconName: 'HardDrive',
    accentColor: 'blue',
    gradientBg: 'from-blue-500/15 via-cyan-500/5 to-transparent',
    borderColor: 'border-blue-300/80',
    status: 'active',
    pricing: {
      tier: 'free',
      priceLabel: '100% Gratis',
      isUnlocked: true,
    },
    description:
      'Jadikan hard drive laptop Anda sebagai pusat penyimpanan berkas bersama. HP dan laptop lain dapat mengunggah dan mengunduh berkas tanpa kuota internet.',
    features: [
      'Dukungan Mode Hotspot Mandiri (Outdoor / Di Gunung)',
      'Akses Sekali Scan QR Code untuk Kamera HP',
      'Pembaruan Daftar Berkas Real-Time via SSE',
      'Penyimpanan Fisik Langsung di Disk Laptop',
    ],
    stats: {
      speed: 'Hingga 50 MB/s',
      tech: 'Vite FS Stream',
      connection: 'Wi-Fi / Hotspot',
    },
  },
  {
    id: 'p2p-transfer',
    name: 'P2P Direct File Transfer',
    tagline: 'Pengiriman Berkas Kilat Tanpa Server',
    category: 'storage',
    categoryLabel: 'High-Speed P2P',
    badge: 'Unlimited Size',
    version: 'v1.0 P2P',
    route: '/file-transfer#p2p',
    isExternal: false,
    iconName: 'Share2',
    accentColor: 'indigo',
    gradientBg: 'from-indigo-500/15 via-violet-500/5 to-transparent',
    borderColor: 'border-indigo-300/80',
    status: 'active',
    pricing: {
      tier: 'free',
      priceLabel: '100% Gratis',
      isUnlocked: true,
    },
    description:
      'Kirim file raksasa (video, arsip zip, game) langsung dari laptop ke laptop atau HP lain menggunakan protokol WebRTC DataChannel berkecepatan tinggi.',
    features: [
      'Transfer Berkas Peer-to-Peer 64KB Chunking',
      'Deteksi Otomatis Radar Perangkat Lokal',
      'Sistem Pairing Kode Unik 6-Digit & QR',
      'Tanpa Batasan Ukuran Berkas & Tanpa Cloud',
    ],
    stats: {
      speed: 'Kecepatan Kabel LAN',
      tech: 'WebRTC DataChannel',
      connection: 'P2P Direct',
    },
  },
  {
    id: 'ai-transcriber',
    name: 'Local AI Meeting Transcriber',
    tagline: 'Notulensi Rapat Otomatis & Transkripsi Suara',
    category: 'ai',
    categoryLabel: 'Productivity AI',
    badge: 'Jalur Monetisasi',
    version: 'v0.9 Preview',
    route: '#',
    isExternal: false,
    iconName: 'Sparkles',
    accentColor: 'amber',
    gradientBg: 'from-amber-500/15 via-orange-500/5 to-transparent',
    borderColor: 'border-amber-300/80',
    status: 'coming_soon',
    pricing: {
      tier: 'pro',
      priceLabel: 'Jalur Berbayar (Pro)',
      isUnlocked: false,
    },
    description:
      'Transkripsikan seluruh percakapan Google Meet langsung menjadi teks notulensi terstruktur dan poin kesimpulan tindakan menggunakan AI offline di laptop.',
    features: [
      'Model AI Whisper Offline di Laptop (Tanpa Kirim ke Cloud)',
      'Ringkasan Otomatis Action Items & Notulen Rapat',
      'Ekspor ke Dokumen PDF, Word, dan Markdown',
      'Siap Terhubung ke Sistem Lisensi & Pembayaran QRIS',
    ],
    stats: {
      privacy: '100% On-Device',
      tech: 'Whisper AI Engine',
      connection: 'Siap Monetisasi',
    },
  },
]

