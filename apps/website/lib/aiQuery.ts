export async function queryAI(prompt: string): Promise<string> {
  // Show popup message instead of making API call to avoid costs
  const message = `🤖 AI Feature Demo

Hey! The AI HTS code suggestion feature is currently deactivated on this public demo to avoid unnecessary API costs.

To use this feature:
1. Clone the repository from GitHub
2. Get your own Google Gemini API key
3. Add it to your .env file as NEXT_PUBLIC_GEMINI_API_KEY
4. The AI will then suggest HTS codes for: "${prompt}"

Repository: https://github.com/Adr1an04/Tariffix`;

  // Show alert popup
  if (typeof window !== 'undefined') {
    alert(message);
  }
  
  // Return a demo HTS code for display purposes
  return "8471"; // Computer/electronics demo code
}
