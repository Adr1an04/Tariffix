import React from 'react';

export const HeroSection = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative overflow-hidden bg-cover bg-center h-[50vh] bg-gradient-to-b from-white to-[rgba(141,107,148,0.5)] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-4">
            What Are Tariffs?
          </h1>
          <p className="text-l md:text-2xl text-gray-700 max-w-2xl font-medium">
            Your friendly guide to understanding tariffs and staying ahead of global trade.
          </p>
        </div>
      </div>
    </div>
  );
}