#!/bin/zsh

# Set environment variables for build
export VITE_SUPABASE_URL="https://olfgwqwvvywhjmxhzmby.supabase.co"
export VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZmd3cXd2dnl3aGpteGh6bWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczOTc0NzQsImV4cCI6MjA1Mjk3MzQ3NH0.j_UD8dZUqSFgHDCus7AVkFhGDzIQw0DCKXJxNijy4mk"

# Build the project
npm run build

# Deploy to GitHub Pages
git add dist -f
git commit -m "Deploy to GitHub Pages"
git push origin main:gh-pages

echo "Deployed to GitHub Pages"