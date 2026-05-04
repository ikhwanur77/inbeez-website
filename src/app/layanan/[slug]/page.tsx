import Image from 'next/image';
import Link from 'next/link';
import { client } from '../../../sanity/client'; // Import koneksi Sanity
import imageUrlBuilder from '@sanity/image-url';

// Tool pembangun URL gambar Sanity
const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

// --- FUNGSI SEO OTOMATIS (DYNAMIC METADATA) ---
export async function generateMetadata({ params }: any) {
  const resolvedParams = await params; // FIX UNTUK NEXT.JS 15
  const slug = resolvedParams.slug;
  
  // Mengubah format URL "website-development" menjadi "Website Development" untuk Title SEO
  const formattedTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  
  return {
    title: `${formattedTitle} | Inbeez.id Digital Growth Partner`,
    description: `Tingkatkan performa bisnis Anda dengan layanan ${formattedTitle} dari Inbeez.id. Solusi digital berbasis data dan teroptimasi penuh.`,
  };
}

// --- KOMPONEN UTAMA HALAMAN ---
export default async function ServiceDetail({ params }: any) {
  const resolvedParams = await params; // FIX UNTUK NEXT.JS 15
  const slug = resolvedParams.slug;
  const targetLink = `/layanan/${slug}`; // Contoh: /layanan/website-development

  // 1. Tarik data secara live dari Sanity berdasarkan URL
  const serviceData = await client.fetch(`*[_type == "service" && link == $targetLink][0]`, { targetLink });

  // 2. Siapkan Data Fallback (Jika data belum diinput di CMS Admin, tetap tampilkan desain cantik)
  const formattedTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  const title = serviceData?.title || formattedTitle;
  const description = serviceData?.description || "Deskripsi lengkap untuk layanan ini belum ditambahkan. Silakan lengkapi melalui Sanity Studio untuk melihat perubahannya di sini secara real-time.";
  const imageSrc = serviceData?.image ? urlFor(serviceData.image).url() : "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop";

  return (
    <main className="min-h-screen bg-white font-nunito flex flex-col">
      {/* --- Header Ringkas --- */}
      <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <Link href="/">
          <Image src="/main-logo-inbeez-id.png" alt="Inbeez.id Logo" width={150} height={40} className="object-contain" priority />
        </Link>
        <Link href="/#layanan" className="font-poppins font-bold text-primary border-b-2 border-transparent hover:border-primary transition">
          ← Kembali ke Beranda
        </Link>
      </nav>

      {/* --- Hero Section Layanan --- */}
      <section className="relative w-full py-24 px-6 md:px-12 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <Image src={imageSrc} alt={title} fill className="object-cover grayscale" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="text-secondary font-bold tracking-widest uppercase mb-4 block text-sm">Layanan Spesialis Inbeez</span>
          <h1 className="font-poppins text-4xl md:text-6xl font-bold mb-6">{title}</h1>
          <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>
      </section>

      {/* --- Konten Detail & CTA --- */}
      <section className="w-full py-24 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center">
           {/* Gambar Kiri */}
           <div className="w-full md:w-1/2 relative h-[450px] rounded-[40px] overflow-hidden shadow-2xl group">
             <Image src={imageSrc} alt={title} fill className="object-cover group-hover:scale-105 transition duration-700" />
           </div>
           
           {/* Teks Kanan */}
           <div className="w-full md:w-1/2">
             <h2 className="font-poppins text-4xl font-bold text-primary mb-6 leading-tight">Tingkatkan Performa Bisnis Anda</h2>
             <p className="text-neutral-dark mb-8 leading-relaxed text-lg">
               Sebagai Konsultan Bisnis Digital, kami memastikan implementasi <strong>{title}</strong> ini tidak hanya berfungsi secara teknis, namun dirancang khusus untuk menghasilkan pertumbuhan revenue yang nyata dan selaras dengan SOP perusahaan Anda.
             </p>
             
             {/* Benefit List */}
             <ul className="space-y-5 mb-10 text-neutral-dark font-semibold">
               <li className="flex items-center"><div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mr-4"><span className="text-secondary text-lg">✓</span></div> Strategi Berbasis Data & Analitik</li>
               <li className="flex items-center"><div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mr-4"><span className="text-secondary text-lg">✓</span></div> Teroptimasi Penuh untuk SEO</li>
               <li className="flex items-center"><div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mr-4"><span className="text-secondary text-lg">✓</span></div> Laporan Performa Transparan</li>
             </ul>

             <Link href="/#kontak" className="inline-block bg-secondary text-neutral-black font-poppins font-bold px-10 py-4 rounded-full hover:bg-secondary-light transition shadow-xl text-lg">
               Konsultasi Gratis Sekarang
             </Link>
           </div>
        </div>
      </section>

      {/* --- Footer Singkat --- */}
      <footer className="w-full bg-gray-50 border-t border-gray-100 py-10 px-6 text-center mt-auto">
        <p className="text-gray-400 text-sm font-medium font-nunito">© 2026 PT. Akselerator Bisnis Jagadigital. All rights reserved.</p>
      </footer>
    </main>
  );
}