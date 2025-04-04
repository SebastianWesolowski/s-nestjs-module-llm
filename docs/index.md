# Dokumentacja Modułu LLM dla NestJS

## Wprowadzenie

Moduł LLM to biblioteka dla NestJS umożliwiająca łatwą integrację z OpenAI API. Dostarcza gotowe do użycia komponenty, które pozwalają na szybkie dodanie funkcji opartych na sztucznej inteligencji do aplikacji NestJS.

## Spis treści

- [Instalacja i konfiguracja](./instalacja.md)
- [Architektura](./architektura.md)
- [Serwisy](./serwisy.md)
- [Kontrolery](./kontrolery.md)
- [Interfejsy i typy](./interfejsy.md)

## Główne funkcje

- Integracja z API OpenAI
- Konwersja mowy na tekst (Whisper)
- Generowanie tekstu na podstawie promptów (GPT-4o)
- Analiza obrazów (GPT-4 Vision)
- Obsługa JSON-owych odpowiedzi
- Logowanie promptów i odpowiedzi

## Wspierane modele

- GPT-4o (domyślny model dla generowania tekstu)
- Whisper (domyślny model dla konwersji mowy na tekst)
- Inne modele dostępne w API OpenAI

## Jak zacząć

Aby rozpocząć korzystanie z biblioteki, przejdź do sekcji [Instalacja i konfiguracja](./instalacja.md).

## Wymagania systemowe

- Node.js >= 20.17.0
- NestJS >= 11.0.0
- Klucz API OpenAI
