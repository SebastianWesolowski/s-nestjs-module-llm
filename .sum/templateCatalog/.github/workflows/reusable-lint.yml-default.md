name: Lint

on:
  workflow_call:
    inputs:
      cache_keys:
        description: 'The cache key suffix'
        required: false
        type: string
        default: ''
      eslint_check:
        description: 'Whether to run ESLint'
        required: false
        type: boolean
        default: true
      fix_issues:
        description: 'Whether to attempt to fix issues automatically'
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
      node_version:
        description: 'Node.js version to use'
        required: true
        type: string
      prettier_check:
        description: 'Whether to run Prettier'
        required: false
        type: boolean
        default: true
      stylelint_check:
        description: 'Whether to run Stylelint'
        required: false
        type: boolean
        default: true
      typescript_check:
        description: 'Whether to run TypeScript type checking'
        required: false
        type: boolean
        default: true
      upload_artifacts:
        description: 'Whether to upload lint artifacts'
        required: false
        type: boolean
        default: true
    outputs:
      lint_summary:
        description: 'Summary of lint results'
        value: ${{ jobs.lint.outputs.lint_summary }}

jobs:
  lint:
    name: Lint Code
    runs-on: ubuntu-latest
    timeout-minutes: 15
    outputs:
      lint_summary: ${{ steps.summary.outputs.lint_summary }}

    steps:
      - name: 🔍 inputs
        run: |
          echo "Debugowanie inputów workflow:"
          echo "cache_keys: ${{ inputs.cache_keys }}"
          echo "eslint_check: ${{ inputs.eslint_check }}"
          echo "fix_issues: ${{ inputs.fix_issues }}"
          echo "install_args: ${{ inputs.install_args }}"
          echo "install_deps: ${{ inputs.install_deps }}"
          echo "node_version: ${{ inputs.node_version }}"
          echo "prettier_check: ${{ inputs.prettier_check }}"
          echo "stylelint_check: ${{ inputs.stylelint_check }}"
          echo "typescript_check: ${{ inputs.typescript_check }}"
          echo "upload_artifacts: ${{ inputs.upload_artifacts }}"

          echo "Parsed cache keys:"
          echo "lint_key: ${{ fromJSON(inputs.cache_keys).lint_key }}"
          echo "deps_key: ${{ fromJSON(inputs.cache_keys).deps_key }}"

      - name: 📝 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: ⚡ Cache lint
        uses: actions/cache@v4
        with:
          path: |
            ${{ github.workspace }}/.stylelintcache
            ${{ github.workspace }}/.eslintcache/
            ${{ github.workspace }}/tsconfig.tsbuildinfo
          key: ${{ fromJSON(inputs.cache_keys).lint_key }}
          restore-keys: |
            ${{ fromJSON(inputs.cache_keys).lint_key }}

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

      - name: 🔍 TypeScript type checking
        if: ${{ inputs.typescript_check }}
        run: yarn lint:typescript:check

      - name: 🔍 ESLint
        if: ${{ inputs.eslint_check && !inputs.fix_issues }}
        run: yarn lint:eslint:check

      - name: 🔧 ESLint (with fixes)
        if: ${{ inputs.eslint_check && inputs.fix_issues }}
        run: yarn lint:eslint:fix

      - name: 🔍 Prettier
        if: ${{ inputs.prettier_check && !inputs.fix_issues }}
        run: yarn lint:prettier:check

      - name: 🔧 Prettier (with fixes)
        if: ${{ inputs.prettier_check && inputs.fix_issues }}
        run: yarn lint:prettier:fix

      - name: 🔍 Stylelint
        if: ${{ inputs.stylelint_check && !inputs.fix_issues }}
        run: yarn lint:style:check

      - name: 🔧 Stylelint (with fixes)
        if: ${{ inputs.stylelint_check && inputs.fix_issues }}
        run: yarn lint:style:fix

      - name: 📊 Upload lint results
        if: ${{ failure() || inputs.upload_artifacts }}
        uses: actions/upload-artifact@v4
        with:
          name: lint-results
          path: |
            .eslintcache/
            .stylelintcache/
            tsconfig.tsbuildinfo
            reports/lint/
            .yarn-error.log
            yarn-debug.log
            npm-debug.log
          retention-days: 7
          if-no-files-found: ignore

      - name: 📝 Summary
        id: summary
        run: |
          # Przygotowanie podsumowania
          lint_summary=$(jq -n \
            --arg title "### Wyniki lintowania 🔍" \
            --arg subtitle "✅ Wykonane sprawdzenia:" \
            --arg fix "${{ inputs.fix_issues }}" \
            --arg node "${{ inputs.node_version }}" \
            --arg time "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            --argjson checks "$(printf '%s\n' "${DETAILS[@]}" | jq -R . | jq -s .)" \
            '{
              markdown: {
                title: $title,
                subtitle: $subtitle,
                details: $checks,
                fix_status: (if $fix == "true" then "🔧 Wykonano automatyczne poprawki" else "" end)
              },
              data: {
                executed_checks: ($checks | map(sub("- "; "")) | join(",")),
                fix_applied: ($fix == "true"),
                node_version: $node,
                timestamp: $time
              }
            }')

          # Zapisanie podsumowania do GitHub Step Summary
          {
            echo "$lint_summary" | jq -r '.markdown.title'
            echo ""
            echo "$lint_summary" | jq -r '.markdown.subtitle'
            echo "$lint_summary" | jq -r '.markdown.details[]'
            if [[ "${{ inputs.fix_issues }}" == "true" ]]; then
              echo ""
              echo "$lint_summary" | jq -r '.markdown.fix_status'
            fi
          } >> $GITHUB_STEP_SUMMARY

          # Export danych do outputs
          echo "lint_summary=$(echo "$lint_summary" | jq -c '.')" >> $GITHUB_OUTPUT
