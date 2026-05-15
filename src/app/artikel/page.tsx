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

export default function ArticleCatalog() {
  const { lang } = useLanguage();

  const [settingsData, setSettingsData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [articlesData, setArticlesData] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // 👇 STATE STATUS PENGIRIMAN EMAIL
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // --- HELPER TEKS BILINGUAL ---
  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  // --- DATA DUMMY (Fallback Bilingual) ---
  const dummyArticles = [
    { 
      title: { id: "Strategi SEO 2026", en: "SEO Strategy 2026" }, 
      category: { id: "SEO", en: "SEO" },
      description: { id: "Cara mengamankan posisi halaman pertama di tengah gempuran AI.", en: "How to secure the first page amidst the AI boom." },
      slug: { id: { current: "strategi-seo-2026" }, en: { current: "seo-strategy-2026" } },
      publishedAt: new Date().toISOString()
    },
    { 
      title: { id: "Google vs Meta Ads", en: "Google vs Meta Ads" }, 
      category: { id: "Digital Ads", en: "Digital Ads" },
      description: { id: "Perbandingan mendalam untuk channel akuisisi yang paling tepat.", en: "In-depth comparison for the right acquisition channel." },
      slug: { id: { current: "google-vs-meta-ads" }, en: { current: "google-vs-meta-ads-en" } },
      publishedAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5 hari lalu
    }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const settings = await client.fetch(`*[_type == "siteSettings"][0]`);
        const services = await client.fetch(`*[_type == "service"]`);
        const arts = await client.fetch(`*[_type == "article"] | order(publishedAt desc)`);

        setSettingsData(settings);
        setServicesData(services);
        setArticlesData(arts);
      } catch (error) {
        console.error("Gagal memuat katalog artikel:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // 👇 FUNGSI PENGIRIM EMAIL
  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  const displayArts = articlesData.length > 0 ? articlesData : dummyArticles;

  // --- LOGIKA FILTER KATEGORI DINAMIS ---
  const uniqueCategories = Array.from(new Set(displayArts.map(a => a.category?.id).filter(Boolean)));
  const filteredArts = activeCategory === 'all' 
    ? displayArts 
    : displayArts.filter(a => a.category?.id === activeCategory);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="font-poppins font-bold text-primary animate-pulse">Memuat Artikel...</div></div>;

  return (
    <main className="flex min-h-screen flex-col items-center bg-white scroll-smooth overflow-hidden font-nunito">
      
      {/* HERO SECTION ARTIKEL */}
      <section className="w-full pt-20 md:pt-24 pb-12 md:pb-16 px-6 md:px-12 text-center bg-white mt-4">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full text-[10px] md:text-xs font-bold tracking-widest mb-4 md:mb-6 text-secondary border border-secondary/30 uppercase">
            {lang === 'id' ? 'Blog & Wawasan' : 'Blog & Insights'}
          </div>
          <h1 className="font-poppins text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-primary leading-tight text-balance">
            {getTxt(settingsData?.sectionArtikelTitle, lang === 'id' ? "Insight Terkini" : "Latest Insights")}
          </h1>
          <p className="text-base md:text-lg text-neutral-dark max-w-2xl mx-auto text-balance">
            {getTxt(settingsData?.sectionArtikelDesc, lang === 'id' ? "Wawasan terbaru seputar teknologi dan strategi digital untuk memajukan bisnis Anda." : "Latest insights on technology and digital strategies to advance your business.")}
          </p>
        </div>
      </section>

      {/* FILTER KATEGORI ARTIKEL */}
      <section className="w-full py-4 md:py-6 px-4 md:px-12 bg-white sticky top-[72px] z-40 shadow-sm border-y border-gray-100 pb-4 md:pb-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2 md:gap-3">
          <button 
            onClick={() => setActiveCategory('all')}
            className={`px-5 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all duration-300 ${activeCategory === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white text-neutral-dark border border-gray-200 hover:border-primary'}`}
          >
            {lang === 'id' ? 'Semua Kategori' : 'All Categories'}
          </button>
          {uniqueCategories.map((catId: any, index: number) => {
            const catObj = displayArts.find(a => a.category?.id === catId)?.category;
            return (
              <button 
                key={index}
                onClick={() => setActiveCategory(catId)}
                className={`px-5 md:px-6 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm transition-all duration-300 ${activeCategory === catId ? 'bg-primary text-white shadow-md' : 'bg-white text-neutral-dark border border-gray-200 hover:border-primary'}`}
              >
                {getTxt(catObj)}
              </button>
            )
          })}
        </div>
      </section>

      {/* GRID ARTIKEL */}
      <section className="w-full py-12 md:py-16 px-6 md:px-12 bg-gray-50 flex-grow min-h-[500px]">
        <div className="max-w-7xl mx-auto">
          {filteredArts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {filteredArts.map((a: any, i: number) => (
                <div key={i} className="bg-white rounded-[24px] md:rounded-[30px] overflow-hidden shadow-sm border border-gray-100 flex flex-col group hover:shadow-xl transition duration-500">
                  <div className="h-48 md:h-60 relative overflow-hidden bg-gray-200">
                    <Image 
                      src={a.image ? urlFor(a.image).url() : "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800"} 
                      alt={getTxt(a.image?.alt, "Artikel Cover")} fill className="object-cover group-hover:scale-105 transition duration-700" 
                    />
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/95 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold text-primary shadow-sm">
                      {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : (lang === 'id' ? "Terbaru" : "Latest")}
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-2 md:mb-3">
                      {getTxt(a.category, "INFO")}
                    </span>
                    <h3 className="font-poppins text-xl md:text-2xl font-bold text-primary mb-3 md:mb-4 leading-snug group-hover:text-secondary transition-colors duration-300">
                      {getTxt(a.title)}
                    </h3>
                    <p className="font-nunito text-neutral-dark mb-6 md:mb-8 text-sm flex-grow leading-relaxed line-clamp-3">
                      {getTxt(a.description)}
                    </p>
                    <Link href={`/artikel/${a.slug?.[lang]?.current || a.slug?.id?.current || '#'}`} className="text-xs md:text-sm font-bold text-secondary uppercase tracking-wider hover:text-primary transition inline-flex items-center">
                      {lang === 'id' ? 'Baca Selengkapnya' : 'Read More'} <span className="ml-2">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 font-bold italic">{lang === 'id' ? 'Belum ada artikel untuk kategori ini.' : 'No articles found for this category.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* KONTAK SECTION */}
      <section className="w-full py-16 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="font-poppins text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4 md:mb-8 text-balance">
              {getTxt(settingsData?.kontakTitle, lang === 'id' ? "Siap Berakselerasi?" : "Ready to Accelerate?")}
            </h2>
            <p className="font-nunito text-base md:text-lg text-neutral-dark mb-8 md:mb-12">
              {getTxt(settingsData?.kontakDesc, lang === 'id' ? "Jadilah mitra pertumbuhan digital kami." : "Become our digital growth partner.")}
            </p>
            <div className="space-y-6 md:space-y-8 font-nunito font-semibold text-neutral-dark">
              <div className="flex items-center group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 rounded-xl flex items-center justify-center mr-4 md:mr-6 group-hover:bg-primary transition flex-shrink-0"><svg className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                <span className="text-sm md:text-base leading-snug">{settingsData?.officeAddress || "Denpasar, Bali - Indonesia"}</span>
              </div>
              <div className="flex items-center group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 rounded-xl flex items-center justify-center mr-4 md:mr-6 group-hover:bg-primary transition flex-shrink-0"><svg className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                <a href={`mailto:${settingsData?.officeEmail || 'info@inbeez.id'}`} className="text-sm md:text-base hover:text-primary transition break-all">{settingsData?.officeEmail || "info@inbeez.id"}</a>
              </div>
              <div className="flex items-center group">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/5 rounded-xl flex items-center justify-center mr-4 md:mr-6 group-hover:bg-primary transition flex-shrink-0"><svg className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg></div>
                <a href={`https://wa.me/${settingsData?.whatsappNumber || '628131161101'}`} className="text-sm md:text-base hover:text-primary transition">+{settingsData?.whatsappNumber || "62 813-116-1101"} (Chat)</a>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 md:p-12 rounded-[30px] md:rounded-[40px] shadow-2xl border border-gray-100">
            {/* 👇 FORM EMAIL AKTIF 👇 */}
            <form onSubmit={handleContactSubmit} className="space-y-4 md:space-y-6 font-nunito">
              <input required name="name" type="text" placeholder={lang === 'id' ? "Nama Lengkap" : "Full Name"} className="w-full p-4 md:p-5 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm md:text-base transition" />
              <input required name="email" type="email" placeholder={lang === 'id' ? "Email Bisnis" : "Business Email"} className="w-full p-4 md:p-5 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm md:text-base transition" />
              <textarea required name="message" placeholder={lang === 'id' ? "Kebutuhan bisnis Anda..." : "Tell us your needs..."} rows={4} className="w-full p-4 md:p-5 bg-gray-50 border border-gray-100 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm md:text-base transition"></textarea>
              
              <button 
                disabled={status === 'loading'}
                type="submit" 
                className={`w-full text-white font-poppins font-bold py-4 md:py-5 rounded-xl md:rounded-2xl transition text-base md:text-lg shadow-lg ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-light'}`}
              >
                {status === 'loading' ? (lang === 'id' ? 'Mengirim...' : 'Sending...') : (lang === 'id' ? 'Kirim Pesan' : 'Send Message')}
              </button>

              {/* PESAN FEEDBACK */}
              {status === 'success' && (
                <p className="text-green-600 font-bold text-center mt-4 text-sm bg-green-50 p-3 rounded-lg border border-green-200 animate-fade-in">
                  {lang === 'id' ? '✅ Pesan berhasil terkirim!' : '✅ Message sent successfully!'}
                </p>
              )}
              {status === 'error' && (
                <p className="text-red-600 font-bold text-center mt-4 text-sm bg-red-50 p-3 rounded-lg border border-red-200 animate-fade-in">
                  {lang === 'id' ? '❌ Gagal mengirim pesan. Silakan coba lagi.' : '❌ Failed to send message. Please try again.'}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full bg-white border-t border-gray-100 pt-12 pb-28 md:pb-12 px-2 md:px-6 text-center font-nunito mt-auto">
        <Image src="/main-logo-inbeez-id.png" alt="Inbeez Logo" width={140} height={40} className="mx-auto mb-6 md:mb-8 opacity-40 grayscale" />
        <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm font-medium tracking-tighter sm:tracking-normal whitespace-nowrap md:whitespace-normal">
          © 2026 PT. Akselerator Bisnis Jagadigital. All rights reserved.
        </p>
      </footer>
    </main>
  );
}