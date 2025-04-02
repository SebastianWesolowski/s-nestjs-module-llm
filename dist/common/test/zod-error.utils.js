"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectMaxValueError = exports.expectMinValueError = exports.expectRequiredFieldError = exports.expectFieldError = exports.expectZodError = void 0;
const expectZodError = (response) => {
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toBe('Błąd walidacji parametrów');
    expect(response.body.errors).toBeDefined();
    expect(Array.isArray(response.body.errors)).toBe(true);
    return response.body.errors;
};
exports.expectZodError = expectZodError;
const expectFieldError = (errors, field) => {
    const fieldError = errors.find((error) => error.validation.field === field);
    expect(fieldError).toBeDefined();
    return fieldError;
};
exports.expectFieldError = expectFieldError;
const expectRequiredFieldError = (errors, field) => {
    return (0, exports.expectFieldError)(errors, field);
};
exports.expectRequiredFieldError = expectRequiredFieldError;
const expectMinValueError = (errors, field) => {
    return (0, exports.expectFieldError)(errors, field);
};
exports.expectMinValueError = expectMinValueError;
const expectMaxValueError = (errors, field) => {
    return (0, exports.expectFieldError)(errors, field);
};
exports.expectMaxValueError = expectMaxValueError;
//# sourceMappingURL=zod-error.utils.js.map