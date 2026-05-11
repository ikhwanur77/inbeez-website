import { type SchemaTypeDefinition } from 'sanity'
import testimonial from './testimonial'
import aboutUs from './aboutUs' // 👈 Ini sudah benar

// =========================================================
// 1. KOMPONEN BILINGUAL KUSTOM (KOTAK GANDA)
// =========================================================
const localeString = {
  name: 'localeString',
  title: 'Teks Pendek (Bilingual)',
  type: 'object',
  fields: [
    { name: 'id', title: '🇮🇩 Bahasa Indonesia (Default)', type: 'string' },
    { name: 'en', title: '🇬🇧 English', type: 'string' }
  ]
}

const localeText = {
  name: 'localeText',
  title: 'Teks Panjang (Bilingual)',
  type: 'object',
  fields: [
    { name: 'id', title: '🇮🇩 Bahasa Indonesia', type: 'text', rows: 3 },
    { name: 'en', title: '🇬🇧 English', type: 'text', rows: 3 }
  ]
}

const localeBlock = {
  name: 'localeBlock',
  title: 'Editor Konten (Bilingual)',
  type: 'object',
  fields: [
    { name: 'id', title: '🇮🇩 Konten (Indonesia)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    { name: 'en', title: '🇬🇧 Content (English)', type: 'array', of: [{ type: 'block' }, { type: 'image' }] }
  ]
}

// BARU: SLUG GANDA UNTUK URL YANG BERBEDA TIAP BAHASA
const localeSlug = {
  name: 'localeSlug',
  title: 'URL Slug / Link (Bilingual)',
  type: 'object',
  fields: [
    { name: 'id', title: '🇮🇩 Slug Indonesia', type: 'slug', options: { source: 'title.id' } },
    { name: 'en', title: '🇬🇧 Slug English', type: 'slug', options: { source: 'title.en' } }
  ]
}

// =========================================================
// 2. HELPER (SEO & GAMBAR BILINGUAL)
// =========================================================
const seoFields = [
  {
    name: 'seoGroup',
    title: '⚙️ Pengaturan SEO & Meta Data',
    type: 'object',
    options: { collapsible: true, collapsed: false },
    fields: [
      { name: 'focusKeyword', title: 'Focus Keyword', type: 'localeString', description: 'Kata kunci disesuaikan dengan bahasa pencarian Google' },
      { name: 'metaTitle', title: 'Meta Title', type: 'localeString' },
      { name: 'metaDescription', title: 'Meta Description', type: 'localeText' }
    ]
  }
]

const imageFields = {
  type: 'image',
  options: { hotspot: true },
  fields: [
    { name: 'alt', title: 'Alternative Text (SEO)', type: 'localeString', description: 'Deskripsi gambar dalam dua bahasa' }
  ]
}

// =========================================================
// 3. SKEMA UTAMA
// =========================================================
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    localeString,
    localeText,
    localeBlock,
    localeSlug,
    testimonial,
    aboutUs, // 👈 KITA TAMBAHKAN DI SINI AGAR TERBACA OLEH SANITY

    // --- 1. SETTINGS BERANDA ---
    {
      name: 'siteSettings',
      title: 'Pengaturan Web',
      type: 'document',
      fields: [
        { 
          name: 'isMaintenanceMode', 
          title: '🚨 Aktifkan Mode Maintenance?', 
          type: 'boolean', 
          initialValue: false,
          description: 'Nyalakan ini untuk menutup akses website sementara waktu.' 
        },
        { name: 'maintenanceTitle', title: 'Judul Maintenance', type: 'localeString' },
        { name: 'maintenanceDesc', title: 'Deskripsi Maintenance', type: 'localeText' },
        { name: 'heroTitle', title: 'Judul Utama Hero', type: 'localeString' },
        { name: 'heroDescription', title: 'Deskripsi Hero', type: 'localeText' },
        { name: 'heroImage', title: 'Background Hero', ...imageFields },
        { name: 'sectionLayananTitle', title: 'Judul Section Layanan', type: 'localeString' },
        { name: 'sectionLayananDesc', title: 'Deskripsi Section Layanan', type: 'localeText' },
        { name: 'sectionPortoTitle', title: 'Judul Section Portofolio', type: 'localeString' },
        { name: 'sectionPortoDesc', title: 'Deskripsi Section Portofolio', type: 'localeText' },
        { name: 'sectionTestiTitle', title: 'Judul Section Testimoni', type: 'localeString' },
        { name: 'sectionTestiDesc', title: 'Deskripsi Section Testimoni', type: 'localeText' },
        { name: 'sectionArtikelTitle', title: 'Judul Section Artikel', type: 'localeString' },
        { name: 'sectionArtikelDesc', title: 'Deskripsi Section Artikel', type: 'localeText' },
        { name: 'kontakTitle', title: 'Judul Area Kontak', type: 'localeString' },
        { name: 'kontakDesc', title: 'Deskripsi Area Kontak', type: 'localeText' },
        { name: 'whatsappNumber', title: 'Nomor WhatsApp (Contoh: 62812...)', type: 'string' },
        { name: 'officeAddress', title: 'Alamat Kantor', type: 'string' },
        { name: 'officeEmail', title: 'Email Bisnis', type: 'string' },
        ...seoFields 
      ]
    },

    // --- 2. LAYANAN ---
    {
      name: 'service',
      title: 'Layanan Utama',
      type: 'document',
      fields: [
        { 
          name: 'order', 
          title: 'Urutan Tampil', 
          type: 'number',
          description: 'Ketik angka urutan (Contoh: 1 tampil paling atas/kiri, 2 untuk kedua, dst.)'
        },
        { name: 'title', title: 'Judul Layanan', type: 'localeString' },
        { name: 'slug', title: 'URL Slug', type: 'localeSlug' }, 
        { name: 'description', title: 'Deskripsi Singkat', type: 'localeText' },
        { name: 'image', title: 'Gambar Utama Layanan', ...imageFields },
        {
          name: 'subServices',
          title: 'Daftar Sub Layanan',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'title', title: 'Nama Sub Layanan', type: 'localeString' },
                { name: 'description', title: 'Deskripsi Singkat', type: 'localeText' },
                { name: 'image', title: 'Gambar Sub Layanan', ...imageFields }, 
                { name: 'features', title: 'Apa yang didapatkan?', type: 'array', of: [{ type: 'localeString' }] },
                { name: 'waDefaultText', title: 'Teks Default CTA WhatsApp', type: 'localeString' } 
              ]
            }
          ]
        },
        ...seoFields 
      ]
    },

    // --- 3. PORTOFOLIO ---
    {
      name: 'portfolio',
      title: 'Portofolio Klien',
      type: 'document',
      fields: [
        { name: 'title', title: 'Judul Project', type: 'string' },
        { name: 'slug', title: 'URL Slug', type: 'localeSlug' }, 
        { name: 'serviceCategory', title: 'Kategori', type: 'reference', to: [{ type: 'service' }] },
        { name: 'description', title: 'Deskripsi Project', type: 'localeText' },
        { name: 'image', title: 'Foto Utama Project', ...imageFields },
        { name: 'gallery', title: 'Gallery Project', type: 'array', of: [{ ...imageFields }] },
        { name: 'ctaLink', title: 'Link Referensi', type: 'string' },
        ...seoFields 
      ]
    },

    // --- 4. ARTIKEL ---
    {
      name: 'article',
      title: 'Artikel Blog',
      type: 'document',
      fields: [
        { name: 'title', title: 'Judul Artikel', type: 'localeString' },
        { name: 'slug', title: 'URL Slug', type: 'localeSlug' }, 
        { name: 'category', title: 'Kategori Artikel', type: 'localeString' },
        { name: 'publishedAt', title: 'Tanggal & Jam Terbit', type: 'datetime' },
        { name: 'image', title: 'Foto Utama Artikel', ...imageFields },
        { name: 'content', title: 'Isi Konten Artikel', type: 'localeBlock' },
        ...seoFields 
      ]
    }
  ],
}