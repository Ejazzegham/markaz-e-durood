import type { ReactNode } from 'react'

// Shared decorative background used across every /quran page — mirrors the
// grid pattern, noise texture, gold glow orbs and corner brackets used on
// the Resources pages, so the Qur'an section feels native to the rest of the
// site rather than bolted on.
export default function QuranBackground({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-850 to-green-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 80px, #D4AF37 80px, #D4AF37 81px),
              repeating-linear-gradient(90deg, transparent, transparent 80px, #D4AF37 80px, #D4AF37 81px),
              repeating-linear-gradient(45deg, transparent, transparent 160px, rgba(212, 175, 55, 0.3) 160px, rgba(212, 175, 55, 0.3) 161px),
              repeating-linear-gradient(-45deg, transparent, transparent 160px, rgba(212, 175, 55, 0.3) 160px, rgba(212, 175, 55, 0.3) 161px)
            `,
          }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px',
        }}
      />

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/3 rounded-full blur-[150px]"></div>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-gold-500/10 rounded-tl-2xl pointer-events-none"></div>
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-gold-500/10 rounded-tr-2xl pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-gold-500/10 rounded-bl-2xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-gold-500/10 rounded-br-2xl pointer-events-none"></div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  )
}

// Small centred divider used at the bottom of most /quran pages, matching
// the Resources pages' closing ornament.
export function QuranBottomOrnament({ caption }: { caption?: string }) {
  return (
    <div className="mt-16">
      <div className="flex items-center justify-center gap-4">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-500/30"></div>
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-lg shadow-gold-500/50"></div>
          <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
        </div>
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-500/30"></div>
      </div>
      {caption && (
        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-600 tracking-wider">{caption}</p>
        </div>
      )}
    </div>
  )
}
