// src/app/layout.tsx
import "./globals.css"; // Mengarah langsung ke file globals.css di root app
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Alam Portfolio | Professional Fullstack Developer",
  description: "Portfolio digital Alam - Mahasiswa Informatika UNPAS 2024",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} bg-black antialiased text-white`}>
        {children}
      </body>
    </html>
  );
}