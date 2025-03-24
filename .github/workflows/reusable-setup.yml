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
            "build": {
              "files": ["next.config.js", "package.json", ".next"],
              "prefix": "build"
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

      - name: ⚡ Cache build
        uses: actions/cache@v4
        continue-on-error: true
        with:
          path: |
            ${{ github.workspace }}/.next/
            ${{ github.workspace }}/out/
          key: ${{ fromJSON(steps.cache-deps.outputs.cache_keys).build_key }}
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

      - name: 📝 Summary
        id: summary
        run: |
          # Przygotowanie podsumowania
          setup_summary=$(jq -n \
            --arg title "### Konfiguracja środowiska 🛠️" \
            --arg node "$NODE_VERSION" \
            --arg deps "${{ steps.check-installations.outputs.install_deps }}" \
            --arg playwright "${{ steps.check-installations.outputs.install_playwright }}" \
            --argjson cache '${{ steps.cache-deps.outputs.cache_keys }}' \
            --arg time "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            '{
              markdown: {
                title: $title,
                details: [
                  "🔧 Wersja Node.js: " + $node,
                  "📦 Instalacja zależności: " + $deps,
                  "🎭 Instalacja Playwright: " + $playwright
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
