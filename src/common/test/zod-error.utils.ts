// Narzędzia pomocnicze do testowania błędów walidacji Zod

export interface ValidationError {
  validation: {
    type: string;
    field: string;
    fullPath: string;
    error: string;
  };
  details: {
    message: string;
    code: string;
    path: string[];
  };
  debug: {
    issue: {
      code: string;
      expected: string;
      received: string;
      path: string[];
      message: string;
    };
    context: string;
  };
}

export interface ValidationErrorResponse {
  statusCode: number;
  message: string;
  errors: ValidationError[];
  meta: {
    timestamp: string;
    type: string;
    total: number;
  };
  stack: string;
}

export const expectZodError = (response: { body: ValidationErrorResponse }) => {
  expect(response.body.statusCode).toBe(400);
  expect(response.body.message).toBe('Błąd walidacji parametrów');
  expect(response.body.errors).toBeDefined();
  expect(Array.isArray(response.body.errors)).toBe(true);
  return response.body.errors;
};

export const expectFieldError = (errors: ValidationError[], field: string) => {
  const fieldError = errors.find((error) => error.validation.field === field);
  expect(fieldError).toBeDefined();
  return fieldError;
};

export const expectRequiredFieldError = (errors: ValidationError[], field: string) => {
  return expectFieldError(errors, field);
};

export const expectMinValueError = (errors: ValidationError[], field: string) => {
  return expectFieldError(errors, field);
};

export const expectMaxValueError = (errors: ValidationError[], field: string) => {
  return expectFieldError(errors, field);
};
