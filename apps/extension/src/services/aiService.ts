import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../config';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function queryAI(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    
    // Format the prompt to specifically request 4-digit HTS code
    const formattedPrompt = `Give me ONLY the first 4 digits of the HTS code (Harmonized Tariff Schedule code) for this product: ${prompt}. Return ONLY the 4-digit number, no explanation or additional text.`;
    
    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response and ensure we get exactly 4 digits
    const cleanedText = text.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    const firstFourDigits = cleanedText.slice(0, 4);
    
    if (firstFourDigits.length !== 4) {
      throw new Error('Invalid HTS code format - expected 4 digits');
    }
    
    return firstFourDigits;
  } catch (error) {
    console.error('Error querying AI:', error);
    throw error;
  }
}

export interface TariffEstimate {
  htsCode: string;
  description: string;
  generalRate: string;
  otherRate: string;
  retailPrice: string;
  tariffAmount: string;
  basePrice: string;
  countryOfOrigin?: string;
}

async function findManufacturerOrigin(manufacturer: string): Promise<string | null> {
  try {
    const prompt = `You are a trade research expert. For the manufacturer "${manufacturer}", determine their most likely country of origin.
    Rules:
    1. If you can find a clear country of origin, return ONLY the country name
    2. If the manufacturer appears to be Chinese (based on name pattern or research), return "China"
    3. If you cannot determine with confidence, return "Unknown"
    4. Return ONLY the country name or "Unknown", no other text or explanation

    Example responses:
    - "China"
    - "United States"
    - "Unknown"`;

    const country = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    }, 2, 1000); // 2 retries with 1 second base delay
    
    return country === "Unknown" ? null : country;
  } catch (error) {
    console.error('Error finding manufacturer origin after retries:', error);
    return null;
  }
}

// Retry utility with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Check if it's a retryable error
      const isRetryable = error instanceof Error && (
        error.message.includes('503') ||
        error.message.includes('overloaded') ||
        error.message.includes('quota') ||
        error.message.includes('rate limit') ||
        error.message.includes('timeout')
      );
      
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }
      
      // Calculate delay with exponential backoff and jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      console.log(`Attempt ${attempt + 1} failed, retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

export const getHtsCode = async (productTitle: string, price?: string, manufacturer?: string): Promise<TariffEstimate> => {
  try {
    // First, try to find the country of origin if manufacturer is provided
    const originCountry = manufacturer ? await findManufacturerOrigin(manufacturer) : null;

    const prompt = `You are a customs and tariff expert. For the following product, provide a comprehensive tariff analysis:

Product: ${productTitle}
${price ? `Price: $${price}` : ''}
${originCountry ? `Country of Origin: ${originCountry}` : ''}

Rules:
1. Return a JSON object with the following structure:
{
  "htsCode": "4-digit HTS code",
  "description": "Official HTS code description",
  "generalRate": "Percentage as decimal (e.g. 0.20 for 20%)",
  "otherRate": "Percentage as decimal (e.g. 0.08 for 8%)",
  "retailPrice": "Full retail price with $ symbol",
  "tariffAmount": "Calculated tariff amount with $ symbol",
  "basePrice": "Price before tariff with $ symbol",
  "countryOfOrigin": "Determined country of origin or null"
}

2. For electronics and tools, use codes from Chapter 84-85
3. For luggage and bags, use code 4202
4. For other products, use the most specific code that matches the product's primary function
5. Calculate tariff amount using the general rate
6. Base price should be retail price minus tariff amount
7. If the product is from China, use the higher general rate due to Section 301 tariffs

Example response for luggage priced at $100 from China:
{
  "htsCode": "4202",
  "description": "Trunks, suitcases, vanity cases, attache cases, briefcases, and similar containers",
  "generalRate": "0.20",
  "otherRate": "0.175",
  "retailPrice": "$100.00",
  "tariffAmount": "$20.00",
  "basePrice": "$80.00",
  "countryOfOrigin": "China"
}

Return ONLY the JSON object, no additional text, no markdown formatting, no code blocks.`

    // Use retry mechanism for the AI call
    const estimate = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Raw AI response:', text);
      
      // Clean up the response text - try multiple approaches
      let cleanedText = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      // Try to extract JSON from the response
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedText = jsonMatch[0];
      }
      
      console.log('Cleaned AI response:', cleanedText);
      
      // Try to parse the JSON response
      let parsedEstimate: TariffEstimate;
      try {
        parsedEstimate = JSON.parse(cleanedText) as TariffEstimate;
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Failed to parse text:', cleanedText);
        
        // Try to create a fallback response if parsing fails
        const fallbackEstimate: TariffEstimate = {
          htsCode: "9999",
          description: "General merchandise - unable to classify",
          generalRate: "0.10",
          otherRate: "0.05",
          retailPrice: price ? `$${price}` : "$0.00",
          tariffAmount: price ? `$${(parseFloat(price) * 0.10).toFixed(2)}` : "$0.00",
          basePrice: price ? `$${(parseFloat(price) * 0.90).toFixed(2)}` : "$0.00",
          countryOfOrigin: originCountry || undefined
        };
        
        console.warn('Using fallback estimate due to AI parsing error');
        return fallbackEstimate;
      }
      
      // Validate the response
      if (!parsedEstimate.htsCode || !parsedEstimate.description || !parsedEstimate.generalRate || 
          !parsedEstimate.otherRate || !parsedEstimate.retailPrice || !parsedEstimate.tariffAmount || 
          !parsedEstimate.basePrice) {
        console.error('Missing required fields in AI response:', parsedEstimate);
        throw new Error('Invalid response format from AI - missing required fields');
      }
      
      return parsedEstimate;
    }, 3, 2000); // 3 retries with 2 second base delay
    
    return estimate;
  } catch (error) {
    console.error('Error getting HTS code after all retries:', error);
    
    // If all retries failed, return a fallback estimate
    const fallbackEstimate: TariffEstimate = {
      htsCode: "9999",
      description: "General merchandise - AI service unavailable",
      generalRate: "0.10",
      otherRate: "0.05",
      retailPrice: price ? `$${price}` : "$0.00",
      tariffAmount: price ? `$${(parseFloat(price) * 0.10).toFixed(2)}` : "$0.00",
      basePrice: price ? `$${(parseFloat(price) * 0.90).toFixed(2)}` : "$0.00",
      countryOfOrigin: undefined
    };
    
    console.warn('Using fallback estimate due to AI service failure');
    return fallbackEstimate;
  }
}; 
