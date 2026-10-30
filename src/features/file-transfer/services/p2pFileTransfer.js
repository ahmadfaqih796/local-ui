import {
  CHUNK_SIZE,
  PROTOCOL_TYPES,
} from '../constants/transferConstants'
import { readFileSlice, createFileMetadata, detectFileType } from '../utils/fileChunker'
import { useTransferStore } from '../store/useTransferStore'

/**
 * Layanan Pemrosesan Transfer Berkas P2P WebRTC & Local Network
 */
class P2PFileTransferService {
  constructor() {
    this.broadcastChannel = null
    this.peerConnections = new Map() // peerId -> RTCPeerConnection
    this.dataChannels = new Map()    // peerId -> RTCDataChannel
    this.receivingFiles = new Map()  // fileId -> { meta, chunks, receivedBytes, startedAt }
    this.activeTransfers = new Map() // fileId -> { isCancelled, reader }
    this.heartbeatInterval = null
    this.isInitialized = false
  }

  /**
   * Menginisialisasi saluran komunikasi P2P lokal
   */
  init() {
    if (this.isInitialized) return

    // Inisialisasi BroadcastChannel untuk deteksi lokal instan (antar tab / peramban di laptop yang sama)
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel('localhub_p2p_channel')
        this.broadcastChannel.onmessage = (event) => this._handleBroadcastMessage(event.data)
      } catch (err) {
        console.warn('BroadcastChannel tidak didukung:', err)
      }
    }

    // Kirim sinyal kehadiran pertama kali
    this.broadcastHello()

    // Heartbeat berkala setiap 5 detik untuk memeriksa ketersediaan perangkat lain
    this.heartbeatInterval = setInterval(() => {
      this.broadcastHello()
    }, 5000)

    // Deteksi saat tab akan ditutup untuk melepaskan koneksi secara bersih
    window.addEventListener('beforeunload', () => {
      this.destroy()
    })

    this.isInitialized = true
  }

  /**
   * Mengumumkan kehadiran perangkat ke jaringan lokal
   */
  broadcastHello() {
    const store = useTransferStore.getState()
    const payload = {
      type: PROTOCOL_TYPES.HELLO,
      sender: store.myDevice,
      roomCode: store.roomCode,
      timestamp: Date.now(),
    }

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload)
      } catch { /* ignore */ }
    }
  }

  /**
   * Menangani pesan yang masuk dari saluran lokal
   * @private
   */
  _handleBroadcastMessage(data) {
    if (!data || !data.type) return
    const store = useTransferStore.getState()

    // Abaikan pesan dari diri sendiri
    if (data.sender?.id === store.myDevice.id) return

    switch (data.type) {
      case PROTOCOL_TYPES.HELLO: {
        // Daftarkan peer yang baru terdeteksi
        store.addPeer({
          id: data.sender.id,
          name: data.sender.name,
          type: data.sender.type || 'laptop',
          roomCode: data.roomCode,
          isConnected: true,
          lastSeen: Date.now(),
        })

        // Balas dengan PONG agar pengirim juga mencatat kita
        if (this.broadcastChannel) {
          try {
            this.broadcastChannel.postMessage({
              type: PROTOCOL_TYPES.PONG,
              sender: store.myDevice,
              targetId: data.sender.id,
              roomCode: store.roomCode,
              timestamp: Date.now(),
            })
          } catch { /* ignore */ }
        }
        break
      }

      case PROTOCOL_TYPES.PONG: {
        if (data.targetId === store.myDevice.id) {
          store.addPeer({
            id: data.sender.id,
            name: data.sender.name,
            type: data.sender.type || 'laptop',
            roomCode: data.roomCode,
            isConnected: true,
            lastSeen: Date.now(),
          })
        }
        break
      }

      case PROTOCOL_TYPES.FILE_META: {
        if (data.targetPeerId === store.myDevice.id) {
          this._handleIncomingFileMeta(data.meta, data.sender)
        }
        break
      }

      case 'FILE_CHUNK_DATA': {
        if (data.targetPeerId === store.myDevice.id) {
          this._handleIncomingChunk(data.fileId, data.chunk, data.chunkIndex)
        }
        break
      }

      case PROTOCOL_TYPES.FILE_CANCEL: {
        if (data.targetPeerId === store.myDevice.id) {
          store.cancelTransfer(data.fileId)
          this.receivingFiles.delete(data.fileId)
        }
        break
      }

      case PROTOCOL_TYPES.DISCONNECT: {
        store.removePeer(data.sender?.id)
        break
      }

      default:
        break
    }
  }

  /**
   * Menangani paket metadata awal saat ada file masuk
   * @private
   */
  _handleIncomingFileMeta(meta, sender) {
    const store = useTransferStore.getState()

    this.receivingFiles.set(meta.id, {
      meta,
      chunks: new Array(meta.totalChunks),
      receivedBytes: 0,
      receivedChunksCount: 0,
      startedAt: Date.now(),
      lastSpeedCheckTime: Date.now(),
      lastSpeedCheckBytes: 0,
    })

    store.addTransfer({
      id: meta.id,
      fileName: meta.name,
      fileSize: meta.size,
      fileType: meta.type,
      category: detectFileType(meta.type, meta.name),
      direction: 'receiving',
      peerId: sender.id,
      peerName: sender.name,
    })
  }

  /**
   * Menangani chunk data berkas yang diterima
   * @private
   */
  _handleIncomingChunk(fileId, chunkData, chunkIndex) {
    const fileState = this.receivingFiles.get(fileId)
    if (!fileState) return

    const store = useTransferStore.getState()

    fileState.chunks[chunkIndex] = chunkData
    fileState.receivedBytes += chunkData.byteLength || chunkData.size || 0
    fileState.receivedChunksCount += 1

    const progress = Math.min(100, Math.round((fileState.receivedBytes / fileState.meta.size) * 100))

    // Hitung kecepatan & ETA setiap 250ms
    const now = Date.now()
    const elapsedSinceCheck = (now - fileState.lastSpeedCheckTime) / 1000
    let speed = 0
    let eta = 0

    if (elapsedSinceCheck >= 0.25) {
      const bytesInInterval = fileState.receivedBytes - fileState.lastSpeedCheckBytes
      speed = bytesInInterval / elapsedSinceCheck
      const remainingBytes = fileState.meta.size - fileState.receivedBytes
      eta = speed > 0 ? remainingBytes / speed : 0

      fileState.lastSpeedCheckTime = now
      fileState.lastSpeedCheckBytes = fileState.receivedBytes
    }

    store.updateTransfer(fileId, {
      progress,
      transferredBytes: fileState.receivedBytes,
      status: 'transferring',
      ...(speed > 0 ? { speed, eta } : {}),
    })

    // Periksa apakah seluruh chunk sudah terkumpul lengkap
    if (fileState.receivedChunksCount >= fileState.meta.totalChunks) {
      const blob = new Blob(fileState.chunks, { type: fileState.meta.type })
      store.completeTransfer(fileId, blob)
      this.receivingFiles.delete(fileId)
    }
  }

  /**
   * Mengirim berkas ke perangkat target
   * @param {string} targetPeerId - ID perangkat penerima
   * @param {File} file - Berkas yang akan dikirim
   * @returns {Promise<string>} ID berkas yang ditransfer
   */
  async sendFile(targetPeerId, file) {
    const store = useTransferStore.getState()
    const targetPeer = store.peers.find((p) => p.id === targetPeerId)
    const peerName = targetPeer?.name || 'Perangkat Penerima'

    const meta = createFileMetadata(file)
    const fileId = meta.id

    // Catat ke daftar transfer pengirim
    store.addTransfer({
      id: fileId,
      fileName: meta.name,
      fileSize: meta.size,
      fileType: meta.type,
      category: detectFileType(meta.type, meta.name),
      direction: 'sending',
      peerId: targetPeerId,
      peerName,
    })

    this.activeTransfers.set(fileId, { isCancelled: false })

    // 1. Kirim metadata awal ke penerima
    const metaPayload = {
      type: PROTOCOL_TYPES.FILE_META,
      sender: store.myDevice,
      targetPeerId,
      meta,
    }

    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(metaPayload)
      } catch (err) {
        console.error('Gagal mengirim metadata file:', err)
      }
    }

    // 2. Kirim chunk demi chunk dengan kontrol kecepatan tinggi
    let offset = 0
    let chunkIndex = 0
    let transferredBytes = 0
    const totalSize = meta.size
    const startTime = Date.now()
    let lastTime = startTime
    let lastBytes = 0

    const sendLoop = async () => {
      while (offset < totalSize) {
        // Cek apakah transfer dibatalkan oleh pengguna
        const activeState = this.activeTransfers.get(fileId)
        if (!activeState || activeState.isCancelled) {
          store.cancelTransfer(fileId)
          this.activeTransfers.delete(fileId)

          if (this.broadcastChannel) {
            this.broadcastChannel.postMessage({
              type: PROTOCOL_TYPES.FILE_CANCEL,
              sender: store.myDevice,
              targetPeerId,
              fileId,
            })
          }
          return
        }

        const chunkEnd = Math.min(offset + CHUNK_SIZE, totalSize)
        const chunkBuffer = await readFileSlice(file, offset, chunkEnd)

        // Kirim chunk ke saluran komunikasi
        if (this.broadcastChannel) {
          try {
            this.broadcastChannel.postMessage({
              type: 'FILE_CHUNK_DATA',
              sender: store.myDevice,
              targetPeerId,
              fileId,
              chunkIndex,
              chunk: chunkBuffer,
            })
          } catch (err) {
            console.warn('Gagal kirim chunk buffer:', err)
          }
        }

        offset = chunkEnd
        chunkIndex += 1
        transferredBytes = offset

        const now = Date.now()
        const progress = Math.min(100, Math.round((transferredBytes / totalSize) * 100))
        const intervalElapsed = (now - lastTime) / 1000

        let speed = 0
        let eta = 0
        if (intervalElapsed >= 0.25 || offset >= totalSize) {
          const deltaBytes = transferredBytes - lastBytes
          speed = deltaBytes / intervalElapsed
          const remainingBytes = totalSize - transferredBytes
          eta = speed > 0 ? remainingBytes / speed : 0

          lastTime = now
          lastBytes = transferredBytes
        }

        store.updateTransfer(fileId, {
          progress,
          transferredBytes,
          status: offset >= totalSize ? 'completed' : 'transferring',
          ...(speed > 0 ? { speed, eta } : {}),
        })

        // Berikan jeda mikrosekon agar antrean event browser tetap responsif 60 FPS
        if (chunkIndex % 8 === 0) {
          await new Promise((r) => setTimeout(r, 4))
        }
      }

      // Selesai pengiriman berkas
      store.completeTransfer(fileId)
      this.activeTransfers.delete(fileId)
    }

    sendLoop().catch((err) => {
      console.error('Error saat transfer file:', err)
      store.updateTransfer(fileId, { status: 'failed' })
      this.activeTransfers.delete(fileId)
    })

    return fileId
  }

  /**
   * Membatalkan proses transfer yang sedang berjalan
   * @param {string} fileId - ID transfer berkas
   */
  cancelTransfer(fileId) {
    const activeState = this.activeTransfers.get(fileId)
    if (activeState) {
      activeState.isCancelled = true
    }
  }

  /**
   * Menutup semua saluran dan koneksi peer
   */
  destroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }

    if (this.broadcastChannel) {
      try {
        const store = useTransferStore.getState()
        this.broadcastChannel.postMessage({
          type: PROTOCOL_TYPES.DISCONNECT,
          sender: store.myDevice,
        })
        this.broadcastChannel.close()
      } catch { /* ignore */ }
      this.broadcastChannel = null
    }

    this.peerConnections.forEach((pc) => {
      try { pc.close() } catch { /* ignore */ }
    })
    this.peerConnections.clear()
    this.dataChannels.clear()
    this.receivingFiles.clear()
    this.activeTransfers.clear()
    this.isInitialized = false
  }
}

// Instance singleton
export const p2pFileTransfer = new P2PFileTransferService()
