const helpers = require('handlebars-helpers')();
const { execSync } = require('child_process');

// Funkcja do pobierania hasha commita
const getCommitHash = () => {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    return 'unknown';
  }
};

// Funkcja do określania typu brancha
const getBranchType = (branch) => {
  if (!branch) return 'unknown';

  if (branch === 'main' || branch === 'master') return 'production';
  if (branch === 'dev' || branch === 'develop') return 'dev';
  if (branch.startsWith('feature/')) return 'feature';

  return branch; // Dla innych przypadków zwracamy nazwę brancha
};

module.exports = {
  branches: [
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
    {
      name: 'feature/*',
      channel: 'feature',
      prerelease: (name) => {
        const featureName = name.replace(/^feature\//, '').replace(/[^0-9A-Za-z-]/g, '-');
        const hash = getCommitHash();
        return `feature-${featureName}-${hash}`;
      },
    },
  ],
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
            if (process.env.SKIP_TRANSFORM === 'true') {
              return commit;
            }

            const modifiedCommit = { ...commit };

            if (commit.type === 'feat') {
              modifiedCommit.type = 'Features';
            } else if (commit.type === 'fix') {
              modifiedCommit.type = 'Bug Fixes';
            } else if (commit.type === 'build') {
              modifiedCommit.type = 'Dependencies and Other Build Updates';
            } else if (commit.type === null || !commit.type || commit.type === 'chore') {
              modifiedCommit.type = 'Other tasks';
            }

            if (typeof commit.hash === 'string') {
              modifiedCommit.shortHash = commit.hash.substring(0, 7);
            }

            if (typeof commit.subject === 'string' || commit.subject === null) {
              let url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl;

              if (commit.message && commit.subject === null) {
                modifiedCommit.subject = commit.message;
              }

              const scMatch = commit.subject ? commit.subject.match(/\[?(SC-\d+)\]?/) : null;
              if (scMatch) {
                const scIssue = scMatch[1];
                modifiedCommit.scIssue = scIssue;
                modifiedCommit.subject = commit.subject.replace(
                  /\[?(SC-\d+)\]?/,
                  `[[${scIssue}](https://linear.app/wesolowskidev/issue/${scIssue})]`
                );
              } else {
                modifiedCommit.scIssue = 'Other tasks';
              }

              if (url) {
                modifiedCommit.commitUrl = `${url}/commit/${commit.hash}`;
              }
            }

            return modifiedCommit;
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
    ...(process.env.CI
      ? [
          '@semantic-release/github',
          {
            branches: [
              'main',
              'master',
              'dev',
              'develop',
              'alfa',
              'beta',
              'rc',
              { pattern: 'feature/*', source: 'feature' },
            ],
            successComment: (_, context) => {
              const branch = context.branch.name;
              const branchType = getBranchType(branch);
              const version = context.nextRelease.version;

              switch (branchType) {
                case 'production':
                  return `🚀 Wydanie produkcyjne ${version} zostało opublikowane!`;
                case 'dev':
                  return `⚙️ Wydanie deweloperskie ${version} zostało opublikowane!`;
                case 'alfa':
                  return `🧪 Wydanie alfa ${version} zostało opublikowane!`;
                case 'beta':
                  return `🔍 Wydanie beta ${version} zostało opublikowane!`;
                case 'rc':
                  return `🏁 Wydanie kandydackie (RC) ${version} zostało opublikowane!`;
                case 'feature':
                  return `🧩 Wydanie funkcjonalne ${version} zostało opublikowane!`;
                default:
                  return `📦 Wydanie ${version} zostało opublikowane!`;
              }
            },
            failTitle: 'Proces wydania nie powiódł się 🚨',
            labels: ['release'],
            releasedLabels: (_, context) => {
              const branchType = getBranchType(context.branch.name);
              return ['released', `release:${branchType}`];
            },
            assets: (_, context) => {
              const baseAssets = ['dist/*.tgz'];
              // Dla produkcyjnych wydań dodaj więcej assetów
              if (getBranchType(context.branch.name) === 'production') {
                return [...baseAssets, 'CHANGELOG.md', 'LICENSE'];
              }
              return baseAssets;
            },
          },
        ]
      : []),
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
        prepareCmd: 'echo "Preparing release for ${process.env.GITHUB_REF_NAME}" && yarn build:prod',
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: true,
        pkgRoot: '.',
        tarballDir: 'dist',
        npmPublishArgs: [
          (branch) => {
            const branchType = getBranchType(branch || process.env.GITHUB_REF_NAME);
            const tag = branchType === 'production' ? 'latest' : branchType;
            return `--tag ${tag}`;
          },
        ],
      },
    ],
  ],
};
