const helpers = require('handlebars-helpers')();

// Function to generate branches configuration dynamically
const getBranchesConfig = () => {
  const branches = [
    {
      name: 'main',
      channel: 'latest',
    },
    {
      name: 'master',
      channel: 'latest',
    },
    {
      name: 'dev',
      channel: 'dev',
      prerelease: 'dev',
    },
    {
      name: 'develop',
      channel: 'dev',
      prerelease: 'dev',
    },
    {
      name: 'alfa',
      channel: 'alfa',
      prerelease: 'alfa',
    },
    {
      name: 'beta',
      channel: 'beta',
      prerelease: 'beta',
    },
    {
      name: 'rc',
      channel: 'rc',
      prerelease: 'rc',
    },
  ];

  // Check if we're on a feature branch
  const currentBranch = process.env.GITHUB_REF_NAME || '';
  if (currentBranch.startsWith('feature/')) {
    const featureName = currentBranch.replace('feature/', '');
    // Get shortened commit hash from environment
    const shortHash = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substring(0, 7) : '';
    branches.push({
      name: currentBranch,
      channel: 'feature',
      prerelease: `${featureName}-${shortHash}`,
    });
  }

  // Handle pull request to main/master for rc version
  const isPR = process.env.GITHUB_EVENT_NAME === 'pull_request';
  const targetBranch = process.env.GITHUB_BASE_REF || '';
  if (isPR && (targetBranch === 'main' || targetBranch === 'master')) {
    const prNumber = process.env.GITHUB_HEAD_REF ? process.env.GITHUB_HEAD_REF.replace(/\D/g, '') : '';
    const shortHash = process.env.GITHUB_SHA ? process.env.GITHUB_SHA.substring(0, 7) : '';
    branches.push({
      name: process.env.GITHUB_HEAD_REF,
      channel: 'rc',
      prerelease: `rc-pr${prNumber}-${shortHash}`,
    });
  }

  return branches;
};

module.exports = {
  branches: getBranchesConfig(),
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'conventionalcommits',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
        releaseRules: [
          {
            type: 'build',
            scope: 'deps',
            release: 'patch',
          },
        ],
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
        presetConfig: {
          types: [
            { type: 'feat', section: 'Features' },
            { type: 'fix', section: 'Bug Fixes' },
            { type: 'build', section: 'Dependencies and Other Build Updates', hidden: false },
            { type: 'chore', section: 'Other tasks', hidden: false },
          ],
        },
        writerOpts: {
          groupBy: 'scIssue',
          commitsSort: ['scIssue', 'type'],
          helpers,
          commitGroupsSort: (a, b) => {
            if (a.title === 'Other tasks') return 1;
            if (b.title === 'Other tasks') return -1;

            const aMatch = a.title && a.title.match(/SC-(\d+)/);
            const bMatch = b.title && b.title.match(/SC-(\d+)/);

            if (aMatch && bMatch) {
              return parseInt(aMatch[1]) - parseInt(bMatch[1]);
            }

            return (a.title || '').localeCompare(b.title || '');
          },
          transform: (commit, context) => {
            // Stwórz kopię obiektu commit zamiast modyfikować go bezpośrednio
            const result = { ...commit };

            if (commit.type === 'feat') {
              result.type = 'Features';
            } else if (commit.type === 'fix') {
              result.type = 'Bug Fixes';
            } else if (commit.type === 'build') {
              result.type = 'Dependencies and Other Build Updates';
            } else if (commit.type === null || !commit.type || commit.type === 'chore') {
              result.type = 'Other tasks';
            }

            if (typeof commit.hash === 'string') {
              result.shortHash = commit.hash.substring(0, 7);
            }

            if (typeof commit.subject === 'string' || commit.subject === null) {
              let url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl;

              // Extract SC issue number
              if (commit.message && commit.subject === null) {
                result.subject = commit.message;
              }

              const scMatch = commit.subject ? commit.subject.match(/\[?(SC-\d+)\]?/) : null;
              if (scMatch) {
                const scIssue = scMatch[1];
                result.scIssue = scIssue;
                // Replace SC issue with linked version
                result.subject = commit.subject.replace(
                  /\[?(SC-\d+)\]?/,
                  `[[${scIssue}](https://linear.app/wesolowskidev/issue/${scIssue})]`
                );
              } else {
                result.scIssue = 'Other tasks';
              }

              if (url) {
                result.commitUrl = `${url}/commit/${commit.hash}`;
              }
            }

            return result;
          },
          commitPartial: '- {{subject}} ([{{shortHash}}]({{commitUrl}}))\n',
          mainTemplate: `{{> header}}

{{#each commitGroups}}

### {{#if (eq title "Other tasks")}}Other tasks{{else}}[{{title}}](https://linear.app/wesolowskidev/issue/{{title}}){{/if}}

{{#each commits}}
{{> commit root=@root}}
{{/each}}

{{/each}}
{{> footer}}`,
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/github',
      {
        branches: ['main'],
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md'],
        message: 'release: 📦 ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'echo "Preparing release" && yarn build:prod',
      },
    ],
    ['@semantic-release/npm', { npmPublish: false }],
  ],
};
