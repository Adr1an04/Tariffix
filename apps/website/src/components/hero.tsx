"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Footer from './foot';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"
  

const logo = "./tarrifixblacklogo.svg";

const carouselFeatureList = [
    {
        title: "CHROME EXTENSION",
        desc: "A lightweight browser-side automation tool built with Vite and Chrome Extension APIs, leveraging Cheerio for real-time DOM parsing to identify and highlight tariff-related entities within web pages. Designed for efficient in-browser trade intelligence, it enables contextual extraction of import duty data and HTSNO codes without disrupting the browsing flow.",
        subtitle: "CHEERIO API • VITE • CHROME EXTENSION TYPES",
        color: "bg-lime-500",

    }, 
    {
        title: "MONGODB ATLAS TARIFF DATABASE",
        desc: "A distributed NoSQL tariff data store hosted on MongoDB Atlas, optimized for high availability and fast querying of HTSNO-specific trade rates across global markets. Integrated with MongoDB Compass for schema visualization, aggregation pipeline testing, and low-latency CRUD operations during development.",
        subtitle: "MONGODB ATLAS • MONGODB COMPASS",

        color: "bg-[#679436]",


    }, 
    {

        title: "LEARNING LANGUAGE MODEL",
        desc: "A sophisticated NLP model built using Google’s Gemini framework, optimized for understanding and generating human-like text across diverse domains. Leveraging deep learning techniques and large-scale datasets, it continuously adapts to context, enabling advanced conversational capabilities, data extraction, and language comprehension tasks.",
        subtitle: "GOOGLE AI STUDIO (GEMINI)",

        color: "bg-[#8D6B94]",


    }

];

export function Hero() {

    return (
        <div className="flex flex-col">
            <div className="relative overflow-hidden bg-cover bg-center h-[80vh] bg-gradient-to-b from-white to-lime-100 flex items-center justify-center">
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
                        <a href={"/download"} className="px-6 py-3 bg-[#8D6B94] text-white font-semibold rounded-md hover:bg-[#d096dc] hover:scale-102 transition-colors">
                            Download
                        </a>
                        <a href={"/guide"} className="px-6 py-3 bg-lime-500 text-white font-semibold rounded-md hover:bg-lime-600 transition-colors hover:scale-102">
                            Learn More
                        </a>
                    </div>
                </div>
            </div>

            <div className="z-10 bg-white border-slate-300 border-1 rounded-lg p-10 w-2/3 text-black font- flex items-center justify-center mx-auto -my-20">
            Download our Chrome extension that effortlessly scrapes data from websites, access tariff-related information from a MongoDB Atlas database, and receive insights from an advanced Learning Language Model (LLM)
            </div>
            <div className="my-10"></div>
            <div className="relative py-2 bg-transparent">
                <div className="max-w-6xl mx-auto px-4 bg-transparent">
                    <div className="relative flex items-center justify-center p-15 bg-transparent">
                    <Carousel>
                        <CarouselContent className="gap-x-5 m-5">
                            {carouselFeatureList.map((carouselFeature, index ) => ( 
                                <CarouselItem 
                                    key={index} 
                                    className={`hover:scale-101 transition-transform rounded-2xl ${carouselFeature.color} w-60 h-80  p-10 `}
                                >
                                    <div className="font-extrabold text-3xl">{carouselFeature.title}</div>
                                    <div className="my-2 font-bold p-3 text-black bg-white rounded-lg gap-x-3">{carouselFeature.subtitle}</div>
                                    <div className="font-medium text-lg">{carouselFeature.desc}</div>
                                </CarouselItem>
                            ))}
                           
                        </CarouselContent>
                        <CarouselPrevious className="bg-slate-600"></CarouselPrevious>
                        <CarouselNext className="bg-slate-600"></CarouselNext>
                        </Carousel>

                    </div>
                </div>
            </div>


            <div className="bg-lime-100 py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="text-black">
                            <h2 className="text-3xl font-bold mb-4 ">Guide</h2>
                            <p className="text-lg">
                            This page <b>explains what tariffs are, how they work, and why they matter in global trade.</b> You'll learn about the different types of tariffs, their impact on prices and international relationships, and why understanding them is important for importers, businesses, and consumers.
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
                            This page allows users to enter an <b>HTS (Harmonized Tariff Schedule) code</b> and retrieves detailed tariff data directly from a <b>MongoDB database</b>. It provides accurate information on duties, taxes, and trade requirements based on the product and country of origin, making it a valuable resource for importers, exporters, and trade professionals.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}