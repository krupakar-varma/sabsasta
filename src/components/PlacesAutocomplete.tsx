"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface Suggestion {
  place_id: string
  description: string
  main_text: string
  secondary_text: string
}

interface PlacesAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (value: string) => void
  placeholder?: string
  label?: string
  city?: string
  icon?: string
  className?: string
  showDetect?: boolean
}

export default function PlacesAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Enter location...",
  label,
  city,
  icon,
  className = "",
  showDetect = false,
}: PlacesAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detecting, setDetecting] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchSuggestions = useCallback(async (input: string) => {
    if (input.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    setLoading(true)
    try {
      const cityStr = city ? `, ${city}, India` : ", India"
      const query = input.includes(city || "") ? input : `${input}${cityStr}`
      const res = await fetch(
        `/api/places?input=${encodeURIComponent(query)}&city=${encodeURIComponent(city || "")}`
      )
      const data = await res.json()
      if (data.predictions) {
        setSuggestions(data.predictions.slice(0, 5))
        setShowSuggestions(true)
      }
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [city])

  const handleChange = (val: string) => {
    onChange(val)
    setActiveIndex(-1)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300)
  }

  const handleSelect = (suggestion: Suggestion) => {
    const short = suggestion.main_text
    onChange(short)
    onSelect?.(short)
    setSuggestions([])
    setShowSuggestions(false)
    setActiveIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault()
      handleSelect(suggestions[activeIndex])
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) return
    setDetecting(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords
          const res = await fetch(`/api/places?latlng=${latitude},${longitude}`)
          const data = await res.json()
          if (data.address) {
            onChange(data.address)
            onSelect?.(data.address)
          }
        } catch {
          // fallback
        } finally {
          setDetecting(false)
        }
      },
      () => setDetecting(false)
    )
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-[#FF6B35]/40 transition-colors">
        {label && (
          <div className="text-[10px] text-white/35 uppercase tracking-wider mb-1">{label}</div>
        )}
        <div className="flex items-center gap-2">
          {icon && <span className="text-sm shrink-0">{icon}</span>}
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => value.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder-white/30 min-w-0"
          />
          {loading && (
            <div className="shrink-0 h-3 w-3 rounded-full border-2 border-[#FF9500] border-t-transparent animate-spin" />
          )}
          {showDetect && (
            <button onClick={detectLocation} disabled={detecting}
              className="shrink-0 text-[#FF9500] text-sm hover:opacity-70 transition-opacity"
              title="Detect my location">
              {detecting ? "⏳" : "📍"}
            </button>
          )}
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 mt-1 rounded-xl border border-white/10 bg-[#0D0D1B] shadow-2xl shadow-black/50 overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={s.place_id}
              onMouseDown={(e) => { e.preventDefault(); handleSelect(s) }}
              onClick={() => handleSelect(s)}
              className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                i === activeIndex ? "bg-[#FF6B35]/15" : "hover:bg-white/5"
              } ${i !== 0 ? "border-t border-white/5" : ""}`}
            >
              <span className="text-white/30 mt-0.5 shrink-0 text-xs">📍</span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{s.main_text}</div>
                <div className="text-xs text-white/35 truncate mt-0.5">{s.secondary_text}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}