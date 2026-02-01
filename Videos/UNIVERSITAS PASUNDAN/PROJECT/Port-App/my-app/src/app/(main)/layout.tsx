import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import ChatAI from "@/components/shared/ChatAI"; // Import ini

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
      <ChatAI /> {/* Taruh di sini, CEO! */}
    </>
  );
}
