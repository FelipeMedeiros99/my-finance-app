import type { Metadata } from "next";
import {Inter} from "next/font/google"

import "@/styles/index.css";


const inter = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meu app de finanças",
  manifest: "manifest.json",
  description: "App destinado a gerenciamento de finanças",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className={inter.className}>
      <body>
        {children}
      </body>
    </html>
  );
}
