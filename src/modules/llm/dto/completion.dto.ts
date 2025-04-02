import { createZodDto } from '@anatine/zod-nestjs';
import { CompletionSchema } from '../schemas/completion.schema';

export class CompletionDto extends createZodDto(CompletionSchema) {}
