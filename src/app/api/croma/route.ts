/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server"
import axios from "axios"
import * as cheerio from "cheerio"

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")
  if (!query) {
    return NextResponse.json({ success: false, error: "No query provided" })
  }

  try {
    const url = `https://www.croma.com/searchB?q=${encodeURIComponent(query)}%3Arelevance&text=${encodeURIComponent(query)}`

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.9",
        "Referer": "https://www.google.com/",
      },
      timeout: 12000,
    })

    const $ = cheerio.load(response.data)

    // Get all class names from the page to find product containers
    const allClasses: string[] = []
    $("[class]").each((i, el) => {
      if (i > 100) return false
      const cls = $(el).attr("class") || ""
      cls.split(" ").forEach(c => {
        if (c && !allClasses.includes(c)) allClasses.push(c)
      })
    })

    // Get sample of HTML around price-looking elements
    const priceHtml = $("[class*=price], [class*=Price]").first().parent().html()?.slice(0, 300)
    const productHtml = $("[class*=product], [class*=Product]").first().html()?.slice(0, 300)

    return NextResponse.json({
      debug: true,
      totalElements: $("*").length,
      classes: allClasses.slice(0, 50),
      priceHtml,
      productHtml,
      title: $("title").text(),
    })

  } catch (error: any) {
    return NextResponse.json({ error: error.message })
  }
}