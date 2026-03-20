import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="gradient-blob gradient-blob--1" />
      <div className="gradient-blob gradient-blob--2" />
      <Header />
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
