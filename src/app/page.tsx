"use client";
// app/page.tsx
import { HeroSection } from "@/app/components/HeroSection";
import { CategoriesSection } from "@/app/components/CategoriesSection";
import { TestimonialsSection } from "@/app/components/TestimonialsSection";
import { ContactsSection } from "@/app/components/ContactsSection";

export default function Page() {
    return (
        <div className="min-h-screen bg-white">
            <main>
                <HeroSection />
                <CategoriesSection />
                <TestimonialsSection />
                <ContactsSection />
            </main>
        </div>
    );
}