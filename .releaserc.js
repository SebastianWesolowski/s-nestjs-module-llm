// Minimum configuration
module.exports = {
  branches: [
    'main',
    'master',
    { name: 'develop', prerelease: 'dev' },
    // Wszystkie gałęzie feature używają tego samego identyfikatora
    // UWAGA: Nowe wersje będą nadpisywać stare
    { name: 'feature/*', prerelease: 'experimental' },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/github',
    '@semantic-release/git',
    '@semantic-release/npm',
  ],
};
