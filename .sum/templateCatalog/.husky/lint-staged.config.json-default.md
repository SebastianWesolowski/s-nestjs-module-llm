{
  "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix", "jest --bail --findRelatedTests --passWithNoTests"],
  "*.{json,md,yml}": ["prettier --write"]
}
