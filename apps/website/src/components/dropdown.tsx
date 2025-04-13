"use client";
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import Image from "next/image";

export function Dropdown() {
    const [input, setInput] = useState<string>(""); 

    const [LLMOutput, setLLMOutput] = useState<string>("");
    
    const [jsonOutput, setJsonOutput] = useState<string>("");

    const update = async (reg: boolean, input: string): Promise<void> => { 
        if (!input) return;

        try {
            const response = await fetch(`/api/lookup?htsno=${input}`)
            const data = await response.json();

            // waht to do if no good ):
            if (!response.ok) {
                console.log("error");
                setJsonOutput("Error... Enter again."); 

                return;
            }
            
            // DO LLM THING HERE!! :D
            console.log("data is ", data);
            setJsonOutput(JSON.stringify(data, null, 2)); 
            

        } catch (error) {
            console.error("Error fetching HTSNO:", error);
        }

    };

    const display = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInput(e.target.value);
    };

    return(
        <div className="flex items-center justify-center h-screen flex-col gap-y-20">
            <div className="bg-white border-gray-300 border-1 h-40 align-middle justify-center flex w-2/3 flex-row items-center gap-x-15 rounded-lg">
                <Input
                className="z-10 rounded-lg h-11 w-1/2 sm:w-1/2 md:w-1/2 bg-white text-[#A5BE00] file:text-base md:text-base text-base focus:border-1 border-gray-300 border-1 focus:border-ring-0 focus-visible:border-ring-0"
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

            <div className="bg-[#A5BE00] border-gray-400 border-1 h-80 flex items-center justify-center w-2/3 rounded-lg">
                    <div className="bg-white w-[90%] h-[80%] rounded-md border-gray-400 border-1 text-slate-500 text-lg">
                        <pre>{jsonOutput}</pre>
                        {LLMOutput}
                    </div>
            </div>
            

        </div>

          // what we doin? we doin
            // we're going fetch each rate's htsno number and add to the display
            // we're going to display every country in the component
            // once hit submit, will display the country's spec tariff

    );

};