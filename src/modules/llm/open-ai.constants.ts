/**
 * Stałe związane z konfiguracją OpenAI.
 * Zawiera domyślne wartości i tokeny używane w komunikacji z API OpenAI.
 */

/**
 * Domyślny model GPT-4 do generowania tekstu.
 * Używany jako fallback, gdy nie podano innego modelu.
 */
export const DEFAULT_GPT4_MODEL = 'gpt-4';

/**
 * Token wstrzykiwania opcji modułu OpenAI.
 * Używany do wstrzykiwania opcji konfiguracyjnych w serwisie OpenAI.
 */
export const OPENAI_MODULE_OPTIONS = 'OPENAI_MODULE_OPTIONS';
