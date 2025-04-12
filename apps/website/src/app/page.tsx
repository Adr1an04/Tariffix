"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";

export default function Home() {
  // type safety
  interface Rate {
    htsno: string;
    description: string;
    general: string;
    other: string;
  }

  // current data being displayed
  const [rates, setRates] = useState<Rate[]>([]);

  // fetching rates 
  useEffect(() => {
    const fetchRates = async () => {
      // fetch the api 
      const res = await fetch("/api/tariffs");
      const data = await res.json();
      setRates(data);
    };

    fetchRates();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <Hero />

      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">Tariff Rates</h2>
        <ul>
          {/* go through each and display the info */}
          {rates.length > 0 && (
            <li>
              {rates[0].htsno} - {rates[0].description} , {rates[0].general} , {rates[0].other}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
