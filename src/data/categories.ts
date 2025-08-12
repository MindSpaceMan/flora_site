import type { StaticImageData } from "next/image";

export type Category = {
    slug: string;
    name: string;
    image: string | StaticImageData;
    subtitle?: string;
    description?: string;
    isNew?: boolean;
};

export const categories: Category[] = [
    {
        slug: "rozy",
        name: "Розы",
        image:
            "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        isNew: true,
    },
    {
        slug: "tyulpany",
        name: "Тюльпаны",
        image:
            "https://images.unsplash.com/photo-1523936644037-d45d5c2bb8b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
        slug: "lilii",
        name: "Лилии",
        image:
            "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        isNew: true,
    },
    {
        slug: "orkhidei",
        name: "Орхидеи",
        image:
            "https://images.unsplash.com/photo-1569060692049-ad9b41895cb4?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
    {
        slug: "gvozdiki",
        name: "Гвоздики",
        image:
            "https://images.unsplash.com/photo-1463320726281-696a485928c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
        isNew: true,
    },
    {
        slug: "khrizantemy",
        name: "Хризантемы",
        image:
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    },
];