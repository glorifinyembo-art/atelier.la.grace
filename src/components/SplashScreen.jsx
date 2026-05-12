import logo from '/logo.png' // ✅ Import direct pour Vite

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[1000] bg-[#ff8c00] flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center">
        <div className="w-48 h-48 bg-white rounded-[40px] flex items-center justify-center overflow-hidden shadow-2xl border-4 border-white/20">
          <img 
            src={logo} 
            alt="Atelier la Grâce" 
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="mt-10 text-white font-black text-3xl tracking-[0.2em] uppercase text-center drop-shadow-lg">
          Atelier <br /> la Grâce
        </h1>
      </div>
      <div className="absolute bottom-20 flex gap-3">
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
      </div>
    </div>
  )
}
