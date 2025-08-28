import { Dropdown } from "@/components/dropdown";
import { Navbar } from "@/components/navbar";
import Image from "next/image";

export default function Watch() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <Image
          src="/watchbackground.png" 
          alt="Background Image"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Visualize the Effects
          </h1>
          <p className="text-lg md:text-xl text-white font-medium max-w-3xl mx-auto">
            Look up tariffs and get expert information with just an HTS code. Our database and AI provide clear, fast, and reliable trade insights at your fingertips.
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Try the HTS Code Lookup</h2>
            <p className="text-neutral-700 max-w-2xl mx-auto">
              Enter any HTS code to see detailed tariff information including duty rates, descriptions, and AI-generated summaries.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* AI Demo Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="text-blue-600 mr-3">🤖</div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-800 mb-1">AI Summary Feature Demo</h3>
                  <p className="text-xs text-blue-700">
                    AI tariff summaries are disabled on this public demo to prevent API costs. 
                    <a href="https://github.com/Adr1an04/Tariffix" className="underline hover:text-blue-900"> Clone the repository</a> to enable full AI functionality with your own Gemini API key.
                  </p>
                </div>
              </div>
            </div>
            
            <Dropdown />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-neutral-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-black mb-4">How It Works</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#A5BE00] flex items-center justify-center text-white text-sm font-bold">1</div>
                  <p className="text-neutral-700">Enter an HTS code in the search box above</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#A5BE00] flex items-center justify-center text-white text-sm font-bold">2</div>
                  <p className="text-neutral-700">Our system fetches the latest tariff data from our database</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#A5BE00] flex items-center justify-center text-white text-sm font-bold">3</div>
                  <p className="text-neutral-700">AI analyzes and provides a clear, professional summary</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden border border-[rgba(211,211,211,1)]">
              <Image
                src="/watchhero.png"
                alt="Tariff lookup demonstration"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

