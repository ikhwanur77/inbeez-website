"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
  // Hook ini bertugas memantau apakah ada perubahan URL (pindah halaman)
  const pathname = usePathname();

  useEffect(() => {
    // Jika URL berubah, paksa browser kembali ke titik koordinat (0,0) / Paling atas
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto", // Gunakan 'auto' agar instan, mengabaikan efek 'scroll-smooth' CSS sejenak
    });
  }, [pathname]);

  return null; // Komponen ini bekerja di belakang layar, tidak menampilkan apa-apa
}