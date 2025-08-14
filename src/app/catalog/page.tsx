import { CategoryPage } from "./components/CategoryPage";
import { ContactsSection } from "@/app/components/ContactsSection";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <CategoryPage />
        <ContactsSection />
      </main>
    </div>
  );
}