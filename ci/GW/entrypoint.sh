#!/usr/bin/env bash
set -euo pipefail

tyk_args=(--debug --httpprofile)

tyk_args+=("--conf=/opt/tyk-gateway/tyk.conf")

echo "Installing Tyk..."
cd /opt/tyk-gateway
git config --global --add safe.directory /opt/tyk-gateway

ls
go install

echo "Running Tyk with following arguments:"
echo "${tyk_args[@]}"

"${GOPATH:-}/bin/tyk" "${tyk_args[@]}"
