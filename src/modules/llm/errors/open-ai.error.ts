/**
 * Klasa błędu dla operacji związanych z OpenAI API
 */
export class OpenAIError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = 'OpenAIError';
  }
}
