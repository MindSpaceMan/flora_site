import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = { title: "Flora", description: "Flora site" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" className="h-full">
        <body className="min-h-dvh bg-white antialiased">
        {children}
        </body>
        </html>
    );
}
