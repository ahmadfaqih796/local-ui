/**
 * Konstanta Pengaturan Modul Transfer Berkas P2P
 */

// Ukuran chunk optimal WebRTC DataChannel (64 Kilobytes)
export const CHUNK_SIZE = 64 * 1024

// Ambang batas buffer WebRTC DataChannel untuk mencegah memory overflow (8 MB)
export const MAX_BUFFERED_AMOUNT = 8 * 1024 * 1024

// Ambang batas sinyal 'bufferedamountlow' untuk melanjutkan pengiriman (1 MB)
export const BUFFERED_LOW_THRESHOLD = 1 * 1024 * 1024

// Tipe pesan protokol komunikasi P2P
export const PROTOCOL_TYPES = {
  HELLO: 'PEER_HELLO',
  PING: 'PEER_PING',
  PONG: 'PEER_PONG',
  FILE_META: 'FILE_META',
  FILE_CANCEL: 'FILE_CANCEL',
  FILE_ACK: 'FILE_ACK',
  DISCONNECT: 'PEER_DISCONNECT',
}

// Konfigurasi ICE Servers standar WebRTC (Mendukung sambungan lokal LAN / Wi-Fi dan STUN publik)
export const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
}

// Status transfer file
export const TRANSFER_STATUS = {
  PENDING: 'pending',
  PREPARING: 'preparing',
  TRANSFERRING: 'transferring',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  FAILED: 'failed',
}

