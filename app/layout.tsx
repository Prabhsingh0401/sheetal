import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat, Outfit } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const optima = localFont({
  src: [
    {
      path: "../public/assets/fonts/OPTIMA.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/OPTIMA_B.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Optima Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/assets/fonts/Optima_Italic.woff",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-optima",
});

export const metadata: Metadata = {
  title: "Studio By Sheetal",
  description: "Made by Prableen Singh",
  icons: {
    icon: "/assets/335014072.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${outfit.variable} ${optima.variable} antialiased`}
      >
        <Toaster position="top-center" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}
