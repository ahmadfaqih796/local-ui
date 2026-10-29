/**
 * Definisi Preset Suara untuk Voice Changer
 * Dikalibrasi presisi dengan frekuensi harmonik vokal manusia
 * agar suara jernih, halus, tidak kresek-kresek, dan tidak pecah (anti-clipping).
 */
export const VOICE_PRESETS = [
  {
    id: 'normal',
    name: 'Normal (Studio Clean)',
    description: 'Suara asli jernih vokal studio tanpa efek pitch',
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
      robotFreq: 60,
      echoMix: 0,
      distortion: 0,
      highPassFreq: 80,
      lowPassFreq: 14000,
    },
  },
  {
    id: 'cepreng',
    name: 'Cepreng (Chipmunk Lucu)',
    description: 'Suara melengking tinggi, imut, dan renyah tanpa kresek',
    icon: 'Sparkles',
    color: 'from-amber-400 to-orange-500',
    badge: 'Populer',
    params: {
      pitchSemitones: 7, // Naik 7 semitone (Alvin chipmunk natural)
      pitchRatio: 1.50,
      bassBoost: -5,     // Potong resonansi dada berat
      trebleBoost: 4,    // Tambah renyah vokal atas
      formantF1: 2,
      formantF2: 5,
      robotMix: 0,
      robotFreq: 60,
      echoMix: 0.02,
      distortion: 0,     // 0 distorsi agar suara bersih & renyah
      highPassFreq: 160,
      lowPassFreq: 13000,
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
      pitchSemitones: -5, // Turun 5 semitone (suara berat mantap)
      pitchRatio: 0.75,
      bassBoost: 6,       // Boost bass seimbang (tidak pecah)
      trebleBoost: -2,    // Redam sibilance desis tajam
      formantF1: 2,
      formantF2: -2,
      robotMix: 0,
      robotFreq: 50,
      echoMix: 0.05,
      distortion: 0.02,   // Sangat halus untuk kehangatan analog
      highPassFreq: 70,
      lowPassFreq: 9000,
    },
  },
  {
    id: 'wanita',
    name: 'Karakter Wanita',
    description: 'Resonansi vokal feminin yang lembut, pitch pas, dan nafas halus',
    icon: 'Smile',
    color: 'from-pink-500 to-rose-600',
    badge: 'Feminin',
    params: {
      pitchSemitones: 3.5, // Naik 3.5 semitone (feminin natural, tidak chipmunk)
      pitchRatio: 1.22,
      bassBoost: -4,      // Redam frekuensi dada pria
      trebleBoost: 3,     // Sentuhan vokal lembut
      formantF1: 3,       // Boost formant F1 vokal wanita
      formantF2: 4,       // Boost formant F2 vokal wanita
      robotMix: 0,
      robotFreq: 60,
      echoMix: 0.03,
      distortion: 0,      // Bersih tanpa distorsi
      highPassFreq: 140,
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
      pitchSemitones: -3, // Turun 3 semitone
      pitchRatio: 0.84,
      bassBoost: 4,
      trebleBoost: -1,
      formantF1: -1,
      formantF2: -2,
      robotMix: 0,
      robotFreq: 50,
      echoMix: 0.03,
      distortion: 0,
      highPassFreq: 75,
      lowPassFreq: 9500,
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
      pitchSemitones: -1,
      pitchRatio: 0.94,
      bassBoost: 3,
      trebleBoost: 3,
      formantF1: 2,
      formantF2: 3,
      robotMix: 0.45,     // Modulasi harmonik bersih
      robotFreq: 56,      // 56Hz sinusoidal modulation
      echoMix: 0.12,      // Pantulan ruang logam
      distortion: 0.04,
      highPassFreq: 100,
      lowPassFreq: 10000,
    },
  },
]
