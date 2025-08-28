// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function aiDropdownQuery(_prompt: string): Promise<string> {
  // Show popup message instead of making API call to avoid costs
  const message = `🤖 AI Summary Feature Demo

Hey! The AI tariff summary feature is currently deactivated on this public demo to avoid unnecessary API costs.

This feature would normally:
- Analyze the HTS data you're viewing
- Generate a professional summary explaining the tariff
- Provide context about duties and trade requirements

To use this feature:
1. Clone the repository from GitHub
2. Get your own Google Gemini API key  
3. Add it to your .env file as NEXT_PUBLIC_GEMINI_API_KEY
4. The AI will then generate summaries for your tariff data

Repository: https://github.com/Adr1an04/Tariffix`;

  // Show alert popup
  if (typeof window !== 'undefined') {
    alert(message);
  }
  
  // Return a demo summary for display purposes
  return "🔧 AI Summary Feature: This would provide a professional explanation of the tariff data, including duty rates, special provisions, and trade implications. Currently disabled in demo mode to prevent API costs. Clone the repository to enable full AI functionality!";
}
