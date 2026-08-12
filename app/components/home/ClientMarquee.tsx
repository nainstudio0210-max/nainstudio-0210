import type { Client } from "../../data/clients"

export default function ClientMarquee({ clients }: { clients: Client[] }) {
  if (clients.length === 0) return null

  // Two identical passes so the -50% slide loops seamlessly.
  const row = [...clients, ...clients]

  return (
    <section className="py-20 md:py-28 border-t border-white/10 overflow-hidden">
      <div className="px-6 md:px-14 lg:px-16">
        <span className="text-xs tracking-[0.2em] text-[#D9772B]">CLIENTS</span>
        <h2 className="mt-4 text-2xl md:text-4xl font-light tracking-[-0.02em] mb-14 md:mb-20">
          함께한 파트너
        </h2>
      </div>

      <div className="relative">
        {/* Feathered edges so logos enter and leave instead of popping. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-black to-transparent" />

        <div className="marquee-track flex w-max items-center gap-16 md:gap-24">
          {row.map((c, i) => (
            <div
              key={`${c.name}-${i}`}
              className="flex h-12 shrink-0 items-center justify-center"
              aria-hidden={i >= clients.length}
            >
              {c.logo ? (
                <img
                  src={c.logo}
                  alt={c.name}
                  style={c.scale ? { height: `${c.scale * 100}%` } : undefined}
                  // The marks are already keyed to flat white, so opacity alone
                  // carries the hover — there is no colour left to restore.
                  className="h-full w-auto object-contain opacity-45 transition-opacity hover:opacity-95"
                  draggable={false}
                />
              ) : (
                <span className="whitespace-nowrap text-base md:text-lg tracking-[0.12em] text-white/45 transition hover:text-white/85">
                  {c.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
