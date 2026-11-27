#!/bin/sh
# Zips the playable game for an itch.io HTML upload. Run: sh tools/build-itch.sh
# Writes voltline-itch.zip in the repo root (git-ignored). index.html must be at the top of the zip.
set -e
cd "$(dirname "$0")/.."
rm -f voltline-itch.zip
zip -qr voltline-itch.zip index.html manifest.webmanifest sw.js levels.json icon-192.png icon-512.png js fonts
echo "Wrote voltline-itch.zip ($(du -h voltline-itch.zip | cut -f1))"
