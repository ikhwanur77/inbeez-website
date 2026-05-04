"use client";

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config'; // Memanggil konfigurasi asli dari root folder

export default function Studio() {
  return <NextStudio config={config} />;
}