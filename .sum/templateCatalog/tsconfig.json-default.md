{
  "compilerOptions": {
    "module": "commonjs",
    "lib": ["ES2023"],
    "target": "ES2023",
    "moduleResolution": "node",

    // Wsparcie dla dekoratorów (NestJS)
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,

    // Generowanie plików i importy
    "declaration": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    // Optymalizacja i debugowanie
    "sourceMap": true,
    "removeComments": true,
    "incremental": true,
    "outDir": "./dist",
    "baseUrl": "./",

    // Aliasy ścieżek
    "paths": {
      "@/*": ["src/*"],
      "@common/*": ["src/common/*"],
      "@config/*": ["src/config/*"],
      "@modules/*": ["src/modules/*"],
      "@test/*": ["src/test/*"]
    },

    // Rygorystyczne sprawdzanie typów
    "strict": true,
    "noImplicitAny": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "strictNullChecks": true,
    "strictBindCallApply": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": false, // wyłączone ze względu na dekoratory NestJS

    // Dodatkowe zabezpieczenia
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowJs": false,
    "noImplicitThis": true,
    "alwaysStrict": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "@types", "src/test/**/*.ts"],
  "exclude": ["node_modules", "dist", "coverage"]
}
