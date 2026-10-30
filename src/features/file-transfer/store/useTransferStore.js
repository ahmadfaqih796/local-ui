import { create } from 'zustand'
import { TRANSFER_STATUS } from '../constants/transferConstants'

/**
 * Menghasilkan nama perangkat default berdasarkan user agent
 * @returns {Object} { id, name, type }
 */
function getInitialDeviceInfo() {
  const ua = navigator.userAgent
  let type = 'laptop'
  let osName = 'Laptop'

  if (/Mobi|Android/i.test(ua)) {
    type = 'phone'
    osName = /Android/i.test(ua) ? 'Android Phone' : 'Smartphone'
  } else if (/iPad|Tablet/i.test(ua)) {
    type = 'tablet'
    osName = 'Tablet'
  } else if (/Windows/i.test(ua)) {
    type = 'laptop'
    osName = 'Windows PC'
  } else if (/Macintosh|Mac OS/i.test(ua)) {
    type = 'laptop'
    osName = 'MacBook'
  } else if (/Linux/i.test(ua)) {
    type = 'pc'
    osName = 'Linux PC'
  }

  const randomSuffix = Math.floor(100 + Math.random() * 900)
  const id = `peer_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`

  return {
    id,
    name: `${osName} #${randomSuffix}`,
    type,
  }
}

export const useTransferStore = create((set, get) => ({
  // Identitas perangkat pengguna
  myDevice: getInitialDeviceInfo(),

  // Kode ruangan pairing (6-digit acak)
  roomCode: Math.floor(100000 + Math.random() * 900000).toString(),

  // Daftar perangkat lain yang terhubung (Peers)
  peers: [],
  activePeerId: null,

  // Antrean transfer aktif (Key-Value atau Array)
  transfers: [],

  // Riwayat transfer yang sudah selesai
  history: [],

  // Aksi Identitas Perangkat
  setMyDeviceName: (name) => {
    set((state) => ({
      myDevice: { ...state.myDevice, name },
    }))
  },

  setRoomCode: (roomCode) => set({ roomCode }),

  // Aksi Manajemen Peer
  addPeer: (peer) => {
    set((state) => {
      const exists = state.peers.some((p) => p.id === peer.id)
      if (exists) {
        return {
          peers: state.peers.map((p) => (p.id === peer.id ? { ...p, ...peer } : p)),
        }
      }
      const updatedPeers = [...state.peers, peer]
      return {
        peers: updatedPeers,
        // Otomatis jadikan peer aktif jika belum ada
        activePeerId: state.activePeerId ?? peer.id,
      }
    })
  },

  updatePeer: (peerId, updates) => {
    set((state) => ({
      peers: state.peers.map((p) => (p.id === peerId ? { ...p, ...updates } : p)),
    }))
  },

  removePeer: (peerId) => {
    set((state) => {
      const remainingPeers = state.peers.filter((p) => p.id !== peerId)
      return {
        peers: remainingPeers,
        activePeerId: state.activePeerId === peerId ? (remainingPeers[0]?.id ?? null) : state.activePeerId,
      }
    })
  },

  setActivePeer: (activePeerId) => set({ activePeerId }),

  // Aksi Antrean Transfer
  addTransfer: (transfer) => {
    set((state) => ({
      transfers: [
        {
          id: transfer.id,
          fileName: transfer.fileName,
          fileSize: transfer.fileSize,
          fileType: transfer.fileType,
          category: transfer.category || 'other',
          direction: transfer.direction, // 'sending' | 'receiving'
          peerId: transfer.peerId,
          peerName: transfer.peerName || 'Perangkat Lain',
          progress: 0,
          transferredBytes: 0,
          speed: 0,
          eta: 0,
          status: TRANSFER_STATUS.PENDING,
          blob: null,
          blobUrl: null,
          startedAt: Date.now(),
          ...transfer,
        },
        ...state.transfers,
      ],
    }))
  },

  updateTransfer: (id, updates) => {
    set((state) => ({
      transfers: state.transfers.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  },

  completeTransfer: (id, blob = null) => {
    set((state) => {
      const transfer = state.transfers.find((t) => t.id === id)
      if (!transfer) return state

      const completedItem = {
        ...transfer,
        progress: 100,
        transferredBytes: transfer.fileSize,
        status: TRANSFER_STATUS.COMPLETED,
        finishedAt: Date.now(),
        blob: blob || transfer.blob,
        blobUrl: blob ? URL.createObjectURL(blob) : transfer.blobUrl,
      }

      return {
        transfers: state.transfers.filter((t) => t.id !== id),
        history: [completedItem, ...state.history],
      }
    })
  },

  cancelTransfer: (id) => {
    set((state) => {
      const transfer = state.transfers.find((t) => t.id === id)
      if (!transfer) return state

      const cancelledItem = {
        ...transfer,
        status: TRANSFER_STATUS.CANCELLED,
        finishedAt: Date.now(),
      }

      return {
        transfers: state.transfers.filter((t) => t.id !== id),
        history: [cancelledItem, ...state.history],
      }
    })
  },

  clearHistory: () => {
    const state = get()
    // Bebaskan memory object URLs
    state.history.forEach((item) => {
      if (item.blobUrl) {
        URL.revokeObjectURL(item.blobUrl)
      }
    })
    set({ history: [] })
  },
}))

