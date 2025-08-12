// src/app/components/figma/ImageWithFallback.tsx
"use client";

import Image, { type StaticImageData } from "next/image";
import * as React from "react";
import { cn } from "@/app/components/ui/utils";

type BaseProps = {
    src: string | StaticImageData;
    alt: string;
    className?: string;
    wrapperClassName?: string; // размеры/позиционирование контейнера для fill
    fallbackSrc?: string;
    sizes?: string;
    wrap?: boolean; // по умолчанию true — оборачивать ли в div
};

type FillProps = { fill: true; width?: never; height?: never };
type FixedProps = { fill?: false; width: number; height: number };

type Props = BaseProps &
    (FillProps | FixedProps | {}) & // разрешаем пустой случай — авто fill
    Omit<React.ComponentProps<typeof Image>, "src" | "alt" | "fill" | "width" | "height">;

export function ImageWithFallback({
                                      src,
                                      alt,
                                      className,
                                      wrapperClassName,
                                      fallbackSrc,
                                      sizes,
                                      wrap = true,
                                      ...rest
                                  }: Props) {
    const [failed, setFailed] = React.useState(false);
    const imgSrc = failed && fallbackSrc ? fallbackSrc : src;

    // Определяем режим:
    const hasWH = typeof (rest as any).width === "number" && typeof (rest as any).height === "number";
    const hasFillProp = (rest as any).fill === true;

    // Авто: если нет ни width/height, ни fill — переключаемся в fill
    const useFill = hasFillProp || !hasWH;

    const imageEl = (
        <Image
            src={imgSrc}
            alt={alt}
            className={cn("object-cover", className)}
            onError={() => setFailed(true)}
            {...(useFill
                ? { fill: true as const, sizes: sizes ?? "100vw" }
                : {
                    width: (rest as any).width as number,
                    height: (rest as any).height as number,
                    sizes,
                })}
            {...rest}
        />
    );

    if (!wrap) return imageEl;

    // Для fill нужен position: relative на контейнере
    const containerClasses = cn(useFill ? "relative" : undefined, wrapperClassName);
    return <div className={containerClasses}>{imageEl}</div>;
}