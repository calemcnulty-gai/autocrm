#!/bin/zsh

# Set environment variables for build
export VITE_SUPABASE_URL="https://gukvkyekmmdlmliomxtj.supabase.co"
export VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1a3ZreWVrbW1kbG1saW9teHRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc3NDg3MDYsImV4cCI6MjA1MzMyNDcwNn0.zlEKMxFEFlTBu4ePr_gSVes4s0ZMhTbQe-V9jxiQflg"

# Build the project
npm run build

# Deploy to GitHub Pages
git add dist -f
git commit -m "Deploy to GitHub Pages"
git push origin main:gh-pages

echo "Deployed to GitHub Pages"