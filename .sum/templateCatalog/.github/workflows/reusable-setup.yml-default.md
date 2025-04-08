name: Setup Environment

on:
  workflow_call:
    inputs:
      install_args:
        description: 'Arguments for yarn install command'
        required: false
        type: string
        default: '--frozen-lockfile'
      setup_playwright:
        description: 'Whether to install Playwright'
        required: false
        type: boolean
        default: false
      node_version:
        description: 'Node.js version to use'
        required: true
        type: string
    outputs:
      node_version:
        description: 'The Node.js version being used'
        value: ${{ jobs.setup.outputs.node_version }}
      cache_keys:
        description: 'The cache keys configuration'
        value: ${{ jobs.setup.outputs.cache_keys }}
      install_playwright:
        description: 'Whether Playwright was installed'
        value: ${{ jobs.setup.outputs.install_playwright }}
      install_deps:
        description: 'Whether dependencies were installed'
        value: ${{ jobs.setup.outputs.install_deps }}
      setup_summary:
        description: 'Summary of setup information'
        value: ${{ jobs.setup.outputs.setup_summary }}
      release_type_detected:
        description: 'Detected release type'
        value: ${{ jobs.setup.outputs.release_type_detected }}
      framework_type:
        description: 'Detected framework type'
        value: ${{ jobs.setup.outputs.framework_type }}

