/**
 * Memformat ukuran byte menjadi satuan yang mudah dibaca manusia (B, KB, MB, GB)
 * @param {number} bytes - Jumlah byte
 * @param {number} [decimals=2] - Jumlah angka desimal
 * @returns {string} String terformat misal "14.50 MB"
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes <= 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Memformat kecepatan transfer menjadi string kecepatan per detik
 * @param {number} bytesPerSec - Byte per detik
 * @returns {string} String kecepatan misal "12.4 MB/s"
 */
export function formatSpeed(bytesPerSec) {
  if (!bytesPerSec || bytesPerSec <= 0) return '0 B/s'
  return `${formatBytes(bytesPerSec, 1)}/s`
}

/**
 * Memformat perkiraan waktu selesai (ETA)
 * @param {number} seconds - Detik tersisa
 * @returns {string} String waktu misal "45 dtk", "2 mnt 15 dtk"
 */
export function formatETA(seconds) {
  if (!seconds || seconds <= 0 || !Number.isFinite(seconds)) return 'Menghitung...'
  const sec = Math.ceil(seconds)
  if (sec < 60) return `${sec} dtk`
  const min = Math.floor(sec / 60)
  const remSec = sec % 60
  if (min < 60) {
    return remSec > 0 ? `${min} mnt ${remSec} dtk` : `${min} mnt`
  }
  const hours = Math.floor(min / 60)
  const remMin = min % 60
  return `${hours} jam ${remMin} mnt`
}

