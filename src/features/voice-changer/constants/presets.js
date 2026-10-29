/**
 * Definisi Preset Suara untuk Voice Changer
 * Dikalibrasi presisi dengan frekuensi harmonik vokal manusia
 * agar semua karakter vokal (Cepreng, Super Bass, Karakter Wanita, Karakter Pria Dewasa, Robot Cyberpunk)
 * terdengar jernih, alami, tegap, dan bebas dari kresek maupun distorsi pecah.
 */
export const VOICE_PRESETS = [
  {
    id: 'normal',
    name: 'Normal (Studio Clean)',
    description: 'Suara asli jernih vokal studio tanpa efek pergeseran nada',
    icon: 'Mic',
    color: 'from-blue-500 to-indigo-600',
    badge: 'Original',
    params: {
      pitchSemitones: 0,
      pitchRatio: 1.0,
      bassBoost: 0,
      trebleBoost: 0,
      formantF1: 0,
      formantF2: 0,
      robotMix: 0,
      robotFreq: 50,
      echoMix: 0,
      distortion: 0,
      highPassFreq: 80,
      lowPassFreq: 14000,
    },
  },
  {
    id: 'cepreng',
    name: 'Cepreng (Chipmunk Lucu)',
    description: 'Suara melengking tinggi, imut, dan renyah seperti kartun Alvin',
    icon: 'Sparkles',
    color: 'from-amber-400 to-orange-500',
    badge: 'Populer',
    params: {
      pitchSemitones: 7, // Naik 7 semitone (Alvin & The Chipmunks natural)
      pitchRatio: 1.498,
      bassBoost: -3,     // Potong resonansi dada berat agar vokal imut seimbang
      trebleBoost: 2,    // Renyah alami tanpa desis tajam
      formantF1: 1,      // Artikulasi vokal jelas
      formantF2: 3,      // Karakter suara ceria
      robotMix: 0,
      robotFreq: 50,
      echoMix: 0,
      distortion: 0,     // 0 distorsi agar vokal sangat bersih & jernih
      highPassFreq: 120, // Potong getaran meja/dengung bawah
      lowPassFreq: 13500,
    },
  },
  {
    id: 'bass',
    name: 'Super Bass (Penyiar Radio)',
    description: 'Suara sangat berat, berwibawa, bulat, dan beresonansi dada tebal',
    icon: 'Volume2',
    color: 'from-purple-600 to-indigo-900',
    badge: 'Ngebass',
    params: {
      pitchSemitones: -4.5, // Turun 4.5 semitone (Berat dan berwibawa khas penyiar)
      pitchRatio: 0.771,
      bassBoost: 4,         // Resonansi hangat tebal (aman dari suara pecah)
      trebleBoost: 0,       // Treble natural
      formantF1: 1,         // Bobot resonansi dada
      formantF2: -1,        // Meredam sibilance tajam
      robotMix: 0,
      robotFreq: 50,
      echoMix: 0,
      distortion: 0,        // Murni tanpa distorsi
      highPassFreq: 65,
      lowPassFreq: 10500,
    },
  },
  {
    id: 'wanita',
    name: 'Karakter Wanita',
    description: 'Resonansi vokal feminin yang lembut, pitch pas, dan artikulasi jelas',
    icon: 'Smile',
    color: 'from-pink-500 to-rose-600',
    badge: 'Feminin',
    params: {
      pitchSemitones: 3.5, // Naik 3.5 semitone (Transformasi ke rentang vokal wanita)
      pitchRatio: 1.224,
      bassBoost: -3,       // Redam frekuensi dada pria agar terdengar natural
      trebleBoost: 2,      // Sentuhan halus vokal atas
      formantF1: 1,        // Formant tenggorokan wanita
      formantF2: 3,        // Formant kelembutan feminin
      robotMix: 0,
      robotFreq: 50,
      echoMix: 0,
      distortion: 0,       // Bersih tanpa distorsi
      highPassFreq: 130,   // Potong rumble frekuensi rendah
      lowPassFreq: 13500,
    },
  },
  {
    id: 'pria',
    name: 'Karakter Pria Dewasa',
    description: 'Vokal maskulin, tegap, tegas, dan berwibawa (terbukti mantap)',
    icon: 'UserCheck',
    color: 'from-cyan-600 to-blue-700',
    badge: 'Maskulin',
    params: {
      pitchSemitones: -3,  // Turun 3 semitone (Sesuai karakter yang sudah disukai user)
      pitchRatio: 0.841,
      bassBoost: 3,        // Resonansi maskulin mantap
      trebleBoost: 0,      // Natural
      formantF1: 0,
      formantF2: -1,
      robotMix: 0,
      robotFreq: 50,
      echoMix: 0,
      distortion: 0,
      highPassFreq: 75,
      lowPassFreq: 11000,
    },
  },
  {
    id: 'robot',
    name: 'Robot Cyberpunk',
    description: 'Suara mekanik sintetis futuristik ala Daft Punk tanpa dengung bising',
    icon: 'Cpu',
    color: 'from-emerald-500 to-teal-700',
    badge: 'Sci-Fi',
    params: {
      pitchSemitones: -1,  // Sedikit turun agar terdengar kokoh
      pitchRatio: 0.944,
      bassBoost: 2,
      trebleBoost: 2,
      formantF1: 1,
      formantF2: 2,
      robotMix: 0.35,      // Modulasi robot pas, vokal tetap 100% terbaca & jelas
      robotFreq: 48,       // 48Hz modulasi balanced ring modulator
      echoMix: 0.04,       // Sentuhan ruang metal tipis
      distortion: 0,       // Bebas dari kresek distorsi
      highPassFreq: 120,   // Potong rumble modulasi
      lowPassFreq: 9500,
    },
  },
]
