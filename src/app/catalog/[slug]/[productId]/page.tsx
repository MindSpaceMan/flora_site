import { Header } from "@/app/components/Header";
import { ContactsSection } from "@/app/components/ContactsSection";
import { Footer } from "@/app/components/Footer";
import ProductPage from "./components/ProductPage"; // <— default import

export default function Page() {
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