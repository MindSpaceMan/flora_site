// src/app/components/AddToCartButton.tsx
"use client";

import { useCart } from "@/store/cart";
import { Button } from "@/app/components/ui/button";

type Props = {
    id: string;       // productId
    slug: string;     // категория (из URL)
    name: string;
    image?: string;
    qty?: number;
    className?: string;
};

export default function AddToCartButton({ id, slug, name, image, qty = 1, className }: Props) {
    const add = useCart((s) => s.add);

    return (
        <Button
            onClick={() => add({ id, slug, name, image }, qty)}
            className={className ?? "bg-[#CD8567] hover:bg-[#B8714C] text-white"}
        >
            В корзину
        </Button>
    );
}