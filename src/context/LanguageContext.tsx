// src/context/LanguageContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type LangType = 'id' | 'en';

interface LanguageContextType {
  lang: LangType;
  setLang: (lang: LangType) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangType>('id'); // Bahasa default adalah Indonesia

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook agar halaman lain gampang mengambil bahasanya
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage harus digunakan di dalam LanguageProvider');
  }
  return context;
}