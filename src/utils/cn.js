import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Menggabungkan class Tailwind dengan rapi tanpa konflik
 * @param  {...any} inputs - Daftar kelas CSS
 * @returns {string} String kelas CSS yang sudah digabung
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

