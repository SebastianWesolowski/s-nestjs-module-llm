name: Release Process

on:
  workflow_call:
    inputs:
      dry_run:
        description: 'Whether to perform a dry run (no actual release)'
        required: false
        type: boolean
        default: false
      pre_release:
        description: 'Whether this is a pre-release'
        required: false
        type: boolean
        default: false
      release_branch:
        description: 'Branch to release from'
        required: false
        type: string
        default: 'main'
      build_command:
        description: 'Command to build the project before release'
        required: false
        type: string
        default: 'build:release'
      install_args:
        description: 'Arguments for yarn install command'
        required: false
        type: string
        default: '--frozen-lockfile'
    secrets:
      GH_TOKEN:
        description: 'GitHub token with repo scope'
        required: true
      NPM_TOKEN:
        description: 'NPM token for publishing'
        required: false

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    timeout-minutes: 30

    env:
      FORCE_COLOR: 1
      NODE_ENV: production
      GH_TOKEN: ${{ secrets.GH_TOKEN }}
      GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

    steps:
      - name: 📝 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ secrets.GH_TOKEN }}
          ref: ${{ inputs.release_branch }}

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.17.0'
          cache: 'yarn'

      - name: 📦 Install dependencies
        run: |
          yarn config set network-timeout 300000
          yarn install ${{ inputs.install_args }}

      - name: 🔍 Check next release version
        id: next-version
        if: ${{ inputs.pre_release || inputs.dry_run }}
        run: |
          NEXT_VERSION=$(npx semantic-release --dry-run | grep "next release version is" -i | sed 's/.*is //')
          echo "Next version will be: $NEXT_VERSION"
          echo "version=$NEXT_VERSION" >> $GITHUB_OUTPUT

      - name: 🗑️ Clean specific tag if exists
        if: ${{ inputs.pre_release && steps.next-version.outputs.version != '' }}
        run: |
          echo "Cleaning tag v${{ steps.next-version.outputs.version }}"
          git tag -d "v${{ steps.next-version.outputs.version }}" 2>/dev/null || true
          git push origin ":refs/tags/v${{ steps.next-version.outputs.version }}" 2>/dev/null || true

      - name: 🏗️ Build project
        run: yarn ${{ inputs.build_command }}

      - name: 🚀 Release to NPM and GitHub
        if: ${{ !inputs.dry_run && secrets.NPM_TOKEN != '' }}
        run: npx semantic-release
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: 🚀 Release to GitHub only
        if: ${{ !inputs.dry_run && secrets.NPM_TOKEN == '' }}
        run: npx semantic-release
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          GITHUB_TOKEN: ${{ secrets.GH_TOKEN }}

      - name: 📋 Post Release Status
        if: always()
        run: |
          if [ "${{ job.status }}" == "success" ]; then
            echo "✅ Release ${{ inputs.dry_run && '(dry run) ' || '' }}completed successfully"
            if [ "${{ steps.next-version.outputs.version }}" != "" ]; then
              echo "Version: v${{ steps.next-version.outputs.version }}"
            fi
          else
            echo "❌ Release failed"
            echo "Please check the logs for more information"
          fi
