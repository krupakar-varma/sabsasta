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
    // Scrape both platforms in parallel
    const [amazonResults, flipkartResults] = await Promise.allSettled([
      scrapeAmazon(query),
      scrapeFlipkart(query),
    ])

    const amazon = amazonResults.status === "fulfilled" ? amazonResults.value : []
    const flipkart = flipkartResults.status === "fulfilled" ? flipkartResults.value : []

    const allResults = [...amazon, ...flipkart]

    return NextResponse.json({ success: true, results: allResults })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Could not fetch prices right now",
    })
  }
}

async function scrapeAmazon(query: string) {
  const url = `https://www.amazon.in/s?k=${encodeURIComponent(query)}`

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-IN,en;q=0.9",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Cache-Control": "no-cache",
    },
    timeout: 10000,
  })

  const $ = cheerio.load(response.data)
  const products: any[] = []

  $('[data-component-type="s-search-result"]').each((i, element) => {
    if (i >= 5) return

    const name = $(element).find("h2 span").text().trim()
    const priceWhole = $(element).find(".a-price-whole").first().text().replace(/[^0-9]/g, "").trim()
    const image = $(element).find(".s-image").attr("src")
    const asin = $(element).attr("data-asin")
    const relativeLink = $(element).find("h2 a").attr("href")

    let link = ""
    if (asin) {
      link = `https://www.amazon.in/dp/${asin}`
    } else if (relativeLink) {
      link = relativeLink.startsWith("http") ? relativeLink : `https://www.amazon.in${relativeLink}`
    }

    const rating = $(element).find(".a-icon-star-small .a-icon-alt").first().text().split(" ")[0]

    if (name && priceWhole) {
      products.push({
        name,
        price: parseInt(priceWhole),
        formattedPrice: `₹${parseInt(priceWhole).toLocaleString("en-IN")}`,
        image: image || "",
        link,
        platform: "Amazon",
        rating: rating || "N/A",
      })
    }
  })

  return products
}

async function scrapeFlipkart(query: string) {
  const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-IN,en;q=0.9",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Cache-Control": "no-cache",
    },
    timeout: 10000,
  })

  const $ = cheerio.load(response.data)
  const products: any[] = []

  // Flipkart uses different class structures — try multiple selectors
  const selectors = [
    "div[data-id]",
    "._1AtVbE",
    "._13oc-S",
  ]

  let found = false
  for (const selector of selectors) {
    $(selector).each((i, element) => {
      if (found && i >= 5) return

      const name =
        $(element).find("._4rR01T").text().trim() ||
        $(element).find(".s1Q9rs").text().trim() ||
        $(element).find("a[title]").attr("title") ||
        $(element).find(".IRpwTa").text().trim()

      const priceText =
        $(element).find("._30jeq3").first().text().trim() ||
        $(element).find("._1_WHN1").first().text().trim()

      const priceNum = priceText.replace(/[^0-9]/g, "")

      const image =
        $(element).find("img._396cs4").attr("src") ||
        $(element).find("img._2r_T1I").attr("src") ||
        $(element).find("img").first().attr("src")

      const relLink =
        $(element).find("a._1fQZEK").attr("href") ||
        $(element).find("a.s1Q9rs").attr("href") ||
        $(element).find("a._2rpwqI").attr("href") ||
        $(element).find("a").first().attr("href")

      const link = relLink
        ? relLink.startsWith("http") ? relLink : `https://www.flipkart.com${relLink}`
        : ""

      const ratingText = $(element).find("._3LWZlK").first().text().trim()

      if (name && priceNum && parseInt(priceNum) > 0) {
        products.push({
          name,
          price: parseInt(priceNum),
          formattedPrice: `₹${parseInt(priceNum).toLocaleString("en-IN")}`,
          image: image || "",
          link,
          platform: "Flipkart",
          rating: ratingText || "N/A",
        })
        found = true
      }

      if (products.length >= 5) return false
    })
    if (products.length >= 3) break
  }

  return products
}