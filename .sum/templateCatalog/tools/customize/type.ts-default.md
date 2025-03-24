export interface FileReplacement {
  placeholder: string;
  value: string;
  files: string[];
}

export interface CustomizeConfig {
  replacements: FileReplacement[];
  cleanupExtensions: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
