// import-data.js
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

// 1. Konfigurasi Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ID_PROJECT_ANDA',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2024-05-07', 
  token: process.env.SANITY_API_WRITE_TOKEN,
});

// 2. Data Layanan (Tanpa Website Development & Tanpa Harga)
const dataLayanan = [
  // ==========================================
  // PILAR: GOOGLE ADS MANAGEMENT
  // ==========================================
  {
    _type: 'service',
    title: { id: 'Google Ads Management', en: 'Google Ads Management' },
    slug: {
      id: { _type: 'slug', current: 'jasa-iklan-google-ads-terbaik' },
      en: { _type: 'slug', current: 'top-google-ads-management' }
    },
    description: {
      id: 'Muncul di peringkat teratas pencarian Google saat calon pelanggan membutuhkan layanan Anda. Kami mengelola anggaran iklan Anda dengan efisien untuk menghasilkan prospek berkualitas tinggi secara instan.',
      en: 'Appear at the top of Google search when potential customers need your services. We manage your ad budget efficiently to generate high-quality leads instantly.'
    },
    seoGroup: {
      focusKeyword: { id: 'jasa iklan google ads, jasa google adwords, agency sem', en: 'google ads management services, sem agency, adwords consultant' },
      metaTitle: { id: 'Jasa Iklan Google Ads Berbasis ROI | Inbeez.id', en: 'ROI-Driven Google Ads Management Services | Inbeez.id' },
      metaDescription: { 
        id: 'Tingkatkan konversi bisnis dengan layanan Google Ads Inbeez. Mulai dari setup kampanye, optimasi rutin, hingga audit akun iklan profesional.', 
        en: 'Increase business conversions with Inbeez Google Ads services. From campaign setup, routine optimization, to professional ad account audits.' 
      }
    },
    subServices: [
      {
        _key: 'gads-1',
        title: { id: 'Setup Campaign', en: 'Campaign Setup' },
        description: { id: 'Bangun sistem iklan Google yang siap menjangkau pelanggan potensial dengan hasil yang terukur.', en: 'Build a Google Ads system ready to reach potential customers with measurable results.' },
        waDefaultText: { id: 'Halo Inbeez, saya ingin memulai iklan Google dengan Setup Campaign.', en: 'Hello Inbeez, I want to start Google advertising with the Campaign Setup.' },
        features: [
          { _key: 'f1', id: 'Riset Kata Kunci & Kompetitor', en: 'Keyword & Competitor Research' },
          { _key: 'f2', id: 'Setup Campaign & Copywriting Iklan', en: 'Campaign Setup & Ad Copywriting' },
          { _key: 'f3', id: 'Integrasi Pelacakan Performa', en: 'Performance Tracking Integration' },
          { _key: 'f4', id: 'Laporan Kampanye Awal', en: 'Initial Campaign Report' }
        ]
      },
      {
        _key: 'gads-2',
        title: { id: 'Monthly Maintenance', en: 'Monthly Maintenance' },
        description: { id: 'Optimasi berkelanjutan agar iklan tetap efisien dan Return on Investment (ROI) terus meningkat.', en: 'Continuous optimization to keep ads efficient and steadily increase Return on Investment (ROI).' },
        waDefaultText: { id: 'Halo Inbeez, saya butuh optimasi rutin untuk Google Ads saya.', en: 'Hello Inbeez, I need routine optimization for my Google Ads.' },
        features: [
          { _key: 'f1', id: 'Pemantauan Performa Iklan', en: 'Ad Performance Monitoring' },
          { _key: 'f2', id: 'Optimasi Keyword, Bid & Targeting', en: 'Keyword, Bid & Targeting Optimization' },
          { _key: 'f3', id: 'A/B Testing Iklan & Landing Page', en: 'Ad & Landing Page A/B Testing' },
          { _key: 'f4', id: 'Review Meeting & Laporan Bulanan', en: 'Review Meeting & Monthly Report' }
        ]
      },
      {
        _key: 'gads-3',
        title: { id: 'Google Ads Audit', en: 'Google Ads Audit' },
        description: { id: 'Analisis profesional terhadap akun iklan Anda untuk menemukan kebocoran anggaran dan peluang peningkatan.', en: 'Professional analysis of your ad account to find budget leaks and improvement opportunities.' },
        waDefaultText: { id: 'Halo Inbeez, iklan Google saya kurang maksimal. Saya butuh layanan Audit.', en: 'Hello Inbeez, my Google ads are underperforming. I need an Audit service.' },
        features: [
          { _key: 'f1', id: 'Audit Struktur Kampanye', en: 'Campaign Structure Audit' },
          { _key: 'f2', id: 'Analisis CTR, CPC, dan Konversi', en: 'CTR, CPC, and Conversion Analysis' },
          { _key: 'f3', id: 'Rekomendasi Optimasi Strategis', en: 'Strategic Optimization Recommendations' }
        ]
      }
    ]
  },

  // ==========================================
  // PILAR: SEARCH ENGINE OPTIMIZATION (SEO)
  // ==========================================
  {
    _type: 'service',
    title: { id: 'Search Engine Optimization (SEO)', en: 'Search Engine Optimization (SEO)' },
    slug: {
      id: { _type: 'slug', current: 'jasa-seo-profesional-berkualitas' },
      en: { _type: 'slug', current: 'quality-seo-services' }
    },
    description: {
      id: 'Bangun otoritas digital jangka panjang. Kami mengoptimalkan fondasi teknis dan konten website agar bisnis Anda mendominasi halaman pertama pencarian organik tanpa bergantung pada biaya iklan terus-menerus.',
      en: 'Build long-term digital authority. We optimize your website technical foundation and content so your business dominates the first page of organic search without relying on continuous ad spend.'
    },
    seoGroup: {
      focusKeyword: { id: 'jasa seo profesional, konsultan seo, jasa optimasi website', en: 'professional seo services, seo consultant, website optimization agency' },
      metaTitle: { id: 'Jasa SEO Profesional & Konsultan Optimasi Website | Inbeez.id', en: 'Professional SEO Services & Website Optimization Consultant | Inbeez.id' },
      metaDescription: { id: 'Dominasi halaman pertama Google dengan layanan SEO Inbeez. Solusi organik berkelanjutan dari audit teknis hingga pembuatan artikel berkualitas.', en: 'Dominate the first page of Google with Inbeez SEO services. Sustainable organic solutions from technical audits to quality article creation.' }
    },
    subServices: [
      {
        _key: 'seo-1',
        title: { id: 'Setup SEO', en: 'SEO Setup' },
        description: { id: 'Mempersiapkan fondasi SEO yang kuat agar website lebih disukai dan mudah ditemukan oleh mesin pencari.', en: 'Preparing a strong SEO foundation so your website is favored and easily found by search engines.' },
        waDefaultText: { id: 'Halo Inbeez, saya ingin membangun fondasi SEO untuk website saya.', en: 'Hello Inbeez, I want to build an SEO foundation for my website.' },
        features: [
          { _key: 'f1', id: 'Audit SEO On-Page & Technical', en: 'On-Page & Technical SEO Audit' },
          { _key: 'f2', id: 'Riset Kata Kunci Utama', en: 'Primary Keyword Research' },
          { _key: 'f3', id: 'Perbaikan Struktur Konten & Metadata', en: 'Content Structure & Metadata Improvement' },
          { _key: 'f4', id: 'Setup Analitik & Pelacakan', en: 'Analytics & Tracking Setup' }
        ]
      },
      {
        _key: 'seo-2',
        title: { id: 'Small SEO Plan', en: 'Small SEO Plan' },
        description: { id: 'Cocok untuk bisnis lokal yang baru mulai membangun eksistensi di hasil pencarian Google secara konsisten.', en: 'Suitable for local businesses just starting to build a consistent presence in Google search results.' },
        waDefaultText: { id: 'Halo Inbeez, saya tertarik dengan layanan Small SEO Plan.', en: 'Hello Inbeez, I am interested in the Small SEO Plan service.' },
        features: [
          { _key: 'f1', id: '3 Artikel SEO-Ready per Bulan', en: '3 SEO-Ready Articles per Month' },
          { _key: 'f2', id: '1 Backlink Organik per Bulan', en: '1 Organic Backlink per Month' },
          { _key: 'f3', id: 'Pemantauan Kata Kunci & Laporan', en: 'Keyword Monitoring & Reporting' }
        ]
      },
      {
        _key: 'seo-3',
        title: { id: 'Medium SEO Plan', en: 'Medium SEO Plan' },
        description: { id: 'Strategi agresif untuk bisnis yang siap bersaing ketat merebut peringkat halaman pertama dan melipatgandakan trafik.', en: 'An aggressive strategy for businesses ready to compete fiercely for first-page rankings and multiply traffic.' },
        waDefaultText: { id: 'Halo Inbeez, saya ingin mendominasi Google dengan Medium SEO Plan.', en: 'Hello Inbeez, I want to dominate Google with the Medium SEO Plan.' },
        features: [
          { _key: 'f1', id: '6 Artikel SEO-Ready per Bulan', en: '6 SEO-Ready Articles per Month' },
          { _key: 'f2', id: '2 Backlink Organik per Bulan', en: '2 Organic Backlinks per Month' },
          { _key: 'f3', id: 'Audit Technical & Content Optimization', en: 'Technical Audit & Content Optimization' },
          { _key: 'f4', id: 'Laporan Lengkap & Konsultasi Bulanan', en: 'Comprehensive Report & Monthly Consultation' }
        ]
      }
    ]
  },

  // ==========================================
  // PILAR: META ADS MANAGEMENT
  // ==========================================
  {
    _type: 'service',
    title: { id: 'Meta Ads Management (FB & IG)', en: 'Meta Ads Management (FB & IG)' },
    slug: {
      id: { _type: 'slug', current: 'jasa-iklan-facebook-dan-instagram' },
      en: { _type: 'slug', current: 'facebook-instagram-ads-agency' }
    },
    description: {
      id: 'Bangun kesadaran merek dengan cepat dan hasilkan penjualan langsung melalui kampanye visual yang sangat tertarget di Facebook dan Instagram. Kami merancang materi kreatif sekaligus mengatur algoritma iklan Anda.',
      en: 'Build brand awareness quickly and generate direct sales through highly targeted visual campaigns on Facebook and Instagram. We design creatives while managing your ad algorithms.'
    },
    seoGroup: {
      focusKeyword: { id: 'jasa iklan facebook, jasa iklan instagram, meta ads agency', en: 'facebook ads services, instagram ads agency, meta ads management' },
      metaTitle: { id: 'Jasa Iklan Facebook & Instagram Bergaransi ROI | Inbeez.id', en: 'ROI-Guaranteed Facebook & Instagram Ads Services | Inbeez.id' },
      metaDescription: { id: 'Jangkau audiens spesifik Anda di media sosial. Inbeez melayani setup dan manajemen iklan Meta Ads dengan materi konten kreatif yang memancing interaksi.', en: 'Reach your specific audience on social media. Inbeez provides Meta Ads setup and management with creative content that sparks interaction.' }
    },
    subServices: [
      {
        _key: 'mads-1',
        title: { id: 'Setup Campaign', en: 'Campaign Setup' },
        description: { id: 'Mulai beriklan di Facebook & Instagram dengan strategi targeting yang efektif dan materi desain visual yang memikat.', en: 'Start advertising on Facebook & Instagram with effective targeting strategies and captivating visual design materials.' },
        waDefaultText: { id: 'Halo Inbeez, saya ingin menjangkau audiens di FB & IG dengan Setup Meta Ads.', en: 'Hello Inbeez, I want to reach audiences on FB & IG with Meta Ads Setup.' },
        features: [
          { _key: 'f1', id: 'Pembuatan & Konfigurasi Akun Iklan', en: 'Ad Account Creation & Configuration' },
          { _key: 'f2', id: 'Riset Target Audience & Interest', en: 'Target Audience & Interest Research' },
          { _key: 'f3', id: 'Pembuatan 4 Konten Iklan (Image/Video/Carousel)', en: 'Creation of 4 Ad Creatives (Image/Video/Carousel)' },
          { _key: 'f4', id: 'A/B Testing & Laporan Awal', en: 'A/B Testing & Initial Report' }
        ]
      },
      {
        _key: 'mads-2',
        title: { id: 'Monthly Maintenance', en: 'Monthly Maintenance' },
        description: { id: 'Pemantauan ketat dan rotasi strategi iklan agar terhindar dari ad-fatigue (kejenuhan audiens) sehingga konversi tetap stabil.', en: 'Strict monitoring and ad strategy rotation to avoid ad-fatigue, keeping conversions stable.' },
        waDefaultText: { id: 'Halo Inbeez, saya butuh bantuan untuk Monthly Maintenance iklan Meta bisnis saya.', en: 'Hello Inbeez, I need help with Monthly Maintenance for my business Meta ads.' },
        features: [
          { _key: 'f1', id: 'Penyesuaian Konten & Strategi Iklan', en: 'Ad Content & Strategy Adjustment' },
          { _key: 'f2', id: 'Optimasi Targeting & Placement', en: 'Targeting & Placement Optimization' },
          { _key: 'f3', id: 'Analisis Performa Bulanan', en: 'Monthly Performance Analysis' }
        ]
      }
    ]
  },

  // ==========================================
  // PILAR: SOCIAL MEDIA MANAGEMENT
  // ==========================================
  {
    _type: 'service',
    title: { id: 'Social Media Management', en: 'Social Media Management' },
    slug: {
      id: { _type: 'slug', current: 'jasa-kelola-sosial-media-profesional' },
      en: { _type: 'slug', current: 'professional-social-media-management' }
    },
    description: {
      id: 'Media sosial adalah etalase bisnis Anda. Kami merancang kalender konten, membuat desain visual premium, dan menulis naskah yang bercerita untuk membangun komunitas pengikut yang loyal.',
      en: 'Social media is your business storefront. We design content calendars, create premium visual designs, and write storytelling copy to build a loyal community of followers.'
    },
    seoGroup: {
      focusKeyword: { id: 'jasa kelola sosial media, jasa admin instagram', en: 'social media management agency, instagram admin services' },
      metaTitle: { id: 'Jasa Kelola Sosial Media & Pembuatan Konten | Inbeez.id', en: 'Social Media Management & Content Creation Services | Inbeez.id' },
      metaDescription: { id: 'Serahkan pengelolaan akun sosial media Anda pada ahlinya. Dari desain feed, produksi Reels, hingga riset hashtag.', en: 'Entrust your social media account management to the experts. From feed design, Reels production, to hashtag research.' }
    },
    subServices: [
      {
        _key: 'smm-1',
        title: { id: 'Small Plan', en: 'Small Plan' },
        description: { id: 'Kehadiran media sosial yang aktif dan konsisten untuk memperkuat citra profesional brand Anda dengan total 15 konten bulanan.', en: 'An active and consistent social media presence to strengthen your professional brand image with a total of 15 monthly contents.' },
        waDefaultText: { id: 'Halo Inbeez, saya tertarik untuk menggunakan SMM Small Plan.', en: 'Hello Inbeez, I am interested in using the SMM Small Plan.' },
        features: [
          { _key: 'f1', id: '10 Desain Feed & Story Premium', en: '10 Premium Feed & Story Designs' },
          { _key: 'f2', id: '5 Produksi Konten Video Pendek (Reels)', en: '5 Short Video (Reels) Productions' },
          { _key: 'f3', id: 'Copywriting Caption & Riset Hashtag', en: 'Caption Copywriting & Hashtag Research' },
          { _key: 'f4', id: 'Penjadwalan Otomatis & Optimasi Bio', en: 'Automated Scheduling & Bio Optimization' }
        ]
      },
      {
        _key: 'smm-2',
        title: { id: 'Medium Plan', en: 'Medium Plan' },
        description: { id: 'Dominasi timeline audiens Anda dengan publikasi konten intensif. Total 30 konten bulanan untuk pertumbuhan engagement yang masif.', en: 'Dominate your audience timeline with intensive content publication. A total of 30 monthly contents for massive engagement growth.' },
        waDefaultText: { id: 'Halo Inbeez, saya ingin memaksimalkan interaksi sosmed dengan SMM Medium Plan.', en: 'Hello Inbeez, I want to maximize social media interaction with the SMM Medium Plan.' },
        features: [
          { _key: 'f1', id: '20 Desain Feed & Story Premium', en: '20 Premium Feed & Story Designs' },
          { _key: 'f2', id: '10 Produksi Konten Video Pendek (Reels)', en: '10 Short Video (Reels) Productions' },
          { _key: 'f3', id: 'Caption Storytelling & Perencanaan Konten', en: 'Storytelling Caption & Content Planning' },
          { _key: 'f4', id: 'Laporan Performa Analytics Bulanan', en: 'Monthly Analytics Performance Report' }
        ]
      }
    ]
  },

  // ==========================================
  // PILAR: DATA ANALYTICS & AI CONSULTING
  // ==========================================
  {
    _type: 'service',
    title: { id: 'Data Analytics & AI Consulting', en: 'Data Analytics & AI Consulting' },
    slug: {
      id: { _type: 'slug', current: 'konsultan-data-analytics-dan-ai' },
      en: { _type: 'slug', current: 'data-analytics-and-ai-consulting' }
    },
    description: {
      id: 'Membawa bisnis Anda ke masa depan. Kami membantu Anda membedah data perusahaan untuk mengambil keputusan krusial dan mengintegrasikan kecerdasan buatan (AI) ke dalam sistem operasional Anda.',
      en: 'Bringing your business to the future. We help you dissect company data for crucial decision-making and integrate artificial intelligence (AI) into your operational systems.'
    },
    seoGroup: {
      focusKeyword: { id: 'konsultan data analytics indonesia, jasa implementasi ai, konsultan business intelligence', en: 'data analytics consultant, ai implementation services, business intelligence consultant' },
      metaTitle: { id: 'Konsultan Data Analytics & Implementasi AI | Inbeez.id', en: 'Data Analytics & AI Implementation Consultant | Inbeez.id' },
      metaDescription: { id: 'Ubah data menjadi strategi bisnis yang menang. Layanan konsultasi Inbeez mencakup Data Engineering, pembuatan Dashboard BI, hingga otomatisasi proses dengan AI.', en: 'Turn data into winning business strategies. Inbeez consulting services cover Data Engineering, BI Dashboard creation, to process automation with AI.' }
    },
    subServices: [
      {
        _key: 'data-1',
        title: { id: 'Data Strategy & Business Intelligence', en: 'Data Strategy & Business Intelligence' },
        description: { id: 'Menyusun cetak biru (blueprint) pengelolaan data dan membuat visualisasi dashboard interaktif agar manajemen bisa melihat tren perusahaan secara real-time.', en: 'Drafting data management blueprints and creating interactive dashboard visualizations so management can see company trends in real-time.' },
        waDefaultText: { id: 'Halo Inbeez, saya ingin konsultasi mengenai pembuatan Dashboard Data Business Intelligence.', en: 'Hello Inbeez, I would like to consult regarding the creation of a Business Intelligence Data Dashboard.' },
        features: [
          { _key: 'f1', id: 'Evaluasi Kematangan Digital & Roadmap Data', en: 'Digital Maturity Evaluation & Data Roadmap' },
          { _key: 'f2', id: 'Data Engineering & Integrasi Multi-Sumber', en: 'Data Engineering & Multi-Source Integration' },
          { _key: 'f3', id: 'Pembuatan Visualisasi & Dashboard Interaktif', en: 'Interactive Dashboard & Visualization Creation' }
        ]
      },
      {
        _key: 'data-2',
        title: { id: 'AI Implementation & Process Automation', en: 'AI Implementation & Process Automation' },
        description: { id: 'Evaluasi alur kerja Anda yang repetitif dan gantikan dengan teknologi kecerdasan buatan, termasuk otomatisasi customer service menggunakan model bahasa AI.', en: 'Evaluate your repetitive workflows and replace them with artificial intelligence technology, including customer service automation using AI language models.' },
        waDefaultText: { id: 'Halo Inbeez, saya ingin mengeksplorasi penggunaan AI untuk efisiensi bisnis saya.', en: 'Hello Inbeez, I want to explore the use of AI for my business efficiency.' },
        features: [
          { _key: 'f1', id: 'Analisis ROI untuk Adopsi Teknologi AI', en: 'ROI Analysis for AI Technology Adoption' },
          { _key: 'f2', id: 'Integrasi LLM (OpenAI/Claude) ke Sistem Bisnis', en: 'LLM (OpenAI/Claude) Integration to Business Systems' },
          { _key: 'f3', id: 'Pelatihan AI Perusahaan & Change Management', en: 'Corporate AI Training & Change Management' }
        ]
      }
    ]
  }
];

// 3. Eksekutor API
async function importData() {
  console.log('🚀 Memulai proses input data otomatis ke Sanity...');
  
  for (const doc of dataLayanan) {
    try {
      const response = await client.create(doc);
      console.log(`✅ Berhasil menginput: ${doc.title.id}`);
    } catch (error) {
      console.error(`❌ Gagal menginput ${doc.title.id}:`, error.message);
    }
  }
  
  console.log('🎉 Semua data selesai diinput! Silakan cek Dashboard Sanity Anda.');
}

importData();