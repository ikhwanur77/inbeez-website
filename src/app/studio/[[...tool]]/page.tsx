import StudioWrapper from './StudioWrapper';

// Ekspor metadata SEO (Aman di Server)
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <StudioWrapper />;
}