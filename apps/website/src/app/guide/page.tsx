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
              &quot;the reduction of trade barriers and import tariffs&quot;
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
              In today&apos;s interconnected economy, understanding how tariffs work — and how they impact businesses and consumers — is essential. Whether you&apos;re a policymaker, entrepreneur, or curious learner, this guide will walk you through everything you need to know.
            </p>
            <p className="text-lg leading-relaxed mb-6">
              Tariffs come in different forms — from ad valorem tariffs, which are based on the value of goods, to specific tariffs calculated per unit. Each type has different implications depending on the products and industries involved.
            </p>
          </div>

          {/* Right Column - Empty Card + Text */}
          <div className="flex flex-col gap-6">
            {/* Impact Visualization Card */}
            <div className="bg-[rgb(190,216,22)] shadow-xl rounded-2xl p-6 h-48 border border-[rgba(211,211,211,1)] flex flex-col justify-center">
              <div className="text-center">
                <h4 className="text-xl font-bold text-[rgba(10,13,31,1)] mb-3">Global Impact</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[rgba(10,13,31,1)]">$300B+</div>
                    <div className="text-[rgba(10,13,31,0.7)]">Annual tariff revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[rgba(10,13,31,1)]">15,000+</div>
                    <div className="text-[rgba(10,13,31,0.7)]">HTS categories</div>
                  </div>
                </div>
                <p className="text-xs text-[rgba(10,13,31,0.6)] mt-3">
                  Tariffs affect trillions in global trade annually
                </p>
              </div>
            </div>

            {/* Text Below the Card */}
            <div>
              <h3 className="text-2xl font-bold mb-3">Why It Matters</h3>
              <p className="text-lg leading-relaxed">
                Tariffs can shape the direction of global trade and directly impact pricing, availability, and competitiveness. Recognizing their role helps businesses and consumers make better-informed decisions in the market.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Real-World Impact</h3>
              <p className="text-lg leading-relaxed">
                From your morning coffee to smartphone prices, tariffs affect everyday purchases. Understanding these costs helps you budget effectively and recognize why certain products cost more than others.
              </p>
            </div>
          </div>
        </div>

        
{/* Types of Tariffs */}
<div className="mt-16 w-full">
  <div className="max-w-6xl mx-auto px-6">
    <h2 className="text-3xl font-bold text-center mb-12">Types of Tariffs</h2>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="flex flex-col items-center text-center">
        <div className="w-40 h-40 bg-[rgb(190,216,22)] rounded-full shadow-xl border border-[rgba(211,211,211,1)] flex items-center justify-center mb-4">
          <div className="text-[rgba(10,13,31,1)]">
            <div className="text-2xl font-bold">Ad Valorem</div>
            <div className="text-sm">% of Value</div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Ad Valorem</h3>
        <p className="text-sm leading-relaxed">
          A percentage of the product&apos;s value. If a laptop costs $1000 and has a 10% tariff, you pay $100 extra.
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="w-40 h-40 bg-[rgb(190,216,22)] rounded-full shadow-xl border border-[rgba(211,211,211,1)] flex items-center justify-center mb-4">
          <div className="text-[rgba(10,13,31,1)]">
            <div className="text-2xl font-bold">Specific</div>
            <div className="text-sm">Per Unit</div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Specific</h3>
        <p className="text-sm leading-relaxed">
          A fixed amount per unit. For example, $2 per pound of coffee, regardless of the coffee&apos;s quality or price.
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="w-40 h-40 bg-[rgb(190,216,22)] rounded-full shadow-xl border border-[rgba(211,211,211,1)] flex items-center justify-center mb-4">
          <div className="text-[rgba(10,13,31,1)]">
            <div className="text-2xl font-bold">Compound</div>
            <div className="text-sm">Both Combined</div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Compound</h3>
        <p className="text-sm leading-relaxed">
          Combines both methods: a percentage plus a fixed amount. More complex but provides stable revenue.
        </p>
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="w-40 h-40 bg-[rgb(190,216,22)] rounded-full shadow-xl border border-[rgba(211,211,211,1)] flex items-center justify-center mb-4">
          <div className="text-[rgba(10,13,31,1)]">
            <div className="text-2xl font-bold">Quota</div>
            <div className="text-sm">Limited Amount</div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Tariff-Rate Quota</h3>
        <p className="text-sm leading-relaxed">
          Lower rates for a set quantity, higher rates beyond that limit. Balances trade and protection.
        </p>
      </div>
    </div>
  </div>
