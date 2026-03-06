import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

const API_KEY = process.env.GOOGLE_MAPS_API_KEY

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("input")
  const latlng = request.nextUrl.searchParams.get("latlng")
  const city = request.nextUrl.searchParams.get("city") || ""

  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  // Reverse geocoding — get address from coordinates
  if (latlng) {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${API_KEY}`,
        { timeout: 5000 }
      )
      const result = res.data.results?.[0]
      if (result) {
        // Get neighborhood or sublocality
        const components = result.address_components
        const neighborhood = components.find((c: any) =>
          c.types.includes("sublocality_level_1") ||
          c.types.includes("sublocality") ||
          c.types.includes("neighborhood")
        )
        const address = neighborhood?.long_name || result.formatted_address.split(",")[0]
        return NextResponse.json({ address })
      }
      return NextResponse.json({ address: null })
    } catch {
      return NextResponse.json({ address: null })
    }
  }

  // Autocomplete — get suggestions for input
  if (input) {
    try {
      const cityBias = city ? `&components=country:in` : "&components=country:in"
      const locationBias = city ? `&region=in` : ""

      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${API_KEY}${cityBias}${locationBias}&language=en&types=geocode|establishment`,
        { timeout: 5000 }
      )

      const predictions = res.data.predictions?.map((p: any) => ({
        place_id: p.place_id,
        description: p.description,
        main_text: p.structured_formatting?.main_text || p.description.split(",")[0],
        secondary_text: p.structured_formatting?.secondary_text || p.description,
      })) || []

      return NextResponse.json({ predictions })
    } catch {
      return NextResponse.json({ predictions: [] })
    }
  }

  return NextResponse.json({ error: "Missing input or latlng" }, { status: 400 })
}