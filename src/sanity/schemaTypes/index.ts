import { type SchemaTypeDefinition } from 'sanity'

// --- HELPER: REUSABLE SEO FIELDS ---
const seoFields = [
  {
    name: 'seoGroup',
    title: 'Pengaturan SEO',
    type: 'object',
    options: { collapsible: true, collapsed: false },
    fields: [
      { name: 'focusKeyword', title: 'Focus Keyword', type: 'string', description: 'Kata kunci utama untuk halaman ini' },
      { name: 'metaTitle', title: 'Meta Title', type: 'string', description: 'Judul yang muncul di Google (Maks 60 Karakter)' },
      { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3, description: 'Deskripsi yang muncul di Google (Maks 160 Karakter)' },
      { name: 'seoScore', title: 'SEO Score (Manual)', type: 'number', description: 'Indikator skor internal (1-100)', validation: (Rule: any) => Rule.min(0).max(100) },
    ]
  }
]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // --- 1. SETTINGS BERANDA & KONTAK (BARU!) ---
    {
      name: 'siteSettings',
      title: 'Pengaturan Web (Hero & Kontak)',
      type: 'document',
      fields: [
        { name: 'heroTitle', title: 'Judul Utama Hero', type: 'string' },
        { name: 'heroDescription', title: 'Deskripsi Hero', type: 'text', rows: 3 },
        { name: 'heroImage', title: 'Background Hero', type: 'image', options: { hotspot: true } },
        { name: 'whatsappNumber', title: 'Nomor WhatsApp', type: 'string', description: 'Contoh: 628131161101' },
        { name: 'officeAddress', title: 'Alamat Kantor', type: 'text', rows: 2 },
        { name: 'officeEmail', title: 'Email Bisnis', type: 'string' },
        ...seoFields // Tambahkan SEO di Setting Utama
      ]
    },

    // --- 2. SCHEMA LAYANAN ---
    {
      name: 'service',
      title: 'Layanan Utama',
      type: 'document',
      fields: [
        { name: 'title', title: 'Judul Layanan', type: 'string' },
        { name: 'description', title: 'Deskripsi Singkat', type: 'text', rows: 3 },
        { name: 'image', title: 'Gambar Layanan', type: 'image', options: { hotspot: true } },
        { name: 'link', title: 'Link Halaman (Slug)', type: 'string' },
        ...seoFields // Tambahkan SEO di tiap Layanan
      ]
    },

    // --- 3. SCHEMA PORTOFOLIO ---
    {
      name: 'portfolio',
      title: 'Portofolio Klien',
      type: 'document',
      fields: [
        { name: 'title', title: 'Nama Project', type: 'string' },
        { name: 'category', title: 'Kategori Jasa', type: 'string' },
        { name: 'description', title: 'Deskripsi Singkat', type: 'text', rows: 3 },
        { name: 'image', title: 'Gambar Portofolio', type: 'image', options: { hotspot: true } },
        ...seoFields // Tambahkan SEO di tiap Portofolio
      ]
    },

    // --- 4. SCHEMA TESTIMONI ---
    {
      name: 'testimonial',
      title: 'Testimoni Klien',
      type: 'document',
      fields: [
        { name: 'name', title: 'Nama Klien', type: 'string' },
        { name: 'position', title: 'Jabatan/Perusahaan', type: 'string' },
        { name: 'quote', title: 'Isi Testimoni', type: 'text', rows: 4 },
        { name: 'rating', title: 'Rating (1-5)', type: 'number', initialValue: 5 },
        { name: 'clientPhoto', title: 'Foto Klien', type: 'image' }
      ]
    },

    // --- 5. SCHEMA ARTIKEL ---
    {
      name: 'article',
      title: 'Artikel Blog',
      type: 'document',
      fields: [
        { name: 'title', title: 'Judul Artikel', type: 'string' },
        { name: 'slug', title: 'URL Slug', type: 'slug', options: { source: 'title' } },
        { name: 'date', title: 'Tanggal Terbit', type: 'string' },
        { name: 'description', title: 'Ringkasan', type: 'text', rows: 3 },
        { name: 'image', title: 'Gambar Cover', type: 'image', options: { hotspot: true } },
        ...seoFields // Tambahkan SEO di tiap Artikel
      ]
    }
  ],
}