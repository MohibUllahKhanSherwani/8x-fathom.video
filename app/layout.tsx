import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fathom AI Notetaker - Never Take Notes Again",
  description: "Fathom captures, transcribes, and summarizes Zoom, Google Meet, and Microsoft Teams calls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark antialiased`}>
      <body className="min-h-screen bg-[#111214] text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
