"use client";
// app/page.tsx
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { PopularProductsSection } from "@/components/PopularProductsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactsSection } from "@/components/ContactsSection";
import { Footer } from "@/components/Footer";

export default function Page() {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <main>
                <HeroSection />
                <CategoriesSection />
                <PopularProductsSection />
                <TestimonialsSection />
                <ContactsSection />
            </main>
            <Footer />
        </div>
    );
}