/**
 * Stałe konfiguracyjne dla modułu LLM.
 * Zawiera tokeny wstrzykiwania i domyślne wartości dla konfiguracji modułu.
 */

/**
 * Token wstrzykiwania opcji modułu LLM.
 * Używany do wstrzykiwania opcji konfiguracyjnych w serwisie LLM.
 */
export const LLM_MODULE_OPTIONS = Symbol('LLM_MODULE_OPTIONS');

/**
 * Domyślny model OpenAI do generowania tekstu.
 * Używany, gdy nie podano innego modelu w konfiguracji.
 */
export const DEFAULT_MODEL = 'gpt-4o';

/**
 * Domyślny model Whisper do konwersji mowy na tekst.
 * Używany, gdy nie podano innego modelu w konfiguracji.
 */
export const DEFAULT_WHISPER_MODEL = 'whisper-1';
