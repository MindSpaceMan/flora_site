import { Header } from "@/app/components/Header";
import { ProductsPage } from "./components/ProductsPage";
import { ContactsSection } from "@/app/components/ContactsSection";
import { Footer } from "@/app/components/Footer";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <ProductsPage params={params} />
        <ContactsSection />
      </main>
      <Footer />
    </div>
  );
}