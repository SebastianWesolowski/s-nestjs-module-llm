name: Build

on:
  workflow_call:
    inputs:
      analyze_bundle:
        description: 'Whether to analyze the bundle size'
        required: false
        type: boolean
        default: false
      cache_keys:
        description: 'The cache key suffix'
        required: false
        type: string
        default: ''
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
      production_build:
        description: 'Whether to create a production build'
        required: false
        type: boolean
        default: true
      upload_artifacts:
        description: 'Whether to upload build artifacts'
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
      build_summary:
        description: 'Summary of build results'
        value: ${{ jobs.build.outputs.build_summary }}

jobs:
  build:
    name: Build Application
    runs-on: ubuntu-latest
    timeout-minutes: 20
    outputs:
      build_summary: ${{ steps.summary.outputs.build_summary }}

    env:
      NODE_ENV: ${{ inputs.production_build && 'production' || 'development' }}
      ANALYZE: ${{ inputs.analyze_bundle && 'true' || 'false' }}

    steps:
      - name: 🔍 inputs
        id: check_inputs
        run: |
          echo "Debugowanie inputów workflow:"
          echo "analyze_bundle: ${{ inputs.analyze_bundle }}"
          echo "cache_keys: ${{ inputs.cache_keys }}"
          echo "install_args: ${{ inputs.install_args }}"
          echo "install_deps: ${{ inputs.install_deps }}"
          echo "node_version: ${{ inputs.node_version }}"
          echo "production_build: ${{ inputs.production_build }}"
          echo "upload_artifacts: ${{ inputs.upload_artifacts }}"
          echo "release_type_detected: ${{ inputs.release_type_detected }}"
          echo "framework_type: ${{ inputs.framework_type }}"
          echo "Parsed cache keys:"
          echo "nextBuild_key: ${{ fromJSON(inputs.cache_keys).nextBuild_key }}"
          echo "deps_key: ${{ fromJSON(inputs.cache_keys).deps_key }}"

      - name: 📝 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 1

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

      - name: 🏗️ Build application
        if: steps.check-cache.outputs.cache_hit != 'true'
        run: ${{ inputs.production_build == true && 'yarn build:prod' || 'yarn build' }}

      - name: 📊 Upload build artifacts
        if: failure() || inputs.upload_artifacts == true
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: |
            ${{ inputs.framework_type == 'next' && format('{0}/.next/', github.workspace) || '' }}
            ${{ inputs.framework_type == 'next' && 'out/' || '' }}
            ${{ inputs.framework_type == 'nest' && format('{0}/dist/', github.workspace) || '' }}
            public/sitemap*.xml
          retention-days: 7
          if-no-files-found: ignore

      - name: 📝 Summary
        id: summary
        run: |
          # Przygotowanie podsumowania
          build_status="✅ Budowanie przebiegło pomyślnie"

          # Sprawdzenie czy budowanie zostało pominięte
          if [[ "${{ steps.check-cache.outputs.cache_hit }}" == "true" ]]; then
            build_status="🚀 Budowanie pominięte - użyto cache"
            additional_info="[Cache] Użyto zapisanej wersji dla ${{ inputs.framework_type }}"
          else
            additional_info="[Build] Wykonano pełny proces budowania"
          fi

          build_summary=$(jq -n \
            --arg title "### Wyniki budowy 📦" \
            --arg env "${{ env.NODE_ENV }}" \
            --arg analyze "${{ env.ANALYZE }}" \
            --arg node "${{ inputs.node_version }}" \
            --arg release_type_detected "${{ inputs.release_type_detected }}" \
            --arg framework_type "${{ inputs.framework_type }}" \
            --arg time "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            --arg duration "$(date +%s)" \
            --arg build_status "$build_status" \
            --arg additional_info "$additional_info" \
            --arg cache_used "${{ steps.check-cache.outputs.cache_hit }}" \
            '{
              markdown: {
                title: $title,
                details: [
                  "🔧 Środowisko: " + $env,
                  "📊 Analiza bundle: " + $analyze,
                  "📦 Wersja Node.js: " + $node,
                  "📌 Typ wydania: " + $release_type_detected,
                  "📚 Typ frameworku: " + $framework_type,
                  "💾 Użyto cache: " + $cache_used,
                  "ℹ️ " + $additional_info
                ],
                status: $build_status
              },
              data: {
                environment: $env,
                analyze_bundle: ($analyze == "true"),
                node_version: $node,
                release_type_detected: $release_type_detected,
                framework_type: $framework_type,
                timestamp: $time,
                duration: $duration,
                cache_used: ($cache_used == "true")
              }
            }')

          # Zapisanie podsumowania do GitHub Step Summary
          {
            echo "$build_summary" | jq -r '.markdown.title'
            echo ""
            echo "#### Szczegóły procesu:"
            echo "$build_summary" | jq -r '.markdown.details[]'
            echo ""
            echo "$build_summary" | jq -r '.markdown.status'
          } >> $GITHUB_STEP_SUMMARY

          # Export danych do outputs
          echo "build_summary=$(echo "$build_summary" | jq -c '.')" >> $GITHUB_OUTPUT
