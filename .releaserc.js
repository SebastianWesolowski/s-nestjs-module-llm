const helpers = require('handlebars-helpers')();
module.exports = {
  branches: [
    'main',
    {
      name: 'dev',
      prerelease: true,
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

              // Extract SC issue number

              if (commit.message && commit.subject === null) {
                modifiedCommit.subject = commit.message;
              }

              const scMatch = commit.subject ? commit.subject.match(/\[?(SC-\d+)\]?/) : null;
              if (scMatch) {
                const scIssue = scMatch[1];
                modifiedCommit.scIssue = scIssue;
                // Replace SC issue with linked version
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
            branches: ['main'],
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
        prepareCmd: 'echo "Preparing release" && yarn build:prod',
      },
    ],
    ['@semantic-release/npm', { npmPublish: false }],
  ],
};
