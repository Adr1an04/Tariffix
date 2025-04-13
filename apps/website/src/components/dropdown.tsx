"use client";
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { aiDropdownQuery } from "@tarriffix/ai/aiDropDownQuery";

export function Dropdown() {
    const [input, setInput] = useState<string>(""); 

    const [LLMOutput, setLLMOutput] = useState<string>("");
    
    const [jsonOutput, setJsonOutput] = useState<string>("");

    const [htsCode, setHtsCode] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


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

            console.log("data is ", data);
            setJsonOutput(JSON.stringify(data, null, 2)); 
            
            // DO LLM THING HERE!! :D
            const aiResponse = await aiDropdownQuery(JSON.stringify(data));
            console.log("AI Response:", aiResponse);
            setLLMOutput(aiResponse);
            

        } catch (error) {
            console.error("Error fetching or querying AI:", error);
            setError(error instanceof Error ? error.message : "An unknown error occurred");
          } finally {
            setIsLoading(false);
          }

    };

    const display = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInput(e.target.value);
    };

    return(
        <div className="flex items-center justify-center h-screen flex-col ">
            <div className="bg-white border-gray-300 border-1 h-20 align-middle justify-center flex w-2/3 flex-row items-center gap-x-15 py-20 rounded-lg">
                <Input
                className="z-10 rounded-lg h-20 w-1/2 sm:w-1/2 md:w-1/2 bg-white text-[#A5BE00] file:text-base md:text-base text-base focus:border-1 border-gray-300 border-1 focus:border-ring-0 focus-visible:border-ring-0"
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

            <div className="my-20 w-1/2 h-full justify-center align-middle items-center">

            <div className="flex items-center justify-center h-full my-20">
            <div className="bg-[#A5BE00] border-gray-400 border-1 flex items-center justify-center rounded-lg h-fit w-fit p-10">
                <div className="bg-white rounded-md border-gray-400 border-1 text-slate-500 text-lg h-fit p-10">
                <b>JSON OUTPUT:</b>
                <pre>{jsonOutput}</pre>
                <b>GEMINI RESPONSE:</b> {LLMOutput}
                </div>
            </div>
            </div>

        </div>

          
        </div>
    );

};