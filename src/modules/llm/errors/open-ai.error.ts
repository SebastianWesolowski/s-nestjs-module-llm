/**
 * Klasa błędu dla operacji związanych z OpenAI.
 * Rozszerza standardową klasę Error o dodatkowe informacje specyficzne dla OpenAI.
 */
export class OpenAIError extends Error {
  /**
   * Konstruktor klasy OpenAIError.
   * @param message - Wiadomość błędu
   * @param options - Opcje błędu (status HTTP i dodatkowe dane)
   */
  constructor(message: string, options?: { status?: number; cause?: unknown }) {
    super(message);
    this.name = 'OpenAIError';

    if (options) {
      this.status = options.status;
      this.cause = options.cause;
    }
  }

  /**
   * Kod statusu HTTP (opcjonalny)
   */
  status?: number;

  /**
   * Dodatkowe dane błędu (opcjonalne)
   */
  cause?: unknown;
}
