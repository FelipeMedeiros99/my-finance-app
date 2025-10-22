import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Guard from "@/components/guard/guard";

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
