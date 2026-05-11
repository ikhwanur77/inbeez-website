import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Klien',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'clientPhoto',
      title: 'Foto Klien (Opsional)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'position',
      title: 'Jabatan & Perusahaan (Bilingual)',
      type: 'object',
      fields: [
        { name: 'id', title: 'Indonesian', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
    // Field Rating Bintang
    defineField({
      name: 'rating',
      title: 'Rating Bintang',
      type: 'number',
      description: 'Nilai dari 1 sampai 5',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    // Field Array agar bisa pilih banyak layanan
    defineField({
      name: 'serviceCategory',
      title: 'Layanan yang Digunakan',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'service' }],
        }
      ],
      description: 'Pilih satu atau lebih layanan yang digunakan klien.',
    }),
    defineField({
      name: 'quote',
      title: 'Isi Ulasan (Bilingual)',
      type: 'object',
      fields: [
        { name: 'id', title: 'Indonesian', type: 'text' },
        { name: 'en', title: 'English', type: 'text' },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'position.id',
      media: 'clientPhoto',
    },
  },
})