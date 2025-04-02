import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from '../../../common/pipes/zod-validation.pipe';
import { SpeechToTextDto } from '../dto/speech-to-text.dto';
import { LLMService } from '../llm.service';
import { SpeechToTextSchema } from '../schemas/speech-to-text.schema';

@Controller('llm')
export class LLMController {
  constructor(private readonly llmService: LLMService) {}

  @Post('speech-to-text')
  @ApiOperation({ summary: 'Konwertuje mowę na tekst' })
  @ApiResponse({ status: 200, description: 'Tekst z audio' })
  @UsePipes(new ZodValidationPipe(SpeechToTextSchema))
  async speechToText(@Body() dto: SpeechToTextDto): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.llmService.speechToText(dto.file, {
      language: dto.language,
      model: dto.model,
      responseFormat: dto.responseFormat,
    });
  }
}
