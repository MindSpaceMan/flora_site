import { env } from '@/shared/config/environment';

export type ContactPayload = {
    name: string;
    email: string;
    message: string;
};

export async function sendContactMessage(
    payload: ContactPayload,
    signal?: AbortSignal
): Promise<unknown> {
    const res = await fetch(`${env.apiLocalUrl}/api/contact`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(payload),
        signal,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Contact request failed: ${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`);
    }

    // Бек может вернуть пустой ответ — не паникуем
    try {
        return await res.json();
    } catch {
        return null;
    }
}