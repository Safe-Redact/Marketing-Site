import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main
        id="main-content"
        data-insights-page
        className="min-h-screen bg-canvas text-ink"
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
