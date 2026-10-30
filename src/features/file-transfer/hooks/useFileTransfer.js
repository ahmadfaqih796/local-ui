import { useEffect } from 'react'
import { toast } from 'sonner'
import { useTransferStore } from '../store/useTransferStore'
import { p2pFileTransfer } from '../services/p2pFileTransfer'
import { formatBytes } from '../utils/formatBytes'

/**
 * Custom Hook untuk integrasi antarmuka komponen dengan mesin transfer file P2P
 */
export function useFileTransfer() {
  const myDevice = useTransferStore((s) => s.myDevice)
  const roomCode = useTransferStore((s) => s.roomCode)
  const peers = useTransferStore((s) => s.peers)
  const activePeerId = useTransferStore((s) => s.activePeerId)
  const transfers = useTransferStore((s) => s.transfers)
  const history = useTransferStore((s) => s.history)

  const setMyDeviceName = useTransferStore((s) => s.setMyDeviceName)
  const setActivePeer = useTransferStore((s) => s.setActivePeer)
  const setRoomCode = useTransferStore((s) => s.setRoomCode)
  const cancelTransfer = useTransferStore((s) => s.cancelTransfer)
  const clearHistory = useTransferStore((s) => s.clearHistory)

  // Inisialisasi service P2P saat hook pertama kali dimuat
  useEffect(() => {
    p2pFileTransfer.init()
  }, [])

  /**
   * Mengirim berkas ke perangkat yang dipilih
   * @param {File|File[]} files - Berkas tunggal atau array berkas
   * @param {string} [targetPeerId] - ID perangkat penerima (default: activePeerId)
   */
  const sendFiles = async (files, targetPeerId = null) => {
    const targetId = targetPeerId || activePeerId

    if (!targetId) {
      toast.error('Pilih perangkat tujuan terlebih dahulu!', {
        description: 'Tunggu perangkat lain terhubung di jaringan Wi-Fi / LAN yang sama.',
      })
      return
    }

    const fileList = Array.isArray(files) ? files : [files]

    for (const file of fileList) {
      toast.info(`Memulai pengiriman: ${file.name}`, {
        description: `Ukuran: ${formatBytes(file.size)}`,
      })
      await p2pFileTransfer.sendFile(targetId, file)
    }
  }

  /**
   * Membatalkan transfer berkas
   * @param {string} fileId - ID transfer
   */
  const handleCancelTransfer = (fileId) => {
    p2pFileTransfer.cancelTransfer(fileId)
    cancelTransfer(fileId)
    toast.warning('Transfer berkas dibatalkan')
  }

  return {
    myDevice,
    roomCode,
    peers,
    activePeerId,
    transfers,
    history,
    setMyDeviceName,
    setActivePeer,
    setRoomCode,
    sendFiles,
    cancelTransfer: handleCancelTransfer,
    clearHistory,
  }
}

