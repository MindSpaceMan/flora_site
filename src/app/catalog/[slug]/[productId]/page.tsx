import { Header } from "@/app/components/Header";
import { ProductPage } from "./components/ProductPage";
import { ContactsSection } from "@/app/components/ContactsSection";
import { Footer } from "@/app/components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ProductPage />
        <ContactsSection />
      </main>
      <Footer />
    </div>
  );
}