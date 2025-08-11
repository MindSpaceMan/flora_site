// components/ImageWithFallback.tsx
"use client";

import Image, { type StaticImageData } from "next/image";
import * as React from "react";
import { cn } from "@/components/ui/utils";

type Props = Omit<
    React.ComponentProps<typeof Image>,
    "src" | "alt" | "width" | "height" | "fill"
> & {
    src: string | StaticImageData;
    alt: string;
    className?: string;         // классы для <Image>
    wrapperClassName?: string;  // классы для обёртки (высота/ratio)
    fallbackSrc?: string;
};

export function ImageWithFallback({
                                      src,
                                      alt,
                                      className,
                                      wrapperClassName,
                                      fallbackSrc,
                                      sizes,
                                      onError,
                                      ...imgProps
                                  }: Props) {
    const [failed, setFailed] = React.useState(false);
    const actualSrc = failed && fallbackSrc ? fallbackSrc : src;

    const handleError = (e: any) => {
        setFailed(true);
        onError?.(e);
    };

    // Статический импорт — у него уже есть width/height
    if (typeof actualSrc !== "string") {
        return (
            <Image
                {...imgProps}
                src={actualSrc}
                alt={alt}
                width={actualSrc.width}
                height={actualSrc.height}
                sizes={sizes ?? "100vw"}
                className={cn("object-cover", className)}
                onError={handleError}
            />
        );
    }

    // URL-строка — рендерим через fill. Нужна relative-обёртка с высотой/ratio.
    return (
        <div className={cn("relative w-full", wrapperClassName)}>
            <Image
                {...imgProps}
                src={actualSrc}
                alt={alt}
                fill
                sizes={sizes ?? "100vw"}
                className={cn("object-cover", className)}
                onError={handleError}
            />
        </div>
    );
}