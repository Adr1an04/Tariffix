import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables from the website's .env.local
dotenv.config({ path: '/Users/kaisprunger/tarrifix/TarrifFix/apps/website/.env' });
const gemini = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!gemini) {
  throw new Error('NEXT_GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(gemini);

export async function aiDropdownQuery(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
    
    // Format the prompt to specifically request 4-digit HTS code
    const formattedPrompt = `
    Generate a concise and informative paragraph that explains the tariff for a product using the following fields from the Harmonized Tariff Schedule (HTS) database:

HTS Number (htsno): The official tariff classification number.

Description (description): A detailed description of the product.

General Duty Rate (general): The standard tariff rate for most countries.

Special Duty Rate (special): Any preferential rates under free trade agreements.

Additional Duties (additionalDuties / addiitionalDuties): Any extra duties that apply.

Quota Quantity (quotaQuantity): Whether the item is subject to quota limitations.

Units (units): The measurement units the tariff is based on.

Footnotes (footnotes): Additional notes or clarifications.

Indent & Superior: Used to indicate hierarchy and relationships in the HTS structure (for formatting or categorization).

Use this json data I'm about to give you to generate a paragraph that summarizes the tariff information clearly and professionally for use in a trade documentation system. Search the internet for the HTS code to find the product name. Do not use parentheseses or asterisks in your response.` + prompt;
    
    const result = await model.generateContent(formattedPrompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
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
