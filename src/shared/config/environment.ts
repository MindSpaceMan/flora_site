// Централизованный env без магии в компонентах.
// Можно переопределить через NEXT_PUBLIC_API_LOCAL_URL, но по умолчанию локалка.
export const env = {
    apiLocalUrl: (process.env.NEXT_PUBLIC_API_LOCAL_URL ?? 'http://localhost:8337').replace(/\/+$/, ''),
} as const;