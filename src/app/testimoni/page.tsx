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

export default function TestimonialCatalog() {
  // 👇 2. AMBIL BAHASA DARI PUSAT
  const { lang } = useLanguage();
  
  const [settingsData, setSettingsData] = useState<any>(null);
  const [testiData, setTestiData] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(6); // Jumlah testimoni awal yang tampil
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
        const testis = await client.fetch(`*[_type == "testimonial"] | order(_createdAt desc)`);

        setSettingsData(settings);
        setTestiData(testis);
      } catch (error) {
        console.error("Gagal memuat katalog testimoni:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- LOGIKA LOAD MORE ---
  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6); // Tambah 6 data lagi setiap diklik
  };

  // --- LOGIKA WHATSAPP ---
  const waNumber = "628131161101"; 
  const waText = lang === 'id' 
    ? "Halo Inbeez, saya sangat terkesan dengan ulasan klien Anda dan ingin berdiskusi mengenai strategi digital untuk bisnis saya." 
    : "Hello Inbeez, I am very impressed with your client reviews and would like to discuss digital strategies for my business.";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  // --- DATA DUMMY (Fallback) ---
  const dummyTestimonials = [
    { name: "Budi Santoso", position: {id: "Direktur, Retail Corp", en: "Director, Retail Corp"}, quote: {id: "Inbeez membantu efisiensi operasional kami naik drastis.", en: "Inbeez helped our operational efficiency increase drastically."} },
    { name: "Siska Amelia", position: {id: "CMO, Klinik Estetika", en: "CMO, Aesthetic Clinic"}, quote: {id: "ROI iklan Google Ads kami naik tajam. Cost per lead turun 40%!", en: "Our Google Ads ROI rose sharply. Cost per lead dropped 40%!"} }
  ];

  const displayTestis = testiData.length > 0 ? testiData : dummyTestimonials;
  const currentVisible = displayTestis.slice(0, visibleCount);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="font-poppins font-bold text-primary animate-pulse">Memuat Testimoni...</div></div>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 scroll-smooth overflow-hidden font-nunito">
      
      {/* NAVBAR LAMA DIHAPUS DARI SINI (Sudah ditangani oleh layout.tsx) */}

      {/* 2. HERO SECTION */}
      {/* Perbaikan: Ukuran font, padding, dan text-balance disesuaikan */}
      <section className="w-full pt-20 md:pt-24 pb-10 md:pb-12 px-6 md:px-12 text-center bg-white border-b border-gray-100 mt-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full text-[10px] md:text-xs font-bold tracking-widest mb-4 md:mb-6 text-secondary border border-secondary/30 uppercase">
            {lang === 'id' ? 'Testimoni Klien' : 'Client Reviews'}
          </div>
          <h1 className="font-poppins text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-primary leading-tight text-balance">
            {getTxt(settingsData?.sectionTestiTitle, lang === 'id' ? "Apa Kata Mereka?" : "What They Say?")}
          </h1>
          <p className="text-base md:text-lg text-neutral-dark max-w-2xl mx-auto text-balance">
            {getTxt(settingsData?.sectionTestiDesc, lang === 'id' ? "Kepercayaan yang dibangun melalui dedikasi dan hasil nyata bagi pertumbuhan bisnis klien kami." : "Trust built through dedication and real results for our clients' business growth.")}
          </p>
        </div>
      </section>

      {/* 3. TESTIMONIAL GRID */}
      <section className="w-full py-12 md:py-16 px-6 md:px-12 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentVisible.map((t: any, i: number) => (
              /* Perbaikan: Padding kartu diperkecil untuk mobile, rounded disesuaikan */
              <div key={i} className="bg-white p-6 md:p-10 rounded-[24px] md:rounded-[40px] shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl transition duration-500 group">
                <div>
                  <div className="flex gap-1 text-secondary text-lg md:text-xl mb-4 md:mb-6">
                    {"★★★★★".split("").map((star, idx) => <span key={idx}>{star}</span>)}
                  </div>
                  {/* Perbaikan: Ukuran teks quote dikecilkan ke text-sm di mobile */}
                  <p className="text-neutral-dark italic leading-relaxed mb-6 md:mb-8 text-sm md:text-lg">
                    "{getTxt(t.quote)}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 relative rounded-full overflow-hidden bg-primary/10 border-2 border-secondary/30 flex-shrink-0">
                    {t.clientPhoto ? (
                      <Image src={urlFor(t.clientPhoto).url()} alt={t.name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg md:text-xl">{t.name.charAt(0)}</div>
                    )}
                  </div>
                  <div>
                    <h5 className="font-poppins font-bold text-primary text-sm md:text-base">{t.name}</h5>
                    <p className="text-gray-400 text-[10px] md:text-xs font-semibold uppercase tracking-wider">{getTxt(t.position)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 4. LOAD MORE BUTTON */}
          {visibleCount < displayTestis.length && (
            <div className="mt-12 md:mt-16 text-center">
              <button 
                onClick={handleLoadMore}
                className="px-8 md:px-10 py-3.5 md:py-4 rounded-full border-2 border-primary text-primary font-poppins font-bold text-sm md:text-base hover:bg-primary hover:text-white transition duration-300 shadow-md"
              >
                {lang === 'id' ? 'Muat Lebih Banyak' : 'Load More Reviews'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. CTA SECTION */}
      {/* Perbaikan: Padding container, rounded, dan ukuran teks disesuaikan untuk mobile */}
      <section className="w-full py-16 md:py-24 px-4 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto bg-primary rounded-[30px] md:rounded-[50px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-32 h-32 md:w-40 md:h-40 bg-secondary/5 rounded-full -ml-16 -mt-16 md:-ml-20 md:-mt-20"></div>
          <h2 className="font-poppins text-2xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 relative z-10 text-balance">
            {lang === 'id' ? 'Siap Menjadi Kisah Sukses Berikutnya?' : 'Ready to be the Next Success Story?'}
          </h2>
          {/* Perbaikan: Tombol CTA diubah agar bisa mengambil 100% lebar layar (w-full) di mobile jika perlu */}
          <a 
            href={waLink} 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-neutral-black px-8 md:px-12 py-4 md:py-5 rounded-full font-bold hover:bg-secondary-light transition shadow-xl relative z-10 inline-block text-sm md:text-lg w-full md:w-auto"
          >
            {lang === 'id' ? 'Konsultasi Gratis Sekarang' : 'Free Consultation Now'}
          </a>
        </div>
      </section>

      {/* FOOTER - Perbaikan Padding Bawah Khusus Mobile dan Ukuran Font 10px */}
      <footer className="w-full bg-white border-t border-gray-100 pt-12 pb-28 md:pb-12 px-2 md:px-6 text-center font-nunito mt-auto">
        <Image src="/main-logo-inbeez-id.png" alt="Inbeez Logo" width={140} height={40} className="mx-auto mb-6 md:mb-8 opacity-40 grayscale" />
        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm font-medium tracking-tighter sm:tracking-normal whitespace-nowrap md:whitespace-normal">
          © 2026 PT. Akselerator Bisnis Jagadigital. All rights reserved.
        </p>
      </footer>
    </main>
  );
}