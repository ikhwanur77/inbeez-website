"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '../../sanity/client'; 
import imageUrlBuilder from '@sanity/image-url';

// 👇 1. IMPORT HOOK BAHASA DARI CONTEXT
import { useLanguage } from '@/context/LanguageContext';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function PortfolioCatalog() {
  // 👇 2. AMBIL BAHASA DARI PUSAT
  const { lang } = useLanguage();
  
  const [settingsData, setSettingsData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [portfoliosData, setPortfoliosData] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // --- HELPER TEKS BILINGUAL ---
  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const settings = await client.fetch(`*[_type == "siteSettings"][0]`);
        // Filter diurutkan sesuai urutan layanan di Sanity
        const services = await client.fetch(`*[_type == "service"] | order(order asc)`);
        
        // Ambil porto lengkap dengan ID kategori untuk filter
        const ports = await client.fetch(`*[_type == "portfolio"]{
          ...,
          "catId": serviceCategory._ref,
          "catTitle": serviceCategory->title
        }`);

        setSettingsData(settings);
        setServicesData(services);
        setPortfoliosData(ports);
      } catch (error) {
        console.error("Gagal memuat katalog portofolio:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- LOGIKA WHATSAPP ---
  const waNumber = "628131161101"; 
  const waText = lang === 'id' 
    ? "Halo Inbeez, saya melihat portofolio Anda dan tertarik untuk diskusi lebih lanjut mengenai bisnis saya." 
    : "Hello Inbeez, I saw your portfolio and am interested in discussing further about my business.";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  // --- LOGIKA FILTER ---
  const filteredPorts = activeFilter === 'all' 
    ? portfoliosData 
    : portfoliosData.filter(p => p.catId === activeFilter);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="font-poppins font-bold text-primary animate-pulse">Memuat Portofolio...</div></div>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-white scroll-smooth overflow-hidden font-nunito">
      
      {/* NAVBAR LAMA DIHAPUS DARI SINI (Sudah ditangani oleh layout.tsx) */}

      {/* 2. HERO SECTION */}
      <section className="w-full pt-24 pb-12 px-6 md:px-12 text-center bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full text-xs font-bold tracking-widest mb-6 text-secondary border border-secondary/30 uppercase">
            {lang === 'id' ? 'Karya Kami' : 'Our Work'}
          </div>
          <h1 className="font-poppins text-4xl md:text-6xl font-bold mb-6 text-primary leading-tight">
            {getTxt(settingsData?.sectionPortoTitle, lang === 'id' ? "Karya Terbaik" : "Our Best Works")}
          </h1>
          <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
            {getTxt(settingsData?.sectionPortoDesc, lang === 'id' ? "Bukti nyata dari strategi digital yang kami implementasikan untuk klien." : "Real evidence of digital strategies we have implemented for our clients.")}
          </p>
        </div>
      </section>

      {/* 3. FILTER BUTTONS */}
      <section className="w-full py-8 px-6 md:px-12 bg-gray-50 sticky top-[72px] z-40 shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-3">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${activeFilter === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white text-neutral-dark border border-gray-200 hover:border-primary'}`}
          >
            {lang === 'id' ? 'Semua' : 'All'}
          </button>
          {servicesData.map((s: any) => (
            <button 
              key={s._id}
              onClick={() => setActiveFilter(s._id)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${activeFilter === s._id ? 'bg-primary text-white shadow-md' : 'bg-white text-neutral-dark border border-gray-200 hover:border-primary'}`}
            >
              {getTxt(s.title)}
            </button>
          ))}
        </div>
      </section>

      {/* 4. PORTOFOLIO GRID */}
      <section className="w-full py-16 px-6 md:px-12 min-h-[500px]">
        <div className="max-w-7xl mx-auto">
          {filteredPorts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPorts.map((p: any, i: number) => (
                <Link key={i} href={`/portofolio/${p.slug?.[lang]?.current || p.slug?.id?.current}`} className="group relative h-[450px] rounded-[40px] overflow-hidden shadow-lg hover:shadow-2xl transition duration-500">
                  <Image 
                    src={p.image ? urlFor(p.image).url() : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800"} 
                    alt={p.title} fill className="object-cover group-hover:scale-110 transition duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition duration-500">
                    <span className="text-secondary font-bold tracking-widest uppercase mb-3 text-xs">{getTxt(p.catTitle)}</span>
                    <h3 className="text-white font-poppins text-2xl font-bold leading-tight mb-4">{p.title}</h3>
                    <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition duration-500">{getTxt(p.description)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 font-bold italic">{lang === 'id' ? 'Belum ada proyek untuk kategori ini.' : 'No projects found for this category.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="w-full py-24 px-6 md:px-12 bg-gray-50">
        <div className="max-w-5xl mx-auto bg-primary rounded-[50px] p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <h2 className="font-poppins text-3xl md:text-5xl font-bold mb-8 relative z-10">{lang === 'id' ? 'Siap Menciptakan Sukses Berikutnya?' : 'Ready to Create the Next Success?'}</h2>
          <p className="text-gray-300 mb-10 max-w-2xl mx-auto relative z-10">{lang === 'id' ? 'Mari berkolaborasi membangun ekosistem digital yang kuat untuk bisnis Anda.' : 'Let’s collaborate to build a strong digital ecosystem for your business.'}</p>
          
          {/* Tombol Diubah ke WhatsApp */}
          <a 
            href={waLink} 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-neutral-black px-10 py-4 rounded-full font-bold hover:bg-secondary-light transition shadow-xl relative z-10 inline-block"
          >
            {lang === 'id' ? 'Mulai Konsultasi Gratis' : 'Start Free Consultation'}
          </a>
        </div>
      </section>

      {/* FOOTER - DISAMAKAN DENGAN HALAMAN LAYANAN */}
      <footer className="w-full bg-white border-t border-gray-100 py-12 px-6 text-center font-nunito mt-auto">
        <Image src="/main-logo-inbeez-id.png" alt="Inbeez Logo" width={140} height={40} className="mx-auto mb-8 opacity-40 grayscale" />
        <p className="text-gray-400 text-sm font-medium">© 2026 PT. Akselerator Bisnis Jagadigital. All rights reserved.</p>
      </footer>
    </main>
  );
}