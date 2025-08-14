import { ContactsSection } from "@/app/components/ContactsSection";
import ProductPage from "./components/ProductPage"; // <— default import

export default function Page() {
    return (
        <div className="min-h-screen bg-white">
            <main>
                <ProductPage />
                <ContactsSection />
            </main>
        </div>
    );
}