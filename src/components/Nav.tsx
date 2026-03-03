"use client"

import Link from "next/link"
import { useState } from "react"

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#07070F]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF9500] text-white font-bold text-lg">
            S
          </div>
          <div>
            <p className="text-sm font-bold leading-4 text-white">SabSasta</p>
            <p className="text-xs leading-4 text-white/40">Sab Kuch Sabse Sasta</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/compare" className="text-white/50 hover:text-white transition-colors">
            Products
          </Link>
          <Link href="/food" className="text-white/50 hover:text-white transition-colors">
            Food
          </Link>
          <Link href="/rides" className="text-white/50 hover:text-white transition-colors">
            Rides
          </Link>
          <Link href="/flights" className="text-white/50 hover:text-white transition-colors">
            Flights
          </Link>
          <Link href="/grocery" className="text-white/50 hover:text-white transition-colors">
            Grocery
          </Link>
          <Link href="/deals" className="text-white/50 hover:text-white transition-colors">
  🔥 Deals
</Link>

        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <button className="hidden rounded-xl border border-white/10 px-3 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white transition-all md:block">
            🔔 Alerts
          </button>
          <button className="rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF9500] px-4 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity">
            Sign In
          </button>

          {/* Mobile hamburger */}
          <button
            className="ml-1 rounded-lg p-2 text-white/60 hover:text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/5 bg-[#0D0D1B] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4 text-sm">
            <Link href="/compare" className="text-white/60 hover:text-white" onClick={() => setMenuOpen(false)}>
              🛍️ Products
            </Link>
            <Link href="/food" className="text-white/60 hover:text-white" onClick={() => setMenuOpen(false)}>
              🍕 Food
            </Link>
            <Link href="/rides" className="text-white/60 hover:text-white" onClick={() => setMenuOpen(false)}>
              🚗 Rides
            </Link>
            <Link href="/flights" className="text-white/60 hover:text-white" onClick={() => setMenuOpen(false)}>
              ✈️ Flights
            </Link>
            <Link href="/grocery" className="text-white/60 hover:text-white" onClick={() => setMenuOpen(false)}>
              🛒 Grocery
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}