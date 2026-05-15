import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // 1. Tangkap data dari form frontend
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Semua kolom wajib diisi.' }, { status: 400 });
    }

    // 2. Siapkan pengaturan SMTP (Kunci rahasia diambil dari file .env)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true untuk port 465, false untuk port lain
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 3. Format isi email yang akan dikirim ke info@inbeez.id
    const mailOptions = {
      from: `"Website Inbeez" <${process.env.SMTP_USER}>`, // Dikirim dari sistem
      to: 'info@inbeez.id', // Tujuan akhir (Email Anda)
      replyTo: email, // Jika Anda klik "Reply", otomatis membalas ke email klien
      subject: `Pesan Baru dari Website: ${name}`,
      text: `Nama: ${name}\nEmail: ${email}\nPesan:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #0d6efd;">Ada Pesan Baru dari Website Inbeez!</h2>
          <p><strong>Nama Klien:</strong> ${name}</p>
          <p><strong>Email Klien:</strong> ${email}</p>
          <div style="padding: 15px; background-color: #f8f9fa; border-left: 4px solid #0d6efd; margin-top: 20px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #888; margin-top: 30px;">Email ini dikirim secara otomatis dari form kontak inbeez.id</p>
        </div>
      `,
    };

    // 4. Kirim email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Pesan berhasil dikirim!' }, { status: 200 });

  } catch (error: any) {
    console.error('Error saat mengirim email:', error);
    return NextResponse.json({ error: 'Gagal mengirim pesan. Silakan coba lagi.' }, { status: 500 });
  }
}