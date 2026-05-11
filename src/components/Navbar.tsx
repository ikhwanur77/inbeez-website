"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation'; 
import { client } from '@/sanity/client'; 
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const [services, setServices] = useState<any[]>([]);
  const pathname = usePathname(); // Ambil URL saat ini

  // Helper untuk menampilkan teks bilingual
  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  useEffect(() => {
    async function fetchNavbarData() {
      try {
        const data = await client.fetch(`*[_type == "service"] | order(order asc)`);
        setServices(data);
      } catch (error) {
        console.error("Gagal memuat menu navbar:", error);
      }
    }
    fetchNavbarData();
  }, []);

  // 👇 LOGIKA PENTING: Sembunyikan Navbar jika url berawalan "/studio" ATAU "/review"
  if (pathname.startsWith('/studio') || pathname.startsWith('/review')) {
    return null;
  }

  // --- LOGIKA WHATSAPP ---
  const waNumber = "628131161101"; // Pastikan ini nomor WhatsApp bisnis Anda
  const waText = lang === 'id' 
    ? "Halo Inbeez, saya tertarik dan ingin konsultasi lebih lanjut mengenai layanan Anda." 
    : "Hello Inbeez, I am interested and would like to consult further about your services.";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  return (
    <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
      {/* --- LOGO --- */}
      <Link href="/">
        <Image 
          src="/main-logo-inbeez-id.png" 
          alt="Inbeez.id Logo" 
          width={150} 
          height={40} 
          className="object-contain" 
          priority 
        />
      </Link>

      {/* --- MENU DESKTOP --- */}
      <div className="hidden lg:flex space-x-8 font-nunito font-semibold text-neutral-dark items-center">
        <Link href="/" className="hover:text-primary transition">Home</Link>
        
        {/* Dropdown Layanan Dinamis */}
        <div className="relative group py-2">
          <Link href="/layanan" className="hover:text-primary transition flex items-center gap-1">
            {lang === 'id' ? 'Layanan' : 'Services'} 
            <svg className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          <div className="absolute top-full left-0 mt-0 w-64 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col overflow-hidden">
            {services.map((s, i) => (
              <Link 
                key={i} 
                href={`/layanan/${s.slug?.[lang]?.current || s.slug?.id?.current}`} 
                className="px-5 py-3 hover:bg-gray-50 hover:text-primary text-sm border-b border-gray-50 last:border-0 transition-colors"
              >
                {getTxt(s.title)}
              </Link>
            ))}
          </div>
        </div>

        {/* Link Portofolio (Bukan Dropdown) */}
        <Link href="/portofolio" className="hover:text-primary transition">
          Portfolio
        </Link>

        {/* Link Standar */}
        <Link href="/tentang-kami" className="hover:text-primary transition">
          {lang === 'id' ? 'Tentang Kami' : 'About Us'}
        </Link>
        <Link href="/testimoni" className="hover:text-primary transition">
          {lang === 'id' ? 'Testimoni' : 'Testimonials'}
        </Link>
        <Link href="/artikel" className="hover:text-primary transition">
          {lang === 'id' ? 'Artikel' : 'Articles'}
        </Link>
        
        {/* Toggle Bahasa */}
        <div className="flex items-center gap-3 border-l-2 border-gray-200 pl-8 ml-2">
          <button 
            onClick={() => setLang('id')} 
            className={`font-poppins text-sm transition ${lang === 'id' ? 'font-bold text-primary' : 'font-medium text-gray-400 hover:text-primary'}`}
          >
            ID
          </button>
          <span className="text-gray-300 text-sm">|</span>
          <button 
            onClick={() => setLang('en')} 
            className={`font-poppins text-sm transition ${lang === 'en' ? 'font-bold text-primary' : 'font-medium text-gray-400 hover:text-primary'}`}
          >
            EN
          </button>
        </div>

        {/* Tombol CTA Utama (Direct to WhatsApp) */}
        <a 
          href={waLink}
          target="_blank"
          rel="noopener noreferrer" 
          className="bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary-light transition shadow-md font-poppins text-sm"
        >
          {lang === 'id' ? 'Konsultasi Gratis' : 'Free Consultation'}
        </a>
      </div>
    </nav>
  );
}