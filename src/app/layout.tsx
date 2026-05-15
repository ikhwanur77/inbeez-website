// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import WhatsAppPopup from '@/components/WhatsAppPopup'
import { client } from '@/sanity/client' 
import MaintenanceScreen from '@/components/MaintenanceScreen' 

// 1. IMPORT PROVIDER, NAVBAR, & SCROLL HELPER
import { LanguageProvider } from '@/context/LanguageContext'
import Navbar from '@/components/Navbar'
import ScrollToTop from '@/components/ScrollToTop' 

// 2. IMPORT GOOGLE ANALYTICS
import { GoogleAnalytics } from '@next/third-parties/google'

// --- GENERATE METADATA (SEO Dinamis) ---
export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await client.fetch(`*[_type == "siteSettings"][0]`);
    
    const title = settings?.seoGroup?.metaTitle?.id || "PT. Akselerator Bisnis Jagadigital | Inbeez.id";
    const description = settings?.seoGroup?.metaDescription?.id || "Mitra pertumbuhan digital Anda melalui strategi, sistem teknologi, dan konten kreatif yang berdampak nyata.";
    const keywords = settings?.seoGroup?.focusKeyword?.id || "digital agency bali, web development, seo optimization";

    return {
      title: title,
      description: description,
      keywords: keywords,
      openGraph: {
        title: title,
        description: description,
        url: 'https://inbeez.id',
        siteName: 'Inbeez.id',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
      }
    }
  } catch (error) {
    return {
      title: "Inbeez.id | Digital Growth Partner",
      description: "Mitra pertumbuhan digital untuk akselerasi bisnis Anda."
    }
  }
}

// --- ROOT LAYOUT ---
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Tarik status maintenance dari Sanity
  const settings = await client.fetch(`
    *[_type == "siteSettings"][0]{ 
      isMaintenanceMode, 
      maintenanceTitle, 
      maintenanceDesc, 
      whatsappNumber 
    }
  `);

  const isMaintenance = settings?.isMaintenanceMode === true;

  return (
    <html lang="id" className="scroll-smooth">
      {/* 👇 OPTIMASI KECEPATAN: Membuka jalur DNS ke Sanity lebih awal */}
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
      </head>

      <body className="antialiased text-neutral-dark">
        <LanguageProvider>
          {isMaintenance ? (
            <MaintenanceScreen settings={settings} />
          ) : (
            <>
              <ScrollToTop /> 
              <Navbar />
              <div className="min-h-screen">
                {children}
              </div>
              <WhatsAppPopup />
            </>
          )}
        </LanguageProvider>
      </body>
      
      {/* Google Analytics ID */}
      <GoogleAnalytics gaId="G-DYZQS8L0BP" />
      
    </html>
  )
}