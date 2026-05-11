import type { TFunction } from 'i18next';

type AnyRecord = Record<string, unknown>;

/**
 * Единый хелпер для перевода ключей из enum/констант.
 *
 * Сейчас проект использует `translation.json` с ключами вида `namespace.key.path`,
 * поэтому здесь просто прокидываем ключ в i18next `t()`.
 */
export function tKey(t: TFunction, key: string, options?: AnyRecord): string {
    if (!key) return '';
    // i18next типизирует `t()` как string | object, но в UI нам нужен строковый результат.
    // returnObjects=false гарантирует, что не прилетит объект (например для вложенных ключей).
    return t(key, { ...(options ?? {}), returnObjects: false } as any) as string;
}

