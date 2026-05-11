"use client";
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '../../../sanity/client'; 
import imageUrlBuilder from '@sanity/image-url';
import { PortableText } from '@portabletext/react';

// 👇 1. IMPORT HOOK BAHASA DARI CONTEXT
import { useLanguage } from '@/context/LanguageContext';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default function ArticleDetail({ params }: { params: Promise<{ slug: string }> }) {
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

  useEffect(() => {
    async function fetchData() {
      try {
        const article = await client.fetch(
          `*[_type == "article" && (slug.id.current == $slug || slug.en.current == $slug)][0]`, 
          { slug }
        );
        setData(article);
      } catch (error) {
        console.error("Gagal memuat artikel:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [slug]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="font-poppins font-bold text-primary animate-pulse">Loading Article...</div></div>;

  // --- DATA KONTEN ---
  const title = getTxt(data?.title, "Judul Artikel");
  const category = getTxt(data?.category, "Uncategorized");
  const imageSrc = data?.image ? urlFor(data.image).url() : "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=2000";
  const publishDate = data?.publishedAt ? new Date(data.publishedAt).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "";
  const content = data?.content?.[lang] || data?.content?.id || [];

  // --- KOMPONEN KUSTOM UNTUK GAMBAR DI TENGAH ARTIKEL ---
  const ptComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        return (
          <div className="relative w-full h-[300px] md:h-[450px] my-10 rounded-[20px] overflow-hidden shadow-md">
            <Image src={urlFor(value).url()} alt={getTxt(value.alt, "Ilustrasi Artikel")} fill className="object-cover" />
          </div>
        );
      }
    }
  };

  // --- FUNGSI SHARE URL LENGKAP ---
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(currentUrl);

  return (
    <main className="min-h-screen bg-white font-nunito flex flex-col">
      
      {/* NAVBAR LAMA DIHAPUS DARI SINI (Sudah ditangani oleh layout.tsx) */}

      {/* HEADER ARTIKEL */}
      <section className="w-full pt-16 pb-10 px-6 md:px-12 bg-white text-center max-w-4xl mx-auto">
        
        {/* Tombol Back to Blog yang dipindahkan dari Navbar lama */}
        <div className="mb-10 flex justify-center">
          <Link href="/artikel" className="text-sm font-bold text-gray-400 hover:text-primary transition flex items-center gap-2 border-b border-transparent hover:border-primary pb-1">
            <span>←</span> {lang === 'id' ? 'Kembali ke Blog' : 'Back to Blog'}
          </Link>
        </div>

        <div className="inline-block px-4 py-1.5 bg-secondary/20 rounded-full font-nunito text-xs font-bold tracking-widest mb-6 text-secondary border border-secondary/30 uppercase">
          {category}
        </div>
        <h1 className="font-poppins text-3xl md:text-5xl font-bold mb-6 text-primary leading-tight text-balance">{title}</h1>
        <p className="text-gray-500 text-sm font-medium">{publishDate}</p>
      </section>

      {/* GAMBAR UTAMA */}
      <section className="w-full px-6 md:px-12 max-w-5xl mx-auto mb-16">
        <div className="relative w-full h-[400px] md:h-[600px] rounded-[40px] overflow-hidden shadow-xl">
          <Image src={imageSrc} alt={title} fill className="object-cover" priority />
        </div>
      </section>

      {/* KONTEN ARTIKEL & SHARE BUTTONS MULTI-PLATFORM */}
      <section className="w-full px-6 md:px-12 pb-24 max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
        
        {/* KOLOM SHARE (Kiri di Desktop, Atas di Mobile) */}
        <div className="md:w-1/12 flex md:flex-col gap-4 items-center md:items-start pt-2">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest md:-rotate-90 md:mb-10">{lang === 'id' ? 'Bagikan' : 'Share'}</span>
          
          {/* WhatsApp */}
          <a href={`https://wa.me/?text=${shareText}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition shadow-md" aria-label="Share to WhatsApp">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </a>
          
          {/* Telegram */}
          <a href={`https://t.me/share/url?url=${encodedUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0088cc] text-white flex items-center justify-center hover:scale-110 transition shadow-md" aria-label="Share to Telegram">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm5.894-16.476l-1.922 9.05c-.145.642-.518.796-1.05.5L11.5 14.542l-1.645 1.584c-.182.182-.335.335-.688.335l.244-3.49 6.353-5.74c.276-.246-.06-.382-.428-.135L7.493 11.96 4.12 10.9c-.733-.23-.746-.733.153-1.085l13.11-5.053c.607-.223 1.137.135.911 1.192z"/></svg>
          </a>

          {/* Facebook */}
          <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition shadow-md" aria-label="Share to Facebook">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>

          {/* X (Twitter) */}
          <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition shadow-md" aria-label="Share to X">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>

          {/* LinkedIn */}
          <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${shareText}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition shadow-md" aria-label="Share to LinkedIn">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>

        </div>

        {/* KOLOM KONTEN RICH TEXT */}
        <div className="md:w-11/12 prose prose-lg prose-blue max-w-none text-neutral-dark leading-relaxed font-nunito">
          {content.length > 0 ? (
            <PortableText value={content} components={ptComponents} />
          ) : (
            <p>{lang === 'id' ? 'Konten belum tersedia.' : 'Content not available.'}</p>
          )}
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