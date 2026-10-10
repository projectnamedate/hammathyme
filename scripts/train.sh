#!/bin/zsh
# Train a splat with Brush on Metal. Every 20th view is held out for eval; eval renders are saved.
# usage: scripts/train.sh <dataset_dir> <run_id>   e.g. scripts/train.sh projects/gunfight-street/dataset/street-v05 street-v05-r01
set -e
DATASET=$1
RUN=$2
OUT=$(cd "$DATASET/.." && pwd)/../splats/$RUN
[ -e "$OUT" ] && { echo "$OUT exists; bump the run id"; exit 1; }
~/src/brush/target/release/brush "$DATASET" \
  --alpha-mode transparent \
  --total-train-iters 30000 \
  --max-splats 3000000 \
  --eval-split-every 20 \
  --eval-every 5000 \
  --eval-save-to-disk \
  --export-every 10000 \
  --export-path "$OUT/"
