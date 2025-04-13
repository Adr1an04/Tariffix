import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '/Users/kaisprunger/tarrifix/TarrifFix/apps/extension/src/config.ts';

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const country = response.text().trim();
    
    return country === "Unknown" ? null : country;
  } catch (error) {
    console.error('Error finding manufacturer origin:', error);
    return null;
  }
}

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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text
    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    // Parse the JSON response
    const estimate = JSON.parse(cleanedText) as TariffEstimate;
    
    // Validate the response
    if (!estimate.htsCode || !estimate.description || !estimate.generalRate || 
        !estimate.otherRate || !estimate.retailPrice || !estimate.tariffAmount || 
        !estimate.basePrice) {
      throw new Error('Invalid response format from AI');
    }
    
    return estimate;
  } catch (error) {
    console.error('Error getting HTS code:', error);
    throw error;
  }
}; 
