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
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const position = formData.get('position') as string;
    const quote = formData.get('quote') as string;
    const rating = Number(formData.get('rating'));
    const serviceIds = formData.getAll('serviceIds') as string[];
    const photo = formData.get('photo') as File | null;

    let imageAsset = null;
    if (photo && photo.size > 0) {
      // 👇 PERBAIKAN: Ubah File menjadi Buffer agar bisa dibaca server
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      imageAsset = await writeClient.assets.upload('image', buffer, {
        filename: photo.name
      });
    }

    const serviceReferences = serviceIds.map(id => ({
      _key: crypto.randomUUID(),
      _type: 'reference',
      _ref: id
    }));

    const doc: any = {
      _type: 'testimonial',
      _id: `drafts.${crypto.randomUUID()}`,
      name: name,
      rating: rating,
      position: { id: position, en: position },
      quote: { id: quote, en: quote },
      serviceCategory: serviceReferences,
    };

    if (imageAsset) {
      doc.clientPhoto = {
        _type: 'image',
        asset: { _type: 'reference', _ref: imageAsset._id }
      };
    }

    await writeClient.createIfNotExists(doc);

    return NextResponse.json({ message: 'Success' }, { status: 200 });
  } catch (error: any) {
    console.error("Error API Review:", error.message || error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}