import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Guard from "@/components/guard/guard";

import styles from "./style.module.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Guard>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </Guard>
  );
}
