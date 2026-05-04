import { type SchemaTypeDefinition } from 'sanity'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // --- 1. SCHEMA LAYANAN ---
    {
      name: 'service',
      title: 'Layanan Utama',
      type: 'document',
      fields: [
        { name: 'title', title: 'Judul Layanan', type: 'string' },
        { name: 'description', title: 'Deskripsi Singkat', type: 'text', rows: 3 },
        { name: 'image', title: 'Gambar Layanan', type: 'image', options: { hotspot: true } },
        { name: 'link', title: 'Link Halaman (Slug)', type: 'string', description: 'Contoh: /layanan/seo' }
      ]
    },

    // --- 2. SCHEMA PORTOFOLIO ---
    {
      name: 'portfolio',
      title: 'Portofolio Klien',
      type: 'document',
      fields: [
        { name: 'title', title: 'Nama Project', type: 'string' },
        { name: 'category', title: 'Kategori Jasa', type: 'string', description: 'Contoh: Web Dev + SEO' },
        { name: 'description', title: 'Deskripsi Singkat / Hasil', type: 'text', rows: 3 },
        { name: 'image', title: 'Gambar Portofolio', type: 'image', options: { hotspot: true } }
      ]
    },

    // --- 3. SCHEMA TESTIMONI ---
    {
      name: 'testimonial',
      title: 'Testimoni',
      type: 'document',
      fields: [
        { name: 'name', title: 'Nama Klien', type: 'string' },
        { name: 'position', title: 'Jabatan & Perusahaan', type: 'string' },
        { name: 'quote', title: 'Isi Testimoni', type: 'text', rows: 4 },
        { name: 'rating', title: 'Rating (1-5)', type: 'number', initialValue: 5 }
      ]
    },

    // --- 4. SCHEMA ARTIKEL BLOG ---
    {
      name: 'article',
      title: 'Artikel Blog',
      type: 'document',
      fields: [
        { name: 'title', title: 'Judul Artikel', type: 'string' },
        { name: 'slug', title: 'URL Slug', type: 'slug', options: { source: 'title' } },
        { name: 'date', title: 'Tanggal Terbit', type: 'string', description: 'Contoh: 12 Mei 2026' },
        { name: 'description', title: 'Deskripsi Singkat (Ringkasan)', type: 'text', rows: 3 },
        { name: 'image', title: 'Gambar Cover', type: 'image', options: { hotspot: true } }
        // Nanti kita bisa tambahkan blok 'content' lengkap untuk menulis isi artikel panjang
      ]
    }
  ],
}