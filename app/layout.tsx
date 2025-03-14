import type { Metadata } from "next";
import { Goldman, Inter } from "next/font/google";
import { Toaster } from "sonner";

import "./globals.css";

const goldman = Goldman({
  variable: "--font-goldman",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Haziq",
    template: "%s | Haziq",
  },
  description: "Haziq is a chatbot that can help you with your questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${goldman.variable} ${inter.variable} ${inter.className} antialiased`}>
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
