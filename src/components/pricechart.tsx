interface ChartData {
    week: number
    amazon: number
    flipkart: number
  }
  
  interface Props {
    data: ChartData[]
  }
  
  const formatINR = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n)
  
  export default function PriceChart({ data }: Props) {
    const allPrices = data.flatMap((d) => [d.amazon, d.flipkart])
    const maxPrice = Math.max(...allPrices)
    const minPrice = Math.min(...allPrices)
    const range = maxPrice - minPrice || 1
  
    const getHeight = (price: number) =>
      Math.max(15, ((price - minPrice) / range) * 80)
  
    return (
      <div>
        <p className="text-xs text-white/40 mb-3">Price trend — last 8 weeks</p>
        <div className="flex items-end gap-1.5 h-20">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex items-end gap-0.5" title={`Week ${i + 1}`}>
              {/* Amazon bar */}
              <div
                className="flex-1 rounded-t-sm bg-[#FF6B35]/70"
                style={{ height: `${getHeight(d.amazon)}%` }}
                title={`Amazon: ${formatINR(d.amazon)}`}
              />
              {/* Flipkart bar */}
              <div
                className="flex-1 rounded-t-sm bg-[#2874F0]/70"
                style={{ height: `${getHeight(d.flipkart)}%` }}
                title={`Flipkart: ${formatINR(d.flipkart)}`}
              />
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-3 rounded-sm bg-[#FF6B35]/70" />
            <span className="text-[10px] text-white/40">Amazon</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-3 rounded-sm bg-[#2874F0]/70" />
            <span className="text-[10px] text-white/40">Flipkart</span>
          </div>
          <span className="ml-auto text-[10px] text-white/30">
            Low {formatINR(minPrice)} → High {formatINR(maxPrice)}
          </span>
        </div>
      </div>
    )
  }