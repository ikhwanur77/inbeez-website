"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '../sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Tool pembangun URL gambar dari database Sanity
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function Home() {
  const [portIndex, setPortIndex] = useState(0);
  const [testiIndex, setTestiIndex] = useState(0);
  
  // --- STATE UNTUK MENAMPUNG LIVE DATA DARI SANITY ---
  const [settingsData, setSettingsData] = useState<any>(null);
  const [servicesData, setServicesData] = useState<any[]>([]);
  const [portfoliosData, setPortfoliosData] = useState<any[]>([]);
  const [testiData, setTestiData] = useState<any[]>([]);
  const [articlesData, setArticlesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- DATA DUMMY CADANGAN ---
  const dummyServices = [
    { t: "Website Development", d: "Company Profile, eCommerce, LMS, dan Booking Website yang profesional dan scalable.", i: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800", l: "/layanan/website-development" },
    { t: "SEO Optimization", d: "Membangun fondasi SEO on-page dan technical agar tampil di halaman pertama Google.", i: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800", l: "/layanan/seo" },
    { t: "Google Ads Management", d: "Setup campaign dan monthly maintenance untuk ROI yang terus meningkat.", i: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800", l: "/layanan/google-ads" }
  ];

  const dummyPortfolios = [
    { t: "E-Commerce Fashion Retail", c: "Website Dev + SEO", d: "Peningkatan konversi penjualan online hingga 150% dalam 3 bulan.", img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800" },
    { t: "LMS Platform Corporate", c: "Web Dev", d: "Digitalisasi sistem training karyawan untuk 500+ pengguna aktif.", img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=800" }
  ];

  const dummyTestimonials = [
    { n: "Budi Santoso", p: "Direktur, Retail Corp", t: "Inbeez membantu efisiensi operasional kami naik drastis dengan sistem yang handal.", r: 5 },
    { n: "Siska Amelia", p: "CMO, Klinik Estetika", t: "ROI iklan Google Ads kami naik tajam. Cost per lead turun 40%!", r: 5 }
  ];

  const dummyArticles = [
    { t: "Strategi SEO 2026", d: "Cara mengamankan posisi halaman pertama di tengah gempuran AI.", img: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800", date: "12 Mei" }
  ];

  // --- MENGAMBIL DATA DARI SANITY SAAT HALAMAN DIMUAT ---
  useEffect(() => {
    async function fetchData() {
      try {
        const settings = await client.fetch(`*[_type == "siteSettings"][0]`);
        const services = await client.fetch(`*[_type == "service"][0...6]`);
        const ports = await client.fetch(`*[_type == "portfolio"][0...5]`);
        const testis = await client.fetch(`*[_type == "testimonial"][0...5]`);
        const arts = await client.fetch(`*[_type == "article"] | order(date desc)[0...3]`);

        setSettingsData(settings);
        setServicesData(services);
        setPortfoliosData(ports);
        setTestiData(testis);
        setArticlesData(arts);
      } catch (error) {
        console.error("Gagal mengambil data Sanity:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Memilih data yang akan ditampilkan
  const displayServices = servicesData.length > 0 ? servicesData : dummyServices;
  const displayPorts = portfoliosData.length > 0 ? portfoliosData : dummyPortfolios;
  const displayTestis = testiData.length > 0 ? testiData : dummyTestimonials;
  const displayArts = articlesData.length > 0 ? articlesData : dummyArticles;

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="font-poppins font-bold text-primary animate-pulse">Memuat Data Inbeez...</div></div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white scroll-smooth overflow-hidden">
      
      {/* 1. HEADER & HERO */}
      <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <Link href="/"><Image src="/main-logo-inbeez-id.png" alt="Inbeez.id Logo" width={150} height={40} className="object-contain" priority /></Link>
        <div className="hidden lg:flex space-x-8 font-nunito font-semibold text-neutral-dark items-center">
          <Link href="#layanan" className="hover:text-primary transition">Layanan</Link>
          <Link href="#portofolio" className="hover:text-primary transition">Portofolio</Link>
          <Link href="#testimoni" className="hover:text-primary transition">Testimoni</Link>
          <Link href="#artikel" className="hover:text-primary transition">Artikel</Link>
          <Link href="#kontak" className="bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary-light transition shadow-md font-poppins">Konsultasi Gratis</Link>
        </div>
      </nav>

      <section className="relative w-full py-32 px-6 md:px-12 flex flex-col items-center justify-center min-h-[90vh] text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={settingsData?.heroImage ? urlFor(settingsData.heroImage).url() : "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2070&auto=format&fit=crop"} 
            alt="Background" fill className="object-cover" priority 
          />
          <div className="absolute inset-0 bg-primary/85"></div>
        </div>
        <div className="relative z-10 max-w-5xl">
          <div className="inline-block px-4 py-1 bg-secondary/20 rounded-full font-nunito text-sm font-bold tracking-widest mb-6 text-secondary border border-secondary/30 uppercase">PT. AKSELERATOR BISNIS JAGADIGITAL</div>
          {settingsData?.heroTitle ? (
            <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-8 text-white leading-tight text-balance">{settingsData.heroTitle}</h1>
          ) : (
            <h1 className="font-poppins text-5xl md:text-7xl font-bold mb-8 text-white leading-tight text-balance">Dominasi Pasar dengan <br/><span className="text-secondary">Ekosistem Digital</span></h1>
          )}
          <p className="font-nunito text-xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed">
            {settingsData?.heroDescription || "Membantu bisnis tumbuh lebih mudah melalui strategi digital, sistem teknologi, dan konten kreatif yang berdampak nyata."}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center font-poppins font-bold">
            <Link href="#kontak" className="bg-secondary text-neutral-black px-10 py-4 rounded-full hover:bg-secondary-light transition shadow-xl text-lg">Mulai Sekarang</Link>
            <Link href="#layanan" className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full hover:bg-white hover:text-primary transition text-lg">Eksplorasi Layanan</Link>
          </div>
        </div>
      </section>

      {/* 2. LAYANAN DINAMIS */}
      <section id="layanan" className="w-full py-24 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-primary mb-4 text-balance">Solusi Digital Strategis</h2>
            <p className="font-nunito text-lg text-neutral-dark max-w-2xl mx-auto text-balance">Layanan komprehensif untuk mengakselerasi pertumbuhan bisnis Anda dari berbagai lini.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayServices.map((s: any, i: number) => (
              <div key={i} className="bg-white rounded-[30px] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition duration-500 group flex flex-col">
                <div className="w-full h-48 relative overflow-hidden bg-gray-200">
                  <Image src={s.image ? urlFor(s.image).url() : s.i} alt={s.title || s.t} fill className="object-cover group-hover:scale-105 transition duration-700" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="font-poppins text-xl font-bold text-primary mb-3">{s.title || s.t}</h3>
                  <p className="font-nunito text-sm text-neutral-dark mb-6 leading-relaxed flex-grow">{s.description || s.d}</p>
                  <Link href={s.link || s.l} className="text-secondary font-bold text-sm uppercase tracking-wider hover:text-primary transition inline-flex items-center">Detail Layanan <span className="ml-2">→</span></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PORTOFOLIO DINAMIS */}
      <section id="portofolio" className="w-full py-24 px-6 md:px-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-poppins text-4xl font-bold text-primary">Karya Terbaik</h2>
            <div className="flex space-x-3">
              <button onClick={() => setPortIndex(p => Math.max(0, p - 1))} className={`p-4 rounded-full border ${portIndex === 0 ? 'border-gray-200 text-gray-300' : 'border-primary text-primary hover:bg-primary hover:text-white'} transition`}>←</button>
              <button onClick={() => setPortIndex(p => Math.min(displayPorts.length - 3, p + 1))} className={`p-4 rounded-full border ${portIndex >= displayPorts.length - 3 ? 'border-gray-200 text-gray-300' : 'border-primary text-primary hover:bg-primary hover:text-white'} transition`}>→</button>
            </div>
          </div>
          <div className="relative overflow-visible">
            <div className="flex gap-8 transition-transform duration-500 ease-out" style={{ transform: `translateX(calc(-${portIndex * 33.3333}% - ${portIndex * 0.6667}rem))` }}>
              {displayPorts.map((p: any, i: number) => (
                <div key={i} className="min-w-full md:min-w-[calc(33.333%-1.33rem)] relative h-[420px] rounded-[30px] overflow-hidden group shadow-lg">
                  <Image src={p.image ? urlFor(p.image).url() : p.img} alt={p.title || p.t} fill className="object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-8 flex flex-col justify-end">
                    <span className="text-secondary font-nunito font-bold tracking-widest uppercase mb-2 text-xs">{p.category || p.c}</span>
                    <h4 className="text-white font-poppins text-xl font-bold leading-tight mb-3">{p.title || p.t}</h4>
                    <p className="text-gray-300 font-nunito text-sm line-clamp-2">{p.description || p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONI DINAMIS */}
      <section id="testimoni" className="w-full py-24 px-6 md:px-12 bg-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-poppins text-4xl font-bold">Apa Kata Klien?</h2>
            <div className="flex space-x-3">
              <button onClick={() => setTestiIndex(p => Math.max(0, p - 1))} className={`p-4 rounded-full border ${testiIndex === 0 ? 'border-white/20 text-white/30' : 'border-white text-white hover:bg-white hover:text-primary'} transition`}>←</button>
              <button onClick={() => setTestiIndex(p => Math.min(displayTestis.length - 3, p + 1))} className={`p-4 rounded-full border ${testiIndex >= displayTestis.length - 3 ? 'border-white/20 text-white/30' : 'border-white text-white hover:bg-white hover:text-primary'} transition`}>→</button>
            </div>
          </div>
          <div className="relative overflow-visible">
            <div className="flex gap-8 transition-transform duration-500 ease-out" style={{ transform: `translateX(calc(-${testiIndex * 33.3333}% - ${testiIndex * 0.6667}rem))` }}>
              {displayTestis.map((t: any, i: number) => (
                <div key={i} className="min-w-full md:min-w-[calc(33.333%-1.33rem)] bg-white/10 backdrop-blur-md p-8 rounded-[30px] border border-white/20 flex flex-col justify-between h-[320px]">
                  <div>
                    <div className="text-secondary text-xl mb-4">★★★★★</div>
                    <p className="font-nunito italic text-base mb-6 leading-relaxed line-clamp-4">"{t.quote || t.t}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {t.clientPhoto && (
                      <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-secondary">
                        <Image src={urlFor(t.clientPhoto).url()} alt={t.name || "Klien"} fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <h5 className="font-poppins font-bold text-lg">{t.name || t.n}</h5>
                      <p className="text-gray-300 text-xs font-nunito">{t.position || t.p}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. ARTIKEL DINAMIS */}
      <section id="artikel" className="w-full py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-poppins text-4xl font-bold text-primary mb-4">Insight Terkini</h2>
            <p className="font-nunito text-lg text-neutral-dark max-w-2xl mx-auto">Wawasan terbaru seputar teknologi dan strategi digital untuk bisnis Anda.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {displayArts.map((a: any, i: number) => (
              <div key={i} className="bg-gray-50 rounded-[30px] overflow-hidden border border-gray-100 flex flex-col group hover:shadow-xl transition duration-500">
                <div className="h-56 relative bg-gray-200 overflow-hidden">
                  <Image src={a.image ? urlFor(a.image).url() : a.img} alt={a.title || a.t} fill className="object-cover group-hover:scale-105 transition duration-700" />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm">{a.date}</div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h4 className="font-poppins text-xl font-bold text-primary mb-4 leading-tight group-hover:text-secondary transition">{a.title || a.t}</h4>
                  <p className="font-nunito text-neutral-dark mb-8 text-sm flex-grow leading-relaxed line-clamp-3">{a.description || a.d}</p>
                  <Link href="#" className="text-xs font-bold text-secondary uppercase tracking-widest hover:text-primary transition inline-flex items-center">Baca Selengkapnya <span className="ml-2">→</span></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. KONTAK & FOOTER DINAMIS */}
      <section id="kontak" className="w-full py-24 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h2 className="font-poppins text-5xl font-bold text-primary mb-8">Siap Berakselerasi?</h2>
            <p className="font-nunito text-lg text-neutral-dark mb-12">PT. Akselerator Bisnis Jagadigital siap menjadi mitra pertumbuhan digital Anda.</p>
            <div className="space-y-8 font-nunito font-semibold text-neutral-dark">
              <div className="flex items-center group"><div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mr-6 group-hover:bg-primary transition"><svg className="w-6 h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>{settingsData?.officeAddress || "Denpasar, Bali - Indonesia"}</div>
              <div className="flex items-center group"><div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mr-6 group-hover:bg-primary transition"><svg className="w-6 h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div><a href={`mailto:${settingsData?.officeEmail || 'info@inbeez.id'}`} className="hover:text-primary transition">{settingsData?.officeEmail || "info@inbeez.id"}</a></div>
              <div className="flex items-center group"><div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mr-6 group-hover:bg-primary transition"><svg className="w-6 h-6 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg></div><a href={`https://wa.me/${settingsData?.whatsappNumber || '628131161101'}`} className="hover:text-primary transition">+{settingsData?.whatsappNumber || "62 813-116-1101"} (Chat)</a></div>
            </div>
          </div>
          <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100">
            <form className="space-y-6 font-nunito">
              <input type="text" placeholder="Nama Lengkap" className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none" />
              <input type="email" placeholder="Email Bisnis" className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none" />
              <textarea placeholder="Kebutuhan bisnis Anda..." rows={4} className="w-full p-5 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"></textarea>
              <button className="w-full bg-primary text-white font-poppins font-bold py-5 rounded-2xl hover:bg-primary-light transition text-lg shadow-lg">Kirim Pesan</button>
            </form>
          </div>
        </div>
      </section>

      <footer className="w-full bg-white border-t border-gray-100 py-12 px-6 text-center font-nunito mt-auto">
        <Image src="/main-logo-inbeez-id.png" alt="Inbeez Logo" width={140} height={40} className="mx-auto mb-8 opacity-40 grayscale" />
        <p className="text-gray-400 text-sm font-medium">© 2026 PT. Akselerator Bisnis Jagadigital. All rights reserved.</p>
      </footer>
    </main>
  );
}