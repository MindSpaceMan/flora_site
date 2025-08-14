// src/app/components/figma/ImageWithFallback.tsx
"use client";

import Image, { type StaticImageData } from "next/image";
import * as React from "react";
import { cn } from "@/app/components/ui/utils";

/**
 * Базовые пропсы компонента.
 */
type BaseProps = {
    /** Можно передавать:
     *  - импорт: `import pic from "@/public/..."`
     *  - локальный путь из /public: "/images/pic.jpg"
     *  - относительный путь: "./assets/pic.jpg"
     *  - внешний URL: "https://..." */
    src: string | StaticImageData;

    alt: string;
    className?: string;

    /** Классы для контейнера (актуально для fill). */
    wrapperClassName?: string;

    /** Запасная картинка при ошибке. */
    fallbackSrc?: string;

    /** sizes для <Image> */
    sizes?: string;

    /** Оборачивать ли в контейнер <div>. По умолчанию true. */
    wrap?: boolean;

    /** Для внешних URL по умолчанию ставим unoptimized=true, чтобы не требовать next.config.js */
    unoptimizedRemote?: boolean;
};

/** Заполнение контейнера */
type FillProps = { fill: true; width?: never; height?: never };
/** Фиксированные размеры */
type FixedProps = { fill?: false; width: number; height: number };

type Props = BaseProps &
    (FillProps | FixedProps | {}) &
    Omit<React.ComponentProps<typeof Image>, "src" | "alt" | "fill" | "width" | "height">;

function isStaticImageData(x: unknown): x is StaticImageData {
    return typeof x === "object" && x !== null && "src" in x && typeof (x as any).src === "string";
}

function isLocalStringPath(s: string) {
    return s.startsWith("/") || s.startsWith("./") || s.startsWith("../") || s.startsWith("data:");
}

function isRemoteUrl(s: string) {
    return /^https?:\/\//i.test(s);
}

export function ImageWithFallback({
                                      src,
                                      alt,
                                      className,
                                      wrapperClassName,
                                      fallbackSrc,
                                      sizes,
                                      wrap = true,
                                      unoptimizedRemote = true,
                                      ...rest
                                  }: Props) {
    const [failed, setFailed] = React.useState(false);
    const effectiveSrc = (failed && fallbackSrc ? fallbackSrc : src) as string | StaticImageData;

    const isStatic = isStaticImageData(effectiveSrc);
    const isStringSrc = typeof effectiveSrc === "string";
    const isRemote = isStringSrc && isRemoteUrl(effectiveSrc);

    const restAny = rest as any;
    const hasWH = typeof restAny.width === "number" && typeof restAny.height === "number";
    const hasFillProp = restAny.fill === true;

    // Если ничего не передано — используем fill по умолчанию.
    const useFill = hasFillProp || !hasWH;

    const imageModeProps = useFill
        ? ({ fill: true as const, sizes: sizes ?? "100vw" } as const)
        : ({ width: restAny.width as number, height: restAny.height as number, sizes } as const);

    const maybeUnoptimized = isRemote && unoptimizedRemote ? { unoptimized: true as const } : {};

    const imageEl = (
        <Image
            src={effectiveSrc}
            alt={alt}
            className={cn("object-cover", className)}
            onError={() => setFailed(true)}
            {...imageModeProps}
            {...maybeUnoptimized}
            {...rest}
        />
    );

    if (!wrap) return imageEl;

    // КРИТИЧНО: в режиме fill даём контейнеру не только position:relative, но и h-full w-full
    const containerClasses = cn(useFill ? "relative h-full w-full" : undefined, wrapperClassName);

    return <div className={containerClasses}>{imageEl}</div>;
}