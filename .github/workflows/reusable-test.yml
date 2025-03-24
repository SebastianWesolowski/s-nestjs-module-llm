name: Test

on:
  workflow_call:
    inputs:
      cache_keys:
        description: 'The cache key suffix'
        required: false
        type: string
        default: ''
      e2e_tests:
        description: 'Whether to run E2E tests'
        required: false
        type: boolean
        default: false
      install_args:
        description: 'Arguments for yarn install command'
        required: false
        type: string
        default: '--frozen-lockfile'
      install_deps:
        description: 'Whether dependencies were installed'
        required: false
        type: string
        default: false
      install_playwright:
        description: 'Whether to install Playwright browsers'
        required: false
        type: string
        default: false
      node_version:
        description: 'Node.js version to use'
        required: true
        type: string
      smoke_tests:
        description: 'Whether to run smoke tests'
        required: false
        type: boolean
        default: false
      storybook_build:
        description: 'Whether to build Storybook'
        required: false
        type: boolean
        default: false
      test_matrix:
        description: 'JSON string for test matrix configuration'
        required: false
        type: string
        default: '{"browser": ["chromium"]}'
      unit_tests:
        description: 'Whether to run unit tests'
        required: false
        type: boolean
        default: true
      upload_artifacts:
        description: 'Whether to upload test artifacts'
        required: false
        type: boolean
        default: true
    outputs:
      test_summary:
        description: 'Summary of test results'
        value: ${{ jobs.test.outputs.test_summary }}

jobs:
  test:
    name: Run Tests
    runs-on: ubuntu-latest
    timeout-minutes: 30
    strategy:
      fail-fast: false
      matrix: ${{ fromJSON(inputs.test_matrix) }}
    outputs:
      test_summary: ${{ steps.summary.outputs.test_summary }}

    steps:
      - name: 🔍 inputs
        run: |
          echo "Debugowanie inputów workflow:"
          echo "cache_keys: ${{ inputs.cache_keys }}"
          echo "e2e_tests: ${{ inputs.e2e_tests }}"
          echo "install_args: ${{ inputs.install_args }}"
          echo "install_deps: ${{ inputs.install_deps }}"
          echo "install_playwright: ${{ inputs.install_playwright }}"
          echo "node_version: ${{ inputs.node_version }}"
          echo "smoke_tests: ${{ inputs.smoke_tests }}"
          echo "storybook_build: ${{ inputs.storybook_build }}"
          echo "test_matrix: ${{ inputs.test_matrix }}"
          echo "unit_tests: ${{ inputs.unit_tests }}"
          echo "upload_artifacts: ${{ inputs.upload_artifacts }}"

          echo "Parsed cache keys:"
          echo "test_key: ${{ fromJSON(inputs.cache_keys).test_key }}"
          echo "deps_key: ${{ fromJSON(inputs.cache_keys).deps_key }}"

      - name: 📝 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: ⚡ Cache dependencies
        uses: actions/cache@v4
        with:
          path: |
            ${{ github.workspace }}/node_modules/
          key: ${{ fromJSON(inputs.cache_keys).deps_key }}
          restore-keys: |
            ${{ fromJSON(inputs.cache_keys).deps_key }}

      - name: ⚡ Cache test
        uses: actions/cache@v4
        with:
          path: |
            ~/.cache/ms-playwright
            ${{ github.workspace }}/storybook-static/
          key: ${{ fromJSON(inputs.cache_keys).test_key }}
          restore-keys: |
            ${{ fromJSON(inputs.cache_keys).test_key }}

      - name: 🟢 Setup Node.js ${{ inputs.node_version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node_version }}

      - name: 🔍 Check installation requirements
        id: check-storybook-build
        run: |
          INSTALL_STORYBOOK="false"
          if [[ "${{ inputs.storybook_build }}" == "true" ]]; then
            if [[ ! -d "${{ github.workspace }}/storybook-static" ]]; then
              INSTALL_STORYBOOK="true"
            fi
          fi
          echo "install_storybook=${INSTALL_STORYBOOK}" >> $GITHUB_OUTPUT

      - name: 📦 Install dependencies
        if: inputs.install_deps == 'true'
        run: |
          yarn config set network-timeout 300000
          yarn install ${{ inputs.install_args }} --prefer-offline --no-scripts

      - name: 🎭 Install Playwright (if needed)
        if: inputs.install_playwright == 'true' && ${{ inputs.e2e_tests || inputs.smoke_tests }}
        run: yarn playwright:install

      - name: 🧪 Run unit tests
        if: ${{ inputs.unit_tests }}
        run: yarn test:unit
        env:
          CI: true
          FORCE_COLOR: 1

      - name: 📚 Build Storybook
        if: steps.check-storybook-build.outputs.install_storybook == 'true'
        run: yarn storybook:build

      - name: 🔥 Run smoke tests
        if: ${{ inputs.smoke_tests }} && ${{ inputs.storybook_build }}
        run: |
          yarn test:smoke:ci
        env:
          FORCE_COLOR: 1

      - name: 🤖 Run E2E tests
        if: ${{ inputs.e2e_tests }}
        run: yarn test:e2e
        env:
          PLAYWRIGHT_BROWSER: ${{ matrix.browser || 'chromium' }}
          FORCE_COLOR: 1

      - name: 📊 Upload test reports
        if: ${{ failure() || inputs.upload_artifacts }}
        uses: actions/upload-artifact@v4
        with:
          name: test-reports-${{ matrix.browser || 'chromium' }}
          path: |
            ${{ inputs.storybook_build && 'storybook-static/' || '' }}
            playwright-report/
            reports/coverage/
          retention-days: 14

      - name: 📝 Summary
        id: summary
        run: |
          # Przygotowanie podsumowania
          test_summary=$(jq -n \
            --arg title "### Wyniki testów 📊" \
            --arg subtitle "Wykonane testy:" \
            --arg node "${{ inputs.node_version }}" \
            --arg browser "${PLAYWRIGHT_BROWSER:-chromium}" \
            --arg time "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            --argjson details "$(printf '%s\n' "${DETAILS[@]}" | jq -R . | jq -s .)" \
            '{
              markdown: {
                title: $title,
                subtitle: $subtitle,
                details: $details
              },
              data: {
                unit_tests: ${{ inputs.unit_tests }},
                smoke_tests: ${{ inputs.smoke_tests }},
                e2e_tests: ${{ inputs.e2e_tests }},
                storybook_built: ${{ inputs.storybook_build }},
                browser: $browser,
                node_version: $node,
                timestamp: $time
              }
            }')

          # Zapisanie podsumowania do GitHub Step Summary
          {
            echo "$test_summary" | jq -r '.markdown.title'
            echo ""
            echo "$test_summary" | jq -r '.markdown.subtitle'
            echo "$test_summary" | jq -r '.markdown.details[]'
          } >> $GITHUB_STEP_SUMMARY

          # Export danych do outputs
          echo "test_summary=$(echo "$test_summary" | jq -c '.')" >> $GITHUB_OUTPUT
