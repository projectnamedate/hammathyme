#!/bin/zsh
# Clone and build Brush at the commit the gunfight splat was trained with.
# Brush's latest tagged release (v0.3.0, 2025-09) lags main, so we pin a main commit. Needs rustc >= 1.95.
# usage: scripts/setup_brush.sh [install_dir]   (default ~/src/brush; train.sh reads $BRUSH_DIR)
set -e
BRUSH_COMMIT=1388f74c6fe0236f68ee4915564bf00e9d2e3747
DIR=${1:-$HOME/src/brush}
[ -d "$DIR/.git" ] || git clone https://github.com/ArthurBrussee/brush.git "$DIR"
git -C "$DIR" fetch -q origin
git -C "$DIR" checkout -q "$BRUSH_COMMIT"
(cd "$DIR" && cargo build --release)
echo "brush ready: $DIR/target/release/brush"
