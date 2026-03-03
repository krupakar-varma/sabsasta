/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

const RATES: Record<string, any> = {
  bengaluru: {
    Rapido: {
      Bike: { base: 15, perKm: 7, perMin: 0.5, minFare: 25, surge: 1.0 },
      Auto: { base: 20, perKm: 12, perMin: 0.75, minFare: 40, surge: 1.0 },
    },
    Ola: {
      Auto: { base: 25, perKm: 13, perMin: 1, minFare: 50, surge: 1.0 },
      Mini: { base: 40, perKm: 14, perMin: 1.25, minFare: 80, surge: 1.0 },
      Prime: { base: 50, perKm: 18, perMin: 1.5, minFare: 100, surge: 1.0 },
    },
    Uber: {
      Moto: { base: 15, perKm: 8, perMin: 0.75, minFare: 30, surge: 1.2 },
      Auto: { base: 25, perKm: 14, perMin: 1, minFare: 50, surge: 1.0 },
      Go: { base: 45, perKm: 16, perMin: 1.5, minFare: 90, surge: 1.3 },
      Premier: { base: 60, perKm: 22, perMin: 2, minFare: 120, surge: 1.0 },
    },
  },
  mumbai: {
    Rapido: {
      Bike: { base: 15, perKm: 6, perMin: 0.5, minFare: 25, surge: 1.0 },
      Auto: { base: 20, perKm: 11, perMin: 0.75, minFare: 40, surge: 1.0 },
    },
    Ola: {
      Auto: { base: 22, perKm: 12, perMin: 1, minFare: 45, surge: 1.0 },
      Mini: { base: 38, perKm: 13, perMin: 1.25, minFare: 75, surge: 1.0 },
      Prime: { base: 50, perKm: 17, perMin: 1.5, minFare: 100, surge: 1.0 },
    },
    Uber: {
      Moto: { base: 15, perKm: 7, perMin: 0.75, minFare: 28, surge: 1.1 },
      Auto: { base: 22, perKm: 13, perMin: 1, minFare: 45, surge: 1.0 },
      Go: { base: 42, perKm: 15, perMin: 1.5, minFare: 85, surge: 1.2 },
      Premier: { base: 58, perKm: 21, perMin: 2, minFare: 115, surge: 1.0 },
    },
  },
  delhi: {
    Rapido: {
      Bike: { base: 12, perKm: 6, perMin: 0.5, minFare: 22, surge: 1.0 },
      Auto: { base: 18, perKm: 11, perMin: 0.75, minFare: 35, surge: 1.0 },
    },
    Ola: {
      Auto: { base: 20, perKm: 12, perMin: 1, minFare: 40, surge: 1.0 },
      Mini: { base: 35, perKm: 13, perMin: 1.25, minFare: 70, surge: 1.0 },
      Prime: { base: 48, perKm: 17, perMin: 1.5, minFare: 95, surge: 1.0 },
    },
    Uber: {
      Moto: { base: 12, perKm: 7, perMin: 0.75, minFare: 25, surge: 1.1 },
      Auto: { base: 20, perKm: 12, perMin: 1, minFare: 40, surge: 1.0 },
      Go: { base: 40, perKm: 14, perMin: 1.5, minFare: 80, surge: 1.2 },
      Premier: { base: 55, perKm: 20, perMin: 2, minFare: 110, surge: 1.0 },
    },
  },
  hyderabad: {
    Rapido: {
      Bike: { base: 12, perKm: 6, perMin: 0.5, minFare: 22, surge: 1.0 },
      Auto: { base: 18, perKm: 11, perMin: 0.75, minFare: 35, surge: 1.0 },
    },
    Ola: {
      Auto: { base: 20, perKm: 11, perMin: 1, minFare: 40, surge: 1.0 },
      Mini: { base: 35, perKm: 13, perMin: 1.25, minFare: 70, surge: 1.0 },
      Prime: { base: 45, perKm: 16, perMin: 1.5, minFare: 90, surge: 1.0 },
    },
    Uber: {
      Moto: { base: 12, perKm: 7, perMin: 0.75, minFare: 25, surge: 1.1 },
      Auto: { base: 20, perKm: 11, perMin: 1, minFare: 40, surge: 1.0 },
      Go: { base: 38, perKm: 14, perMin: 1.5, minFare: 78, surge: 1.2 },
      Premier: { base: 52, perKm: 19, perMin: 2, minFare: 105, surge: 1.0 },
    },
  },
}

