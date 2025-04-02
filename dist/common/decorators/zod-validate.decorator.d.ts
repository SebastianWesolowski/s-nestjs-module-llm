import { ZodSchema } from 'zod';
export declare const ZodValidate: <TInput, TOutput>(paramSchema?: ZodSchema<TInput>, responseSchema?: ZodSchema<TOutput>) => (target: object, propertyKey: string, descriptor: PropertyDescriptor) => PropertyDescriptor;
