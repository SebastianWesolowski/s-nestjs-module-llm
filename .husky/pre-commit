echo \[🐶 Husky] Running pre-commit hook...\

# Get current branch
get_current_branch() {
    git rev-parse --abbrev-ref HEAD
}

# Check if branch is up to date with main
check_main_branch_updates() {
    local current_branch=$1
    echo "🔍 Checking for branch updates..."

    # Fetch all latest changes
    git fetch origin

    # Check if main has commits that dev doesn't have
    behind_commits=$(git rev-list --count $current_branch..origin/main)
    if [ "$behind_commits" -gt 0 ]; then
        echo "ℹ️  Main branch has $behind_commits new commits that are not in your branch! Update your branch before committing."
        echo "ℹ️  [⏩]Run: git stash && git rebase origin/main && git stash pop"
        return 1
    else
        echo "✅ Your branch is up to date with main"
        return 0
    fi
}

# Check if branch is up to date with remote
check_remote_branch_updates() {
    local current_branch=$1
    # Check if remote branch has new commits
    remote_commits=$(git rev-list --count $current_branch..origin/$current_branch 2>/dev/null)
    if [ "$remote_commits" -gt 0 ]; then
        echo "❗ Remote branch has $remote_commits new commits! Pull changes before committing."
        echo "ℹ️  [⏩]Run: git stash && git merge origin/$current_branch && git stash pop"
        return 1
    else
        echo "✅ Your branch is up to date with remote"
        return 0
    fi
}

# Update and add test snapshots
update_test_snapshots() {
    echo "🧪 Updating test snapshots..."

    # Save list of modified/untracked files before tests
    git status --porcelain > /tmp/files_before_test

    # Run tests to update snapshots
    yarn test:dev

    # Check if tests failed
    if [ $? -ne 0 ]; then
        echo "❌ Tests failed - fix them before committing"
        rm -f /tmp/files_before_test
        return 1
    fi

    # Find new or modified snapshot files after tests
    echo "📝 Checking for updated snapshots..."
    git status --porcelain | grep "__snapshots__" | grep -v "$(cat /tmp/files_before_test)" > /tmp/new_snapshots 2>/dev/null || true

    # Add only the new/modified snapshot files to the commit
    if [ -s /tmp/new_snapshots ]; then
        cat /tmp/new_snapshots | awk '{print $2}' | xargs git add
        echo "✅ Added updated snapshot files to commit"
    else
        echo "ℹ️ No new snapshot files detected"
    fi

    # Clean up temporary files
    rm -f /tmp/files_before_test /tmp/new_snapshots
    return 0
}

# Check and update tailwind config
check_tailwind_config() {
    # Check if tailwind.config.ts is in staging
    if git diff --cached --name-only | grep -q "tailwind.config.ts"; then
        echo "🎨 Detected changes in tailwind.config.ts - updating VS Code colors..."
        yarn update-vscode-colors
        git add .vscode/settings.json
    fi
}

# Main execution flow
main() {
    current_branch=$(get_current_branch)

    # Skip checks if on main branch
    if [ "$current_branch" = "main" ]; then
        echo "✅ On main branch, skipping update checks"
    else
        # Check updates from main branch
        if ! check_main_branch_updates "$current_branch"; then
            exit 1
        fi

        # Check updates from remote branch
        if ! check_remote_branch_updates "$current_branch"; then
            exit 1
        fi

        # Run husky pre-commit tasks
        yarn husky:pre-commit

        # Update test snapshots
        if ! update_test_snapshots; then
            exit 1
        fi
    fi

    # Check tailwind config changes
    check_tailwind_config

    echo \[🐶 Husky] Done ✅ pre-commit hook...\

    exit 0
}

# Run the main function
main
