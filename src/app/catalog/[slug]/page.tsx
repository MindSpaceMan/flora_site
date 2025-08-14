import { ProductsPage } from "./components/ProductsPage";
import { ContactsSection } from "@/app/components/ContactsSection";

export default function Page({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <ProductsPage params={params} />
        <ContactsSection />
      </main>
    </div>
  );
}