# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating various tasks in the project.

## Workflow Architecture Diagram

![GitHub Actions Workflows](../assets/githubActions.png)

```mermaid
%%{init: {'theme': 'default', 'themeVariables': { 'primaryColor': '#f0f0f0', 'edgeLabelBackground':'#ffffff', 'tertiaryColor': '#fff0f0'}}}%%
flowchart TD
    subgraph MainWorkflows["Main Workflows"]
        direction TB
        CI[("CI ci.yml")] -->|"triggers"| Lint[("Lint")]
        CI -->|"triggers"| TestCI[("Test")]
        CI -->|"triggers"| BuildCI[("Build")]
        CI -->|"collects results"| Summary{{Workflow Summary}}

        Release[("Release release.yml")] -->|"triggers"| TestRelease[("Verify Release")]
        Release -->|"executes"| ReleaseProcess{{Release Process}}

        PreRelease[("Pre-Release preRelease.yml")] -->|"triggers"| TestPreRelease[("Verify Pre-Release")]
        PreRelease -->|"executes"| PreReleaseProcess{{Pre-Release Process}}

        Bundle[("Bundle Analysis bundle-analysis.yml")] -->|"configures"| Setup[("Setup")]
        Bundle -->|"runs"| Analyze{{Analyze Bundle}}
    end

    subgraph ReusableWorkflows["Reusable Workflows"]
        direction TB
        SetupReusable([Setup reusable-setup.yml]):::reusable
        TestReusable([Test reusable-test.yml]):::reusable
        LintReusable([Lint reusable-lint.yml]):::reusable
        BuildReusable([Build reusable-build.yml]):::reusable
        ReleaseReusable([Release Process reusable-release.yml]):::reusable
    end

    %% Connections between main and reusable workflows
    Lint ==> LintReusable
    TestCI ==> TestReusable
    TestRelease ==> TestReusable
    TestPreRelease ==> TestReusable
    BuildCI ==> BuildReusable
    ReleaseProcess ==> ReleaseReusable
    PreReleaseProcess ==> ReleaseReusable
    Setup ==> SetupReusable

    %% All reusable workflows depend on setup
    LintReusable -.-> SetupReusable
    TestReusable -.-> SetupReusable
    BuildReusable -.-> SetupReusable
    ReleaseReusable -.-> SetupReusable

    classDef main fill:#d4f1f9,stroke:#333,stroke-width:2px;
    classDef reusable fill:#f9f0ff,stroke:#333,stroke-width:1px,stroke-dasharray: 5 5;
    class CI,Release,PreRelease,Bundle main;
```

## Main Workflows

| Workflow        | File                                         | Description                                                                                                                         |
| --------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| CI              | [ci.yml](./ci.yml)                           | Main continuous integration workflow that runs on push to main branches and pull requests. Includes linting, testing, and building. |
| Release         | [release.yml](./release.yml)                 | Handles production releases from main/master branches.                                                                              |
| Pre-Release     | [preRelease.yml](./preRelease.yml)           | Handles pre-releases from dev/develop branches.                                                                                     |
| Bundle Analysis | [bundle-analysis.yml](./bundle-analysis.yml) | Analyzes Next.js bundle size and comments on PRs with changes.                                                                      |

## Reusable Workflows

These workflows are not meant to be triggered directly but are used as components in the main workflows:

| Workflow        | File                                           | Description                                                                     |
| --------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| Setup           | [reusable-setup.yml](./reusable-setup.yml)     | Sets up the Node.js environment, installs dependencies, and configures caching. |
| Test            | [reusable-test.yml](./reusable-test.yml)       | Runs various types of tests (unit, E2E, smoke) with matrix support.             |
| Lint            | [reusable-lint.yml](./reusable-lint.yml)       | Runs linting checks (TypeScript, ESLint, Prettier, Stylelint).                  |
| Build           | [reusable-build.yml](./reusable-build.yml)     | Builds the application with various options.                                    |
| Release Process | [reusable-release.yml](./reusable-release.yml) | Handles the semantic release process.                                           |

## Workflow Architecture

The workflows are designed with the following principles:

1. **Reusability**: Common steps are extracted into reusable workflows.
2. **Parallelization**: Jobs run in parallel where possible to speed up execution.
3. **Caching**: Efficient caching is used to speed up builds and dependency installation.
4. **Security**: Secrets are handled securely and action versions are pinned.
5. **Concurrency**: Workflows use concurrency to prevent redundant runs.

## Triggering Workflows Manually

Some workflows can be triggered manually from the GitHub Actions tab:

- **CI**: Can be run on any branch to verify code quality.
- **Release/Pre-Release**: Can be run with a dry-run option to preview the release without publishing.
- **Bundle Analysis**: Can be run to analyze the current bundle size.

## Workflow Outputs

- **Test Reports**: Available as artifacts when tests are run.
- **Bundle Analysis**: Comments on PRs with bundle size changes.
- **Build Artifacts**: Available for download after successful builds.

## Customizing Workflows

To customize these workflows:

1. Edit the main workflow files to change triggers or job configurations.
2. Modify the reusable workflows to change the underlying implementation.
3. Add new workflows as needed for additional automation tasks.

## Security Considerations

- All external actions are pinned to specific versions for security.
- Secrets are passed securely to reusable workflows.
- Workflows are designed to minimize the risk of secret exposure.
