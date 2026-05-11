import type { Metadata } from 'next'
import { client } from '../../../sanity/client'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  try {
    const portfolio = await client.fetch(
      `*[_type == "portfolio" && (slug.id.current == $slug || slug.en.current == $slug)][0]`,
      { slug }
    );

    if (!portfolio) {
      return { title: 'Project Tidak Ditemukan | Inbeez.id' }
    }

    const title = portfolio.seoGroup?.metaTitle?.id || portfolio.title || "Project Portofolio";
    const description = portfolio.seoGroup?.metaDescription?.id || portfolio.description?.id || "Lihat bagaimana kami membantu klien mencapai sukses digital.";
    const keywords = portfolio.seoGroup?.focusKeyword?.id || "";

    return {
      title: `${title} | Portofolio Inbeez.id`,
      description: description,
      keywords: keywords,
      openGraph: {
        title: title,
        description: description,
        type: 'article', // Portofolio sering dianggap artikel/case study oleh Google
      }
    }
  } catch (error) {
    return { title: 'Portofolio | Inbeez.id' }
  }
}

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}