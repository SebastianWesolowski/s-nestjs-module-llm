# # Reusable workflow for releases; to eject, you can replace this file with
# # https://github.com/SebastianWesolowski/SebastianWesolowski/blob/main/.github/workflows/release.yml
# name: Pre-Release

# on:
#   push:
#     branches:
#       - dev
#       - develop
#       - feature/*
#   workflow_dispatch:
#     inputs:
#       dry_run:
#         description: 'Perform a dry run (no actual release)'
#         type: boolean
#         default: false
#         required: false

# # Ensure we don't have multiple pre-release workflows running
# concurrency:
#   group: pre-release-${{ github.ref }}
#   cancel-in-progress: false

# jobs:
#   # First run tests to ensure everything is working
#   test:
#     name: Verify Pre-Release
#     uses: ./.github/workflows/reusable-test.yml
#     with:
#       unit_tests: true
#       e2e_tests: false
#       smoke_tests: true
#       upload_artifacts: false

#   # Then perform the pre-release
#   pre-release:
#     name: Pre-Release
#     needs: test
#     if: success()
#     uses: ./.github/workflows/reusable-release.yml
#     with:
#       dry_run: ${{ github.event.inputs.dry_run == 'true' }}
#       pre_release: true
#       release_branch: ${{ github.ref_name }}
#       build_command: 'build:release'
#     secrets:
#       GH_TOKEN: ${{ secrets.GH_TOKEN }}
#       NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
