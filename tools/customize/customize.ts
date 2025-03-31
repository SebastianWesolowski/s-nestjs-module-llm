import fs from 'fs/promises';
import path from 'path';
import { config } from './customize.config';
import { ValidationResult } from './type';

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function validateConfig(): Promise<ValidationResult> {
  const errors: string[] = [];

  for (const replacement of config.replacements) {
    // Check if value is present
    if (!replacement.value) {
      errors.push(`Missing value for ${replacement.placeholder}`);
    }

    // Check if files array is not empty
    if (!replacement.files || replacement.files.length === 0) {
      errors.push(`No files specified for ${replacement.placeholder}`);
      continue;
    }

    // Check if files exist and contain placeholders
    for (const filePath of replacement.files) {
      if (!(await fileExists(filePath))) {
        errors.push(`File not found: ${filePath} for ${replacement.placeholder}`);
        continue;
      }

      try {
        const content = await fs.readFile(filePath, 'utf-8');
        if (!content.includes(replacement.placeholder)) {
          errors.push(`Placeholder "${replacement.placeholder}" not found in ${filePath}`);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          errors.push(`Failed to read file ${filePath}: ${error.message}`);
        } else {
          errors.push(`Failed to read file ${filePath}: Unknown error`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

async function replaceInFile(filePath: string, placeholder: string, value: string): Promise<void> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const updatedContent = content.replace(new RegExp(placeholder, 'g'), value);
    await fs.writeFile(filePath, updatedContent);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to replace in file ${filePath}: ${error.message}`);
    }
    throw new Error(`Failed to replace in file ${filePath}: Unknown error`);
  }
}

async function cleanupBackups(): Promise<void> {
  const findBackups = async (dir: string): Promise<string[]> => {
    const files = await fs.readdir(dir, { withFileTypes: true });
    const backups: string[] = [];

    for (const file of files) {
      const fullPath = path.join(dir, file.name);
      if (file.isDirectory()) {
        backups.push(...(await findBackups(fullPath)));
      } else {
        if (config.cleanupExtensions.some((ext) => file.name.endsWith(ext))) {
          backups.push(fullPath);
        }
      }
    }

    return backups;
  };

  const backups = await findBackups('.');
  for (const backup of backups) {
    await fs.unlink(backup);
  }
}

async function cleanupFiles(): Promise<void> {
  const filesToRemove = ['todo.md'];

  const directoriesToRemove = ['docs', 'tools/customize'];

  // Remove individual files
  for (const file of filesToRemove) {
    try {
      await fs.unlink(file);
      console.log(`✓ Deleted ${file}`);
    } catch (error) {
      // Ignore errors if file doesn't exist
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error(`Failed to delete ${file}`);
      }
      // Możemy dodać informację, że plik nie istniał
      else {
        console.log(`ℹ️ File ${file} does not exist - skipping`);
      }
    }
  }

  // Remove directories
  for (const dir of directoriesToRemove) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
      console.log(`✓ Deleted directory ${dir} and all its contents`);
    } catch (error) {
      // Ignore errors if directory doesn't exist
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.error(`Failed to delete directory ${dir}`);
      }
      // Możemy dodać informację, że katalog nie istniał
      else {
        console.log(`ℹ️ Directory ${dir} does not exist - skipping`);
      }
    }
  }
}

async function customize(): Promise<void> {
  console.log('Starting customization process...');

  const validation = await validateConfig();
  if (!validation.isValid) {
    console.error('Validation failed:');
    validation.errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  try {
    for (const replacement of config.replacements) {
      const { placeholder, value, files } = replacement;
      for (const file of files) {
        await replaceInFile(file, placeholder, value);
        console.log(`✓ Updated ${file}`);
      }
    }

    await cleanupBackups();
    console.log('✓ Cleaned up backup files');

    await cleanupFiles();
    console.log('✓ Cleaned up customization files');

    console.log('✓ Customization completed successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Customization failed:', error.message);
    } else {
      console.error('❌ Customization failed with unknown error');
    }
    process.exit(1);
  }
}

customize().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('Fatal error:', error.message);
  } else {
    console.error('Fatal unknown error occurred');
  }
  process.exit(1);
});
