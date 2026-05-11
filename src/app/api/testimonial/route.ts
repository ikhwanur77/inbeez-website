import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function POST(req: Request) {
  try {
    // Kita menerima data dalam bentuk FormData karena ada kemungkinan unggah Foto
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const quote = formData.get('quote') as string;
    const rating = Number(formData.get('rating'));
    const serviceIds = formData.getAll('serviceIds') as string[];
    const photo = formData.get('photo') as File | null;

    // 1. Jika ada foto, kita upload dulu ke server penyimpan aset Sanity
    let imageAsset = null;
    if (photo && photo.size > 0) {
      imageAsset = await writeClient.assets.upload('image', photo, {
        filename: photo.name
      });
    }

    // 2. Format layanan multi-select menjadi array references Sanity
    const serviceReferences = serviceIds.map(id => ({
      _key: crypto.randomUUID(), // Sanity butuh key unik untuk list array
      _type: 'reference',
      _ref: id
    }));

    // 3. Susun dokumen testimoni (Gunakan 'drafts.' agar butuh Approval Admin)
    const doc: any = {
      _type: 'testimonial',
      _id: `drafts.${crypto.randomUUID()}`,
      name: name,
      rating: rating,
      position: { id: position, en: position },
      quote: { id: quote, en: quote },
      serviceCategory: serviceReferences,
    };

    // Sisipkan referensi foto jika berhasil diupload
    if (imageAsset) {
      doc.clientPhoto = {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAsset._id }
      };
    }

    // 4. Kirim dan simpan ke Database
    await writeClient.createIfNotExists(doc);

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error) {
    console.error("Error API Review:", error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}