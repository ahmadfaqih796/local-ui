import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'

/**
 * Global Zustand Store untuk Otentikasi, Identitas Mesin, & Saldo Token Vending
 * Disimpan secara lokal (localStorage) agar status tetap terjaga saat refresh
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Data Pengguna & Identitas Perangkat Laptop
      user: {
        id: 'DEV-8821',
        name: 'Tamu Lokal',
        machineId: 'LAPTOP-HW-9942',
        role: 'guest', // 'guest' | 'pro'
        isPro: false,
      },

      // Saldo Dompet Token Vending (Default awal: 5 Token Percobaan)
      tokens: 5,

      // Daftar ID Aplikasi yang sudah terbuka (Unlocked)
      unlockedApps: ['voice-changer', 'shared-storage', 'p2p-transfer'],

      // Status Modal Pembayaran QRIS Global
      isPaymentModalOpen: false,
      paymentIntent: null, // { type: 'tokens' | 'pro', title: '', price: 0, tokensCount: 0 }

      // Buka Modal Pembayaran QRIS
      openPaymentModal: (intent = { type: 'tokens', title: 'Top-up 10 Koin Vending', price: 15000, tokensCount: 10 }) => {
        set({
          isPaymentModalOpen: true,
          paymentIntent: intent,
        })
      },

      // Tutup Modal Pembayaran
      closePaymentModal: () => {
        set({ isPaymentModalOpen: false, paymentIntent: null })
      },

      // Aksi Top-up Saldo Token (Simulasi Pembayaran Berhasil)
      topupTokens: (amount = 10, price = 15000) => {
        set((state) => ({
          tokens: state.tokens + amount,
          isPaymentModalOpen: false,
          paymentIntent: null,
        }))
        toast.success(`Pembayaran Rp ${price.toLocaleString('id-ID')} Berhasil!`, {
          description: `Selamat, +${amount} Koin Vending telah ditambahkan ke dompet Anda.`,
        })
      },

      // Aksi Upgrade ke Pro Lifetime Pass
      upgradeToPro: (price = 49000) => {
        set((state) => ({
          user: {
            ...state.user,
            role: 'pro',
            isPro: true,
            name: 'LocalHub Pro Member',
          },
          tokens: state.tokens + 20,
          unlockedApps: Array.from(new Set([...state.unlockedApps, 'ai-transcriber'])),
          isPaymentModalOpen: false,
          paymentIntent: null,
        }))
        toast.success(`Selamat! Akun Pro Aktif (Rp ${price.toLocaleString('id-ID')})`, {
          description: 'Semua aplikasi premium vending machine kini terbuka tanpa batas.',
        })
      },

      // Konsumsi Koin Token untuk Menjalankan Fitur
      consumeToken: (amount = 1, featureName = 'Fitur') => {
        const currentTokens = get().tokens
        const isPro = get().user.isPro

        // Akun Pro tidak menghabiskan token
        if (isPro) return true

        if (currentTokens >= amount) {
          set((state) => ({ tokens: state.tokens - amount }))
          toast.info(`1 Koin Terpakai untuk ${featureName}`, {
            description: `Sisa saldo koin Anda: ${currentTokens - amount} Koin`,
          })
          return true
        }

        toast.error('Saldo Koin Vending Tidak Cukup', {
          description: 'Silakan isi ulang koin atau tukar voucher aktivitas platform.',
          action: {
            label: 'Buka Dompet',
            onClick: () => get().openPaymentModal(),
          },
        })
        return false
      },

      // Aksi Klaim / Tukar Voucher Aktivitas Platform (Integrasi Ekosistem JC / Pak Paul)
      redeemVoucher: (rawCode) => {
        const code = (rawCode || '').trim().toUpperCase()
        if (!code) {
          toast.error('Kode Voucher Kosong', {
            description: 'Silakan masukkan kode voucher atau token integrasi platform.',
          })
          return { success: false, message: 'Kode kosong' }
        }

        // 1. Lisensi Pro Eksklusif Komunitas / Platform (Contoh: JCPRO, PAKPAUL, LOCALPRO, TRAINERJC)
        if (['JCPRO', 'PAKPAUL', 'LOCALPRO', 'TRAINERJC'].includes(code)) {
          set((state) => ({
            user: {
              ...state.user,
              role: 'pro',
              isPro: true,
              name: 'Mitra Platform JC',
            },
            tokens: state.tokens + 25,
            unlockedApps: Array.from(new Set([...state.unlockedApps, 'ai-transcriber'])),
            isPaymentModalOpen: false,
            paymentIntent: null,
          }))
          toast.success(`🎉 Voucher "${code}" Diterima!`, {
            description: 'Selamat! Akun Anda aktif sebagai Lisensi PRO Komunitas (+25 Koin Vending).',
          })
          return { success: true, type: 'pro', tokens: 25 }
        }

        // 2. Token Aktivitas Belajar / Koin Reward Platform (Contoh: AKTIVITAS10, DEMO10, KOIN10, VENDING2026, PLATFORM10)
        if (['AKTIVITAS10', 'DEMO10', 'KOIN10', 'VENDING2026', 'PLATFORM10'].includes(code)) {
          set((state) => ({
            tokens: state.tokens + 10,
            isPaymentModalOpen: false,
            paymentIntent: null,
          }))
          toast.success(`🎉 Voucher "${code}" Berhasil Diklaim!`, {
            description: '+10 Koin Aktivitas Vending telah ditambahkan ke dompet Anda.',
          })
          return { success: true, type: 'tokens', tokens: 10 }
        }

        // 3. Trial Bonus Starter (Contoh: COIN5, TRIAL5, FREEDEMO, WELCOME)
        if (['COIN5', 'TRIAL5', 'FREEDEMO', 'WELCOME'].includes(code)) {
          set((state) => ({
            tokens: state.tokens + 5,
            isPaymentModalOpen: false,
            paymentIntent: null,
          }))
          toast.success(`🎉 Voucher Bonus "${code}" Berhasil!`, {
            description: '+5 Koin Uji Coba telah masuk ke saldo dompet Anda.',
          })
          return { success: true, type: 'tokens', tokens: 5 }
        }

        toast.error('Kode Voucher Tidak Valid', {
          description: 'Kode voucher atau kupon aktivitas platform tidak terdaftar atau sudah kedaluwarsa.',
        })
        return { success: false, message: 'Kode voucher tidak valid' }
      },

      // Reset State untuk Kebutuhan Demo Ulang ke Pak Paul
      resetDemo: () => {
        set({
          user: {
            id: 'DEV-8821',
            name: 'Tamu Lokal',
            machineId: 'LAPTOP-HW-9942',
            role: 'guest',
            isPro: false,
          },
          tokens: 5,
          unlockedApps: ['voice-changer', 'shared-storage', 'p2p-transfer'],
          isPaymentModalOpen: false,
          paymentIntent: null,
        })
        toast.info('Status akun & dompet di-reset ke Mode Tamu awal (5 Koin).')
      },
    }),
    {
      name: 'localhub_auth_storage',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        unlockedApps: state.unlockedApps,
      }),
    }
  )
)

