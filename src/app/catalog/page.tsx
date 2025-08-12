import { Header } from "./../components/Header";
import { CategoryPage } from "./components/CategoryPage";
import { ContactsSection } from "@/app/components/ContactsSection";
import { Footer } from "./../components/Footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <CategoryPage />
        <ContactsSection />
      </main>
      <Footer />
    </div>
  );
}