"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "./utils";

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const;

export type ChartConfig = {
    [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
} & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
    );
};

type ChartContextProps = { config: ChartConfig };

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
    const context = React.useContext(ChartContext);
    if (!context) throw new Error("useChart must be used within a <ChartContainer />");
    return context;
}

function ChartContainer({
                            id,
                            className,
                            children,
                            config,
                            ...props
                        }: React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}) {
    const uniqueId = React.useId();
    const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;

    return (
        <ChartContext.Provider value={{ config }}>
            <div
                data-slot="chart"
                data-chart={chartId}
                className={cn(
                    "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground " +
                    "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 " +
                    "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border " +
                    "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border " +
                    "[&_.recharts-radial-bar-background-sector]:fill-muted " +
                    "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted " +
                    "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border " +
                    "flex aspect-video justify-center text-xs " +
                    "[&_.recharts-dot[stroke='#fff']]:stroke-transparent " +
                    "[&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden " +
                    "[&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
                    className,
                )}
                {...props}
            >
                <ChartStyle id={chartId} config={config} />
                <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
            </div>
        </ChartContext.Provider>
    );
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
    const colorConfig = Object.entries(config).filter(([, cfg]) => cfg.theme || cfg.color);
    if (!colorConfig.length) return null;

    return (
        <style
            // генерируем CSS-переменные вида --color-<key> на контейнере графика
            dangerouslySetInnerHTML={{
                __html: Object.entries(THEMES)
                    .map(
                        ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
                            .map(([key, itemConfig]) => {
                                const color =
                                    itemConfig.theme?.[theme as keyof typeof itemConfig.theme] || itemConfig.color;
                                return color ? `  --color-${key}: ${color};` : null;
                            })
                            .filter(Boolean)
                            .join("\n")}
}
`,
                    )
                    .join("\n"),
            }}
        />
    );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

type TooltipItem = {
    value?: number | string;
    name?: string;
    dataKey?: string | number;
    color?: string;
    payload?: Record<string, any>;
};

function ChartTooltipContent({
                                 active,
                                 payload,
                                 className,
                                 indicator = "dot",
                                 hideLabel = false,
                                 hideIndicator = false,
                                 label: tooltipLabelProp,
                                 labelFormatter,
                                 labelClassName,
                                 formatter,
                                 color,
                                 nameKey,
                                 labelKey,
                                 ...divProps
                             }: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
}) {
    const { config } = useChart();

    const headerLabel = React.useMemo(() => {
        if (hideLabel || !payload?.length) return null;

        const [item] = payload as TooltipItem[];
        const key = `${labelKey || item?.dataKey || item?.name || "value"}`;
        const itemCfg = getPayloadConfigFromPayload(config, item, key);

        const resolved =
            !labelKey && typeof tooltipLabelProp === "string"
                ? config[tooltipLabelProp as keyof typeof config]?.label || tooltipLabelProp
                : itemCfg?.label;

        if (labelFormatter) {
            return <div className={cn("font-medium", labelClassName)}>{labelFormatter(resolved, payload)}</div>;
        }
        return resolved ? <div className={cn("font-medium", labelClassName)}>{resolved}</div> : null;
    }, [hideLabel, payload, labelKey, tooltipLabelProp, labelFormatter, labelClassName, config]);

    if (!active || !payload?.length) return null;

    const items = payload as TooltipItem[];
    const nestLabel = items.length === 1 && indicator !== "dot";

    return (
        <div
            {...divProps}
            className={cn(
                "border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
                className,
            )}
        >
            {!nestLabel ? headerLabel : null}
            <div className="grid gap-1.5">
                {items.map((item, index) => {
                    const key = `${nameKey || item.name || item.dataKey || "value"}`;
                    const itemCfg = getPayloadConfigFromPayload(config, item, key);
                    const indicatorColor = color || item.payload?.fill || item.color;

                    return (
                        <div
                            key={String(item.dataKey ?? index)}
                            className={cn(
                                "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5",
                                indicator === "dot" && "items-center",
                            )}
                        >
                            {formatter && item?.value !== undefined && item.name ? (
                                formatter(item.value, item.name, item as any, index, item.payload)
                            ) : (
                                <>
                                    {itemCfg?.icon ? (
                                        <itemCfg.icon />
                                    ) : (
                                        !hideIndicator && (
                                            <div
                                                className={cn("shrink-0 rounded-[2px]", {
                                                    "h-2.5 w-2.5 bg-[--color-bg] border-[--color-border]": indicator === "dot",
                                                    "w-1 bg-[--color-bg] border-[--color-border]": indicator === "line",
                                                    "w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
                                                    "my-0.5": nestLabel && indicator === "dashed",
                                                })}
                                                style={
                                                    {
                                                        // кастомные CSS-переменные для Tailwind arbitrary values
                                                        "--color-bg": indicatorColor,
                                                        "--color-border": indicatorColor,
                                                    } as React.CSSProperties
                                                }
                                            />
                                        )
                                    )}
                                    <div
                                        className={cn(
                                            "flex flex-1 justify-between leading-none",
                                            nestLabel ? "items-end" : "items-center",
                                        )}
                                    >
                                        <div className="grid gap-1.5">
                                            {nestLabel ? headerLabel : null}
                                            <span className="text-muted-foreground">{itemCfg?.label || item.name}</span>
                                        </div>
                                        {item.value != null && (
                                            <span className="text-foreground font-mono font-medium tabular-nums">
                        {Number(item.value).toLocaleString()}
                      </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const ChartLegend = RechartsPrimitive.Legend;

type LegendItem = {
    value?: string | number;
    dataKey?: string | number;
    color?: string;
};

function ChartLegendContent({
                                className,
                                hideIcon = false,
                                payload,
                                verticalAlign = "bottom",
                                nameKey,
                                ...divProps
                            }: React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean;
    nameKey?: string;
}) {
    const { config } = useChart();
    if (!payload?.length) return null;

    const items = payload as LegendItem[];

    return (
        <div
            {...divProps}
            className={cn(
                "flex items-center justify-center gap-4",
                verticalAlign === "top" ? "pb-3" : "pt-3",
                className,
            )}
        >
            {items.map((item, idx) => {
                const key = `${nameKey || (item.dataKey as string) || "value"}`;
                const itemCfg = getPayloadConfigFromPayload(config, item as any, key);

                return (
                    <div
                        key={String(item.value ?? idx)}
                        className={cn("[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3")}
                    >
                        {itemCfg?.icon && !hideIcon ? (
                            <itemCfg.icon />
                        ) : (
                            <div className="h-2 w-2 shrink-0 rounded-[2px]" style={{ backgroundColor: item.color }} />
                        )}
                        {itemCfg?.label ?? item.value}
                    </div>
                );
            })}
        </div>
    );
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
    if (typeof payload !== "object" || payload === null) return undefined;

    const payloadPayload =
        "payload" in (payload as any) && typeof (payload as any).payload === "object" && (payload as any).payload !== null
            ? ((payload as any).payload as Record<string, unknown>)
            : undefined;

    let configLabelKey: string = key;

    if (key in (payload as any) && typeof (payload as any)[key] === "string") {
        configLabelKey = (payload as any)[key] as string;
    } else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") {
        configLabelKey = payloadPayload[key] as string;
    }

    return configLabelKey in config ? config[configLabelKey] : (config as any)[key];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };
