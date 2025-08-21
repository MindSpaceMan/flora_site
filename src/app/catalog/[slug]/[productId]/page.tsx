import { ContactsSection } from "@/app/components/ContactsSection";
import ProductPage from "./components/ProductPage"; // <— default import
import type { Metadata } from "next";
import { getProduct } from "@/lib/api";

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

export async function generateMetadata({ params }: { params: { slug: string; productId: string } }): Promise<Metadata> {
    try {
        const product = await getProduct(params.productId);
        const title = product.metaTitle || product.titleRu || "Товар";
        const description = product.metaDescription || product.description || "";
        const images = (product.images || [])
            .map((img) => img.url || img.localPath)
            .filter(Boolean) as string[];

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: images.length ? images : undefined,
                type: "product",
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: images.length ? images[0] : undefined,
            },
        };
    } catch {
        return { title: "Товар", description: "" };
    }
}