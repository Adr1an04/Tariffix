import { Dropdown } from "@/components/dropdown";
import { Navbar } from "@/components/navbar";
import Image from "next/image";
import Footer from '@/components/foot';

export default function Watch() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="z-10">
        <Navbar/>
      </div>
        <div className="flex flex-col">
        <div className="h-[100vh] w-full flex items-center justify-center">
            <Image
              src="/watchbackground.png" 
              alt="Background Image"
              layout="fill" 
              objectFit="cover" 
              className="opacity-90"
            />
          <div className="flex flex-col items-center w-2/3 justify-center text-center -mt-60 z-10">
          <div className="text-7xl font-bold text-white">Visualize the Effects</div>
          <div className="mt-4 text-lg text-white font-bold text-center">
            Easily look up tariffs and receive expert information with just an HTS code with our MongoDB Atlas database and LLM — clear, fast, and reliable trade insights at your fingertips.
          </div>
        </div>
        </div>
        <div className="flex-col z-10 bg-gradient-to-b from-white to-lime-100 flex items-center justify-center h-[200vh]">
          <div className="w-full h-full max-w-4xl">
            <Dropdown />
          </div>

          

          </div>

        </div>

    </div>

  );
}
