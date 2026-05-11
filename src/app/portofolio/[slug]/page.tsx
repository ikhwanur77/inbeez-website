"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '../../../sanity/client'; 
import imageUrlBuilder from '@sanity/image-url';

// 👇 1. IMPORT HOOK BAHASA DARI CONTEXT
import { useLanguage } from '@/context/LanguageContext';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function PortfolioDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  // 👇 2. AMBIL BAHASA DARI PUSAT
  const { lang } = useLanguage();
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- HELPER TEKS BILINGUAL ---
  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  // --- FUNGSI PINTAR: OTOMATIS MENGECILKAN FONT JIKA TEKS PANJANG ---
  const getDynamicTitleClass = (text: string) => {
    if (!text) return "";
    if (text.length > 40) return "text-3xl md:text-4xl lg:text-5xl";
    if (text.length > 25) return "text-4xl md:text-5xl";
    return "text-4xl md:text-6xl";
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Ambil Porto berdasarkan slug ID atau EN, lengkap dengan judul kategori layanannya
        const portfolio = await client.fetch(
          `*[_type == "portfolio" && (slug.id.current == $slug || slug.en.current == $slug)][0]{
            ...,
            "serviceTitle": serviceCategory->title
          }`, 
          { slug }
        );
        setData(portfolio);
      } catch (error) {
        console.error("Gagal memuat detail portofolio:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="font-poppins font-bold text-primary animate-pulse">Loading Project...</div></div>;

  // --- DATA KONTEN ---
  const title = data?.title || "Project Title";
  const category = getTxt(data?.serviceTitle, "General Project");
  const description = getTxt(data?.description, "Informasi project akan segera diperbarui.");
  const mainImage = data?.image ? urlFor(data.image).url() : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000";
  const gallery = data?.gallery || [];

  return (
    <main className="min-h-screen bg-white font-nunito flex flex-col">
      
      {/* NAVBAR LAMA DIHAPUS DARI SINI (Sudah ditangani oleh layout.tsx) */}

      {/* 2. HERO SECTION PORTOFOLIO */}
      <section className="w-full pt-20 pb-10 px-6 md:px-12 bg-white text-center max-w-5xl mx-auto mt-8">
        <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full font-nunito text-xs font-bold tracking-widest mb-6 text-secondary border border-secondary/30 uppercase">
          {category}
        </div>
        {/* Judul dengan ukuran font dinamis */}
        <h1 className={`font-poppins font-bold mb-8 text-primary leading-tight text-balance transition-all duration-300 ${getDynamicTitleClass(title)}`}>
          {title}
        </h1>
        <p className="text-lg text-neutral-dark max-w-3xl mx-auto leading-relaxed">{description}</p>
      </section>

      {/* 3. FOTO UTAMA & DETAIL */}
      <section className="w-full px-6 md:px-12 max-w-7xl mx-auto mb-16">
        <div className="relative w-full h-[400px] md:h-[700px] rounded-[40px] overflow-hidden shadow-2xl">
          <Image src={mainImage} alt={title} fill className="object-cover" priority />
        </div>
      </section>

      {/* 4. GALLERY SECTION (Opsional) */}
      {gallery.length > 0 && (
        <section className="w-full py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-poppins text-3xl font-bold text-primary mb-12 text-center">
              {lang === 'id' ? 'Galeri Proyek' : 'Project Gallery'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img: any, i: number) => (
                <div key={i} className="relative h-80 rounded-[30px] overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500">
                  <Image src={urlFor(img).url()} alt={`Gallery ${i}`} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CTA SECTION */}
      <section className="w-full py-24 px-6 md:px-12 bg-white text-center flex-grow">
        <div className="max-w-3xl mx-auto bg-primary p-12 rounded-[50px] shadow-2xl relative overflow-hidden">
          {/* Efek Visual Background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-10 -mt-10"></div>
          
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
            {lang === 'id' ? 'Ingin Hasil Seperti Ini?' : 'Want Results Like This?'}
          </h2>
          <p className="text-gray-300 mb-10 font-nunito leading-relaxed relative z-10">
            {lang === 'id' 
              ? 'Mari diskusikan bagaimana kami bisa mengimplementasikan strategi serupa untuk pertumbuhan bisnis Anda.' 
              : 'Let’s discuss how we can implement similar strategies for your business growth.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
            {data?.ctaLink && (
              <a href={data.ctaLink} target="_blank" rel="noopener noreferrer" className="bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-lg w-full sm:w-auto">
                {lang === 'id' ? 'Lihat Website Live' : 'View Live Website'}
              </a>
            )}
            <Link href="/#kontak" className="bg-secondary text-neutral-black px-8 py-4 rounded-full font-bold hover:bg-secondary-light transition shadow-lg w-full sm:w-auto">
              {lang === 'id' ? 'Konsultasi Sekarang' : 'Consult Now'}
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER - DISAMAKAN DENGAN HALAMAN LAINNYA */}
      <footer className="w-full bg-white border-t border-gray-100 py-12 px-6 text-center font-nunito mt-auto">
        <Image src="/main-logo-inbeez-id.png" alt="Inbeez Logo" width={140} height={40} className="mx-auto mb-8 opacity-40 grayscale" />
        <p className="text-gray-400 text-sm font-medium">© 2026 PT. Akselerator Bisnis Jagadigital. All rights reserved.</p>
      </footer>
    </main>
  );
}