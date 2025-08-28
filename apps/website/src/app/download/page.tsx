import { Navbar } from "@/components/navbar";
import Image from "next/image";

export default function Download() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <section className="py-16 text-black">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-3xl font-bold mb-2">Get Tariffix</h1>
          <p className="text-neutral-700 mb-8">A simple browser extension that helps you estimate tariffs while you shop or source products.</p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="rounded-xl border border-[rgba(211,211,211,1)] p-5 bg-white shadow-sm">
              <h3 className="font-semibold mb-1">Suggests an HTS lead</h3>
              <p className="text-sm text-neutral-700">Parses the product title to propose a 4‑digit starting point for classification.</p>
            </div>
            <div className="rounded-xl border border-[rgba(211,211,211,1)] p-5 bg-white shadow-sm">
              <h3 className="font-semibold mb-1">Shows quick duty rates</h3>
              <p className="text-sm text-neutral-700">Displays general/special/other duty so you can estimate landed costs.</p>
            </div>
            <div className="rounded-xl border border-[rgba(211,211,211,1)] p-5 bg-white shadow-sm">
              <h3 className="font-semibold mb-1">Copy-friendly summary</h3>
              <p className="text-sm text-neutral-700">Clean text you can drop into docs, emails, or spreadsheets.</p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[rgba(211,211,211,1)] bg-white">
            <div className="p-4">
              <Image
                src="/chromeExtension.png"
                alt="Tariffix extension preview"
                width={1280}
                height={720}
                className="rounded-xl border border-[rgba(211,211,211,1)]"
                priority
              />
            </div>
          </div>

          <div className="mt-10">
            <a
              href="https://github.com/Adr1an04/Tariffix"
              className="inline-flex items-center px-5 py-3 rounded-lg bg-black text-white hover:bg-neutral-800"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>
    </div>

  );
}
