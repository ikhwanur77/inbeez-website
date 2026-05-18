"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '../../sanity/client'; 
import imageUrlBuilder from '@sanity/image-url';
import { useLanguage } from '@/context/LanguageContext';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function PortfolioCatalog() {
  const { lang } = useLanguage();
  
  const [settingsData, setSettingsData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [portfoliosData, setPortfoliosData] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const settings = await client.fetch(`*[_type == "siteSettings"][0]`);
        const services = await client.fetch(`*[_type == "service"] | order(order asc)`);
        
        // 👇 Kueri GROQ baru untuk mengambil array kategori
        const ports = await client.fetch(`*[_type == "portfolio"]{
          ...,
          "categories": serviceCategory[]->{
            _id,
            title
          }
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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  const waNumber = "628131161101"; 
  const waText = lang === 'id' 
    ? "Halo Inbeez, saya melihat portofolio Anda dan tertarik untuk diskusi lebih lanjut mengenai bisnis saya." 
    : "Hello Inbeez, I saw your portfolio and am interested in discussing further about my business.";
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  // 👇 Logika filter baru untuk mencocokkan array kategori
  const filteredPorts = activeFilter === 'all' 
    ? portfoliosData 
    : portfoliosData.filter(p => p.categories && p.categories.some((c: any) => c._id === activeFilter));

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="font-poppins font-bold text-primary animate-pulse">Memuat Portofolio...</div></div>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-white scroll-smooth overflow-hidden font-nunito">
      
      {/* HERO SECTION */}
      <section className="w-full pt-20 md:pt-24 pb-12 px-6 md:px-12 text-center bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full text-xs font-bold tracking-widest mb-6 text-secondary border border-secondary/30 uppercase">
            {lang === 'id' ? 'Karya Kami' : 'Our Work'}
          </div>
          <h1 className="font-poppins text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-primary leading-tight text-balance">
            {getTxt(settingsData?.sectionPortoTitle, lang === 'id' ? "Bukti Pertumbuhan Nyata" : "Real Growth Evidence")}
          </h1>
          <p className="text-base md:text-lg text-neutral-dark max-w-2xl mx-auto text-balance">
            {getTxt(settingsData?.sectionPortoDesc, lang === 'id' ? "Kumpulan proyek di mana strategi dan teknologi kami berkolaborasi menciptakan dampak positif bagi klien." : "A collection of projects where our strategy and technology collaborate to create positive impacts for clients.")}
          </p>
        </div>
      </section>

      {/* FILTER BUTTONS */}
      <section className="w-full py-6 px-4 md:px-12 bg-white sticky top-[72px] z-40 border-b border-gray-100 pb-4 md:pb-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <button 
            onClick={scrollLeft} 
            className="hidden md:flex shrink-0 w-10 h-10 rounded-full border border-gray-200 bg-white items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition shadow-sm"
            aria-label="Scroll Left"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-2 md:gap-3 pb-2 pt-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
          >
            <button 
              onClick={() => setActiveFilter('all')}
              className={`whitespace-nowrap flex-shrink-0 px-5 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all duration-300 ${activeFilter === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white text-neutral-dark border border-gray-200 hover:border-primary'}`}
            >
              {lang === 'id' ? 'Semua Kategori' : 'All Categories'}
            </button>
            {servicesData.map((s: any) => (
              <button 
                key={s._id}
                onClick={() => setActiveFilter(s._id)}
                className={`whitespace-nowrap flex-shrink-0 px-5 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all duration-300 ${activeFilter === s._id ? 'bg-primary text-white shadow-md' : 'bg-white text-neutral-dark border border-gray-200 hover:border-primary'}`}
              >
                {getTxt(s.title)}
              </button>
            ))}
          </div>

          <button 
            onClick={scrollRight} 
            className="hidden md:flex shrink-0 w-10 h-10 rounded-full border border-gray-200 bg-white items-center justify-center text-gray-500 hover:text-primary hover:border-primary transition shadow-sm"
            aria-label="Scroll Right"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </section>

      {/* PORTOFOLIO GRID */}
      <section className="w-full py-12 md:py-16 px-6 md:px-12 min-h-[500px] bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto">
          {filteredPorts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPorts.map((p: any, i: number) => (
                <Link key={i} href={`/portofolio/${p.slug?.[lang]?.current || p.slug?.id?.current}`} className="group relative h-[350px] md:h-[450px] rounded-[30px] md:rounded-[40px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition duration-500">
                  <Image 
                    src={p.image ? urlFor(p.image).url() : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800"} 
                    alt={p.title} fill className="object-cover group-hover:scale-110 transition duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 md:p-10 flex flex-col justify-end translate-y-2 md:translate-y-4 group-hover:translate-y-0 transition duration-500">
                    {/* 👇 Teks kategori sekarang otomatis digabung dengan koma jika lebih dari 1 */}
                    <span className="text-secondary font-bold tracking-widest uppercase mb-2 md:mb-3 text-[10px] md:text-xs">
                      {p.categories ? p.categories.map((c: any) => getTxt(c.title)).join(' • ') : 'Uncategorized'}
                    </span>
                    <h3 className="text-white font-poppins text-xl md:text-2xl font-bold leading-tight mb-2 md:mb-4">{p.title}</h3>
                    <p className="text-gray-300 text-xs md:text-sm line-clamp-2 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition duration-500">{getTxt(p.description)}</p>
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

      {/* CTA SECTION */}
      <section className="w-full py-16 md:py-24 px-4 md:px-12 bg-white">
        <div className="max-w-5xl mx-auto bg-primary rounded-[40px] md:rounded-[50px] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <h2 className="font-poppins text-2xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 relative z-10 text-balance">
            {lang === 'id' ? 'Siap Menciptakan Sukses Berikutnya?' : 'Ready to Create the Next Success?'}
          </h2>
          <p className="text-sm md:text-base text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto relative z-10 text-balance">
            {lang === 'id' ? 'Mari berkolaborasi membangun ekosistem digital yang kuat untuk bisnis Anda.' : 'Let’s collaborate to build a strong digital ecosystem for your business.'}
          </p>
          <a 
            href={waLink} 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-neutral-black px-8 md:px-10 py-3.5 md:py-4 rounded-full font-bold hover:bg-secondary-light transition shadow-xl relative z-10 inline-block text-sm md:text-base w-full md:w-auto"
          >
            {lang === 'id' ? 'Mulai Konsultasi Gratis' : 'Start Free Consultation'}
          </a>
        </div>
      </section>
    </main>
  );
}