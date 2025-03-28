// Minimum configuration
module.exports = {
  branches: [
    'main',
    'master',
    { name: 'dev', prerelease: 'dev' },
    { name: 'develop', prerelease: 'dev' },
    { name: 'feature/*', prerelease: 'feature' },
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
