"use client";

import Image, { type StaticImageData } from "next/image";
import * as React from "react";
import { cn } from "@/app/components/ui/utils";

type Props = Omit<
    React.ComponentProps<typeof Image>,
    "src" | "alt" | "width" | "height" | "fill"
> & {
    src: string | StaticImageData;
    alt: string;
    className?: string;
    wrapperClassName?: string;  // классы обёртки (высота/ratio)
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