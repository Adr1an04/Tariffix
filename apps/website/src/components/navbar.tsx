"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { XMarkIcon, Bars3Icon } from "@heroicons/react/24/solid";

const routes: { title: string; href: string }[] = [
  { title: "Guide", href: "/guide" },
  { title: "Watch", href: "/watch" },
  { title: "DOWNLOAD", href: "/download" }
];

const Navbar = (): JSX.Element => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <div className="relative flex items-center justify-between h-32 w-full bg-gradient-to-t from-transparent lg:pr-14 md:pr-10 sm:pr-2 lg:pl-8 py-5">
      <div className="flex w-full justify-between m-6">
        <div className="flex justify-start items-center space-x-4">
          <Link href={"/"} className="shrink-0 text-black font-extrabold flex-row flex align-middle justify-center items-center gap-x-5 text-2xl">
            <Image className="object-contain flex-row " src="/logo.jpg" alt="My Icon" width={40} height={40} />Tariffix
          </Link>
        </div>

        <div className="justify-end justify-items-end sm:flex hidden">
          {routes.map((route, index) => (
            <Link
              key={index}
              href={route.href}
              className={route.title === "DOWNLOAD" ? "font-bold transition items-center inline-flex lg:px-5 md:px-3 sm:px-1.5 text-sm text-white bg-[#8D6B94] h-fit py-2 my-18 w-fit rounded-lg hover:bg-[#d096dc]" : "font-bold transition items-center inline-flex lg:px-5 md:px-3 sm:px-1.5 lg:text-base md:text-sm sm:text-xs hover:text-[#8D6B94] text-black"}
            >
              {route.title}
            </Link>
          ))}
        </div>
      </div>

      

      {menuOpen && <MobileMenu toggleMenu={toggleMenu} />}

      <button onClick={toggleMenu} className="sm:hidden bg-[#8D6B94] mr-5 z-50">
        {menuOpen ? (
          <XMarkIcon className="h-7 w-7 fixed bg-[#8D6B94] -translate-x-7 -translate-y-3.5 z-50" />
        ) : (
          <Bars3Icon className="h-7 w-7" />
        )}
      </button>
    </div>
  );
};

const MobileMenu = ({ toggleMenu }: { toggleMenu: () => void }): JSX.Element => {
  return (
    <div className="fixed inset-0 flex flex-col z-40 bg-[#A5BE00] h-fit">
      <div className="flex w-full grow flex-col gap-1 px-4 pb-2 py-12">
        {routes.map((route, index) => (
          <Link
            key={index}
            href={route.href}
            onClick={toggleMenu}
            className={route.title === "DOWNLOAD" ? "hover:bg-[#d096dc] font-bold text-white justify-center inline-flex align-middle text-center h-10 w-full items-center text-2xl transition-colors bg-[#8D6B94] p-5" : "hover:text-[#679436] font-bold text-white inline-flex h-10 w-full items-center text-sm transition-colors"}
            
            
          >
            {route.title}
          </Link>
        ))}
        
      </div>
    </div>
  );
};

export { Navbar };
