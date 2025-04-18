/**
 * Kontroler REST API dla modułu LLM.
 * Udostępnia endpointy do komunikacji z modelami językowymi.
 */
import { Body, Controller, MessageEvent, Post, Sse, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { completionExamples, streamCompletionExamples } from '@/modules/llm/__mocks__/completion.examples';
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
    const result = await this.llmService.completion({
      messages: completionDto.messages,
      model: completionDto.model,
      stream: completionDto.stream,
      jsonMode: completionDto.jsonMode,
    });

    // Konwersja wyniku na ChatCompletionResponse
    if ('choices' in result) {
      return {
        messages: (result.choices as Array<{ message: { role: string; content?: string } }>).map((choice) => ({
          role: choice.message.role,
          content: choice.message.content || '',
        })),
        totalTokens: (result as { usage?: { total_tokens?: number } }).usage?.total_tokens,
        promptTokens: (result as { usage?: { prompt_tokens?: number } }).usage?.prompt_tokens,
        completionTokens: (result as { usage?: { completion_tokens?: number } }).usage?.completion_tokens,
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

  /**
   * Endpoint do strumieniowego generowania tekstu.
   * Wykorzystuje Server-Sent Events (SSE) do przesyłania fragmentów odpowiedzi.
   */
  @Post('stream')
  @Sse()
  @ApiOperation({ summary: 'Generuje tekst w trybie strumieniowym' })
  @ApiBody({ type: CompletionDto, examples: streamCompletionExamples })
  streamCompletion(@Body() completionDto: CompletionDto): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      void (async () => {
        try {
          const stream = await this.llmService.completion({
            messages: completionDto.messages,
            model: completionDto.model,
            stream: true,
            jsonMode: completionDto.jsonMode,
          });

          if (stream && Symbol.asyncIterator in stream) {
            let fullContent = '';
            for await (const chunk of stream as AsyncIterable<any>) {
              const content = chunk.choices[0]?.delta?.content || '';
              if (content) {
                fullContent += content;
              }
            }
            subscriber.next({
              data: {
                content: fullContent,
                done: true,
              },
            });
            subscriber.complete();
          }
        } catch (error) {
          subscriber.error(error);
        }
      })();
    });
  }
}
