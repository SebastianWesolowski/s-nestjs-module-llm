# name: 'Next.js Bundle Analysis'

# on:
#   push:
#     branches:
#       - main
#       - master
#       - develop
#       - dev
#       - feature/*
#   pull_request:
#     branches:
#       - main
#       - master
#       - develop
#       - dev
#       - feature/*
#   workflow_dispatch:

# # Ensure we don't have multiple bundle analysis workflows running for the same branch
# concurrency:
#   group: bundle-analysis-${{ github.ref }}
#   cancel-in-progress: true

# jobs:
#   setup:
#     name: Setup Environment
#     uses: ./.github/workflows/reusable-setup.yml
#     with:
#       install_args: '--frozen-lockfile'

#   analyze:
#     name: Analyze Bundle
#     needs: setup
#     runs-on: ubuntu-latest
#     env:
#       SKIP_ENV_VALIDATION: true
#       ANALYZE: true
#       SKIP_BUILD_PRODUCT_REDIRECTS: 1

#     steps:
#       - name: 📝 Checkout
#         uses: actions/checkout@v4

#       - name: 🟢 Setup Node.js
#         uses: actions/setup-node@v4
#         with:
#           node-version: ${{ needs.setup.outputs.node_version }}
#           cache: 'yarn'

#       - name: 📦 Install dependencies
#         run: yarn install --frozen-lockfile

#       - name: ⚡ Restore Next.js build cache
#         uses: actions/cache@v4
#         id: restore-build-cache
#         with:
#           path: .next/cache
#           key: ${{ runner.os }}-nextjs-bundle-${{ hashFiles('yarn.lock', 'package.json') }}
#           restore-keys: |
#             ${{ runner.os }}-nextjs-bundle-
#             ${{ runner.os }}-nextjs-

#       - name: 🏗️ Build Next.js app with bundle analysis
#         run: yarn build:analyze

#       - name: 📊 Upload bundle analysis
#         uses: actions/upload-artifact@v4
#         with:
#           name: bundle-analysis
#           path: .next/analyze/__bundle_analysis.json
#           retention-days: 30

#       - name: 📥 Download base branch bundle stats
#         uses: dawidd6/action-download-artifact@v8
#         if: github.event_name == 'pull_request'
#         with:
#           workflow: bundle-analysis.yml
#           branch: ${{ github.event.pull_request.base.ref }}
#           path: .next/analyze/base
#           if_no_artifact_found: ignore

#       - name: 📊 Compare with base branch bundle
#         if: github.event_name == 'pull_request'
#         run: |
#           if [ -d ".next/analyze/base" ]; then
#             echo "Comparing bundle with base branch"
#             npx -p nextjs-bundle-analysis compare
#           else
#             echo "No base branch bundle found for comparison"
#           fi

#       - name: 💬 Get comment body
#         id: get-comment-body
#         if: github.event_name == 'pull_request'
#         run: |
#           if [ -f ".next/analyze/__bundle_analysis_comment.txt" ]; then
#             COMMENT_BODY=$(cat .next/analyze/__bundle_analysis_comment.txt)
#             # GitHub Actions requires multiline outputs to be properly escaped
#             COMMENT_BODY="${COMMENT_BODY//'%'/'%25'}"
#             COMMENT_BODY="${COMMENT_BODY//$'\n'/'%0A'}"
#             COMMENT_BODY="${COMMENT_BODY//$'\r'/'%0D'}"
#             echo "body=$COMMENT_BODY" >> $GITHUB_OUTPUT
#           else
#             echo "body=No bundle analysis comment found" >> $GITHUB_OUTPUT
#           fi

#       - name: 🔍 Find Comment
#         uses: peter-evans/find-comment@v3
#         if: github.event_name == 'pull_request'
#         id: find-comment
#         with:
#           issue-number: ${{ github.event.pull_request.number }}
#           body-includes: '<!-- __NEXTJS_BUNDLE -->'

#       - name: 💬 Create or Update Comment
#         uses: peter-evans/create-or-update-comment@v3
#         if: github.event_name == 'pull_request' && steps.get-comment-body.outputs.body != 'No bundle analysis comment found'
#         with:
#           issue-number: ${{ github.event.pull_request.number }}
#           comment-id: ${{ steps.find-comment.outputs.comment-id }}
#           body: ${{ steps.get-comment-body.outputs.body }}
#           edit-mode: ${{ steps.find-comment.outputs.comment-id != 0 && 'replace' || '' }}
