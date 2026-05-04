import type { Metadata } from "next";
import { Poppins, Nunito } from "next/font/google";
import "./globals.css";

// Konfigurasi Font
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-poppins'
});

const nunito = Nunito({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: '--font-nunito'
});

export const metadata: Metadata = {
  title: "Inbeez.id | Digital Growth Partner",
  description: "Membantu bisnis tumbuh lebih mudah melalui strategi digital, sistem teknologi, dan konten kreatif yang berdampak nyata.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} ${nunito.variable} font-sans text-neutral-dark bg-white`}>
        {children}
      </body>
    </html>
  );
}