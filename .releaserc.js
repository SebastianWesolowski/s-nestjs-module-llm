// Minimum configuration
module.exports = {
  branches: ['main', 'master', { name: 'develop', prerelease: 'dev' }, { name: 'feature', prerelease: true }],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/changelog',
    '@semantic-release/github',
    '@semantic-release/git',
    '@semantic-release/npm',
  ],
};
