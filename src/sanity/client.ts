import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-05-04", // Tanggal API Sanity terkini
  useCdn: false, // Diset false agar setiap kita "Publish", web langsung terupdate
});