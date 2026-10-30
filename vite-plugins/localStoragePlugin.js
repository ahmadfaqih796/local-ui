/* global process */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

/**
 * Plugin Vite untuk Layanan Penyimpanan Berkas Lokal (Wi-Fi Shared Storage Hub)
 * Mengubah laptop menjadi server penyimpanan lokal tanpa memerlukan kuota internet.
 * Dilengkapi Server-Sent Events (SSE) murni event-driven real-time (tanpa polling HTTP berulang).
 */
export function localStoragePlugin() {
  const storageDir = path.resolve(process.cwd(), 'storage_drive')
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true })
  }

  // Set koneksi aktif Server-Sent Events (SSE)
  const sseClients = new Set()

  function broadcastChange() {
    const payload = `data: ${JSON.stringify({ type: 'files_changed', timestamp: Date.now() })}\n\n`
    for (const client of sseClients) {
      try {
        client.write(payload)
      } catch {
        sseClients.delete(client)
      }
    }
  }

  // Watcher direktori fisik storage_drive (debounced 200ms)
  let watchTimer = null
  try {
    fs.watch(storageDir, (eventType, filename) => {
      if (filename && filename.startsWith('.')) return
      if (watchTimer) clearTimeout(watchTimer)
      watchTimer = setTimeout(() => {
        broadcastChange()
      }, 200)
    })
  } catch (err) {
    console.warn('Gagal memasang fs.watch:', err)
  }

  return {
    name: 'vite-local-storage-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlObj = new URL(req.url, 'http://localhost')

        // 0. Jalur Real-time Event Stream (Server-Sent Events)
        if (req.method === 'GET' && urlObj.pathname === '/api/storage/events') {
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          })
          res.write('retry: 3000\n\n')
          res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)

          sseClients.add(res)

          req.on('close', () => {
            sseClients.delete(res)
          })
          return
        }

        // 1. Informasi IP Jaringan Lokal (Wi-Fi)
        if (req.method === 'GET' && urlObj.pathname === '/api/storage/network-info') {
          const nets = os.networkInterfaces()
          let localIp = '127.0.0.1'

          // Cari interface Wi-Fi atau Ethernet non-internal
          for (const name of Object.keys(nets)) {
            for (const net of nets[name] || []) {
              if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254')) {
                if (
                  name.toLowerCase().includes('wi-fi') ||
                  name.toLowerCase().includes('wlan') ||
                  localIp === '127.0.0.1'
                ) {
                  localIp = net.address
                }
              }
            }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(
            JSON.stringify({
              ip: localIp,
              port: 5173,
              url: `http://${localIp}:5173`,
            })
          )
          return
        }

        // 2. Daftar File di Storage Laptop
        if (req.method === 'GET' && urlObj.pathname === '/api/storage/files') {
          try {
            const fileNames = fs.readdirSync(storageDir)
            const files = fileNames
              .filter((name) => !name.startsWith('.'))
              .map((name) => {
                const stat = fs.statSync(path.join(storageDir, name))
                return {
                  name,
                  size: stat.size,
                  updatedAt: stat.mtimeMs,
                  url: `/api/storage/download/${encodeURIComponent(name)}`,
                }
              })
              .sort((a, b) => b.updatedAt - a.updatedAt)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ files }))
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          }
          return
        }

        // 3. Upload File Langsung ke Storage Laptop (Stream Body Langsung ke Disk)
        if (req.method === 'POST' && urlObj.pathname === '/api/storage/upload') {
          const rawName = urlObj.searchParams.get('name') || `file_${Date.now()}`
          const filename = path.basename(decodeURIComponent(rawName))
          const targetPath = path.join(storageDir, filename)

          const writeStream = fs.createWriteStream(targetPath)
          req.pipe(writeStream)

          writeStream.on('finish', () => {
            broadcastChange()
            const stat = fs.statSync(targetPath)
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(
              JSON.stringify({
                success: true,
                file: {
                  name: filename,
                  size: stat.size,
                  updatedAt: stat.mtimeMs,
                  url: `/api/storage/download/${encodeURIComponent(filename)}`,
                },
              })
            )
          })

          writeStream.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: err.message }))
          })
          return
        }

        // 4. Download File dari Storage Laptop
        if (req.method === 'GET' && urlObj.pathname.startsWith('/api/storage/download/')) {
          const rawName = urlObj.pathname.replace('/api/storage/download/', '')
          const filename = path.basename(decodeURIComponent(rawName))
          const filePath = path.join(storageDir, filename)

          if (!fs.existsSync(filePath)) {
            res.writeHead(404, { 'Content-Type': 'text/plain' })
            res.end('File tidak ditemukan')
            return
          }

          const stat = fs.statSync(filePath)
          res.writeHead(200, {
            'Content-Type': 'application/octet-stream',
            'Content-Length': stat.size,
            'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
          })
          fs.createReadStream(filePath).pipe(res)
          return
        }

        // 5. Hapus File dari Storage Laptop
        if (req.method === 'DELETE' && urlObj.pathname.startsWith('/api/storage/files/')) {
          const rawName = urlObj.pathname.replace('/api/storage/files/', '')
          const filename = path.basename(decodeURIComponent(rawName))
          const filePath = path.join(storageDir, filename)

          if (fs.existsSync(filePath)) {
            try {
              fs.unlinkSync(filePath)
              broadcastChange()
            } catch { /* ignore */ }
          }

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ success: true }))
          return
        }

        next()
      })
    },
  }
}
