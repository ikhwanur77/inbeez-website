"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '../../sanity/client'; 
import imageUrlBuilder from '@sanity/image-url';

// 1. IMPORT HOOK BAHASA
import { useLanguage } from '@/context/LanguageContext';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function AboutUs() {
  const { lang } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- HELPER TEKS BILINGUAL ---
  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const siteSettings = await client.fetch(`*[_type == "siteSettings"][0]`);
        const aboutData = await client.fetch(`*[_type == "aboutUs"][0]`);
        setSettings(siteSettings);
        setData(aboutData);
      } catch (error) {
        console.error("Gagal memuat data tentang kami:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="font-poppins font-bold text-primary animate-pulse">Memuat...</div></div>;

  // ==========================================
  // DATA FALLBACK (Aman jika Sanity Kosong)
  // ==========================================
  const heroImg = data?.heroImage ? urlFor(data.heroImage).url() : "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070";
  const aboutImg = data?.aboutImage ? urlFor(data.aboutImage).url() : "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070";

  // Data Statistik Dinamis
  const displayStats = data?.stats?.length > 0 ? data.stats : [
    { value: "150+", label: { id: "Proyek Selesai", en: "Projects Done" } },
    { value: "98%", label: { id: "Klien Puas", en: "Satisfied Clients" } }
  ];

  // Data Misi Dinamis
  const displayMissions = data?.missionItems?.length > 0 ? data.missionItems : [
    { item: { id: "Memberikan solusi digital terintegrasi yang terukur dan transparan.", en: "Providing transparent and measurable integrated digital solutions." } },
    { item: { id: "Berorientasi pada Return of Investment (ROI) yang maksimal untuk klien.", en: "Oriented towards maximum Return of Investment (ROI) for clients." } }
  ];

  // Logika WhatsApp CTA
  const waNumber = settings?.whatsappNumber || "628131161101";
  const waText = getTxt(data?.ctaWaText, lang === 'id' ? "Halo Tim Inbeez, saya tertarik untuk berkolaborasi menumbuhkan bisnis saya." : "Hello Inbeez Team, I am interested in collaborating to grow my business.");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}`;

  return (
    <main className="flex min-h-screen flex-col items-center bg-white scroll-smooth overflow-hidden font-nunito">
      
      {/* HERO SECTION */}
      {/* Perbaikan: Padding dikurangi dan text-size disesuaikan untuk mobile */}
      <section className="relative w-full pt-24 pb-16 md:py-32 px-6 md:px-12 flex flex-col items-center justify-center text-center bg-primary text-white overflow-hidden mt-4 md:mt-0">
        <div className="absolute inset-0 opacity-10">
          <Image src={heroImg} alt="Tim Inbeez" fill className="object-cover grayscale" priority />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto md:mt-8">
          <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full font-nunito text-[10px] md:text-xs font-bold tracking-widest mb-4 md:mb-6 text-white border border-white/20 uppercase">
            PT. Akselerator Bisnis Jagadigital
          </div>
          <h1 className="font-poppins text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight text-balance">
            {getTxt(data?.heroTitle, lang === 'id' ? 'Lebih Dari Sekadar Agensi Digital' : 'More Than Just a Digital Agency')}
          </h1>
          <p className="text-base md:text-lg text-gray-200 max-w-2xl mx-auto text-balance">
            {getTxt(data?.heroDesc, lang === 'id' 
              ? 'Kami adalah mitra strategis yang berdedikasi penuh untuk membangun, mengembangkan, dan mengakselerasi ekosistem digital bisnis Anda.' 
              : 'We are a strategic partner fully dedicated to building, developing, and accelerating your business digital ecosystem.')}
          </p>
        </div>
      </section>

      {/* TENTANG KAMI SECTION */}
      <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Perbaikan: Tinggi gambar dikecilkan (h-250px) dan radius diperhalus di mobile */}
          <div className="relative h-[250px] md:h-[500px] w-full rounded-[24px] md:rounded-[40px] overflow-hidden shadow-xl md:shadow-2xl order-2 lg:order-1">
            <Image src={aboutImg} alt="Office Inbeez" fill className="object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-primary mb-4 md:mb-6">
              {getTxt(data?.aboutTitle, lang === 'id' ? 'Siapa Inbeez.id?' : 'Who is Inbeez.id?')}
            </h2>
            <div className="space-y-4 md:space-y-6 text-sm md:text-base text-neutral-dark leading-relaxed">
              <p>
                {getTxt(data?.aboutDesc1, lang === 'id' 
                  ? 'Berbasis di Bali, Inbeez.id hadir dengan visi untuk mendobrak batasan dalam dunia pemasaran digital. Kami percaya bahwa setiap bisnis memiliki potensi tak terbatas jika dibekali dengan strategi dan infrastruktur teknologi yang tepat.' 
                  : 'Based in Bali, Inbeez.id is here with a vision to break boundaries in the digital marketing world. We believe every business has limitless potential if equipped with the right strategy and technological infrastructure.')}
              </p>
              <p>
                {getTxt(data?.aboutDesc2, lang === 'id'
                  ? 'Kami menggabungkan data analitik yang presisi, kreativitas tanpa batas, dan teknologi terkini untuk memastikan bisnis Anda tidak hanya bertahan, tetapi mendominasi industri.'
                  : 'We combine precise data analytics, boundless creativity, and the latest technology to ensure your business not only survives but dominates the industry.')}
              </p>
            </div>
            
            {/* STATISTIK DINAMIS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
              {displayStats.map((stat: any, index: number) => (
                <div key={index} className="border-l-4 border-secondary pl-3 md:pl-4">
                  <h3 className="font-poppins text-3xl md:text-4xl font-bold text-primary mb-1 md:mb-2">{stat.value}</h3>
                  <p className="text-[10px] md:text-sm font-bold uppercase tracking-wider text-gray-500">{getTxt(stat.label)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VISI & MISI */}
      <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-gray-50 flex-grow">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {/* Box Visi */}
          {/* Perbaikan: Padding (p-8) dan Sudut (rounded-[30px]) disesuaikan untuk mobile */}
          <div className="bg-white p-8 md:p-12 rounded-[30px] md:rounded-[40px] shadow-sm border border-gray-100 flex flex-col">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            </div>
            <h3 className="font-poppins text-2xl md:text-3xl font-bold text-primary mb-4 md:mb-6">
              {getTxt(data?.visionTitle, lang === 'id' ? 'Visi Kami' : 'Our Vision')}
            </h3>
            <p className="text-sm md:text-base text-neutral-dark leading-relaxed">
              {getTxt(data?.visionDesc, lang === 'id' ? 'Menjadi akselerator pertumbuhan bisnis digital nomor satu di Indonesia yang menciptakan standar baru dalam inovasi teknologi dan strategi pemasaran.' : 'To be the number one digital business growth accelerator in Indonesia that creates new standards in technological innovation and marketing strategy.')}
            </p>
          </div>

          {/* Box Misi Dinamis */}
          <div className="bg-primary p-8 md:p-12 rounded-[30px] md:rounded-[40px] shadow-sm text-white flex flex-col">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8">
              <svg className="w-6 h-6 md:w-8 md:h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <h3 className="font-poppins text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">
              {getTxt(data?.missionTitle, lang === 'id' ? 'Misi Kami' : 'Our Mission')}
            </h3>
            
            <ul className="space-y-3 md:space-y-4">
              {displayMissions.map((m: any, i: number) => (
                <li key={i} className="flex items-start text-sm md:text-base text-gray-200">
                  <span className="text-secondary mr-3 flex-shrink-0 mt-0.5 md:mt-1">✦</span>
                  <span className="leading-relaxed">{getTxt(m.item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA DINAMIS */}
      {/* Perbaikan: Padding atas bawah disesuaikan */}
      <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-poppins text-3xl md:text-4xl font-bold text-primary mb-6 md:mb-8 text-balance">
            {getTxt(data?.ctaTitle, lang === 'id' ? 'Mari Tumbuh Bersama' : 'Let\'s Grow Together')}
          </h2>
          <a 
            href={waLink} 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-secondary text-neutral-black px-8 md:px-10 py-3.5 md:py-4 rounded-full font-bold hover:bg-secondary-light transition shadow-xl inline-block text-sm md:text-base w-full md:w-auto"
          >
            {getTxt(data?.ctaButtonText, lang === 'id' ? 'Hubungi Kami Hari Ini' : 'Contact Us Today')}
          </a>
        </div>
      </section>

      {/* FOOTER - Rapi 1 Baris di Mobile */}
    </main>
  );
}