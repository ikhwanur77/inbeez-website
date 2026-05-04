import dynamic from 'next/dynamic';

// 1. Ekspor SEO bawaan Sanity (Aman di Server)
export { metadata, viewport } from 'next-sanity/studio';

// 2. Panggil file Studio.tsx yang baru kita buat, TAPI larang server Vercel membacanya (ssr: false)
const StudioNoSSR = dynamic(() => import('./Studio'), { ssr: false });

export default function StudioPage() {
  return <StudioNoSSR />;
}