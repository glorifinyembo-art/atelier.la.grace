import { MagnifyingGlass } from '@phosphor-icons/react'

export default function SearchBar({ onSearch }) {
  return (
    <div className="px-6">
      <div className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-gray-100">
        <MagnifyingGlass size={20} className="text-gray-400" />
        <input
          onChange={(e) => onSearch(e.target.value)}
          className="w-full outline-none text-sm"
          placeholder="Rechercher un modèle..."
        />
      </div>
    </div>
  )
}
