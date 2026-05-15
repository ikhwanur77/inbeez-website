// src/app/page.tsx
import { client } from '@/sanity/client';
import HomeClient from '@/components/HomeClient';

// INI ADALAH SERVER COMPONENT (Tidak ada "use client", sangat ramah SEO)
export default async function Home() {
  
  // Ambil data di sisi Server (0 Detik Loading di HP klien)
  const settingsData = await client.fetch(`*[_type == "siteSettings"][0]`);
  const servicesData = await client.fetch(`*[_type == "service"] | order(order asc)[0...6]`);
  const portfoliosData = await client.fetch(`*[_type == "portfolio"][0...5]`);
  const testiData = await client.fetch(`*[_type == "testimonial"][0...5]`);
  const articlesData = await client.fetch(`*[_type == "article"] | order(publishedAt desc)[0...3]`);

  // Kirim data matang ke komponen visual
  return (
    <HomeClient 
      settingsData={settingsData} 
      servicesData={servicesData} 
      portfoliosData={portfoliosData} 
      testiData={testiData} 
      articlesData={articlesData} 
    />
  );
}