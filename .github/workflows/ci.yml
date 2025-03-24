name: CI

on:
  push:
    branches: [main, master, develop, feature/*, dev]
    paths-ignore:
      - '**.md'
      - 'docs/**'
      - '.github/ISSUE_TEMPLATE/**'
      - '.vscode/**'
  pull_request:
    paths-ignore:
      - '**.md'
      - 'docs/**'
      - '.github/ISSUE_TEMPLATE/**'
      - '.vscode/**'
  workflow_dispatch:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  setup:
    name: Setup Environment
    uses: ./.github/workflows/reusable-setup.yml
    with:
      node_version: '22.x'
      setup_playwright: false

  lint:
    name: Lint
    needs: [setup]
    uses: ./.github/workflows/reusable-lint.yml
    with:
      cache_keys: ${{ needs.setup.outputs.cache_keys }}
      eslint_check: true
      fix_issues: false
      install_deps: ${{ needs.setup.outputs.install_deps }}
      node_version: ${{ needs.setup.outputs.node_version }}
      prettier_check: true
      stylelint_check: false
      typescript_check: true
      upload_artifacts: true

  test:
    name: Test
    needs: [setup, lint]
    uses: ./.github/workflows/reusable-test.yml
    with:
      cache_keys: ${{ needs.setup.outputs.cache_keys }}
      e2e_tests: ${{ github.event_name != 'pull_request' }}
      node_version: ${{ needs.setup.outputs.node_version }}
      install_deps: ${{ needs.setup.outputs.install_deps }}
      install_playwright: ${{ needs.setup.outputs.install_playwright }}
      smoke_tests: false
      storybook_build: false
      test_matrix: '{"browser": ["chromium", "firefox"]}'
      unit_tests: true
      upload_artifacts: true

  build:
    name: Build
    needs: [setup, lint, test]
    uses: ./.github/workflows/reusable-build.yml
    with:
      analyze_bundle: ${{ github.event_name == 'pull_request' }}
      cache_keys: ${{ needs.setup.outputs.cache_keys }}
      install_deps: ${{ needs.setup.outputs.install_deps }}
      node_version: ${{ needs.setup.outputs.node_version }}
      production_build: true
      upload_artifacts: true

  summary:
    name: Workflow Summary
    needs: [setup, lint, test, build]
    if: always()
    runs-on: ubuntu-latest
    steps:
      - name: 📋 Generate Workflow Summary
        run: |
          # Nagłówek i informacje o workflow
          cat << EOF >> $GITHUB_STEP_SUMMARY
          # 🚀 CI Workflow Summary

          ## 🔍 Informacje o Workflow
          | Kategoria | Wartość |
          |-----------|---------|
          | Branch | \`${{ github.ref_name }}\` |
          | Trigger | \`${{ github.event_name }}\` |
          | Commit | [\`${GITHUB_SHA:0:7}\`](https://github.com/${{ github.repository }}/commit/${{ github.sha }}) |
          | Autor | ${{ github.actor }} |
          | Timestamp | $(date -u '+%Y-%m-%d %H:%M:%S UTC') |

          ## 📊 Wyniki Jobów

          ### Setup ${{ needs.setup.result == 'success' && '✅' || '❌' }}
          \`\`\`json
          ${{ needs.setup.outputs.setup_summary }}
          \`\`\`

          ### Lint ${{ needs.lint.result == 'success' && '✅' || '❌' }}
          \`\`\`json
          ${{ needs.lint.outputs.lint_summary }}
          \`\`\`

          ### Test ${{ needs.test.result == 'success' && '✅' || '❌' }}
          \`\`\`json
          ${{ needs.test.outputs.test_summary }}
          \`\`\`

          ### Build ${{ needs.build.result == 'success' && '✅' || '❌' }}
          \`\`\`json
          ${{ needs.build.outputs.build_summary }}
          \`\`\`
          EOF

          # Status końcowy
          if [[ "${{ needs.lint.result }}" != "failure" && \
                "${{ needs.test.result }}" != "failure" && \
                "${{ needs.build.result }}" != "failure" ]]; then
            echo -e "\n## 📝 Status Końcowy\n### ✅ Wszystkie testy przeszły pomyślnie!" >> $GITHUB_STEP_SUMMARY
          else
            echo -e "\n## 📝 Status Końcowy\n### ❌ Wykryto błędy w:" >> $GITHUB_STEP_SUMMARY
            [[ "${{ needs.lint.result }}" == "failure" ]] && echo "- 🔍 Lint" >> $GITHUB_STEP_SUMMARY
            [[ "${{ needs.test.result }}" == "failure" ]] && echo "- 🧪 Test" >> $GITHUB_STEP_SUMMARY
            [[ "${{ needs.build.result }}" == "failure" ]] && echo "- 🏗️ Build" >> $GITHUB_STEP_SUMMARY
          fi

          # Link do artefaktów
          echo -e "\n## 📦 [Zobacz artefakty buildu](https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }})" >> $GITHUB_STEP_SUMMARY
