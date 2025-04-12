import { Hero } from "@/components/hero";
import { Navbar } from "@/components/navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <Hero />

    </div>

  );
}
