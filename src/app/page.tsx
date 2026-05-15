"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '../sanity/client'; 
import imageUrlBuilder from '@sanity/image-url';

import { useLanguage } from '@/context/LanguageContext';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function Home() {
  const [portIndex, setPortIndex] = useState(0);
  const [testiIndex, setTestiIndex] = useState(0);
  
  const { lang } = useLanguage();

  const [settingsData, setSettingsData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [portfoliosData, setPortfoliosData] = useState<any[]>([]);
  const [testiData, setTestiData] = useState<any[]>([]);
  const [articlesData, setArticlesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const settings = await client.fetch(`*[_type == "siteSettings"][0]`);
        const services = await client.fetch(`*[_type == "service"] | order(order asc)[0...6]`);
        const ports = await client.fetch(`*[_type == "portfolio"][0...5]`);
        const testis = await client.fetch(`*[_type == "testimonial"][0...5]`);
        const arts = await client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...3]`);

        setSettingsData(settings);
        setServicesData(services);
        setPortfoliosData(ports);
        setTestiData(testis);
        setArticlesData(arts);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

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
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  }

  const displayServices = servicesData.length > 0 ? servicesData : [];
  const displayPorts = portfoliosData.length > 0 ? portfoliosData : [];
  const displayTestis = testiData.length > 0 ? testiData : [];
  const displayArts = articlesData.length > 0 ? articlesData : [];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="font-poppins font-bold text-primary animate-pulse">Inbeez.id Loading...</div></div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white scroll-smooth overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full py-32 px-6 md:px-12 flex flex-col items-center justify-center min-h-[90vh] text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* 👇 OPTIMASI GAMBAR HERO (WebP, Max Width, Sizes) */}
          <Image 
            src={settingsData?.heroImage ? urlFor(settingsData.heroImage).width(1920).format('webp').url() : "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1920&fm=webp"} 
            alt="Background" 
            fill 
            sizes="100vw"
            className="object-cover" 
            priority 
          />
          <div className="absolute inset-0 bg-primary/85"></div>
        </div>
        <div className="relative z-10 max-w-5xl">
          <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full font-nunito text-[10px] sm:text-xs md:text-sm font-semibold md:font-bold tracking-widest mb-6 text-secondary border border-secondary/30 uppercase">
            PT. AKSELERATOR BISNIS JAGADIGITAL
          </div>
          <h1 className="font-poppins text-4xl sm:text-5xl md:text-7xl font-bold mb-6 md:mb-8 text-white leading-tight">
            {getTxt(settingsData?.heroTitle, "Dominasi Pasar dengan Ekosistem Digital")}
          </h1>
          <p className="font-nunito text-base md:text-xl mb-10 md:mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {getTxt(settingsData?.heroDescription, "Membantu bisnis tumbuh lebih mudah melalui strategi digital yang berdampak nyata.")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center font-poppins font-bold text-base md:text-lg">
            <Link href="#kontak" className="bg-secondary text-neutral-black px-8 md:px-10 py-4 rounded-full hover:bg-secondary-light transition shadow-xl">
              {lang === 'id' ? 'Mulai Sekarang' : 'Get Started'}
            </Link>
          </div>
        </div>
      </section>

      {/* LAYANAN SECTION */}
      <section id="layanan" className="w-full py-20 md:py-24 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-primary mb-4">{getTxt(settingsData?.sectionLayananTitle, "Solusi Digital Strategis")}</h2>
            <p className="font-nunito text-base md:text-lg text-neutral-dark max-w-2xl mx-auto">{getTxt(settingsData?.sectionLayananDesc, "Layanan komprehensif untuk pertumbuhan bisnis Anda.")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayServices.map((s: any, i: number) => (
              <div key={i} className="bg-white rounded-[30px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition duration-500 group flex flex-col">
                <div className="w-full h-48 relative overflow-hidden">
                  {/* 👇 OPTIMASI GAMBAR LAYANAN (WebP, Max Width, Sizes) */}
                  <Image 
                    src={s.image ? urlFor(s.image).width(800).format('webp').url() : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&fm=webp"} 
                    alt={getTxt(s.image?.alt, "Layanan")} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover group-hover:scale-105 transition duration-700" 
                  />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-poppins text-xl font-bold text-primary mb-3">{getTxt(s.title)}</h3>
                  <p className="font-nunito text-sm text-neutral-dark mb-6 leading-relaxed flex-grow">{getTxt(s.description)}</p>
                  <Link href={`/layanan/${s.slug?.[lang]?.current || s.slug?.id?.current}`} className="text-secondary font-bold text-sm uppercase tracking-wider hover:text-primary transition inline-flex items-center">
                    {lang === 'id' ? 'Detail Layanan' : 'Service Detail'} <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
             <Link href="/layanan" className="inline-block px-8 md:px-10 py-4 rounded-full border-2 border-primary text-primary font-poppins font-bold hover:bg-primary hover:text-white transition shadow-sm text-sm md:text-base">
               {lang === 'id' ? 'Tampilkan Semua Layanan' : 'Show All Services'}
             </Link>
          </div>
        </div>
      </section>

      {/* PORTOFOLIO SECTION */}
      <section id="portofolio" className="w-full py-20 md:py-24 px-6 md:px-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6">
            <div>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold text-primary mb-3 md:mb-4">{getTxt(settingsData?.sectionPortoTitle, "Karya Terbaik")}</h2>
              <p className="font-nunito text-base md:text-lg text-neutral-dark">{getTxt(settingsData?.sectionPortoDesc, "Hasil nyata strategi digital kami.")}</p>
            </div>
            <div className="flex space-x-3 mt-2 md:mt-0">
              <button onClick={() => setPortIndex(p => Math.max(0, p - 1))} className={`p-3 md:p-4 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition`}>←</button>
              <button onClick={() => setPortIndex(p => Math.min(displayPorts.length - 3, p + 1))} className={`p-3 md:p-4 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition`}>→</button>
            </div>
          </div>
          <div className="relative overflow-visible">
            <div className="flex gap-6 md:gap-8 transition-transform duration-500 ease-out" style={{ transform: `translateX(calc(-${portIndex * 33.3333}% - ${portIndex * 0.6667}rem))` }}>
              {displayPorts.map((p: any, i: number) => (
                <div key={i} className="min-w-[90%] md:min-w-[calc(33.333%-1.33rem)] relative h-[380px] md:h-[420px] rounded-[30px] overflow-hidden group shadow-lg">
                  {/* 👇 OPTIMASI GAMBAR PORTOFOLIO (WebP, Max Width, Sizes) */}
                  <Image 
                    src={p.image ? urlFor(p.image).width(800).format('webp').url() : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&fm=webp"} 
                    alt={getTxt(p.image?.alt, "Portfolio")} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                    className="object-cover group-hover:scale-105 transition duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-6 md:p-8 flex flex-col justify-end">
                    <h4 className="text-white font-poppins text-lg md:text-xl font-bold leading-tight mb-2 md:mb-3">{p.title}</h4>
                    <p className="text-gray-300 font-nunito text-xs md:text-sm line-clamp-2">{getTxt(p.description)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16 text-center">
             <Link href="/portofolio" className="inline-block px-8 md:px-10 py-4 rounded-full border-2 border-primary text-primary font-poppins font-bold hover:bg-primary hover:text-white transition shadow-sm text-sm md:text-base">
               {lang === 'id' ? 'Tampilkan Semua Portofolio' : 'Show All Portfolios'}
             </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONI SECTION */}
      <section id="testimoni" className="w-full py-20 md:py-24 px-6 md:px-12 bg-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-12 gap-6">
            <div>
              <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-3 md:mb-4">{getTxt(settingsData?.sectionTestiTitle, "Apa Kata Klien?")}</h2>
              <p className="font-nunito text-base md:text-lg text-gray-200">{getTxt(settingsData?.sectionTestiDesc, "Kepercayaan klien adalah prioritas kami.")}</p>
            </div>
            <div className="flex space-x-3 mt-2 md:mt-0">
              <button onClick={() => setTestiIndex(p => Math.max(0, p - 1))} className={`p-3 md:p-4 rounded-full border border-white text-white hover:bg-white hover:text-primary transition`}>←</button>
              <button onClick={() => setTestiIndex(p => Math.min(displayTestis.length - 3, p + 1))} className={`p-3 md:p-4 rounded-full border border-white text-white hover:bg-white hover:text-primary transition`}>→</button>
            </div>
          </div>
          <div className="relative overflow-visible">
            <div className="flex gap-6 md:gap-8 transition-transform duration-500 ease-out" style={{ transform: `translateX(calc(-${testiIndex * 33.3333}% - ${testiIndex * 0.6667}rem))` }}>
              {displayTestis.map((t: any, i: number) => (
                <div key={i} className="min-w-[90%] md:min-w-[calc(33.333%-1.33rem)] bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-[30px] border border-white/20 flex flex-col justify-between h-[300px] md:h-[320px]">
                  <div>
                    <div className="text-secondary text-lg md:text-xl mb-4">★★★★★</div>
                    <p className="font-nunito italic text-sm md:text-base mb-6 leading-relaxed line-clamp-4">"{getTxt(t.quote)}"</p>
                  </div>
                  <div>
                    <h5 className="font-poppins font-bold text-base md:text-lg">{t.name}</h5>
                    <p className="text-gray-300 text-xs font-nunito">{getTxt(t.position)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16 text-center">
             <Link href="/testimoni" className="inline-block px-8 md:px-10 py-4 rounded-full border-2 border-white text-white font-poppins font-bold hover:bg-white hover:text-primary transition shadow-sm text-sm md:text-base">
               {lang === 'id' ? 'Lihat Semua Testimoni' : 'See All Testimonials'}
             </Link>
          </div>
        </div>
      </section>

      {/* ARTIKEL SECTION */}
      <section id="artikel" className="w-full py-20 md:py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-poppins text-3xl md:text-4xl font-bold text-primary mb-3 md:mb-4">{getTxt(settingsData?.sectionArtikelTitle, "Insight Terkini")}</h2>
            <p className="font-nunito text-base md:text-lg text-neutral-dark max-w-2xl mx-auto">{getTxt(settingsData?.sectionArtikelDesc, "Berita terbaru seputar strategi digital.")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayArts.map((a: any, i: number) => (
              <div key={i} className="bg-gray-50 rounded-[30px] overflow-hidden border border-gray-100 flex flex-col group hover:shadow-xl transition duration-500">
                <div className="h-48 md:h-56 relative overflow-hidden bg-gray-200">
                  {/* 👇 OPTIMASI GAMBAR ARTIKEL (WebP, Max Width, Sizes) */}
                  <Image 
                    src={a.image ? urlFor(a.image).width(800).format('webp').url() : "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800&fm=webp"} 
                    alt={getTxt(a.image?.alt, "Artikel")} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                    className="object-cover group-hover:scale-105 transition duration-700" 
                  />
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-primary">
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : "Terbaru"}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h4 className="font-poppins text-lg md:text-xl font-bold text-primary mb-3 md:mb-4 leading-tight group-hover:text-secondary transition">{getTxt(a.title)}</h4>
                  <p className="font-nunito text-neutral-dark mb-6 md:mb-8 text-sm flex-grow leading-relaxed line-clamp-3">{getTxt(a.description)}</p>
                  <Link href={`/artikel/${a.slug?.[lang]?.current || a.slug?.id?.current || '#'}`} className="text-[10px] md:text-xs font-bold text-secondary uppercase tracking-widest hover:text-primary transition inline-flex items-center">
                    {lang === 'id' ? 'Baca Selengkapnya' : 'Read More'} <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-16 text-center">
             <Link href="/artikel" className="inline-block px-8 md:px-10 py-4 rounded-full border-2 border-primary text-primary font-poppins font-bold hover:bg-primary hover:text-white transition shadow-sm text-sm md:text-base">
               {lang === 'id' ? 'Tampilkan Semua Artikel' : 'Show All Articles'}
             </Link>
          </div>
        </div>
      </section>

      {/* KONTAK SECTION DENGAN FORM TERHUBUNG */}
      <section id="kontak" className="w-full py-20 md:py-24 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <h2 className="font-poppins text-3xl md:text-5xl font-bold text-primary mb-6 md:mb-8">{getTxt(settingsData?.kontakTitle, "Siap Berakselerasi?")}</h2>
            <p className="font-nunito text-base md:text-lg text-neutral-dark mb-10 md:mb-12">{getTxt(settingsData?.kontakDesc, "Jadilah mitra pertumbuhan digital kami.")}</p>
            
            <div className="space-y-6 md:space-y-8 font-nunito font-semibold text-neutral-dark">
              <div className="flex items-start md:items-center group">
                <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-primary/5 rounded-xl flex items-center justify-center mr-4 md:mr-6 group-hover:bg-primary transition"><svg className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                <span className="mt-1.5 md:mt-0">{settingsData?.officeAddress || "Denpasar, Bali - Indonesia"}</span>
              </div>
              
              <div className="flex items-start md:items-center group">
                <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-primary/5 rounded-xl flex items-center justify-center mr-4 md:mr-6 group-hover:bg-primary transition"><svg className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                <a href={`mailto:${settingsData?.officeEmail || 'info@inbeez.id'}`} className="mt-1.5 md:mt-0 hover:text-primary transition break-all">{settingsData?.officeEmail || "info@inbeez.id"}</a>
              </div>
              
              <div className="flex items-start md:items-center group">
                <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-primary/5 rounded-xl flex items-center justify-center mr-4 md:mr-6 group-hover:bg-primary transition"><svg className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg></div>
                <a href={`https://wa.me/${settingsData?.whatsappNumber || '628131161101'}`} className="mt-1.5 md:mt-0 hover:text-primary transition">+{settingsData?.whatsappNumber || "62 813-116-1101"}</a>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 md:p-12 rounded-[30px] md:rounded-[40px] shadow-2xl border border-gray-100">
            
            {/* 👇 FORM EMAIL AKTIF 👇 */}
            <form onSubmit={handleContactSubmit} className="space-y-5 md:space-y-6 font-nunito">
              <input required name="name" type="text" placeholder={lang === 'id' ? "Nama Lengkap" : "Full Name"} className="w-full p-4 md:p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm md:text-base transition" />
              <input required name="email" type="email" placeholder={lang === 'id' ? "Email Bisnis" : "Business Email"} className="w-full p-4 md:p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm md:text-base transition" />
              <textarea required name="message" placeholder={lang === 'id' ? "Kebutuhan bisnis Anda..." : "Tell us your needs..."} rows={4} className="w-full p-4 md:p-5 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary outline-none text-sm md:text-base transition"></textarea>
              
              <button 
                disabled={status === 'loading'} 
                type="submit"
                className={`w-full text-white font-poppins font-bold py-4 md:py-5 rounded-2xl transition text-base md:text-lg shadow-lg ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-light'}`}
              >
                {status === 'loading' ? (lang === 'id' ? 'Mengirim...' : 'Sending...') : (lang === 'id' ? 'Kirim Pesan' : 'Send Message')}
              </button>

              {/* PESAN FEEDBACK */}
              {status === 'success' && (
                <p className="text-green-600 font-bold text-center mt-4 text-sm bg-green-50 p-3 rounded-lg border border-green-200 animate-fade-in">
                  {lang === 'id' ? '✅ Pesan berhasil terkirim! Tim kami akan segera menghubungi Anda.' : '✅ Message sent successfully! Our team will contact you soon.'}
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
      <footer className="w-full bg-white border-t border-gray-100 pt-12 pb-28 md:pb-12 px-6 text-center font-nunito mt-auto">
        <Image src="/main-logo-inbeez-id.png" alt="Inbeez Logo" width={140} height={40} className="mx-auto mb-6 md:mb-8 opacity-40 grayscale" />
        <p className="text-gray-400 text-xs md:text-sm font-medium">© 2026 PT. Akselerator Bisnis Jagadigital. All rights reserved.</p>
      </footer>
    </main>
  );
}