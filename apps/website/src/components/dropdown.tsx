"use client";
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function Dropdown() {
    const [input, setInput] = useState<string>(""); 

    const update = async (reg: boolean, input: string): Promise<void> => { 
        if (!input) return;

        try {
            const response = await fetch(`/api/lookup?htsno=${input}`)
            const data = await response.json();

            // waht to do if no good ):
            if (!response.ok) {
                return;
            }
            
            // DO LLM THING HERE!! :D
            console.log("HTSNO Data:", data); 
        } catch (error) {
            console.error("Error fetching HTSNO:", error);
        }

    };

    const display = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInput(e.target.value);
    };

    return(
        <div className="flex items-center justify-center h-screen">
            <div className="bg-[#8D6B94] h-20 align-middle justify-center flex w-2/3 flex-row items-center gap-x-15 rounded-lg">
                <Input
                className="z-10 rounded-lg h-11 w-1/2 sm:w-1/2 md:w-1/2 bg-white text-[#A5BE00] file:text-base md:text-base text-base border border-gray-300 focus:border-ring-0 focus-visible:border-ring-0"
                type="text"
                placeholder="Enter HTSNO code..."
                onChange={display}
                value={input}
                />
              <button
                className="font-bold transition-transform hover:scale-105 p-2 rounded-lg bg-[#A5BE00] h-fit"
                type="submit"
                onClick={() => update(true, input)}
                >SUBMIT
                
              </button>

            </div>
        </div>

          // what we doin? we doin
            // we're going fetch each rate's htsno number and add to the display
            // we're going to display every country in the component
            // once hit submit, will display the country's spec tariff

    );

};