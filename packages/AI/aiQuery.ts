import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables from the website's .env.local
dotenv.config({ path: '/Users/kaisprunger/tarrifix/TarrifFix/apps/website/.env' });
const gemini = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!gemini) {
  throw new Error('NEXT_GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(gemini);

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
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return 'Error: Invalid model name. Please check the Gemini API documentation for available models.';
      }
      return `Error: ${error.message}`;
    }
    return 'Unknown error occurred while querying the AI';
  }
}
