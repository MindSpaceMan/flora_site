"use client";
// app/page.tsx
import { Header } from "@/app/components/Header";
import { HeroSection } from "@/app/components/HeroSection";
import { CategoriesSection } from "@/app/components/CategoriesSection";
import { PopularProductsSection } from "@/app/components/PopularProductsSection";
import { TestimonialsSection } from "@/app/components/TestimonialsSection";
import { ContactsSection } from "@/app/components/ContactsSection";
import { Footer } from "@/app/components/Footer";

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