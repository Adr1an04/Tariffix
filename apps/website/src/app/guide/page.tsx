import { Navbar } from "@/components/navbar";
import { HeroSection } from '@/components/guidecomponents/hero';

export default function Guide() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <HeroSection />

      {/* Definition Card perfectly between Hero and Body */}
      <div className="relative z-10 -mb-54">
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-110 w-full max-w-xl px-4">
          <div className="bg-[rgb(190,216,22)] shadow-xl rounded-2xl p-6 border border-[rgba(211,211,211,1)]">
            <h3 className="text-2xl font-bold text-[rgba(10,13,31,1)] text-center mb-0">
              tariff
            </h3>
            <p className="text-sm italic text-[rgba(10,13,31,0.4)] text-center mb-1">tar·iff /ˈterəf/</p>
            <p className="text-[rgba(96,96,96,1)] text-base leading-snug text-center mb-2">
              A tax or duty to be paid on a particular class of <span className="italic">imports</span> or <span className="italic">exports</span>.
            </p>
            <p className="text-sm text-[rgba(128,128,128,0.5)] italic text-center">
              "the reduction of trade barriers and import tariffs"
            </p>
          </div>
        </div>
      </div>

      {/* Section with Two Columns */}
      <section className="px-6 bg-white text-[rgba(10,13,31,1)] py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          {/* Left Column - Just Text */}
          <div>
            <h2 className="text-3xl font-bold mb-4">Understanding Tariffs</h2>
            <p className="text-lg leading-relaxed mb-6">
              Tariffs are taxes imposed by a government on goods and services imported from other countries. They are a powerful tool used to protect local industries, regulate trade balances, and generate revenue for the state.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              By raising the price of imported goods, tariffs can encourage consumers to purchase domestic products instead. However, they can also lead to trade disputes, increased prices for consumers, and changes in global supply chains.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              In today’s interconnected economy, understanding how tariffs work — and how they impact businesses and consumers — is essential. Whether you're a policymaker, entrepreneur, or curious learner, this guide will walk you through everything you need to know.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Tariffs come in different forms — from ad valorem tariffs, which are based on the value of goods, to specific tariffs calculated per unit. Each type has different implications depending on the products and industries involved.
            </p>
          </div>

          {/* Right Column - Empty Card + Text */}
          <div className="flex flex-col gap-6">
            {/* Empty Card */}
            <div className="bg-[rgb(190,216,22)] shadow-xl rounded-2xl p-6 h-48 border border-[rgba(211,211,211,1)]">
              {/* Placeholder for future content */}
            </div>

            {/* Text Below the Card */}
            <div>
              <h3 className="text-2xl font-bold mb-3">Why It Matters</h3>
              <p className="text-lg leading-relaxed">
                Tariffs can shape the direction of global trade and directly impact pricing, availability, and competitiveness. Recognizing their role helps businesses and consumers make better-informed decisions in the market.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Why It Matters</h3>
              <p className="text-lg leading-relaxed">
                Tariffs can shape the direction of global trade and directly impact pricing, availability, and competitiveness. Recognizing their role helps businesses and consumers make better-informed decisions in the market.
              </p>
            </div>
          </div>
        </div>

        
{/* Perfectly Aligned Circle Row – Refined Size */}
<div className="mt-16 w-full">
  <div className="max-w-6xl mx-auto px-6">
    <div className="grid grid-cols-4 gap-x-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="w-40 h-40 bg-[rgb(190,216,22)] rounded-full shadow-xl border border-[rgba(211,211,211,1)] transition-all duration-300 ease-in-out"
        />
      ))}
    </div>
  </div>
</div>
      </section>
    </div>
  );
}
