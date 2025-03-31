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
      release_type_detected:
        description: 'Type of release detected (production, preprod, prerelease, feature)'
        required: false
        type: string
        default: 'prerelease'
      framework_type:
        description: 'Type of framework detected (next, nest, react)'
        required: false
        type: string
        default: 'next'
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
        id: check_inputs
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
          echo "release_type_detected: ${{ inputs.release_type_detected }}"
          echo "framework_type: ${{ inputs.framework_type }}"

          echo "Parsed cache keys:"
          echo "test_key: ${{ fromJSON(inputs.cache_keys).test_key }}"
          echo "deps_key: ${{ fromJSON(inputs.cache_keys).deps_key }}"

          # Ustawienie zmiennych, które będą używane w krokach warunkowych
          echo "run_unit_tests=${{ inputs.unit_tests }}" >> $GITHUB_OUTPUT
          echo "run_e2e_tests=${{ inputs.e2e_tests }}" >> $GITHUB_OUTPUT
          echo "run_smoke_tests=${{ inputs.smoke_tests }}" >> $GITHUB_OUTPUT
          echo "build_storybook=${{ inputs.storybook_build }}" >> $GITHUB_OUTPUT

          # Określenie, czy w ogóle uruchamiamy testy
          RUN_TEST="false"
          if [[ "${{ inputs.unit_tests }}" == "true" || "${{ inputs.e2e_tests }}" == "true" || "${{ inputs.smoke_tests }}" == "true" ]]; then
            RUN_TEST="true"
          fi
          echo "run_test=${RUN_TEST}" >> $GITHUB_OUTPUT

          # Jeśli nie uruchamiamy testów, podajemy powód
          REASON=""
          if [[ "${RUN_TEST}" == "false" ]]; then
            REASON="No tests enabled in workflow configuration"
          fi
          echo "reason=${REASON}" >> $GITHUB_OUTPUT

      - name: 📝 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: ⚡ Cache test
        uses: actions/cache@v4
        with:
          path: |
            ~/.cache/ms-playwright
            ${{ github.workspace }}/storybook-static/
          key: ${{ fromJSON(inputs.cache_keys).test_key }}
          restore-keys: |
            ${{ fromJSON(inputs.cache_keys).test_key }}

      - name: ⚡ Cache dependencies
        uses: actions/cache@v4
        with:
          path: |
            ${{ github.workspace }}/node_modules/
          key: ${{ fromJSON(inputs.cache_keys).deps_key }}
          restore-keys: |
            ${{ fromJSON(inputs.cache_keys).deps_key }}

      - name: 🟢 Setup Node.js ${{ inputs.node_version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node_version }}

      - name: 📦 Install dependencies
        if: inputs.install_deps == 'true'
        run: |
          yarn config set network-timeout 300000
          yarn install ${{ inputs.install_args }} --prefer-offline --no-scripts

      - name: 🎭 Install Playwright browsers
        if: inputs.install_playwright == 'true' && (steps.check_inputs.outputs.run_e2e_tests == 'true' || steps.check_inputs.outputs.run_smoke_tests == 'true')
        run: npx playwright install --with-deps

      - name: 🧪 Unit tests
        if: steps.check_inputs.outputs.run_unit_tests == 'true'
        run: yarn test:unit

      - name: 🧪 E2E tests
        if: steps.check_inputs.outputs.run_e2e_tests == 'true'
        run: yarn test:e2e

      - name: 🧪 Smoke tests
        if: steps.check_inputs.outputs.run_smoke_tests == 'true'
        run: yarn test:smoke

      - name: 📚 Build Storybook
        if: steps.check_inputs.outputs.build_storybook == 'true'
        run: yarn build:storybook

      - name: 📊 Upload test results
        if: always() && (failure() || inputs.upload_artifacts == true)
        uses: actions/upload-artifact@v4
        with:
          name: test-results-${{ matrix.browser || 'all' }}
          path: |
            test-results/
            reports/tests/
            storybook-static/
            coverage/
            .yarn-error.log
            yarn-debug.log
            npm-debug.log
          retention-days: 7
          if-no-files-found: ignore

      - name: 📝 Summary
        id: summary
        run: |
          DETAILS=()
          if [[ "${{ steps.check_inputs.outputs.run_test }}" == "true" ]]; then
            # Wszystkie włączone testy
            [[ "${{ steps.check_inputs.outputs.run_unit_tests }}" == "true" ]] && DETAILS+=("- Unit tests")
            [[ "${{ steps.check_inputs.outputs.run_e2e_tests }}" == "true" ]] && DETAILS+=("- E2E tests")
            [[ "${{ steps.check_inputs.outputs.run_smoke_tests }}" == "true" ]] && DETAILS+=("- Smoke tests")
            [[ "${{ steps.check_inputs.outputs.build_storybook }}" == "true" ]] && DETAILS+=("- Storybook build")
          else
            # Jeśli pomijamy testy
            DETAILS+=("- Test execution skipped: ${{ steps.check_inputs.outputs.reason }}")
          fi

          # Przygotowanie podsumowania
          test_summary=$(jq -n \
            --arg title "### Wyniki testowania 🧪" \
            --arg subtitle "✅ Wykonane testy:" \
            --arg node "${{ inputs.node_version }}" \
            --arg matrix "${{ matrix.browser || 'none' }}" \
            --arg time "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            --arg run_test "${{ steps.check_inputs.outputs.run_test }}" \
            --arg reason "${{ steps.check_inputs.outputs.reason }}" \
            --arg release_type_detected "${{ inputs.release_type_detected }}" \
            --arg framework_type "${{ inputs.framework_type }}" \
            --argjson details "$(printf '%s\n' "${DETAILS[@]}" | jq -R . | jq -s .)" \
            '{
              markdown: {
                title: $title,
                subtitle: $subtitle,
                details: $details,
                run_status: (if $run_test == "true" then "✅ Wykonano testy" else "⏭️ Pominięto testy: " + $reason end)
              },
              data: {
                executed_tests: ($details | map(sub("- "; "")) | join(",")),
                browser: $matrix,
                node_version: $node,
                timestamp: $time,
                run_test: ($run_test == "true"),
                release_type_detected: $release_type_detected,
                framework_type: $framework_type,
                reason: $reason
              }
            }')

          # Zapisanie podsumowania do GitHub Step Summary
          {
            echo "$test_summary" | jq -r '.markdown.title'
            echo ""
            echo "$test_summary" | jq -r '.markdown.subtitle'
            echo "$test_summary" | jq -r '.markdown.details[]'
            echo ""
            echo "$test_summary" | jq -r '.markdown.run_status'
            echo ""
            echo "**Release type:** ${{ inputs.release_type_detected }}"
            echo "**Framework type:** ${{ inputs.framework_type }}"
            echo "**Browser:** ${{ matrix.browser || 'none' }}"
          } >> $GITHUB_STEP_SUMMARY

          # Export danych do outputs
          echo "test_summary=$(echo "$test_summary" | jq -c '.')" >> $GITHUB_OUTPUT
