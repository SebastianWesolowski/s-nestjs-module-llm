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
        run: |
          echo "Debugowanie inputów workflow:"
          echo "analyze_bundle: ${{ inputs.analyze_bundle }}"
          echo "cache_keys: ${{ inputs.cache_keys }}"
          echo "install_args: ${{ inputs.install_args }}"
          echo "install_deps: ${{ inputs.install_deps }}"
          echo "node_version: ${{ inputs.node_version }}"
          echo "production_build: ${{ inputs.production_build }}"
          echo "upload_artifacts: ${{ inputs.upload_artifacts }}"

          echo "Parsed cache keys:"
          echo "build_key: ${{ fromJSON(inputs.cache_keys).build_key }}"
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

      - name: ⚡ Cache build
        uses: actions/cache@v4
        with:
          path: |
            ${{ github.workspace }}/.next/
            ${{ github.workspace }}/out/
          key: ${{ fromJSON(inputs.cache_keys).build_key }}
          restore-keys: ${{ fromJSON(inputs.cache_keys).build_key }}

      - name: 🟢 Setup Node.js ${{ inputs.node_version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node_version }}

      - name: 📦 Install dependencies
        if: inputs.install_deps == 'true'
        run: |
          yarn config set network-timeout 300000
          yarn install ${{ inputs.install_args }} --prefer-offline --no-scripts

      - name: 🏗️ Build application
        run: ${{ inputs.production_build && 'yarn build:prod' || 'yarn build' }}

      - name: 📊 Upload build artifacts
        if: ${{ failure() || inputs.upload_artifacts }}
        uses: actions/upload-artifact@v4
        with:
          name: build-artifacts
          path: |
            .next/
            out/
            public/sitemap*.xml
          retention-days: 7
          if-no-files-found: ignore

      - name: 📝 Summary
        id: summary
        run: |
          # Przygotowanie podsumowania
          build_summary=$(jq -n \
            --arg title "### Wyniki budowy 📦" \
            --arg env "${{ env.NODE_ENV }}" \
            --arg analyze "${{ env.ANALYZE }}" \
            --arg node "${{ inputs.node_version }}" \
            --arg time "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
            --arg duration "$(date +%s)" \
            '{
              markdown: {
                title: $title,
                details: [
                  "🔧 Środowisko: " + $env,
                  "📊 Analiza bundle: " + $analyze,
                  "📦 Wersja Node.js: " + $node
                ],
                status: "✅ Budowanie przebiegło pomyślnie"
              },
              data: {
                environment: $env,
                analyze_bundle: ($analyze == "true"),
                node_version: $node,
                timestamp: $time,
                production_build: ${{ inputs.production_build }},
                duration: $duration
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
