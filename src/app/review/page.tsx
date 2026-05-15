"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { client } from '../../sanity/client';

export default function SubmitReview() {
  const [step, setStep] = useState<1 | 2 | 3>(1); 
  const [lang, setLang] = useState<'id' | 'en'>('id');
  const [services, setServices] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0); 
  
  // State untuk Preview Foto
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    serviceIds: [] as string[], 
    quote: '',
    rating: 5,
    photo: null as File | null
  });

  useEffect(() => {
    async function fetchServices() {
      try {
        const svcs = await client.fetch(`*[_type == "service"]{ _id, title }`);
        setServices(svcs);
      } catch (error) {
        console.error("Gagal mengambil data layanan", error);
      }
    }
    fetchServices();
  }, []);

  const handleLanguageSelect = (selectedLang: 'id' | 'en') => {
    setLang(selectedLang);
    setStep(2);
  };

  const toggleService = (id: string) => {
    setFormData(prev => {
      const isSelected = prev.serviceIds.includes(id);
      if (isSelected) {
        return { ...prev, serviceIds: prev.serviceIds.filter(sId => sId !== id) };
      } else {
        return { ...prev, serviceIds: [...prev.serviceIds, id] };
      }
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.serviceIds.length === 0) {
      alert(lang === 'id' ? 'Silakan pilih minimal satu layanan.' : 'Please select at least one service.');
      return;
    }
    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('position', formData.position);
      submitData.append('quote', formData.quote);
      submitData.append('rating', formData.rating.toString());
      formData.serviceIds.forEach(id => submitData.append('serviceIds', id));
      if (formData.photo) submitData.append('photo', formData.photo);

      const res = await fetch('/api/testimonial', { method: 'POST', body: submitData });
      if (res.ok) {
        setStep(3); 
      } else {
        alert(lang === 'id' ? 'Gagal mengirim ulasan. Silakan coba lagi.' : 'Failed to submit review.');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  return (
    // Perbaikan: Container diubah agar mendukung posisi absolute untuk dekorasi
    <main className="min-h-screen bg-slate-50 relative font-nunito flex flex-col items-center justify-center p-4 md:p-6 py-10 overflow-hidden">
      
      {/* --- DEKORASI BACKGROUND (Modern Tech Pattern) --- */}
      {/* 1. Grid Pattern Samar */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* 2. Pendaran Cahaya (Glowing Blobs) */}
      <div className="absolute top-0 left-0 w-72 h-72 md:w-96 md:h-96 bg-primary/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-0 transform -translate-x-1/2 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 md:w-96 md:h-96 bg-secondary/15 rounded-full blur-[80px] md:blur-[120px] pointer-events-none z-0 transform translate-x-1/3 translate-y-1/3"></div>

      {/* --- KOTAK FORM (Glassmorphism) --- */}
      {/* Perbaikan: bg-white/95 dan backdrop-blur untuk efek tembus pandang elegan */}
      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-[30px] md:rounded-[40px] shadow-2xl p-6 md:p-14 border border-white/60 relative z-10">
        
        {/* Logo */}
        <div className="flex justify-center mb-8 md:mb-10">
          <Link href="/"><Image src="/main-logo-inbeez-id.png" alt="Inbeez" width={140} height={40} className="object-contain" priority /></Link>
        </div>

        {/* STEP 1: PILIH BAHASA */}
        {step === 1 && (
          <div className="text-center animate-fade-in flex flex-col">
            <div className="mb-8 md:mb-12">
              <h1 className="font-poppins text-3xl md:text-4xl font-bold text-primary mb-1">Welcome</h1>
              <h2 className="font-poppins text-2xl md:text-3xl font-bold text-secondary opacity-90 mb-4">Selamat Datang</h2>
              <div className="flex flex-col gap-1 text-gray-500 text-sm md:text-base">
                <p>Please select your language</p>
                <p>Silakan pilih bahasa Anda</p>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <button onClick={() => handleLanguageSelect('id')} className="group flex items-center justify-between px-6 py-5 md:px-8 md:py-6 bg-primary text-white font-bold rounded-[20px] md:rounded-3xl hover:bg-primary-light transition-all duration-300 shadow-lg border border-primary-light/50">
                <span className="text-base md:text-lg">Tulis dalam Bahasa Indonesia</span>
                <span className="text-xl md:text-2xl group-hover:translate-x-2 transition-transform">🇮🇩 →</span>
              </button>

              <button onClick={() => handleLanguageSelect('en')} className="group flex items-center justify-between px-6 py-5 md:px-8 md:py-6 bg-secondary text-neutral-black font-bold rounded-[20px] md:rounded-3xl hover:bg-secondary-light transition-all duration-300 shadow-lg border border-secondary/50">
                <span className="text-base md:text-lg">Write in English</span>
                <span className="text-xl md:text-2xl group-hover:translate-x-2 transition-transform">🇬🇧 →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ISI FORM */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="font-poppins text-2xl md:text-3xl font-bold text-primary mb-2 text-center text-balance">
              {lang === 'id' ? 'Bagikan Pengalaman Anda' : 'Share Your Experience'}
            </h1>
            <p className="text-gray-500 mb-8 text-center text-xs md:text-sm">
              {lang === 'id' ? 'Ulasan Anda sangat berarti bagi kami.' : 'Your review means a lot to us.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* UPLOAD FOTO */}
              <div className="flex flex-col items-center mb-6 md:mb-8">
                <div className="relative w-20 h-20 md:w-24 md:h-24 mb-3 group">
                  <div className="w-full h-full rounded-full bg-white border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden shadow-sm">
                    {photoPreview ? (
                      <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-1.5 md:p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary-light transition border-2 border-white">
                    <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">{lang === 'id' ? 'Foto Anda (Opsional)' : 'Your Photo (Optional)'}</span>
              </div>

              {/* RATING BINTANG */}
              <div className="flex flex-col items-center mb-8">
                <div className="flex gap-1 md:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="focus:outline-none hover:scale-110 transition p-1">
                      <svg className={`w-8 h-8 md:w-10 md:h-10 transition-colors ${star <= (hoverRating || formData.rating) ? 'text-secondary drop-shadow-sm' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z"/></svg>
                    </button>
                  ))}
                </div>
              </div>

              {/* INPUT NAMA & JABATAN */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-2">{lang === 'id' ? 'Nama' : 'Name'}</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3.5 md:p-4 text-sm md:text-base bg-white/80 border border-gray-100 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-primary transition" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-2">{lang === 'id' ? 'Jabatan / Nama Bisnis' : 'Position / Business Name'}</label>
                  <input required type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-3.5 md:p-4 text-sm md:text-base bg-white/80 border border-gray-100 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-primary transition" placeholder="CEO, Tech Corp" />
                </div>
              </div>

              {/* MULTI SELECT LAYANAN */}
              <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-3">{lang === 'id' ? 'Layanan yang Digunakan' : 'Services Used'}</label>
                <div className="flex flex-wrap gap-2">
                  {services.map(s => {
                    const isSelected = formData.serviceIds.includes(s._id);
                    return (
                      <button key={s._id} type="button" onClick={() => toggleService(s._id)} className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold transition-all border ${isSelected ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white/80 text-gray-500 border-gray-200 hover:border-primary hover:text-primary'}`}>
                        {getTxt(s.title)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ULASAN TEXTAREA */}
              <div>
                <label className="block text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-2">{lang === 'id' ? 'Ulasan' : 'Review'}</label>
                <textarea required rows={4} value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} className="w-full p-3.5 md:p-4 text-sm md:text-base bg-white/80 border border-gray-100 rounded-xl md:rounded-2xl outline-none focus:ring-2 focus:ring-primary transition" placeholder={lang === 'id' ? "Ceritakan pengalaman Anda bekerja sama dengan kami..." : "Tell us about your experience working with us..."}></textarea>
              </div>

              <button disabled={isSubmitting} type="submit" className={`w-full font-poppins font-bold py-4 md:py-5 rounded-xl md:rounded-2xl transition shadow-lg text-base md:text-lg mt-4 ${isSubmitting ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-light'}`}>
                {isSubmitting ? (lang === 'id' ? 'Mengirim...' : 'Submitting...') : (lang === 'id' ? 'Kirim Ulasan' : 'Submit Review')}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUKSES */}
        {step === 3 && (
          <div className="text-center animate-fade-in py-8 md:py-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1 className="font-poppins text-2xl md:text-3xl font-bold text-primary mb-3 md:mb-4">{lang === 'id' ? 'Sukses!' : 'Success!'}</h1>
            <p className="text-gray-500 mb-8 md:mb-10 text-xs md:text-sm px-4">{lang === 'id' ? 'Terima kasih atas waktu dan ulasan Anda. Kami akan segera meninjaunya.' : 'Thank you for your time and review. We will review it shortly.'}</p>
            <Link href="/" className="px-8 py-3 md:px-10 md:py-4 bg-primary text-white font-bold text-sm md:text-base rounded-full hover:bg-primary-light transition shadow-md inline-block">
              {lang === 'id' ? 'Kembali ke Beranda' : 'Back to Home'}
            </Link>
          </div>
        )}

      </div>
    </main>
  );
}