type RideService = {
    base: number
    perKm: number
    perMin: number
  }
  
  type RideEstimate = {
    min: number
    max: number
  }
  
  type RideResults = {
    uber: RideEstimate
    ola: RideEstimate
    rapido: RideEstimate
  }
  
  export function estimateRide(
    distance: number,
    time: number,
    hour: number
  ): RideResults {
  
    const services: Record<string, RideService> = {
      uber: { base: 40, perKm: 10, perMin: 1.5 },
      ola: { base: 50, perKm: 11, perMin: 1.5 },
      rapido: { base: 25, perKm: 4, perMin: 1 }
    }
  
    let surge = 1
  
    // surge rules
    if (hour >= 7 && hour <= 10) surge = 1.3
    else if (hour >= 17 && hour <= 20) surge = 1.4
    else if (hour >= 22 || hour <= 2) surge = 1.5
  
    const results: any = {}
  
    Object.entries(services).forEach(([key, s]) => {
  
      const price =
        (s.base + distance * s.perKm + time * s.perMin) * surge
  
      results[key] = {
        min: Math.round(price * 0.9),
        max: Math.round(price * 1.1)
      }
  
    })
  
    return results as RideResults
  }