import type React from "react";
import type { Metadata } from "next";
import { Playfair_Display, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Mısır Cafe - Doğanın Büyüsü Kahvenin Aroması",
  description:
    "Doğanın büyüsü ve kahvenin aromasının buluştuğu özel mekan. Vintage ruhunu modern dokunuşlarla harmanlayan eşsiz atmosferimizi keşfedin.",
  generator: "v0.dev",
  openGraph: {
    title: "Mısır Cafe - Doğanın Büyüsü Kahvenin Aroması",
    description:
      "Doğanın büyüsü ve kahvenin aromasının buluştuğu özel mekan. Vintage ruhunu modern dokunuşlarla harmanlayan eşsiz atmosferimizi keşfedin.",
    url: "https://www.misircafe.com.tr", // kendi domaininle değiştir
    siteName: "Mısır Cafe",
    images: [
      {
        url: "/logo.png", // public klasörüne koyacağın görsel
        width: 1200,
        height: 630,
        alt: "Mısır Cafe",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mısır Cafe - Doğanın Büyüsü Kahvenin Aroması",
    description:
      "Vintage ruhunu modern dokunuşlarla harmanlayan eşsiz atmosferimizi keşfedin.",
    images: ["/logo.png"], // aynı resmi kullanabilirsin
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${playfair.variable} ${openSans.variable} antialiased`}
    >
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
