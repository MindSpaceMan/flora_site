"use client";
// app/page.tsx
import { HeroSection } from "@/app/components/HeroSection";
import { CategoriesSection } from "@/app/components/CategoriesSection";
import { PopularProductsSection } from "@/app/components/PopularProductsSection";
import { TestimonialsSection } from "@/app/components/TestimonialsSection";
import { ContactsSection } from "@/app/components/ContactsSection";

export default function Page() {
    return (
        <div className="min-h-screen bg-white">
            <main>
                <HeroSection />
                <CategoriesSection />
                <PopularProductsSection />
                <TestimonialsSection />
                <ContactsSection />
            </main>
        </div>
    );
}