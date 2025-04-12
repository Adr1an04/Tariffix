import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function queryAI(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    const result = await model.generateContent("Give the HTS code for this product: Apple 2025 MacBook Air 13-inch Laptop with M4 chip: Built for Apple Intelligence, 13.6-inch Liquid Retina Display, 16GB Unified Memory, 256GB SSD Storage, 12MP Center Stage Camera, Touch ID; Sky Blue , No YAP ONLY THE CODE ");
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error querying AI:', error);
    return error instanceof Error ? error.message : 'Unknown error occurred';
  }
}
