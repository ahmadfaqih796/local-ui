import { Search } from 'lucide-react'
import { APP_CATEGORIES } from '../constants/appList'

/**
 * Filter Kategori & Pencarian Aplikasi Vending Machine
 */
export function VendingFilterTabs({
  selectedCategory = 'all',
  onSelectCategory = () => {},
  searchQuery = '',
  onSearchChange = () => {},
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Tab Filter Kategori */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {APP_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-surface text-slate-600 border border-slate-200/90 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Input Pencarian */}
      <div className="relative min-w-[200px] sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari aplikasi di wadah..."
          className="w-full rounded-xl border border-emerald-200 bg-surface pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:outline-hidden shadow-2xs"
        />
      </div>
    </div>
  )
}

