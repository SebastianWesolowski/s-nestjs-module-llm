/**
 * Kontroler REST API dla modułu LLM.
 * Udostępnia endpointy do komunikacji z modelami językowymi.
 */
import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { completionExamples } from '@/modules/llm/__mocks__/completion.examples';
import { LLMService } from './llm.service';
import { ChatCompletionResponseType, CompletionDto, SpeechToTextDto } from './types';

/**
 * Kontroler udostępniający endpointy REST API dla modułu LLM.
 * Zapewnia dostęp do funkcji takich jak konwersja mowy na tekst.
 */
@ApiTags('LLM')
@Controller('llm')
export class LLMController {
  /**
   * Konstruktor kontrolera LLM.
   *
   * @param llmService - Serwis LLM do obsługi żądań
   */
  constructor(private readonly llmService: LLMService) {}

  /**
   * Endpoint do generowania tekstu.
   * Przyjmuje listę wiadomości i zwraca wygenerowaną odpowiedź.
   * @param completionDto - Dane wejściowe zawierające wiadomości i opcje
   * @returns Wygenerowana odpowiedź
   */
  @Post('completion')
  @ApiOperation({ summary: 'Generuje tekst na podstawie wiadomości' })
  @ApiBody({ type: CompletionDto, examples: completionExamples })
  async completion(@Body() completionDto: CompletionDto): Promise<ChatCompletionResponseType> {
    const result = await this.llmService.completion(
      completionDto.messages,
      completionDto.model,
      completionDto.stream,
      completionDto.jsonMode
    );

    // Konwersja wyniku na ChatCompletionResponse
    if ('choices' in result) {
      return {
        messages: result.choices.map((choice) => ({
          role: choice.message.role,
          content: choice.message.content || '',
        })),
        totalTokens: result.usage?.total_tokens,
        promptTokens: result.usage?.prompt_tokens,
        completionTokens: result.usage?.completion_tokens,
        fullResponse: result,
      };
    }

    return result as ChatCompletionResponseType;
  }

  /**
   * Endpoint do konwersji mowy na tekst.
   * Przyjmuje plik audio i zwraca transkrypcję.
   * @param file - Plik audio do transkrypcji
   * @param speechToTextDto - Dodatkowe opcje transkrypcji
   * @returns Transkrypcja audio
   */
  @Post('speech-to-text')
  @ApiOperation({ summary: 'Konwertuje mowę na tekst' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: SpeechToTextDto })
  @UseInterceptors(FileInterceptor('file'))
  async speechToText(@UploadedFile() file: any, @Body() speechToTextDto: SpeechToTextDto): Promise<string> {
    return this.llmService.speechToText(file, {
      language: speechToTextDto.language,
      model: speechToTextDto.model,
      responseFormat: speechToTextDto.responseFormat,
    });
  }
}
