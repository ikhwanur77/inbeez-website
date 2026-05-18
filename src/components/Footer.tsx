"use client";
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  // Sembunyikan Footer ini saat Anda sedang berada di dalam Sanity Studio
  if (pathname.startsWith('/studio')) {
    return null;
  }

  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-12 pb-28 md:pb-12 px-2 md:px-6 text-center font-nunito mt-auto">
      <Image 
        src="/main-logo-inbeez-id.png" 
        alt="Inbeez Logo" 
        width={140} 
        height={40} 
        className="mx-auto mb-6 md:mb-8 opacity-40 grayscale" 
      />
      <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm font-medium tracking-tighter sm:tracking-normal whitespace-nowrap md:whitespace-normal">
        © {new Date().getFullYear()} PT. Akselerator Bisnis Jagadigital. All rights reserved.
      </p>
    </footer>
  );
}