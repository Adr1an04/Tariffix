"use client";
import React from 'react';
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
        learnMore: "/download",
        learnMoreText: "Download Extension"
    }, 
    {
        title: "MONGODB ATLAS TARIFF DATABASE",
        desc: "A distributed NoSQL tariff data store hosted on MongoDB Atlas, optimized for high availability and fast querying of HTSNO-specific trade rates across global markets. Integrated with MongoDB Compass for schema visualization, aggregation pipeline testing, and low-latency CRUD operations during development.",
        subtitle: "MONGODB ATLAS • MONGODB COMPASS",
        color: "bg-[#679436]",
        learnMore: "/watch",
        learnMoreText: "Try Database Lookup"
    }, 
    {
        title: "LEARNING LANGUAGE MODEL",
        desc: "A sophisticated NLP model built using Google's Gemini framework, optimized for understanding and generating human-like text across diverse domains. Leveraging deep learning techniques and large-scale datasets, it continuously adapts to context, enabling advanced conversational capabilities, data extraction, and language comprehension tasks.",
        subtitle: "GOOGLE AI STUDIO (GEMINI)",
        color: "bg-[#8D6B94]",
        learnMore: "/guide",
        learnMoreText: "Learn About AI"
    }
];

export function Hero() {

    return (
        <div className="flex flex-col">
            
            <div className="relative overflow-hidden bg-cover bg-center h-[100vh] bg-gradient-to-b from-white to-lime-100 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-md -mt-30">
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
                        <a href={"https://github.com/Adr1an04/Tariffix"} className="px-6 py-3 bg-[#8D6B94] text-white font-semibold rounded-md hover:bg-[#d096dc] hover:scale-102 transition-colors">
                            Download
                        </a>
                        <a href={"/guide"} className="px-6 py-3 bg-lime-500 text-white font-semibold rounded-md hover:bg-lime-600 transition-colors hover:scale-102">
                            Learn More
                        </a>
                    </div>
                </div>
            </div>

            <div className="z-10 bg-white border-slate-300 border-1 rounded-lg p-8 w-2/3 text-black flex items-center justify-center mx-auto -my-20 shadow-lg">
                <p className="text-center text-lg">
                    Download our Chrome extension that effortlessly scrapes data from websites, access tariff-related information from a MongoDB Atlas database, and receive insights from an advanced Learning Language Model (LLM)
                </p>
            </div>

            {/* Financial Literacy - Why Tariffs Matter */}
            <section className="bg-white text-black py-16 border-t border-[rgba(211,211,211,1)] mt-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Understanding Import Costs</h2>
                        <p className="text-neutral-700 max-w-3xl mx-auto text-lg">
                            Tariffs directly impact the final price you pay for imported goods. Learning how they work helps you make smarter purchasing decisions and understand global economics.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">What is a tariff?</h3>
                                <p className="text-neutral-700">A tariff is a tax imposed by governments on imported goods. When you buy something made overseas, the tariff increases its final cost, making domestic alternatives more competitive.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Real-world impact</h3>
                                <p className="text-neutral-700">A 25% tariff on a $100 product means you pay $125. This affects everything from electronics to clothing, influencing what products succeed in different markets.</p>
                            </div>
                        </div>
                        <div className="rounded-2xl p-6 bg-neutral-50 border border-[rgba(211,211,211,1)]">
                            <h4 className="font-semibold mb-3">Example: Laptop Purchase</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Product Price:</span>
                                    <span>$800</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Import Tariff (15%):</span>
                                    <span>$120</span>
                                </div>
                                <div className="flex justify-between font-semibold border-t pt-2">
                                    <span>Total Cost:</span>
                                    <span>$920</span>
                                </div>
                            </div>
                            <p className="text-xs text-neutral-600 mt-3">
                                Understanding these costs helps you budget better and compare true prices across brands and origins.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="rounded-2xl p-6 border border-[rgba(211,211,211,1)] bg-white shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">For Consumers</h3>
                            <p className="text-neutral-700">Learn why some products cost more and make informed choices about where your money goes when shopping internationally.</p>
                        </div>
                        <div className="rounded-2xl p-6 border border-[rgba(211,211,211,1)] bg-white shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">For Businesses</h3>
                            <p className="text-neutral-700">Calculate true importing costs, plan pricing strategies, and choose suppliers that optimize your profit margins.</p>
                        </div>
                        <div className="rounded-2xl p-6 border border-[rgba(211,211,211,1)] bg-white shadow-sm">
                            <h3 className="text-xl font-semibold mb-2">For Students</h3>
                            <p className="text-neutral-700">Understand how trade policy affects global economics and learn to classify products using the HTS system.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tool Showcase - Extension */}
            <section className="bg-neutral-50 text-black py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Learn by Doing</h2>
                        <p className="text-neutral-700 max-w-2xl mx-auto">
                            Our browser extension makes tariff education hands-on. Look up real products, see actual duty rates, and understand how classification works in practice.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="rounded-2xl overflow-hidden border border-[rgba(211,211,211,1)] bg-white p-4">
                            <Image
                                src="/chromeExtension.png"
                                alt="Tariffix browser extension preview"
                                width={1024}
                                height={576}
                                className="rounded-xl border border-[rgba(211,211,211,1)]"
                                priority
                            />
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-2xl font-bold mb-3">Tariffix Browser Extension</h3>
                                <p className="text-neutral-700 mb-4">
                                    Turn any shopping session into a learning opportunity. The extension analyzes products in real-time, showing you how tariffs affect the items you&apos;re browsing.
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#A5BE00] flex items-center justify-center text-white text-sm font-bold">1</div>
                                    <div>
                                        <h4 className="font-semibold">Smart HTS Suggestions</h4>
                                        <p className="text-sm text-neutral-700">AI analyzes product titles to suggest the correct tariff classification codes</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#A5BE00] flex items-center justify-center text-white text-sm font-bold">2</div>
                                    <div>
                                        <h4 className="font-semibold">Live Duty Rates</h4>
                                        <p className="text-sm text-neutral-700">See current tariff rates from our database of official trade data</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#A5BE00] flex items-center justify-center text-white text-sm font-bold">3</div>
                                    <div>
                                        <h4 className="font-semibold">Educational Summaries</h4>
                                        <p className="text-sm text-neutral-700">Get clear explanations of how tariffs apply to specific products</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <a href="/download" className="inline-flex items-center px-6 py-3 rounded-lg bg-[#A5BE00] text-white font-semibold hover:bg-[#8fa01b] transition-colors">
                                    Get the Extension
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="my-10"></div>
            <div className="relative py-2 bg-transparent">
                <div className="max-w-6xl mx-auto px-4 bg-transparent">
                    <div className="relative flex items-center justify-center p-15 bg-transparent">
                    <Carousel>
                        <CarouselContent className="gap-x-5 m-5">
                            {carouselFeatureList.map((carouselFeature, index ) => ( 
                                <CarouselItem 
                                    key={index} 
                                    className={`hover:scale-101 transition-transform rounded-2xl ${carouselFeature.color} w-60 h-96 p-6 flex flex-col`}
                                >
                                    <div className="font-extrabold text-2xl mb-3">{carouselFeature.title}</div>
                                    <div className="mb-3 font-bold p-2 text-black bg-white rounded-lg text-sm">{carouselFeature.subtitle}</div>
                                    <div className="font-medium text-sm flex-grow mb-4">{carouselFeature.desc}</div>
                                    <a 
                                        href={carouselFeature.learnMore} 
                                        className="mt-auto px-4 py-2 bg-white text-black font-semibold rounded-lg text-sm hover:bg-gray-100 transition-colors text-center"
                                    >
                                        {carouselFeature.learnMoreText}
                                    </a>
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
                <div className="max-w-6xl mx-auto px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="text-black">
                            <h2 className="text-3xl font-bold mb-4 ">Guide</h2>
                            <p className="text-lg">
                            This page <b>explains what tariffs are, how they work, and why they matter in global trade.</b> You&apos;ll learn about the different types of tariffs, their impact on prices and international relationships, and why understanding them is important for importers, businesses, and consumers.
                            </p>
                        </div>
                        <Image
                            src="/guidehero.png"
                            alt="PNG"
                            width={500}
                            height={300}
                            className="w-full h-auto rounded-xl"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white py-16">
                <div className="max-w-6xl mx-auto px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <Image
                            src="/watchhero.png"
                            alt="PNG"
                            width={500}
                            height={300}
                            className="w-full h-auto rounded-xl"
                        />
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