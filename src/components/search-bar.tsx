"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

import { Search } from "lucide-react";
import { z } from "zod";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onEnter: (url: string) => void;
}

const urlSchema = z.string().url();

export function SearchBar({
  searchQuery,
  onSearchChange,
  onEnter,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const input = e.currentTarget.value.trim();
      const result = urlSchema.safeParse(input);
      if (result.success) {
        setIsError(false);
        onEnter(input);
      } else {
        setIsError(true);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setIsError(false);
  };

  return (
    <div className="sticky top-0 bg-white z-10 py-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search or paste URL (Press '/' to focus)"
          className={`w-full border px-12 py-3 font-mono text-sm focus:outline-none ${
            isError ? "border-red-500" : ""
          }`}
        />
      </div>
    </div>
  );
}
