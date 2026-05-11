// sanity/schemaTypes/aboutUs.ts
export default {
  name: 'aboutUs',
  title: 'Halaman Tentang Kami',
  type: 'document',
  fields: [
    // --- HERO SECTION ---
    { name: 'heroImage', title: 'Gambar Hero', type: 'image', options: { hotspot: true } },
    { name: 'heroTitle', title: 'Judul Hero', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'string' }, { name: 'en', title: 'EN', type: 'string' }] },
    { name: 'heroDesc', title: 'Deskripsi Hero', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'text' }, { name: 'en', title: 'EN', type: 'text' }] },
    
    // --- BAGIAN TENTANG ---
    { name: 'aboutImage', title: 'Gambar Kantor/Tim', type: 'image', options: { hotspot: true } },
    { name: 'aboutTitle', title: 'Judul Tentang', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'string' }, { name: 'en', title: 'EN', type: 'string' }] },
    { name: 'aboutDesc1', title: 'Paragraf 1', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'text' }, { name: 'en', title: 'EN', type: 'text' }] },
    { name: 'aboutDesc2', title: 'Paragraf 2', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'text' }, { name: 'en', title: 'EN', type: 'text' }] },
    
    // --- STATISTIK DINAMIS ---
    {
      name: 'stats',
      title: 'Poin Statistik (Angka)',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'value', title: 'Angka (misal: 150+)', type: 'string' },
          { name: 'label', title: 'Label', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'string' }, { name: 'en', title: 'EN', type: 'string' }] }
        ]
      }]
    },

    // --- VISI ---
    { name: 'visionTitle', title: 'Judul Visi', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'string' }, { name: 'en', title: 'EN', type: 'string' }] },
    { name: 'visionDesc', title: 'Deskripsi Visi', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'text' }, { name: 'en', title: 'EN', type: 'text' }] },
    
    // --- MISI (Bisa Banyak Poin) ---
    { name: 'missionTitle', title: 'Judul Misi', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'string' }, { name: 'en', title: 'EN', type: 'string' }] },
    {
      name: 'missionItems',
      title: 'Daftar Misi',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'item', title: 'Poin Misi', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'text' }, { name: 'en', title: 'EN', type: 'text' }] }
        ]
      }]
    },

    // --- CTA ---
    { name: 'ctaTitle', title: 'Judul CTA', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'string' }, { name: 'en', title: 'EN', type: 'string' }] },
    { name: 'ctaButtonText', title: 'Teks Tombol WA', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'string' }, { name: 'en', title: 'EN', type: 'string' }] },
    { name: 'ctaWaText', title: 'Pesan Default WhatsApp', type: 'object', fields: [{ name: 'id', title: 'ID', type: 'text' }, { name: 'en', title: 'EN', type: 'text' }] },
  ]
}