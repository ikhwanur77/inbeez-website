"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '../../../sanity/client'; 
import imageUrlBuilder from '@sanity/image-url';

// 1. IMPORT HOOK BAHASA DARI CONTEXT
import { useLanguage } from '@/context/LanguageContext';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function ServiceDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  // 2. AMBIL BAHASA DARI PUSAT
  const { lang } = useLanguage();

  const [data, setData] = useState<any>(null);
  const [relatedPortos, setRelatedPortos] = useState<any[]>([]);
  const [relatedTestis, setRelatedTestis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- HELPER TEKS BILINGUAL ---
  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  // --- FUNGSI PINTAR (DIPERBAIKI UNTUK MOBILE) ---
  const getDynamicTitleClass = (text: string, type: 'hero' | 'card') => {
    if (!text) return "";
    if (type === 'hero') {
      // Perbaikan: Ukuran default (mobile) dikecilkan
      if (text.length > 40) return "text-2xl md:text-4xl lg:text-5xl";
      if (text.length > 25) return "text-3xl md:text-5xl";
      return "text-3xl md:text-6xl";
    } else {
      // Perbaikan: Kartu layanan juga ikut dikecilkan di mobile
      if (text.length > 35) return "text-sm md:text-base tracking-tight leading-tight";
      if (text.length > 22) return "text-base md:text-lg tracking-tight leading-tight";
      return "text-lg md:text-xl leading-tight";
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const service = await client.fetch(
          `*[_type == "service" && (slug.id.current == $slug || slug.en.current == $slug)][0]`, 
          { slug }
        );

        if (service) {
          setData(service);
          
          const portos = await client.fetch(
            `*[_type == "portfolio" && references($id)][0...3]`, 
            { id: service._id }
          );
          const testis = await client.fetch(
            `*[_type == "testimonial" && references($id)][0...3]`, 
            { id: service._id }
          );

          setRelatedPortos(portos);
          setRelatedTestis(testis);
        }
      } catch (error) {
        console.error("Gagal memuat detail layanan:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="font-poppins font-bold text-primary animate-pulse">Loading Detail...</div></div>;

  const titleText = getTxt(data?.title, "Detail Layanan");
  const description = getTxt(data?.description, "Informasi lengkap mengenai layanan kami akan segera tersedia.");
  const imageSrc = data?.image ? urlFor(data.image).url() : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000";

  // --- LOGIKA GRID FLEKSIBEL ---
  const subServicesCount = data?.subServices?.length || 0;
  const gridContainerClass = subServicesCount === 1 
    ? "grid-cols-1 max-w-2xl mx-auto" 
    : subServicesCount === 2 
    ? "grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto" 
    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto";

  return (
    <main className="min-h-screen bg-white font-nunito flex flex-col">
      
      {/* 2. HERO SECTION LAYANAN */}
      {/* Perbaikan: Padding top dikurangi sedikit untuk layar HP */}
      <section className="relative w-full py-16 md:py-24 px-6 md:px-12 bg-primary text-white">
        <div className="absolute inset-0 opacity-20"><Image src={imageSrc} alt="Hero" fill className="object-cover grayscale" /></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className={`font-poppins font-bold mb-4 md:mb-6 transition-all duration-300 ${getDynamicTitleClass(titleText, 'hero')}`}>
            {titleText}
          </h1>
          {/* Perbaikan: Ukuran text deskripsi diubah ke text-base md:text-lg */}
          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto text-balance">{description}</p>
        </div>
      </section>

      {/* 3. SUB LAYANAN GRID FLEKSIBEL */}
      {data?.subServices && (
        <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Perbaikan: Ukuran judul diubah ke text-2xl md:text-3xl */}
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-primary mb-8 md:mb-12 text-center">
              {lang === 'id' ? 'Pilihan Layanan' : 'Service Options'}
            </h2>
            
            {/* Grid Container dengan logika fleksibel */}
            <div className={`grid gap-6 md:gap-8 items-stretch ${gridContainerClass}`}>
              {data.subServices.map((sub: any, i: number) => {
                const subTitleText = getTxt(sub.title);
                
                return (
                  <div key={i} className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-[35px] shadow-sm border border-gray-100 hover:shadow-xl transition flex flex-col group overflow-hidden">
                    
                    {/* Bagian Gambar */}
                    <div className="w-full h-48 md:h-56 relative rounded-2xl overflow-hidden mb-6 md:mb-8 bg-gray-100 flex-shrink-0">
                      {sub.image ? (
                        <Image 
                          src={urlFor(sub.image).url()} 
                          alt={getTxt(sub.image?.alt, subTitleText)} 
                          fill 
                          className="object-cover group-hover:scale-105 transition duration-700" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium text-sm border-2 border-dashed border-gray-200 rounded-2xl text-center px-4">
                          {lang === 'id' ? 'Ilustrasi Belum Tersedia' : 'Illustration Not Available'}
                        </div>
                      )}
                    </div>

                    {/* Judul Sub-Layanan: Rata Tengah */}
                    <h3 className={`font-poppins font-bold text-primary mb-3 md:mb-4 transition-all duration-300 text-center ${getDynamicTitleClass(subTitleText, 'card')}`}>
                      {subTitleText}
                    </h3>
                    
                    {/* Deskripsi: Rata Tengah */}
                    <p className="text-neutral-dark mb-6 md:mb-8 text-sm md:text-base leading-relaxed text-center">
                      {getTxt(sub.description)}
                    </p>

                    {/* Label: Yang Anda Dapatkan */}
                    <div className="mb-4 text-xs font-bold uppercase tracking-widest text-secondary border-b border-gray-100 pb-2">
                      {lang === 'id' ? 'Yang Anda Dapatkan' : 'What You Get'}
                    </div>
                    
                    {/* Fitur Utama */}
                    <ul className="mb-8 md:mb-10 space-y-3 flex-grow">
                      {sub.features?.map((f: any, j: number) => (
                        <li key={j} className="flex items-start text-sm md:text-base font-semibold text-neutral-dark">
                          <span className="text-secondary mr-3 flex-shrink-0 mt-0.5 md:mt-0">✓</span> 
                          <span className="leading-tight">{getTxt(f)}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tombol CTA */}
                    <a 
                      href={`https://wa.me/628131161101?text=${encodeURIComponent(getTxt(sub.waDefaultText, "Halo Inbeez..."))}`}
                      target="_blank"
                      className="w-full bg-secondary text-neutral-black text-center font-poppins font-bold py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-secondary-light transition mt-auto flex-shrink-0 text-sm md:text-base"
                    >
                      {lang === 'id' ? 'Konsultasi via WhatsApp' : 'Consult via WhatsApp'}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. PORTOFOLIO TERKAIT */}
      {relatedPortos.length > 0 && (
        <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-primary mb-8 md:mb-12">{lang === 'id' ? 'Hasil Kerja Kami' : 'Our Work Results'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedPortos.map((p: any, i: number) => (
                <Link key={i} href={`/portofolio/${p.slug?.[lang]?.current || p.slug?.id?.current}`} className="relative h-64 md:h-80 rounded-[24px] md:rounded-[30px] overflow-hidden group">
                  <Image src={p.image ? urlFor(p.image).url() : ""} alt="Porto" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/60 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition">
                    <h4 className="text-white font-bold">{p.title}</h4>
                    <p className="text-gray-300 text-xs">{getTxt(p.description)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. TESTIMONI TERKAIT */}
      {relatedTestis.length > 0 && (
        <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-primary text-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">{lang === 'id' ? 'Kepuasan Klien' : 'Client Success'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {relatedTestis.map((t: any, i: number) => (
                <div key={i} className="bg-white/10 p-6 md:p-8 rounded-[24px] md:rounded-[30px] border border-white/10">
                  <p className="italic text-sm md:text-base mb-6">"{getTxt(t.quote)}"</p>
                  <h5 className="font-bold">{t.name}</h5>
                  <p className="text-gray-400 text-xs md:text-sm">{getTxt(t.position)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER - Perbaikan Padding Bawah Khusus Mobile dan Ukuran Font 10px */}
    </main>
  );
}