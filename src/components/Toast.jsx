import { CheckCircle } from '@phosphor-icons/react'
import { useStore } from '../context/StoreContext'

export default function Toast() {
  const { toastMessage } = useStore()

  if (!toastMessage) return null

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg z-[9999] flex items-center gap-2 text-sm font-bold animate-bounce">
      <CheckCircle size={20} weight="fill" />
      {toastMessage}
    </div>
  )
}
