"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import { queryAI } from "@tarriffix/ai";

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
  const [htsCode, setHtsCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // fetching rates and getting HTS code
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get HTS code from AI
        const productDescription = "Apple 2025 MacBook Air 13-inch Laptop with M4 chip: Built for Apple Intelligence, 13.6-inch Liquid Retina Display, 16GB Unified Memory, 256GB SSD Storage, 12MP Center Stage Camera, Touch ID; Sky Blue";
        const htsCode = await queryAI(productDescription);
        console.log('HTS Code from AI:', htsCode);
        setHtsCode(htsCode);

        // Fetch rates from API
        const res = await fetch("/api/tariffs");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('API Response:', data);

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format from API');
        }
        
        // Filter rates by matching the first 4 digits of HTS code
        const filteredRates = data.filter((rate: Rate) => {
          // Extract first 4 digits from the database HTS code
          const dbCodeFirst4 = rate.htsno.replace(/[^0-9]/g, '').slice(0, 4);
          return dbCodeFirst4 === htsCode;
        });
        
        console.log('Filtered Rates:', filteredRates);
        setRates(filteredRates);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <Hero />

      <div className="p-4">
        <h2 className="text-xl font-bold mb-2 text-black">Tariff Rates</h2>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="text-red-500">
            <p>Error: {error}</p>
          </div>
        ) : (
          <div>
            <p className="mb-4 text-black">HTS Code (first 4 digits): {htsCode}</p>
            <ul>
              {rates.length > 0 ? (
                rates.map((rate, index) => (
                  <li key={index} className="mb-2 p-4 border rounded text-black">
                    <div className="font-bold text-black">HTS Code: {rate.htsno}</div>
                    <div>Description: {rate.description}</div>
                    <div>General Rate: {rate.general}</div>
                    <div>Other Rate: {rate.other}</div>
                  </li>
                ))
              ) : (
                <li>No matching rates found for HTS code: {htsCode}</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
