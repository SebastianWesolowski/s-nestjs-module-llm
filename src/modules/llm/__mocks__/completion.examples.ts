import { CompletionDto } from '@/modules/llm/types';

export const streamCompletionExamples: Record<string, { value: CompletionDto }> = {
  'Przykład ze streamingiem': {
    value: {
      messages: [
        {
          role: 'user',
          content: 'Opowiedz mi długą historię',
        },
      ],
      model: 'gpt-4o',
      stream: true,
    },
  },
};

export const completionExamples: Record<string, { value: CompletionDto }> = {
  'Przykład 1': {
    value: {
      messages: [
        {
          role: 'user',
          content: 'Hello, how are you?',
        },
      ],
      model: 'gpt-4o',
      stream: false,
      jsonMode: false,
    },
  },
  'Przykład z asystentem': {
    value: {
      messages: [
        {
          role: 'user',
          content: 'Jak napisać pętlę w TypeScript?',
        },
        {
          role: 'assistant',
          content: 'Oto przykład pętli for: for (let i = 0; i < 10; i++) { }',
        },
      ],
      model: 'gpt-4o',
    },
  },
  'Przykład z systemem': {
    value: {
      messages: [
        {
          role: 'system',
          content: 'Jesteś pomocnym asystentem programistycznym.',
        },
        {
          role: 'user',
          content: 'Potrzebuję pomocy z TypeScript',
        },
      ],
      model: 'gpt-4o',
    },
  },
  'Przykład wielowątkowy': {
    value: {
      messages: [
        {
          role: 'user',
          content: 'Co to jest Node.js?',
        },
        {
          role: 'assistant',
          content: 'Node.js to środowisko uruchomieniowe JavaScript.',
        },
        {
          role: 'user',
          content: 'A jak się go instaluje?',
        },
      ],
      model: 'gpt-4o',
    },
  },
  'Przykład z trybem JSON': {
    value: {
      messages: [
        {
          role: 'user',
          content: 'Pdaj 2 owoce i 2 warzywa w formacie JSON',
        },
      ],
      model: 'gpt-4o',
      jsonMode: true,
    },
  },
  'Przykład z o1': {
    value: {
      messages: [
        {
          role: 'user',
          content: 'Pdaj 2 owoce i 2 warzywa w formacie JSON',
        },
      ],
      model: 'o1',
    },
  },
  'Przykład bez podania modelu (użyje domyślnego)': {
    value: {
      messages: [
        {
          role: 'user',
          content: 'Pdaj 2 owoce i 2 warzywa w formacie JSON',
        },
      ],
    },
  },
  ...streamCompletionExamples,
};
