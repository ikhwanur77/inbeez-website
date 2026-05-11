import type { Metadata } from 'next'
import { client } from '../../../sanity/client'

// FUNGSI INI AKAN MENCOCOKAN SLUG URL DENGAN DATA SANITY
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await client.fetch(
      `*[_type == "article" && (slug.id.current == $slug || slug.en.current == $slug)][0]`,
      { slug }
    );

    if (!article) {
      return { title: 'Artikel Tidak Ditemukan | Inbeez.id' }
    }

    const title = article.seoGroup?.metaTitle?.id || article.title?.id || "Artikel Inbeez";
    const description = article.seoGroup?.metaDescription?.id || article.description?.id || "Baca wawasan terbaru dari kami.";
    const keywords = article.seoGroup?.focusKeyword?.id || "";

    return {
      title: title,
      description: description,
      keywords: keywords,
      openGraph: {
        title: title,
        description: description,
        type: 'article',
      }
    }
  } catch (error) {
    return { title: 'Artikel Inbeez.id' }
  }
}

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Hanya me-return children karena desain visual sudah ada di page.tsx
  return <>{children}</>
}