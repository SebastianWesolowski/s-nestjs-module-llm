// Generator schematów Zod dla frontendowej aplikacji Next.js
import { zodToTs } from 'zod-to-ts';
import fs from 'fs-extra';
import path from 'path';
import chokidar from 'chokidar';
import { glob } from 'glob';

// Konfiguracja ścieżek
const SCHEMAS_DIR = path.resolve(process.cwd(), 'src/schemas');
const OUTPUT_DIR = path.resolve(process.cwd(), '../frontend/types/zod-schemas');
const WATCH_MODE = process.argv.includes('--watch');

// Zapewnij istnienie katalogów
fs.ensureDirSync(SCHEMAS_DIR);
fs.ensureDirSync(OUTPUT_DIR);

// Generowanie typu z schematu Zod
async function generateTypeFromSchema(schemaPath: string) {
  try {
    const schemaName = path.basename(schemaPath, '.schema.ts');
    const schemaModule = await import(schemaPath);

    // Zbierz wszystkie eksportowane schematy z pliku
    const schemas = Object.entries(schemaModule)
      .filter(
        ([key, value]) => key.endsWith('Schema') && typeof value === 'object',
      )
      .map(([key, schema]) => ({
        name: key,
        schema,
      }));

    if (schemas.length === 0) {
      console.error(`Nie znaleziono schematów w pliku ${schemaPath}`);
      return;
    }

    let output = `// Wygenerowano automatycznie z ${schemaPath}\n\n`;

    // Generuj typ dla każdego schematu w pliku
    for (const { name, schema } of schemas) {
      const { node } = zodToTs(schema, name.replace('Schema', ''));
      output += `${node}\n\n`;
    }

    const outputPath = path.join(OUTPUT_DIR, `${schemaName}.ts`);
    fs.writeFileSync(outputPath, output);

    console.log(`Wygenerowano schemat: ${outputPath}`);
  } catch (error) {
    console.error(`Błąd generowania typu z ${schemaPath}:`, error);
  }
}

// Generowanie wszystkich schematów
async function generateAllSchemas() {
  try {
    const schemaFiles = await glob('**/*.schema.ts', { cwd: SCHEMAS_DIR });
    for (const file of schemaFiles) {
      await generateTypeFromSchema(path.join(SCHEMAS_DIR, file));
    }
    console.log('Generowanie schematów zakończone');
  } catch (error) {
    console.error('Błąd generowania schematów:', error);
  }
}

// Funkcja główna
async function main() {
  if (WATCH_MODE) {
    console.log('Uruchomiono tryb śledzenia zmian w schematach...');
    const watcher = chokidar.watch('**/*.schema.ts', {
      cwd: SCHEMAS_DIR,
      ignoreInitial: false,
    });

    watcher.on('add', (file) =>
      generateTypeFromSchema(path.join(SCHEMAS_DIR, file)),
    );
    watcher.on('change', (file) =>
      generateTypeFromSchema(path.join(SCHEMAS_DIR, file)),
    );
  } else {
    await generateAllSchemas();
  }
}

main();
