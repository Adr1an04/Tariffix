import { getHtsCode } from './aiService'

export interface Rate {
  htsno: string;
  description: string;
  general: string;
  other: string;
  estimatedCost?: string;
}

// API endpoint - can be overridden in development
const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:3000/api/tariffs'

const calculateEstimatedCost = (price: string, currency: string, rate: string): string => {
  try {
    // Remove currency symbol and commas, convert to number
    const cleanPrice = price.replace(/[^0-9.-]+/g, '')
    const numericPrice = parseFloat(cleanPrice)
    
    // Remove % and convert to decimal
    const numericRate = parseFloat(rate.replace('%', '')) / 100
    
    if (isNaN(numericPrice) || isNaN(numericRate)) {
      return 'N/A'
    }
    
    const estimatedCost = numericPrice * numericRate
    
    // Format the cost with the same currency as the product
    return `${currency}${estimatedCost.toFixed(2)}`
  } catch (error) {
    console.error('Error calculating estimated cost:', error)
    return 'N/A'
  }
}

const generateAiEstimate = async (productTitle: string, productPrice?: string, currency?: string): Promise<Rate> => {
  try {
    // Get AI estimate using the improved getHtsCode function
    const estimate = await getHtsCode(productTitle, productPrice)

    return {
      htsno: estimate.htsCode,
      description: `AI Estimate: ${estimate.description}`,
      general: estimate.generalRate,
      other: estimate.otherRate,
      estimatedCost: productPrice && currency && estimate.generalRate ? calculateEstimatedCost(productPrice, currency, estimate.generalRate) : undefined
    }
  } catch (error) {
    console.error('Error generating AI estimate:', error)
    throw error
  }
}

export const fetchTariffRates = async (htsCode: string, productTitle: string, productPrice?: string, currency?: string): Promise<Rate[]> => {
  try {
    const response = await fetch(API_ENDPOINT)
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected an array')
    }

    // Filter rates by the first 4 digits of the HTS code
    const filteredRates = data.filter(rate => 
      rate.htsno.startsWith(htsCode.substring(0, 4))
    )

    if (filteredRates.length === 0) {
      throw new Error('No matching tariff rates found')
    }

    // Add estimated cost to each rate
    return filteredRates.map(rate => ({
      ...rate,
      estimatedCost: productPrice && currency ? calculateEstimatedCost(productPrice, currency, rate.general) : undefined
    }))
  } catch (error) {
    console.error('Error fetching rates:', error)
    // If the server is unavailable, generate AI estimate
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      console.warn('Server unavailable, generating AI estimate')
      const aiEstimate = await generateAiEstimate(productTitle, productPrice, currency)
      return [aiEstimate]
    }
    throw error
  }
} 
