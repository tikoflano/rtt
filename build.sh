#!/usr/bin/env bash
# Render build script for Race Time Tracker
set -o errexit

# Install Node.js if not present (Render Python buildpack doesn't include it)
if ! command -v node &> /dev/null; then
  echo "Installing Node.js..."
  export NVM_DIR="$HOME/.nvm"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.4/install.sh | bash
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm install 20
  nvm use 20
fi

# Build Angular frontend
echo "Building Angular frontend..."
cd frontend
npm ci
npm run build
cd ..

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Run migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "Build complete!"