const PLATFORM_COLORS: Record<string, string> = {
  Uber: "#000000",
  Ola: "#EAB308",
  Rapido: "#22C55E",
}

const CATEGORY_MAP: Record<string, string> = {
  Bike: "bike",
  Moto: "bike",
  Auto: "auto",
  Mini: "cab",
  Go: "cab",
  Prime: "cab",
  Premier: "premium",
}

function isRushHour(): boolean {
  const hour = new Date().getHours()
  return (hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)
}

function calculatePrice(distanceKm: number, timeMin: number, rate: any, rush: boolean): number {
  const surge = rush ? rate.surge : 1.0
  const raw = rate.base + distanceKm * rate.perKm + timeMin * rate.perMin
  return Math.max(Math.round(raw * surge), rate.minFare)
}

async function getDistance(origin: string, destination: string): Promise<{ distanceKm: number; timeMin: number; fromName: string; toName: string } | null> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return null

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}&units=metric`
    const res = await axios.get(url, { timeout: 8000 })
    const data = res.data

    if (data.status !== "OK") return null

    const element = data.rows?.[0]?.elements?.[0]
    if (!element || element.status !== "OK") return null

    const distanceKm = element.distance.value / 1000
    const timeMin = Math.round(element.duration.value / 60)
    const fromName = data.origin_addresses?.[0] || origin
    const toName = data.destination_addresses?.[0] || destination

    return { distanceKm, timeMin, fromName, toName }
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const city = (request.nextUrl.searchParams.get("city") || "bengaluru").toLowerCase()
  const from = request.nextUrl.searchParams.get("from") || ""
  const to = request.nextUrl.searchParams.get("to") || ""
  const manualDistance = request.nextUrl.searchParams.get("distance")

  const cityRates = RATES[city]
  if (!cityRates) {
    return NextResponse.json({ success: false, error: `City ${city} not supported`, results: [] })
  }

  // Get real distance from Google Maps if from/to provided
  let distanceKm = parseFloat(manualDistance || "8")
  let timeMin = Math.round((distanceKm / 20) * 60)
  let fromName = from
  let toName = to

  if (from && to) {
    const fromCity = city === "bengaluru" ? "Bengaluru" : city.charAt(0).toUpperCase() + city.slice(1)
    const origin = `${from}, ${fromCity}, India`
    const destination = `${to}, ${fromCity}, India`
    const distanceData = await getDistance(origin, destination)

    if (distanceData) {
      distanceKm = distanceData.distanceKm
      timeMin = distanceData.timeMin
      fromName = distanceData.fromName
      toName = distanceData.toName
    }
  }

  const rush = isRushHour()
  const results: any[] = []

  for (const [platform, vehicles] of Object.entries(cityRates)) {
    for (const [vehicleType, rate] of Object.entries(vehicles as any)) {
      const price = calculatePrice(distanceKm, timeMin, rate, rush)
      const hasSurge = rush && (rate as any).surge > 1.0
      const surgeMultiplier = hasSurge ? (rate as any).surge : 1.0
      const basePrice = hasSurge ? Math.round(price / surgeMultiplier) : price

      results.push({
        id: `${platform}-${vehicleType}-${city}`,
        platform,
        type: `${platform} ${vehicleType}`,
        category: CATEGORY_MAP[vehicleType] || "cab",
        price,
        basePrice,
        hasSurge,
        surgeMultiplier,
        eta: Math.floor(Math.random() * 6) + 3,
        distanceKm: Math.round(distanceKm * 10) / 10,
        timeMin,
        platformColor: PLATFORM_COLORS[platform] || "#ffffff",
        bookLink:
          platform === "Uber"
            ? "https://m.uber.com/ul/"
            : platform === "Ola"
            ? "https://www.olacabs.com"
            : "https://rapido.bike",
      })
    }
  }

  results.sort((a, b) => a.price - b.price)
  if (results.length > 0) results[0].isCheapest = true

  return NextResponse.json({
    success: true,
    city,
    from: fromName,
    to: toName,
    distanceKm: Math.round(distanceKm * 10) / 10,
    timeMin,
    isRushHour: rush,
    results,
  })
}