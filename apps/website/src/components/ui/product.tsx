// IM NOT DELETING THIS BUT DON'T USE THIS COMPONENT, IT WILL CRASH THE PROGRAM LMAO

"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Product() {
  // State to store fetched products and selected value
  const [products, setProducts] = useState<{ htsno: string; _id: string }[]>([]);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("/api/tariffs");
      const data = await res.json();
      if ((data._id!="" || data._id!=null) && (data.htsno!="" || data.htsno!=null) && (data.description!="" || data.description!=null) && (data.general!="" || data.general!=null) && (data.special!="" || data.special!=null) && (data.other!="" || data.other!=null)) {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-white text-black border-black"
        >
          {value
            ? products.find((product) => product.htsno === value)?.htsno
            : "Select product..."}

          <ChevronsUpDown className="opacity-50 text-black" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white text-black border border-black">
        <Command>
          <CommandInput
            placeholder="Search product..."
            className="h-9 bg-white text-black"
          />
          <CommandList>
            <CommandEmpty className="text-black">No product found.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product._id.toString()}
                  value={product.htsno}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="text-black"
                >
                  {product.htsno}
                  <Check
                    className={cn(
                      "ml-auto text-black",
                      value === product.htsno ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}