jobs:
  setup:
    name: Setup Environment
    runs-on: ubuntu-latest
    outputs:
      node_version: ${{ steps.extract-node-version.outputs.node_version }}
      cache_keys: ${{ steps.cache-deps.outputs.cache_keys }}
      install_playwright: ${{ steps.check-installations.outputs.install_playwright }}
      install_deps: ${{ steps.check-installations.outputs.install_deps }}
      setup_summary: ${{ steps.summary.outputs.setup_summary }}
      release_type_detected: ${{ steps.detect-release-type.outputs.release_type_detected }}
      framework_type: ${{ steps.check-deps.outputs.framework_type }}

    steps:
      - name: 📝 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: 🔑 Generate cache keys
        id: cache-deps
        run: |
          CACHE_CONFIG='{
            "deps": {
              "files": ["yarn.lock", "package.json"],
              "prefix": "deps"
            },
            "lint": {
              "files": [".eslintrc*", ".stylelintrc*", "tsconfig*.json"],
              "prefix": "lint"
            },
            "nextBuild": {
              "files": ["next.config.js", "package.json", ".next"],
              "prefix": "nextBuild"
            },
            "nestBuild": {
              "files": ["nest-cli.json", "package.json", "dist"],
              "prefix": "nestBuild"
            },
            "test": {
              "files": ["playwright.config.*", ".storybook/*", "package.json"],
              "prefix": "test"
            }
          }'

          CACHE_KEYS="{}"
          for type in $(echo "$CACHE_CONFIG" | jq -r 'keys[]'); do
            files=$(echo "$CACHE_CONFIG" | jq -r --arg type "$type" '.[$type].files[]' | tr '\n' ' ')
            prefix=$(echo "$CACHE_CONFIG" | jq -r --arg type "$type" '.[$type].prefix')
            HASH=$(sha256sum $files 2>/dev/null | awk '{print $1}' | head -n1 | base64 -w 0)
            KEY="${RUNNER_OS}-${prefix}-${HASH}"
            CACHE_KEYS=$(echo $CACHE_KEYS | jq --arg type "${type}_key" --arg key "$KEY" '. + {($type): $key}')
          done

          echo "cache_keys=$(echo $CACHE_KEYS | jq -c .)" >> $GITHUB_OUTPUT

      - name: ⚡ Check framework type
        id: check-deps
        run: |
          FRAMEWORK_TYPE=""

          # Wypisanie wszystkich plików w bieżącym katalogu
          echo "📂 Lista plików w katalogu:"
          ls -la

          echo "🔍 Sprawdzanie czy package.json istnieje..."
          if [ -f "package.json" ]; then
            echo "✅ Plik package.json znaleziony"
            echo "📄 Zawartość package.json:"
            cat package.json | grep -E "next|@nestjs|react"

            # Sprawdzanie Next.js
            if grep -qE '"next"|"next":' package.json || grep -qE "'next'|'next':" package.json; then
              FRAMEWORK_TYPE="next"
            # Sprawdzanie NestJS
            elif grep -qE '"@nestjs/core"|"@nestjs/core":' package.json || grep -qE "'@nestjs/core'|'@nestjs/core':" package.json; then
              FRAMEWORK_TYPE="nest"
            # Sprawdzanie React (bez Next.js)
            elif (grep -qE '"react"|"react":' package.json || grep -qE "'react'|'react':" package.json) && ! (grep -qE '"next"|"next":' package.json || grep -qE "'next'|'next':" package.json); then
              FRAMEWORK_TYPE="react"
            fi

            echo "🔍 Wykryty framework: ${FRAMEWORK_TYPE}"
            echo "framework_type=${FRAMEWORK_TYPE}" >> $GITHUB_OUTPUT
            echo "FRAMEWORK_TYPE=${FRAMEWORK_TYPE}" >> $GITHUB_ENV
          else
            echo "❌ Plik package.json nie został znaleziony"
            exit 1
          fi

      - name: ⚡ Cache lint
        uses: actions/cache@v4
        continue-on-error: true
        with:
          path: |
            ${{ github.workspace }}/.stylelintcache
            ${{ github.workspace }}/.eslintcache/
            ${{ github.workspace }}/tsconfig.tsbuildinfo
          key: ${{ fromJSON(steps.cache-deps.outputs.cache_keys).lint_key }}
          restore-keys: ''
          lookup-only: true

      - name: ⚡ Cache NextBuild
        if: steps.check-deps.outputs.framework_type == 'next'
        uses: actions/cache@v4
        continue-on-error: true
        with:
          path: |
            ${{ github.workspace }}/.next/
            ${{ github.workspace }}/out/
          key: ${{ fromJSON(steps.cache-deps.outputs.cache_keys).nextBuild_key }}
          restore-keys: ''
          lookup-only: true

      - name: ⚡ Cache nestBuild
        if: steps.check-deps.outputs.framework_type == 'nest'
        uses: actions/cache@v4
        continue-on-error: true
        with:
          path: |
            ${{ github.workspace }}/next.config.js
            ${{ github.workspace }}/dist/
          key: ${{ fromJSON(steps.cache-deps.outputs.cache_keys).nestBuild_key }}
          restore-keys: ''
          lookup-only: true

      - name: ⚡ Cache test

        id: playwright-cache
        uses: actions/cache@v4
        continue-on-error: true
        with:
          path: |
            ~/.cache/ms-playwright
            ${{ github.workspace }}/storybook-static/
          key: ${{ fromJSON(steps.cache-deps.outputs.cache_keys).test_key }}
          restore-keys: ''
          lookup-only: true

      - name: ⚡ Cache dependencies
        id: deps-cache
        uses: actions/cache@v4
        continue-on-error: true
        with:
          path: |
            ${{ github.workspace }}/node_modules/
          key: ${{ fromJSON(steps.cache-deps.outputs.cache_keys).deps_key }}
          restore-keys: ''
          lookup-only: true

      - name: 📦 Instalacja zależności
        if: steps.deps-cache.outputs.cache-hit != 'true'
        run: |
          echo "🔍 Instalacja dependencies i devDependencies..."
          yarn install ${{ inputs.install_args }}

      - name: 💾 Zapisywanie cache
        if: steps.deps-cache.outputs.cache-hit != 'true'
        uses: actions/cache/save@v4
        with:
          path: |
            ${{ github.workspace }}/node_modules/
          key: ${{ fromJSON(steps.cache-deps.outputs.cache_keys).deps_key }}

      - name: 📥 Read .nvmrc
        id: extract-node-version
        run: |
          NODE_VERSION="${{ inputs.node_version }}"
          if [ -f ".nvmrc" ]; then
            NODE_VERSION=$(cat .nvmrc)
          fi
          echo "node_version=${NODE_VERSION}" >> $GITHUB_OUTPUT
          echo "NODE_VERSION=${NODE_VERSION}" >> $GITHUB_ENV

      - name: 🔍 Check installation requirements
        id: check-installations
        run: |
          INSTALL_PLAYWRIGHT="false"
          if [[ "${{ inputs.setup_playwright }}" == "true" ]] && \
             [[ "${{ steps.playwright-cache.outputs.cache-hit }}" != "true" ]]; then
            INSTALL_PLAYWRIGHT="true"
          fi
          echo "install_playwright=${INSTALL_PLAYWRIGHT}" >> $GITHUB_OUTPUT

          INSTALL_DEPS="false"
          if [[ "${{ steps.deps-cache.outputs.cache-hit }}" != "true" ]]; then
            INSTALL_DEPS="true"
          fi
          echo "install_deps=${INSTALL_DEPS}" >> $GITHUB_OUTPUT

      - name: 🔍 Wykrywanie typu wydania
        id: detect-release-type
        run: |
          DETECTED_TYPE="unknown"

          if [[ "${{ github.event_name }}" == "pull_request" ]]; then
            # Logika dla pull requestów
            if [[ "${{ github.base_ref }}" == "main" || "${{ github.base_ref }}" == "master" ]]; then
              DETECTED_TYPE="preprod"
            elif [[ "${{ github.base_ref }}" == "develop" || "${{ github.base_ref }}" == "dev" ]]; then
              DETECTED_TYPE="alpha"
            fi
          else
            # Logika dla merge'ów
            if [[ "${{ github.ref }}" == *"main"* || "${{ github.ref }}" == *"master"* ]]; then
              DETECTED_TYPE="production"
            elif [[ "${{ github.ref }}" == *"develop"* || "${{ github.ref }}" == *"dev"* ]]; then
              DETECTED_TYPE="beta"
            elif [[ "${{ github.ref }}" == *"feature/"* ]]; then
              DETECTED_TYPE="feature"
            fi
          fi

          # Ustawienie domyślnej wartości jeśli nie wykryto typu
          if [[ "$DETECTED_TYPE" == "unknown" ]]; then
            DETECTED_TYPE="feature"
          fi

          echo "release_type_detected=$DETECTED_TYPE" >> $GITHUB_OUTPUT
          echo "RELEASE_TYPE_DETECTED=$DETECTED_TYPE" >> $GITHUB_ENV

      - name: 📝 Summary
        id: summary
        run: |
          # Przygotowanie podsumowania
          setup_summary=$(jq -n \
            --arg title "### Konfiguracja środowiska 🛠️" \
            --arg node "$NODE_VERSION" \
            --arg deps "${{ steps.check-installations.outputs.install_deps }}" \
            --arg framework_type "${{ steps.check-deps.outputs.framework_type }}" \
            --arg release_type_detected "$RELEASE_TYPE_DETECTED" \
            --arg playwright "${{ steps.check-installations.outputs.install_playwright }}" \
            --argjson cache '${{ steps.cache-deps.outputs.cache_keys }}' \
            --arg time "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            '{
              markdown: {
                title: $title,
                details: [
                  "🔧 Wersja Node.js: " + $node,
                  "📦 Instalacja zależności: " + $deps,
                  "🎭 Instalacja Playwright: " + $playwright,
                  "📌 Typ wydania: " + $release_type_detected,
                  "📦 Typ framework: " + $framework_type,
                  "🔍 Wykryty typ framework: " + $framework_type
                ],
                cache_section: {
                  title: "#### 🔑 Klucze cache:",
                  content: ($cache | tojson)
                }
              },
              data: {
                node_version: $node,
                install_deps: ($deps == "true"),
                install_playwright: ($playwright == "true"),
                release_type_detected: $release_type_detected,
                cache_keys: $cache,
                timestamp: $time
              }
            }')

          # Zapisanie podsumowania do GitHub Step Summary
          {
            echo "$setup_summary" | jq -r '.markdown.title'
            echo ""
            echo "$setup_summary" | jq -r '.markdown.details[]'
            echo ""
            echo "$setup_summary" | jq -r '.markdown.cache_section.title'
            echo '```json'
            echo "$setup_summary" | jq -r '.markdown.cache_section.content | fromjson | tojson'
            echo '```'
          } >> $GITHUB_STEP_SUMMARY

          # Export danych do outputs
          echo "setup_summary=$(echo "$setup_summary" | jq -c '.')" >> $GITHUB_OUTPUT
