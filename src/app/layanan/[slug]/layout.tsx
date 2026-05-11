import type { Metadata } from 'next'
import { client } from '../../../sanity/client'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const service = await client.fetch(
      `*[_type == "service" && (slug.id.current == $slug || slug.en.current == $slug)][0]`,
      { slug }
    );

    if (!service) {
      return { title: 'Layanan Tidak Ditemukan | Inbeez.id' }
    }

    // Mengambil data dari field SEO Bilingual yang kita buat di Sanity
    const title = service.seoGroup?.metaTitle?.id || service.title?.id || "Layanan Inbeez.id";
    const description = service.seoGroup?.metaDescription?.id || service.description?.id || "Solusi digital strategis untuk bisnis Anda.";
    const keywords = service.seoGroup?.focusKeyword?.id || "";

    return {
      title: `${title} | Inbeez.id`,
      description: description,
      keywords: keywords,
      openGraph: {
        title: title,
        description: description,
        type: 'website',
        // Jika ada image di Sanity, bisa ditambahkan di sini untuk preview link
      }
    }
  } catch (error) {
    return { title: 'Layanan | Inbeez.id' }
  }
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}