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

export default function ServicesCatalog() {
  // 👇 2. AMBIL BAHASA DARI PUSAT (Bukan pakai useState lokal lagi)
  const { lang } = useLanguage();

  const [settingsData, setSettingsData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- HELPER TEKS BILINGUAL ---
  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  // --- DATA DUMMY (Fallback) ---
  const dummyServices = [
    { 
        title: { id: "Website Development", en: "Website Development" }, 
        description: { id: "Pembuatan web profesional.", en: "Professional web development." },
        slug: { id: { current: "website-development" }, en: { current: "web-dev" } }
    },
    { 
        title: { id: "SEO Optimization", en: "SEO Optimization" }, 
        description: { id: "Tampil di halaman pertama Google.", en: "Rank on the first page of Google." },
        slug: { id: { current: "seo-optimization" }, en: { current: "seo-optimization" } }
    }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const settings = await client.fetch(`*[_type == "siteSettings"][0]`);
        // MENAMBAHKAN ORDER PADA QUERY BERIKUT:
        const services = await client.fetch(`*[_type == "service"] | order(order asc)`); 

        setSettingsData(settings);
        setServicesData(services);
      } catch (error) {
        console.error("Gagal memuat katalog layanan:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayServices = servicesData.length > 0 ? servicesData : dummyServices;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="font-poppins font-bold text-primary animate-pulse">Memuat Katalog Layanan...</div></div>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 scroll-smooth overflow-hidden">
      
      {/* KODE NAVBAR LAMA SUDAH DIHAPUS DARI SINI KARENA SUDAH ADA DI layout.tsx */}

      {/* 2. HERO SECTION KHUSUS KATALOG LAYANAN */}
      <section className="w-full pt-24 pb-16 px-6 md:px-12 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full font-nunito text-xs font-bold tracking-widest mb-6 text-secondary border border-secondary/30 uppercase">
            {lang === 'id' ? 'Katalog Layanan' : 'Service Catalog'}
          </div>
          <h1 className="font-poppins text-4xl md:text-6xl font-bold mb-6 text-primary leading-tight text-balance">
            {getTxt(settingsData?.sectionLayananTitle, lang === 'id' ? "Solusi Digital Strategis" : "Strategic Digital Solutions")}
          </h1>
          <p className="font-nunito text-lg text-neutral-dark max-w-2xl mx-auto text-balance">
            {getTxt(settingsData?.sectionLayananDesc, lang === 'id' ? "Layanan komprehensif untuk mengakselerasi pertumbuhan bisnis Anda dari berbagai lini." : "Comprehensive services to accelerate your business growth from all fronts.")}
          </p>
        </div>
      </section>

      {/* 3. GRID SEMUA LAYANAN */}
      <section className="w-full py-16 px-6 md:px-12 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayServices.map((s: any, i: number) => (
              <div key={i} className="bg-white rounded-[30px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition duration-500 group flex flex-col">
                <div className="w-full h-56 relative overflow-hidden bg-gray-200">
                  <Image src={s.image ? urlFor(s.image).url() : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800"} alt={getTxt(s.image?.alt, "Layanan Inbeez")} fill className="object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-poppins text-2xl font-bold text-primary mb-4">{getTxt(s.title)}</h3>
                  <p className="font-nunito text-neutral-dark mb-8 leading-relaxed flex-grow">{getTxt(s.description)}</p>
                  <Link href={`/layanan/${s.slug?.[lang]?.current || s.slug?.id?.current}`} className="text-secondary font-bold text-sm uppercase tracking-wider hover:text-primary transition inline-flex items-center">
                    {lang === 'id' ? 'Detail Layanan' : 'Service Detail'} <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. KONTAK & FOOTER (Statis Visual, Dinamis Teks) */}
      <section className="w-full py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="font-poppins text-5xl font-bold text-primary mb-8">{getTxt(settingsData?.kontakTitle, "Siap Berakselerasi?")}</h2>
            <p className="font-nunito text-lg text-neutral-dark mb-12">{getTxt(settingsData?.kontakDesc, "Jadilah mitra pertumbuhan digital kami.")}</p>
            <div className="space-y-8 font-nunito font-semibold text-neutral-dark">
              <div className="flex items-center group"><div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mr-6 group-hover:bg-primary transition"><svg className="w-6 h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>{settingsData?.officeAddress || "Denpasar, Bali - Indonesia"}</div>
              <div className="flex items-center group"><div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mr-6 group-hover:bg-primary transition"><svg className="w-6 h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div><a href={`mailto:${settingsData?.officeEmail || 'info@inbeez.id'}`} className="hover:text-primary transition">{settingsData?.officeEmail || "info@inbeez.id"}</a></div>
              <div className="flex items-center group"><div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mr-6 group-hover:bg-primary transition"><svg className="w-6 h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg></div><a href={`https://wa.me/${settingsData?.whatsappNumber || '628131161101'}`} className="hover:text-primary transition">+{settingsData?.whatsappNumber || "62 813-116-1101"} (Chat)</a></div>
            </div>
          </div>
          <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100">
            <form className="space-y-6 font-nunito">
              <input type="text" placeholder={lang === 'id' ? "Nama Lengkap" : "Full Name"} className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none" />
              <input type="email" placeholder={lang === 'id' ? "Email Bisnis" : "Business Email"} className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none" />
              <textarea placeholder={lang === 'id' ? "Kebutuhan bisnis Anda..." : "Tell us your needs..."} rows={4} className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"></textarea>
              <button className="w-full bg-primary text-white font-poppins font-bold py-5 rounded-2xl hover:bg-primary-light transition text-lg shadow-lg">
                {lang === 'id' ? 'Kirim Pesan' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <footer className="w-full bg-white border-t border-gray-100 py-12 px-6 text-center font-nunito">
        <Image src="/main-logo-inbeez-id.png" alt="Inbeez Logo" width={140} height={40} className="mx-auto mb-8 opacity-40 grayscale" />
        <p className="text-gray-400 text-sm font-medium">© 2026 PT. Akselerator Bisnis Jagadigital. All rights reserved.</p>
      </footer>
    </main>
  );
}