name: Release Process

on:
  workflow_call:
    inputs:
      release_type_detected:
        description: 'Type of release (production, preprod, prerelease, feature)'
        required: true
        type: string
      release_branch:
        description: 'Branch to release from'
        required: false
        type: string
        default: 'main'
      install_args:
        description: 'Arguments for yarn install command'
        required: false
        type: string
        default: '--frozen-lockfile'
      node_version:
        description: 'Node.js version from setup'
        required: true
        type: string
      install_deps:
        description: 'Whether to install dependencies'
        required: true
        type: string
      cache_keys:
        description: 'Cache keys configuration'
        required: true
        type: string
      framework_type:
        description: 'Type of framework (next, nest, react)'
        required: false
        type: string
        default: 'next'
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
      # FORCE_COLOR: 1
      # NODE_ENV: production
      GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

    steps:
      - name: 🔍 inputs
        id: check_inputs
        run: |
          echo "Debugowanie inputów workflow:"
          echo "release_type_detected: ${{ inputs.release_type_detected }}"
          echo "release_branch: ${{ inputs.release_branch }}"
          echo "install_args: ${{ inputs.install_args }}"
          echo "node_version: ${{ inputs.node_version }}"
          echo "install_deps: ${{ inputs.install_deps }}"
          echo "framework_type: ${{ inputs.framework_type }}"

          echo "Parsed cache keys:"
          echo "deps_key: ${{ fromJSON(inputs.cache_keys).deps_key }}"
          echo "nextBuild_key: ${{ fromJSON(inputs.cache_keys).nextBuild_key }}"

          echo "Secrets status:"
          echo "GH_TOKEN: ${{ secrets.GH_TOKEN != '' }}"
          echo "GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN != '' }}"
          echo "NPM_TOKEN: ${{ secrets.NPM_TOKEN != '' }}"

          echo "Env status:"
          echo "GH_TOKEN: ${{ env.GH_TOKEN != '' }}"
          echo "GITHUB_TOKEN: ${{ env.GITHUB_TOKEN != '' }}"
          echo "NPM_TOKEN: ${{ env.NPM_TOKEN != '' }}"

          # Informacja o logice release'u
          echo "reason=Release controlled by .releaserc.js configuration" >> $GITHUB_OUTPUT

      - name: 🔬 Debug variables
        id: debug
        run: |
          echo "=== 🔬 Szczegółowe debugowanie wszystkich zmiennych 🔬 ==="

          echo "=== 📋 Inputs dokładnie ==="
          echo "release_type_detected: '${{ inputs.release_type_detected }}'"

          echo "=== 🔄 GitHub Context ==="
          echo "github.ref: '${{ github.ref }}'"
          echo "github.ref_name: '${{ github.ref_name }}'"
          echo "github.event_name: '${{ github.event_name }}'"
          echo "github.workflow: '${{ github.workflow }}'"

          if [[ "${{ github.event_name }}" == "pull_request" ]]; then
            echo "github.base_ref: '${{ github.base_ref }}'"
            echo "github.head_ref: '${{ github.head_ref }}'"
          fi

          echo "=== 🏷️ Calculated Variables ==="
          echo "REASON: '${{ steps.check_inputs.outputs.reason }}'"

          echo "=== 💾 Cache Keys JSON ==="
          echo "${{ inputs.cache_keys }}"

          echo "=== 🔍 Runner Environment ==="
          echo "RUNNER_OS: $RUNNER_OS"
          echo "RUNNER_ARCH: $RUNNER_ARCH"
          echo "RUNNER_NAME: $RUNNER_NAME"

          echo "=== 📌 Additional Info ==="
          echo "Node.js: $(node -v)"
          echo "NPM: $(npm -v)"
          echo "Yarn: $(yarn -v)"

          # Zapisz podsumowanie do GitHub Step Summary
          {
            echo "### 🔬 Debug Variables Summary"
            echo ""
            echo "#### Release Configuration"
            echo "| Variable | Value | Type |"
            echo "| --- | --- | --- |"
            echo "| release_type_detected | ${{ inputs.release_type_detected }} | string |"
            echo ""
            echo "#### Context Information"
            echo "| Variable | Value |"
            echo "| --- | --- |"
            echo "| github.ref | ${{ github.ref }} |"
            echo "| github.ref_name | ${{ github.ref_name }} |"
            echo "| github.event_name | ${{ github.event_name }} |"
            echo "| github.workflow | ${{ github.workflow }} |"
            echo ""
            echo "#### Decision Logic"
            echo "| Variable | Value |"
            echo "| --- | --- |"
            echo "| REASON | ${{ steps.check_inputs.outputs.reason }} |"
          } >> $GITHUB_STEP_SUMMARY

      - name: 🔍 Check tokens
        id: check_tokens
        run: |
          if [[ -n "$GH_TOKEN" ]]; then
            echo "Using GH_TOKEN"
            echo "token=$GH_TOKEN" >> $GITHUB_OUTPUT
          else
            echo "Using GITHUB_TOKEN"
            echo "token=$GITHUB_TOKEN" >> $GITHUB_OUTPUT
          fi

          if [[ -n "$NPM_TOKEN" ]]; then
            echo "NPM_TOKEN dostępny"
            echo "npm_token=true" >> $GITHUB_OUTPUT
          else
            echo "NPM_TOKEN niedostępny"
            echo "npm_token=false" >> $GITHUB_OUTPUT
          fi

      - name: 📝 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          token: ${{ steps.check_tokens.outputs.token }}
          ref: ${{ inputs.release_branch }}

      - name: ⚡ Cache dependencies
        uses: actions/cache@v4
        with:
          path: ${{ github.workspace }}/node_modules/
          key: ${{ fromJSON(inputs.cache_keys).deps_key }}
          restore-keys: |
            ${{ fromJSON(inputs.cache_keys).deps_key }}

      - name: ⚡ Cache NextBuild
        if: inputs.framework_type == 'next'
        uses: actions/cache@v4
        id: next-cache
        continue-on-error: true
        with:
          path: |
            ${{ github.workspace }}/.next/
            ${{ github.workspace }}/out/
          key: ${{ fromJSON(inputs.cache_keys).nextBuild_key }}
          restore-keys: |
            ${{ fromJSON(inputs.cache_keys).nextBuild_key }}

      - name: ⚡ Cache nestBuild
        if: inputs.framework_type == 'nest'
        uses: actions/cache@v4
        id: nest-cache
        continue-on-error: true
        with:
          path: |
            ${{ github.workspace }}/next.config.js
            ${{ github.workspace }}/dist/
          key: ${{ fromJSON(inputs.cache_keys).nestBuild_key }}
          restore-keys: |
            ${{ fromJSON(inputs.cache_keys).nestBuild_key }}

      - name: 🟢 Setup Node.js ${{ inputs.node_version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node_version }}

      - name: 📦 Install dependencies
        if: inputs.install_deps == 'true'
        run: |
          yarn config set network-timeout 300000
          yarn install ${{ inputs.install_args }} --prefer-offline --no-scripts

      - name: 🔍 Sprawdź status cache
        id: check-cache
        run: |
          if [[ "${{ inputs.framework_type }}" == "next" && "${{ steps.next-cache.outputs.cache-hit }}" == "true" ]]; then
            echo "cache_hit=true" >> $GITHUB_OUTPUT
            echo "✅ Znaleziono cache dla Next.js, budowanie zostanie pominięte"
          elif [[ "${{ inputs.framework_type }}" == "nest" && "${{ steps.nest-cache.outputs.cache-hit }}" == "true" ]]; then
            echo "cache_hit=true" >> $GITHUB_OUTPUT
            echo "✅ Znaleziono cache dla Nest.js, budowanie zostanie pominięte"
          else
            echo "cache_hit=false" >> $GITHUB_OUTPUT
            echo "⚠️ Nie znaleziono cache, aplikacja zostanie zbudowana"
          fi

      - name: '🔍 Check next release version'
        id: next-version
        run: |
          NEXT_VERSION=$(npx semantic-release --dry-run | grep "next release version is" -i | sed 's/.*is //')
          echo "Next version will be: $NEXT_VERSION"
          echo "version=$NEXT_VERSION" >> $GITHUB_OUTPUT

      - name: '🗑️ Clean specific tag if exists'
        if: steps.next-version.outputs.version != ''
        run: |
          echo "Checking for tag v${{ steps.next-version.outputs.version }}"
          if git rev-parse "v${{ steps.next-version.outputs.version }}" >/dev/null 2>&1; then
            echo "Cleaning tag v${{ steps.next-version.outputs.version }}"
            git tag -d "v${{ steps.next-version.outputs.version }}" 2>/dev/null || true
            git push origin ":refs/tags/v${{ steps.next-version.outputs.version }}" 2>/dev/null || true
          else
            echo "Tag v${{ steps.next-version.outputs.version }} doesn't exist, skipping cleanup"
          fi

      - name: 🏗️ Build project
        if: steps.check-cache.outputs.cache_hit != 'true'
        run: yarn build:package

      - name: 🚀 Release
        run: |
          # Sprawdź dostępność NPM_TOKEN
          if [[ -n "$NPM_TOKEN" ]]; then
            echo "Publishing to NPM and GitHub..."
          else
            echo "Publishing to GitHub only..."
          fi

          # Export branch name for semantic-release
          export GITHUB_REF_NAME="${{ inputs.release_branch }}"
          echo "Using branch: $GITHUB_REF_NAME"

          # Export PR-related environment variables if available
          if [[ "${{ github.event_name }}" == "pull_request" ]]; then
            export GITHUB_EVENT_NAME="pull_request"
            export GITHUB_BASE_REF="${{ github.base_ref }}"
            export GITHUB_HEAD_REF="${{ github.head_ref }}"
            echo "Pull request: $GITHUB_HEAD_REF -> $GITHUB_BASE_REF"
          fi

          # Wybierz typ release'u
          case "${{ inputs.release_type_detected }}" in
            "feature")
              echo "Using feature release type"
              # Wyciągnij nazwę funkcji z nazwy gałęzi
              FEATURE_NAME=$(echo "${{ inputs.release_branch }}" | sed -E 's/feature\///')
              echo "Feature name: ${FEATURE_NAME}"
              npx semantic-release
              ;;
            "preprod")
              echo "Using pre-production release type (preprod)"
              npx semantic-release --prerelease preprod
              ;;
            "prerelease")
              echo "Using pre-release type (beta)"
              npx semantic-release --prerelease beta
              ;;
            "rc")
              echo "Using release candidate type (rc)"
              npx semantic-release --prerelease rc
              ;;
            "production")
              echo "Using production release type"
              npx semantic-release
              ;;
            *)
              # Check if it's a PR to main/master
              if [[ "${{ github.event_name }}" == "pull_request" && ("${{ github.base_ref }}" == "main" || "${{ github.base_ref }}" == "master") ]]; then
                echo "Detected PR to main/master, using RC release type"
                npx semantic-release --prerelease rc
              else
                echo "Using default release type"
                npx semantic-release
              fi
              ;;
          esac

      - name: 📋 Post Release Status
        if: always()
        run: |
          # Ustawienie trybu na rzeczywisty release
          MODE="(ACTUAL RELEASE)"
          EXEC_STATUS="✅ Release wykonany"

          # Określ status budowy
          if [[ "${{ steps.check-cache.outputs.cache_hit }}" == "true" ]]; then
            BUILD_STATUS="🚀 Budowanie pominięte - użyto cache"
            BUILD_DETAILS="[Cache] Użyto zapisanej wersji dla ${{ inputs.framework_type }}"
          else
            BUILD_STATUS="🏗️ Budowanie wykonane"
            BUILD_DETAILS="[Build] Wykonano pełny proces budowania"
          fi

          echo "### Release Status Summary 📊" >> $GITHUB_STEP_SUMMARY
          echo "" >> $GITHUB_STEP_SUMMARY
          echo "- **Type:** ${{ inputs.release_type_detected }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Mode:** ${MODE}" >> $GITHUB_STEP_SUMMARY
          echo "- **Status:** ${EXEC_STATUS}" >> $GITHUB_STEP_SUMMARY
          echo "- **Branch:** ${{ inputs.release_branch }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Node version:** ${{ inputs.node_version }}" >> $GITHUB_STEP_SUMMARY
          echo "- **Build:** ${BUILD_STATUS}" >> $GITHUB_STEP_SUMMARY
          echo "- **Build details:** ${BUILD_DETAILS}" >> $GITHUB_STEP_SUMMARY
          echo "- **Cache używane:** ${{ steps.check-cache.outputs.cache_hit == 'true' }}" >> $GITHUB_STEP_SUMMARY

          if [ "${{ job.status }}" == "success" ]; then
            echo "- **Result:** ✅ Success" >> $GITHUB_STEP_SUMMARY
            if [[ "${{ steps.next-version.outputs.version }}" != "" ]]; then
              echo "- **Version:** v${{ steps.next-version.outputs.version }}" >> $GITHUB_STEP_SUMMARY
            fi

            # Dodatkowe informacje o typie wydania
            case "${{ inputs.release_type_detected }}" in
              "feature")
                FEATURE_NAME=$(echo "${{ inputs.release_branch }}" | sed -E 's/feature\///')
                echo "- **Tag suffix:** feat-${FEATURE_NAME}" >> $GITHUB_STEP_SUMMARY
                ;;
              "preprod")
                echo "- **Tag suffix:** preprod" >> $GITHUB_STEP_SUMMARY
                ;;
              "prerelease")
                echo "- **Tag suffix:** beta" >> $GITHUB_STEP_SUMMARY
                ;;
            esac
          else
            echo "- **Result:** ❌ Failed" >> $GITHUB_STEP_SUMMARY
            echo "- **Details:** Please check the logs for more information" >> $GITHUB_STEP_SUMMARY
          fi

          # Dodaj informacje o NPM
          if [[ -n "$NPM_TOKEN" ]]; then
            echo "- **Publishing to:** GitHub + NPM" >> $GITHUB_STEP_SUMMARY
          else
            echo "- **Publishing to:** GitHub only" >> $GITHUB_STEP_SUMMARY
          fi
