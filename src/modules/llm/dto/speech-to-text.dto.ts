import { ApiProperty } from '@nestjs/swagger';
import { Multer } from 'multer';
import { SpeechToTextSchema } from '../schemas/speech-to-text.schema';
import type { SpeechToTextInput } from '../schemas/speech-to-text.schema';

// Klasa DTO tylko dla Swagger dokumentacji
export class SpeechToTextDto implements SpeechToTextInput {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: Multer.File;

  @ApiProperty({ required: false })
  language?: string;

  @ApiProperty({ required: false })
  model?: string;

  @ApiProperty({
    required: false,
    enum: ['json', 'text', 'srt', 'verbose_json', 'vtt'],
    default: 'json',
  })
  responseFormat: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt';

  static validate(data: unknown): SpeechToTextInput {
    return SpeechToTextSchema.parse(data);
  }
}
