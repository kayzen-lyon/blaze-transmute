import { Outlet } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/docusur/ScrollToTop";
import { CookieBanner } from "@/components/docusur/CookieBanner";

export function Layout() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <div className="gradient-blob gradient-blob--1" />
      <div className="gradient-blob gradient-blob--2" />
      <ScrollToTop />
      <Header />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
