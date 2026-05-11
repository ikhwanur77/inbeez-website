"use client";
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function MaintenanceScreen({ settings }: { settings: any }) {
  const { lang, setLang } = useLanguage();

  // Helper Teks Bilingual
  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  const title = getTxt(settings?.maintenanceTitle, lang === 'id' ? "Sistem Sedang Diperbarui" : "System Under Maintenance");
  const desc = getTxt(settings?.maintenanceDesc, lang === 'id' ? "Kami sedang melakukan peningkatan infrastruktur untuk memberikan pengalaman terbaik bagi Anda. Silakan kembali beberapa saat lagi." : "We are upgrading our infrastructure to provide you with the best experience. Please check back shortly.");
  const waNumber = settings?.whatsappNumber || "628131161101";

  return (
    <main className="min-h-screen w-full bg-white font-nunito flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Ornamen Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      {/* Switch Bahasa (Kanan Atas) */}
      <div className="absolute top-8 right-8 flex items-center gap-3 z-50">
        <button onClick={() => setLang('id')} className={`text-sm font-poppins transition ${lang === 'id' ? 'font-bold text-primary' : 'font-medium text-gray-400 hover:text-primary'}`}>ID</button>
        <span className="text-gray-300 text-sm">|</span>
        <button onClick={() => setLang('en')} className={`text-sm font-poppins transition ${lang === 'en' ? 'font-bold text-primary' : 'font-medium text-gray-400 hover:text-primary'}`}>EN</button>
      </div>

      <div className="relative z-10 max-w-2xl text-center flex flex-col items-center">
        {/* Logo Grayscale */}
        <Image src="/main-logo-inbeez-id.png" alt="Inbeez Logo" width={180} height={50} className="mb-12 object-contain grayscale opacity-40" />
        
        {/* Icon Animasi Gear */}
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
          <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <h1 className="font-poppins text-3xl md:text-5xl font-bold text-primary mb-6">{title}</h1>
        <p className="text-neutral-dark text-lg leading-relaxed mb-12 max-w-xl">{desc}</p>

        {/* Link WhatsApp Darurat */}
        <a 
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(lang === 'id' ? "Halo Inbeez, saya butuh bantuan darurat." : "Hello Inbeez, I need urgent assistance.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-secondary text-neutral-black font-bold font-poppins px-8 py-4 rounded-full shadow-lg hover:scale-105 transition active:scale-95 flex items-center gap-2"
        >
          {lang === 'id' ? 'Hubungi Kami via WhatsApp' : 'Contact Us via WhatsApp'}
        </a>
      </div>
    </main>
  );
}