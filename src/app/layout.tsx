import type { Metadata } from "next";
import "@/styles/index.css";


// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Meu app de finanças",
  description: "App destinado a gerenciamento de finanças",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
