import { useStore } from '../context/StoreContext'

export default function CurrencySelector() {
  const { currency, changeCurrency } = useStore()

  return (
    <div className="px-6 mb-4 flex justify-end">
      <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-100 flex gap-1">
        <button
          onClick={() => changeCurrency('CDF')}
          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
            currency === 'CDF' ? 'bg-black text-white' : 'text-gray-400'
          }`}
        >
          FC
        </button>
        <button
          onClick={() => changeCurrency('USD')}
          className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
            currency === 'USD' ? 'bg-black text-white' : 'text-gray-400'
          }`}
        >
          USD $
        </button>
      </div>
    </div>
  )
}
