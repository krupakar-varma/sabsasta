import { PlatformPrice } from "@/types"

interface Props {
  platform: PlatformPrice
  showBuyButton?: boolean
}

const platformColors: Record<string, string> = {
  Amazon: "text-[#FF9900]",
  Flipkart: "text-[#2874F0]",
  Meesho: "text-[#F43397]",
  JioMart: "text-[#006DB7]",
  Swiggy: "text-[#FC8019]",
  Zomato: "text-[#CB202D]",
  Magicpin: "text-[#7C3AED]",
  Blinkit: "text-[#F8C301]",
  Zepto: "text-[#8B5CF6]",
  BigBasket: "text-[#84CC16]",
  EaseMyTrip: "text-[#00A0E3]",
  MakeMyTrip: "text-[#E03546]",
  GoIbibo: "text-[#00BCD4]",
  Cleartrip: "text-[#F05A28]",
}

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n)

export default function PriceCard({ platform, showBuyButton = true }: Props) {
  const savings = platform.originalPrice
    ? platform.originalPrice - platform.price
    : 0

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        platform.isBest
          ? "border-[#00C875]/40 bg-[#00C875]/5"
          : "border-white/7 bg-white/2 hover:border-white/15"
      }`}
    >
      {/* Platform name + best badge */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`font-semibold text-sm ${
            platformColors[platform.platform] || "text-white"
          }`}
        >
          {platform.platform}
        </span>
        {platform.isBest && (
          <span className="rounded-full bg-[#00C875]/15 px-2 py-0.5 text-[10px] font-bold text-[#00C875]">
            BEST DEAL
          </span>
        )}
      </div>

      {/* Price */}
      <div className="mb-1">
        <span
          className={`text-2xl font-bold ${
            platform.isBest ? "text-[#00C875]" : "text-white"
          }`}
        >
          {formatINR(platform.price)}
        </span>
      </div>

      {/* Original price + savings */}
      {platform.originalPrice && savings > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-white/30 line-through">
            {formatINR(platform.originalPrice)}
          </span>
          <span className="text-xs text-[#FF9500] font-semibold">
            Save {formatINR(savings)}
          </span>
        </div>
      )}

      {/* Delivery info */}
      {platform.deliveryTime && (
        <p className="text-xs text-white/40 mb-3">
          🚚 {platform.deliveryTime}
          {platform.deliveryFee === 0 ? " · Free delivery" : ` · ₹${platform.deliveryFee} delivery`}
        </p>
      )}

      {/* Buy button */}
      {showBuyButton && (
        <a
          href={platform.link}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full rounded-lg py-2 text-center text-sm font-bold transition-opacity hover:opacity-90 ${
            platform.isBest
              ? "bg-gradient-to-r from-[#FF6B35] to-[#FF9500] text-white"
              : "bg-white/8 text-white/70 hover:text-white"
          }`}
        >
          Buy on {platform.platform} →
        </a>
      )}
    </div>
  )
}