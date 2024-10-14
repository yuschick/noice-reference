#!/bin/sh

set -e

command -v git || apk add --no-cache git

yarn install || { cat /tmp/*/build.log; exit 1; }

HASH_ROUTING=$1 BASE_PATH=$2 BUNDLE_BASE_PATH=$3 DIST_PATH=$4 WORKSPACE_HASH=$5 yarn $6
