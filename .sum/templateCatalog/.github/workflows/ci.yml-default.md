# Reusable workflow for releases; to eject, you can replace this file with
# https://github.com/SebastianWesolowski/SebastianWesolowski/blob/main/.github/workflows/release.yml
name: CI

on:
  push:
    branches:
      - main
      - master
      - develop
      - dev
      - 'feature/*'
  pull_request:
    branches:
      - main
      - master
      - develop
      - dev

# Ensure we don't have multiple release workflows running
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  setup:
    name: Setup
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
      release_type_detected: ${{ needs.setup.outputs.release_type_detected }}
      framework_type: ${{ needs.setup.outputs.framework_type }}

  test:
    name: Test
    needs: [setup, lint]
    if: always()
    uses: ./.github/workflows/reusable-test.yml
    with:
      node_version: ${{ needs.setup.outputs.node_version }}
      unit_tests: false
      e2e_tests: false
      smoke_tests: false
      storybook_build: false
      install_deps: ${{ needs.setup.outputs.install_deps }}
      install_playwright: ${{ needs.setup.outputs.install_playwright }}
      upload_artifacts: true
      cache_keys: ${{ needs.setup.outputs.cache_keys }}
      release_type_detected: ${{ needs.setup.outputs.release_type_detected }}
      framework_type: ${{ needs.setup.outputs.framework_type }}

  build:
    name: Build
    needs: [setup]
    uses: ./.github/workflows/reusable-build.yml
    with:
      analyze_bundle: ${{ github.event_name == 'pull_request' }}
      cache_keys: ${{ needs.setup.outputs.cache_keys }}
      install_deps: ${{ needs.setup.outputs.install_deps }}
      node_version: ${{ needs.setup.outputs.node_version }}
      production_build: false
      upload_artifacts: true
      release_type_detected: ${{ needs.setup.outputs.release_type_detected }}
      framework_type: ${{ needs.setup.outputs.framework_type }}

  debug_variables:
    name: Debug Variables
    needs: [setup, lint, test]
    if: always()
    runs-on: ubuntu-latest
    steps:
      - name: 🔬 Debug variables before release
        run: |
          echo "=== 🔬 Zmienne przekazywane do reusable-release.yml 🔬 ==="

          echo "=== 📋 Inputs ==="
          echo "release_type_detected (detected): '${{ needs.setup.outputs.release_type_detected }}'"
          echo "release_branch: '${{ github.ref_name }}'"

          echo "=== 🔄 Outputs z poprzednich jobów ==="
          echo "node_version: '${{ needs.setup.outputs.node_version }}'"
          echo "install_deps: '${{ needs.setup.outputs.install_deps }}'"
          echo "install_playwright: '${{ needs.setup.outputs.install_playwright }}'"

          echo "=== 🔄 GitHub Context ==="
          echo "github.ref: '${{ github.ref }}'"
          echo "github.ref_name: '${{ github.ref_name }}'"
          echo "github.event_name: '${{ github.event_name }}'"
          echo "github.workflow: '${{ github.workflow }}'"

          if [[ "${{ github.event_name }}" == "pull_request" ]]; then
            echo "github.base_ref: '${{ github.base_ref }}'"
            echo "github.head_ref: '${{ github.head_ref }}'"
          fi

          # Zapisz podsumowanie do GitHub Step Summary
          {
            echo "### 🔬 Debug Variables Summary (main workflow)"
            echo ""
            echo "#### Release Configuration"
            echo "| Variable | Raw Value | Detected Value |"
            echo "| --- | --- | --- |"
            echo "| release_type_detected | x | ${{ needs.setup.outputs.release_type_detected }} |"
            echo "| release_branch | n/a | ${{ github.ref_name }} |"
            echo ""
            echo "#### Outputs from Previous Jobs"
            echo "| Variable | Value |"
            echo "| --- | --- |"
            echo "| node_version | ${{ needs.setup.outputs.node_version }} |"
            echo "| install_deps | ${{ needs.setup.outputs.install_deps }} |"
            echo "| install_playwright | ${{ needs.setup.outputs.install_playwright }} |"
            echo ""
            echo "#### Git Context"
            echo "| Variable | Value |"
            echo "| --- | --- |"
            echo "| github.ref | ${{ github.ref }} |"
            echo "| github.ref_name | ${{ github.ref_name }} |"
            echo "| github.event_name | ${{ github.event_name }} |"
          } >> $GITHUB_STEP_SUMMARY

  release:
    name: Release
    needs: [setup, build]
    if: always()
    uses: ./.github/workflows/reusable-release.yml
    with:
      release_type_detected: ${{ needs.setup.outputs.release_type_detected }}
      release_branch: ${{ github.ref_name }}
      node_version: ${{ needs.setup.outputs.node_version }}
      install_deps: ${{ needs.setup.outputs.install_deps }}
      cache_keys: ${{ needs.setup.outputs.cache_keys }}
      framework_type: ${{ needs.setup.outputs.framework_type }}
    secrets:
      GH_TOKEN: ${{ secrets.GH_TOKEN }}
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}

  summary:
    name: Workflow Summary
    needs: [setup, lint, test, build, release]
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
