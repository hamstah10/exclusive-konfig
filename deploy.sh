#!/bin/bash
set -e

VPS_USER="chiptuningguru1"
VPS_HOST="72.61.80.207"   # <-- deine VPS IP hier eintragen
VPS_PATH="/home/chiptuningguru1/htdocs/ear.chiptuning.guru/"

echo "→ Baue Projekt..."
npm run build

echo "→ Deploye auf VPS..."
rsync -avz --delete dist/ "$VPS_USER@$VPS_HOST:$VPS_PATH"

echo "→ Starte Server auf VPS (falls nicht läuft)..."
ssh "$VPS_USER@$VPS_HOST" "
  export PATH=~/.npm-global/bin:\$PATH
  pm2 describe ear-chiptuning > /dev/null 2>&1 \
    || pm2 start 'serve -s /home/chiptuningguru1/htdocs/ear.chiptuning.guru -l 1122' --name ear-chiptuning
  pm2 save
"

echo "✓ Deploy fertig → ear.chiptuning.guru"
