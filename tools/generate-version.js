const { execSync } = require('child_process');

// Pobierz hash ostatniego commita
const commitHash = execSync('git rev-parse --short HEAD').toString().trim();

// Pobierz numer wersji z package.json lub innego źródła
const version = process.env.npm_package_version; // np. 2.0.0

// Generuj wersję z hashem
const newVersion = `${version}-beta.${commitHash}`;

console.log(`Nowa wersja z hashem: ${newVersion}`);

// Ustawienie wersji jako zmiennej środowiskowej, którą później może przechwycić semantic-release
process.env.NEW_VERSION = newVersion;
