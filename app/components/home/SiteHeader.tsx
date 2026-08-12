"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export default function SiteHeader() {
  // A permanently fixed bar sits on top of every section below the intro — the
  // logo lands on the services copy, and content at the very bottom of the page
  // can never be scrolled out from under it. Hiding on the way down and
  // returning on the way up keeps the nav reachable without ever covering
  // anything the reader is moving toward.
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > 160 && y > lastY.current)
      lastY.current = y
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-transform duration-500 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      {/* The intro scrubs from a night skyline to a sunlit forest; without a
          scrim the white nav disappears against the bright frames. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 to-transparent" />

      <nav className="relative w-full px-6 md:px-14 lg:px-16 flex items-start justify-between">
        <div className="flex-1 mt-[20px] md:mt-[40px]">
          <a href="#contact" className="text-sm md:text-base opacity-70 hover:opacity-100 transition-opacity">
            Contact
          </a>
        </div>

        <div className="flex-1 flex justify-center mt-[6px] md:mt-[15px]">
          <Link href="/">
            <img
              src="/logo02.png"
              alt="NAIN"
              className="w-30 md:w-44 h-auto object-contain opacity-80"
              draggable={false}
            />
          </Link>
        </div>

        <div className="flex-1 flex justify-end mt-[20px] md:mt-[40px]">
          <a href="/work" className="text-sm md:text-base text-white/60 hover:text-white transition-colors">
            Work
          </a>
        </div>
      </nav>
    </header>
  )
}
