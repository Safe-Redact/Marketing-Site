import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen bg-canvas text-ink">
        {children}
      </main>
      <Footer />
    </>
  );
}
