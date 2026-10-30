/**
 * Layanan Komunikasi Penyimpanan Berkas Lokal (Laptop Storage Hub)
 * Menggunakan protokol HTTP lokal langsung melalui Wi-Fi tanpa memerlukan kuota internet.
 */

/**
 * Mendapatkan informasi IP lokal laptop pada jaringan Wi-Fi
 * @returns {Promise<{ ip: string, port: number, url: string }>}
 */
export async function getNetworkInfo() {
  try {
    const res = await fetch('/api/storage/network-info')
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn('Gagal mengambil network-info:', err)
  }

  // Fallback ke alamat browser saat ini
  const host = window.location.hostname || '127.0.0.1'
  const port = window.location.port ? Number(window.location.port) : 5173
  return {
    ip: host,
    port,
    url: `${window.location.protocol}//${host}:${port}`,
  }
}

/**
 * Mengambil daftar seluruh berkas yang tersimpan di laptop ini
 * @returns {Promise<Array<{ name: string, size: number, updatedAt: number, url: string }>>}
 */
export async function getStoredFiles() {
  try {
    const res = await fetch('/api/storage/files')
    if (res.ok) {
      const data = await res.json()
      return data.files || []
    }
  } catch (err) {
    console.warn('Gagal memuat daftar file lokal:', err)
  }
  return []
}

/**
 * Mengunggah berkas langsung ke storage laptop dengan pemantau progress
 * @param {File} file - Objek file dari input atau drag-and-drop
 * @param {Function} [onProgress] - Callback (percent, loadedBytes, totalBytes)
 * @returns {Promise<Object>}
 */
export function uploadFileToLaptop(file, onProgress = () => {}) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const encodedName = encodeURIComponent(file.name)
    xhr.open('POST', `/api/storage/upload?name=${encodedName}`, true)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100)
        onProgress(percent, e.loaded, e.total)
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText)
          resolve(res)
        } catch {
          resolve({ success: true, filename: file.name })
        }
      } else {
        reject(new Error(`Gagal mengunggah berkas (Status ${xhr.status})`))
      }
    }

    xhr.onerror = () => {
      reject(new Error('Koneksi jaringan lokal terputus'))
    }

    // Kirim stream file secara langsung sebagai body binary
    xhr.send(file)
  })
}

/**
 * Menghapus berkas dari storage laptop
 * @param {string} fileName - Nama file yang akan dihapus
 * @returns {Promise<boolean>}
 */
export async function deleteStoredFile(fileName) {
  try {
    const encodedName = encodeURIComponent(fileName)
    const res = await fetch(`/api/storage/files/${encodedName}`, {
      method: 'DELETE',
    })
    if (res.ok) {
      notifyLocalFileChange()
    }
    return res.ok
  } catch (err) {
    console.error('Gagal menghapus file:', err)
    return false
  }
}

/**
 * Berlangganan event real-time (Server-Sent Events & BroadcastChannel) saat ada file baru / dihapus
 * Menggantikan mekanisme polling HTTP berulang (0 unnecessary requests)
 * @param {Function} onFileChange - Callback yang dipanggil saat ada perubahan berkas
 * @returns {Function} Fungsi pembersih / unsubscribe
 */
export function subscribeToFileChanges(onFileChange = () => {}) {
  let eventSource = null

  try {
    eventSource = new EventSource('/api/storage/events')

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'files_changed') {
          onFileChange()
        }
      } catch {
        onFileChange()
      }
    }
  } catch (err) {
    console.warn('SSE tidak dapat diinisialisasi:', err)
  }

  // Listener tab browser lokal
  let channel = null
  try {
    channel = new BroadcastChannel('localhub_storage_stream')
    channel.onmessage = (msg) => {
      if (msg.data?.type === 'files_changed') {
        onFileChange()
      }
    }
  } catch {
    // Ignore BroadcastChannel errors
  }

  return () => {
    if (eventSource) {
      eventSource.close()
    }
    if (channel) {
      channel.close()
    }
  }
}

/**
 * Mengirim notifikasi lokal ke tab browser lain saat ada berkas diunggah
 */
export function notifyLocalFileChange() {
  try {
    const channel = new BroadcastChannel('localhub_storage_stream')
    channel.postMessage({ type: 'files_changed' })
    channel.close()
  } catch {
    // Ignore
  }
}


