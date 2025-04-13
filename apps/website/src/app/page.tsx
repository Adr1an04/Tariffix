import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import { AI } from "@/components/ai";
import { Dropdown } from "@/components/dropdown";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Dropdown />
      <Navbar />
      <Hero />
      <AI/>
    </div>

  );
}