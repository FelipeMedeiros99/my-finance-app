import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Guard from "@/components/guard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Guard>
      <Header />
      <main className="mx-0 mt-16 mb-24">
        {children}
      </main>
      <Footer />
    </Guard>
  );
}
