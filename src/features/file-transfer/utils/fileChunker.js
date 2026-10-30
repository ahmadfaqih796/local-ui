import { CHUNK_SIZE } from '../constants/transferConstants'

/**
 * Menghasilkan ID unik untuk berkas yang ditransfer
 * @returns {string} ID unik acak
 */
export function generateFileId() {
  return `file_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Membaca irisan (slice) berkas menjadi ArrayBuffer
 * @param {File|Blob} file - Berkas objek File
 * @param {number} start - Byte awal
 * @param {number} end - Byte akhir
 * @returns {Promise<ArrayBuffer>}
 */
export function readFileSlice(file, start, end) {
  return new Promise((resolve, reject) => {
    const slice = file.slice(start, end)
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(slice)
  })
}

/**
 * Membuat paket metadata awal berkas sebelum pengiriman chunk
 * @param {File} file - Berkas File dari browser
 * @returns {Object} Metadata berkas
 */
export function createFileMetadata(file) {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
  return {
    id: generateFileId(),
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    totalChunks,
    lastModified: file.lastModified,
  }
}

/**
 * Mendeteksi kategori tipe file untuk ikon dan pewarnaan UI
 * @param {string} mimeType - MIME Type browser
 * @param {string} fileName - Nama file lengkap
 * @returns {'image' | 'video' | 'audio' | 'document' | 'archive' | 'code' | 'other'}
 */
export function detectFileType(mimeType = '', fileName = '') {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''

  if (mimeType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'].includes(ext)) {
    return 'image'
  }
  if (mimeType.startsWith('video/') || ['mp4', 'mkv', 'webm', 'mov', 'avi', 'flv'].includes(ext)) {
    return 'video'
  }
  if (mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'].includes(ext)) {
    return 'audio'
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'iso'].includes(ext)) {
    return 'archive'
  }
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'md'].includes(ext)) {
    return 'document'
  }
  if (['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'json', 'py', 'java', 'cpp', 'rs', 'go'].includes(ext)) {
    return 'code'
  }
  return 'other'
}

