"use client"

import { FaGlobe, FaBalanceScale, FaChartLine, FaHandshake, FaUtensils, FaCar, FaShoppingCart, FaIndustry } from 'react-icons/fa';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function CircleGrid() {
  return (
    <div className="mt-16 w-full">
      <div className="max-w-6xl mx-auto px-6">
        {/* Industry-specific circles */}
        <div className="grid grid-cols-4 gap-x-6 mb-12">
          {[
            { 
              icon: <FaUtensils size={64} />, 
              title: "Food Industry",
              description: "Tariffs on food imports can affect prices and availability of goods, impacting both consumers and local producers."
            },
            { 
              icon: <FaCar size={64} />, 
              title: "Automotive",
              description: "Automotive tariffs can influence vehicle prices, manufacturing decisions, and international trade relationships."
            },
            { 
              icon: <FaShoppingCart size={64} />, 
              title: "E-commerce",
              description: "E-commerce faces unique tariff challenges with cross-border transactions and digital goods taxation."
            },
            { 
              icon: <FaIndustry size={64} />, 
              title: "Manufacturing",
              description: "Manufacturing tariffs can protect domestic industries while potentially increasing production costs."
            }
          ].map((item, i) => (
            <HoverCard key={`industry-${i}`}>
              <HoverCardTrigger asChild>
                <div className="w-40 h-40 bg-[rgb(190,216,22)] rounded-full shadow-xl border border-[rgba(211,211,211,1)] transition-all duration-300 ease-in-out flex flex-col items-center justify-center cursor-pointer hover:scale-105">
                  <div className="text-[#0A0D1F] mb-2">{item.icon}</div>
                  <p className="text-sm font-medium text-[#0A0D1F] text-center">{item.title}</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-gradient-to-br from-white/95 to-[#8D6B94]/10 backdrop-blur-sm border-lime-500/20">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#0A0D1F]">{item.title}</h4>
                  <p className="text-sm text-[#0A0D1F]/80">{item.description}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>

        {/* Trade concept circles */}
        <div className="grid grid-cols-4 gap-x-6">
          {[
            { 
              icon: <FaGlobe size={64} />, 
              title: "Global Trade",
              description: "Understanding global trade patterns helps businesses navigate international markets and tariff regulations."
            },
            { 
              icon: <FaBalanceScale size={64} />, 
              title: "Trade Balance",
              description: "Trade balance measures the difference between a country's exports and imports, influenced by tariff policies."
            },
            { 
              icon: <FaChartLine size={64} />, 
              title: "Economic Impact",
              description: "Tariffs can have significant effects on economic growth, inflation, and employment in various sectors."
            },
            { 
              icon: <FaHandshake size={64} />, 
              title: "Trade Relations",
              description: "Trade agreements and diplomatic relations play a crucial role in determining tariff structures and policies."
            }
          ].map((item, i) => (
            <HoverCard key={`trade-${i}`}>
              <HoverCardTrigger asChild>
                <div className="w-40 h-40 bg-[rgb(190,216,22)] rounded-full shadow-xl border border-[rgba(211,211,211,1)] transition-all duration-300 ease-in-out flex flex-col items-center justify-center cursor-pointer hover:scale-105">
                  <div className="text-[#0A0D1F] mb-2">{item.icon}</div>
                  <p className="text-sm font-medium text-[#0A0D1F] text-center">{item.title}</p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-gradient-to-br from-white/95 to-[#8D6B94]/10 backdrop-blur-sm border-lime-500/20">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-[#0A0D1F]">{item.title}</h4>
                  <p className="text-sm text-[#0A0D1F]/80">{item.description}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </div>
  );
} 