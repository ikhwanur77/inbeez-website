"use client";

import dynamic from 'next/dynamic';

// Memanggil Studio kita, dan secara resmi mematikan SSR dari dalam Client Component
const Studio = dynamic(() => import('./Studio'), { ssr: false });

export default function StudioWrapper() {
  return <Studio />;
}