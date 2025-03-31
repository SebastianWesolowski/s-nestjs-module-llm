# Husky Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to enforce code quality and maintain consistency through Git hooks. These hooks run automatically at different stages of the Git workflow to ensure best practices.

## Available Hooks

### pre-commit

The `pre-commit` hook runs before a commit is finalized and performs several checks:

- **Branch synchronization check**:

  - Verifies if your branch is up-to-date with the main branch
  - Checks if your branch is synchronized with its remote counterpart
  - Provides instructions if updates are required

- **Test snapshots management**:

  - Runs tests to update snapshots
  - Automatically adds new/modified snapshot files to the commit
  - Prevents commits if tests are failing

- **Tailwind configuration management**:
  - Detects changes in `tailwind.config.ts`
  - Automatically updates VS Code color settings
  - Adds the updated settings to the commit

### prepare-commit-msg

The `prepare-commit-msg` hook helps maintain a consistent commit message format:

- **Commit message formatting**:
  - Validates commit messages using commitlint
  - Extracts and properly formats commit type, emoji, issue number, and content
  - Falls back to a commit message wizard if validation fails
  - Supports conventional commit format (e.g., `feat: ✨ [SC-123] Add new feature`)

### pre-push

The `pre-push` hook runs before pushing commits to the remote repository:

- Executes the `yarn husky:pre-push` command, which can be customized to run various checks:
  - Linting
  - Type checking
  - Test execution
  - Other quality checks

### post-merge

The `post-merge` hook runs after completing a merge (such as after a `git pull`):

- Automatically runs `yarn` to install or update dependencies when new code is pulled

## Setup

Husky is already configured in this project. The hooks are stored in the `.husky` directory and are automatically executed at the appropriate Git lifecycle events.

## Customization

To modify the behavior of these hooks:

1. Edit the corresponding files in the `.husky` directory
2. For the pre-commit and pre-push hooks, you can also modify the associated scripts in `package.json`:
   - `husky:pre-commit`
   - `husky:prepare-commit-msg`
   - `husky:pre-push`

## Skipping Hooks

In rare cases where you need to bypass hooks:

- `git commit --no-verify` - Skip pre-commit and commit-msg hooks
- `git push --no-verify` - Skip pre-push hook

**Note**: Skipping hooks should be done sparingly as they are in place to maintain code quality.
