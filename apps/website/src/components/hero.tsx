"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Footer from './foot';

const logo = "./tarrifixblacklogo.svg";

const carouselItems = [
    {
        title: "Stay up to date.",
        color: "bg-lime-500",
    },
    {
        title: "Make informed choices.",
        color: "bg-[#6B8E23]",
    },
    {
        title: "Educate yourself and others.",
        color: "bg-[#8D6B94]",
    }
];

export function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
    };

    return (
        <div className="flex flex-col">
            <div className="relative overflow-hidden bg-cover bg-center h-[70vh] bg-gradient-to-b from-white to-lime-100 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-md">
                        <Image
                            src={logo}
                            alt="Tariffix Logo"
                            width={500}
                            height={300}
                            className="w-full h-auto"
                        />
                    </div>
                    <p className="mt-4 text-xl text-black font-bold text-center">
                        Tariffs made simple — track, compare, and calculate in seconds.
                    </p>
                    <div className="mt-8 flex space-x-8">
                        <button className="px-6 py-3 bg-[#8D6B94] text-white font-semibold hover:bg-[#d096dc] transition-colors">
                            Download
                        </button>
                        <button className="px-6 py-3 bg-lime-500 text-white font-semibold hover:bg-lime-600 transition-colors">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
            <div className="relative bg-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="relative flex items-center justify-center">
                        <button 
                            onClick={prevSlide}
                            className="absolute left-0 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <div className={`relative w-full h-64 rounded-lg overflow-hidden ${carouselItems[currentSlide].color}`}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <h2 className="text-3xl font-bold text-white">{carouselItems[currentSlide].title}</h2>
                            </div>
                        </div>
                        <button 
                            onClick={nextSlide}
                            className="absolute right-0 z-10 p-2 rounded-full bg-black bg-opacity-50 text-white"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>


            <div className="bg-lime-100 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="text-black">
                            <h2 className="text-3xl font-bold mb-4 ">Guide</h2>
                            <p className="text-lg">
                                yappy yap
                            </p>
                        </div>
                        <div className="bg-lime-500 h-64 rounded-lg"></div>
                    </div>
                </div>
            </div>

            <div className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="bg-[#8D6B94] h-64 rounded-lg"></div>
                        <div className="text-black">
                            <h2 className="text-3xl font-bold mb-4">Watch</h2>
                            <p className="text-lg text-gray-700">
                                YAPPPP
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}