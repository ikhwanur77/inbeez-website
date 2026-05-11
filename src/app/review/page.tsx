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

  // Ambil daftar layanan dari Sanity untuk pilihan di Form
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

  // Fungsi untuk Centang/Uncentang Layanan (Multi-Select)
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

  // Fungsi untuk Menangkap Foto & Membuat Visual Preview
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file)); 
    }
  };

  // Fungsi Utama Pengiriman ke Jalur API Rahasia Kita
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Wajib Pilih Layanan
    if (formData.serviceIds.length === 0) {
      alert(lang === 'id' ? 'Silakan pilih minimal satu layanan.' : 'Please select at least one service.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Siapkan paket data (FormData bisa mengirim teks sekaligus file foto)
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('position', formData.position);
      submitData.append('quote', formData.quote);
      submitData.append('rating', formData.rating.toString());
      
      // Masukkan semua ID layanan yang dipilih klien
      formData.serviceIds.forEach(id => {
        submitData.append('serviceIds', id);
      });

      // Masukkan foto jika klien mengunggahnya
      if (formData.photo) {
        submitData.append('photo', formData.photo);
      }

      // Tembak ke API kita (yang sudah dibekali Token Sanity)
      const res = await fetch('/api/testimonial', {
        method: 'POST',
        body: submitData 
      });

      if (res.ok) {
        setStep(3); // Sukses! Pindah ke layar hijau.
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

  // Helper Teks Bilingual
  const getTxt = (obj: any, fallback: string = "") => {
    if (!obj) return fallback;
    return obj[lang] || obj['id'] || fallback;
  };

  return (
    <main className="min-h-screen bg-gray-50 font-nunito flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl p-8 md:p-14 border border-gray-100 relative overflow-hidden">
        
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/"><Image src="/main-logo-inbeez-id.png" alt="Inbeez" width={150} height={40} className="object-contain" priority /></Link>
        </div>

        {/* STEP 1: PILIH BAHASA */}
        {step === 1 && (
          <div className="text-center animate-fade-in flex flex-col">
            <h1 className="font-poppins text-3xl font-bold text-primary mb-2">Welcome / Selamat Datang</h1>
            <p className="text-gray-400 mb-10 text-sm">Please select your language / Silakan pilih bahasa Anda</p>
            
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleLanguageSelect('id')} 
                className="group flex items-center justify-between px-8 py-6 bg-primary text-white font-bold rounded-3xl hover:bg-primary-light transition-all duration-300 shadow-lg"
              >
                <span className="text-lg">Tulis dalam Bahasa Indonesia</span>
                <span className="text-2xl group-hover:translate-x-2 transition-transform">🇮🇩 →</span>
              </button>

              <button 
                onClick={() => handleLanguageSelect('en')} 
                className="group flex items-center justify-between px-8 py-6 bg-secondary text-neutral-black font-bold rounded-3xl hover:bg-secondary-light transition-all duration-300 shadow-lg"
              >
                <span className="text-lg">Write in English</span>
                <span className="text-2xl group-hover:translate-x-2 transition-transform">🇬🇧 →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: ISI FORM */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="font-poppins text-3xl font-bold text-primary mb-2 text-center">
              {lang === 'id' ? 'Bagikan Pengalaman Anda' : 'Share Your Experience'}
            </h1>
            <p className="text-gray-500 mb-8 text-center text-sm">
              {lang === 'id' ? 'Ulasan Anda sangat berarti bagi kami.' : 'Your review means a lot to us.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* UPLOAD FOTO (OPSIONAL) */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-24 h-24 mb-4 group">
                  <div className="w-full h-full rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-primary-light transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{lang === 'id' ? 'Foto Anda (Opsional)' : 'Your Photo (Optional)'}</span>
              </div>

              {/* RATING BINTANG */}
              <div className="flex flex-col items-center mb-8">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="focus:outline-none hover:scale-110 transition">
                      <svg className={`w-10 h-10 transition-colors ${star <= (hoverRating || formData.rating) ? 'text-secondary' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 24 24"><path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z"/></svg>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{lang === 'id' ? 'Nama' : 'Name'}</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{lang === 'id' ? 'Jabatan' : 'Position'}</label>
                  <input required type="text" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary" placeholder="CEO, Tech Corp" />
                </div>
              </div>

              {/* MULTI SELECT LAYANAN */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-3">{lang === 'id' ? 'Layanan yang Digunakan' : 'Services Used'}</label>
                <div className="flex flex-wrap gap-2">
                  {services.map(s => {
                    const isSelected = formData.serviceIds.includes(s._id);
                    return (
                      <button key={s._id} type="button" onClick={() => toggleService(s._id)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isSelected ? 'bg-primary text-white border-primary' : 'bg-white text-gray-400 border-gray-100 hover:border-primary'}`}>
                        {getTxt(s.title)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">{lang === 'id' ? 'Ulasan' : 'Review'}</label>
                <textarea required rows={4} value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary" placeholder="Tell us about your experience..."></textarea>
              </div>

              <button disabled={isSubmitting} type="submit" className={`w-full font-poppins font-bold py-5 rounded-2xl transition shadow-lg text-lg ${isSubmitting ? 'bg-gray-200 text-gray-400' : 'bg-primary text-white hover:bg-primary-light'}`}>
                {isSubmitting ? (lang === 'id' ? 'Mengirim...' : 'Submitting...') : (lang === 'id' ? 'Kirim Ulasan' : 'Submit Review')}
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUKSES */}
        {step === 3 && (
          <div className="text-center animate-fade-in py-10">
            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h1 className="font-poppins text-3xl font-bold text-primary mb-4">{lang === 'id' ? 'Sukses!' : 'Success!'}</h1>
            <p className="text-gray-500 mb-10 text-sm">{lang === 'id' ? 'Terima kasih atas ulasan Anda. Kami akan segera meninjaunya.' : 'Thank you for your review. We will review it shortly.'}</p>
            <Link href="/" className="px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-light transition shadow-md inline-block">Home</Link>
          </div>
        )}

      </div>
    </main>
  );
}