import React from 'react';
import Image from 'next/image';

const logo = "./tarrifixblacklogo.svg";

export function Hero() {
    return (
        <div className="relative overflow-hidden bg-cover bg-center h-[70vh] bg-gradient-to-b from-white to-lime-100 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <div className="relative w-full max-w-md">
                    <Image
                        src={logo}
                        alt="Hero image"
                        width={500}
                        height={300}
                        className="w-full h-auto"
                    />
                </div>
                <p className="mt-4 text-xl text-black font-bold text-center">
                    Tariffs made simple — track, compare, and calculate in seconds.
                </p>
                <div className="mt-8 flex space-x-8">
                    <button className="px-6 py-3 bg-[#8D6B94] text-white font-semibold hover:bg-[#d096dc]">
                        Download
                    </button>
                    <button className="px-6 py-3 bg-lime-500 text-white font-semibold hover:bg-lime-600">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
}