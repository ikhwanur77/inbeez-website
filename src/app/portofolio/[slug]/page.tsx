"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '../../../sanity/client'; 
import imageUrlBuilder from '@sanity/image-url';
import { useLanguage } from '@/context/LanguageContext';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function PortfolioDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { lang } = useLanguage();
  
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  const getDynamicTitleClass = (text: string) => {
    if (!text) return "";
    if (text.length > 40) return "text-2xl md:text-4xl lg:text-5xl";
    if (text.length > 25) return "text-3xl md:text-5xl";
    return "text-3xl md:text-6xl";
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const portfolio = await client.fetch(
          `*[_type == "portfolio" && (slug.id.current == $slug || slug.en.current == $slug)][0]{
            ...,
            "categories": serviceCategory[]->title
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

  const title = data?.title || "Project Title";
  // 👇 Menggabungkan semua nama kategori yang dipilih dengan titik bullet
  const category = data?.categories ? data.categories.map((c: any) => getTxt(c)).join(' • ') : "General Project";
  const description = getTxt(data?.description, "Informasi project akan segera diperbarui.");
  const mainImage = data?.image ? urlFor(data.image).url() : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000";
  const clientLogo = data?.clientLogo ? urlFor(data.clientLogo).url() : null; 
  const gallery = data?.gallery || [];

  return (
    <main className="min-h-screen bg-white font-nunito flex flex-col">
      <section className="w-full pt-16 md:pt-20 pb-8 md:pb-10 px-6 md:px-12 bg-white text-center max-w-5xl mx-auto mt-4 md:mt-8">
        <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full font-nunito text-[10px] md:text-xs font-bold tracking-widest mb-4 md:mb-6 text-secondary border border-secondary/30 uppercase">
          {category}
        </div>
        <h1 className={`font-poppins font-bold mb-4 md:mb-8 text-primary leading-tight text-balance transition-all duration-300 ${getDynamicTitleClass(title)}`}>
          {title}
        </h1>
        <p className="text-base md:text-lg text-neutral-dark max-w-3xl mx-auto leading-relaxed whitespace-pre-line">{description}</p>

        {clientLogo && (
          <div className="mt-8 md:mt-12 flex flex-col items-center justify-center animate-fade-in">
            <p className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">
              {lang === 'id' ? 'Klien Kami' : 'Our Client'}
            </p>
            <div className="relative w-32 h-16 md:w-40 md:h-20 opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500">
              <Image src={clientLogo} alt={`${title} Client Logo`} fill className="object-contain" />
            </div>
          </div>
        )}
      </section>

      <section className="w-full px-4 md:px-12 max-w-7xl mx-auto mb-12 md:mb-16">
        <div className="relative w-full h-64 md:h-[600px] lg:h-[700px] rounded-[24px] md:rounded-[40px] overflow-hidden shadow-xl md:shadow-2xl">
          <Image src={mainImage} alt={title} fill className="object-cover" priority />
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="w-full py-12 md:py-16 px-6 md:px-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-poppins text-2xl md:text-3xl font-bold text-primary mb-8 md:mb-12 text-center">
              {lang === 'id' ? 'Galeri Proyek' : 'Project Gallery'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {gallery.map((img: any, i: number) => (
                <div key={i} className="relative h-64 md:h-80 rounded-[20px] md:rounded-[30px] overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500">
                  <Image src={urlFor(img).url()} alt={`Gallery ${i}`} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="w-full py-16 md:py-24 px-4 md:px-12 bg-white text-center flex-grow">
        <div className="max-w-3xl mx-auto bg-primary p-8 md:p-12 rounded-[30px] md:rounded-[50px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-10 -mt-10"></div>
          <h2 className="font-poppins text-2xl md:text-4xl font-bold text-white mb-4 md:mb-6 relative z-10 text-balance">
            {lang === 'id' ? 'Ingin Hasil Seperti Ini?' : 'Want Results Like This?'}
          </h2>
          <p className="text-sm md:text-base text-gray-300 mb-8 md:mb-10 font-nunito leading-relaxed relative z-10 text-balance">
            {lang === 'id' 
              ? 'Mari diskusikan bagaimana kami bisa mengimplementasikan strategi serupa untuk pertumbuhan bisnis Anda.' 
              : 'Let’s discuss how we can implement similar strategies for your business growth.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
            {data?.ctaLink && (
              <a href={data.ctaLink} target="_blank" rel="noopener noreferrer" className="bg-white text-primary px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold hover:bg-gray-100 transition shadow-lg w-full sm:w-auto text-sm md:text-base">
                {lang === 'id' ? 'Lihat Website Live' : 'View Live Website'}
              </a>
            )}
            <Link href="/#kontak" className="bg-secondary text-neutral-black px-6 md:px-8 py-3.5 md:py-4 rounded-full font-bold hover:bg-secondary-light transition shadow-lg w-full sm:w-auto text-sm md:text-base">
              {lang === 'id' ? 'Konsultasi Sekarang' : 'Consult Now'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}