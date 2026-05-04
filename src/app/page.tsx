import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      {/* --- Bagian Navigasi (Header) --- */}
      <nav className="w-full bg-white shadow-sm py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <div className="font-poppins font-bold text-2xl text-primary tracking-tight">
          inbeez.id
        </div>
        <div className="hidden md:flex space-x-8 font-nunito font-semibold text-neutral-dark items-center">
          <Link href="#layanan" className="hover:text-primary transition">Layanan</Link>
          <Link href="#portofolio" className="hover:text-primary transition">Portofolio</Link>
          <Link href="#tentang" className="hover:text-primary transition">Tentang Kami</Link>
          <Link href="#kontak" className="bg-primary text-white px-5 py-2 rounded-md hover:bg-primary-light transition shadow-md">
            Hubungi Kami
          </Link>
        </div>
      </nav>

      {/* --- Bagian Hero Section --- */}
      <section className="w-full bg-primary text-white py-24 px-6 md:px-12 text-center flex flex-col items-center justify-center min-h-[80vh]">
        <h1 className="font-poppins text-4xl md:text-6xl font-bold mb-6 max-w-5xl leading-tight">
          Tumbuh Lebih Mudah bersama <span className="text-secondary">Digital Growth Partner</span> Anda.
        </h1>
        <p className="font-nunito text-lg md:text-xl max-w-3xl mb-10 text-gray-200">
          Kami membantu bisnis Anda tumbuh melalui strategi digital, sistem teknologi, dan konten kreatif yang berdampak nyata. Kami tidak sekadar membuat aset, tapi membangun sistem.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="#layanan" className="bg-secondary text-neutral-black font-poppins font-bold px-8 py-3 rounded-md hover:bg-secondary-light transition shadow-lg text-lg">
            Eksplorasi Layanan
          </Link>
          <Link href="#konsultasi" className="bg-transparent border-2 border-white font-poppins font-semibold px-8 py-3 rounded-md hover:bg-white hover:text-primary transition text-lg">
            Konsultasi Gratis
          </Link>
        </div>
      </section>

      {/* --- Bagian Value Proposition --- */}
      <section className="w-full py-20 px-6 md:px-12 bg-gray-50 text-center">
        <h2 className="font-poppins text-3xl md:text-4xl font-bold text-primary mb-6">
          Solusi Berbasis Hasil, Bukan Sekadar Estetika
        </h2>
        <p className="font-nunito text-lg text-neutral-dark max-w-4xl mx-auto leading-relaxed">
          Sebagai konsultan bisnis digital, kami memastikan penerapan teknologi selaras dengan operasional bisnis Anda yang sudah sehat—mulai dari struktur, SOP, hingga laporan keuangan.
        </p>
      </section>

      {/* --- Footer Sementara --- */}
      <footer className="w-full bg-neutral-dark text-white py-8 text-center font-nunito mt-auto">
        <p>&copy; 2026 PT. Akselerator Bisnis Jagadigital. All rights reserved.</p>
      </footer>
    </main>
  );
}