</div>
      </section>

      {/* HTS Code System */}
      <section className="bg-neutral-50 text-[rgba(10,13,31,1)] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Understanding HTS Codes</h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              The Harmonized Tariff Schedule (HTS) is the system used to classify traded products and determine their tariff rates. Every product has a specific code that determines how much duty you&apos;ll pay.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-[rgba(211,211,211,1)] shadow-sm">
                <h3 className="text-xl font-bold mb-3">How HTS Codes Work</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[rgb(190,216,22)] rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span>Every product gets a 10-digit classification code</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[rgb(190,216,22)] rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span>Code determines the exact tariff rate</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[rgb(190,216,22)] rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span>Used by customs to assess duties</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[rgb(190,216,22)] rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <span>Standardized globally for consistency</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[rgba(211,211,211,1)] shadow-sm">
                <h4 className="font-bold mb-3">Example: HTS Code Breakdown</h4>
                <div className="font-mono text-lg mb-3 text-center bg-neutral-100 p-3 rounded">
                  8471.30.0100
                </div>
                <div className="space-y-2 text-sm">
                  <div><strong>84:</strong> Nuclear reactors, boilers, machinery</div>
                  <div><strong>8471:</strong> Automatic data processing machines</div>
                  <div><strong>8471.30:</strong> Portable digital computers</div>
                  <div><strong>8471.30.0100:</strong> Laptops, weighing ≤ 10 kg</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[rgba(211,211,211,1)] shadow-sm">
              <h3 className="text-xl font-bold mb-4">Try Our HTS Lookup Tool</h3>
              <p className="text-neutral-700 mb-4">
                Use our extension or website to look up real HTS codes and see current tariff rates for any product you&apos;re interested in.
              </p>
              <div className="space-y-3">
                <a href="/watch" className="block w-full px-4 py-3 bg-[rgb(190,216,22)] text-[rgba(10,13,31,1)] font-semibold rounded-lg text-center hover:bg-[rgb(170,196,12)] transition-colors">
                  Try HTS Code Lookup
                </a>
                <a href="/download" className="block w-full px-4 py-3 border border-[rgba(211,211,211,1)] text-[rgba(10,13,31,1)] font-semibold rounded-lg text-center hover:bg-neutral-50 transition-colors">
                  Get Browser Extension
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Examples */}
      <section className="bg-white text-[rgba(10,13,31,1)] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Real-World Examples</h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              See how tariffs affect everyday purchases and business decisions in practice.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-neutral-50 rounded-2xl p-6 border border-[rgba(211,211,211,1)]">
              <h3 className="text-xl font-bold mb-4">Coffee Import</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-semibold">Coffee beans (per lb)</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>$8.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tariff Rate:</span>
                  <span>0% (coffee is duty-free)</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Final Cost:</span>
                  <span>$8.00</span>
                </div>
              </div>
              <p className="text-xs text-neutral-600 mt-3">
                Many agricultural products have low or zero tariffs to keep food affordable.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 border border-[rgba(211,211,211,1)]">
              <h3 className="text-xl font-bold mb-4">Electronics</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-semibold">Smartphone</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>$800.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tariff Rate:</span>
                  <span>25%</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Final Cost:</span>
                  <span>$1,000.00</span>
                </div>
              </div>
              <p className="text-xs text-neutral-600 mt-3">
                Tech products often face higher tariffs, especially during trade disputes.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-6 border border-[rgba(211,211,211,1)]">
              <h3 className="text-xl font-bold mb-4">Automotive Parts</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Product:</span>
                  <span className="font-semibold">Car tire</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Price:</span>
                  <span>$120.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Tariff Rate:</span>
                  <span>4%</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Final Cost:</span>
                  <span>$124.80</span>
                </div>
              </div>
              <p className="text-xs text-neutral-600 mt-3">
                Auto parts typically have moderate tariffs to protect domestic manufacturing.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="bg-[rgb(190,216,22)] rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-[rgba(10,13,31,1)] mb-4">Start Learning Today</h3>
              <p className="text-[rgba(10,13,31,0.8)] mb-6">
                Understanding tariffs empowers you to make better financial decisions, whether you&apos;re shopping online, running a business, or studying economics.
              </p>
              <div className="flex gap-4 justify-center">
                <a href="/watch" className="px-6 py-3 bg-white text-[rgba(10,13,31,1)] font-semibold rounded-lg hover:bg-neutral-100 transition-colors">
                  Try Our Tools
                </a>
                <a href="/download" className="px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-[rgba(10,13,31,1)] transition-colors">
                  Get Extension
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
