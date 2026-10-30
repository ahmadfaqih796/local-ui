import { useState } from 'react'
import { VendingHero } from '@/features/app-hub/components/VendingHero'
import { VendingFilterTabs } from '@/features/app-hub/components/VendingFilterTabs'
import { AppVendingCard } from '@/features/app-hub/components/AppVendingCard'
import { AuthPaymentPreviewModal } from '@/features/app-hub/components/AuthPaymentPreviewModal'
import { APP_REGISTRY } from '@/features/app-hub/constants/appList'
import { Store, Inbox } from 'lucide-react'

/**
 * Halaman Beranda Katalog Vending Machine (LocalHub App Store Showcase)
 * Menampilkan semua aplikasi utilitas yang dibuat dalam satu wadah mandiri
 */
export function AppHubPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isAuthPaymentModalOpen, setIsAuthPaymentModalOpen] = useState(false)

  // Filter aplikasi berdasarkan kategori & pencarian
  const filteredApps = APP_REGISTRY.filter((app) => {
    const matchesCategory =
      selectedCategory === 'all' || app.category === selectedCategory
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8 animate-in fade-in duration-300">
      {/* Banner Hero Konsep Vending Machine */}
      <VendingHero onOpenAuthPayment={() => setIsAuthPaymentModalOpen(true)} />

      {/* Kontrol Filter & Pencarian Aplikasi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-4 w-4 text-emerald-600" />
            <h2 className="text-base sm:text-lg font-bold text-text-primary">
              Katalog Dispenser Aplikasi ({filteredApps.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Local Machine v1.0
          </span>
        </div>

        <VendingFilterTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Grid Katalog Slot Aplikasi (Vending Slots) */}
      {filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app) => (
            <AppVendingCard
              key={app.id}
              app={app}
              onOpenDetails={() => setIsAuthPaymentModalOpen(true)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-emerald-300/80 bg-surface p-12 text-center space-y-3">
          <Inbox className="h-10 w-10 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-text-primary">
            Tidak Ada Aplikasi yang Cocok
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ditemukan aplikasi untuk kata kunci &quot;{searchQuery}&quot;. Coba cari kata kunci lain atau pilih kategori &quot;Semua Aplikasi&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('all')
              setSearchQuery('')
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 px-4 py-2 text-xs font-bold hover:bg-emerald-200 transition-all cursor-pointer"
          >
            Reset Pencarian
          </button>
        </div>
      )}

      {/* Modal Pratinjau Jalur Otentikasi & Payment Pak Paul */}
      <AuthPaymentPreviewModal
        isOpen={isAuthPaymentModalOpen}
        onClose={() => setIsAuthPaymentModalOpen(false)}
      />
    </div>
  )
}

