import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ZodError } from 'zod';
export declare class ZodValidationFilter implements ExceptionFilter {
    private configService;
    constructor(configService: ConfigService);
    catch(exception: ZodError & {
        _type?: 'params' | 'response';
    }, host: ArgumentsHost): void;
    private getReadableError;
}
